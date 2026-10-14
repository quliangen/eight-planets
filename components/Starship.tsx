
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector2, Vector3, Quaternion, Group, Object3D, MathUtils, DoubleSide, LatheGeometry, Sprite, TextureLoader, SRGBColorSpace, AdditiveBlending } from 'three';
import { Html, Text } from '@react-three/drei';
import { PLANETS, SUN_DATA } from '../constants';
import { EngineFlame } from './EngineFlame';
import { generateStarshipHullTexture } from '../utils/textureGenerator';
import { getSharedGlowTexture } from '../utils/textures';

interface StarshipProps {
  planetRefs: React.MutableRefObject<{ [key: string]: Object3D }>;
  simulationSpeed: number;
  isPaused: boolean;
  onMissionComplete: () => void;
}

// State Machine
type ShipState = 'PLANNING' | 'TRAVELING' | 'ORBITING' | 'LEAVING' | 'COMPLETED';

// --- Flight tuning ---
const MAX_SPEED = 28;            // Cruise speed for long trips
const ORBIT_SPEED = 8;           // Linear speed cap while orbiting (bigger planets)
const ORBIT_ANGULAR_SPEED = 1.5; // Comfortable orbital rate (rad/s) for close/small planets
const APPROACH_DECEL = 8;        // Braking acceleration of the analytic approach profile
// Only dodge the sun when the flight path actually passes through this bubble.
// (Must stay well below Venus' orbit radius of 20, or inner-planet approaches get disturbed.)
const SUN_CLEARANCE = SUN_DATA.size + 6;

// Sightseeing orbit radii that also clear the big moons' orbital paths
const MIN_ORBIT_RADIUS: { [key: string]: number } = {
  jupiter: 14.5, // Ganymede orbits at ~13
  saturn: 13.5,  // Titan orbits at ~12
};

// --- Scratch objects: reused every frame, zero per-frame allocation in the loop ---
const _pos = new Vector3();
const _targetPos = new Vector3();
const _predictPos = new Vector3();
const _entryPoint = new Vector3();
const _dirToPlanet = new Vector3();
const _flatDir = new Vector3();
const _relPos = new Vector3();
const _tangent = new Vector3();
const _outward = new Vector3();
const _dirToEntry = new Vector3();
const _heading = new Vector3();
const _horiz = new Vector3();
const _sunOutward = new Vector3();
const _sunTangent = new Vector3();
const _forward = new Vector3();
const _right = new Vector3();
const _circlePos = new Vector3();
const _lookAt = new Vector3();
const _camPos = new Vector3();
const _camLookTarget = new Vector3();
const _planetPos = new Vector3();
const _obst = new Vector3();
const _bestObstPos = new Vector3();
const _obsOutward = new Vector3();
const _obsTangent = new Vector3();
const _relOrbit = new Vector3();
const _circlePursuit = new Vector3();
const _dummy = new Object3D();
const _orbitAxis = new Vector3();
const _tiltQ = new Quaternion();
const _spinQ = new Quaternion();
const _X_AXIS = new Vector3(1, 0, 0);

const TWO_PI = Math.PI * 2;

// Three Raptor engines in a triangle (radius 0.18 from the tail axis)
const ENGINE_POSITIONS: Array<[number, number, number]> = [
  [0.18, 0, 0],
  [-0.09, 0, 0.156],
  [-0.09, 0, -0.156],
];

// Ogive nose profile (radius, height) — a smooth Starship-like taper, lathed around Y.
// Starts at the hull radius (0.35) and ends at a point, total height 0.76.
const NOSE_PROFILE: Array<[number, number]> = [
  [0.35, 0], [0.348, 0.08], [0.34, 0.18], [0.325, 0.28], [0.30, 0.38],
  [0.265, 0.48], [0.22, 0.57], [0.165, 0.65], [0.10, 0.71], [0.04, 0.75], [0, 0.76],
];

export const Starship: React.FC<StarshipProps> = ({ planetRefs, simulationSpeed, isPaused, onMissionComplete }) => {
  const groupRef = useRef<Group>(null);
  const shipModelRef = useRef<Group>(null);
  const aftFlapLRef = useRef<Group>(null);
  const aftFlapRRef = useRef<Group>(null);
  const navRedRef = useRef<Sprite>(null);
  const navGreenRef = useRef<Sprite>(null);
  const strobeRef = useRef<Sprite>(null);

  // Procedural textures & nose geometry (built once)
  const hullTexture = useMemo(() => {
    const t = new TextureLoader().load(generateStarshipHullTexture());
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);
  // 共享辉光贴图（模块级单例，不要 dispose）
  const glowTexture = getSharedGlowTexture();
  const noseGeometry = useMemo(
    () => new LatheGeometry(NOSE_PROFILE.map(([r, y]) => new Vector2(r, y)), 32),
    []
  );

  // 星舰每次任务都会挂载/卸载，手动创建的资源需要释放
  useEffect(() => {
    return () => {
      hullTexture.dispose();
      noseGeometry.dispose();
    };
  }, [hullTexture, noseGeometry]);

  // HUD state (throttled — the refs below hold the live values)
  const [currentSpeedDisplay, setCurrentSpeedDisplay] = useState(0);
  const [missionProgress, setMissionProgress] = useState({ current: 0, total: 0, targetName: '' });

  // Logic refs (no re-renders)
  const stateRef = useRef<ShipState>('PLANNING');
  const initializedRef = useRef(false);
  const completedFiredRef = useRef(false);
  const missionQueueRef = useRef<string[]>([]);
  const missionTotalRef = useRef(0);
  const currentTargetIdRef = useRef<string | null>(null);

  // Movement refs
  const currentSpeedRef = useRef(0);
  const orbitAngleRef = useRef(0);
  const orbitRadiusRef = useRef(15);
  const totalOrbitTraveledRef = useRef(0);
  const orbitEntryTimerRef = useRef(0); // >0 while blending onto the analytic orbit circle
  const orbitTargetRadiusRef = useRef(15);
  const camDistRef = useRef(16);
  const camLookRef = useRef(new Vector3());
  const leavingTimeRef = useRef(0);
  const speedHudTimerRef = useRef(0);
  const smoothHeadingRef = useRef(new Vector3(0, 0, 1)); // Low-pass filtered steering target
  const hazardSmoothRef = useRef(0);                     // Smoothed "dodging something" factor

  // Effective orbital angular rate of a planet (frozen while paused)
  const getAngularRate = (id: string) => {
    if (isPaused) return 0;
    const p = PLANETS.find(x => x.id === id);
    return p ? p.speed * simulationSpeed : 0;
  };

  // World position of a planet, predicted t seconds into the future.
  // Exact: rotates the current world position around the (possibly inclined)
  // orbit axis by omega*t — mirrors Planet's orbitGroup.rotation.y advance
  // inside the inclination wrapper, and matches the actual orbit direction.
  const predictPlanetPos = (id: string, t: number, out: Vector3) => {
    const obj = planetRefs.current[id];
    if (!obj) return out;
    obj.getWorldPosition(out);
    const omega = getAngularRate(id);
    if (omega === 0 || t <= 0) return out;
    const incl = PLANETS.find(x => x.id === id)?.orbitInclination || 0;
    _orbitAxis.set(0, 1, 0);
    if (incl !== 0) {
      _orbitAxis.applyQuaternion(_tiltQ.setFromAxisAngle(_X_AXIS, incl));
    }
    out.applyQuaternion(_spinQ.setFromAxisAngle(_orbitAxis, omega * t));
    return out;
  };

  // Route: pick 5 distinct random planets, then visit them nearest-neighbor
  // starting from Earth — keeps the tour varied but kills zig-zag sun crossings.
  const generateMission = () => {
    const pool = PLANETS
      // parent 检查：过滤掉已卸载（如冥王星被关闭）的残留引用
      .filter(p => p.id !== 'mercury' && p.id !== 'earth' && planetRefs.current[p.id]?.parent)
      .map(p => p.id);

    // Fisher-Yates shuffle, take 5
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const picked = pool.slice(0, 5);

    const ordered: string[] = [];
    const from = new Vector3();
    const candidatePos = new Vector3();
    const earthObj = planetRefs.current['earth'];
    if (earthObj) earthObj.getWorldPosition(from);

    while (picked.length > 0) {
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < picked.length; i++) {
        const obj = planetRefs.current[picked[i]];
        if (!obj) continue;
        obj.getWorldPosition(candidatePos);
        const d = candidatePos.distanceToSquared(from);
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      }
      const next = picked.splice(bestIdx, 1)[0];
      ordered.push(next);
      const obj = planetRefs.current[next];
      if (obj) obj.getWorldPosition(from);
    }

    ordered.push('earth'); // Return home
    return ordered;
  };

  // Safe but close orbit radius per planet (also clears rings and big moons)
  const getSafeOrbitRadius = (id: string) => {
    const p = PLANETS.find(x => x.id === id);
    if (!p) return 12;
    const base = p.hasRings ? p.size * 2.5 + 2.0 : p.size * 2.8 + 2.0;
    return Math.max(base, MIN_ORBIT_RADIUS[id] || 0);
  };

  const announceTarget = (id: string) => {
    const pName = PLANETS.find(p => p.id === id)?.name || id;
    setMissionProgress({
      current: missionTotalRef.current - missionQueueRef.current.length,
      total: missionTotalRef.current,
      targetName: pName,
    });
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 1 / 30); // Clamp: a background tab must not teleport the ship

    // --- 0. INITIALIZATION: Spawn above Earth ---
    if (!initializedRef.current) {
      const earthObj = planetRefs.current['earth'];
      if (earthObj) {
        earthObj.getWorldPosition(_pos);
        if (_pos.lengthSq() > 1) { // Wait until Earth has a valid position
          _pos.y += 10.0;
          _pos.x += 10.0;
          groupRef.current.position.copy(_pos);
          initializedRef.current = true;
          stateRef.current = 'PLANNING';
        }
      }
      return;
    }

    // --- 1. STATE MACHINE ---

    // PLANNING: Build the route once, face the first destination (never the sun)
    if (stateRef.current === 'PLANNING') {
      missionQueueRef.current = generateMission();
      missionTotalRef.current = missionQueueRef.current.length;

      const firstId = missionQueueRef.current[0];
      const firstObj = firstId ? planetRefs.current[firstId] : null;
      if (firstObj) {
        firstObj.getWorldPosition(_lookAt);
        _dummy.position.copy(groupRef.current.position);
        _dummy.lookAt(_lookAt);
        groupRef.current.quaternion.copy(_dummy.quaternion);
        // Seed the camera look-target so the first frames are stable
        _forward.set(0, 0, 1).applyQuaternion(groupRef.current.quaternion);
        camLookRef.current.copy(groupRef.current.position).addScaledVector(_forward, 10);
        smoothHeadingRef.current.copy(_forward);
      }
      stateRef.current = 'LEAVING';
      leavingTimeRef.current = 0;
      return;
    }

    // LEAVING: Short straight transit to clear the spawn point / recover from target loss
    if (stateRef.current === 'LEAVING') {
      leavingTimeRef.current += dt;

      // Accelerate to cruise
      currentSpeedRef.current += (MAX_SPEED - currentSpeedRef.current) * 1.5 * dt;

      // Move strictly forward
      _forward.set(0, 0, 1).applyQuaternion(groupRef.current.quaternion);
      groupRef.current.position.addScaledVector(_forward, currentSpeedRef.current * dt);

      // Banking reset
      if (shipModelRef.current) {
        shipModelRef.current.rotation.z = MathUtils.lerp(shipModelRef.current.rotation.z, 0, 1 - Math.exp(-2 * dt));
      }

      if (leavingTimeRef.current > 1.0) {
        if (missionQueueRef.current.length > 0) {
          const nextId = missionQueueRef.current.shift()!;
          currentTargetIdRef.current = nextId;
          announceTarget(nextId);
          // Seed the heading filter with the current nose direction
          _forward.set(0, 0, 1).applyQuaternion(groupRef.current.quaternion);
          smoothHeadingRef.current.copy(_forward);
          stateRef.current = 'TRAVELING';
        } else {
          stateRef.current = 'COMPLETED';
        }
      }
    }

    // COMPLETED: Mission done — fire the callback exactly once
    if (stateRef.current === 'COMPLETED') {
      if (!completedFiredRef.current) {
        completedFiredRef.current = true;
        onMissionComplete();
      }
      return;
    }

    // Resolve the current target. Bail out cleanly if it was unmounted mid-flight
    // (e.g. Pluto toggled off) — refs are not cleaned up on unmount.
    const tId = currentTargetIdRef.current;
    let targetObj: Object3D | null = null;
    if (tId) {
      const obj = planetRefs.current[tId];
      if (obj && obj.parent) {
        targetObj = obj;
        obj.getWorldPosition(_targetPos);
      }
    }
    if (!targetObj) {
      if (stateRef.current === 'TRAVELING' || stateRef.current === 'ORBITING') {
        currentTargetIdRef.current = null;
        stateRef.current = 'LEAVING';
        leavingTimeRef.current = 0;
      }
      return;
    }

    _pos.copy(groupRef.current.position);

    // TRAVELING: Fly an intercept course to the orbit entry point
    if (stateRef.current === 'TRAVELING') {
      const targetRadius = getSafeOrbitRadius(tId!);

      // Intercept course: aim where the planet WILL be (2 fixed-point iterations
      // converge well below one frame of prediction error)
      _predictPos.copy(_targetPos);
      for (let i = 0; i < 2; i++) {
        const flightTime = _pos.distanceTo(_predictPos) / Math.max(currentSpeedRef.current, 8);
        predictPlanetPos(tId!, flightTime, _predictPos);
      }

      // Orbit entry point: near side of the predicted position, on the orbit circle
      _dirToPlanet.subVectors(_predictPos, _pos).normalize();
      _flatDir.set(_dirToPlanet.x, 0, _dirToPlanet.z);
      if (_flatDir.lengthSq() < 1e-8) _flatDir.set(1, 0, 0); else _flatDir.normalize();
      _entryPoint.copy(_predictPos).addScaledVector(_flatDir, -targetRadius);
      const distToEntry = _pos.distanceTo(_entryPoint);

      // Geometry vs the planet RIGHT NOW (capture is physical, not predicted)
      _relPos.set(_pos.x - _targetPos.x, 0, _pos.z - _targetPos.z);
      const radialDist = Math.max(_relPos.length(), 1e-4);
      _tangent.set(-_relPos.z / radialDist, 0, _relPos.x / radialDist);
      _forward.set(0, 0, 1).applyQuaternion(groupRef.current.quaternion);

      // Analytic braking: v = v_orbit + sqrt(2·a·d), capped at cruise speed.
      // Inside 3 units of the entry point, match the orbit speed exactly (parking
      // burn) so the insertion itself is jolt-free.
      const orbitLinearSpeed = Math.min(ORBIT_SPEED, ORBIT_ANGULAR_SPEED * targetRadius);
      let brakeSpeed = orbitLinearSpeed + Math.sqrt(2 * APPROACH_DECEL * Math.max(distToEntry - 1.5, 0));
      if (distToEntry < 3) brakeSpeed = orbitLinearSpeed;
      const targetSpeed = Math.min(MAX_SPEED, brakeSpeed);
      currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * (1 - Math.exp(-2.5 * dt));

      // Capture only when radius, heading, altitude AND speed all line up —
      // otherwise keep flying a parking circle until they do (no insertion jolt)
      const headingAligned = _forward.dot(_tangent) > 0.6;
      const inPlane = Math.abs(_pos.y - _targetPos.y) < 3;
      const speedMatched = currentSpeedRef.current < orbitLinearSpeed + 2;

      if (Math.abs(radialDist - targetRadius) < 2 && headingAligned && inPlane && speedMatched) {
        stateRef.current = 'ORBITING';
        orbitRadiusRef.current = radialDist;
        orbitTargetRadiusRef.current = targetRadius;
        orbitEntryTimerRef.current = 1.2;
        orbitAngleRef.current = Math.atan2(_relPos.z, _relPos.x);
        totalOrbitTraveledRef.current = 0;
      } else {
        // --- Smooth steering ---
        // Far field: pursue the moving entry point
        _dirToEntry.subVectors(_entryPoint, _pos).normalize();

        // Near field: circle-pursuit law — fly the orbit tangent, nudged in/out by
        // the signed radius error. Always well-defined (the old dirToEntry/tangent
        // lerp could collapse to a near-zero vector and flip the heading randomly),
        // and it settles onto the ring instead of hunting around the entry point.
        _outward.copy(_relPos).divideScalar(radialDist);
        const radialErr = targetRadius - radialDist;
        _circlePursuit.copy(_tangent)
          .addScaledVector(_outward, MathUtils.clamp(radialErr * 0.25, -0.75, 0.75))
          .normalize();

        // Blend far -> near purely on distance (smoothstep, no hard switch)
        const nearW = MathUtils.smoothstep(1 - (radialDist - targetRadius) / (targetRadius * 2.5), 0, 1);
        _heading.copy(_dirToEntry).lerp(_circlePursuit, nearW);

        // Vertical correction: settle into the planet's plane
        _heading.y += MathUtils.clamp((_targetPos.y - _pos.y) * 0.1, -0.35, 0.35);
        _heading.normalize();

        // Hazard steering: anything that bends the heading also sharpens the turn rate
        let hazard = false;

        // Sun avoidance: only when the heading ray actually passes through the sun
        // bubble (closest-approach test), with weight proportional to how close it cuts
        const sunDist = Math.hypot(_pos.x, _pos.z);
        let dodge = 0;
        if (sunDist < SUN_CLEARANCE) {
          dodge = 1; // Already inside: get out sideways
        } else {
          const along = -(_pos.x * _heading.x + _pos.z * _heading.z); // Ray parameter of closest approach
          if (along > 0) {
            const closest2 = _pos.x * _pos.x + _pos.z * _pos.z - along * along;
            if (closest2 < SUN_CLEARANCE * SUN_CLEARANCE) {
              dodge = 0.8 * (1 - Math.sqrt(closest2) / SUN_CLEARANCE);
            }
          }
        }
        if (dodge > 0) {
          _sunOutward.set(_pos.x, 0, _pos.z).normalize();
          _sunTangent.set(-_sunOutward.z, 0, _sunOutward.x);
          if (_sunTangent.dot(_dirToEntry) < 0) _sunTangent.negate(); // Around the side facing the target
          _horiz.set(_heading.x, 0, _heading.z);
          if (_horiz.lengthSq() > 1e-8) {
            _horiz.normalize().lerp(_sunTangent, dodge).normalize();
            _heading.set(_horiz.x, _heading.y, _horiz.z).normalize();
          }
          hazard = true;
        }

        // Planet avoidance: never fly THROUGH another planet on the way.
        // Ray-test the heading against a clearance bubble around every planet
        // except the current target, and steer around the most threatening one.
        let planetDodge = 0;
        for (const p of PLANETS) {
          if (p.id === tId) continue; // The target is meant to be approached
          const obj = planetRefs.current[p.id];
          if (!obj || !obj.parent) continue;
          obj.getWorldPosition(_planetPos);
          _obst.subVectors(_planetPos, _pos);
          const distSq = _obst.lengthSq();
          // Bubble: rocky planets -> body margin; ringed planets -> outer ring edge + margin
          const clearance = p.hasRings ? p.size * 2.8 + 1.0 : p.size * 2.0 + 1.0;
          if (distSq < clearance * clearance) {
            planetDodge = 1; // Inside the bubble: emergency break-out
            _bestObstPos.copy(_planetPos);
            break;
          }
          const along = _obst.dot(_heading);
          if (along < 0 || along > 100) continue; // Behind us, or too far out to matter yet
          const closest2 = distSq - along * along;
          if (closest2 < clearance * clearance) {
            // Deeper penetration + closer proximity = stronger dodge
            const w = (1 - Math.sqrt(closest2) / clearance) * MathUtils.clamp(1.5 - along / 60, 0, 1);
            if (w > planetDodge) {
              planetDodge = w;
              _bestObstPos.copy(_planetPos);
            }
          }
        }
        if (planetDodge > 0) {
          _obsOutward.subVectors(_pos, _bestObstPos);
          _obsOutward.y = 0;
          if (_obsOutward.lengthSq() < 1e-8) _obsOutward.set(1, 0, 0); else _obsOutward.normalize();
          _obsTangent.set(-_obsOutward.z, 0, _obsOutward.x);
          // Around the side we're already turning toward (use the FILTERED heading
          // so this decision can't flip back and forth frame to frame)
          if (_obsTangent.dot(smoothHeadingRef.current) < 0) _obsTangent.negate();
          _horiz.set(_heading.x, 0, _heading.z);
          if (_horiz.lengthSq() > 1e-8) {
            _horiz.normalize().lerp(_obsTangent, Math.min(planetDodge * 0.95, 1)).normalize();
            _heading.set(_horiz.x, _heading.y, _horiz.z).normalize();
          }
          hazard = true;
        }

        // Low-pass filter the heading target — this is what kills the visible
        // twitches when obstacles engage/disengage or the entry point drifts
        if (smoothHeadingRef.current.dot(_heading) < -0.9) {
          smoothHeadingRef.current.copy(_heading); // ~180° flip: snap instead of lerping through zero
        } else {
          smoothHeadingRef.current.lerp(_heading, 1 - Math.exp(-(hazard ? 10 : 7) * dt)).normalize();
        }
        hazardSmoothRef.current += ((hazard ? 1 : 0) - hazardSmoothRef.current) * (1 - Math.exp(-(hazard ? 8 : 2) * dt));

        _dummy.position.copy(_pos);
        _lookAt.copy(_pos).add(smoothHeadingRef.current);
        _dummy.lookAt(_lookAt);

        // Turn rate eases in continuously with proximity (no hard steps),
        // plus up to +3 while dodging something
        const turnSpeed = 2.0 + 5.0 * MathUtils.smoothstep(1 - distToEntry / 60, 0, 1) + hazardSmoothRef.current * 3.0;
        groupRef.current.quaternion.slerp(_dummy.quaternion, 1 - Math.exp(-turnSpeed * dt));

        // Move strictly forward along the ship's current orientation
        _forward.set(0, 0, 1).applyQuaternion(groupRef.current.quaternion);
        groupRef.current.position.addScaledVector(_forward, currentSpeedRef.current * dt);

        // Bank into the turn (max ~60 degrees), measured against the filtered heading
        _right.set(1, 0, 0).applyQuaternion(groupRef.current.quaternion);
        const turnAmount = _right.dot(smoothHeadingRef.current);
        if (shipModelRef.current) {
          const targetBank = turnAmount * Math.PI / 3;
          shipModelRef.current.rotation.z = MathUtils.lerp(shipModelRef.current.rotation.z, targetBank, 1 - Math.exp(-3 * dt));
        }
      }
    }

    // ORBITING: Circle the planet for sightseeing
    if (stateRef.current === 'ORBITING') {
      const orbitLinearSpeed = Math.min(ORBIT_SPEED, ORBIT_ANGULAR_SPEED * orbitRadiusRef.current);
      currentSpeedRef.current += (orbitLinearSpeed - currentSpeedRef.current) * (1 - Math.exp(-2.0 * dt));

      const angularSpeed = currentSpeedRef.current / orbitRadiusRef.current;
      const angleDelta = angularSpeed * dt;
      orbitAngleRef.current += angleDelta;
      totalOrbitTraveledRef.current += angleDelta;

      // Settle onto the ideal orbit radius (runs until converged, no time cap)
      orbitRadiusRef.current += (orbitTargetRadiusRef.current - orbitRadiusRef.current) * (1 - Math.exp(-2 * dt));

      _circlePos.set(
        _targetPos.x + Math.cos(orbitAngleRef.current) * orbitRadiusRef.current,
        _targetPos.y,
        _targetPos.z + Math.sin(orbitAngleRef.current) * orbitRadiusRef.current
      );

      // Blend the physical trajectory onto the analytic circle first, then lock on —
      // this is what makes capture look like a graceful insertion instead of a teleport
      if (orbitEntryTimerRef.current > 0) {
        orbitEntryTimerRef.current -= dt;
        groupRef.current.position.lerp(_circlePos, 1 - Math.exp(-4 * dt));
        if (orbitEntryTimerRef.current <= 0) {
          // Seamless handoff: the lerp chases a moving circle point, so it always
          // trails behind a little. Adopt the ship's ACTUAL orbital phase now, so
          // switching to the analytic circle is position-exact (no end-of-blend jump).
          _relOrbit.set(
            groupRef.current.position.x - _targetPos.x, 0,
            groupRef.current.position.z - _targetPos.z
          );
          if (_relOrbit.lengthSq() > 1e-8) {
            orbitAngleRef.current = Math.atan2(_relOrbit.z, _relOrbit.x);
          }
        }
      } else {
        groupRef.current.position.copy(_circlePos);
      }

      // Look along the orbit tangent — the lookahead scales with the radius so the
      // target point never sits right on top of the ship (that caused heading wobble)
      const futureAngle = orbitAngleRef.current + MathUtils.clamp(2.5 / orbitRadiusRef.current, 0.12, 0.45);
      _lookAt.set(
        _targetPos.x + Math.cos(futureAngle) * orbitRadiusRef.current,
        _targetPos.y,
        _targetPos.z + Math.sin(futureAngle) * orbitRadiusRef.current
      );
      _dummy.position.copy(groupRef.current.position);
      _dummy.lookAt(_lookAt);
      groupRef.current.quaternion.slerp(_dummy.quaternion, 1 - Math.exp(-6 * dt));

      // Keep the heading filter glued to the current nose direction while orbiting,
      // so the steering picks up seamlessly on departure (no snap when switching state)
      _forward.set(0, 0, 1).applyQuaternion(groupRef.current.quaternion);
      smoothHeadingRef.current.copy(_forward);

      // Bank into the orbit
      if (shipModelRef.current) {
        shipModelRef.current.rotation.z = MathUtils.lerp(shipModelRef.current.rotation.z, -Math.PI / 4, 1 - Math.exp(-3 * dt));
      }

      // Departure: Jupiter/Saturn orbit 1 full lap and leave on the 2nd;
      // the others orbit 2 laps and leave on the 3rd. After the windup laps,
      // leave when the CCW tangent points at where the next target WILL be on
      // arrival. If we just missed the window, loosen it after one extra lap
      // instead of waiting a full circle every time.
      const orbitWindup = (tId === 'jupiter' || tId === 'saturn') ? Math.PI * 2 : Math.PI * 4;
      if (totalOrbitTraveledRef.current > orbitWindup) {
        if (missionQueueRef.current.length === 0) {
          stateRef.current = 'COMPLETED';
        } else {
          const nextId = missionQueueRef.current[0];
          const nextObj = planetRefs.current[nextId];
          let shouldLeave = true; // Fallback if the next target cannot be read
          if (nextObj && nextObj.parent) {
            nextObj.getWorldPosition(_predictPos);
            const flightTime = _predictPos.distanceTo(_targetPos) / MAX_SPEED;
            predictPlanetPos(nextId, flightTime, _predictPos);
            const dx = _predictPos.x - _targetPos.x;
            const dz = _predictPos.z - _targetPos.z;
            if (Math.hypot(dx, dz) > 1e-3) {
              // Angle on this orbit whose tangent points straight at the target
              const targetAngle = Math.atan2(-dx, dz);
              const a = ((orbitAngleRef.current % TWO_PI) + TWO_PI) % TWO_PI;
              const forwardDelta = (targetAngle - a + TWO_PI * 2) % TWO_PI;
              const waited = totalOrbitTraveledRef.current - orbitWindup;
              shouldLeave = forwardDelta < (waited > TWO_PI ? 0.6 : 0.12);
            }
          }
          if (shouldLeave) {
            const shiftedId = missionQueueRef.current.shift()!;
            currentTargetIdRef.current = shiftedId;
            announceTarget(shiftedId);
            stateRef.current = 'TRAVELING';
          }
        }
      }
    }

    // --- HUD speed readout (throttled to ~7Hz to limit re-renders) ---
    speedHudTimerRef.current += dt;
    const displayVal = Math.round(currentSpeedRef.current * 1000);
    if (Math.abs(displayVal - currentSpeedDisplay) > 100 && speedHudTimerRef.current > 0.15) {
      speedHudTimerRef.current = 0;
      setCurrentSpeedDisplay(displayVal);
    }

    // --- Dynamic details: nav lights blink, aft flaps articulate with the bank ---
    const navT = state.clock.elapsedTime;
    if (navRedRef.current) navRedRef.current.material.opacity = 0.55 + 0.35 * Math.sin(navT * 2.0);
    if (navGreenRef.current) navGreenRef.current.material.opacity = 0.55 + 0.35 * Math.sin(navT * 2.0 + Math.PI);
    if (strobeRef.current) {
      // Double-flash strobe pattern every 1.4s
      const ph = navT % 1.4;
      strobeRef.current.material.opacity = (ph < 0.06 || (ph > 0.18 && ph < 0.24)) ? 1 : 0.04;
    }
    if (shipModelRef.current) {
      const bank = shipModelRef.current.rotation.z;
      if (aftFlapLRef.current) aftFlapLRef.current.rotation.z = 0.12 + bank * 0.45;
      if (aftFlapRRef.current) aftFlapRRef.current.rotation.z = -0.12 + bank * 0.45;
    }

    // --- CAMERA (third person, frame-rate independent smoothing) ---
    const targetCamDist = stateRef.current === 'ORBITING' ? 35 : 18;
    camDistRef.current = MathUtils.lerp(camDistRef.current, targetCamDist, 1 - Math.exp(-1.0 * dt));

    _forward.set(0, 0, 1).applyQuaternion(groupRef.current.quaternion);
    const heightOffset = MathUtils.lerp(5, 12, (camDistRef.current - 16) / (35 - 16));
    _camPos.copy(groupRef.current.position).addScaledVector(_forward, -camDistRef.current);
    _camPos.y += heightOffset;
    state.camera.position.lerp(_camPos, 1 - Math.exp(-5 * dt));

    // Smoothed look target kills camera jitter during hard turns
    _camLookTarget.copy(groupRef.current.position).addScaledVector(_forward, 10);
    camLookRef.current.lerp(_camLookTarget, 1 - Math.exp(-8 * dt));
    state.camera.lookAt(camLookRef.current);
  });

  const tName = missionProgress.targetName;

  return (
    <>
      {/* REALISTIC STARSHIP MODEL */}
      <group ref={groupRef} scale={[1.8, 1.8, 1.8]}>

        {/* Speedometer & Mission HUD */}
        <Html position={[2, 1, 0]} center transform sprite zIndexRange={[100, 0]}>
             <div className="flex flex-col items-start pointer-events-none select-none gap-2">

                {/* Velocity */}
                <div className="flex flex-col items-start">
                    <div className="bg-cyan-900/40 border-l-2 border-cyan-400 backdrop-blur-sm px-3 py-1 mb-1 transform skew-x-[-10deg]">
                       <span className="text-[10px] text-cyan-200 font-mono tracking-widest uppercase">Velocity</span>
                       <div className="text-xl font-bold text-white font-mono leading-none flex items-baseline gap-1">
                          {currentSpeedDisplay.toLocaleString()}
                          <span className="text-[10px] text-cyan-400">KM/H</span>
                       </div>
                    </div>
                    <div className="flex gap-0.5 mt-0.5">
                       <div className={`h-1 w-2 rounded-sm ${currentSpeedRef.current > 5 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                       <div className={`h-1 w-2 rounded-sm ${currentSpeedRef.current > 10 ? 'bg-green-400' : 'bg-gray-700'}`}></div>
                       <div className={`h-1 w-2 rounded-sm ${currentSpeedRef.current > 15 ? 'bg-yellow-400' : 'bg-gray-700'}`}></div>
                       <div className={`h-1 w-2 rounded-sm ${currentSpeedRef.current > 20 ? 'bg-red-500' : 'bg-gray-700'}`}></div>
                    </div>
                </div>

                {/* Mission Status */}
                {missionProgress.total > 0 && (
                   <div className="bg-blue-900/40 border-l-2 border-blue-400 backdrop-blur-sm px-3 py-1 transform skew-x-[-10deg]">
                      <span className="text-[10px] text-blue-200 font-mono tracking-widest uppercase">Mission Log</span>
                      <div className="text-sm font-bold text-white leading-tight mt-0.5">
                         {tName.split(' ')[0]}
                         <span className="text-[10px] ml-1 text-blue-300 opacity-80">
                           ({missionProgress.current}/{missionProgress.total})
                         </span>
                      </div>
                   </div>
                )}
             </div>
        </Html>

        {/* Inner group for banking animations (Rolling) */}
        <group ref={shipModelRef}>
            {/* Rotate entire ship mesh 90deg X so Y-up geometry faces Z-forward movement */}
            <group rotation={[Math.PI / 2, 0, 0]}>

                {/* 1. Main Hull — half TPS heat-shield tiles, half brushed steel with markings */}
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.35, 0.35, 1.6, 32]} />
                  <meshPhysicalMaterial
                    map={hullTexture}
                    color="#ffffff"
                    metalness={0.85}
                    roughness={0.42}
                    clearcoat={0.5}
                    clearcoatRoughness={0.3}
                  />
                </mesh>

                {/* NAME LABEL 1 (Top) - Vertical Layout */}
                <group position={[0, 0, 0.36]}>
                     <Text
                        color="white" // White Glowing Text
                        fontSize={0.28} // Larger size
                        anchorX="center"
                        anchorY="middle"
                        rotation={[0, 0, 0]}
                        lineHeight={1}
                        outlineWidth={0.02} // Glowing Outline
                        outlineColor="#00FFFF" // Cyan Glow
                     >
                       {'小\n豆\n子\n号'}
                     </Text>
                </group>

                {/* NAME LABEL 2 (Bottom) - Vertical Layout - Rotated to face downwards/outwards */}
                <group position={[0, 0, -0.36]} rotation={[0, Math.PI, 0]}>
                     <Text
                        color="white" // White Glowing Text
                        fontSize={0.28} // Larger size
                        anchorX="center"
                        anchorY="middle"
                        rotation={[0, 0, 0]}
                        lineHeight={1}
                        outlineWidth={0.02} // Glowing Outline
                        outlineColor="#00FFFF" // Cyan Glow
                     >
                       {'小\n豆\n子\n号'}
                     </Text>
                </group>

                {/* 2. Nose — smooth ogive (lathe), shares the hull texture */}
                <mesh position={[0, 0.8, 0]} geometry={noseGeometry}>
                  <meshPhysicalMaterial
                    map={hullTexture}
                    color="#ffffff"
                    metalness={0.85}
                    roughness={0.42}
                    clearcoat={0.5}
                    clearcoatRoughness={0.3}
                  />
                </mesh>

                {/* 4. Aft flaps — articulated, pivot around their root with the bank angle */}
                <group ref={aftFlapLRef} position={[-0.33, -0.55, 0]}>
                   <mesh position={[-0.14, 0, 0]}>
                      <boxGeometry args={[0.28, 0.55, 0.06]} />
                      <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.45} />
                   </mesh>
                </group>
                <group ref={aftFlapRRef} position={[0.33, -0.55, 0]}>
                   <mesh position={[0.14, 0, 0]}>
                      <boxGeometry args={[0.28, 0.55, 0.06]} />
                      <meshStandardMaterial color="#1f2937" metalness={0.7} roughness={0.45} />
                   </mesh>
                </group>

                {/* 5. Engines — 3 Raptor nozzles in a triangle */}
                <group position={[0, -0.85, 0]}>
                   {/* Thrust mount plate */}
                   <mesh position={[0, 0.02, 0]}>
                      <cylinderGeometry args={[0.28, 0.31, 0.08, 24]} />
                      <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
                   </mesh>
                   {ENGINE_POSITIONS.map((pos, i) => (
                      <group key={i} position={pos}>
                         {/* Nozzle bell (flared, open at the bottom) */}
                         <mesh position={[0, -0.1, 0]}>
                            <cylinderGeometry args={[0.07, 0.13, 0.28, 16, 1, true]} />
                            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.35} side={DoubleSide} />
                         </mesh>
                         {/* Throat ring */}
                         <mesh position={[0, 0.03, 0]}>
                            <cylinderGeometry args={[0.075, 0.075, 0.06, 16]} />
                            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.5} />
                         </mesh>
                      </group>
                   ))}
                </group>

                {/* 6. Engine Flames — one plume per nozzle, merging into a single big flame */}
                {ENGINE_POSITIONS.map((pos, i) => (
                   <EngineFlame key={i} speedRef={currentSpeedRef} maxSpeed={MAX_SPEED} position={[pos[0], -1.09, pos[2]]} scale={1.25} />
                ))}

                {/* 7. Navigation lights — red port / green starboard at the flaps, white strobe on the nose tip */}
                <sprite ref={navRedRef} position={[-0.5, -0.55, 0]} scale={[0.16, 0.16, 1]}>
                   <spriteMaterial map={glowTexture} color="#ff3030" transparent opacity={0.8} depthWrite={false} blending={AdditiveBlending} />
                </sprite>
                <sprite ref={navGreenRef} position={[0.5, -0.55, 0]} scale={[0.16, 0.16, 1]}>
                   <spriteMaterial map={glowTexture} color="#30ff60" transparent opacity={0.8} depthWrite={false} blending={AdditiveBlending} />
                </sprite>
                <sprite ref={strobeRef} position={[0, 1.6, 0]} scale={[0.2, 0.2, 1]}>
                   <spriteMaterial map={glowTexture} color="#ffffff" transparent opacity={0.8} depthWrite={false} blending={AdditiveBlending} />
                </sprite>
            </group>
        </group>
      </group>
    </>
  );
};

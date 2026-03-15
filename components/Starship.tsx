
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group, Object3D, AdditiveBlending, DoubleSide, Quaternion, MathUtils, Mesh } from 'three';
import { Trail, Html, Text } from '@react-three/drei';
import { PLANETS } from '../constants';

interface StarshipProps {
  planetRefs: React.MutableRefObject<{ [key: string]: Object3D }>;
  onMissionComplete: () => void;
}

// Updated State Machine
type ShipState = 'PLANNING' | 'TRAVELING' | 'ORBITING' | 'LEAVING' | 'COMPLETED';

export const Starship: React.FC<StarshipProps> = ({ planetRefs, onMissionComplete }) => {
  const groupRef = useRef<Group>(null);
  const shipModelRef = useRef<Group>(null);
  
  // Logic State
  const [currentSpeedDisplay, setCurrentSpeedDisplay] = useState(0);
  const [missionProgress, setMissionProgress] = useState({ current: 0, total: 0, targetName: '' });
  
  // Refs for loop variables to avoid re-renders
  const stateRef = useRef<ShipState>('PLANNING');
  const initializedRef = useRef(false);
  const missionQueueRef = useRef<string[]>([]);
  const currentTargetIdRef = useRef<string | null>(null);
  
  // Movement calculation refs
  const currentSpeedRef = useRef(0);
  const velocityRef = useRef(new Vector3());
  const orbitAngleRef = useRef(0);
  const orbitRadiusRef = useRef(15);
  const totalOrbitTraveledRef = useRef(0);
  const camDistRef = useRef(16); 
  
  // Leaving State Refs
  const leavingTimeRef = useRef(0);
  const lookTargetRef = useRef(new Vector3());
  
  // Smooth rotation
  const MAX_SPEED = 35; // Slightly faster for long trips
  const ORBIT_SPEED = 10; // Slower speed for orbiting
  
  // Helper to generate mission route
  const generateMission = () => {
     // Exclude Sun, Mercury (too hot/close), and ensure we have candidates
     const candidates = PLANETS
        .filter(p => p.id !== 'mercury')
        .map(p => p.id);
        
     const mission: string[] = [];
     let lastPlanet = 'earth'; // Start logic from earth (conceptually)

     // Pick 5 random planets
     for (let i = 0; i < 5; i++) {
        let next: string;
        let attempts = 0;
        // Find a candidate that is not the same as the last one
        do {
            next = candidates[Math.floor(Math.random() * candidates.length)];
            attempts++;
        } while (next === lastPlanet && attempts < 10);
        
        mission.push(next);
        lastPlanet = next;
     }

     // Finally, return to Earth
     mission.push('earth');
     
     return mission;
  };

  // Helper to calculate a safe but close orbit radius for each planet
  const getSafeOrbitRadius = (id: string) => {
     const p = PLANETS.find(x => x.id === id);
     if (!p) return 12; // Fallback
     
     if (p.hasRings) {
         return p.size * 2.5 + 2.0; 
     }
     return p.size * 2.8 + 2.0; 
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // --- 0. INITIALIZATION: Spawn at Earth ---
    if (!initializedRef.current) {
      const earthObj = planetRefs.current['earth'];
      if (earthObj) {
        const startPos = new Vector3();
        earthObj.getWorldPosition(startPos);
        
        if (startPos.lengthSq() > 1) { // Wait until Earth has valid pos
             startPos.y += 10.0; // Start high
             startPos.x += 10.0; 
             groupRef.current.position.copy(startPos);
             groupRef.current.lookAt(new Vector3(0, 0, 0)); 
             velocityRef.current.set(0, 0, 0);
             initializedRef.current = true;
             stateRef.current = 'PLANNING';
        }
      }
      return; 
    }

    // --- 1. STATE MACHINE ---
    
    // PLANNING: Generate the queue once
    if (stateRef.current === 'PLANNING') {
       missionQueueRef.current = generateMission();
       stateRef.current = 'LEAVING'; // Start by "Leaving" spawn point to go to first target
       // Setup initial velocity away from spawn
       const forward = new Vector3(0, 0, 1).applyQuaternion(groupRef.current.quaternion).normalize();
       velocityRef.current.copy(forward).multiplyScalar(10);
       leavingTimeRef.current = 0;
       return;
    }

    // LEAVING: Fly straight along the tangent (or initial vector)
    // Also acts as the "Transition" state between planets
    if (stateRef.current === 'LEAVING') {
       leavingTimeRef.current += delta;
       
       // Accelerate to cruise
       currentSpeedRef.current += (MAX_SPEED - currentSpeedRef.current) * 1.5 * delta;
       
       // Move along velocity vector
       const forward = velocityRef.current.clone().normalize();
       velocityRef.current.copy(forward).multiplyScalar(currentSpeedRef.current);
       groupRef.current.position.add(velocityRef.current.clone().multiplyScalar(delta));
       
       // Rotate Ship
       if (velocityRef.current.lengthSq() > 0.001) {
          const lookPos = groupRef.current.position.clone().add(velocityRef.current);
          const dummyObj = new Object3D();
          dummyObj.position.copy(groupRef.current.position);
          dummyObj.lookAt(lookPos);
          groupRef.current.quaternion.slerp(dummyObj.quaternion, 6 * delta);
       }
       
       // Banking reset
       if (shipModelRef.current) {
           shipModelRef.current.rotation.z = MathUtils.lerp(shipModelRef.current.rotation.z, 0, delta * 2);
       }

       // After flying away briefly (to clear orbit/spawn), select next target
       if (leavingTimeRef.current > 1.5) {
          // Check if we have a destination
          if (missionQueueRef.current.length > 0) {
             const nextId = missionQueueRef.current.shift()!;
             currentTargetIdRef.current = nextId;
             
             // Update HUD text
             const pName = PLANETS.find(p => p.id === nextId)?.name || nextId;
             setMissionProgress(prev => ({ 
                 current: 6 - missionQueueRef.current.length, // 5 steps + 1 return
                 total: 6,
                 targetName: pName
             }));
             
             stateRef.current = 'TRAVELING';
          } else {
             stateRef.current = 'COMPLETED';
          }
       }
    }
    
    // COMPLETED: Mission Done
    if (stateRef.current === 'COMPLETED') {
        // Trigger callback once then stop
        onMissionComplete();
        return;
    }

    // Common Target Position Logic
    let targetObj: Object3D | null = null;
    let targetPos = new Vector3();
    const tId = currentTargetIdRef.current;
    
    if (tId && planetRefs.current[tId]) {
      targetObj = planetRefs.current[tId];
      targetObj.getWorldPosition(targetPos);
    } else if (stateRef.current === 'TRAVELING') {
        // Target lost or invalid? Skip
        stateRef.current = 'LEAVING';
        return;
    }
    
    const currentPos = groupRef.current.position.clone();
    
    // TRAVELING: Fly towards the orbit entry point
    if (stateRef.current === 'TRAVELING' && targetObj) {
      const targetRadius = getSafeOrbitRadius(tId!);
      const distToPlanet = currentPos.distanceTo(targetPos);
      
      let entryPoint = targetPos.clone();
      if (distToPlanet > targetRadius) {
          const dirToPlanet = new Vector3().subVectors(targetPos, currentPos).normalize();
          // Calculate tangent angle
          const alpha = Math.asin(Math.min(1, targetRadius / distToPlanet));
          // Rotate left to enter counter-clockwise orbit
          const tangentDir = dirToPlanet.clone().applyAxisAngle(new Vector3(0, 1, 0), alpha);
          const tangentDist = Math.cos(alpha) * distToPlanet;
          entryPoint = currentPos.clone().add(tangentDir.multiplyScalar(tangentDist));
          entryPoint.y = targetPos.y; // Keep it flat
      } else {
          // Fallback if too close
          const flatDir = new Vector3(currentPos.x - targetPos.x, 0, currentPos.z - targetPos.z).normalize();
          entryPoint = targetPos.clone().add(flatDir.multiplyScalar(targetRadius));
      }
      
      const distToEntry = currentPos.distanceTo(entryPoint);

      // Decelerate
      let targetSpeed = MAX_SPEED;
      if (distToEntry < 40) {
          const t = distToEntry / 40.0;
          targetSpeed = MathUtils.lerp(ORBIT_SPEED, MAX_SPEED, t);
      }
      
      currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * 2.0 * delta;

      if (distToEntry < 8) {
         // Arrived
         stateRef.current = 'ORBITING';
         orbitRadiusRef.current = targetRadius;
         
         const relativePos = new Vector3().subVectors(currentPos, targetPos);
         orbitAngleRef.current = Math.atan2(relativePos.z, relativePos.x);
         totalOrbitTraveledRef.current = 0;
      } else {
         // Steering
         const desiredVelocity = new Vector3().subVectors(entryPoint, currentPos).normalize().multiplyScalar(currentSpeedRef.current);
         const steering = new Vector3().subVectors(desiredVelocity, velocityRef.current);
         
         // Limit steering force for smooth turns
         let maxForce = 25.0; 
         if (distToEntry < 20) maxForce = 50.0; // Turn sharper when close to avoid missing
         if (steering.length() > maxForce) {
             steering.normalize().multiplyScalar(maxForce);
         }
         
         velocityRef.current.add(steering.multiplyScalar(delta));
         
         // Enforce speed limit
         if (velocityRef.current.length() > currentSpeedRef.current) {
             velocityRef.current.normalize().multiplyScalar(currentSpeedRef.current);
         }
         
         groupRef.current.position.add(velocityRef.current.clone().multiplyScalar(delta));
         
         // Rotate Ship
         if (velocityRef.current.lengthSq() > 0.001) {
            const lookPos = currentPos.clone().add(velocityRef.current);
            const dummyObj = new Object3D();
            dummyObj.position.copy(currentPos);
            dummyObj.lookAt(lookPos);
            groupRef.current.quaternion.slerp(dummyObj.quaternion, 6 * delta);
         }
         
         // Bank based on turning
         if (shipModelRef.current) {
            const forward = new Vector3(0, 0, 1).applyQuaternion(groupRef.current.quaternion).normalize();
            const right = new Vector3(-1, 0, 0).applyQuaternion(groupRef.current.quaternion).normalize();
            const turnDot = velocityRef.current.clone().normalize().dot(right);
            const targetBank = turnDot * Math.PI / 2.5; 
            shipModelRef.current.rotation.z = MathUtils.lerp(shipModelRef.current.rotation.z, targetBank, delta * 4);
         }
      }
    }

    // ORBITING: Circle the planet
    if (stateRef.current === 'ORBITING' && targetObj) {
       currentSpeedRef.current += (ORBIT_SPEED - currentSpeedRef.current) * 2.0 * delta;

       const angularSpeed = currentSpeedRef.current / orbitRadiusRef.current;
       const angleDelta = angularSpeed * delta;
       
       orbitAngleRef.current += angleDelta;
       totalOrbitTraveledRef.current += angleDelta;

       const nextX = targetPos.x + Math.cos(orbitAngleRef.current) * orbitRadiusRef.current;
       const nextZ = targetPos.z + Math.sin(orbitAngleRef.current) * orbitRadiusRef.current;
       const nextY = targetPos.y; 

       const nextPos = new Vector3(nextX, nextY, nextZ);
       
       // Update velocity for smooth transition out of orbit
       velocityRef.current.subVectors(nextPos, groupRef.current.position).divideScalar(delta);
       
       groupRef.current.position.copy(nextPos);
       
       // Look along tangent
       const futureAngle = orbitAngleRef.current + 0.1;
       const lookX = targetPos.x + Math.cos(futureAngle) * orbitRadiusRef.current;
       const lookZ = targetPos.z + Math.sin(futureAngle) * orbitRadiusRef.current;
       const lookY = targetPos.y; 
       
       const lookAtPos = new Vector3(lookX, lookY, lookZ);
       
       const dummyObj = new Object3D();
       dummyObj.position.copy(nextPos);
       dummyObj.lookAt(lookAtPos);
       groupRef.current.quaternion.slerp(dummyObj.quaternion, 8 * delta);

       // Bank
       if (shipModelRef.current) {
           shipModelRef.current.rotation.z = MathUtils.lerp(shipModelRef.current.rotation.z, -Math.PI / 4, delta * 3);
       }

       // Exit condition: ~1 full orbit (plus a bit to clear entry point)
       if (totalOrbitTraveledRef.current > Math.PI * 2.2) {
          stateRef.current = 'LEAVING';
          leavingTimeRef.current = 0;
       }
    }

    // Update Speed Display
    const displayVal = Math.round(currentSpeedRef.current * 1000);
    if (Math.abs(displayVal - currentSpeedDisplay) > 100) {
        setCurrentSpeedDisplay(displayVal);
    }

    // --- CAMERA LOGIC (Third Person) ---
    const targetCamDist = stateRef.current === 'ORBITING' ? 35 : 18;
    camDistRef.current = MathUtils.lerp(camDistRef.current, targetCamDist, delta * 1.0);

    const shipForward = new Vector3(0, 0, 1).applyQuaternion(groupRef.current.quaternion).normalize();
    const heightOffset = MathUtils.lerp(5, 12, (camDistRef.current - 16) / (35 - 16));
    
    const camOffset = shipForward.clone().multiplyScalar(-camDistRef.current).add(new Vector3(0, heightOffset, 0));
    const desiredCamPos = groupRef.current.position.clone().add(camOffset);
    
    state.camera.position.lerp(desiredCamPos, 0.08);
    
    const desiredLookTarget = groupRef.current.position.clone().add(shipForward.multiplyScalar(10));
    if (lookTargetRef.current.lengthSq() === 0) {
        lookTargetRef.current.copy(desiredLookTarget);
    } else {
        lookTargetRef.current.lerp(desiredLookTarget, 0.1);
    }
    state.camera.lookAt(lookTargetRef.current);
  });

  const tId = currentTargetIdRef.current;
  const tName = missionProgress.targetName;

  return (
    <>
      {/* REALISTIC STARSHIP MODEL */}
      <group ref={groupRef} scale={[1.8, 1.8, 1.8]}>
        
        {/* Speedometer & Mission HUD */}
        <Html position={[2.5, 1.5, 0]} center transform sprite zIndexRange={[100, 0]}>
             <div className="flex flex-col items-start pointer-events-none select-none gap-3 relative">
                {/* Decorative HUD Elements */}
                <div className="absolute -left-4 -top-4 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg"></div>
                <div className="absolute -right-4 -bottom-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg"></div>
                
                {/* Velocity */}
                <div className="flex flex-col items-start relative overflow-hidden rounded-sm border border-cyan-500/30 bg-black/40 backdrop-blur-md p-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(6,182,212,0.05)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
                    
                    <div className="flex items-center gap-2 mb-1">
                       <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
                       <span className="text-[10px] text-cyan-300 font-mono tracking-[0.2em] uppercase">Velocity</span>
                    </div>
                    
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 font-mono leading-none flex items-baseline gap-1 drop-shadow-md">
                       {currentSpeedDisplay.toLocaleString()} 
                       <span className="text-xs text-cyan-400 font-bold tracking-widest">KM/S</span>
                    </div>
                    
                    {/* Speed Bar */}
                    <div className="flex gap-1 mt-2 w-full">
                       {[...Array(10)].map((_, i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-sm transition-colors duration-300 ${currentSpeedRef.current > i * 3.5 ? (i > 7 ? 'bg-red-500 shadow-[0_0_5px_#ef4444]' : i > 4 ? 'bg-yellow-400 shadow-[0_0_5px_#facc15]' : 'bg-cyan-400 shadow-[0_0_5px_#22d3ee]') : 'bg-gray-800'}`}></div>
                       ))}
                    </div>
                </div>

                {/* Mission Status */}
                {missionProgress.total > 0 && (
                   <div className="flex flex-col items-start border border-blue-500/30 bg-black/40 backdrop-blur-md p-2.5 rounded-sm shadow-[0_0_15px_rgba(59,130,246,0.2)] min-w-[160px]">
                      <div className="flex justify-between w-full items-center mb-1">
                         <span className="text-[9px] text-blue-300 font-mono tracking-[0.2em] uppercase">Target</span>
                         <span className="text-[9px] text-blue-400 font-mono bg-blue-900/50 px-1.5 py-0.5 rounded">
                           {missionProgress.current} / {missionProgress.total}
                         </span>
                      </div>
                      <div className="text-lg font-bold text-white tracking-wider flex items-center gap-2">
                         <svg className="w-4 h-4 text-blue-400 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" strokeDasharray="16 16" />
                            <circle cx="12" cy="12" r="4" />
                         </svg>
                         {tName.split(' ')[0]} 
                      </div>
                   </div>
                )}
                
                {/* State Indicator */}
                <div className="flex items-center gap-2 px-2 py-1 bg-black/40 border border-white/10 rounded-sm">
                   <div className={`w-1.5 h-1.5 rounded-full ${stateRef.current === 'ORBITING' ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : stateRef.current === 'TRAVELING' ? 'bg-blue-400 shadow-[0_0_8px_#60a5fa]' : 'bg-yellow-400 shadow-[0_0_8px_#facc15]'}`}></div>
                   <span className="text-[9px] text-gray-300 font-mono tracking-widest uppercase">{stateRef.current}</span>
                </div>
             </div>
        </Html>

        {/* Inner group for banking animations (Rolling) */}
        <group ref={shipModelRef}>
            {/* Rotate entire ship mesh 90deg X so Y-up geometry faces Z-forward movement */}
            <group rotation={[Math.PI / 2, 0, 0]}>
                
                {/* 1. Main Hull */}
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.35, 0.35, 1.6, 32]} />
                  <meshPhysicalMaterial 
                    color="#e2e8f0" 
                    metalness={0.9} 
                    roughness={0.2} 
                    clearcoat={1.0}
                    clearcoatRoughness={0.1}
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

                {/* 2. Nose Cone */}
                <mesh position={[0, 1.15, 0]}>
                  <coneGeometry args={[0.35, 0.7, 32]} />
                  <meshPhysicalMaterial 
                    color="#e2e8f0" 
                    metalness={0.9} 
                    roughness={0.2} 
                    clearcoat={1.0}
                  />
                </mesh>

                {/* 3. Forward Flaps */}
                <group position={[0, 1.0, 0]}>
                   <mesh position={[-0.32, 0, 0]} rotation={[0, 0, 0.2]}>
                      <boxGeometry args={[0.2, 0.3, 0.05]} />
                      <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
                   </mesh>
                   <mesh position={[0.32, 0, 0]} rotation={[0, 0, -0.2]}>
                      <boxGeometry args={[0.2, 0.3, 0.05]} />
                      <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
                   </mesh>
                </group>

                {/* 4. Aft Flaps */}
                <group position={[0, -0.6, 0]}>
                   <mesh position={[-0.45, 0, 0]} rotation={[0, 0, 0.1]}>
                      <boxGeometry args={[0.3, 0.6, 0.08]} />
                      <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
                   </mesh>
                   <mesh position={[0.45, 0, 0]} rotation={[0, 0, -0.1]}>
                      <boxGeometry args={[0.3, 0.6, 0.08]} />
                      <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
                   </mesh>
                </group>

                {/* 5. Engines */}
                <group position={[0, -0.85, 0]}>
                   <mesh position={[0, 0, 0]}>
                      <cylinderGeometry args={[0.25, 0.2, 0.1, 16]} />
                      <meshStandardMaterial color="#111" />
                   </mesh>
                   <mesh position={[0.1, -0.1, 0]}>
                       <cylinderGeometry args={[0.06, 0.08, 0.2, 8]} />
                       <meshStandardMaterial color="#222" />
                   </mesh>
                   <mesh position={[-0.1, -0.1, 0]}>
                       <cylinderGeometry args={[0.06, 0.08, 0.2, 8]} />
                       <meshStandardMaterial color="#222" />
                   </mesh>
                   <mesh position={[0, -0.1, 0.12]}>
                       <cylinderGeometry args={[0.06, 0.08, 0.2, 8]} />
                       <meshStandardMaterial color="#222" />
                   </mesh>
                </group>

                {/* 6. Raptor Engine Flame */}
                <mesh position={[0, -1.6, 0]}>
                  <cylinderGeometry args={[0.15, 0.0, 1.4, 16, 1, true]} /> 
                  <meshBasicMaterial 
                    color="#8B5CF6" 
                    transparent 
                    opacity={0.4} 
                    depthWrite={false} 
                    blending={AdditiveBlending}
                  />
                </mesh>
                <mesh position={[0, -1.4, 0]}>
                  <cylinderGeometry args={[0.1, 0.0, 1.0, 16, 1, true]} /> 
                  <meshBasicMaterial 
                    color="#06b6d4" 
                    transparent 
                    opacity={0.6} 
                    depthWrite={false} 
                    blending={AdditiveBlending}
                  />
                </mesh>
                 <mesh position={[0, -1.1, 0]}>
                  <cylinderGeometry args={[0.06, 0.0, 0.5, 8, 1, true]} /> 
                  <meshBasicMaterial 
                    color="#ffffff" 
                    transparent 
                    opacity={0.9} 
                    depthWrite={false} 
                    blending={AdditiveBlending}
                  />
                </mesh>
                
                <pointLight position={[0, -1, 0]} color="#06b6d4" distance={5} intensity={4} />
            </group>

            {/* TRAIL */}
            <group position={[0, 0, -1.2]}>
              <Trail width={0.4} length={6} color="#06b6d4" attenuation={(t) => t * t}>
                <mesh visible={false}><boxGeometry args={[0.1, 0.1, 0.1]} /></mesh>
              </Trail>
            </group>
        </group>
      </group>
    </>
  );
};

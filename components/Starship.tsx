
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
  const totalMissionCountRef = useRef(0);
  
  // Movement calculation refs
  const currentSpeedRef = useRef(0);
  const orbitAngleRef = useRef(0);
  const orbitRadiusRef = useRef(15);
  const totalOrbitTraveledRef = useRef(0);
  const camDistRef = useRef(16); 
  
  // Leaving/Targeting State Refs
  const exitVectorRef = useRef(new Vector3());
  const leavingTimeRef = useRef(0);
  const entryPointRef = useRef<Vector3 | null>(null); // New: Store fixed entry point
  
  // Smooth rotation
  const MAX_SPEED = 28; // Slightly faster for long trips
  const ORBIT_SPEED = 8; // Slower speed for orbiting
  
  // Helper to generate mission route: Counter-Clockwise Sweep
  const generateMission = () => {
     // 1. Get Earth's Angle
     const earthObj = planetRefs.current['earth'];
     if (!earthObj) return [];

     const earthPos = new Vector3();
     earthObj.getWorldPosition(earthPos);
     
     // Calculate angle in X-Z plane (0 to 2PI)
     let earthAngle = Math.atan2(earthPos.z, earthPos.x);
     if (earthAngle < 0) earthAngle += Math.PI * 2;

     // 2. Get all other planets
     const candidates = Object.keys(planetRefs.current).filter(id => id !== 'earth' && id !== 'sun');
     
     const planetsWithAngles = candidates.map(id => {
        const obj = planetRefs.current[id];
        const pos = new Vector3();
        obj.getWorldPosition(pos);
        
        let angle = Math.atan2(pos.z, pos.x);
        if (angle < 0) angle += Math.PI * 2;
        
        // Calculate angular distance CCW from Earth
        // (Target - Earth + 2PI) % 2PI
        let angleDiff = (angle - earthAngle + Math.PI * 2) % (Math.PI * 2);
        
        return { id, angleDiff };
     });

     // 3. Sort by angleDiff (Smallest angle diff means next in CCW orbit)
     planetsWithAngles.sort((a, b) => a.angleDiff - b.angleDiff);

     const route = planetsWithAngles.map(p => p.id);
     
     // 4. Finally return to Earth
     route.push('earth');
     
     return route;
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
             // Determine Earth's orbital tangent to start flying "with the flow"
             const earthOrbitAngle = Math.atan2(startPos.z, startPos.x);
             // Tangent for CCW orbit is -Z, +X relative to radius
             // A simple way: look at a point slightly ahead in orbit
             const nextX = Math.cos(earthOrbitAngle + 0.1) * Math.sqrt(startPos.x*startPos.x + startPos.z*startPos.z);
             const nextZ = Math.sin(earthOrbitAngle + 0.1) * Math.sqrt(startPos.x*startPos.x + startPos.z*startPos.z);
             
             // Initial Position: Slightly above Earth
             const initialPos = startPos.clone();
             initialPos.y += 5.0; 
             initialPos.x = startPos.x * 1.05; // Slightly outside
             initialPos.z = startPos.z * 1.05;

             groupRef.current.position.copy(initialPos);
             
             // Face the tangent direction
             groupRef.current.lookAt(new Vector3(nextX, initialPos.y, nextZ));

             // Only visible once positioned
             if (shipModelRef.current) shipModelRef.current.visible = true;

             initializedRef.current = true;
             stateRef.current = 'PLANNING';
        } else {
             // Hide until positioned
             if (shipModelRef.current) shipModelRef.current.visible = false;
        }
      }
      return; 
    }

    // --- 1. STATE MACHINE ---
    
    // PLANNING: Generate the queue once
    if (stateRef.current === 'PLANNING') {
       const route = generateMission();
       if (route.length > 0) {
           missionQueueRef.current = route;
           totalMissionCountRef.current = route.length;
           stateRef.current = 'LEAVING'; 
           
           // Setup initial exit vector: Just fly forward from where we are
           const forward = new Vector3(0, 0, 1).applyQuaternion(groupRef.current.quaternion).normalize();
           exitVectorRef.current.copy(forward);
           leavingTimeRef.current = 0;
           entryPointRef.current = null; // Reset
       } else {
           stateRef.current = 'COMPLETED';
       }
       return;
    }

    // LEAVING: Fly straight along the tangent (or initial vector)
    // Also acts as the "Transition" state between planets
    if (stateRef.current === 'LEAVING') {
       leavingTimeRef.current += delta;
       
       // Accelerate to cruise
       currentSpeedRef.current += (MAX_SPEED - currentSpeedRef.current) * 1.5 * delta;
       
       // Move along exit vector
       const moveVec = exitVectorRef.current.clone().multiplyScalar(currentSpeedRef.current * delta);
       groupRef.current.position.add(moveVec);
       
       // Banking reset
       if (shipModelRef.current) {
           shipModelRef.current.rotation.z = MathUtils.lerp(shipModelRef.current.rotation.z, 0, delta * 2);
       }

       // After flying away briefly (to clear orbit/spawn), select next target
       if (leavingTimeRef.current > 1.5) { // Increased time to fly clear
          // Check if we have a destination
          if (missionQueueRef.current.length > 0) {
             const nextId = missionQueueRef.current.shift()!;
             currentTargetIdRef.current = nextId;
             
             // Update HUD text
             const pName = PLANETS.find(p => p.id === nextId)?.name || nextId;
             setMissionProgress(prev => ({ 
                 current: totalMissionCountRef.current - missionQueueRef.current.length, 
                 total: totalMissionCountRef.current,
                 targetName: pName
             }));
             
             stateRef.current = 'TRAVELING';
             entryPointRef.current = null; // Prepare to calculate new entry
          } else {
             stateRef.current = 'COMPLETED';
          }
       }
    }
    
    // COMPLETED: Mission Done
    if (stateRef.current === 'COMPLETED') {
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
        stateRef.current = 'LEAVING';
        return;
    }
    
    const currentPos = groupRef.current.position.clone();
    
    // TRAVELING: Fly towards the CALCULATED tangent entry point
    if (stateRef.current === 'TRAVELING' && targetObj) {
      const targetRadius = getSafeOrbitRadius(tId!);
      
      // --- ENTRY POINT CALCULATION (Run Once) ---
      if (!entryPointRef.current) {
          const vecToPlanet = new Vector3().subVectors(targetPos, currentPos);
          // Calculate a "Right" vector relative to approach to enter CCW orbit tangentially
          // For a CCW orbit, the tangent on the "Right" side (relative to approach) aligns with the approach vector.
          const up = new Vector3(0, 1, 0);
          const dir = vecToPlanet.clone().normalize();
          const right = new Vector3().crossVectors(dir, up).normalize();
          
          // Tangent Entry Point: Planet Center + (RightVector * OrbitRadius)
          // This means we fly to the "edge" of the orbit, not the planet center.
          const offset = right.multiplyScalar(targetRadius);
          const entry = new Vector3().addVectors(targetPos, offset);
          
          entryPointRef.current = entry;
      }

      const entryPoint = entryPointRef.current!;
      const distToEntry = currentPos.distanceTo(entryPoint);

      // Decelerate smoothly as we approach the injection point
      let targetSpeed = MAX_SPEED;
      if (distToEntry < 40) targetSpeed = ORBIT_SPEED * 1.5;
      if (distToEntry < 10) targetSpeed = ORBIT_SPEED;
      
      currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * 2.0 * delta;

      if (distToEntry < 2) {
         // --- ARRIVAL & INJECTION ---
         stateRef.current = 'ORBITING';
         orbitRadiusRef.current = targetRadius;
         
         // Calculate the angle we actually arrived at relative to the planet
         const relativePos = new Vector3().subVectors(currentPos, targetPos);
         orbitAngleRef.current = Math.atan2(relativePos.z, relativePos.x);
         totalOrbitTraveledRef.current = 0;
      } else {
         // --- MOVE TOWARDS TANGENT POINT ---
         const moveDir = new Vector3().subVectors(entryPoint, currentPos).normalize();
         groupRef.current.position.add(moveDir.multiplyScalar(currentSpeedRef.current * delta));
         
         // Smooth rotation towards target
         const lookPos = currentPos.clone().add(moveDir);
         const slerpSpeed = distToEntry < 10 ? 4 * delta : 2 * delta; // Faster turn when close
         
         const dummyObj = new Object3D();
         dummyObj.position.copy(currentPos);
         dummyObj.lookAt(lookPos);
         groupRef.current.quaternion.slerp(dummyObj.quaternion, slerpSpeed);
         
         if (shipModelRef.current) {
            shipModelRef.current.rotation.z = MathUtils.lerp(shipModelRef.current.rotation.z, 0, delta * 2);
         }
      }
    }

    // ORBITING: Circle the planet
    if (stateRef.current === 'ORBITING' && targetObj) {
       currentSpeedRef.current += (ORBIT_SPEED - currentSpeedRef.current) * 2.0 * delta;

       const angularSpeed = currentSpeedRef.current / orbitRadiusRef.current;
       const angleDelta = angularSpeed * delta; // Positive means "Left-turning" orbit (CCW)
       
       orbitAngleRef.current += angleDelta;
       totalOrbitTraveledRef.current += angleDelta;

       const nextX = targetPos.x + Math.cos(orbitAngleRef.current) * orbitRadiusRef.current;
       const nextZ = targetPos.z + Math.sin(orbitAngleRef.current) * orbitRadiusRef.current;
       const nextY = targetPos.y; 

       const nextPos = new Vector3(nextX, nextY, nextZ);
       
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

       // Bank into the turn
       if (shipModelRef.current) {
           shipModelRef.current.rotation.z = MathUtils.lerp(shipModelRef.current.rotation.z, Math.PI / 4, delta * 3);
       }

       // Exit condition: ~1 full orbit
       if (totalOrbitTraveledRef.current > Math.PI * 2.2) {
          stateRef.current = 'LEAVING';
          
          // Determine tangential exit vector naturally
          const forward = new Vector3(0, 0, 1).applyQuaternion(groupRef.current.quaternion).normalize();
          exitVectorRef.current.copy(forward);
          leavingTimeRef.current = 0;
          entryPointRef.current = null;
       }
    }

    // Update Speed Display
    const displayVal = Math.round(currentSpeedRef.current * 1000);
    if (Math.abs(displayVal - currentSpeedDisplay) > 100) {
        setCurrentSpeedDisplay(displayVal);
    }

    // --- CAMERA LOGIC (Third Person) ---
    // Smooth transitions for camera distance
    const targetCamDist = stateRef.current === 'ORBITING' ? 35 : 18;
    camDistRef.current = MathUtils.lerp(camDistRef.current, targetCamDist, delta * 1.0);

    const shipForward = new Vector3(0, 0, 1).applyQuaternion(groupRef.current.quaternion).normalize();
    const heightOffset = MathUtils.lerp(5, 12, (camDistRef.current - 16) / (35 - 16));
    
    // Camera trails behind
    const camOffset = shipForward.clone().multiplyScalar(-camDistRef.current).add(new Vector3(0, heightOffset, 0));
    const desiredCamPos = groupRef.current.position.clone().add(camOffset);
    
    state.camera.position.lerp(desiredCamPos, 0.08);
    
    const lookTarget = groupRef.current.position.clone().add(shipForward.multiplyScalar(10));
    state.camera.lookAt(lookTarget);
  });

  const tId = currentTargetIdRef.current;
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
                
                {/* NAME LABEL 1 (Top) - Vertical Layout - GOLD & SPACED */}
                <group position={[0, 0, 0.36]}>
                     <Text
                        color="#FFD700" // Gold Color
                        fontSize={0.25} 
                        anchorX="center"
                        anchorY="middle"
                        rotation={[0, 0, 0]} 
                        lineHeight={1.6} // Increased Line Height for spacing
                        outlineWidth={0.02}
                        outlineColor="#8B4513" // SaddleBrown outline for better contrast with Gold
                     >
                       {'小\n豆\n子\n号'}
                     </Text>
                </group>

                {/* NAME LABEL 2 (Bottom) - Vertical Layout - Rotated - GOLD & SPACED */}
                <group position={[0, 0, -0.36]} rotation={[0, Math.PI, 0]}>
                     <Text
                        color="#FFD700" // Gold Color
                        fontSize={0.25}
                        anchorX="center"
                        anchorY="middle"
                        rotation={[0, 0, 0]} 
                        lineHeight={1.6} // Increased Line Height
                        outlineWidth={0.02} 
                        outlineColor="#8B4513" // SaddleBrown outline
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

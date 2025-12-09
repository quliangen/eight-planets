
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group, Object3D, AdditiveBlending, DoubleSide, Quaternion, MathUtils } from 'three';
import { Trail, Html, Text } from '@react-three/drei';
import { PLANETS } from '../constants';

interface StarshipProps {
  planetRefs: React.MutableRefObject<{ [key: string]: Object3D }>;
}

// Added LEAVING state for smooth exit
type ShipState = 'SEARCHING' | 'TRAVELING' | 'ORBITING' | 'LEAVING';

// Visual Indicator for the target planet
const TargetIndicator: React.FC<{ targetObj: Object3D }> = ({ targetObj }) => {
  const groupRef = useRef<Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current && targetObj) {
      const worldPos = new Vector3();
      targetObj.getWorldPosition(worldPos);
      
      // Position marker significantly above the planet
      const hoverHeight = 12;
      groupRef.current.position.copy(worldPos).add(new Vector3(0, hoverHeight, 0));
      
      // Animation: Bobbing up and down
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 4) * 0.5;
      
      // Animation: Rotate the whole indicator
      groupRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <group ref={groupRef}>
       {/* 1. Downward pointing Arrow/Cone */}
       <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[1.2, 2.5, 4]} />
          <meshBasicMaterial color="#00ff00" wireframe transparent opacity={0.8} />
       </mesh>
       
       {/* 2. Solid Core for visibility */}
       <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.6, 1.5, 4]} />
          <meshBasicMaterial color="#ccffcc" transparent opacity={0.6} />
       </mesh>

       {/* 3. Rotating Rings */}
       <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 2.2, 32]} />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.4} side={DoubleSide} />
       </mesh>
       <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.8, 2.9, 32]} />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.2} side={DoubleSide} />
       </mesh>

       {/* 4. Laser Beam pointing down to planet */}
       <mesh position={[0, -5, 0]}>
          <cylinderGeometry args={[0.05, 0.4, 10, 8, 1, true]} />
          <meshBasicMaterial 
            color="#00ff00" 
            transparent 
            opacity={0.15} 
            blending={AdditiveBlending} 
            depthWrite={false} 
            side={DoubleSide}
          />
       </mesh>

       {/* 5. HUD Label */}
       <Html position={[0, 3, 0]} center sprite distanceFactor={15} zIndexRange={[100, 0]}>
          <div className="flex flex-col items-center">
             <div className="text-[10px] font-mono font-bold text-green-400 bg-black/70 border border-green-500/50 px-2 py-0.5 rounded backdrop-blur-sm whitespace-nowrap shadow-[0_0_10px_rgba(0,255,0,0.4)] animate-pulse">
                TARGET LOCKED
             </div>
             <div className="w-[1px] h-4 bg-green-500/50"></div>
          </div>
       </Html>
    </group>
  );
};

export const Starship: React.FC<StarshipProps> = ({ planetRefs }) => {
  const groupRef = useRef<Group>(null);
  const shipModelRef = useRef<Group>(null);
  
  // Logic State
  const [targetId, setTargetId] = useState<string | null>(null);
  const [currentSpeedDisplay, setCurrentSpeedDisplay] = useState(0);
  
  // Refs for loop variables to avoid re-renders
  const stateRef = useRef<ShipState>('SEARCHING');
  const initializedRef = useRef(false);
  
  // Movement calculation refs
  const currentSpeedRef = useRef(0);
  const orbitAngleRef = useRef(0);
  const orbitRadiusRef = useRef(15);
  // Remove orbitStartAngleRef as it wasn't critical
  const totalOrbitTraveledRef = useRef(0);
  const camDistRef = useRef(16); 
  
  // Leaving State Refs
  const exitVectorRef = useRef(new Vector3());
  const leavingTimeRef = useRef(0);
  
  // Smooth rotation
  const MAX_SPEED = 25; // Normal cruising speed
  const ORBIT_SPEED = 8; // Slower speed for orbiting
  
  // Helper to calculate a safe but close orbit radius for each planet
  const getSafeOrbitRadius = (id: string) => {
     const p = PLANETS.find(x => x.id === id);
     if (!p) return 12; // Fallback
     
     if (p.hasRings) {
         return p.size * 2.5 + 2.0; 
     }
     return p.size * 1.8 + 2.0; 
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // --- 0. INITIALIZATION: Spawn at Earth ---
    if (!initializedRef.current) {
      const earthObj = planetRefs.current['earth'];
      if (earthObj) {
        const startPos = new Vector3();
        earthObj.getWorldPosition(startPos);
        
        if (startPos.lengthSq() > 1) {
             startPos.y += 10.0; // Start high
             startPos.x += 10.0; 
             groupRef.current.position.copy(startPos);
             groupRef.current.lookAt(new Vector3(0, 0, 0)); 
             initializedRef.current = true;
             
             // Snap camera
             const initCamPos = startPos.clone().add(new Vector3(0, 10, 25));
             state.camera.position.copy(initCamPos);
             state.camera.lookAt(startPos);
        }
      }
      return; 
    }

    // --- 1. STATE MACHINE ---
    
    // SEARCHING: Pick a new target
    if (stateRef.current === 'SEARCHING') {
      const ids = Object.keys(planetRefs.current);
      if (ids.length > 0) {
        const currentPos = groupRef.current.position;
        // Don't pick planets we are already very close to
        const validIds = ids.filter(id => {
           const pObj = planetRefs.current[id];
           const pPos = new Vector3();
           pObj.getWorldPosition(pPos);
           return pPos.distanceTo(currentPos) > 40; 
        });

        const nextId = validIds.length > 0 
           ? validIds[Math.floor(Math.random() * validIds.length)]
           : ids[Math.floor(Math.random() * ids.length)];
           
        setTargetId(nextId);
        stateRef.current = 'TRAVELING';
      }
      return;
    }

    // Handle invalid target
    if ((stateRef.current === 'TRAVELING' || stateRef.current === 'ORBITING') && (!targetId || !planetRefs.current[targetId])) {
      stateRef.current = 'SEARCHING';
      setTargetId(null);
      return;
    }

    // Common Target Position Logic
    let targetObj: Object3D | null = null;
    let targetPos = new Vector3();
    
    if (targetId && planetRefs.current[targetId]) {
      targetObj = planetRefs.current[targetId];
      targetObj.getWorldPosition(targetPos);
    }
    
    const currentPos = groupRef.current.position.clone();
    
    // TRAVELING: Fly towards the orbit entry point
    if (stateRef.current === 'TRAVELING' && targetObj) {
      const targetRadius = getSafeOrbitRadius(targetId!);
      
      // To ensure smooth entry, we want to arrive at the same Y level as the planet
      // So we force the entry point to be on the planet's XZ plane (y = targetPos.y)
      
      const dirToPlanet = new Vector3().subVectors(targetPos, currentPos).normalize();
      
      // Entry point logic:
      // We aim for a point on the "shell" of the orbit radius.
      // We ignore Y difference for the radius calculation to stay mainly horizontal
      const flatDir = new Vector3(dirToPlanet.x, 0, dirToPlanet.z).normalize();
      
      // Calculate entry point strictly on the target's Y plane
      const entryPoint = new Vector3(
          targetPos.x - flatDir.x * targetRadius,
          targetPos.y, // FLATTENED: Arrive at exact equator height
          targetPos.z - flatDir.z * targetRadius
      );
      
      const distToEntry = currentPos.distanceTo(entryPoint);

      // Decelerate as we get closer
      let targetSpeed = MAX_SPEED;
      if (distToEntry < 30) targetSpeed = ORBIT_SPEED;
      
      // Smooth speed transition
      currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * 2.0 * delta;

      if (distToEntry < 2) {
         // Arrived at orbit entry point
         stateRef.current = 'ORBITING';
         orbitRadiusRef.current = targetRadius;
         
         // Calculate initial angle relative to planet
         const relativePos = new Vector3().subVectors(currentPos, targetPos);
         orbitAngleRef.current = Math.atan2(relativePos.z, relativePos.x);
         totalOrbitTraveledRef.current = 0;
      } else {
         // Move towards entry point
         const moveDir = new Vector3().subVectors(entryPoint, currentPos).normalize();
         groupRef.current.position.add(moveDir.multiplyScalar(currentSpeedRef.current * delta));
         
         // Face forward
         const lookPos = currentPos.clone().add(moveDir);
         
         // Smooth rotation
         const slerpSpeed = distToEntry < 10 ? 3 * delta : 5 * delta;
         
         const dummyObj = new Object3D();
         dummyObj.position.copy(currentPos);
         dummyObj.lookAt(lookPos);
         groupRef.current.quaternion.slerp(dummyObj.quaternion, slerpSpeed);
         
         // Reset roll (Bank angle) slowly
         if (shipModelRef.current) {
            shipModelRef.current.rotation.z = MathUtils.lerp(shipModelRef.current.rotation.z, 0, delta * 2);
         }
      }
    }

    // ORBITING: Circle the planet once
    if (stateRef.current === 'ORBITING' && targetObj) {
       // Maintain orbit speed
       currentSpeedRef.current += (ORBIT_SPEED - currentSpeedRef.current) * 2.0 * delta;

       // Calculate angular speed: v = r * omega => omega = v / r
       const angularSpeed = currentSpeedRef.current / orbitRadiusRef.current;
       const angleDelta = angularSpeed * delta;
       
       orbitAngleRef.current += angleDelta;
       totalOrbitTraveledRef.current += angleDelta;

       // Calculate new position: Polar coordinates to Cartesian
       const nextX = targetPos.x + Math.cos(orbitAngleRef.current) * orbitRadiusRef.current;
       const nextZ = targetPos.z + Math.sin(orbitAngleRef.current) * orbitRadiusRef.current;
       
       // FLATTENED ORBIT: No vertical oscillation (sine wave removed).
       // Strictly adhere to targetPos.y
       const nextY = targetPos.y; 

       const nextPos = new Vector3(nextX, nextY, nextZ);
       
       // Move ship
       groupRef.current.position.copy(nextPos);
       
       // Look along the tangent (where we will be in a moment)
       const futureAngle = orbitAngleRef.current + 0.1;
       const lookX = targetPos.x + Math.cos(futureAngle) * orbitRadiusRef.current;
       const lookZ = targetPos.z + Math.sin(futureAngle) * orbitRadiusRef.current;
       
       // LOOK TARGET STABILIZATION: Look at exact same height to prevent pitching
       const lookY = targetPos.y; 
       
       const lookAtPos = new Vector3(lookX, lookY, lookZ);
       
       // Smooth rotation
       const dummyObj = new Object3D();
       dummyObj.position.copy(nextPos);
       dummyObj.lookAt(lookAtPos);
       groupRef.current.quaternion.slerp(dummyObj.quaternion, 8 * delta); // Faster response for tight turns

       // BANKING: Roll the ship inward while orbiting for realism
       if (shipModelRef.current) {
           // Bank left (negative Z rotation)
           shipModelRef.current.rotation.z = MathUtils.lerp(shipModelRef.current.rotation.z, -Math.PI / 4, delta * 3);
       }

       // Check if full orbit completed
       // Orbit a bit more than 360 (e.g., 400 degrees) to ensure we clear the entry area before leaving
       if (totalOrbitTraveledRef.current > Math.PI * 2.2) {
          stateRef.current = 'LEAVING';
          
          // Tangential Exit: Current forward vector is already tangential to the circle
          const forward = new Vector3(0, 0, 1).applyQuaternion(groupRef.current.quaternion).normalize();
          exitVectorRef.current.copy(forward);
          leavingTimeRef.current = 0;
       }
    }

    // LEAVING: Fly straight along the tangent
    if (stateRef.current === 'LEAVING') {
       leavingTimeRef.current += delta;
       
       // Accelerate back to cruise speed
       currentSpeedRef.current += (MAX_SPEED - currentSpeedRef.current) * 1.5 * delta;
       
       // Move along the locked tangent vector
       const moveVec = exitVectorRef.current.clone().multiplyScalar(currentSpeedRef.current * delta);
       groupRef.current.position.add(moveVec);
       
       // Banking: Roll back to flat
       if (shipModelRef.current) {
           shipModelRef.current.rotation.z = MathUtils.lerp(shipModelRef.current.rotation.z, 0, delta * 2);
       }

       // After flying away for ~1.5 seconds, look for next target
       if (leavingTimeRef.current > 1.5) {
          stateRef.current = 'SEARCHING';
          setTargetId(null);
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
    
    // Calculate height offset: Higher up when further away
    const heightOffset = MathUtils.lerp(5, 12, (camDistRef.current - 16) / (35 - 16));
    
    // Smooth Camera Follow
    const camOffset = shipForward.clone().multiplyScalar(-camDistRef.current).add(new Vector3(0, heightOffset, 0));
    const desiredCamPos = groupRef.current.position.clone().add(camOffset);
    
    state.camera.position.lerp(desiredCamPos, 0.08); // Slightly tighter follow
    
    // Look ahead of the ship
    const lookTarget = groupRef.current.position.clone().add(shipForward.multiplyScalar(10));
    state.camera.lookAt(lookTarget);

  });

  return (
    <>
      {/* REALISTIC STARSHIP MODEL */}
      <group ref={groupRef} scale={[1.8, 1.8, 1.8]}>
        
        {/* Speedometer HUD */}
        <Html position={[2, 1, 0]} center transform sprite zIndexRange={[100, 0]}>
             <div className="flex flex-col items-start pointer-events-none select-none">
                <div className="bg-cyan-900/40 border-l-2 border-cyan-400 backdrop-blur-sm px-3 py-1 mb-1 transform skew-x-[-10deg]">
                   <span className="text-[10px] text-cyan-200 font-mono tracking-widest uppercase">Velocity</span>
                   <div className="text-xl font-bold text-white font-mono leading-none flex items-baseline gap-1">
                      {currentSpeedDisplay.toLocaleString()} 
                      <span className="text-[10px] text-cyan-400">KM/H</span>
                   </div>
                </div>
                {/* Decorative bars */}
                <div className="flex gap-0.5 mt-0.5">
                   <div className={`h-1 w-2 rounded-sm ${currentSpeedRef.current > 5 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                   <div className={`h-1 w-2 rounded-sm ${currentSpeedRef.current > 10 ? 'bg-green-400' : 'bg-gray-700'}`}></div>
                   <div className={`h-1 w-2 rounded-sm ${currentSpeedRef.current > 15 ? 'bg-yellow-400' : 'bg-gray-700'}`}></div>
                   <div className={`h-1 w-2 rounded-sm ${currentSpeedRef.current > 20 ? 'bg-red-500' : 'bg-gray-700'}`}></div>
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
                
                {/* NAME LABEL: "小豆子号" */}
                <group position={[0, 0, 0.36]} rotation={[0, 0, 0]}>
                     <Text
                        color="black" 
                        fontSize={0.15}
                        anchorX="center"
                        anchorY="middle"
                        rotation={[0, 0, -Math.PI/2]} 
                     >
                       小豆子号
                     </Text>
                     <mesh position={[0, 0, -0.01]} rotation={[0, 0, -Math.PI/2]}>
                        <planeGeometry args={[0.8, 0.25]} />
                        <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
                     </mesh>
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

      {/* TARGET INDICATOR */}
      {targetId && planetRefs.current[targetId] && stateRef.current === 'TRAVELING' && (
        <TargetIndicator targetObj={planetRefs.current[targetId]} />
      )}
    </>
  );
};

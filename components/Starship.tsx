
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group, Object3D } from 'three';
import { Trail } from '@react-three/drei';

interface StarshipProps {
  planetRefs: React.MutableRefObject<{ [key: string]: Object3D }>;
}

export const Starship: React.FC<StarshipProps> = ({ planetRefs }) => {
  const groupRef = useRef<Group>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. Target Selection
    if (!targetId) {
      const ids = Object.keys(planetRefs.current);
      if (ids.length > 0) {
        // Pick a random planet
        const nextId = ids[Math.floor(Math.random() * ids.length)];
        setTargetId(nextId);
      }
      return;
    }

    const targetObj = planetRefs.current[targetId];
    if (!targetObj) {
      setTargetId(null);
      return;
    }

    // 2. Navigation Logic
    const targetPos = new Vector3();
    targetObj.getWorldPosition(targetPos);
    
    // Fly to a point slightly "above" the planet to orbit/visit it
    const flyToPos = targetPos.clone().add(new Vector3(0, 4, 0));

    const currentPos = groupRef.current.position;
    const dist = currentPos.distanceTo(flyToPos);
    
    // Speed settings
    const speed = 15; // Units per second
    
    if (dist < 5) {
      // Arrived near destination, pick new target
      setTargetId(null);
    } else {
      // Move towards target
      const direction = new Vector3().subVectors(flyToPos, currentPos).normalize();
      
      // Update position
      const moveVec = direction.multiplyScalar(speed * delta);
      groupRef.current.position.add(moveVec);
      
      // Update rotation (Face forward)
      groupRef.current.lookAt(flyToPos);
    }
  });

  return (
    // Scaled up by 2x as requested
    <group ref={groupRef} position={[30, 0, 30]} scale={[2, 2, 2]}>
      
      {/* ROCKET GEOMETRY (Untrailed) */}
      <group>
          {/* 1. Main Body (Cylinder) - Shifted forward on Z so tail is at 0 */}
          <mesh position={[0, 0, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.3, 1.2, 16]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.5} />
          </mesh>
          
          {/* 2. Nose Cone - Red */}
          <mesh position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.26, 0.5, 16]} />
            <meshStandardMaterial color="#ef4444" roughness={0.2} />
          </mesh>

          {/* 3. Fins (4) - Red */}
          {[0, Math.PI/2, Math.PI, -Math.PI/2].map((angle, i) => (
            <mesh key={i} position={[0, 0, 0.3]} rotation={[0, 0, angle]}>
              <group rotation={[Math.PI/2, 0, 0]}> 
                  <mesh position={[0.3, 0, 0]}>
                    <boxGeometry args={[0.3, 0.05, 0.5]} />
                    <meshStandardMaterial color="#ef4444" />
                  </mesh>
              </group>
            </mesh>
          ))}

          {/* 4. Engine Nozzle (Black) at 0,0,0 */}
          {/* Radius bottom is 0.15. Diameter 0.3 */}
          <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.15, 0.2, 16]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>

          {/* 5. Inverted Triangle Gradient Flame (Blue 3D Geometry) */}
          {/* Reduced radius to 0.18 to match nozzle (0.15) better */}
          <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
            {/* Wide at Z=0 (Top), Point at Z negative */}
            <cylinderGeometry args={[0.18, 0.0, 1.0, 8, 1, true]} /> 
            <meshBasicMaterial 
              color="#00BFFF" 
              transparent 
              opacity={0.6} 
              depthWrite={false}
            />
          </mesh>
          {/* Inner hotter core (Light Cyan/White) */}
          <mesh position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.0, 0.7, 8, 1, true]} /> 
            <meshBasicMaterial 
              color="#E0F7FA" 
              transparent 
              opacity={0.8} 
              depthWrite={false}
            />
          </mesh>
          
          {/* 6. Windows (Blue) */}
          <mesh position={[0, 0.28, 0.9]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0, 0.28, 0.6]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.8} />
          </mesh>
          
          {/* Glow at engine */}
          <pointLight position={[0, 0, 0]} color="#00BFFF" distance={3} intensity={2} />
      </group>

      {/* SEPARATE TRAIL EMITTER */}
      {/* Positioned slightly behind the flame tip (-1.0) */}
      <group position={[0, 0, -0.9]}>
        <Trail 
          width={0.15} // Reduced significantly (was 0.5). Scaled 2x = 0.3 world width. Fits inside flame.
          length={3} 
          color="#00BFFF" 
          attenuation={(t) => t * t}
        >
          <mesh visible={false}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
          </mesh>
        </Trail>
      </group>

    </group>
  );
};

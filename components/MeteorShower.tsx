
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, DynamicDrawUsage, Color, AdditiveBlending, MathUtils } from 'three';

interface MeteorShowerProps {
  count?: number;
}

export const MeteorShower: React.FC<MeteorShowerProps> = ({ count = 300 }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  
  // Store individual meteor data (position, speed, scale)
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = MathUtils.randFloatSpread(400); // Wide spread X
      const y = MathUtils.randFloat(50, 200);   // Start high up
      const z = MathUtils.randFloatSpread(400); // Wide spread Z
      const speed = MathUtils.randFloat(1.5, 3.0);
      const scale = MathUtils.randFloat(1.0, 3.0); // Length variation
      temp.push({ x, y, z, speed, scale });
    }
    return temp;
  }, [count]);

  useEffect(() => {
    if (meshRef.current) {
      // Set initial positions
      for (let i = 0; i < count; i++) {
        const { x, y, z, scale } = particles[i];
        dummy.position.set(x, y, z);
        
        // Orient meteors to streak downwards-diagonally
        // Rotating -45 degrees on Z makes them look like they are falling diagonally
        dummy.rotation.set(0, 0, Math.PI / 4);
        
        dummy.scale.set(0.1, scale * 5, 0.1); // Long thin streaks
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [dummy, particles, count]);

  useFrame(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < count; i++) {
      const particle = particles[i];
      
      // Move particle diagonally
      // We reduce Y and increase X to match the rotation flow
      particle.y -= particle.speed * 1.5;
      particle.x -= particle.speed * 1.5; 

      // Reset if out of bounds (too low or too far)
      if (particle.y < -100) {
        particle.y = MathUtils.randFloat(100, 200);
        particle.x = MathUtils.randFloatSpread(400) + 100; // Offset start to maintain diagonal flow coverage
      }

      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.rotation.set(0, 0, Math.PI / 4 + 0.2); // Slight angle adjustment
      dummy.scale.set(0.2, particle.scale * 8, 0.2); // Stretch them out for speed illusion
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      {/* A simple cylinder acting as the light streak */}
      <cylinderGeometry args={[0.2, 0, 1, 4]} />
      <meshBasicMaterial 
        color="#81ecec" // Bright Cyan/White
        transparent 
        opacity={0.6} 
        blending={AdditiveBlending} 
        depthWrite={false}
      />
    </instancedMesh>
  );
};

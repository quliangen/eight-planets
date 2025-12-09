import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Color, MathUtils, Group } from 'three';

export const AsteroidBelt: React.FC<{ isPaused: boolean; simulationSpeed: number }> = ({ isPaused, simulationSpeed }) => {
  const meshRef = useRef<InstancedMesh>(null);
  const groupRef = useRef<Group>(null);
  // Increased count because the orbit is larger now, need more rocks to look dense
  const count = 750; 
  const dummy = useMemo(() => new Object3D(), []);

  // Generate random data for asteroids
  const particles = useMemo(() => {
    const temp = [];
    // CORRECTION: Main Asteroid Belt is between Mars (Distance 36) and Jupiter (Distance 52)
    const minRadius = 39; 
    const maxRadius = 48; 

    for (let i = 0; i < count; i++) {
      // Random radius within the belt
      const r = MathUtils.randFloat(minRadius, maxRadius);
      // Random angle
      const theta = MathUtils.randFloat(0, Math.PI * 2);
      
      // Convert polar to cartesian coordinates (flat disk)
      const x = r * Math.cos(theta);
      const z = -r * Math.sin(theta); // Counter-clockwise
      
      // Slight vertical spread
      const y = MathUtils.randFloatSpread(1.5);

      // Random scale for variety
      const scale = MathUtils.randFloat(0.1, 0.4);

      // Random rotation
      const rotation = [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ];

      temp.push({ x, y, z, scale, rotation });
    }
    return temp;
  }, []);

  // Set initial positions
  useLayoutEffect(() => {
    if (meshRef.current) {
      // BRIGHTER PALETTE: Silver, Light Grey, Pale Rock colors
      const color = new Color();
      const palette = ['#E5E7EB', '#D1D5DB', '#9CA3AF', '#C4B5FD'];

      particles.forEach((particle, i) => {
        const { x, y, z, scale, rotation } = particle;
        
        dummy.position.set(x, y, z);
        dummy.rotation.set(rotation[0], rotation[1], rotation[2]);
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        
        meshRef.current!.setMatrixAt(i, dummy.matrix);
        
        // Pick a random color
        color.set(palette[Math.floor(Math.random() * palette.length)]);
        // Add slight variation for realism
        color.offsetHSL(0, 0, Math.random() * 0.1); 
        
        // REDUCE BRIGHTNESS: Scale color by 0.7
        color.multiplyScalar(0.7);

        meshRef.current!.setColorAt(i, color);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [particles, dummy]);

  // Rotate the entire belt group slowly to simulate orbit
  useFrame((state, delta) => {
    if (groupRef.current && !isPaused) {
      // Asteroid belt moves slower than inner planets
      groupRef.current.rotation.y += delta * 0.01 * simulationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        {/* Dodecahedron looks like a low-poly rock */}
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial 
          roughness={0.7} 
          metalness={0.2}
          color="#ffffff"
          emissive="#222222" // Slight self-glow to ensure visibility
          emissiveIntensity={0.35} 
        />
      </instancedMesh>
    </group>
  );
};
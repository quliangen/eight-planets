import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, TextureLoader, Color } from 'three';
import { Billboard, Html } from '@react-three/drei';
import { generatePlanetTexture, generateSunGlowTexture } from '../utils/textureGenerator';
import { SUN_DATA } from '../constants';

interface SunProps {
  onSelect: (id: string) => void;
  isSelected: boolean;
  isPaused: boolean;
}

export const Sun: React.FC<SunProps> = ({ onSelect, isSelected, isPaused }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const textureUrl = useMemo(() => generatePlanetTexture(SUN_DATA), []);
  const texture = useMemo(() => new TextureLoader().load(textureUrl), [textureUrl]);

  // Generate Corona Glow Texture
  const glowUrl = useMemo(() => generateSunGlowTexture(), []);
  const glowTexture = useMemo(() => new TextureLoader().load(glowUrl), [glowUrl]);

  useFrame((state, delta) => {
    if (meshRef.current && !isPaused) {
      meshRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group>
      {/* Main Sun Body */}
      <mesh 
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(SUN_DATA.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
          setHovered(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
          setHovered(false);
        }}
      >
        <sphereGeometry args={[4.5, 64, 64]} />
        <meshBasicMaterial 
          map={texture}
          color="#FFD700"
        />
        
        {/* Hover Label for Sun */}
        {hovered && (
          <Html position={[0, 6, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
            <div className="bg-black/80 text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap border border-white/30 backdrop-blur-md font-bold shadow-[0_4px_20px_rgba(0,0,0,0.5)] animate-fade-in-up">
              {SUN_DATA.name}
            </div>
          </Html>
        )}
      </mesh>
      
      {/* Inner Glow Layer */}
      <Billboard>
         <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[13, 13]} />
            <meshBasicMaterial 
              map={glowTexture} 
              transparent 
              opacity={0.8} 
              depthWrite={false}
              blending={2} // Additive
              color="#FF8C00"
            />
         </mesh>
      </Billboard>

      {/* Outer Glow Layer (Large Halo) */}
       <Billboard>
         <mesh position={[0, 0, -0.2]}>
            <planeGeometry args={[22, 22]} />
            <meshBasicMaterial 
              map={glowTexture} 
              transparent 
              opacity={0.4} 
              depthWrite={false}
              blending={2} // Additive
              color="#FFD700"
            />
         </mesh>
      </Billboard>

      {/* Lens Flare substitute - simple central bright point */}
      <pointLight intensity={2} distance={100} decay={2} color="#FFFFFF" />
    </group>
  );
};
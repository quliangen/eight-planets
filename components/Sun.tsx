
import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, TextureLoader } from 'three';
import { Billboard, Html } from '@react-three/drei';
import { generatePlanetTexture, generateSunGlowTexture } from '../utils/textureGenerator';
import { SUN_DATA } from '../constants';

interface SunProps {
  onSelect: (id: string) => void;
  isSelected: boolean;
  isPaused: boolean;
  simulationSpeed: number;
}

// Consistent TechLabel style (growing upwards)
const TechLabel: React.FC<{ name: string; color: string }> = ({ name, color }) => {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pb-1 pointer-events-none select-none">
       <div 
         className="backdrop-blur-md bg-black/70 border px-3 py-1 rounded shadow-[0_0_15px_rgba(0,0,0,0.5)] transform transition-all animate-fade-in-up flex items-center gap-2 mb-[-1px]"
         style={{ borderColor: `${color}80`, boxShadow: `0 0 10px ${color}30` }}
       >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }}></div>
          <span className="text-white font-mono font-bold tracking-widest text-xs uppercase" style={{ textShadow: `0 0 5px ${color}` }}>
            {name}
          </span>
       </div>
       <div 
         className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent"
         style={{ background: `linear-gradient(to bottom, ${color}, transparent)` }}
       ></div>
    </div>
  );
};

export const Sun: React.FC<SunProps> = ({ onSelect, isSelected, isPaused, simulationSpeed }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const clickStartRef = useRef({ x: 0, y: 0 });

  const textureUrl = useMemo(() => generatePlanetTexture(SUN_DATA), []);
  const texture = useMemo(() => new TextureLoader().load(textureUrl), [textureUrl]);

  // Generate Corona Glow Texture
  const glowUrl = useMemo(() => generateSunGlowTexture(), []);
  const glowTexture = useMemo(() => new TextureLoader().load(glowUrl), [glowUrl]);

  useFrame((state, delta) => {
    if (meshRef.current && !isPaused) {
      // Rotate the sun slowly
      meshRef.current.rotation.y += delta * 0.02 * simulationSpeed;
    }
  });

  return (
    <group>
      {/* Main Sun Body */}
      <mesh 
        ref={meshRef}
        onPointerDown={(e) => { e.stopPropagation(); clickStartRef.current = { x: e.clientX, y: e.clientY }; }}
        onClick={(e) => {
          e.stopPropagation();
          const dx = e.clientX - clickStartRef.current.x;
          const dy = e.clientY - clickStartRef.current.y;
          if (Math.sqrt(dx * dx + dy * dy) < 5) onSelect(SUN_DATA.id);
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
      >
        <sphereGeometry args={[SUN_DATA.size, 64, 64]} />
        <meshBasicMaterial map={texture} color="#FFFFFF" />
        
        {/* Tech Style Hover Label (Upwards) */}
        {hovered && (
          <Html position={[0, SUN_DATA.size, 0]} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
             <TechLabel name={SUN_DATA.name} color="#FF8C00" />
          </Html>
        )}
      </mesh>
      
      {/* Inner Glow Layer */}
      <Billboard>
         <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[SUN_DATA.size * 2.8, SUN_DATA.size * 2.8]} />
            <meshBasicMaterial map={glowTexture} transparent opacity={0.8} depthWrite={false} blending={2} color="#FFC400" />
         </mesh>
      </Billboard>

      {/* Outer Glow Layer */}
       <Billboard>
         <mesh position={[0, 0, -0.2]}>
            <planeGeometry args={[SUN_DATA.size * 5.0, SUN_DATA.size * 5.0]} />
            <meshBasicMaterial map={glowTexture} transparent opacity={0.5} depthWrite={false} blending={2} color="#FF4500" />
         </mesh>
       </Billboard>
    </group>
  );
};

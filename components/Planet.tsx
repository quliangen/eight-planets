
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color, DoubleSide, Vector3, TextureLoader, AdditiveBlending, Object3D, Group, PlaneGeometry, Texture } from 'three';
import { Html, Billboard } from '@react-three/drei';
import { PlanetData } from '../types';
import { generatePlanetTexture, generateRingTexture, generateGenericGlowTexture, generateChinaFlagTexture } from '../utils/textureGenerator';
import { JUPITER_MOONS, SATURN_MOONS, MOON_DATA, TIANGONG_DATA } from '../constants';

interface PlanetProps {
  data: PlanetData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isPaused: boolean;
  simulationSpeed: number;
  earthPositionRef: React.MutableRefObject<Vector3>;
  planetRefs: React.MutableRefObject<{ [key: string]: Object3D }>;
  isStarshipActive: boolean;
  showOrbit: boolean;
}

// --- Animated Waving Flag Component ---
const AnimatedFlag = ({ texture }: { texture: Texture }) => {
  const meshRef = useRef<Mesh>(null);
  const geometry = useMemo(() => new PlaneGeometry(1.5, 1.0, 10, 8), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const pos = geometry.attributes.position;
    const count = pos.count;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const factor = (x + 0.75) / 1.5; 
      const wave = Math.sin(x * 5.0 - time * 8.0);
      const z = wave * 0.1 * factor; 
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[-0.75, 1.1, 0]} scale={[-1, 1, 1]}>
      <meshBasicMaterial map={texture} side={DoubleSide} transparent opacity={0.95} />
    </mesh>
  );
};

// --- New Upward Growing Tech Label ---
// Positioned relative to the top of the planet/object so it doesn't cover it.
const TechLabel: React.FC<{ name: string; color: string }> = ({ name, color }) => {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pb-1 pointer-events-none select-none">
       {/* Label Box */}
       <div 
         className="backdrop-blur-md bg-black/70 border px-3 py-1 rounded shadow-[0_0_15px_rgba(0,0,0,0.5)] transform transition-all animate-fade-in-up flex items-center gap-2 mb-[-1px]"
         style={{ borderColor: `${color}80`, boxShadow: `0 0 10px ${color}30` }}
       >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }}></div>
          <span className="text-white font-mono font-bold tracking-widest text-xs uppercase" style={{ textShadow: `0 0 5px ${color}` }}>
            {name}
          </span>
       </div>
       {/* Connecting Line */}
       <div 
         className="w-px h-8 sm:h-12 bg-gradient-to-b from-white/50 to-transparent"
         style={{ background: `linear-gradient(to bottom, ${color}, transparent)` }}
       ></div>
    </div>
  );
};

// --- 中国空间站 (Tiangong Space Station) ---
const TiangongStation: React.FC<{ isPaused: boolean; simulationSpeed: number; showOrbit: boolean; onSelect: (id: string) => void; isSelected: boolean }> = ({ isPaused, simulationSpeed, showOrbit, onSelect, isSelected }) => {
  const stationRef = useRef<Group>(null);
  const solarPanelRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const clickStartRef = useRef({ x: 0, y: 0 });

  const flagUrl = useMemo(() => generateChinaFlagTexture(), []);
  const flagTexture = useMemo(() => new TextureLoader().load(flagUrl), [flagUrl]);

  useFrame((state, delta) => {
    if (stationRef.current && !isPaused) {
      stationRef.current.rotation.y += delta * 0.8 * simulationSpeed;
    }
    if (solarPanelRef.current && !isPaused) {
       solarPanelRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group rotation={[Math.PI / 6, 0, Math.PI / 4]}>
      <group ref={stationRef}>
        <group position={[1.4, 0, 0]} scale={[0.12, 0.12, 0.12]}>
           
           {/* Invisible Hitbox for easier clicking */}
           <mesh 
             visible={false} 
             scale={[8, 8, 8]}
             onPointerDown={(e) => { e.stopPropagation(); clickStartRef.current = { x: e.clientX, y: e.clientY }; }}
             onClick={(e) => {
                e.stopPropagation();
                const dx = e.clientX - clickStartRef.current.x;
                const dy = e.clientY - clickStartRef.current.y;
                if (Math.sqrt(dx * dx + dy * dy) < 5) onSelect(TIANGONG_DATA.id);
             }}
             onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
             onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
           >
              <sphereGeometry args={[1, 16, 16]} />
              <meshBasicMaterial color="red" />
           </mesh>

           <group rotation={[0, Math.PI / 2, 0]}>
             <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.45, 1.8, 16]} />
                <meshStandardMaterial 
                  color="#f8f9fa" roughness={0.3} metalness={0.5} 
                  emissive={isSelected || hovered ? TIANGONG_DATA.color : "#000000"} 
                  emissiveIntensity={isSelected || hovered ? 0.4 : 0}
                />
             </mesh>
             
             {/* 🇨🇳 Flag */}
             <group position={[-0.9, 0.5, 0]}>
                <mesh position={[0, 0.9, 0]}>
                   <cylinderGeometry args={[0.03, 0.03, 1.8]} />
                   <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
                </mesh>
                <AnimatedFlag texture={flagTexture} />
             </group>

             {/* Modules */}
             <mesh position={[0, 0, -0.6]}><sphereGeometry args={[0.5, 16, 16]} /><meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.5} /></mesh>
             <mesh position={[-1.2, 0, -0.6]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.35, 0.4, 1.8, 16]} /><meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.4} /></mesh>
             <mesh position={[1.2, 0, -0.6]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.35, 0.4, 1.8, 16]} /><meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.4} /></mesh>
             
             <group ref={solarPanelRef}>
               <group position={[-2.3, 0, -0.6]}>
                  <mesh position={[-0.8, 0, 0]}><boxGeometry args={[1.6, 0.02, 0.8]} /><meshStandardMaterial color="#1e3a8a" roughness={0.2} metalness={0.8} /></mesh>
               </group>
               <group position={[2.3, 0, -0.6]}>
                  <mesh position={[0.8, 0, 0]}><boxGeometry args={[1.6, 0.02, 0.8]} /><meshStandardMaterial color="#1e3a8a" roughness={0.2} metalness={0.8} /></mesh>
               </group>
             </group>
           </group>

           {hovered && (
              <Html position={[0, 6, 0]} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
                 <TechLabel name={TIANGONG_DATA.name} color={TIANGONG_DATA.color} />
              </Html>
           )}
        </group>
        
        <mesh rotation={[Math.PI / 2, 0, 0]} visible={showOrbit}>
           <ringGeometry args={[1.38, 1.42, 64]} />
           <meshBasicMaterial color="#38bdf8" opacity={0.3} transparent side={DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};

const Moon: React.FC<{ isPaused: boolean; simulationSpeed: number; showOrbit: boolean; onSelect: (id: string) => void; isSelected: boolean }> = ({ isPaused, simulationSpeed, showOrbit, onSelect, isSelected }) => {
  const moonRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const clickStartRef = useRef({ x: 0, y: 0 });
  
  const textureUrl = useMemo(() => generatePlanetTexture(MOON_DATA), []);
  const texture = useMemo(() => new TextureLoader().load(textureUrl), [textureUrl]);

  useFrame((state, delta) => {
    if (moonRef.current && !isPaused) {
      moonRef.current.rotation.y += delta * 0.2 * simulationSpeed;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 8]}>
      <group ref={moonRef}>
        <group position={[3.5, 0, 0]}>
            {/* Visual Mesh */}
            <mesh>
              <sphereGeometry args={[0.45, 32, 32]} />
              <meshPhysicalMaterial 
                map={texture}
                color="#ffffff" 
                roughness={0.8}
                metalness={0.1}
                emissive={isSelected || hovered ? "#FFFFFF" : "#000000"}
                emissiveIntensity={isSelected || hovered ? 0.2 : 0}
              />
            </mesh>
            
            {/* Invisible Hitbox for easier clicking (Larger than visual mesh) */}
            <mesh
                visible={false}
                scale={[1.5, 1.5, 1.5]}
                onPointerDown={(e) => { e.stopPropagation(); clickStartRef.current = { x: e.clientX, y: e.clientY }; }}
                onClick={(e) => {
                    e.stopPropagation();
                    const dx = e.clientX - clickStartRef.current.x;
                    const dy = e.clientY - clickStartRef.current.y;
                    if (Math.sqrt(dx * dx + dy * dy) < 5) onSelect(MOON_DATA.id);
                }}
                onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
            >
                <sphereGeometry args={[0.45, 16, 16]} />
                <meshBasicMaterial color="red" />
            </mesh>

            {hovered && (
                <Html position={[0, 0.45, 0]} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
                    <TechLabel name={MOON_DATA.name} color={MOON_DATA.color} />
                </Html>
            )}
        </group>
        
        <mesh rotation={[Math.PI / 2, 0, 0]} visible={showOrbit}>
           <ringGeometry args={[3.45, 3.55, 64]} />
           <meshBasicMaterial color="#ffffff" opacity={0.15} transparent side={DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};

// Generic Satellite Component
const Satellite: React.FC<{ 
  data: PlanetData;
  isPaused: boolean; 
  simulationSpeed: number;
  onSelect: (id: string) => void;
  isSelected: boolean;
  showOrbit: boolean;
}> = ({ data, isPaused, simulationSpeed, onSelect, isSelected, showOrbit }) => {
  const ref = useRef<Group>(null);
  const inclinationGroupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const clickStartRef = useRef({ x: 0, y: 0 });
  
  const textureUrl = useMemo(() => generatePlanetTexture(data), [data]);
  const texture = useMemo(() => new TextureLoader().load(textureUrl), [textureUrl]);

  useFrame((state, delta) => {
    if (ref.current && !isPaused) {
      ref.current.rotation.y += delta * data.speed * simulationSpeed;
    }
  });

  return (
    <group ref={inclinationGroupRef} rotation={[0, 0, data.orbitInclination || 0]}>
      <group ref={ref}>
        <mesh 
          position={[data.distance, 0, 0]}
          onPointerDown={(e) => { e.stopPropagation(); clickStartRef.current = { x: e.clientX, y: e.clientY }; }}
          onClick={(e) => {
            e.stopPropagation();
            const dx = e.clientX - clickStartRef.current.x;
            const dy = e.clientY - clickStartRef.current.y;
            if (Math.sqrt(dx * dx + dy * dy) < 5) onSelect(data.id);
          }}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
        >
          <sphereGeometry args={[data.size, 32, 32]} />
          <meshPhysicalMaterial 
            map={texture}
            color="#ffffff" 
            roughness={0.7}
            metalness={0.1}
            emissive={isSelected || hovered ? new Color(data.color) : new Color('#000000')}
            emissiveIntensity={isSelected || hovered ? 0.2 : 0} 
          />
          
          {hovered && (
            <Html position={[0, data.size, 0]} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
               <TechLabel name={data.name} color={data.color} />
            </Html>
          )}
        </mesh>
        
        <mesh rotation={[Math.PI / 2, 0, 0]} visible={showOrbit}>
           <ringGeometry args={[data.distance - 0.03, data.distance + 0.03, 64]} />
           <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};

const JupiterMoons: React.FC<{ isPaused: boolean; simulationSpeed: number; onSelect: (id: string) => void; selectedId: string | null; showOrbit: boolean; }> = (props) => (
    <group rotation={[0, 0, 0.05]}> 
      {JUPITER_MOONS.map(moon => <Satellite key={moon.id} data={moon} isSelected={props.selectedId === moon.id} {...props} />)}
    </group>
);

const SaturnMoons: React.FC<{ isPaused: boolean; simulationSpeed: number; onSelect: (id: string) => void; selectedId: string | null; showOrbit: boolean; }> = (props) => (
    <group> 
      {SATURN_MOONS.map(moon => <Satellite key={moon.id} data={moon} isSelected={props.selectedId === moon.id} {...props} />)}
    </group>
);

export const Planet: React.FC<PlanetProps> = ({ 
  data, 
  isSelected, 
  onSelect, 
  isPaused,
  simulationSpeed,
  earthPositionRef,
  planetRefs,
  isStarshipActive,
  showOrbit
}) => {
  const meshRef = useRef<Mesh>(null);
  const orbitGroupRef = useRef<Group>(null);
  const inclinationGroupRef = useRef<Group>(null); 
  const [hovered, setHovered] = useState(false);
  const clickStartRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    if (orbitGroupRef.current) {
      planetRefs.current[data.id] = orbitGroupRef.current;
    }
  }, [data.id, planetRefs]);

  const orbitAngleRef = useRef(Math.random() * Math.PI * 2);

  const textureUrl = useMemo(() => generatePlanetTexture(data), [data]);
  const texture = useMemo(() => new TextureLoader().load(textureUrl), [textureUrl]);

  const ringTextureUrl = useMemo(() => data.hasRings && data.ringColor ? generateRingTexture(data.id, data.ringColor) : null, [data]);
  const ringTexture = useMemo(() => ringTextureUrl ? new TextureLoader().load(ringTextureUrl) : null, [ringTextureUrl]);

  const glowTextureUrl = useMemo(() => data.atmosphereColor ? generateGenericGlowTexture() : null, [data.atmosphereColor]);
  const glowTexture = useMemo(() => glowTextureUrl ? new TextureLoader().load(glowTextureUrl) : null, [glowTextureUrl]);

  useFrame((state, delta) => {
    if (!orbitGroupRef.current || !meshRef.current) return;

    if (!isPaused) {
      orbitAngleRef.current += delta * data.speed * 0.1 * simulationSpeed;
      
      const x = Math.cos(orbitAngleRef.current) * data.distance;
      const z = -Math.sin(orbitAngleRef.current) * data.distance;
      
      orbitGroupRef.current.position.set(x, 0, z);
      meshRef.current.rotation.y += data.rotationSpeed * simulationSpeed;
      
      if (data.id === 'earth') {
        orbitGroupRef.current.getWorldPosition(earthPositionRef.current);
      }
    }
  });

  return (
    <group ref={inclinationGroupRef} rotation={[0, 0, data.orbitInclination || 0]}>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} visible={!isStarshipActive && showOrbit}>
        <ringGeometry args={[data.distance - 0.05, data.distance + 0.05, 128]} />
        <meshBasicMaterial color="#ffffff" opacity={0.35} transparent side={DoubleSide} />
      </mesh>

      <group ref={orbitGroupRef}>
        <group rotation={[0, 0, data.axisTilt || 0]}>
          <mesh
            ref={meshRef}
            onPointerDown={(e) => { e.stopPropagation(); clickStartRef.current = { x: e.clientX, y: e.clientY }; }}
            onClick={(e) => {
              e.stopPropagation();
              const dx = e.clientX - clickStartRef.current.x;
              const dy = e.clientY - clickStartRef.current.y;
              if (Math.sqrt(dx * dx + dy * dy) < 5) onSelect(data.id);
            }}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
          >
            <sphereGeometry args={[data.size, 64, 64]} />
            <meshPhysicalMaterial 
              map={texture}
              color="#ffffff" 
              roughness={0.6}
              metalness={0.2}
              clearcoat={0.3}
              // Improved Hover Effect: Internal Glow (Emissive) with low intensity (0.2)
              emissive={isSelected || hovered ? new Color(data.color) : new Color('#000000')}
              emissiveIntensity={isSelected || hovered ? 0.2 : 0} 
            />
            
            {/* New Upward Growing Label */}
            {hovered && (
              <Html position={[0, data.size, 0]} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
                 <TechLabel name={data.name} color={data.color} />
              </Html>
            )}
          </mesh>

          {data.hasRings && ringTexture && (
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[data.size * 1.4, data.size * 2.3, 128]} />
              <meshStandardMaterial 
                map={ringTexture}
                color="#ffffff" 
                opacity={0.9} 
                transparent 
                side={DoubleSide} 
                roughness={0.4}
                metalness={0.2}
              />
            </mesh>
          )}
        </group>

        {data.id === 'earth' && (
          <>
            <Moon isPaused={isPaused} simulationSpeed={simulationSpeed} showOrbit={showOrbit} onSelect={onSelect} isSelected={isSelected} />
            <TiangongStation isPaused={isPaused} simulationSpeed={simulationSpeed} showOrbit={showOrbit} onSelect={onSelect} isSelected={isSelected} />
          </>
        )}

        {data.id === 'jupiter' && <JupiterMoons isPaused={isPaused} simulationSpeed={simulationSpeed} onSelect={onSelect} selectedId={isSelected ? data.id : null} showOrbit={showOrbit} />}
        {data.id === 'saturn' && <SaturnMoons isPaused={isPaused} simulationSpeed={simulationSpeed} onSelect={onSelect} selectedId={isSelected ? data.id : null} showOrbit={showOrbit} />}

        {data.atmosphereColor && glowTexture && (
           <Billboard>
              <mesh scale={[data.size * 2.8, data.size * 2.8, 1]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial 
                  map={glowTexture} 
                  transparent 
                  opacity={0.25}
                  depthWrite={false}
                  blending={AdditiveBlending}
                  color={new Color(data.atmosphereColor)}
                />
              </mesh>
           </Billboard>
        )}

      </group>
    </group>
  );
};

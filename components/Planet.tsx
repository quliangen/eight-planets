
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color, DoubleSide, Vector3, TextureLoader, AdditiveBlending, Object3D, Group, PlaneGeometry, Texture, MeshStandardMaterial, MeshPhysicalMaterial } from 'three';
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

// --- Minimalist HUD Tech Label ---
const TechLabel: React.FC<{ name: string; color: string }> = ({ name, color }) => {
  const match = name.match(/^(.+?)\s*\((.+?)\)$/);
  const cnName = match ? match[1] : name;
  const enNameRaw = match ? match[2] : '';
  const enName = enNameRaw.replace(/\s+/g, '');

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none w-max">
       
       {/* Floating Label Container */}
       <div 
         className="mb-1 px-5 py-2 flex flex-row items-baseline gap-3 
                    bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm rounded-sm border-b-2 
                    transform transition-all duration-300 animate-fade-in-up"
         style={{ 
            borderColor: color,
            textShadow: `0 0 10px ${color}80`
         }}
       >
          <span className="text-white font-bold text-2xl tracking-widest drop-shadow-md font-sans">
            {cnName}
          </span>
          {enName && (
             <span className="text-xs font-mono font-medium tracking-[0.15em] text-cyan-200/80 uppercase">
                {enName}
             </span>
          )}
       </div>

       {/* Animated Connection Line & Reticle */}
       <div className="flex flex-col items-center relative">
          {/* Vertical Line */}
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/40 to-transparent"></div>
          
          {/* Target Reticle */}
          <div className="absolute bottom-0 w-6 h-6 flex items-center justify-center translate-y-1/2">
             <div className="absolute w-full h-full border border-white/20 rounded-full animate-[spin_4s_linear_infinite]"></div>
             <div className="absolute w-[70%] h-[70%] border-l border-r border-white/50 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
             <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]"></div>
          </div>
       </div>
    </div>
  );
};

// --- 中国空间站 (Tiangong Space Station) ---
const TiangongStation: React.FC<{ isPaused: boolean; simulationSpeed: number; showOrbit: boolean; onSelect: (id: string) => void; isSelected: boolean }> = ({ isPaused, simulationSpeed, showOrbit, onSelect, isSelected }) => {
  const stationRef = useRef<Group>(null);
  const solarPanelRef = useRef<Group>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
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

    // Breathing Light Effect
    if (materialRef.current) {
        if (isSelected || hovered) {
            const t = state.clock.elapsedTime;
            materialRef.current.emissive.set(TIANGONG_DATA.color);
            // Metallic breathing: 0.2 to 0.5 range for higher visibility on metal
            materialRef.current.emissiveIntensity = 0.2 + (Math.sin(t * 3) + 1) * 0.15; 
        } else {
            materialRef.current.emissiveIntensity = 0;
            materialRef.current.emissive.setHex(0x000000);
        }
    }
  });

  return (
    <group rotation={[Math.PI / 6, 0, Math.PI / 4]}>
      <group ref={stationRef}>
        <group position={[1.4, 0, 0]} scale={[0.12, 0.12, 0.12]}>
           
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
                  ref={materialRef}
                  color="#f8f9fa" roughness={0.3} metalness={0.5} 
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
  const materialRef = useRef<MeshPhysicalMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const clickStartRef = useRef({ x: 0, y: 0 });
  
  const textureUrl = useMemo(() => generatePlanetTexture(MOON_DATA), []);
  const texture = useMemo(() => new TextureLoader().load(textureUrl), [textureUrl]);

  useFrame((state, delta) => {
    if (moonRef.current && !isPaused) {
      moonRef.current.rotation.y += delta * 0.2 * simulationSpeed;
    }
    
    // Breathing Light Effect
    if (materialRef.current) {
        if (isSelected || hovered) {
            const t = state.clock.elapsedTime;
            materialRef.current.emissive.set('#FFFFFF');
            // Subtle breathing: 0.05 to 0.2
            materialRef.current.emissiveIntensity = 0.05 + (Math.sin(t * 2.5) + 1) * 0.075; 
        } else {
            materialRef.current.emissiveIntensity = 0;
            materialRef.current.emissive.setHex(0x000000);
        }
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
                ref={materialRef}
                map={texture}
                color="#ffffff" 
                roughness={0.8}
                metalness={0.1}
              />
            </mesh>
            
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
                <Html position={[0, 1.2, 0]} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
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
  const materialRef = useRef<MeshPhysicalMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const clickStartRef = useRef({ x: 0, y: 0 });
  
  const textureUrl = useMemo(() => generatePlanetTexture(data), [data]);
  const texture = useMemo(() => new TextureLoader().load(textureUrl), [textureUrl]);

  useFrame((state, delta) => {
    if (ref.current && !isPaused) {
      ref.current.rotation.y += delta * data.speed * simulationSpeed;
    }

    // Breathing Light Effect
    if (materialRef.current) {
        if (isSelected || hovered) {
            const t = state.clock.elapsedTime;
            materialRef.current.emissive.set(data.color);
            // Breathing: 0.05 to 0.2
            materialRef.current.emissiveIntensity = 0.05 + (Math.sin(t * 2.5) + 1) * 0.075; 
        } else {
            materialRef.current.emissiveIntensity = 0;
            materialRef.current.emissive.setHex(0x000000);
        }
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
            ref={materialRef}
            map={texture}
            color="#ffffff" 
            roughness={0.7}
            metalness={0.1}
          />
          
          {hovered && (
            <Html position={[0, data.size * 1.5, 0]} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
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
  const materialRef = useRef<MeshPhysicalMaterial>(null);
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

    // Breathing Light Effect
    if (materialRef.current) {
        if (isSelected || hovered) {
            const t = state.clock.elapsedTime;
            materialRef.current.emissive.set(data.color);
            // Range: 0.05 to 0.2 (averaging around ~0.125, slightly dynamic)
            materialRef.current.emissiveIntensity = 0.05 + (Math.sin(t * 2.5) + 1) * 0.075; 
        } else {
            materialRef.current.emissiveIntensity = 0;
            materialRef.current.emissive.setHex(0x000000);
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
              ref={materialRef}
              map={texture}
              color="#ffffff" 
              roughness={0.6}
              metalness={0.2}
              clearcoat={0.3}
            />
            
            {/* New Upward Growing Label */}
            {hovered && (
              <Html position={[0, data.size * 1.1, 0]} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
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
              <mesh scale={[data.size * 2.8, data.size * 2.8, 1]} raycast={() => null}>
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

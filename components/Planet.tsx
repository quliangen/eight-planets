
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color, DoubleSide, Vector3, TextureLoader, AdditiveBlending, Object3D, Group, PlaneGeometry, Texture } from 'three';
import { Html, Billboard } from '@react-three/drei';
import { PlanetData } from '../types';
import { generatePlanetTexture, generateRingTexture, generateGenericGlowTexture, generateChinaFlagTexture } from '../utils/textureGenerator';
import { JUPITER_MOONS } from '../constants';

interface PlanetProps {
  data: PlanetData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isPaused: boolean;
  simulationSpeed: number;
  earthPositionRef: React.MutableRefObject<Vector3>;
  planetRefs: React.MutableRefObject<{ [key: string]: Object3D }>;
  isStarshipActive: boolean;
}

// --- Animated Waving Flag Component ---
const AnimatedFlag = ({ texture }: { texture: Texture }) => {
  const meshRef = useRef<Mesh>(null);
  
  // Create geometry with segments for waving
  const geometry = useMemo(() => new PlaneGeometry(1.5, 1.0, 10, 8), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const pos = geometry.attributes.position;
    const count = pos.count;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i); // Local x from -0.75 to 0.75
      
      // Calculate Factor: 0 at Pole (Stars), 1 at Tail
      // PlaneGeometry standard: Left (-0.75) is Stars (UV 0). Right (0.75) is Tail (UV 1).
      // We want amplitude to be 0 at Stars, Max at Tail.
      const factor = (x + 0.75) / 1.5; 
      
      // Wave function: propagate along X
      const wave = Math.sin(x * 5.0 - time * 8.0);
      
      // Apply Z displacement (Flutter)
      const z = wave * 0.1 * factor; 
      
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry} 
      position={[-0.75, 1.1, 0]} 
      scale={[-1, 1, 1]} 
    >
      <meshBasicMaterial 
        map={texture} 
        side={DoubleSide} 
        transparent 
        opacity={0.95} 
      />
    </mesh>
  );
};

// --- 中国空间站 (Tiangong Space Station) ---
const TiangongStation: React.FC<{ isPaused: boolean; simulationSpeed: number }> = ({ isPaused, simulationSpeed }) => {
  const stationRef = useRef<Group>(null);
  const solarPanelRef = useRef<Group>(null);

  // Generate the China flag texture
  const flagUrl = useMemo(() => generateChinaFlagTexture(), []);
  const flagTexture = useMemo(() => new TextureLoader().load(flagUrl), [flagUrl]);

  useFrame((state, delta) => {
    if (stationRef.current && !isPaused) {
      // Reduced speed from 1.5 to 0.8
      stationRef.current.rotation.y += delta * 0.8 * simulationSpeed;
    }
    
    // 太阳翼缓慢调整角度（模拟对日定向）
    if (solarPanelRef.current && !isPaused) {
       // Gentle oscillation
       solarPanelRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    // 轨道倾角：天宫真实倾角约41度，这里视觉上稍微倾斜一点以区别于赤道
    <group rotation={[Math.PI / 6, 0, Math.PI / 4]}>
      <group ref={stationRef}>
        {/* 轨道半径：1.4 (地球表面是0.5, 月球在3.5) */}
        <group position={[1.4, 0, 0]} scale={[0.12, 0.12, 0.12]}> 
           
           {/* --- Q版天宫空间站 (T字构型) --- */}
           {/* Rotation aligns Core along Z axis. Orbit motion is along Local X (Parent -Z tangent) */}
           <group rotation={[0, Math.PI / 2, 0]}>

             {/* 1. 核心舱 Tianhe Core (Center/Back) */}
             {/* Main Cylinder */}
             <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.45, 1.8, 16]} />
                <meshStandardMaterial color="#f8f9fa" roughness={0.3} metalness={0.5} />
             </mesh>
             
             {/* 🇨🇳 Flag on Pole - Optimized Position & Orientation */}
             <group position={[-0.9, 0.5, 0]}>
                {/* Pole - attached to hull area */}
                <mesh position={[0, 0.9, 0]}>
                   <cylinderGeometry args={[0.03, 0.03, 1.8]} />
                   <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
                </mesh>
                
                {/* Animated Flag */}
                <AnimatedFlag texture={flagTexture} />
             </group>

             {/* 2. 节点舱 Node (Intersection Hub) */}
             <mesh position={[0, 0, -0.6]}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.5} />
             </mesh>

             {/* 3. 实验舱 I (Wentian) - Left Arm */}
             <mesh position={[-1.2, 0, -0.6]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.35, 0.4, 1.8, 16]} />
                <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.4} />
             </mesh>

             {/* 4. 实验舱 II (Mengtian) - Right Arm */}
             <mesh position={[1.2, 0, -0.6]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.35, 0.4, 1.8, 16]} />
                <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.4} />
             </mesh>
             
             {/* 5. 载人飞船 Shenzhou (Docked at Front Node) */}
             <group position={[0, 0, -1.4]} rotation={[Math.PI / 2, 0, 0]}>
                 <mesh position={[0, 0.1, 0]}>
                    <cylinderGeometry args={[0.2, 0.3, 0.4, 16]} /> {/* Re-entry */}
                    <meshStandardMaterial color="#cbd5e1" />
                 </mesh>
                 <mesh position={[0, 0.5, 0]}>
                    <sphereGeometry args={[0.22, 16, 16]} /> {/* Orbital */}
                    <meshStandardMaterial color="#e2e8f0" />
                 </mesh>
             </group>

             {/* --- 太阳翼系统 (Solar Wings) --- */}
             <group ref={solarPanelRef}>
               {/* 实验舱末端 巨大太阳翼 (Huge Wings on Labs) */}
               {/* Left Wing */}
               <group position={[-2.3, 0, -0.6]}>
                  <mesh rotation={[0, 0, 0]}>
                     <boxGeometry args={[0.1, 0.05, 1.5]} /> {/* Rod */}
                     <meshStandardMaterial color="#333" />
                  </mesh>
                  <mesh position={[-0.8, 0, 0]}>
                     <boxGeometry args={[1.6, 0.02, 0.8]} /> {/* Panel */}
                     <meshStandardMaterial color="#1e3a8a" roughness={0.2} metalness={0.8} emissive="#172554" emissiveIntensity={0.3} />
                  </mesh>
               </group>

               {/* Right Wing */}
               <group position={[2.3, 0, -0.6]}>
                  <mesh rotation={[0, 0, 0]}>
                     <boxGeometry args={[0.1, 0.05, 1.5]} /> {/* Rod */}
                     <meshStandardMaterial color="#333" />
                  </mesh>
                  <mesh position={[0.8, 0, 0]}>
                     <boxGeometry args={[1.6, 0.02, 0.8]} /> {/* Panel */}
                     <meshStandardMaterial color="#1e3a8a" roughness={0.2} metalness={0.8} emissive="#172554" emissiveIntensity={0.3} />
                  </mesh>
               </group>

               {/* 核心舱 柔性太阳翼 (Core Flexible Wings - Smaller) */}
               <group position={[0, 0, 0.8]}>
                   <mesh position={[1.0, 0, 0]} rotation={[0, 0, -0.2]}>
                       <boxGeometry args={[1.2, 0.02, 0.4]} />
                       <meshStandardMaterial color="#1e40af" roughness={0.2} metalness={0.7} />
                   </mesh>
                   <mesh position={[-1.0, 0, 0]} rotation={[0, 0, 0.2]}>
                       <boxGeometry args={[1.2, 0.02, 0.4]} />
                       <meshStandardMaterial color="#1e40af" roughness={0.2} metalness={0.7} />
                   </mesh>
               </group>
             </group>

           </group>

        </group>
        
        {/* 轨道线 (Orbit Line) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
           <ringGeometry args={[1.38, 1.42, 64]} />
           <meshBasicMaterial color="#38bdf8" opacity={0.3} transparent side={DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};

const Moon: React.FC<{ isPaused: boolean; simulationSpeed: number }> = ({ isPaused, simulationSpeed }) => {
  const moonRef = useRef<Group>(null);
  
  // Create static data for Moon texture generation
  const textureUrl = useMemo(() => generatePlanetTexture({
    id: 'moon',
    name: '月球',
    color: '#CCCCCC',
    size: 0.45,
    distance: 0,
    realDistance: 0,
    speed: 0,
    rotationSpeed: 0,
    description: '',
    textureConfig: {
      type: 'moon',
      colors: ['#F5F5F5', '#D6D6D6', '#A0A0A0']
    }
  }), []);
  
  const texture = useMemo(() => new TextureLoader().load(textureUrl), [textureUrl]);

  useFrame((state, delta) => {
    if (moonRef.current && !isPaused) {
      // Moon orbits Earth (Reduced speed from 0.4 to 0.2)
      moonRef.current.rotation.y += delta * 0.2 * simulationSpeed;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 8]}> {/* Slight inclination of moon orbit */}
      <group ref={moonRef}>
        {/* Moon Object */}
        <mesh position={[3.5, 0, 0]}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshPhysicalMaterial 
            map={texture}
            color="#ffffff" 
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        
        {/* Moon Orbit Path Visual */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
           <ringGeometry args={[3.45, 3.55, 64]} />
           <meshBasicMaterial color="#ffffff" opacity={0.15} transparent side={DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};

// Generic Satellite Component (Used for Jupiter's Moons)
const Satellite: React.FC<{ 
  data: PlanetData;
  isPaused: boolean; 
  simulationSpeed: number;
  onSelect: (id: string) => void;
  isSelected: boolean;
}> = ({ data, isPaused, simulationSpeed, onSelect, isSelected }) => {
  const ref = useRef<Group>(null);
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
    <group ref={ref}>
      {/* Satellite Object */}
      <mesh 
        position={[data.distance, 0, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          clickStartRef.current = { x: e.clientX, y: e.clientY };
        }}
        onClick={(e) => {
          e.stopPropagation();
          // Calculate distance moved
          const dx = e.clientX - clickStartRef.current.x;
          const dy = e.clientY - clickStartRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only trigger select if moved less than 5 pixels (click, not drag)
          if (distance < 5) {
            onSelect(data.id);
          }
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
        <sphereGeometry args={[data.size, 32, 32]} />
        <meshPhysicalMaterial 
          map={texture}
          color="#ffffff" 
          roughness={0.7}
          metalness={0.1}
          emissive={isSelected || hovered ? new Color(data.color) : new Color('#000000')}
          emissiveIntensity={isSelected || hovered ? 0.3 : 0}
        />
        {/* Hover Label for Moon */}
        {hovered && (
          <Html position={[0, data.size + 1.0, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
            <div className="bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border border-white/30 backdrop-blur-sm shadow-lg font-bold">
              {data.name}
            </div>
          </Html>
        )}
      </mesh>
      
      {/* Orbit Path Visual */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
         <ringGeometry args={[data.distance - 0.03, data.distance + 0.03, 64]} />
         <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={DoubleSide} />
      </mesh>
    </group>
  );
};

const JupiterMoons: React.FC<{ 
  isPaused: boolean; 
  simulationSpeed: number; 
  onSelect: (id: string) => void;
  selectedId: string | null;
}> = ({ isPaused, simulationSpeed, onSelect, selectedId }) => {
  
  return (
    <group rotation={[0, 0, 0.05]}> {/* Slight inclination for the whole moon system */}
      {JUPITER_MOONS.map(moon => (
        <Satellite 
          key={moon.id}
          data={moon}
          isPaused={isPaused} 
          simulationSpeed={simulationSpeed}
          onSelect={onSelect}
          isSelected={selectedId === moon.id}
        />
      ))}
    </group>
  );
};

export const Planet: React.FC<PlanetProps> = ({ 
  data, 
  isSelected, 
  onSelect, 
  isPaused,
  simulationSpeed,
  earthPositionRef,
  planetRefs,
  isStarshipActive
}) => {
  const meshRef = useRef<Mesh>(null);
  const orbitGroupRef = useRef<Group>(null);
  const inclinationGroupRef = useRef<Group>(null); // New group for orbital inclination
  const distanceLabelRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  
  // Track click start position to differentiate click from drag
  const clickStartRef = useRef({ x: 0, y: 0 });
  
  // Register this planet to the refs map for the Starship
  useEffect(() => {
    // We register the planet's internal orbit position group (orbitGroupRef)
    // so the starship flies to where the planet IS.
    if (orbitGroupRef.current) {
      planetRefs.current[data.id] = orbitGroupRef.current;
    }
  }, [data.id, planetRefs]);

  // Use a Ref to track orbit angle so we can pause/resume smoothly
  const orbitAngleRef = useRef(Math.random() * Math.PI * 2);

  // Generate SVG Texture for Surface
  const textureUrl = useMemo(() => generatePlanetTexture(data), [data]);
  const texture = useMemo(() => new TextureLoader().load(textureUrl), [textureUrl]);

  // Generate SVG Texture for Rings (if applicable)
  const ringTextureUrl = useMemo(() => {
    return data.hasRings && data.ringColor ? generateRingTexture(data.id, data.ringColor) : null;
  }, [data]);
  const ringTexture = useMemo(() => ringTextureUrl ? new TextureLoader().load(ringTextureUrl) : null, [ringTextureUrl]);

  // Generate Generic Soft Glow Texture for Atmosphere
  const glowTextureUrl = useMemo(() => data.atmosphereColor ? generateGenericGlowTexture() : null, [data.atmosphereColor]);
  const glowTexture = useMemo(() => glowTextureUrl ? new TextureLoader().load(glowTextureUrl) : null, [glowTextureUrl]);

  useFrame((state, delta) => {
    if (!orbitGroupRef.current || !meshRef.current) return;

    if (!isPaused) {
      // Orbit logic - Update Accumulator
      // Reduced base speed multiplier from 0.2 to 0.1 for slower 1x simulation
      orbitAngleRef.current += delta * data.speed * 0.1 * simulationSpeed;
      
      // Counter-Clockwise Revolution:
      // x = cos(angle), z = -sin(angle)
      const x = Math.cos(orbitAngleRef.current) * data.distance;
      const z = -Math.sin(orbitAngleRef.current) * data.distance;
      
      // The orbitGroupRef moves in a flat circle relative to its parent (the Inclination Group)
      orbitGroupRef.current.position.set(x, 0, z);

      // Self rotation logic
      meshRef.current.rotation.y += data.rotationSpeed * simulationSpeed;
      
      // Update Earth's position ref if this is Earth
      // NOTE: We need the WORLD position since we are now nesting groups
      if (data.id === 'earth') {
        // Using getWorldPosition because of the nested groups (inclination > orbit > planet)
        orbitGroupRef.current.getWorldPosition(earthPositionRef.current);
      }
    }
    
    // Update Distance Label continuously while hovered
    if (hovered && distanceLabelRef.current && data.id !== 'earth') {
      // Need world positions for accurate distance
      const thisPos = new Vector3();
      orbitGroupRef.current.getWorldPosition(thisPos);
      
      // earthPositionRef is already tracking Earth's world pos
      const dist = thisPos.distanceTo(earthPositionRef.current);
      if (isNaN(dist)) return;

      const millionKm = dist * 7.14;
      const wanKm = millionKm * 100;
      
      distanceLabelRef.current.innerText = `距离地球: ${Math.round(wanKm).toLocaleString()} 万公里`;
    }
  });

  return (
    // Outer Group: Applies Orbital Inclination (The tilt of the entire orbit path)
    // We rotate around the Z axis to tilt the plane left/right relative to the sun
    <group ref={inclinationGroupRef} rotation={[0, 0, data.orbitInclination || 0]}>
      
      {/* Orbit Path Visual (Ring) - Stays static within the inclined plane */}
      {/* HIDE when Starship is active for cleaner look */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} visible={!isStarshipActive}>
        <ringGeometry args={[data.distance - 0.05, data.distance + 0.05, 128]} />
        <meshBasicMaterial color="#ffffff" opacity={0.35} transparent side={DoubleSide} />
      </mesh>

      {/* The Planet Group - Moves along the orbit path */}
      <group ref={orbitGroupRef}>
        
        {/* Axial Tilt Group - Apply planet's specific self-tilt here */}
        <group rotation={[0, 0, data.axisTilt || 0]}>
          
          {/* Main Planet Sphere - Rotation (Day/Night) happens here */}
          <mesh
            ref={meshRef}
            onPointerDown={(e) => {
              e.stopPropagation();
              clickStartRef.current = { x: e.clientX, y: e.clientY };
            }}
            onClick={(e) => {
              e.stopPropagation();
              // Calculate distance moved
              const dx = e.clientX - clickStartRef.current.x;
              const dy = e.clientY - clickStartRef.current.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              // Only trigger select if moved less than 5 pixels (click, not drag)
              if (distance < 5) {
                onSelect(data.id);
              }
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
            <sphereGeometry args={[data.size, 64, 64]} />
            <meshPhysicalMaterial 
              map={texture}
              color="#ffffff" 
              roughness={0.6}
              metalness={0.2}
              clearcoat={0.3}
              clearcoatRoughness={0.4}
              emissive={isSelected || hovered ? new Color(data.color) : new Color('#000000')}
              emissiveIntensity={isSelected || hovered ? 0.4 : 0}
            />
            
            {/* Planet Label - ONLY SHOW ON HOVER */}
            {hovered && (
              <Html position={[0, data.size + 3.0, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
                <div className="flex flex-col items-center gap-2 pointer-events-none select-none transition-all duration-200">
                  <div className="bg-black/80 text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap border border-white/30 backdrop-blur-sm font-bold shadow-[0_4px_20px_rgba(0,0,0,0.5)] animate-fade-in-up">
                    {data.name}
                  </div>
                  {/* Dynamic Distance Label */}
                  {data.id !== 'earth' && (
                      <div className="bg-blue-600/80 text-blue-50 px-3 py-1 rounded-full text-xs whitespace-nowrap border border-blue-300/50 backdrop-blur-sm shadow-lg font-mono tracking-wide">
                        <span ref={distanceLabelRef}>计算距离...</span>
                      </div>
                  )}
                </div>
              </Html>
            )}
          </mesh>

          {/* Rings - Tilted with the planet */}
          {data.hasRings && ringTexture && (
            // Rotate X by -90 to lay flat relative to the tilted group
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

        {/* --- EARTH SPECIFIC SATELLITES --- */}
        {data.id === 'earth' && (
          <>
            {/* Moon: Placed outside the axial tilt group so it orbits the center of Earth's position */}
            <Moon isPaused={isPaused} simulationSpeed={simulationSpeed} />
            
            {/* Tiangong Space Station: Lower orbit than Moon */}
            <TiangongStation isPaused={isPaused} simulationSpeed={simulationSpeed} />
          </>
        )}

        {/* --- JUPITER SPECIFIC SATELLITES (GALILEAN MOONS) --- */}
        {data.id === 'jupiter' && (
           <JupiterMoons 
             isPaused={isPaused} 
             simulationSpeed={simulationSpeed}
             onSelect={onSelect}
             selectedId={isSelected ? data.id : null} // Simple pass-through check, handled better in App state
           />
        )}

        {/* Atmosphere Glow Shell (Billboard) - Replaced Shader with Sprite/Billboard method */}
        {/* We place it OUTSIDE the tilted group so it stays upright facing the camera properly, but follows position */}
        {data.atmosphereColor && glowTexture && (
           <Billboard>
              {/* Scale it up ~2.8x the planet size for a soft diffuse glow */}
              <mesh scale={[data.size * 2.8, data.size * 2.8, 1]}>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial 
                  map={glowTexture} 
                  transparent 
                  opacity={0.25} // Low opacity for subtle effect
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

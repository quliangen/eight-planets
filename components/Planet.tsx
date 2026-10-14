
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, DoubleSide, Vector3, TextureLoader, AdditiveBlending, Object3D, Group, PlaneGeometry, Texture } from 'three';
import { Html, Billboard } from '@react-three/drei';
import { PlanetData } from '../types';
import { generatePlanetTexture, generateRingTexture, generateChinaFlagTexture } from '../utils/textureGenerator';
import { getSharedGlowTexture } from '../utils/textures';
import { JUPITER_MOONS, SATURN_MOONS, MOON_DATA, TIANGONG_DATA } from '../constants';

interface PlanetProps {
  data: PlanetData;
  onSelect: (id: string) => void;
  onDoubleClick: (id: string) => void;
  isPaused: boolean;
  simulationSpeed: number;
  earthPositionRef: React.MutableRefObject<Vector3>;
  planetRefs: React.MutableRefObject<{ [key: string]: Object3D }>;
  isStarshipActive: boolean;
  showOrbit: boolean;
}

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

const TechLabel: React.FC<{ name: string; color: string }> = ({ name, color }) => {
  const match = name.match(/^(.+?)\s*\((.+?)\)$/);
  const cnName = match ? match[1] : name;
  const enNameRaw = match ? match[2] : '';
  const enName = enNameRaw.replace(/\s+/g, '');

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none w-max">
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

       <div className="flex flex-col items-center relative">
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/40 to-transparent"></div>
          <div className="absolute bottom-0 w-6 h-6 flex items-center justify-center translate-y-1/2">
             <div className="absolute w-full h-full border border-white/20 rounded-full animate-[spin_4s_linear_infinite]"></div>
             <div className="absolute w-[70%] h-[70%] border-l border-r border-white/50 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
             <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]"></div>
          </div>
       </div>
    </div>
  );
};

const TiangongStation: React.FC<{ isPaused: boolean; simulationSpeed: number; onSelect: (id: string) => void; onDoubleClick: (id: string) => void; planetRefs: React.MutableRefObject<{ [key: string]: Object3D }> }> = ({ isPaused, simulationSpeed, onSelect, onDoubleClick, planetRefs }) => {
  const stationRef = useRef<Group>(null);
  const solarWingsRef = useRef<Group>(null);
  const wentianSolarRef = useRef<Group>(null);
  const mengtianSolarRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const clickStartRef = useRef({ x: 0, y: 0 });

  const flagUrl = useMemo(() => generateChinaFlagTexture(), []);
  const flagTexture = useMemo(() => new TextureLoader().load(flagUrl), [flagUrl]);

  // 释放 GPU 纹理（Data URI 纹理不受 useLoader 缓存管理，需手动 dispose）
  useEffect(() => () => flagTexture.dispose(), [flagTexture]);

  const moduleColor = "#f0f2f5"; 
  const dockColor = "#334155";   

  useEffect(() => {
    if (stationRef.current) {
      planetRefs.current[TIANGONG_DATA.id] = stationRef.current;
    }
    // 卸载时清理引用，避免相机/星舰读到幽灵坐标
    return () => { delete planetRefs.current[TIANGONG_DATA.id]; };
  }, [planetRefs]);

  useFrame((state, delta) => {
    if (stationRef.current && !isPaused) {
      stationRef.current.rotation.y += delta * 0.8 * simulationSpeed;
    }
    if (!isPaused) {
       const angle = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
       if (solarWingsRef.current) solarWingsRef.current.rotation.x = angle;
       if (wentianSolarRef.current) wentianSolarRef.current.rotation.x = angle;
       if (mengtianSolarRef.current) mengtianSolarRef.current.rotation.x = angle;
    }
  });

  const commonMaterialProps = {
     roughness: 0.6,
     metalness: 0.8,
     emissive: TIANGONG_DATA.color,
     emissiveIntensity: hovered ? 0.15 : 0,
     color: moduleColor
  };

  return (
    <group rotation={[Math.PI / 6, 0, Math.PI / 4]}>
      <group ref={stationRef} userData={{ id: TIANGONG_DATA.id }}>
        <group position={[2.2, 0, 0]} scale={[0.15, 0.15, 0.15]}>
           {/* Invisible click target. Radius = scale x group scale (0.15) = 0.9 world units:
               generous for the tiny station, but MUST stay well under 1.2 or it engulfs
               Earth (radius 1.0, center 2.2 away) and steals every click aimed at it. */}
           <mesh
             scale={[6, 6, 6]}
             onPointerDown={(e) => { e.stopPropagation(); clickStartRef.current = { x: e.clientX, y: e.clientY }; }}
             onClick={(e) => {
                e.stopPropagation();
                const dx = e.clientX - clickStartRef.current.x;
                const dy = e.clientY - clickStartRef.current.y;
                if (Math.sqrt(dx * dx + dy * dy) < 5) onSelect(TIANGONG_DATA.id);
             }}
             onDoubleClick={(e) => {
                e.stopPropagation();
                onDoubleClick(TIANGONG_DATA.id);
             }}
             onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
             onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
           >
              <sphereGeometry args={[1, 16, 16]} />
              <meshBasicMaterial transparent opacity={0} />
           </mesh>

           <group rotation={[0, Math.PI / 2, 0]}>
             {/* Node Cabin */}
             <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshPhysicalMaterial {...commonMaterialProps} color={dockColor} />
             </mesh>

             {/* Shenzhou (Forward) */}
             <group position={[0, 0, 0.6]}>
                <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                   <cylinderGeometry args={[0.15, 0.15, 0.4, 32]} />
                   <meshPhysicalMaterial {...commonMaterialProps} />
                </mesh>
                <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
                   <cylinderGeometry args={[0.15, 0.2, 0.2, 32]} />
                   <meshPhysicalMaterial {...commonMaterialProps} />
                </mesh>
                <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
                   <cylinderGeometry args={[0.2, 0.2, 0.3, 32]} />
                   <meshPhysicalMaterial {...commonMaterialProps} />
                </mesh>
             </group>

             {/* Shenzhou (Radial / Bottom) */}
             <group position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                   <cylinderGeometry args={[0.15, 0.15, 0.4, 32]} />
                   <meshPhysicalMaterial {...commonMaterialProps} />
                </mesh>
                <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
                   <cylinderGeometry args={[0.15, 0.2, 0.2, 32]} />
                   <meshPhysicalMaterial {...commonMaterialProps} />
                </mesh>
                <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
                   <cylinderGeometry args={[0.2, 0.2, 0.3, 32]} />
                   <meshPhysicalMaterial {...commonMaterialProps} />
                </mesh>
             </group>

             {/* Tianhe Core Module */}
             <group position={[0, 0, -0.8]}>
                <mesh position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
                   <cylinderGeometry args={[0.22, 0.22, 0.8, 32]} />
                   <meshPhysicalMaterial {...commonMaterialProps} />
                </mesh>
                <mesh position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
                   <cylinderGeometry args={[0.22, 0.35, 0.2, 32]} />
                   <meshPhysicalMaterial {...commonMaterialProps} />
                </mesh>
                <mesh position={[0, 0, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
                   <cylinderGeometry args={[0.35, 0.35, 1.0, 32]} />
                   <meshPhysicalMaterial {...commonMaterialProps} />
                </mesh>
                
                {/* Tianhe Solar Panels */}
                <group ref={solarWingsRef} position={[0, 0, -0.7]}>
                  <mesh position={[0.9, 0, 0]}>
                    <boxGeometry args={[1.2, 0.05, 0.4]} />
                    <meshPhysicalMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.5} metalness={1} roughness={0.1} />
                  </mesh>
                  <mesh position={[-0.9, 0, 0]}>
                    <boxGeometry args={[1.2, 0.05, 0.4]} />
                    <meshPhysicalMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.5} metalness={1} roughness={0.1} />
                  </mesh>
                </group>

                {/* Tianzhou Cargo (Rear) */}
                <group position={[0, 0, -1.6]}>
                   <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                      <cylinderGeometry args={[0.35, 0.35, 0.8, 32]} />
                      <meshPhysicalMaterial {...commonMaterialProps} />
                   </mesh>
                   <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
                      <cylinderGeometry args={[0.35, 0.2, 0.2, 32]} />
                      <meshPhysicalMaterial {...commonMaterialProps} />
                   </mesh>
                </group>

                {/* Flag */}
                <group position={[0, 0.5, 0.2]} rotation={[0, Math.PI/2, 0]} scale={[0.8, 0.8, 0.8]}>
                   <mesh position={[0, 0.9, 0]}>
                      <cylinderGeometry args={[0.02, 0.02, 1.8]} />
                      <meshStandardMaterial color="#cbd5e1" roughness={1.0} metalness={0.0} />
                   </mesh>
                   <AnimatedFlag texture={flagTexture} />
                </group>
             </group>

             {/* Wentian Lab Module (+X) */}
             <group position={[1.0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                   <cylinderGeometry args={[0.35, 0.35, 1.6, 32]} />
                   <meshPhysicalMaterial {...commonMaterialProps} />
                </mesh>
                <mesh position={[0, 0, -0.9]} rotation={[Math.PI / 2, 0, 0]}>
                   <cylinderGeometry args={[0.35, 0.25, 0.2, 32]} />
                   <meshPhysicalMaterial {...commonMaterialProps} />
                </mesh>
                {/* Wentian Solar Panels */}
                <group ref={wentianSolarRef} position={[0, 0, -1.0]}>
                  <mesh position={[0, 1.6, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <boxGeometry args={[3.0, 0.05, 0.6]} />
                    <meshPhysicalMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.5} metalness={1} roughness={0.1} />
                  </mesh>
                  <mesh position={[0, -1.6, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <boxGeometry args={[3.0, 0.05, 0.6]} />
                    <meshPhysicalMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.5} metalness={1} roughness={0.1} />
                  </mesh>
                </group>
             </group>

             {/* Mengtian Lab Module (-X) */}
             <group position={[-1.0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                   <cylinderGeometry args={[0.35, 0.35, 1.6, 32]} />
                   <meshPhysicalMaterial {...commonMaterialProps} />
                </mesh>
                <mesh position={[0, 0, -0.9]} rotation={[Math.PI / 2, 0, 0]}>
                   <cylinderGeometry args={[0.35, 0.25, 0.2, 32]} />
                   <meshPhysicalMaterial {...commonMaterialProps} />
                </mesh>
                {/* Mengtian Solar Panels */}
                <group ref={mengtianSolarRef} position={[0, 0, -1.0]}>
                  <mesh position={[0, 1.6, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <boxGeometry args={[3.0, 0.05, 0.6]} />
                    <meshPhysicalMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.5} metalness={1} roughness={0.1} />
                  </mesh>
                  <mesh position={[0, -1.6, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <boxGeometry args={[3.0, 0.05, 0.6]} />
                    <meshPhysicalMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.5} metalness={1} roughness={0.1} />
                  </mesh>
                </group>
             </group>
           </group>
        </group>
        
        {hovered && (
          <Html position={[2.2, 1.0, 0]} style={{ pointerEvents: 'none' }}>
            <TechLabel name={TIANGONG_DATA.name} color={TIANGONG_DATA.color} />
          </Html>
        )}
      </group>
    </group>
  );
};

export const Planet: React.FC<PlanetProps> = ({
  data,
  onSelect,
  onDoubleClick,
  isPaused,
  simulationSpeed,
  earthPositionRef,
  planetRefs,
  isStarshipActive,
  showOrbit
}) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const orbitGroupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const clickStartRef = useRef({ x: 0, y: 0 });

  const textureUrl = useMemo(() => generatePlanetTexture(data), [data]);
  const texture = useMemo(() => new TextureLoader().load(textureUrl), [textureUrl]);

  const ringUrl = useMemo(() => data.hasRings ? generateRingTexture(data.id, data.ringColor || '#ffffff') : null, [data]);
  const ringTexture = useMemo(() => ringUrl ? new TextureLoader().load(ringUrl) : null, [ringUrl]);

  // 共享辉光贴图（模块级单例，所有行星/卫星/引擎共用一份，不要 dispose）
  const glowTexture = getSharedGlowTexture();

  // 行星/环纹理在组件卸载（如冥王星开关）时释放，避免 GPU 内存泄漏
  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => () => { ringTexture?.dispose(); }, [ringTexture]);

  // 基于行星ID生成固定的初始角度 (0-2π)，确保刷新后位置一致
  const initialOrbitAngle = useMemo(() => {
    // 使用行星ID的字符编码生成伪随机数
    let hash = 0;
    for (let i = 0; i < data.id.length; i++) {
      hash = data.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    // 将哈希值转换为 0-2π 的角度
    return ((Math.abs(hash) % 1000) / 1000) * Math.PI * 2;
  }, [data.id]);

  useEffect(() => {
    // 设置初始轨道角度
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y = initialOrbitAngle;
    }
  }, [initialOrbitAngle]);

  useEffect(() => {
    if (meshRef.current) {
      planetRefs.current[data.id] = meshRef.current;
    }
    // 卸载时清理引用，避免相机/星舰读到幽灵坐标
    return () => { delete planetRefs.current[data.id]; };
  }, [data.id, planetRefs]);

  useFrame((state, delta) => {
    if (!groupRef.current || isPaused) return;

    const orbitSpeed = data.speed * simulationSpeed;
    const rotationSpeed = data.rotationSpeed * simulationSpeed;

    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += delta * orbitSpeed;
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }

    if (data.id === 'earth' && meshRef.current) {
      meshRef.current.getWorldPosition(earthPositionRef.current);
    }
  });

  return (
    <group ref={groupRef}>
      {/* 轨道倾角：倾斜整个轨道平面（轨道线一起倾斜） */}
      <group rotation={[data.orbitInclination || 0, 0, 0]}>
        {showOrbit && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[data.distance - 0.05, data.distance + 0.05, 128]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={DoubleSide} />
          </mesh>
        )}

        <group ref={orbitGroupRef}>
          <group position={[data.distance, 0, 0]}>
            {/* 轴倾角：行星本体与光环共享同一赤道平面 */}
            <group rotation={[data.axisTilt || 0, 0, 0]}>
              <mesh
                ref={meshRef}
                userData={{ id: data.id }}
                onPointerDown={(e) => { e.stopPropagation(); clickStartRef.current = { x: e.clientX, y: e.clientY }; }}
                onClick={(e) => {
                  e.stopPropagation();
                  const dx = e.clientX - clickStartRef.current.x;
                  const dy = e.clientY - clickStartRef.current.y;
                  if (Math.sqrt(dx * dx + dy * dy) < 5) onSelect(data.id);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onDoubleClick(data.id);
                }}
                onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
              >
                <sphereGeometry args={[data.size, 64, 64]} />
                <meshStandardMaterial map={texture} roughness={0.8} metalness={0.2} />
              </mesh>

              {data.hasRings && ringTexture && (
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[data.size * 1.4, data.size * 2.8, 128]} />
                  <meshStandardMaterial map={ringTexture} transparent opacity={0.8} side={DoubleSide} />
                </mesh>
              )}
            </group>

            {data.atmosphereColor && (
              <Billboard>
                <mesh raycast={() => null}>
                  <planeGeometry args={[data.size * 2.5, data.size * 2.5]} />
                  <meshBasicMaterial
                    map={glowTexture}
                    transparent
                    opacity={0.3}
                    blending={AdditiveBlending}
                    color={data.atmosphereColor}
                    depthWrite={false}
                  />
                </mesh>
              </Billboard>
            )}

            {hovered && (
              <Html position={[0, data.size * 1.5, 0]} style={{ pointerEvents: 'none' }}>
                <TechLabel name={data.name} color={data.color} />
              </Html>
            )}

            {data.id === 'earth' && (
              <>
                 <Moon isPaused={isPaused} simulationSpeed={simulationSpeed} onSelect={onSelect} onDoubleClick={onDoubleClick} planetRefs={planetRefs} />
                 <TiangongStation isPaused={isPaused} simulationSpeed={simulationSpeed} onSelect={onSelect} onDoubleClick={onDoubleClick} planetRefs={planetRefs} />
              </>
            )}

            {data.id === 'jupiter' && JUPITER_MOONS.map(moon => (
               <SystemMoon key={moon.id} data={moon} isPaused={isPaused} simulationSpeed={simulationSpeed} onSelect={onSelect} onDoubleClick={onDoubleClick} planetRefs={planetRefs} parentRadius={data.size} />
            ))}

            {data.id === 'saturn' && SATURN_MOONS.map(moon => (
               <SystemMoon key={moon.id} data={moon} isPaused={isPaused} simulationSpeed={simulationSpeed} onSelect={onSelect} onDoubleClick={onDoubleClick} planetRefs={planetRefs} parentRadius={data.size} />
            ))}
          </group>
        </group>
      </group>
    </group>
  );
};

const Moon: React.FC<{ isPaused: boolean; simulationSpeed: number; onSelect: (id: string) => void; onDoubleClick: (id: string) => void; planetRefs: React.MutableRefObject<{ [key: string]: Object3D }> }> = ({ isPaused, simulationSpeed, onSelect, onDoubleClick, planetRefs }) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const clickStartRef = useRef({ x: 0, y: 0 });
  const textureUrl = useMemo(() => generatePlanetTexture(MOON_DATA), []);
  const texture = useMemo(() => new TextureLoader().load(textureUrl), [textureUrl]);

  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(() => {
    if (meshRef.current) planetRefs.current[MOON_DATA.id] = meshRef.current;
    // 卸载时清理引用，避免相机/星舰读到幽灵坐标
    return () => { delete planetRefs.current[MOON_DATA.id]; };
  }, [planetRefs]);

  useFrame((state, delta) => {
    if (groupRef.current && !isPaused) {
      groupRef.current.rotation.y += delta * 0.5 * simulationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        userData={{ id: MOON_DATA.id }}
        position={[3.5, 0, 0]}
        onPointerDown={(e) => { e.stopPropagation(); clickStartRef.current = { x: e.clientX, y: e.clientY }; }}
        onClick={(e) => {
          e.stopPropagation();
          // r3f 的 click 不按拖拽距离过滤，松手前拖过 5px 视为旋转视角，不选中
          const dx = e.clientX - clickStartRef.current.x;
          const dy = e.clientY - clickStartRef.current.y;
          if (Math.sqrt(dx * dx + dy * dy) < 5) onSelect(MOON_DATA.id);
        }}
        onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(MOON_DATA.id); }}
      >
        <sphereGeometry args={[MOON_DATA.size, 32, 32]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
};

const SystemMoon: React.FC<{ data: PlanetData; isPaused: boolean; simulationSpeed: number; onSelect: (id: string) => void; onDoubleClick: (id: string) => void; planetRefs: React.MutableRefObject<{ [key: string]: Object3D }>; parentRadius: number }> = ({ data, isPaused, simulationSpeed, onSelect, onDoubleClick, planetRefs, parentRadius }) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const clickStartRef = useRef({ x: 0, y: 0 });
  const textureUrl = useMemo(() => generatePlanetTexture(data), [data]);
  const texture = useMemo(() => new TextureLoader().load(textureUrl), [textureUrl]);

  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(() => {
    if (meshRef.current) planetRefs.current[data.id] = meshRef.current;
    // 卸载时清理引用，避免相机/星舰读到幽灵坐标
    return () => { delete planetRefs.current[data.id]; };
  }, [data.id, planetRefs]);

  useFrame((state, delta) => {
    if (groupRef.current && !isPaused) {
      groupRef.current.rotation.y += delta * data.speed * simulationSpeed;
    }
  });

  return (
    // rotation.x 承载轨道倾角（如土卫八 0.26），rotation.y 由 useFrame 驱动公转
    <group ref={groupRef} rotation={[data.orbitInclination || 0, 0, 0]}>
      <mesh
        ref={meshRef}
        userData={{ id: data.id }}
        position={[parentRadius + data.distance * 0.8, 0, 0]}
        onPointerDown={(e) => { e.stopPropagation(); clickStartRef.current = { x: e.clientX, y: e.clientY }; }}
        onClick={(e) => {
          e.stopPropagation();
          // r3f 的 click 不按拖拽距离过滤，松手前拖过 5px 视为旋转视角，不选中
          const dx = e.clientX - clickStartRef.current.x;
          const dy = e.clientY - clickStartRef.current.y;
          if (Math.sqrt(dx * dx + dy * dy) < 5) onSelect(data.id);
        }}
        onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(data.id); }}
      >
        <sphereGeometry args={[data.size, 32, 32]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
};

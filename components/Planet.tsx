




import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color, DoubleSide, Vector3, TextureLoader, AdditiveBlending, Object3D, Group } from 'three';
import { Html, Billboard } from '@react-three/drei';
import { PlanetData } from '../types';
import { generatePlanetTexture, generateRingTexture, generateGenericGlowTexture } from '../utils/textureGenerator';

interface PlanetProps {
  data: PlanetData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isPaused: boolean;
  earthPositionRef: React.MutableRefObject<Vector3>;
  planetRefs: React.MutableRefObject<{ [key: string]: Object3D }>;
}

const Moon: React.FC<{ isPaused: boolean }> = ({ isPaused }) => {
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
      // Moon orbits Earth (faster than Earth orbits Sun)
      moonRef.current.rotation.y += delta * 0.4;
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

export const Planet: React.FC<PlanetProps> = ({ 
  data, 
  isSelected, 
  onSelect, 
  isPaused,
  earthPositionRef,
  planetRefs
}) => {
  const meshRef = useRef<Mesh>(null);
  const orbitGroupRef = useRef<Group>(null);
  const inclinationGroupRef = useRef<Group>(null); // New group for orbital inclination
  const distanceLabelRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  
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
      orbitAngleRef.current += delta * data.speed * 0.2;
      
      // Counter-Clockwise Revolution:
      // x = cos(angle), z = -sin(angle)
      const x = Math.cos(orbitAngleRef.current) * data.distance;
      const z = -Math.sin(orbitAngleRef.current) * data.distance;
      
      // The orbitGroupRef moves in a flat circle relative to its parent (the Inclination Group)
      orbitGroupRef.current.position.set(x, 0, z);

      // Self rotation logic
      meshRef.current.rotation.y += data.rotationSpeed;
      
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
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
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
            onClick={(e) => {
              e.stopPropagation();
              onSelect(data.id);
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
                  <div className="bg-black/80 text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap border border-white/30 backdrop-blur-md font-bold shadow-[0_4px_20px_rgba(0,0,0,0.5)] animate-fade-in-up">
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

        {/* Moon: If this is Earth, render the Moon orbiting it */}
        {/* Placed outside the axial tilt group so it orbits the center of Earth's position, but with its own inclination */}
        {data.id === 'earth' && <Moon isPaused={isPaused} />}

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


import React, { useRef, useMemo, useState, useLayoutEffect, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Mesh, Color, ShaderMaterial, Vector3, AdditiveBlending, TextureLoader, TorusGeometry, DoubleSide, Group, Object3D } from 'three';
import { Billboard, Html, shaderMaterial } from '@react-three/drei';
import { generateSunGlowTexture } from '../utils/textureGenerator';
import { SUN_DATA } from '../constants';

interface SunProps {
  onSelect: (id: string) => void;
  onDoubleClick: (id: string) => void;
  isSelected: boolean;
  isPaused: boolean;
  simulationSpeed: number;
  planetRefs: React.MutableRefObject<{ [key: string]: Object3D }>;
}

// --- 1. SUN SURFACE SHADER ---
const SunShaderMaterial = shaderMaterial(
  { 
    uTime: 0, 
    uColorPrimary: new Color('#FFD700'),   
    uColorSecondary: new Color('#FF4500'), 
    uColorSunspot: new Color('#000000'),   
    uColorPenumbra: new Color('#8B0000'),  
    uColorBright: new Color('#FFFFFF')     
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColorPrimary;
    uniform vec3 uColorSecondary;
    uniform vec3 uColorSunspot;
    uniform vec3 uColorPenumbra;
    uniform vec3 uColorBright;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;

    // Ashima 3D Noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) { 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; 
      vec3 x3 = x0 - D.yyy;      
      i = mod289(i); 
      vec4 p = permute( permute( permute( 
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857; 
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z); 
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      // Noise
      float noiseScaleA = 6.0;
      float timeScaleA = 0.1;
      float n1 = snoise(vPosition * noiseScaleA + vec3(uTime * timeScaleA));
      float noiseScaleB = 2.0;
      float timeScaleB = 0.05;
      float n2 = snoise(vPosition * noiseScaleB - vec3(uTime * timeScaleB));
      float combinedNoise = n1 * 0.4 + n2 * 0.6; 
      float t = combinedNoise * 0.5 + 0.5;

      // Sunspots
      float umbraThreshold = 0.035;     
      float penumbraThreshold = 0.08; 
      float maskUmbra = smoothstep(umbraThreshold - 0.03, umbraThreshold + 0.02, t); 
      float maskPenumbra = smoothstep(penumbraThreshold - 0.04, penumbraThreshold + 0.04, t);

      float filamentNoise = snoise(vPosition * 12.0 + vec3(uTime * 0.02));
      vec3 detailedPenumbra = mix(uColorPenumbra, uColorSecondary * 0.8, filamentNoise * 0.4 + 0.4);

      vec3 surfaceColor = mix(uColorSecondary, uColorPrimary, t);
      
      float brightThreshold = 0.88; 
      float maskBright = smoothstep(brightThreshold, brightThreshold + 0.15, t);
      vec3 activeColor = mix(surfaceColor, uColorBright, maskBright);

      vec3 spotRegionColor = mix(detailedPenumbra, activeColor, maskPenumbra);
      vec3 finalBaseColor = mix(uColorSunspot, spotRegionColor, maskUmbra);

      // Limb Darkening
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = dot(vNormal, viewDir); 
      float darkening = pow(fresnel, 0.45); 
      
      float rim = 1.0 - fresnel;
      vec3 rimColor = uColorPrimary * pow(rim, 3.5) * 0.8;

      gl_FragColor = vec4(finalBaseColor * darkening + rimColor, 1.0);
    }
  `
);

extend({ SunShaderMaterial });

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

export const Sun: React.FC<SunProps> = ({ onSelect, onDoubleClick, isSelected, isPaused, simulationSpeed, planetRefs }) => {
  const rotationGroupRef = useRef<Group>(null); // For rotating visuals
  const materialRef = useRef<ShaderMaterial>(null);
  const glowMeshRef1 = useRef<Mesh>(null);
  const glowMeshRef2 = useRef<Mesh>(null);
  const coronaMeshRef = useRef<Mesh>(null);
  const mainGroupRef = useRef<Group>(null);

  const [hovered, setHovered] = useState(false);
  const clickStartRef = useRef({ x: 0, y: 0 });

  const glowUrl = useMemo(() => generateSunGlowTexture(), []);
  const glowTexture = useMemo(() => new TextureLoader().load(glowUrl), [glowUrl]);

  // Force disable raycast on Glow Meshes
  useLayoutEffect(() => {
     if (glowMeshRef1.current) glowMeshRef1.current.raycast = () => null;
     if (glowMeshRef2.current) glowMeshRef2.current.raycast = () => null;
     if (coronaMeshRef.current) coronaMeshRef.current.raycast = () => null;
  }, []);
  
  // Register Sun in planetRefs so camera can focus on it
  useEffect(() => {
    if (mainGroupRef.current) {
        planetRefs.current['sun'] = mainGroupRef.current;
    }
  }, [planetRefs]);

  useFrame((state, delta) => {
    if (rotationGroupRef.current && !isPaused) {
      // Rotate visuals
      rotationGroupRef.current.rotation.y += delta * 0.002 * simulationSpeed;
    }
    
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * simulationSpeed;
    }
  });

  return (
    <group ref={mainGroupRef}>
      {/* 1. VISUAL GROUP (Rotates, Has No Events) */}
      <group ref={rotationGroupRef}>
          {/* Main Sun Body Visual */}
          <mesh raycast={() => null}>
            <sphereGeometry args={[SUN_DATA.size, 128, 128]} /> 
            {/* @ts-ignore */}
            <sunShaderMaterial 
               ref={materialRef}
               uColorPrimary={new Color('#FFD700')}   
               uColorSecondary={new Color('#FF4500')} 
               uColorSunspot={new Color('#000000')}   
               uColorPenumbra={new Color('#8B0000')}  
               uColorBright={new Color('#FFFFFF')}    
            />
          </mesh>
      </group>

      {/* 2. INTERACTION HITBOX (Fixed Hit Area for Sun Selection) */}
      <mesh 
        visible={false} // Invisible hitbox
        onPointerDown={(e) => { e.stopPropagation(); clickStartRef.current = { x: e.clientX, y: e.clientY }; }}
        onClick={(e) => {
          e.stopPropagation();
          const dx = e.clientX - clickStartRef.current.x;
          const dy = e.clientY - clickStartRef.current.y;
          if (Math.sqrt(dx * dx + dy * dy) < 5) onSelect(SUN_DATA.id);
        }}
        onDoubleClick={(e) => {
            e.stopPropagation();
            onDoubleClick(SUN_DATA.id);
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
      >
         {/* Slightly larger than visual sun to make it easier to click, but smaller than glow */}
         <sphereGeometry args={[SUN_DATA.size * 1.01, 32, 32]} />
         <meshBasicMaterial color="red" />
      </mesh>
      
      {/* 3. GLOW LAYERS (Non-Interactive Siblings) */}
      <Billboard>
         {/* Inner Bright Glow */}
         <mesh ref={glowMeshRef1} position={[0, 0, -0.1]} raycast={() => null}>
            <planeGeometry args={[SUN_DATA.size * 2.8, SUN_DATA.size * 2.8]} />
            <meshBasicMaterial map={glowTexture} transparent opacity={0.6} depthWrite={false} blending={AdditiveBlending} color="#FFD700" />
         </mesh>
         
         {/* Mid Orange Glow */}
         <mesh ref={glowMeshRef2} position={[0, 0, -0.2]} raycast={() => null}>
            <planeGeometry args={[SUN_DATA.size * 5.5, SUN_DATA.size * 5.5]} />
            <meshBasicMaterial map={glowTexture} transparent opacity={0.4} depthWrite={false} blending={AdditiveBlending} color="#FF4500" />
         </mesh>

         {/* Outer Corona / Solar Wind Haze (New Layer) */}
         <mesh ref={coronaMeshRef} position={[0, 0, -0.3]} raycast={() => null}>
             <planeGeometry args={[SUN_DATA.size * 9.0, SUN_DATA.size * 9.0]} />
             <meshBasicMaterial 
                map={glowTexture} 
                transparent 
                opacity={0.15} 
                depthWrite={false} 
                blending={AdditiveBlending} 
                color="#FFFFFF" // White-hot outer corona
             />
         </mesh>
      </Billboard>

      {/* Tech Style Hover Label (Main Sun Label) */}
      {hovered && (
        <Html position={[0, SUN_DATA.size * 1.1, 0]} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
           <TechLabel name={SUN_DATA.name} color="#FFD700" />
        </Html>
      )}
    </group>
  );
};

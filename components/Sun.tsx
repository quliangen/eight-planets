
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

// --- 2. PLASMA PROMINENCE SHADER ---
const ProminenceShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorCore: new Color('#FFDD44'), 
    uColorEdge: new Color('#FF4500'), 
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vNoise;
    uniform float uTime;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec3 newPos = position + normal * (sin(uv.x * 10.0 + uTime * 2.0) * 0.02);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColorCore;
    uniform vec3 uColorEdge;
    varying vec2 vUv;

    float random (in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      float flowSpeed = 2.0;
      float noiseVal = noise(vec2(vUv.x * 8.0 - uTime * flowSpeed, vUv.y * 3.0));
      float strands = smoothstep(0.3, 0.7, noiseVal);
      vec3 color = mix(uColorEdge, uColorCore, strands);
      
      float fade = sin(vUv.x * 3.14159);
      fade = pow(fade, 0.5); 
      
      float alpha = fade * 0.8;
      float volume = 1.0 - abs(vUv.y - 0.5) * 2.0;
      alpha *= smoothstep(0.0, 0.2, volume);

      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ SunShaderMaterial, ProminenceShaderMaterial });

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

// --- New Feature: Prominence Warning Label ---
const ProminenceLabel = () => {
    return (
        <div className="flex flex-col items-start pointer-events-none">
            <div className="flex items-center gap-2 bg-red-900/80 border border-red-500/50 backdrop-blur-md px-3 py-1.5 rounded-sm animate-fade-in origin-bottom-left transform scale-90 sm:scale-100">
                <span className="text-lg animate-pulse">🔥</span>
                <div className="flex flex-col">
                    <span className="text-white font-bold text-xs sm:text-sm whitespace-nowrap tracking-wide">日珥 (Prominence)</span>
                    <span className="text-[9px] text-red-200 font-mono leading-none">HIGH ENERGY PLASMA</span>
                </div>
            </div>
            <div className="w-[1px] h-6 bg-red-500/50 ml-3"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full ml-[10px] shadow-[0_0_10px_#ef4444] animate-ping"></div>
        </div>
    );
};

// --- Prominence Component ---
const Prominence: React.FC<{ 
  radius: number; 
  angle: number; 
  latitude: number;
  scale: number;
  simulationSpeed: number;
  isPaused: boolean;
}> = ({ radius, angle, latitude, scale, simulationSpeed, isPaused }) => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const [hovered, setHovered] = useState(false);
  
  // CRITICAL: Ensure prominence visual mesh does NOT block raycasting
  // But we want to attach a specific "trigger" mesh for the label
  useLayoutEffect(() => {
    if (meshRef.current) {
        meshRef.current.raycast = () => null;
    }
  }, []);
  
  useFrame((state, delta) => {
    if (!isPaused) {
       if (materialRef.current) {
         materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * simulationSpeed;
       }
       if (meshRef.current) {
          meshRef.current.rotation.x = latitude + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
       }
    }
  });

  const tubeRadius = radius * 0.015; 
  const loopRadius = radius * 0.15; 
  const arcLength = Math.PI; 

  return (
    <group rotation={[0, angle, 0]}>
      <group rotation={[latitude, 0, 0]}>
         {/* The Visual Plasma Loop */}
         <mesh ref={meshRef} position={[radius * 0.98, 0, 0]} rotation={[0, 0, Math.PI / 2]} raycast={() => null}>
            <torusGeometry args={[loopRadius, tubeRadius, 16, 64, arcLength]} />
            {/* @ts-ignore */}
            <prominenceShaderMaterial
                ref={materialRef}
                transparent={true}
                side={DoubleSide}
                blending={AdditiveBlending}
                depthWrite={false} 
            />
         </mesh>

         {/* 🎯 Interactive Hotspot at the tip of the prominence */}
         {/* Positioned at radius + loopHeight to float above the surface */}
         <mesh 
            position={[radius * 1.15, 0, 0]} 
            visible={false} 
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'help'; }}
            onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
         >
             <sphereGeometry args={[radius * 0.1, 8, 8]} />
             <meshBasicMaterial color="red" wireframe />
             
             {/* Reticle / Hint Marker always visible */}
             <Html center distanceFactor={15} occlude>
                <div className={`transition-all duration-300 ${hovered ? 'scale-110 opacity-100' : 'scale-100 opacity-60 hover:opacity-100'}`}>
                    {hovered ? (
                        <ProminenceLabel />
                    ) : (
                        // Resting state: A pulsating target reticle
                        <div className="relative w-8 h-8 flex items-center justify-center pointer-events-none">
                             <div className="absolute inset-0 border border-red-500/60 rounded-full animate-ping"></div>
                             <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></div>
                             {/* Small text hint below */}
                             <div className="absolute top-8 text-[8px] font-mono text-red-400 whitespace-nowrap bg-black/50 px-1 rounded">?</div>
                        </div>
                    )}
                </div>
             </Html>
         </mesh>
      </group>
    </group>
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

          {/* Prominences - Now contain their own labels */}
          <Prominence 
            radius={SUN_DATA.size} angle={0} latitude={0.2} scale={1.2} 
            simulationSpeed={simulationSpeed} isPaused={isPaused} 
          />
          <Prominence 
            radius={SUN_DATA.size} angle={2.5} latitude={-0.3} scale={1.5} 
            simulationSpeed={simulationSpeed} isPaused={isPaused} 
          />
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

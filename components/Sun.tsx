
import React, { useRef, useMemo, useState, useLayoutEffect, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Mesh, Color, ShaderMaterial, AdditiveBlending, TextureLoader, Group, Object3D } from 'three';
import { Billboard, Html, shaderMaterial } from '@react-three/drei';
import { generateSunGlowTexture } from '../utils/textureGenerator';
import { SUN_DATA } from '../constants';
import TechLabel from './TechLabel';

interface SunProps {
  onSelect: (id: string) => void;
  onDoubleClick: (id: string) => void;
  isPaused: boolean;
  simulationSpeed: number;
  planetRefs: React.MutableRefObject<{ [key: string]: Object3D }>;
}

const SunShaderMaterial = shaderMaterial(
  { 
    uTime: 0, 
    uColorPrimary: new Color('#FFD700'),   
    uColorSecondary: new Color('#FF4500'), 
    uColorSunspot: new Color('#000000'),   
    uColorPenumbra: new Color('#8B0000'),  
    uColorBright: new Color('#FFFFFF')     
  },
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
      float noiseScaleA = 6.0;
      float timeScaleA = 0.1;
      float n1 = snoise(vPosition * noiseScaleA + vec3(uTime * timeScaleA));
      float noiseScaleB = 2.0;
      float timeScaleB = 0.05;
      float n2 = snoise(vPosition * noiseScaleB - vec3(uTime * timeScaleB));
      float combinedNoise = n1 * 0.4 + n2 * 0.6; 
      float t = combinedNoise * 0.5 + 0.5;

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

// JSX 传参必须引用稳定对象：每次 render new Color 会产生无意义的 uniform 更新
const SUN_COLOR_PRIMARY = new Color('#FFD700');
const SUN_COLOR_SECONDARY = new Color('#FF4500');
const SUN_COLOR_SUNSPOT = new Color('#000000');
const SUN_COLOR_PENUMBRA = new Color('#8B0000');
const SUN_COLOR_BRIGHT = new Color('#FFFFFF');

export const Sun: React.FC<SunProps> = ({ onSelect, onDoubleClick, isPaused, simulationSpeed, planetRefs }) => {
  const rotationGroupRef = useRef<Group>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const glowMeshRef1 = useRef<Mesh>(null);
  const glowMeshRef2 = useRef<Mesh>(null);
  const coronaMeshRef = useRef<Mesh>(null);
  const mainGroupRef = useRef<Group>(null);

  const [hovered, setHovered] = useState(false);
  const clickStartRef = useRef({ x: 0, y: 0 });

  const glowUrl = useMemo(() => generateSunGlowTexture(), []);
  const glowTexture = useMemo(() => new TextureLoader().load(glowUrl), [glowUrl]);

  useLayoutEffect(() => {
     if (glowMeshRef1.current) glowMeshRef1.current.raycast = () => null;
     if (glowMeshRef2.current) glowMeshRef2.current.raycast = () => null;
     if (coronaMeshRef.current) coronaMeshRef.current.raycast = () => null;
  }, []);
  
  useEffect(() => {
    if (mainGroupRef.current) {
        planetRefs.current['sun'] = mainGroupRef.current;
    }
    // 卸载时清理引用，保持一致性
    return () => { delete planetRefs.current['sun']; };
  }, [planetRefs]);

  useFrame((state, delta) => {
    if (rotationGroupRef.current && !isPaused) {
      rotationGroupRef.current.rotation.y += delta * 0.002 * simulationSpeed;
    }
    
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * simulationSpeed;
    }
  });

  return (
    <group ref={mainGroupRef}>
      <group ref={rotationGroupRef}>
          <mesh raycast={() => null}>
            {/* 表面细节全在 fragment shader，顶点无位移，64 段已足够平滑（原 128 浪费 4 倍顶点） */}
            <sphereGeometry args={[SUN_DATA.size, 64, 64]} />
            {/* @ts-ignore */}
            <sunShaderMaterial
               ref={materialRef}
               uColorPrimary={SUN_COLOR_PRIMARY}
               uColorSecondary={SUN_COLOR_SECONDARY}
               uColorSunspot={SUN_COLOR_SUNSPOT}
               uColorPenumbra={SUN_COLOR_PENUMBRA}
               uColorBright={SUN_COLOR_BRIGHT}
            />
          </mesh>
      </group>

      <mesh
        userData={{ id: SUN_DATA.id }}
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
         <sphereGeometry args={[SUN_DATA.size * 1.05, 32, 32]} />
         <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      <Billboard>
         <mesh ref={glowMeshRef1} position={[0, 0, -0.1]} raycast={() => null}>
            <planeGeometry args={[SUN_DATA.size * 2.8, SUN_DATA.size * 2.8]} />
            <meshBasicMaterial map={glowTexture} transparent opacity={0.6} depthWrite={false} blending={AdditiveBlending} color="#FFD700" />
         </mesh>
         
         <mesh ref={glowMeshRef2} position={[0, 0, -0.2]} raycast={() => null}>
            <planeGeometry args={[SUN_DATA.size * 5.5, SUN_DATA.size * 5.5]} />
            <meshBasicMaterial map={glowTexture} transparent opacity={0.4} depthWrite={false} blending={AdditiveBlending} color="#FF4500" />
         </mesh>

         <mesh ref={coronaMeshRef} position={[0, 0, -0.3]} raycast={() => null}>
             <planeGeometry args={[SUN_DATA.size * 9.0, SUN_DATA.size * 9.0]} />
             <meshBasicMaterial 
                map={glowTexture} 
                transparent 
                opacity={0.15} 
                depthWrite={false} 
                blending={AdditiveBlending} 
                color="#FFFFFF" 
             />
         </mesh>
      </Billboard>

      {hovered && (
        <Html position={[0, SUN_DATA.size * 1.1, 0]} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
           <TechLabel name={SUN_DATA.name} color="#FFD700" />
        </Html>
      )}
    </group>
  );
};

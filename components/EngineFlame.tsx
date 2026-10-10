
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  Group,
  LatheGeometry,
  MathUtils,
  PointLight,
  ShaderMaterial,
  Sprite,
  TextureLoader,
  Vector2,
} from 'three';
import { generateGenericGlowTexture } from '../utils/textureGenerator';

interface EngineFlameProps {
  speedRef: React.MutableRefObject<number>;
  maxSpeed: number;
  position?: [number, number, number];
  scale?: number;
}

const FLAME_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Layered methalox-style exhaust plume:
// - color ramp: white-hot core -> cyan -> deep violet tail
// - fbm turbulence scrolls nozzle->tail and erodes the plume edge (ragged dissipation)
// - mach diamonds: periodic shock-compression brightening near the nozzle
// - high-frequency flicker + slow breathing, all scaled by throttle
const FLAME_FRAG = /* glsl */ `
uniform float uTime;
uniform float uThrottle;
uniform float uIntensity;
uniform float uErode;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  float t = vUv.y; // 0 = nozzle exit, 1 = tail tip

  // Seamless turbulence: sample noise on a circle around the plume, scroll with time
  float ang = vUv.x * 6.2831853;
  float n = fbm(vec2(cos(ang) * 2.2 + t * 2.5, sin(ang) * 2.2 - uTime * 2.8));

  // Plume body: solid near the nozzle, noise-eroded toward the tail
  float body = 1.0 - t;
  float alpha = smoothstep(0.0, 0.3, body + (n - 0.5) * uErode * (0.35 + t));
  alpha *= 0.55 + 0.45 * uThrottle;

  // Color ramp
  vec3 col = mix(uColorA, uColorB, smoothstep(0.02, 0.30, t));
  col = mix(col, uColorC, smoothstep(0.35, 0.95, t));

  // Mach diamonds near the nozzle
  float diamonds = pow(0.5 + 0.5 * sin(t * 60.0 - 1.2), 16.0) * smoothstep(0.55, 0.05, t);
  col += vec3(0.55, 0.75, 1.0) * diamonds * 0.9;

  // Flicker + breathing
  float flicker = 0.82 + 0.13 * sin(uTime * 43.0 + n * 12.0) + 0.05 * sin(uTime * 7.3);
  float power = uIntensity * (0.35 + 0.65 * uThrottle) * flicker;

  gl_FragColor = vec4(col * power, alpha);
}
`;

// Teardrop plume profile (radius, y) from nozzle exit (0) to tail tip
const OUTER_PROFILE: Array<[number, number]> = [
  [0.085, 0.0],
  [0.125, -0.12],
  [0.135, -0.3],
  [0.115, -0.6],
  [0.085, -0.95],
  [0.05, -1.35],
  [0.018, -1.75],
  [0.0, -2.1],
];

const INNER_PROFILE: Array<[number, number]> = [
  [0.04, 0.0],
  [0.055, -0.15],
  [0.045, -0.45],
  [0.025, -0.8],
  [0.0, -1.15],
];

export const EngineFlame: React.FC<EngineFlameProps> = ({ speedRef, maxSpeed, position = [0, -0.98, 0], scale = 1 }) => {
  const plumeRef = useRef<Group>(null);
  const lightRef = useRef<PointLight>(null);
  const glowRef = useRef<Sprite>(null);
  const timeRef = useRef(Math.random() * 100);
  const throttleRef = useRef(1);

  const outerGeometry = useMemo(
    () => new LatheGeometry(OUTER_PROFILE.map(([r, y]) => new Vector2(r, y)), 24),
    []
  );
  const innerGeometry = useMemo(
    () => new LatheGeometry(INNER_PROFILE.map(([r, y]) => new Vector2(r, y)), 20),
    []
  );

  // Layer 1: outer plume — wide, heavily eroded, violet-tipped
  const outerMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: FLAME_VERT,
        fragmentShader: FLAME_FRAG,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uThrottle: { value: 1 },
          uIntensity: { value: 0.9 },
          uErode: { value: 0.95 },
          uColorA: { value: new Color('#eaf7ff') },
          uColorB: { value: new Color('#38bdf8') },
          uColorC: { value: new Color('#7c3aed') },
        },
      }),
    []
  );

  // Layer 2: inner core — narrow, dense, white-hot, barely eroded
  const innerMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: FLAME_VERT,
        fragmentShader: FLAME_FRAG,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uThrottle: { value: 1 },
          uIntensity: { value: 1.5 },
          uErode: { value: 0.3 },
          uColorA: { value: new Color('#ffffff') },
          uColorB: { value: new Color('#a5f3fc') },
          uColorC: { value: new Color('#22d3ee') },
        },
      }),
    []
  );

  const glowTexture = useMemo(() => new TextureLoader().load(generateGenericGlowTexture()), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    timeRef.current += dt;

    // Throttle follows ship speed (keeps a small idle flame while orbiting)
    const targetThrottle = MathUtils.clamp(speedRef.current / maxSpeed, 0.12, 1);
    throttleRef.current = MathUtils.lerp(throttleRef.current, targetThrottle, 1 - Math.exp(-4 * dt));

    const t = timeRef.current;
    const throttle = throttleRef.current;
    outerMaterial.uniforms.uTime.value = t;
    outerMaterial.uniforms.uThrottle.value = throttle;
    innerMaterial.uniforms.uTime.value = t;
    innerMaterial.uniforms.uThrottle.value = throttle;

    // Plume stretches with thrust
    if (plumeRef.current) {
      plumeRef.current.scale.y = 0.55 + 0.45 * throttle;
    }

    // Nozzle light breathes with the flicker (kept modest — multiple engines sum up)
    if (lightRef.current) {
      lightRef.current.intensity = 0.8 + 2.2 * throttle + Math.sin(t * 37.0) * 0.3 * throttle;
    }

    // Nozzle glow pulse
    if (glowRef.current) {
      const s = 0.42 + 0.28 * throttle + 0.03 * Math.sin(t * 29.0);
      glowRef.current.scale.set(s, s, 1);
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Layers 1+2: outer plume and inner core (additive double-sided -> volumetric look) */}
      <group ref={plumeRef}>
        <mesh geometry={outerGeometry} material={outerMaterial} />
        <mesh geometry={innerGeometry} material={innerMaterial} />
      </group>

      {/* Layer 3: white-hot glow right at the nozzle exit, always camera-facing */}
      <sprite ref={glowRef} position={[0, -0.04, 0]} scale={[0.5, 0.5, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#a5f3fc"
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </sprite>

      <pointLight ref={lightRef} position={[0, -0.3, 0]} color="#7dd3fc" distance={5} intensity={3} />
    </group>
  );
};

import { Component, Suspense, useCallback, useLayoutEffect, useMemo, type ReactNode } from 'react';
import { useLoader } from '@react-three/fiber';
import {
  BackSide,
  Color,
  NoColorSpace,
  ShaderChunk,
  SRGBColorSpace,
  TextureLoader,
  type WebGLProgramParametersWithUniforms,
} from 'three';

// WebGL 移植自 Three.js 官方 Earth 示例（原为 WebGPU/TSL）：
// https://threejs.org/examples/webgpu_tsl_earth.html
const EARTH_TEXTURES = {
  day: './textures/planets/earth_day_4096.jpg',
  night: './textures/planets/earth_night_4096.jpg',
  data: './textures/planets/earth_bump_roughness_clouds_4096.jpg',
};

const ATMOSPHERE_DAY_COLOR = '#4db2ff';
const ATMOSPHERE_TWILIGHT_COLOR = '#bc490b';

const WORLD_VARYINGS = /* glsl */ `
  varying vec3 vEarthWorldPosition;
  varying vec3 vEarthWorldNormal;
`;

const EARTH_LIGHTING = /* glsl */ `
  float getEarthSunOrientation() {
    vec3 worldNormal = normalize(vEarthWorldNormal);
    vec3 sunDirection = normalize(-vEarthWorldPosition);
    return dot(worldNormal, sunDirection);
  }

  vec3 getEarthAtmosphereColor(float sunOrientation) {
    return mix(
      earthAtmosphereTwilightColor,
      earthAtmosphereDayColor,
      smoothstep(-0.25, 0.75, sunOrientation)
    );
  }

  float getEarthFresnel() {
    vec3 viewDirection = normalize(vEarthWorldPosition - cameraPosition);
    return clamp(1.0 - abs(dot(viewDirection, normalize(vEarthWorldNormal))), 0.0, 1.0);
  }
`;

const EARTH_HEIGHT_FUNCTION = /* glsl */ `
  float getEarthHeight(vec2 earthUv) {
    vec3 packedData = texture2D(earthDataMap, earthUv).rgb;
    return max(packedData.r, smoothstep(0.2, 1.0, packedData.b));
  }
`;

// onBeforeCompile 执行时 shader 内的 #include 尚未展开；这里先在 Three.js
// 的 bump chunk 上完成替换，再整体注入，云层高度才会真正参与凹凸计算。
const EARTH_BUMP_PARS = ShaderChunk.bumpmap_pars_fragment
  .replace(
    'texture2D( bumpMap, vBumpMapUv ).x',
    'getEarthHeight( vBumpMapUv )',
  )
  .replace(
    'texture2D( bumpMap, vBumpMapUv + dSTdx ).x',
    'getEarthHeight( vBumpMapUv + dSTdx )',
  )
  .replace(
    'texture2D( bumpMap, vBumpMapUv + dSTdy ).x',
    'getEarthHeight( vBumpMapUv + dSTdy )',
  );

const EarthFallbackMaterial = () => (
  <meshStandardMaterial color="#195f9d" roughness={0.65} metalness={0.05} />
);

class EarthTextureBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // 单张贴图失败不应让整个 Canvas 卸载，退化为无贴图地球。
    console.warn('Earth textures failed to load; using fallback material.', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const EarthTexturedSurface = () => {
  const [dayTexture, nightTexture, dataTexture] = useLoader(TextureLoader, [
    EARTH_TEXTURES.day,
    EARTH_TEXTURES.night,
    EARTH_TEXTURES.data,
  ]);

  // R3F v8 挂载材质时会把 RGBA/UnsignedByte 纹理统一标成 sRGB。
  // 统一在提交后设置色彩空间，并重新上传 GPU 中的纹理。
  useLayoutEffect(() => {
    dayTexture.colorSpace = SRGBColorSpace;
    nightTexture.colorSpace = SRGBColorSpace;
    // R = 地形高度，G = 粗糙度，B = 云量；数据贴图不能做 sRGB 解码。
    dataTexture.colorSpace = NoColorSpace;

    for (const texture of [dayTexture, nightTexture, dataTexture]) {
      texture.anisotropy = 8;
      texture.needsUpdate = true;
    }
  }, [dayTexture, nightTexture, dataTexture]);

  const handleCompile = useCallback((shader: WebGLProgramParametersWithUniforms) => {
    Object.assign(shader.uniforms, {
      earthNightMap: { value: nightTexture },
      earthDataMap: { value: dataTexture },
      earthAtmosphereDayColor: { value: new Color(ATMOSPHERE_DAY_COLOR) },
      earthAtmosphereTwilightColor: { value: new Color(ATMOSPHERE_TWILIGHT_COLOR) },
    });

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${WORLD_VARYINGS}`)
      .replace('#include <worldpos_vertex>', /* glsl */ `
        #include <worldpos_vertex>
        vEarthWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vEarthWorldNormal = normalize(mat3(modelMatrix) * objectNormal);
      `);

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', /* glsl */ `
        #include <common>
        uniform sampler2D earthNightMap;
        uniform sampler2D earthDataMap;
        uniform vec3 earthAtmosphereDayColor;
        uniform vec3 earthAtmosphereTwilightColor;
        ${WORLD_VARYINGS}
        ${EARTH_LIGHTING}
      `)
      .replace('#include <map_fragment>', /* glsl */ `
        #include <map_fragment>
        vec3 earthData = texture2D(earthDataMap, vMapUv).rgb;
        float earthCloudStrength = smoothstep(0.2, 1.0, earthData.b);
        diffuseColor.rgb = mix(
          diffuseColor.rgb,
          vec3(1.0),
          clamp(earthCloudStrength * 2.0, 0.0, 1.0)
        );
      `)
      .replace('#include <roughnessmap_fragment>', /* glsl */ `
        #include <roughnessmap_fragment>
        float earthPackedRoughness = max(
          earthData.g,
          step(0.01, earthCloudStrength)
        );
        roughnessFactor = mix(0.25, 0.35, earthPackedRoughness);
      `)
      // 与官方 bumpMap(max(terrain, clouds)) 一致，同时给地形和云层添加凹凸。
      .replace('#include <bumpmap_pars_fragment>', `
        ${EARTH_HEIGHT_FUNCTION}
        ${EARTH_BUMP_PARS}
      `)
      // 保留 MeshStandardMaterial 的 PBR 日光与海面高光，在输出阶段混合夜景和大气。
      .replace('#include <opaque_fragment>', /* glsl */ `
        float earthSunOrientation = getEarthSunOrientation();
        float earthDayStrength = smoothstep(-0.25, 0.5, earthSunOrientation);
        vec3 earthNightColor = texture2D(earthNightMap, vMapUv).rgb;
        vec3 earthFinalOutput = mix(earthNightColor, outgoingLight, earthDayStrength);

        float earthAtmosphereMix = clamp(
          smoothstep(-0.5, 1.0, earthSunOrientation) * pow(getEarthFresnel(), 2.0),
          0.0,
          1.0
        );
        earthFinalOutput = mix(
          earthFinalOutput,
          getEarthAtmosphereColor(earthSunOrientation),
          earthAtmosphereMix
        );

        #ifdef OPAQUE
          diffuseColor.a = 1.0;
        #endif
        gl_FragColor = vec4(earthFinalOutput, diffuseColor.a);
      `);
  }, [dataTexture, nightTexture]);

  return (
    <meshStandardMaterial
      map={dayTexture}
      bumpMap={dataTexture}
      bumpScale={1}
      metalness={0}
      roughness={0.35}
      onBeforeCompile={handleCompile}
    />
  );
};

export const EarthSurfaceMaterial = () => (
  // 局部边界：贴图加载期间不阻塞太阳系首帧，失败时也不会卸载整个 Canvas。
  <Suspense fallback={<EarthFallbackMaterial />}>
    <EarthTextureBoundary fallback={<EarthFallbackMaterial />}>
      <EarthTexturedSurface />
    </EarthTextureBoundary>
  </Suspense>
);

const atmosphereVertexShader = /* glsl */ `
  varying vec3 vEarthWorldPosition;
  varying vec3 vEarthWorldNormal;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vEarthWorldPosition = worldPosition.xyz;
    vEarthWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const atmosphereFragmentShader = /* glsl */ `
  uniform vec3 earthAtmosphereDayColor;
  uniform vec3 earthAtmosphereTwilightColor;
  ${WORLD_VARYINGS}
  ${EARTH_LIGHTING}

  void main() {
    float sunOrientation = getEarthSunOrientation();
    float alpha = pow(clamp((1.0 - getEarthFresnel()) / 0.27, 0.0, 1.0), 3.0);
    alpha *= smoothstep(-0.5, 1.0, sunOrientation);

    gl_FragColor = vec4(getEarthAtmosphereColor(sunOrientation), alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const EarthAtmosphere = ({ radius }: { radius: number }) => {
  const uniforms = useMemo(() => ({
    earthAtmosphereDayColor: { value: new Color(ATMOSPHERE_DAY_COLOR) },
    earthAtmosphereTwilightColor: { value: new Color(ATMOSPHERE_TWILIGHT_COLOR) },
  }), []);

  return (
    <mesh scale={1.04} raycast={() => null}>
      <sphereGeometry args={[radius, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        side={BackSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};

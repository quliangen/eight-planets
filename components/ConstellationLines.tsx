import React, { useMemo, useEffect } from 'react';
import { BufferGeometry, Float32BufferAttribute } from 'three';
import { CONSTELLATIONS } from '../utils/textureGenerator';

/**
 * 与 three.js SphereGeometry 相同的 赤经/赤纬 → 球面坐标 公式，
 * 保证 3D 连线端点与烘焙进天空盒贴图的星点逐一对齐。
 */
const raDecToPosition = (raHours: number, decDeg: number, radius: number): [number, number, number] => {
  const phi = (raHours / 24) * Math.PI * 2;
  const theta = ((90 - decDeg) / 180) * Math.PI;
  const sinTheta = Math.sin(theta);
  return [
    -radius * Math.cos(phi) * sinTheta,
    radius * Math.cos(theta),
    radius * Math.sin(phi) * sinTheta,
  ];
};

interface ConstellationLinesProps {
  // 必须略小于天空盒半径(800)，否则与贴图 z-fighting
  radius?: number;
}

/**
 * 星座连线层（默认关闭，由 UI 开关控制）。
 * 不烘焙进贴图的原因：开关切换时无需重新生成整张 2048x1024 星空贴图。
 * 使用方须把本组件放进与天空盒同一个旋转组内，连线才能跟随星空一起转动。
 */
export const ConstellationLines: React.FC<ConstellationLinesProps> = ({ radius = 790 }) => {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    for (const c of CONSTELLATIONS) {
      for (const [a, b] of c.lines) {
        const sa = c.stars[a];
        const sb = c.stars[b];
        positions.push(...raDecToPosition(sa.ra, sa.dec, radius));
        positions.push(...raDecToPosition(sb.ra, sb.dec, radius));
      }
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return geo;
  }, [radius]);

  // AR 模式切换会卸载天空盒（含本层），释放几何体避免泄漏
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry} raycast={() => null}>
      <lineBasicMaterial color="#7FB2FF" transparent opacity={0.35} depthWrite={false} />
    </lineSegments>
  );
};

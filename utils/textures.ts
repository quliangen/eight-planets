import { Texture, TextureLoader } from 'three';
import { generateGenericGlowTexture } from './textureGenerator';

// 全场景共享一份径向辉光贴图：行星大气光晕、引擎喷口、航行灯都在用，
// 每个组件各自 new TextureLoader().load(...) 会白白占用多份显存。
let sharedGlowTexture: Texture | null = null;

export const getSharedGlowTexture = (): Texture => {
  if (!sharedGlowTexture) {
    sharedGlowTexture = new TextureLoader().load(generateGenericGlowTexture());
  }
  return sharedGlowTexture;
};

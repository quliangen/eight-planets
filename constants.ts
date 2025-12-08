
import { PlanetData } from './types';

// Note: Sizes and distances are scaled for visual clarity, not astronomical accuracy.
// realDistance is approximate average distance from Sun in Million km.

export const SUN_DATA: PlanetData = {
  id: 'sun',
  name: '太阳 (The Sun)',
  color: '#FDB813',
  size: 4.5,
  distance: 0,
  realDistance: 0,
  speed: 0,
  rotationSpeed: 0.0005,
  axisTilt: 0.12, 
  orbitInclination: 0,
  description: '我是太阳系的中心，也是唯一会发光的恒星。没有我，地球上就不会有生命。我的肚子很大，能装下130万个地球！',
  temperature: '表面 5,500°C / 核心 1,500万°C',
  composition: '氢 (73%), 氦 (25%)',
  funFact: '太阳发出的光需要走8分20秒才能到达地球。你现在看到的阳光，其实是8分钟前的样子！',
  textureConfig: {
    type: 'sun',
    colors: ['#FFA500', '#FF4500', '#8B0000']
  }
};

export const PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    name: '水星 (Mercury)',
    color: '#A5A5A5', 
    size: 0.8,
    distance: 10,
    realDistance: 58,
    speed: 0.2, 
    rotationSpeed: 0.001, 
    axisTilt: 0.00,
    orbitInclination: 0.12, // ~7 degrees
    description: '我是离太阳最近的行星。我看起来像月球，灰灰的，身上有很多陨石坑。',
    temperature: '430°C / -180°C',
    composition: '岩石和金属',
    funFact: '水星上的一天（从日出到日出）比它的一年还要长！',
    textureConfig: {
      type: 'crater',
      colors: ['#B0B0B0', '#909090', '#707070']
    }
  },
  {
    id: 'venus',
    name: '金星 (Venus)',
    color: '#E3BB76', 
    size: 1.5,
    distance: 15,
    realDistance: 108,
    speed: 0.15, 
    rotationSpeed: -0.0005, 
    axisTilt: 0.05, 
    orbitInclination: 0.06, // ~3.4 degrees
    atmosphereColor: '#FFD700', 
    description: '我被厚厚的黄色云层包裹着，这些云层不仅反射阳光让我变得很亮，还让我变得超级热！',
    temperature: '462°C',
    composition: '二氧化碳 (96%), 岩石',
    funFact: '金星是顺时针自转的，所以在金星上，太阳是从西边升起的！',
    textureConfig: {
      type: 'atmosphere',
      colors: ['#F8E2B0', '#E3BB76', '#D4A96A']
    }
  },
  {
    id: 'earth',
    name: '地球 (Earth)',
    color: '#22A6B3', 
    size: 1.6,
    distance: 21,
    realDistance: 150,
    speed: 0.12, 
    rotationSpeed: 0.005, 
    axisTilt: 0.41, 
    orbitInclination: 0, // Reference plane
    atmosphereColor: '#00BFFF', 
    description: '我们的家园！我有厚厚的大气层保护大家，还有液态水孕育生命。从太空看，我是一颗美丽的蓝色弹珠。',
    temperature: '15°C (平均)',
    composition: '岩石, 水 (71%), 氮气, 氧气',
    funFact: '地球并不是正圆形的，因为自转，它的肚子（赤道）稍微有点凸出来。',
    textureConfig: {
      type: 'earth',
      colors: ['#1E88E5', '#43A047', '#FFFFFF']
    }
  },
  {
    id: 'mars',
    name: '火星 (Mars)',
    color: '#E27B58', 
    size: 1.1,
    distance: 28,
    realDistance: 228,
    speed: 0.08, 
    rotationSpeed: 0.004, 
    axisTilt: 0.44, 
    orbitInclination: 0.03, // ~1.85 degrees
    atmosphereColor: '#FF5722', 
    description: '红色的沙漠星球。我的红色来自于土壤里的铁锈。我的南北两极有冰盖哦！',
    temperature: '-63°C',
    composition: '岩石, 氧化铁 (铁锈)',
    funFact: '火星上的奥林帕斯山是太阳系最高的火山，高度超过21公里。',
    textureConfig: {
      type: 'mars',
      colors: ['#E27B58', '#C05838', '#A04020']
    }
  },
  {
    id: 'jupiter',
    name: '木星 (Jupiter)',
    color: '#C88B3A', 
    size: 4.5,
    distance: 40,
    realDistance: 778,
    speed: 0.04, 
    rotationSpeed: 0.012, 
    axisTilt: 0.05, 
    orbitInclination: 0.02, // ~1.3 degrees
    atmosphereColor: '#FBC02D', 
    description: '巨大的气态行星！我有漂亮的条纹，那是被风拉长的云。我是八大行星里最大的大哥。',
    temperature: '-108°C',
    composition: '氢气, 氦气',
    funFact: '木星的大红斑是一个已经刮了350多年的超级反气旋风暴，能装下整个地球。',
    textureConfig: {
      type: 'banded',
      colors: ['#E3DCCB', '#D6BC98', '#C49C76', '#A67B5B']
    }
  },
  {
    id: 'saturn',
    name: '土星 (Saturn)',
    color: '#E4D5B6', 
    size: 3.8,
    distance: 55,
    realDistance: 1430,
    speed: 0.03, 
    rotationSpeed: 0.01, 
    axisTilt: 0.47, 
    orbitInclination: 0.04, // ~2.48 degrees
    hasRings: true,
    ringColor: '#C5AB6E',
    description: '我是戴着戒指的宝石。我的光环非常漂亮，是由无数小冰块和石头组成的。',
    temperature: '-139°C',
    composition: '氢气, 氦气',
    funFact: '土星的密度比水还小，如果有一个足够大的浴缸，土星会浮在水面上！',
    textureConfig: {
      type: 'banded',
      colors: ['#F4E4BC', '#EAD6A6', '#DCC491']
    }
  },
  {
    id: 'uranus',
    name: '天王星 (Uranus)',
    color: '#ACE5EE', 
    size: 2.5,
    distance: 70,
    realDistance: 2870,
    speed: 0.02, 
    rotationSpeed: 0.008, 
    axisTilt: 1.71, 
    orbitInclination: 0.01, // ~0.77 degrees
    hasRings: true,
    ringColor: '#FFFFFF',
    atmosphereColor: '#71C9CE', 
    description: '我是冰蓝色的，因为我大气层里有甲烷。我很冷，而且是躺着转的！',
    temperature: '-197°C',
    composition: '冰 (水, 氨, 甲烷)',
    funFact: '天王星拥有太阳系中最冷的行星大气层，最低温度可达-224°C。',
    textureConfig: {
      type: 'solid',
      colors: ['#A6E3E9', '#71C9CE']
    }
  },
  {
    id: 'neptune',
    name: '海王星 (Neptune)',
    color: '#4B70DD', 
    size: 2.4,
    distance: 85,
    realDistance: 4500,
    speed: 0.015, 
    rotationSpeed: 0.008, 
    axisTilt: 0.49, 
    orbitInclination: 0.03, // ~1.77 degrees
    atmosphereColor: '#3A5BB8', 
    description: '深蓝色的风暴世界，离太阳最远，非常寒冷。我有太阳系最快的风！',
    temperature: '-201°C',
    composition: '冰 (水, 氨, 甲烷)',
    funFact: '海王星上有太阳系最快的风，时速可达2100公里，是音速的1.5倍以上。',
    textureConfig: {
      type: 'solid',
      colors: ['#3A5BB8', '#2C4496']
    }
  },
  {
    id: 'pluto',
    name: '冥王星 (Pluto)',
    color: '#D4C6AA', 
    size: 0.7, // Smaller than Mercury
    distance: 100, // Far out
    realDistance: 5900,
    speed: 0.01, 
    rotationSpeed: -0.002, 
    axisTilt: 2.1, // ~120 degrees
    orbitInclination: 0.30, // ~17 degrees (Huge inclination!)
    atmosphereColor: '#E0E0E0', 
    description: '我以前是第九大行星，现在是矮行星。我离太阳很远，非常冷。我身上有一个大大的白色爱心图案哦！',
    temperature: '-230°C',
    composition: '岩石, 冰 (氮冰)',
    funFact: '冥王星非常小，比我们的月球还要小。它的一年非常长，相当于地球的248年！',
    textureConfig: {
      type: 'pluto',
      colors: ['#C7B492', '#695144', '#FFFFFF']
    }
  }
];

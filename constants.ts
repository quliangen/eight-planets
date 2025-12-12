
import { PlanetData } from './types';

// Note: Sizes are adjusted for a better "relative realism" suitable for kids.
// While not 1:1 astronomical scale (which would make Earth invisible), 
// the hierarchy (Sun >> Jupiter >> Earth >> Mercury) is much clearer now.

export const SUN_DATA: PlanetData = {
  id: 'sun',
  name: '太阳 (The Sun)',
  color: '#FDB813',
  size: 8.0, // Reduced from 10.0 to 8.0 (0.8x)
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

export const JUPITER_MOONS: PlanetData[] = [
  {
    id: 'io',
    name: '木卫一 (Io)',
    color: '#FAD5A5',
    size: 0.28, 
    distance: 6.0, 
    realDistance: 0.42, 
    speed: 0.8,
    rotationSpeed: 0.01,
    description: '我是太阳系中火山活动最剧烈的星球！因为木星巨大的引力不断拉扯我，我的表面布满了400多座活火山。看起来是不是像一块巨大的起司披萨？',
    temperature: '火山口 1600°C / 表面 -130°C',
    composition: '硅酸盐岩石, 硫磺',
    funFact: '木卫一喷出的火山羽流可以高达500公里！',
    textureConfig: { type: 'io', colors: ['#FAD5A5', '#F96C18', '#FFF'] }
  },
  {
    id: 'europa',
    name: '木卫二 (Europa)',
    color: '#F5F5DC',
    size: 0.25, 
    distance: 9.0,
    realDistance: 0.67,
    speed: 0.5,
    rotationSpeed: 0.008,
    description: '我是一个冰冻的世界，表面非常光滑，布满了红褐色的裂纹。在厚厚的冰层下面，可能隐藏着一个巨大的液态咸水海洋，甚至可能有生命！',
    temperature: '-160°C',
    composition: '冰层, 地下海洋, 岩石核心',
    funFact: '木卫二的地下海洋水量可能比地球上所有海洋加起来还要多两倍！',
    textureConfig: { type: 'europa', colors: ['#F5F5DC', '#C49C76', '#FFF'] }
  },
  {
    id: 'ganymede',
    name: '木卫三 (Ganymede)',
    color: '#7C7368',
    size: 0.45, 
    distance: 13.0,
    realDistance: 1.07,
    speed: 0.3,
    rotationSpeed: 0.005,
    description: '我是太阳系中最大的卫星，个头比水星还要大！我也是唯一拥有自己磁场的卫星。我的表面一半是古老的黑暗陨石坑，一半是年轻的明亮冰脊。',
    temperature: '-163°C',
    composition: '硅酸盐岩石, 冰',
    funFact: '如果你站在木卫三上，你会看到巨大的木星挂在天上，比地球上看到的月亮大15倍！',
    textureConfig: { type: 'ganymede', colors: ['#7C7368', '#C4B9AC', '#FFF'] }
  },
  {
    id: 'callisto',
    name: '木卫四 (Callisto)',
    color: '#524B43',
    size: 0.38, 
    distance: 18.0,
    realDistance: 1.88,
    speed: 0.15,
    rotationSpeed: 0.003,
    description: '我是太阳系中遭受撞击最多的星球，表面布满了密密麻麻的古老陨石坑。我像一颗死寂的冰球，几十亿年来几乎没有发生过变化。',
    temperature: '-139°C',
    composition: '岩石, 冰',
    funFact: '木卫四是这四颗卫星中离木星最远的，所以它受到的辐射最少，可能是未来人类建立基地的候选地。',
    textureConfig: { type: 'callisto', colors: ['#3E3A36', '#8B8680', '#FFF'] }
  }
];

export const SATURN_MOONS: PlanetData[] = [
  {
    id: 'titan',
    name: '土卫六 (Titan)',
    color: '#EDB663',
    size: 0.45, // Comparable to Ganymede/Mercury
    distance: 12.0, // Relative visual distance inside rings or just outside? Usually outside main rings visually
    realDistance: 1.2,
    speed: 0.25,
    rotationSpeed: 0.005,
    atmosphereColor: '#FFA500',
    description: '我是土星最大的卫星，也是太阳系唯一拥有浓厚大气层的卫星！我的天空是橙色的，表面有液态甲烷组成的湖泊和河流。',
    temperature: '-179°C',
    composition: '冰, 岩石, 氮气大气层',
    funFact: '泰坦星的大气层比地球还要厚，如果你装上一对翅膀，也许真的能在那里飞起来！',
    textureConfig: { type: 'titan', colors: ['#D4A050', '#C08535', '#553311'] }
  },
  {
    id: 'enceladus',
    name: '土卫二 (Enceladus)',
    color: '#F0F8FF',
    size: 0.15,
    distance: 5.0,
    realDistance: 0.24,
    speed: 0.6,
    rotationSpeed: 0.01,
    description: '我是一颗非常明亮的冰球，表面洁白光滑。我的南极有像老虎条纹一样的裂缝，会喷出巨大的冰喷泉！',
    temperature: '-198°C',
    composition: '冰, 岩石',
    funFact: '土卫二喷出的冰粒构成了土星最外层的E环，它是太阳系中最反光的星球之一。',
    textureConfig: { type: 'enceladus', colors: ['#FFFFFF', '#E0F7FA', '#81D4FA'] }
  },
  {
    id: 'mimas',
    name: '土卫一 (Mimas)',
    color: '#A9A9A9',
    size: 0.12,
    distance: 3.5,
    realDistance: 0.18,
    speed: 0.8,
    rotationSpeed: 0.01,
    description: '我身上有一个巨大的撞击坑，叫赫歇尔陨石坑。这让我看起来非常像电影里的“死星”！',
    temperature: '-209°C',
    composition: '冰',
    funFact: '那个大坑占据了我身体直径的三分之一，如果再大一点，我可能就被撞碎了！',
    textureConfig: { type: 'mimas', colors: ['#C0C0C0', '#808080', '#505050'] }
  },
   {
    id: 'iapetus',
    name: '土卫八 (Iapetus)',
    color: '#7f7f7f',
    size: 0.2,
    distance: 22.0, // Far out
    realDistance: 3.5,
    speed: 0.1,
    rotationSpeed: 0.002,
    orbitInclination: 0.26, // Notable inclination
    description: '我是“阴阳脸”卫星，一面非常黑，像煤炭；另一面非常白，像雪。我的赤道上还有一道高高的山脊，看起来像核桃。',
    temperature: '-143°C',
    composition: '冰, 碳质物质',
    funFact: '我的黑脸是因为扫过了土星外围的一圈暗色尘埃环。',
    textureConfig: { type: 'iapetus', colors: ['#FFFFFF', '#1a1a1a', '#555555'] }
  }
];

export const PLANETS: PlanetData[] = [
  {
    id: 'mercury',
    name: '水星 (Mercury)',
    color: '#A5A5A5', 
    size: 0.4, // Smallest planet
    distance: 14, // Pushed out slightly due to larger Sun
    realDistance: 58,
    speed: 0.2, 
    rotationSpeed: 0.001, 
    axisTilt: 0.00,
    orbitInclination: 0.12,
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
    size: 0.95, // Almost Earth size
    distance: 20,
    realDistance: 108,
    speed: 0.15, 
    rotationSpeed: -0.0005, 
    axisTilt: 0.05, 
    orbitInclination: 0.06, 
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
    size: 1.0, // Base unit
    distance: 28,
    realDistance: 150,
    speed: 0.12, 
    rotationSpeed: 0.005, 
    axisTilt: 0.41, 
    orbitInclination: 0, 
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
    size: 0.53, // About half of Earth
    distance: 36,
    realDistance: 228,
    speed: 0.08, 
    rotationSpeed: 0.004, 
    axisTilt: 0.44, 
    orbitInclination: 0.03, 
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
    size: 4.2, // Huge!
    distance: 52,
    realDistance: 778,
    speed: 0.04, 
    rotationSpeed: 0.012, 
    axisTilt: 0.05, 
    orbitInclination: 0.02, 
    hasRings: true, // Enabled Rings!
    ringColor: '#BCAFA3', // Dusty Faint Brown
    atmosphereColor: '#FBC02D', 
    description: '巨大的气态行星！我有漂亮的条纹和大红斑。你知道吗？其实我也有光环，只是它们由尘埃组成，非常暗淡。而且我有非常多的卫星朋友！',
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
    color: '#E0D2B4', // More accurate Pale Gold/Beige
    size: 3.6, // Slightly smaller than Jupiter
    distance: 72,
    realDistance: 1430,
    speed: 0.03, 
    rotationSpeed: 0.01, 
    axisTilt: 0.47, 
    orbitInclination: 0.04, 
    hasRings: true,
    ringColor: '#CDBA88', // Light Gold
    atmosphereColor: '#F4E4BC', // Soft Gold Haze
    description: '我是戴着戒指的宝石。我的光环非常漂亮，是由无数小冰块和石头组成的。我也有很多卫星，包括神奇的泰坦星。',
    temperature: '-139°C',
    composition: '氢气, 氦气',
    funFact: '土星的北极有一个神奇的六边形风暴，大得能装下两个地球！',
    textureConfig: {
      type: 'saturn', // New specialized type
      colors: ['#EBE3CC', '#D6C69B', '#C1A976', '#A0957D'] // Pale Cream -> Gold -> Dark Ochre -> Polar Grey
    }
  },
  {
    id: 'uranus',
    name: '天王星 (Uranus)',
    color: '#D1F5F8', // Pale Cyan Base
    size: 2.0, // Ice giant size
    distance: 90,
    realDistance: 2870,
    speed: 0.02, 
    rotationSpeed: 0.008, 
    axisTilt: 1.71, 
    orbitInclination: 0.01, 
    hasRings: true,
    ringColor: '#FFFFFF',
    atmosphereColor: '#D1F5F8', 
    description: '我是冰蓝色的，因为我大气层里有甲烷。我很冷，而且是躺着转的！',
    temperature: '-197°C',
    composition: '冰 (水, 氨, 甲烷)',
    funFact: '天王星拥有太阳系中最冷的行星大气层，最低温度可达-224°C。',
    textureConfig: {
      type: 'uranus', // New realistic type
      colors: ['#D1F5F8', '#A9E2EF', '#91D2E3'] // Pale Cyan -> Mid Cyan -> Deeper Cyan
    }
  },
  {
    id: 'neptune',
    name: '海王星 (Neptune)',
    color: '#3457D5', // Deep Royal Blue
    size: 1.9, // Similar to Uranus
    distance: 110,
    realDistance: 4500,
    speed: 0.015, 
    rotationSpeed: 0.008, 
    axisTilt: 0.49, 
    orbitInclination: 0.03, 
    hasRings: true, // Enabled Rings!
    ringColor: '#A0C4FF', // Faint Blue-White
    atmosphereColor: '#4169E1', // Royal Blue Glow
    description: '深蓝色的风暴世界，离太阳最远。其实我也有光环，只是比较暗淡，而且有一部分像断开的弧线！',
    temperature: '-201°C',
    composition: '冰 (水, 氨, 甲烷)',
    funFact: '海王星上有太阳系最快的风，时速可达2100公里，是音速的1.5倍以上。',
    textureConfig: {
      type: 'neptune', // New realistic type
      colors: ['#1A237E', '#2979FF', '#82B1FF'] // Midnight Blue -> Blue -> Light Blue
    }
  },
  {
    id: 'pluto',
    name: '冥王星 (Pluto)',
    color: '#D4C6AA', 
    size: 0.18, // Tiny!
    distance: 130, 
    realDistance: 5900,
    speed: 0.01, 
    rotationSpeed: -0.002, 
    axisTilt: 2.1, 
    orbitInclination: 0.30, 
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

export interface PlanetData {
  id: string;
  name: string;
  color: string; // Base color or fallback
  size: number; // Relative size for visualization
  distance: number; // Relative distance from Sun
  realDistance: number; // Average distance from Sun in Million km
  speed: number; // Orbit speed
  description: string;
  hasRings?: boolean;
  ringColor?: string;
  rotationSpeed: number; // Self rotation
  axisTilt?: number; // Axial tilt in radians (Self tilt)
  orbitInclination?: number; // Orbital inclination in radians (Orbit tilt)
  atmosphereColor?: string; // Color of the glowing atmosphere shell
  textureConfig: {
    type: 'solid' | 'banded' | 'crater' | 'earth' | 'atmosphere' | 'sun' | 'mars' | 'moon' | 'pluto' | 'neptune' | 'uranus' | 'saturn' | 'io' | 'europa' | 'ganymede' | 'callisto' | 'titan' | 'enceladus' | 'mimas' | 'iapetus';
    colors: string[]; // Palette for the texture
  };
  temperature?: string;
  composition?: string;
  funFact?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}


import { PlanetData } from '../types';

/**
 * Generates a Base64 encoded SVG Data URI for a planet's texture.
 * This allows us to use crisp SVG vector graphics as textures on 3D spheres.
 */
export const generatePlanetTexture = (data: PlanetData): string => {
  const { type, colors } = data.textureConfig;
  const width = 512;
  const height = 256; // 2:1 Aspect ratio for equirectangular projection
  
  let svgContent = '';
  const baseColor = colors[0];

  switch (type) {
    case 'solid':
      svgContent = `<rect width="100%" height="100%" fill="${baseColor}" />`;
      // Add subtle gradient
      svgContent += `
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors[1] || colors[0]};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)" opacity="0.5" />
      `;
      break;

    case 'banded':
      // Jupiter/Saturn style bands
      svgContent = `<rect width="100%" height="100%" fill="${baseColor}" />`;
      const numBands = 10;
      const bandHeight = height / numBands;
      for (let i = 0; i < numBands; i++) {
        const color = colors[i % colors.length];
        // Add some irregularity to band height
        const h = bandHeight + (Math.random() * 10 - 5);
        const y = i * bandHeight;
        svgContent += `<rect x="0" y="${y}" width="${width}" height="${h}" fill="${color}" />`;
      }
      break;

    case 'crater':
      // Mercury style
      svgContent = `<rect width="100%" height="100%" fill="${baseColor}" />`;
      const numCraters = 40;
      for (let i = 0; i < numCraters; i++) {
        const cx = Math.random() * width;
        const cy = Math.random() * height;
        const r = Math.random() * 15 + 2;
        const color = colors[Math.floor(Math.random() * (colors.length - 1)) + 1];
        svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.6" />`;
      }
      break;

    case 'moon':
      // Moon - Gray surface + Craters
      const moonBase = colors[0];
      svgContent = `<rect width="100%" height="100%" fill="${moonBase}" />`;
      const numMoonCraters = 50;
      for (let i = 0; i < numMoonCraters; i++) {
        const cx = Math.random() * width;
        const cy = Math.random() * height;
        const r = Math.random() * 8 + 1;
        const color = colors[Math.floor(Math.random() * (colors.length - 1)) + 1];
        svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.7" />`;
      }
      break;

    case 'mars':
      // Mars - Red surface + Craters + Polar Ice Caps
      const marsBase = colors[0];
      svgContent = `<rect width="100%" height="100%" fill="${marsBase}" />`;

      // 1. Craters (same as crater type but with mars palette)
      const numMarsCraters = 40;
      for (let i = 0; i < numMarsCraters; i++) {
        const cx = Math.random() * width;
        const cy = Math.random() * height * 0.7 + height * 0.15; // Avoid putting too many craters exactly on the poles
        const r = Math.random() * 12 + 2;
        const color = colors[Math.floor(Math.random() * (colors.length - 1)) + 1];
        svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.6" />`;
      }

      // 2. Polar Ice Caps (White)
      // North Pole (Top) - Draw an irregular white shape at the top
      let dNorth = `M 0 0 L ${width} 0 L ${width} ${height * 0.12}`; 
      // Wavy bottom edge of north cap
      for (let x = width; x >= 0; x -= 20) {
         const y = height * 0.12 + Math.sin(x / 30) * 5 + (Math.random() * 8);
         dNorth += ` L ${x} ${y}`;
      }
      dNorth += " Z";
      svgContent += `<path d="${dNorth}" fill="#FFFFFF" opacity="0.95" />`;

      // South Pole (Bottom) - Draw an irregular white shape at the bottom
      let dSouth = `M 0 ${height} L ${width} ${height} L ${width} ${height * 0.88}`;
      // Wavy top edge of south cap
      for (let x = width; x >= 0; x -= 20) {
         const y = height * 0.88 + Math.sin(x / 30) * 5 - (Math.random() * 8);
         dSouth += ` L ${x} ${y}`;
      }
      dSouth += " Z";
      svgContent += `<path d="${dSouth}" fill="#FFFFFF" opacity="0.95" />`;
      break;

    case 'pluto':
      // Pluto - Beige body + Dark blotches + White Heart (Tombaugh Regio)
      const plutoBase = colors[0]; // Beige
      const plutoDark = colors[1]; // Dark Brown
      const plutoHeart = colors[2]; // White

      svgContent = `<rect width="100%" height="100%" fill="${plutoBase}" />`;
      
      // Random dark patches
      for (let i = 0; i < 20; i++) {
          const cx = Math.random() * width;
          const cy = Math.random() * height;
          const r = Math.random() * 30 + 5;
          svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${plutoDark}" opacity="0.3" />`;
      }

      // The "Heart" (Tombaugh Regio) - stylized
      // Centered somewhat
      const hcx = width * 0.6;
      const hcy = height * 0.5;
      
      // Draw a heart shape using two curves
      const dHeart = `
        M ${hcx} ${hcy + 40} 
        C ${hcx - 80} ${hcy - 20}, ${hcx - 50} ${hcy - 80}, ${hcx} ${hcy - 30}
        C ${hcx + 50} ${hcy - 80}, ${hcx + 80} ${hcy - 20}, ${hcx} ${hcy + 40}
        Z
      `;
      svgContent += `<path d="${dHeart}" fill="${plutoHeart}" opacity="0.9" />`;
      break;

    case 'atmosphere':
      // Venus style - soft gradient clouds
      svgContent = `
        <defs>
          <linearGradient id="atmos" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${colors[0]}" />
            <stop offset="33%" style="stop-color:${colors[1]}" />
            <stop offset="66%" style="stop-color:${colors[2]}" />
            <stop offset="100%" style="stop-color:${colors[0]}" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#atmos)" />
        <rect width="100%" height="100%" fill="${colors[1]}" opacity="0.2">
             <animate attributeName="opacity" values="0.2;0.3;0.2" dur="5s" repeatCount="indefinite" />
        </rect>
      `;
      break;

    case 'earth':
      // Earth style - Blue ocean + Green Land blobs + White clouds
      const ocean = colors[0];
      const land = colors[1];
      const cloud = colors[2];
      
      // Use Radial Gradient for deep ocean effect
      svgContent = `
        <defs>
          <radialGradient id="oceanGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style="stop-color:#2196F3;stop-opacity:1" /> <!-- Lighter Blue Center -->
            <stop offset="100%" style="stop-color:#0D47A1;stop-opacity:1" /> <!-- Deep Blue Edge -->
          </radialGradient>
          
          <filter id="cloudTurbulence">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 -0.4" in="noise" result="cloudAlpha" />
            <feComposite operator="in" in="SourceGraphic" in2="cloudAlpha" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#oceanGrad)" />
      `;
      
      // Simple procedural landmasses (polygons)
      const numLandmasses = 15;
      for(let i=0; i<numLandmasses; i++) {
          const cx = Math.random() * width;
          const cy = Math.random() * height * 0.8 + height * 0.1; // Avoid extreme poles
          
          // Generate a random blob path
          let d = `M ${cx} ${cy}`;
          for(let j=0; j<6; j++) {
              d += ` L ${cx + (Math.random()-0.5)*120} ${cy + (Math.random()-0.5)*90}`;
          }
          d += " Z";
          svgContent += `<path d="${d}" fill="${land}" stroke="none" opacity="0.9" />`;
      }

      // Clouds
      for(let i=0; i<25; i++) {
           const cx = Math.random() * width;
           const cy = Math.random() * height;
           const rx = Math.random() * 60 + 20;
           const ry = Math.random() * 30 + 10;
           // White cloud with variable opacity
           const op = Math.random() * 0.3 + 0.2;
           svgContent += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${cloud}" opacity="${op}" />`;
      }
      break;

    case 'sun':
      // Sun - Turbulent surface with granules and sunspots using SVG Filters for realism
      const sunBase = colors[0]; // #FDB813
      const sunDark = colors[1]; // #FF6D00
      
      svgContent = `
        <defs>
          <filter id="sunNoise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="4" result="turbulence"/>
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" in="turbulence" result="colormatrix"/>
            <feComposite operator="in" in="SourceGraphic" in2="colormatrix"/>
          </filter>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:${sunBase}" />
            <stop offset="100%" style="stop-color:${sunDark}" />
          </radialGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#sunGrad)" />
        
        <!-- Plasma Turbulence Layer -->
        <rect width="100%" height="100%" fill="#FF4500" opacity="0.4" filter="url(#sunNoise)" />
      `;
      
      // Sunspots
      const sunSpot = colors[2] || '#3E2723';
      for (let i = 0; i < 6; i++) {
         const cx = Math.random() * width;
         const cy = Math.random() * height * 0.6 + height * 0.2;
         const rx = Math.random() * 12 + 4;
         const ry = Math.random() * 8 + 4;
         svgContent += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${sunSpot}" opacity="0.85" />`;
      }
      break;
  }

  // Wrap in SVG tag - use encodeURIComponent to handle special characters safely
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgContent}</svg>`;
  
  // Robust Base64 encoding
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

/**
 * Generates a radial gradient glow texture for the Sun's corona.
 * No beams/rays, just a pure diffuse gradient.
 */
export const generateSunGlowTexture = (): string => {
  const width = 512;
  const height = 512;
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.9" />
          <stop offset="15%" style="stop-color:#FFD700;stop-opacity:0.8" />
          <stop offset="40%" style="stop-color:#FF8C00;stop-opacity:0.5" />
          <stop offset="70%" style="stop-color:#FF4500;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:#000000;stop-opacity:0" />
        </radialGradient>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#glow)" />
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

/**
 * Generates a generic white radial gradient for planetary atmospheres.
 * Tintable via material color.
 * Very soft falloff.
 */
export const generateGenericGlowTexture = (): string => {
  const width = 256;
  const height = 256;
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <radialGradient id="softGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
          <stop offset="25%" style="stop-color:#FFFFFF;stop-opacity:0.8" />
          <stop offset="60%" style="stop-color:#FFFFFF;stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#softGlow)" />
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

/**
 * Generates a deep space starfield texture with nebulae and rich gradients.
 * Replaces the simple gradient with a more "magical" deep space look.
 */
export const generateStarFieldTexture = (): string => {
  const width = 2048; 
  const height = 1024;
  
  // 1. Rich Cosmic Background Gradient (Deep Blue/Black/Purple)
  let svgContent = `
    <defs>
      <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#020409;stop-opacity:1" /> <!-- Nearly black -->
        <stop offset="40%" style="stop-color:#0D1126;stop-opacity:1" /> <!-- Deep Midnight Blue -->
        <stop offset="80%" style="stop-color:#1E1636;stop-opacity:1" /> <!-- Deep Purple -->
        <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
      </linearGradient>
      
      <filter id="nebulaBlur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
      </filter>
    </defs>
    
    <rect width="100%" height="100%" fill="url(#skyGradient)" />
  `;

  // 2. Procedural Nebulae (Soft Colored Clouds)
  // We use large ellipses with heavy blur to simulate gas clouds
  const nebulaColors = ['#312E81', '#4C1D95', '#1e3a8a', '#581c87']; // Indigos, Violets
  
  // Add a few large "gas" blobs
  for (let i = 0; i < 6; i++) {
     const cx = Math.random() * width;
     const cy = Math.random() * height;
     const rx = Math.random() * 300 + 200;
     const ry = Math.random() * 200 + 100;
     const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
     const opacity = Math.random() * 0.15 + 0.05; // Very subtle
     
     svgContent += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" opacity="${opacity}" filter="url(#nebulaBlur)" />`;
  }

  // 3. Background Stars (The "texture" stars)
  // We keep these for the far-far background density. 3D Stars will be added in front.
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 0.6 + 0.2; 
    
    // Varying star colors
    const randomVal = Math.random();
    let fill = "#FFFFFF"; 
    if (randomVal > 0.85) fill = "#BAE6FD"; // Blueish
    if (randomVal < 0.15) fill = "#FEF3C7"; // Goldish

    const opacity = Math.random() * 0.5 + 0.2;
    svgContent += `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${opacity}" />`;
  }

  // A few brighter stars in the texture
  for (let i = 0; i < 20; i++) {
     const x = Math.random() * width;
     const y = Math.random() * height;
     const r = Math.random() * 0.8 + 0.6;
     svgContent += `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" opacity="0.8" />`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" preserveAspectRatio="none" viewBox="0 0 ${width} ${height}">${svgContent}</svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

/**
 * Generates a procedural ring texture with transparency gradients.
 * Simulates a "vinyl" record look with gaps.
 */
export const generateRingTexture = (baseColor: string): string => {
  const width = 512;
  const height = 512;

  // We use a radial gradient to create bands.
  // The texture is square, so cx=50% cy=50% r=50% touches the edges.
  // Note: RingGeometry maps UVs to the bounding box of the ring.
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <!-- Inner hole area (covered by geometry anyway, but good for blending) -->
          <stop offset="40%" style="stop-color:${baseColor};stop-opacity:0" />
          
          <!-- Start of Ring -->
          <stop offset="50%" style="stop-color:${baseColor};stop-opacity:0.2" />
          <stop offset="60%" style="stop-color:${baseColor};stop-opacity:0.9" />
          
          <!-- The "Gap" (Cassini Division style) -->
          <stop offset="65%" style="stop-color:${baseColor};stop-opacity:0.3" />
          <stop offset="68%" style="stop-color:${baseColor};stop-opacity:0.8" />
          
          <!-- Outer Fade -->
          <stop offset="85%" style="stop-color:${baseColor};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${baseColor};stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#ringGrad)" />
      
      <!-- Subtle Noise Rings to add realism -->
      <circle cx="256" cy="256" r="180" stroke="${baseColor}" stroke-width="1" fill="none" opacity="0.3" />
      <circle cx="256" cy="256" r="200" stroke="${baseColor}" stroke-width="2" fill="none" opacity="0.2" />
      <circle cx="256" cy="256" r="220" stroke="${baseColor}" stroke-width="1" fill="none" opacity="0.3" />
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

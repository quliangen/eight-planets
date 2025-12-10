import { PlanetData } from '../types';

/**
 * Generates a Base64 encoded SVG Data URI for a planet's texture.
 * This allows us to use crisp SVG vector graphics as textures on 3D spheres.
 */
export const generatePlanetTexture = (data: PlanetData): string => {
  const { type, colors } = data.textureConfig;
  // Jupiter and Neptune need higher resolution for details
  const width = (data.id === 'jupiter' || data.id === 'neptune') ? 1024 : 512;
  const height = (data.id === 'jupiter' || data.id === 'neptune') ? 512 : 256; 
  
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

    case 'neptune':
        // --- NEPTUNE SPECIFIC REALISTIC GENERATION ---
        // Colors: Deep Blue (#1A237E), Royal Blue (#2979FF), Pale Blue (#82B1FF)
        const deepBlue = colors[0];
        const midBlue = colors[1];
        const brightBlue = colors[2];
        const darkSpotColor = '#0D1546'; // Almost black-blue

        svgContent = `
          <defs>
            <!-- 1. Supersonic Winds Filter: Horizontal stretching turbulence -->
            <filter id="neptuneWinds" x="-20%" y="-20%" width="140%" height="140%">
               <!-- Base Frequency X=0.006 (Very stretched), Y=0.05 (Varied) -->
               <feTurbulence type="fractalNoise" baseFrequency="0.006 0.05" numOctaves="5" seed="88" result="noise"/>
               <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G" />
               <feGaussianBlur stdDeviation="1.5" />
            </filter>
            
            <!-- 2. Cloud Glow Filter -->
            <filter id="cloudGlow">
               <feGaussianBlur stdDeviation="3" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <!-- 3. Base Gradient: Dark Poles, Lighter Equator -->
            <linearGradient id="neptuneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="${deepBlue}" />
              <stop offset="20%" stop-color="${midBlue}" />
              <stop offset="50%" stop-color="${brightBlue}" stop-opacity="0.6" /> <!-- Lighter equator -->
              <stop offset="80%" stop-color="${midBlue}" />
              <stop offset="100%" stop-color="${deepBlue}" />
            </linearGradient>
          </defs>

          <!-- A. Deep Atmosphere Base -->
          <rect width="100%" height="100%" fill="${deepBlue}" />
          <rect width="100%" height="100%" fill="url(#neptuneGrad)" opacity="0.8" />

          <!-- B. Wind Streaks Layer (The high speed winds) -->
          <g filter="url(#neptuneWinds)" opacity="0.4">
             ${Array.from({length: 12}).map((_, i) => {
                 const y = Math.random() * height;
                 const h = Math.random() * 20 + 5;
                 // Some streaks dark, some light
                 const isDark = Math.random() > 0.5;
                 const streakColor = isDark ? darkSpotColor : brightBlue;
                 const op = Math.random() * 0.4;
                 return `<rect x="0" y="${y}" width="100%" height="${h}" fill="${streakColor}" opacity="${op}" />`;
             }).join('')}
          </g>

          <!-- C. The Great Dark Spot (Approx 22 S) -->
          <!-- A hole in the methane deck -->
          <g transform="translate(${width * 0.3}, ${height * 0.6})">
             <ellipse cx="0" cy="0" rx="${width * 0.08}" ry="${height * 0.05}" fill="${darkSpotColor}" opacity="0.9" />
             <!-- Subtle rim -->
             <ellipse cx="0" cy="0" rx="${width * 0.085}" ry="${height * 0.055}" stroke="${midBlue}" stroke-width="2" fill="none" opacity="0.3" filter="url(#cloudGlow)"/>
          </g>

          <!-- D. The "Scooter" and High Altitude Clouds -->
          <!-- Bright white cirrus clouds that cast shadows (simulated by offset dark copy, simple here) -->
          <g filter="url(#cloudGlow)" opacity="0.8">
             <!-- Near the Dark Spot (Orographic clouds) -->
             <path d="M ${width * 0.25} ${height * 0.55} Q ${width * 0.3} ${height * 0.53} ${width * 0.35} ${height * 0.56}" 
                   stroke="white" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7" />
             
             <!-- The Scooter (Fast moving small bright cloud) -->
             <ellipse cx="${width * 0.32}" cy="${height * 0.72}" rx="${width * 0.02}" ry="${height * 0.008}" fill="white" opacity="0.9" />

             <!-- High streaks in Northern Hemisphere -->
             <path d="M ${width * 0.6} ${height * 0.25} L ${width * 0.8} ${height * 0.26}" 
                   stroke="white" stroke-width="2" fill="none" opacity="0.4" />
             <path d="M ${width * 0.1} ${height * 0.3} L ${width * 0.25} ${height * 0.28}" 
                   stroke="white" stroke-width="3" fill="none" opacity="0.3" />
          </g>
          
          <!-- E. Global Blue Haze Overlay -->
          <rect width="100%" height="100%" fill="${midBlue}" opacity="0.1" style="mix-blend-mode: overlay;" />
        `;
        break;

    case 'banded':
      // --- JUPITER SPECIFIC HIGH-FIDELITY GENERATION ---
      if (data.id === 'jupiter') {
        // NASA-Inspired Palette
        const zoneLight = "#FDF2E3"; // Bright Zones (Ammonia clouds)
        const beltDark = "#C99056";  // Dark Belts
        const beltDarker = "#9F6C41"; // North Eq Belt
        const polarGrey = "#8C8C94"; // Polar Haze
        const redSpotCore = "#BC5B38";
        const redSpotOuter = "#D68D64";

        svgContent = `
          <defs>
            <!-- 1. Gas Turbulence Filter: Creates the wavy, stretched cloud look -->
            <filter id="jupiterGas" x="-20%" y="-20%" width="140%" height="140%">
               <!-- High X frequency stretches noise horizontally like high winds -->
               <feTurbulence type="fractalNoise" baseFrequency="0.004 0.04" numOctaves="4" seed="42" result="noise"/>
               <feDisplacementMap in="SourceGraphic" in2="noise" scale="35" xChannelSelector="R" yChannelSelector="G" />
            </filter>

            <!-- 2. Storm Turbulence Filter: Swirly noise for the GRS -->
            <filter id="stormSwirl">
               <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="3" seed="10"/>
               <feDisplacementMap scale="10" />
               <feGaussianBlur stdDeviation="1" />
            </filter>

            <!-- 3. Base Gradient (Belts and Zones Structure) -->
            <!-- Jupiter has distinct bands: NPR, NNTB, NTB, NEB, EZ, SEB, STB, SPR -->
            <linearGradient id="jupiterBands" x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stop-color="${polarGrey}" />   <!-- N. Pole -->
               <stop offset="10%" stop-color="${beltDark}" />
               <stop offset="20%" stop-color="${zoneLight}" />
               <stop offset="30%" stop-color="${beltDarker}" /> <!-- N. Eq Belt -->
               <stop offset="40%" stop-color="${zoneLight}" />  <!-- Equatorial Zone -->
               <stop offset="50%" stop-color="${zoneLight}" />
               <stop offset="55%" stop-color="${beltDarker}" /> <!-- S. Eq Belt (GRS location) -->
               <stop offset="65%" stop-color="${zoneLight}" />
               <stop offset="75%" stop-color="${beltDark}" />
               <stop offset="90%" stop-color="${polarGrey}" />   <!-- S. Pole -->
               <stop offset="100%" stop-color="${polarGrey}" />
            </linearGradient>
            
            <!-- 4. Great Red Spot Gradient -->
            <radialGradient id="grsGrad" cx="50%" cy="50%" r="50%">
               <stop offset="0%" stop-color="${redSpotCore}" />
               <stop offset="60%" stop-color="${redSpotOuter}" />
               <stop offset="90%" stop-color="${zoneLight}" stop-opacity="0.5" />
               <stop offset="100%" stop-color="${zoneLight}" stop-opacity="0" />
            </radialGradient>
          </defs>

          <!-- A. Base Layer: The Banded Gradient -->
          <rect width="100%" height="100%" fill="url(#jupiterBands)" />

          <!-- B. Turbulent Details Layer (The "Gas" effect) -->
          <!-- We draw horizontal rects with the filter applied to distort them -->
          <g filter="url(#jupiterGas)" opacity="0.7">
             <!-- Extra dark streaks -->
             <rect y="${height * 0.28}" width="100%" height="${height * 0.08}" fill="${beltDarker}" opacity="0.6" />
             <rect y="${height * 0.53}" width="100%" height="${height * 0.10}" fill="${beltDarker}" opacity="0.6" />
             <!-- Thin turbulent lines -->
             ${Array.from({length: 15}).map((_, i) => {
                 const y = Math.random() * height;
                 const h = Math.random() * 5 + 1;
                 const op = Math.random() * 0.3;
                 return `<rect y="${y}" width="100%" height="${h}" fill="#5e4b35" opacity="${op}" />`;
             }).join('')}
          </g>

          <!-- C. The Great Red Spot (GRS) -->
          <!-- Located South Equatorial Belt, approx 22deg S -->
          <g transform="translate(${width * 0.7}, ${height * 0.6})">
             <!-- The Wake (Turbulence following the spot) -->
             <path d="M -80 -10 Q -40 -30 0 0 T 80 10" stroke="${beltDarker}" stroke-width="20" fill="none" opacity="0.6" filter="url(#jupiterGas)" />
             
             <!-- Main Spot Body -->
             <g>
                <ellipse cx="0" cy="0" rx="${width * 0.07}" ry="${height * 0.06}" fill="url(#grsGrad)" />
                
                <!-- Internal Storm Swirls -->
                <path d="M -30 10 Q 0 25 30 5" stroke="#8B3A1B" stroke-width="3" fill="none" opacity="0.5" filter="url(#stormSwirl)" />
                <path d="M 20 -15 Q -10 -25 -25 -5" stroke="#E8B090" stroke-width="2" fill="none" opacity="0.4" filter="url(#stormSwirl)" />
             </g>
          </g>

          <!-- D. String of Pearls (White storms in S. Temperate Belt) -->
          <g transform="translate(0, ${height * 0.72})" opacity="0.8">
             <circle cx="${width * 0.2}" cy="0" r="${width * 0.015}" fill="white" filter="url(#stormSwirl)" />
             <circle cx="${width * 0.35}" cy="5" r="${width * 0.012}" fill="white" filter="url(#stormSwirl)" />
             <circle cx="${width * 0.55}" cy="-2" r="${width * 0.018}" fill="white" filter="url(#stormSwirl)" />
             <circle cx="${width * 0.85}" cy="3" r="${width * 0.014}" fill="white" filter="url(#stormSwirl)" />
          </g>
          
          <!-- E. Global Atmosphere Haze -->
          <rect width="100%" height="100%" fill="#FFD700" opacity="0.05" style="mix-blend-mode: overlay;" />
        `;
      } else {
        // --- GENERIC BANDED (Saturn etc.) ---
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
      // Realistic Moon Texture based on NASA references
      // Highlands (Light) vs Maria (Dark Seas)
      const moonHighland = '#E6E6E6'; // Lighter gray
      const moonMare = '#8C8C8C';     // Darker gray for seas
      const moonCraterShadow = '#555555';

      svgContent = `
        <defs>
          <!-- Noise filter for regolith texture -->
          <filter id="moonNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise"/>
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.2 0" in="noise" result="coloredNoise"/>
            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite"/>
          </filter>
          
          <!-- Blur for Maria edges -->
          <filter id="mareBlur">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        <!-- 1. Base: Lunar Highlands (Light Gray) -->
        <rect width="100%" height="100%" fill="${moonHighland}" />
        
        <!-- 2. Lunar Maria (The dark "Seas") - Approximating real locations -->
        <g filter="url(#mareBlur)" opacity="0.8">
           <!-- Oceanus Procellarum (Left/West) -->
           <ellipse cx="${width * 0.25}" cy="${height * 0.4}" rx="${width * 0.15}" ry="${height * 0.2}" fill="${moonMare}" />
           
           <!-- Mare Imbrium (Top Left) -->
           <circle cx="${width * 0.35}" cy="${height * 0.25}" r="${height * 0.12}" fill="${moonMare}" />
           
           <!-- Mare Serenitatis & Tranquillitatis (Right/East) -->
           <ellipse cx="${width * 0.6}" cy="${height * 0.35}" rx="${width * 0.12}" ry="${height * 0.15}" fill="${moonMare}" />
           <circle cx="${width * 0.7}" cy="${height * 0.4}" r="${height * 0.08}" fill="${moonMare}" />
           
           <!-- Random smaller maria patches -->
           <circle cx="${width * 0.85}" cy="${height * 0.5}" r="${height * 0.06}" fill="${moonMare}" />
           <circle cx="${width * 0.1}" cy="${height * 0.6}" r="${height * 0.05}" fill="${moonMare}" />
        </g>

        <!-- 3. Texture Grain Overlay -->
        <rect width="100%" height="100%" fill="#000000" opacity="0.1" filter="url(#moonNoise)" />

        <!-- 4. Tycho Crater (Prominent Ray System in South) -->
        <g opacity="0.7">
           <!-- Rays -->
           <path d="
             M ${width*0.45} ${height*0.75} L ${width*0.3} ${height*0.4} L ${width*0.46} ${height*0.75} 
             L ${width*0.5} ${height*0.2} L ${width*0.48} ${height*0.75}
             L ${width*0.7} ${height*0.5} L ${width*0.5} ${height*0.78}
             L ${width*0.2} ${height*0.8} L ${width*0.45} ${height*0.8}
           " fill="#FFFFFF" opacity="0.4" filter="url(#mareBlur)" />
           
           <!-- Crater Center -->
           <circle cx="${width * 0.47}" cy="${height * 0.78}" r="4" fill="#FFFFFF" />
           <circle cx="${width * 0.47}" cy="${height * 0.78}" r="1.5" fill="${moonCraterShadow}" />
        </g>

        <!-- 5. Copernicus Crater (Bright spot in Mare) -->
        <circle cx="${width * 0.32}" cy="${height * 0.42}" r="3" fill="#FFFFFF" opacity="0.8" />
        <circle cx="${width * 0.32}" cy="${height * 0.42}" r="10" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.3" />

        <!-- 6. General Craters -->
      `;
      
      const numMoonCraters = 60;
      for (let i = 0; i < numMoonCraters; i++) {
        const cx = Math.random() * width;
        const cy = Math.random() * height;
        const r = Math.random() * 6 + 1;
        // Simple 3D effect: Dark circle with lighter stroke
        svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${moonCraterShadow}" opacity="0.5" />`;
        // Rim highlight
        svgContent += `<path d="M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}" fill="none" stroke="#FFFFFF" stroke-width="0.5" opacity="0.3" />`;
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
      // Improved Earth Style with NASA-inspired procedural features
      const oceanDeep = '#002F6C'; // Deep Ocean Blue
      const oceanShallow = '#0057D9'; // Lighter Ocean
      const landGreen = '#2E7D32'; // Forest Green
      const landBrown = '#8D6E63'; // Mountain/Dry
      const iceWhite = '#F5F5F5'; 
      const cloudWhite = '#FFFFFF';

      svgContent = `
        <defs>
          <!-- 1. Ocean Gradient (Latitudinal depth simulation) -->
          <linearGradient id="earthOcean" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" style="stop-color:${oceanDeep}" />
             <stop offset="20%" style="stop-color:${oceanShallow}" />
             <stop offset="50%" style="stop-color:${oceanDeep}" />
             <stop offset="80%" style="stop-color:${oceanShallow}" />
             <stop offset="100%" style="stop-color:${oceanDeep}" />
          </linearGradient>

          <!-- 2. Land Generation Filter: Creates fractal continents -->
          <filter id="landNoise">
             <!-- Low frequency noise for large land masses -->
             <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="6" seed="42" result="noise"/>
             
             <!-- Sharp Thresholding to create distinct coastlines -->
             <feComponentTransfer in="noise" result="landMask">
                <!-- If noise value > threshold, alpha = 1, else 0 -->
                <feFuncA type="linear" slope="20" intercept="-11"/> 
             </feComponentTransfer>
             
             <!-- Composite to masked output -->
             <feComposite operator="in" in="SourceGraphic" in2="landMask" />
          </filter>

          <!-- 3. Cloud Generation Filter: Swirling atmospheric patterns -->
          <filter id="cloudFilter">
             <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="4" seed="123" result="cloudNoise"/>
             <!-- Map noise to alpha for wispy clouds -->
             <feColorMatrix type="matrix" values="1 0 0 0 1  0 1 0 0 1  0 0 1 0 1  1 0 0 -0.2 -0.1" in="cloudNoise" result="cloudAlpha"/>
             <feComposite operator="in" in="SourceGraphic" in2="cloudAlpha" />
          </filter>
        </defs>

        <!-- A. Base Layer: Ocean -->
        <rect width="100%" height="100%" fill="url(#earthOcean)" />

        <!-- B. Land Layer: Green Continents -->
        <g filter="url(#landNoise)">
           <!-- Main Green Base -->
           <rect width="100%" height="100%" fill="${landGreen}" />
           
           <!-- Add Texture to Land (Mountains) -->
           <filter id="mountainDetail">
              <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" seed="7" />
           </filter>
           <rect width="100%" height="100%" fill="${landBrown}" opacity="0.3" filter="url(#mountainDetail)" style="mix-blend-mode: multiply;" />
        </g>

        <!-- C. Polar Ice Caps (Simple Geometry overlay) -->
        <!-- North Pole -->
        <path d="M 0 0 L ${width} 0 L ${width} ${height*0.12} Q ${width/2} ${height*0.18} 0 ${height*0.12} Z" fill="${iceWhite}" opacity="0.95" />
        <!-- South Pole -->
        <path d="M 0 ${height} L ${width} ${height} L ${width} ${height*0.88} Q ${width/2} ${height*0.82} 0 ${height*0.88} Z" fill="${iceWhite}" opacity="0.95" />

        <!-- D. Cloud Layer -->
        <g filter="url(#cloudFilter)" opacity="0.85">
           <rect width="100%" height="100%" fill="${cloudWhite}" />
        </g>
      `;
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
      
      // Sunspots - Enhanced clustering
      const sunSpotDark = '#3E2723'; // Dark Umbra
      const sunSpotPenumbra = colors[2] || '#8B0000'; // Penumbra

      // Helper to generate a sunspot group (Umbra + Penumbra + Satellites)
      // Note: We use string concatenation inside the case logic
      const numGroups = 5;
      for (let g = 0; g < numGroups; g++) {
         // Place in bands (avoid poles and exact equator)
         const cx = Math.random() * width;
         // Latitudes: 20-40 degrees North or South approx
         // height 0 to 256. 
         // North band: 70-100. South band: 156-186.
         const isNorth = Math.random() > 0.5;
         const cy = isNorth 
            ? (height * 0.3) + (Math.random() * height * 0.15) 
            : (height * 0.6) + (Math.random() * height * 0.15);

         const mainR = Math.random() * 6 + 3;

         // Penumbra (Lighter halo)
         svgContent += `<ellipse cx="${cx}" cy="${cy}" rx="${mainR * 1.6}" ry="${mainR * 1.3}" fill="${sunSpotPenumbra}" opacity="0.6" />`;
         // Umbra (Dark core)
         svgContent += `<ellipse cx="${cx}" cy="${cy}" rx="${mainR}" ry="${mainR * 0.8}" fill="${sunSpotDark}" opacity="0.9" />`;

         // Satellite spots
         const satellites = Math.floor(Math.random() * 4);
         for(let s=0; s<satellites; s++) {
             const offX = (Math.random() - 0.5) * 30;
             const offY = (Math.random() - 0.5) * 15;
             const sr = Math.random() * 2 + 1;
             svgContent += `<ellipse cx="${cx + offX}" cy="${cy + offY}" rx="${sr}" ry="${sr}" fill="${sunSpotDark}" opacity="0.75" />`;
         }
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
 * Implements seamless wrapping to avoid junction lines.
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
        <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
      </filter>
    </defs>
    
    <rect width="100%" height="100%" fill="url(#skyGradient)" />
  `;

  // 2. Procedural Nebulae (Soft Colored Clouds)
  // We use large ellipses with heavy blur to simulate gas clouds
  const nebulaColors = ['#312E81', '#4C1D95', '#1e3a8a', '#581c87']; // Indigos, Violets
  
  // Helper to draw seamless ellipses
  const drawSeamlessEllipse = (cx: number, cy: number, rx: number, ry: number, fill: string, opacity: number) => {
      let str = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}" filter="url(#nebulaBlur)" />`;
      // Check Wraps
      if (cx - rx < 0) {
           str += `<ellipse cx="${cx + width}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}" filter="url(#nebulaBlur)" />`;
      }
      if (cx + rx > width) {
           str += `<ellipse cx="${cx - width}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}" filter="url(#nebulaBlur)" />`;
      }
      return str;
  };

  // Add a few large "gas" blobs
  for (let i = 0; i < 6; i++) {
     const cx = Math.random() * width;
     const cy = Math.random() * height;
     const rx = Math.random() * 300 + 200;
     const ry = Math.random() * 200 + 100;
     const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
     const opacity = Math.random() * 0.15 + 0.05; // Very subtle
     
     svgContent += drawSeamlessEllipse(cx, cy, rx, ry, color, opacity);
  }

  // 3. Background Stars (The "texture" stars)
  // We keep these for the far-far background density. 3D Stars will be added in front.
  
  const drawSeamlessCircle = (cx: number, cy: number, r: number, fill: string, opacity: number) => {
      let str = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${opacity}" />`;
      if (cx - r < 0) {
           str += `<circle cx="${cx + width}" cy="${cy}" r="${r}" fill="${fill}" opacity="${opacity}" />`;
      }
      if (cx + r > width) {
           str += `<circle cx="${cx - width}" cy="${cy}" r="${r}" fill="${fill}" opacity="${opacity}" />`;
      }
      return str;
  };

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
    svgContent += drawSeamlessCircle(x, y, r, fill, opacity);
  }

  // A few brighter stars in the texture
  for (let i = 0; i < 20; i++) {
     const x = Math.random() * width;
     const y = Math.random() * height;
     const r = Math.random() * 0.8 + 0.6;
     svgContent += drawSeamlessCircle(x, y, r, "#FFFFFF", 0.8);
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" preserveAspectRatio="none" viewBox="0 0 ${width} ${height}">${svgContent}</svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

/**
 * Generates a procedural China flag texture.
 * Red background with 5 yellow stars.
 */
export const generateChinaFlagTexture = (): string => {
  const width = 300;
  const height = 200;
  const starYellow = "#FFDE00";
  const bgRed = "#DE2910";

  // Helper to draw a star
  // cx, cy: center coordinates
  // spikes: number of points (5)
  // outerRadius: size
  // innerRadius: size of inner corners
  // angle: initial rotation
  const getStarPoints = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, angleOffset: number = 0) => {
    let points = "";
    let step = Math.PI / spikes;
    
    // Adjust starting angle (SVG stars usually point up at -PI/2)
    let rot = (Math.PI / 2) * 3; 
    // Add custom rotation
    rot += angleOffset;

    let x = cx;
    let y = cy;

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      points += `${x},${y} `;
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      points += `${x},${y} `;
      rot += step;
    }
    return points;
  }

  // Large Star
  const bigStar = getStarPoints(45, 50, 5, 28, 11);
  
  // Small Stars (Arc)
  // 1: Top
  const s1 = getStarPoints(90, 25, 5, 9, 3.5, 0.4);
  // 2: Middle-Top
  const s2 = getStarPoints(110, 45, 5, 9, 3.5, 0.1);
  // 3: Middle-Bottom
  const s3 = getStarPoints(110, 75, 5, 9, 3.5, 0);
  // 4: Bottom
  const s4 = getStarPoints(90, 95, 5, 9, 3.5, -0.4);

  const svgContent = `
    <rect width="100%" height="100%" fill="${bgRed}" />
    <polygon points="${bigStar}" fill="${starYellow}" />
    <polygon points="${s1}" fill="${starYellow}" />
    <polygon points="${s2}" fill="${starYellow}" />
    <polygon points="${s3}" fill="${starYellow}" />
    <polygon points="${s4}" fill="${starYellow}" />
  `;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgContent}</svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

/**
 * Generates a procedural ring texture.
 * Customized for Saturn (realistic bands + gaps) and Uranus (thin dark rings).
 */
export const generateRingTexture = (planetId: string, baseColor: string): string => {
  const width = 1024;
  const height = 1024;

  let svgContent = '';

  if (planetId === 'saturn') {
    // NASA-like Saturn Rings
    // Colors: #C5AB6E (Base), #BFA667 (Darker), #EFEBCF (Lighter)
    // Structure: C Ring (Inner, Faint) -> B Ring (Brightest) -> Cassini Division (Gap) -> A Ring (Outer)
    svgContent = `
      <defs>
        <radialGradient id="saturnRing" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <!-- Inner Gap -->
          <stop offset="50%" style="stop-color:transparent;stop-opacity:0" />

          <!-- C Ring (Faint, semi-transparent, darker rock) -->
          <stop offset="55%" style="stop-color:#5A5040;stop-opacity:0.3" />
          <stop offset="63%" style="stop-color:#5A5040;stop-opacity:0.4" />

          <!-- Maxwell Gap approx -->
          <stop offset="63.5%" style="stop-color:#2a2a2a;stop-opacity:0.1" />

          <!-- B Ring (Bright, dense ice) -->
          <stop offset="64%" style="stop-color:#CDBA88;stop-opacity:0.8" />
          <stop offset="70%" style="stop-color:#EFEBCF;stop-opacity:1" /> <!-- Brightest part -->
          <stop offset="72%" style="stop-color:#D8C48E;stop-opacity:0.9" />
          <stop offset="75%" style="stop-color:#BFA667;stop-opacity:0.8" />

          <!-- Cassini Division (The Big Gap) -->
          <stop offset="75.5%" style="stop-color:#000000;stop-opacity:0.05" />
          <stop offset="78%" style="stop-color:#000000;stop-opacity:0.05" />

          <!-- A Ring (Outer, detailed) -->
          <stop offset="78.5%" style="stop-color:#A89870;stop-opacity:0.8" />
          <stop offset="85%" style="stop-color:#B0A076;stop-opacity:0.7" />
          
          <!-- Encke Gap (Small gap inside A Ring) -->
          <stop offset="86%" style="stop-color:#000000;stop-opacity:0.1" />
          <stop offset="86.5%" style="stop-color:#A89870;stop-opacity:0.7" />

          <stop offset="90%" style="stop-color:#958763;stop-opacity:0.6" />
          
          <!-- Outer Fade -->
          <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
        </radialGradient>
        
        <!-- Noise filter for granular look -->
        <filter id="ringNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
        </filter>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#saturnRing)" />
      
      <!-- Add grain texture overlay -->
      <rect width="100%" height="100%" filter="url(#ringNoise)" opacity="0.4" style="mix-blend-mode: overlay;" />
      
      <!-- Subtle concentric lines for detail -->
      <circle cx="512" cy="512" r="300" stroke="#443322" stroke-width="1" fill="none" opacity="0.2" />
      <circle cx="512" cy="512" r="350" stroke="#443322" stroke-width="0.5" fill="none" opacity="0.2" />
      <circle cx="512" cy="512" r="400" stroke="#443322" stroke-width="1" fill="none" opacity="0.2" />
    `;
  } else if (planetId === 'uranus') {
    // Uranus Rings: 
    // Optimized for visibility with dual gradient approach (base glow + sharp bands).
    svgContent = `
      <defs>
        <radialGradient id="uranusBaseGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
           <stop offset="40%" style="stop-color:transparent;stop-opacity:0" />
           
           <!-- Wide Soft Base Gradient (Cyan/Blue tint) -->
           <stop offset="50%" style="stop-color:#71C9CE;stop-opacity:0" />
           <stop offset="65%" style="stop-color:#A6E3E9;stop-opacity:0.15" />
           <stop offset="85%" style="stop-color:#CBF1F5;stop-opacity:0.25" />
           <stop offset="95%" style="stop-color:#71C9CE;stop-opacity:0" />
        </radialGradient>

        <radialGradient id="uranusBands" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
           <!-- Inner Ring -->
           <stop offset="58%" style="stop-color:#FFFFFF;stop-opacity:0" />
           <stop offset="59%" style="stop-color:#FFFFFF;stop-opacity:0.7" />
           <stop offset="60%" style="stop-color:#FFFFFF;stop-opacity:0" />

           <!-- Middle Ring -->
           <stop offset="70%" style="stop-color:#FFFFFF;stop-opacity:0" />
           <stop offset="71%" style="stop-color:#FFFFFF;stop-opacity:0.8" />
           <stop offset="72%" style="stop-color:#FFFFFF;stop-opacity:0" />

           <!-- Main Epsilon Ring (Wide and Bright) -->
           <stop offset="84%" style="stop-color:#FFFFFF;stop-opacity:0" />
           <stop offset="85%" style="stop-color:#E0FFFF;stop-opacity:0.9" /> 
           <stop offset="86%" style="stop-color:#FFFFFF;stop-opacity:1.0" />
           <stop offset="87%" style="stop-color:#E0FFFF;stop-opacity:0.9" />
           <stop offset="88%" style="stop-color:#FFFFFF;stop-opacity:0" />
        </radialGradient>
      </defs>
      
      <!-- 1. Soft Glow Base Layer -->
      <rect width="100%" height="100%" fill="url(#uranusBaseGlow)" />
      
      <!-- 2. Sharp Bands Layer -->
      <rect width="100%" height="100%" fill="url(#uranusBands)" />
      
      <!-- 3. Extra Strokes for high frequency definition -->
       <circle cx="512" cy="512" r="440" stroke="#FFFFFF" stroke-width="4" fill="none" opacity="0.8" />
       <circle cx="512" cy="512" r="364" stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.5" />
    `;
  } else {
    // Generic logic for other planets with rings
    svgContent = `
      <defs>
        <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="40%" style="stop-color:${baseColor};stop-opacity:0" />
          <stop offset="50%" style="stop-color:${baseColor};stop-opacity:0.2" />
          <stop offset="60%" style="stop-color:${baseColor};stop-opacity:0.9" />
          <stop offset="65%" style="stop-color:${baseColor};stop-opacity:0.3" />
          <stop offset="68%" style="stop-color:${baseColor};stop-opacity:0.8" />
          <stop offset="85%" style="stop-color:${baseColor};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${baseColor};stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#ringGrad)" />
      <circle cx="512" cy="512" r="360" stroke="${baseColor}" stroke-width="1" fill="none" opacity="0.3" />
      <circle cx="512" cy="512" r="400" stroke="${baseColor}" stroke-width="2" fill="none" opacity="0.2" />
      <circle cx="512" cy="512" r="440" stroke="${baseColor}" stroke-width="1" fill="none" opacity="0.3" />
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgContent}</svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};
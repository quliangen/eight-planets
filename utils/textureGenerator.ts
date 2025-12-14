
import { PlanetData } from '../types';

/**
 * Generates a Base64 encoded SVG Data URI for a planet's texture.
 * This allows us to use crisp SVG vector graphics as textures on 3D spheres.
 */
export const generatePlanetTexture = (data: PlanetData): string => {
  const { type, colors } = data.textureConfig;
  // Jupiter and Neptune need higher resolution for details
  const width = (data.id === 'jupiter' || data.id === 'neptune' || data.id === 'uranus' || data.id === 'saturn' || data.id === 'sun') ? 1024 : 512;
  const height = (data.id === 'jupiter' || data.id === 'neptune' || data.id === 'uranus' || data.id === 'saturn' || data.id === 'sun') ? 512 : 256; 
  
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

    case 'titan':
        // --- TITAN SPECIFIC (Thick Atmosphere, Orange Haze) ---
        const titanBase = colors[0]; // #D4A050
        const titanDark = colors[1]; // #C08535
        const titanDeep = colors[2]; // #553311
        
        svgContent = `
          <defs>
             <filter id="titanHaze">
                <feGaussianBlur stdDeviation="6" />
             </filter>
             <linearGradient id="titanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stop-color="${titanDeep}" /> <!-- Dark north hood -->
               <stop offset="20%" stop-color="${titanDark}" />
               <stop offset="50%" stop-color="${titanBase}" />
               <stop offset="80%" stop-color="${titanDark}" />
               <stop offset="100%" stop-color="${titanDeep}" />
             </linearGradient>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#titanGrad)" />
          
          <!-- Atmospheric haze layers -->
          <rect width="100%" height="100%" fill="${titanBase}" opacity="0.3" filter="url(#titanHaze)" />
          
          <!-- Subtle barely visible surface features (lakes?) -->
          <path d="M ${width*0.2} ${width*0.4} Q ${width*0.5} ${height*0.3} ${width*0.8} ${height*0.5}" 
                stroke="${titanDeep}" stroke-width="20" opacity="0.1" fill="none" filter="url(#titanHaze)" />
        `;
        break;

    case 'enceladus':
        // --- ENCELADUS SPECIFIC (Ice White, Blue Tiger Stripes) ---
        const encWhite = colors[0]; // #FFFFFF
        const encStripe = colors[2]; // #81D4FA
        
        svgContent = `
          <defs>
             <filter id="iceCracks">
                <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" />
             </filter>
          </defs>
          <rect width="100%" height="100%" fill="${encWhite}" />
          
          <!-- Tiger Stripes at South Pole -->
          <g transform="translate(0, ${height * 0.7})">
             <path d="M ${width*0.2} ${height*0.1} Q ${width*0.5} ${height*0.05} ${width*0.8} ${height*0.1}" stroke="${encStripe}" stroke-width="2" fill="none" opacity="0.6" />
             <path d="M ${width*0.15} ${height*0.15} Q ${width*0.5} ${height*0.1} ${width*0.85} ${height*0.15}" stroke="${encStripe}" stroke-width="2" fill="none" opacity="0.6" />
             <path d="M ${width*0.25} ${height*0.2} Q ${width*0.5} ${height*0.15} ${width*0.75} ${height*0.2}" stroke="${encStripe}" stroke-width="2" fill="none" opacity="0.6" />
             <path d="M ${width*0.3} ${height*0.25} Q ${width*0.5} ${height*0.2} ${width*0.7} ${height*0.25}" stroke="${encStripe}" stroke-width="2" fill="none" opacity="0.6" />
          </g>
          
          <!-- Subtle ice texture -->
          <rect width="100%" height="100%" fill="#E1F5FE" opacity="0.15" filter="url(#iceCracks)" style="mix-blend-mode: multiply;" />
        `;
        break;

    case 'mimas':
        // --- MIMAS SPECIFIC (Death Star Crater) ---
        const mimasGrey = colors[0];
        const mimasShadow = colors[2];
        
        svgContent = `
          <rect width="100%" height="100%" fill="${mimasGrey}" />
          
          <!-- Herschel Crater - The Death Star Eye -->
          <g transform="translate(${width * 0.6}, ${height * 0.4})">
             <circle cx="0" cy="0" r="${height * 0.15}" fill="${mimasShadow}" opacity="0.8" />
             <circle cx="0" cy="0" r="${height * 0.14}" fill="${mimasGrey}" opacity="0.2" />
             <!-- Central Peak -->
             <circle cx="0" cy="0" r="${height * 0.03}" fill="${colors[1]}" opacity="0.9" />
          </g>
          
          <!-- Other small craters -->
          ${Array.from({length: 40}).map(() => {
              const cx = Math.random() * width;
              const cy = Math.random() * height;
              const r = Math.random() * 5 + 1;
              return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${mimasShadow}" opacity="0.4" />`;
           }).join('')}
        `;
        break;

    case 'iapetus':
        // --- IAPETUS SPECIFIC (Yin Yang / Walnut Ridge) ---
        const iapWhite = colors[0];
        const iapBlack = colors[1];
        
        svgContent = `
          <defs>
            <linearGradient id="iapetusSplit" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="30%" stop-color="${iapBlack}" />
               <stop offset="50%" stop-color="${iapBlack}" />
               <stop offset="70%" stop-color="${iapWhite}" />
            </linearGradient>
            <filter id="iapetusNoise">
               <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" />
            </filter>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#iapetusSplit)" />
          
          <!-- Irregularity mask -->
          <rect width="100%" height="100%" fill="black" opacity="0.3" filter="url(#iapetusNoise)" style="mix-blend-mode: overlay;" />
          
          <!-- Equatorial Ridge hint -->
          <line x1="0" y1="${height/2}" x2="${width}" y2="${height/2}" stroke="#555" stroke-width="2" opacity="0.3" />
        `;
        break;

    case 'saturn':
        // --- SATURN SPECIFIC REALISTIC GENERATION ---
        const creamGold = colors[0]; // #EBE3CC
        const mainGold = colors[1];  // #D6C69B
        const deepBand = colors[2];  // #C1A976
        const polarGrey = colors[3]; // #A0957D

        svgContent = `
          <defs>
            <filter id="saturnHaze" x="-10%" y="-10%" width="120%" height="120%">
               <feGaussianBlur stdDeviation="6" />
            </filter>
            
            <filter id="saturnWinds">
               <feTurbulence type="fractalNoise" baseFrequency="0.005 0.1" numOctaves="3" result="noise"/>
               <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" />
            </filter>

            <linearGradient id="saturnBands" x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stop-color="${polarGrey}" /> 
               <stop offset="5%" stop-color="${deepBand}" />
               <stop offset="15%" stop-color="${mainGold}" />
               <stop offset="30%" stop-color="${creamGold}" /> 
               <stop offset="50%" stop-color="${creamGold}" />
               <stop offset="70%" stop-color="${mainGold}" />
               <stop offset="85%" stop-color="${deepBand}" />
               <stop offset="95%" stop-color="${polarGrey}" /> 
            </linearGradient>
            
            <linearGradient id="hexGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#3C3C3C" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="${deepBand}" stop-opacity="0"/>
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#saturnBands)" />
          <rect width="100%" height="100%" filter="url(#saturnWinds)" opacity="0.4" style="mix-blend-mode: overlay;" />

          <g filter="url(#saturnHaze)" opacity="0.6">
             <rect y="${height * 0.2}" width="100%" height="${height * 0.1}" fill="${deepBand}" />
             <rect y="${height * 0.6}" width="100%" height="${height * 0.05}" fill="${mainGold}" />
             <rect y="${height * 0.45}" width="100%" height="${height * 0.1}" fill="#FFFFFF" opacity="0.2" /> 
          </g>

          <path d="M 0 0 L ${width} 0 L ${width} ${height*0.06} 
                   Q ${width*0.8} ${height*0.08}, ${width*0.6} ${height*0.05}
                   T ${width*0.2} ${height*0.07}
                   L 0 ${height*0.06} Z" 
                fill="${polarGrey}" opacity="0.9" filter="url(#saturnHaze)" />
                
          <rect x="0" y="0" width="100%" height="${height*0.02}" fill="#2A2A2A" opacity="0.5" filter="url(#saturnHaze)" />
          <rect width="100%" height="100%" fill="#FFD700" opacity="0.1" style="mix-blend-mode: overlay;" />
        `;
        break;

    case 'uranus':
        // --- URANUS SPECIFIC REALISTIC GENERATION ---
        const paleCyan = colors[0];
        const midCyan = colors[1];
        const deepCyan = colors[2];

        svgContent = `
          <defs>
             <filter id="uranusHaze">
                <feGaussianBlur stdDeviation="8" />
             </filter>
             <filter id="uranusNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" seed="99" />
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.1 0" />
             </filter>
             <linearGradient id="uranusBands" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${paleCyan}" /> 
                <stop offset="25%" stop-color="${midCyan}" />
                <stop offset="45%" stop-color="${deepCyan}" /> 
                <stop offset="55%" stop-color="${deepCyan}" />
                <stop offset="75%" stop-color="${midCyan}" />
                <stop offset="100%" stop-color="${paleCyan}" /> 
             </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#uranusBands)" />
          <rect y="${height * 0.3}" width="100%" height="${height * 0.05}" fill="#ffffff" opacity="0.05" filter="url(#uranusHaze)" />
          <rect y="${height * 0.65}" width="100%" height="${height * 0.08}" fill="#ffffff" opacity="0.03" filter="url(#uranusHaze)" />
          <ellipse cx="${width/2}" cy="0" rx="${width}" ry="${height*0.25}" fill="#ffffff" opacity="0.2" filter="url(#uranusHaze)" />
          <ellipse cx="${width/2}" cy="${height}" rx="${width}" ry="${height*0.25}" fill="#ffffff" opacity="0.2" filter="url(#uranusHaze)" />
          <ellipse cx="${width * 0.7}" cy="${height * 0.4}" rx="${width * 0.05}" ry="${height * 0.01}" fill="#ffffff" opacity="0.3" filter="url(#uranusHaze)" />
          <rect width="100%" height="100%" fill="${paleCyan}" opacity="0.1" style="mix-blend-mode: overlay;" />
        `;
        break;

    case 'neptune':
        // --- NEPTUNE SPECIFIC REALISTIC GENERATION ---
        const deepBlue = colors[0];
        const midBlue = colors[1];
        const brightBlue = colors[2];
        const darkSpotColor = '#0D1546';

        svgContent = `
          <defs>
            <filter id="neptuneWinds" x="-20%" y="-20%" width="140%" height="140%">
               <feTurbulence type="fractalNoise" baseFrequency="0.006 0.05" numOctaves="5" seed="88" result="noise"/>
               <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G" />
               <feGaussianBlur stdDeviation="1.5" />
            </filter>
            <filter id="cloudGlow">
               <feGaussianBlur stdDeviation="3" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="neptuneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="${deepBlue}" />
              <stop offset="20%" stop-color="${midBlue}" />
              <stop offset="50%" stop-color="${brightBlue}" stop-opacity="0.6" /> 
              <stop offset="80%" stop-color="${midBlue}" />
              <stop offset="100%" stop-color="${deepBlue}" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="${deepBlue}" />
          <rect width="100%" height="100%" fill="url(#neptuneGrad)" opacity="0.8" />
          <g filter="url(#neptuneWinds)" opacity="0.4">
             ${Array.from({length: 12}).map((_, i) => {
                 const y = Math.random() * height;
                 const h = Math.random() * 20 + 5;
                 const isDark = Math.random() > 0.5;
                 const streakColor = isDark ? darkSpotColor : brightBlue;
                 const op = Math.random() * 0.4;
                 return `<rect x="0" y="${y}" width="100%" height="${h}" fill="${streakColor}" opacity="${op}" />`;
             }).join('')}
          </g>
          <g transform="translate(${width * 0.3}, ${height * 0.6})">
             <ellipse cx="0" cy="0" rx="${width * 0.08}" ry="${height * 0.05}" fill="${darkSpotColor}" opacity="0.9" />
             <ellipse cx="0" cy="0" rx="${width * 0.085}" ry="${height * 0.055}" stroke="${midBlue}" stroke-width="2" fill="none" opacity="0.3" filter="url(#cloudGlow)"/>
          </g>
          <g filter="url(#cloudGlow)" opacity="0.8">
             <path d="M ${width * 0.25} ${height * 0.55} Q ${width * 0.3} ${height * 0.53} ${width * 0.35} ${height * 0.56}" 
                   stroke="white" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7" />
             <ellipse cx="${width * 0.32}" cy="${height * 0.72}" rx="${width * 0.02}" ry="${height * 0.008}" fill="white" opacity="0.9" />
             <path d="M ${width * 0.6} ${height * 0.25} L ${width * 0.8} ${height * 0.26}" 
                   stroke="white" stroke-width="2" fill="none" opacity="0.4" />
             <path d="M ${width * 0.1} ${height * 0.3} L ${width * 0.25} ${height * 0.28}" 
                   stroke="white" stroke-width="3" fill="none" opacity="0.3" />
          </g>
          <rect width="100%" height="100%" fill="${midBlue}" opacity="0.1" style="mix-blend-mode: overlay;" />
        `;
        break;

    case 'banded':
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
            <filter id="jupiterGas" x="-20%" y="-20%" width="140%" height="140%">
               <feTurbulence type="fractalNoise" baseFrequency="0.004 0.04" numOctaves="4" seed="42" result="noise"/>
               <feDisplacementMap in="SourceGraphic" in2="noise" scale="35" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="stormSwirl">
               <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="3" seed="10"/>
               <feDisplacementMap scale="10" />
               <feGaussianBlur stdDeviation="1" />
            </filter>
            <linearGradient id="jupiterBands" x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stop-color="${polarGrey}" />   
               <stop offset="10%" stop-color="${beltDark}" />
               <stop offset="20%" stop-color="${zoneLight}" />
               <stop offset="30%" stop-color="${beltDarker}" /> 
               <stop offset="40%" stop-color="${zoneLight}" />  
               <stop offset="50%" stop-color="${zoneLight}" />
               <stop offset="55%" stop-color="${beltDarker}" /> 
               <stop offset="65%" stop-color="${zoneLight}" />
               <stop offset="75%" stop-color="${beltDark}" />
               <stop offset="90%" stop-color="${polarGrey}" />   
               <stop offset="100%" stop-color="${polarGrey}" />
            </linearGradient>
            <radialGradient id="grsGrad" cx="50%" cy="50%" r="50%">
               <stop offset="0%" stop-color="${redSpotCore}" />
               <stop offset="60%" stop-color="${redSpotOuter}" />
               <stop offset="90%" stop-color="${zoneLight}" stop-opacity="0.5" />
               <stop offset="100%" stop-color="${zoneLight}" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#jupiterBands)" />
          <g filter="url(#jupiterGas)" opacity="0.7">
             <rect y="${height * 0.28}" width="100%" height="${height * 0.08}" fill="${beltDarker}" opacity="0.6" />
             <rect y="${height * 0.53}" width="100%" height="${height * 0.10}" fill="${beltDarker}" opacity="0.6" />
             ${Array.from({length: 15}).map((_, i) => {
                 const y = Math.random() * height;
                 const h = Math.random() * 5 + 1;
                 const op = Math.random() * 0.3;
                 return `<rect y="${y}" width="100%" height="${h}" fill="#5e4b35" opacity="${op}" />`;
             }).join('')}
          </g>
          <g transform="translate(${width * 0.7}, ${height * 0.6})">
             <path d="M -80 -10 Q -40 -30 0 0 T 80 10" stroke="${beltDarker}" stroke-width="20" fill="none" opacity="0.6" filter="url(#jupiterGas)" />
             <g>
                <ellipse cx="0" cy="0" rx="${width * 0.07}" ry="${height * 0.06}" fill="url(#grsGrad)" />
                <path d="M -30 10 Q 0 25 30 5" stroke="#8B3A1B" stroke-width="3" fill="none" opacity="0.5" filter="url(#stormSwirl)" />
                <path d="M 20 -15 Q -10 -25 -25 -5" stroke="#E8B090" stroke-width="2" fill="none" opacity="0.4" filter="url(#stormSwirl)" />
             </g>
          </g>
          <g transform="translate(0, ${height * 0.72})" opacity="0.8">
             <circle cx="${width * 0.2}" cy="0" r="${width * 0.015}" fill="white" filter="url(#stormSwirl)" />
             <circle cx="${width * 0.35}" cy="5" r="${width * 0.012}" fill="white" filter="url(#stormSwirl)" />
             <circle cx="${width * 0.55}" cy="-2" r="${width * 0.018}" fill="white" filter="url(#stormSwirl)" />
             <circle cx="${width * 0.85}" cy="3" r="${width * 0.014}" fill="white" filter="url(#stormSwirl)" />
          </g>
          <rect width="100%" height="100%" fill="#FFD700" opacity="0.05" style="mix-blend-mode: overlay;" />
        `;
      } else {
        svgContent = `<rect width="100%" height="100%" fill="${baseColor}" />`;
        const numBands = 10;
        const bandHeight = height / numBands;
        for (let i = 0; i < numBands; i++) {
          const color = colors[i % colors.length];
          const h = bandHeight + (Math.random() * 10 - 5);
          const y = i * bandHeight;
          svgContent += `<rect x="0" y="${y}" width="${width}" height="${h}" fill="${color}" />`;
        }
      }
      break;

    case 'io':
        // --- IO SPECIFIC (Volcanic, Yellow/Orange "Pizza") ---
        const ioYellow = colors[0];
        const ioOrange = colors[1];
        const ioWhite = colors[2]; 
        
        svgContent = `
           <defs>
             <filter id="ioNoise">
               <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" />
             </filter>
           </defs>
           <rect width="100%" height="100%" fill="${ioYellow}" />
           
           <!-- Dirty texture overlay for sulfuric look -->
           <rect width="100%" height="100%" filter="url(#ioNoise)" opacity="0.2" style="mix-blend-mode: multiply;" />

           <!-- Random Volcanic Pits (Black/Dark Brown) - The "Pepperoni" -->
           ${Array.from({length: 30}).map(() => {
              const cx = Math.random() * width;
              const cy = Math.random() * height;
              const r = Math.random() * 8 + 3;
              return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#3E2723" opacity="0.9" />`;
           }).join('')}

           <!-- Orange Sulfur Rings around volcanoes -->
           ${Array.from({length: 15}).map(() => {
              const cx = Math.random() * width;
              const cy = Math.random() * height;
              const rx = Math.random() * 50 + 20;
              const ry = Math.random() * 40 + 10;
              return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${ioOrange}" opacity="0.6" filter="url(#ioNoise)" />`;
           }).join('')}
           
           <!-- Reddish splashes -->
           ${Array.from({length: 8}).map(() => {
              const cx = Math.random() * width;
              const cy = Math.random() * height;
              const r = Math.random() * 25 + 5;
              return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#D84315" opacity="0.5" filter="url(#ioNoise)" />`;
           }).join('')}
        `;
        break;

    case 'europa':
        // --- EUROPA SPECIFIC (Ice, White/Beige with Lineae cracks) ---
        const euWhite = colors[0];
        const euBrown = colors[1];
        
        svgContent = `
           <defs>
             <filter id="cracks">
               <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="4" />
               <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="contrast" />
             </filter>
           </defs>
           <!-- Base Ice -->
           <rect width="100%" height="100%" fill="${euWhite}" />
           
           <!-- Subtle surface variation -->
           <rect width="100%" height="100%" fill="#E0F7FA" opacity="0.1">
             <animate attributeName="opacity" values="0.1;0.2;0.1" dur="10s" repeatCount="indefinite" />
           </rect>

           <!-- The Lineae (Reddish Cracks) - Long striations -->
           ${Array.from({length: 15}).map(() => {
               const x1 = Math.random() * width;
               const y1 = Math.random() * height;
               const x2 = Math.random() * width;
               const y2 = Math.random() * height;
               // Bezier curve for organic look
               const cx = (x1 + x2) / 2 + (Math.random() - 0.5) * 150;
               const cy = (y1 + y2) / 2 + (Math.random() - 0.5) * 150;
               return `<path d="M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}" stroke="${euBrown}" stroke-width="${Math.random()*2+1.5}" fill="none" opacity="0.6" />`;
           }).join('')}
           
           <!-- Chaos Terrain (blotchy brownish areas) -->
            ${Array.from({length: 6}).map(() => {
              const cx = Math.random() * width;
              const cy = Math.random() * height;
              const r = Math.random() * 40 + 10;
              return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${euBrown}" opacity="0.25" filter="url(#cracks)" />`;
           }).join('')}
        `;
        break;

    case 'ganymede':
        // --- GANYMEDE SPECIFIC (Dark old terrain vs Light young grooved terrain) ---
        const gaDark = colors[0];
        const gaLight = colors[1];

        svgContent = `
           <defs>
              <filter id="ganymedeNoise">
                 <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" />
              </filter>
           </defs>
           <!-- Base Dark Terrain (Old Cratered) -->
           <rect width="100%" height="100%" fill="${gaDark}" />
           
           <!-- Light Grooved Terrain (Swaths/Bands of lighter color) -->
           <g filter="url(#ganymedeNoise)">
             ${Array.from({length: 10}).map(() => {
                const cx = Math.random() * width;
                const cy = Math.random() * height;
                const rx = Math.random() * 150 + 50;
                const ry = Math.random() * 80 + 30;
                const rot = Math.random() * 180;
                return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${gaLight}" opacity="0.5" transform="rotate(${rot}, ${cx}, ${cy})" />`;
             }).join('')}
           </g>

           <!-- Bright Impact Craters (White spots with rays) -->
           ${Array.from({length: 25}).map(() => {
              const cx = Math.random() * width;
              const cy = Math.random() * height;
              const r = Math.random() * 4 + 1;
              return `
                <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" opacity="0.9" />
                <circle cx="${cx}" cy="${cy}" r="${r * 4}" fill="#FFFFFF" opacity="0.15" />
              `;
           }).join('')}
        `;
        break;

    case 'callisto':
        // --- CALLISTO SPECIFIC (Darkest moon, Heavily Cratered, Sparkly) ---
        const caDark = colors[0];
        const caCraters = colors[1]; 
        
        svgContent = `
           <!-- Very dark base -->
           <rect width="100%" height="100%" fill="${caDark}" />
           
           <!-- Saturation of small craters (White speckles on dark background) -->
           ${Array.from({length: 300}).map(() => {
              const cx = Math.random() * width;
              const cy = Math.random() * height;
              const r = Math.random() * 1.2 + 0.3;
              return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${caCraters}" opacity="0.6" />`;
           }).join('')}

           <!-- Valhalla Basin style multi-ring structures -->
           <g opacity="0.3">
              <circle cx="${width * 0.3}" cy="${height * 0.4}" r="30" stroke="${caCraters}" stroke-width="2" fill="none"/>
              <circle cx="${width * 0.3}" cy="${height * 0.4}" r="50" stroke="${caCraters}" stroke-width="1.5" fill="none"/>
              <circle cx="${width * 0.3}" cy="${height * 0.4}" r="70" stroke="${caCraters}" stroke-width="1" fill="none"/>
           </g>
           
           <!-- Another impact basin -->
           <g opacity="0.3">
              <circle cx="${width * 0.75}" cy="${height * 0.7}" r="20" stroke="${caCraters}" stroke-width="2" fill="none"/>
              <circle cx="${width * 0.75}" cy="${height * 0.7}" r="35" stroke="${caCraters}" stroke-width="1" fill="none"/>
           </g>
        `;
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
      const moonHighland = '#E6E6E6'; 
      const moonMare = '#8C8C8C';     
      const moonCraterShadow = '#555555';

      svgContent = `
        <defs>
          <filter id="moonNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise"/>
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.2 0" in="noise" result="coloredNoise"/>
            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite"/>
          </filter>
          <filter id="mareBlur">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="${moonHighland}" />
        <g filter="url(#mareBlur)" opacity="0.8">
           <ellipse cx="${width * 0.25}" cy="${height * 0.4}" rx="${width * 0.15}" ry="${height * 0.2}" fill="${moonMare}" />
           <circle cx="${width * 0.35}" cy="${height * 0.25}" r="${height * 0.12}" fill="${moonMare}" />
           <ellipse cx="${width * 0.6}" cy="${height * 0.35}" rx="${width * 0.12}" ry="${height * 0.15}" fill="${moonMare}" />
           <circle cx="${width * 0.7}" cy="${height * 0.4}" r="${height * 0.08}" fill="${moonMare}" />
           <circle cx="${width * 0.85}" cy="${height * 0.5}" r="${height * 0.06}" fill="${moonMare}" />
           <circle cx="${width * 0.1}" cy="${height * 0.6}" r="${height * 0.05}" fill="${moonMare}" />
        </g>
        <rect width="100%" height="100%" fill="#000000" opacity="0.1" filter="url(#moonNoise)" />
        <g opacity="0.7">
           <path d="
             M ${width*0.45} ${height*0.75} L ${width*0.3} ${height*0.4} L ${width*0.46} ${height*0.75} 
             L ${width*0.5} ${height*0.2} L ${width*0.48} ${height*0.75}
             L ${width*0.7} ${height*0.5} L ${width*0.5} ${height*0.78}
             L ${width*0.2} ${height*0.8} L ${width*0.45} ${height*0.8}
           " fill="#FFFFFF" opacity="0.4" filter="url(#mareBlur)" />
           <circle cx="${width * 0.47}" cy="${height * 0.78}" r="4" fill="#FFFFFF" />
           <circle cx="${width * 0.47}" cy="${height * 0.78}" r="1.5" fill="${moonCraterShadow}" />
        </g>
        <circle cx="${width * 0.32}" cy="${height * 0.42}" r="3" fill="#FFFFFF" opacity="0.8" />
        <circle cx="${width * 0.32}" cy="${height * 0.42}" r="10" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.3" />
      `;
      
      const numMoonCraters = 60;
      for (let i = 0; i < numMoonCraters; i++) {
        const cx = Math.random() * width;
        const cy = Math.random() * height;
        const r = Math.random() * 6 + 1;
        svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${moonCraterShadow}" opacity="0.5" />`;
        svgContent += `<path d="M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}" fill="none" stroke="#FFFFFF" stroke-width="0.5" opacity="0.3" />`;
      }
      break;

    case 'mars':
      const marsBase = colors[0];
      svgContent = `<rect width="100%" height="100%" fill="${marsBase}" />`;
      const numMarsCraters = 40;
      for (let i = 0; i < numMarsCraters; i++) {
        const cx = Math.random() * width;
        const cy = Math.random() * height * 0.7 + height * 0.15; 
        const r = Math.random() * 12 + 2;
        const color = colors[Math.floor(Math.random() * (colors.length - 1)) + 1];
        svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.6" />`;
      }
      let dNorth = `M 0 0 L ${width} 0 L ${width} ${height * 0.12}`; 
      for (let x = width; x >= 0; x -= 20) {
         const y = height * 0.12 + Math.sin(x / 30) * 5 + (Math.random() * 8);
         dNorth += ` L ${x} ${y}`;
      }
      dNorth += " Z";
      svgContent += `<path d="${dNorth}" fill="#FFFFFF" opacity="0.95" />`;
      let dSouth = `M 0 ${height} L ${width} ${height} L ${width} ${height * 0.88}`;
      for (let x = width; x >= 0; x -= 20) {
         const y = height * 0.88 + Math.sin(x / 30) * 5 - (Math.random() * 8);
         dSouth += ` L ${x} ${y}`;
      }
      dSouth += " Z";
      svgContent += `<path d="${dSouth}" fill="#FFFFFF" opacity="0.95" />`;
      break;

    case 'pluto':
      const plutoBase = colors[0]; 
      const plutoDark = colors[1]; 
      const plutoHeart = colors[2]; 
      svgContent = `<rect width="100%" height="100%" fill="${plutoBase}" />`;
      for (let i = 0; i < 20; i++) {
          const cx = Math.random() * width;
          const cy = Math.random() * height;
          const r = Math.random() * 30 + 5;
          svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${plutoDark}" opacity="0.3" />`;
      }
      const hcx = width * 0.6;
      const hcy = height * 0.5;
      const dHeart = `
        M ${hcx} ${hcy + 40} 
        C ${hcx - 80} ${hcy - 20}, ${hcx - 50} ${hcy - 80}, ${hcx} ${hcy - 30}
        C ${hcx + 50} ${hcy - 80}, ${hcx + 80} ${hcy - 20}, ${hcx} ${hcy + 40}
        Z
      `;
      svgContent += `<path d="${dHeart}" fill="${plutoHeart}" opacity="0.9" />`;
      break;

    case 'atmosphere':
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
      const oceanDeep = '#002F6C'; 
      const oceanShallow = '#0057D9'; 
      const landGreen = '#2E7D32'; 
      const landBrown = '#8D6E63'; 
      const iceWhite = '#F5F5F5'; 
      const cloudWhite = '#FFFFFF';
      svgContent = `
        <defs>
          <linearGradient id="earthOcean" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" style="stop-color:${oceanDeep}" />
             <stop offset="20%" style="stop-color:${oceanShallow}" />
             <stop offset="50%" style="stop-color:${oceanDeep}" />
             <stop offset="80%" style="stop-color:${oceanShallow}" />
             <stop offset="100%" style="stop-color:${oceanDeep}" />
          </linearGradient>
          <filter id="landNoise">
             <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="6" seed="42" result="noise"/>
             <feComponentTransfer in="noise" result="landMask">
                <feFuncA type="linear" slope="20" intercept="-11"/> 
             </feComponentTransfer>
             <feComposite operator="in" in="SourceGraphic" in2="landMask" />
          </filter>
          <filter id="cloudFilter">
             <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="4" seed="123" result="cloudNoise"/>
             <feColorMatrix type="matrix" values="1 0 0 0 1  0 1 0 0 1  0 0 1 0 1  1 0 0 -0.2 -0.1" in="cloudNoise" result="cloudAlpha"/>
             <feComposite operator="in" in="SourceGraphic" in2="cloudAlpha" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#earthOcean)" />
        <g filter="url(#landNoise)">
           <rect width="100%" height="100%" fill="${landGreen}" />
           <filter id="mountainDetail">
              <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" seed="7" />
           </filter>
           <rect width="100%" height="100%" fill="${landBrown}" opacity="0.3" filter="url(#mountainDetail)" style="mix-blend-mode: multiply;" />
        </g>
        <path d="M 0 0 L ${width} 0 L ${width} ${height*0.12} Q ${width/2} ${height*0.18} 0 ${height*0.12} Z" fill="${iceWhite}" opacity="0.95" />
        <path d="M 0 ${height} L ${width} ${height} L ${width} ${height*0.88} Q ${width/2} ${height*0.82} 0 ${height*0.88} Z" fill="${iceWhite}" opacity="0.95" />
        <g filter="url(#cloudFilter)" opacity="0.85">
           <rect width="100%" height="100%" fill="${cloudWhite}" />
        </g>
      `;
      break;

    case 'sun':
      // NASA SDO-inspired "Golden Plasma" style with Limb Darkening and Granulation
      const sunCenter = '#FFD700'; // Bright Gold (Center)
      const sunEdge = '#FF8C00';   // Deep Orange (Edge) - Limb Darkening
      const sunSpotDark = '#3E2723'; 

      svgContent = `
        <defs>
          <radialGradient id="sunBodyGrad" cx="50%" cy="50%" r="50%">
            <stop offset="20%" stop-color="${sunCenter}" />
            <stop offset="85%" stop-color="${sunEdge}" />
            <stop offset="100%" stop-color="#CD5C5C" />
          </radialGradient>

          <filter id="granulation" x="0%" y="0%" width="100%" height="100%">
            <!-- Create the "bubbling" oatmeal texture -->
            <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="3" seed="1" result="noise"/>
            <!-- Adjust contrast to make it subtle -->
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.4 0" in="noise" result="softNoise"/>
          </filter>
          
          <filter id="magneticLoops">
             <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="4" seed="5"/>
             <feDisplacementMap scale="20" />
          </filter>
        </defs>

        <!-- 1. Base Layer with Limb Darkening Gradient -->
        <rect width="100%" height="100%" fill="url(#sunBodyGrad)" />

        <!-- 2. Granulation Texture (Bubbling Plasma) -->
        <rect width="100%" height="100%" filter="url(#granulation)" opacity="0.3" style="mix-blend-mode: overlay;" />
        
        <!-- 3. Active Regions / Plage (Brighter patches) -->
        <g filter="url(#magneticLoops)" opacity="0.6" style="mix-blend-mode: screen;">
           ${Array.from({length: 8}).map(() => {
               const cx = Math.random() * width;
               const cy = Math.random() * height * 0.6 + height * 0.2; // Mostly equatorial
               const rx = Math.random() * 80 + 20;
               const ry = Math.random() * 40 + 10;
               return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#FFFACD" opacity="0.4" />`;
           }).join('')}
        </g>

        <!-- 4. Sunspots (Darker, irregular magnetic fields) -->
        <g filter="url(#magneticLoops)" opacity="0.8">
           ${Array.from({length: 6}).map(() => {
               const cx = Math.random() * width;
               const cy = Math.random() * height * 0.6 + height * 0.2;
               const r = Math.random() * 5 + 2;
               return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${sunSpotDark}" />
                       <circle cx="${cx}" cy="${cy}" r="${r*2.5}" fill="${sunSpotDark}" opacity="0.3" />`;
           }).join('')}
        </g>
      `;
      break;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgContent}</svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

/**
 * Generates a radial gradient glow texture for the Sun's corona.
 */
export const generateSunGlowTexture = (): string => {
  const width = 512;
  const height = 512;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style="stop-color:#FFF8DC;stop-opacity:0.9" /> <!-- Cornsilk White Core -->
          <stop offset="25%" style="stop-color:#FFD700;stop-opacity:0.7" /> <!-- Gold Inner Corona -->
          <stop offset="50%" style="stop-color:#FFA500;stop-opacity:0.4" /> <!-- Orange Mid -->
          <stop offset="75%" style="stop-color:#FF4500;stop-opacity:0.1" /> <!-- Red Outer -->
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
 * UPDATED: Uses Deep Purple, Dark Blue, and Dark Cyan/Teal nebula clouds for dreaminess.
 * UPDATED: Reduces star size (max radius 0.18 for stars > 0.2) to refine visual quality.
 */
export const generateStarFieldTexture = (): string => {
  const width = 2048; 
  const height = 1024;
  
  // 1. Dark Gradient Background (Space)
  let svgContent = `
    <defs>
      <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#020617;stop-opacity:1" /> 
        <stop offset="40%" style="stop-color:#000000;stop-opacity:1" /> 
        <stop offset="100%" style="stop-color:#1a0b2e;stop-opacity:1" /> <!-- Subtle Dark Purple at bottom -->
      </linearGradient>
      <filter id="nebulaBlur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="60" />
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#skyGradient)" />
  `;

  // 2. Dreamy Nebula Colors (Requested)
  const nebulaColors = [
    '#3B0764', // Deep Purple (Indigo-900 like)
    '#172554', // Dark Blue (Blue-950)
    '#083344', // Dark Cyan (Cyan-950)
    '#4c1d95', // Violet
    '#1e1b4b'  // Deep Indigo
  ]; 
  
  const drawSeamlessEllipse = (cx: number, cy: number, rx: number, ry: number, fill: string, opacity: number) => {
      // Draw main ellipse + seamless clones for wrapping texture
      let str = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}" filter="url(#nebulaBlur)" style="mix-blend-mode: screen;" />`;
      if (cx - rx < 0) {
           str += `<ellipse cx="${cx + width}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}" filter="url(#nebulaBlur)" style="mix-blend-mode: screen;" />`;
      }
      if (cx + rx > width) {
           str += `<ellipse cx="${cx - width}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}" filter="url(#nebulaBlur)" style="mix-blend-mode: screen;" />`;
      }
      return str;
  };

  // 3. Generate Cloud Layers
  for (let i = 0; i < 16; i++) {
     const cx = Math.random() * width;
     const cy = Math.random() * height;
     const rx = Math.random() * 600 + 200;
     const ry = Math.random() * 500 + 150;
     const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
     // Low opacity for subtle blending
     const opacity = Math.random() * 0.12 + 0.04; 
     svgContent += drawSeamlessEllipse(cx, cy, rx, ry, color, opacity);
  }
  
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

  // 4. Background Stars (Dust)
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    let r = Math.random() * 0.5 + 0.1;
    if (r > 0.2) r = 0.18; // Apply reduced size
    const opacity = Math.random() * 0.5 + 0.1;
    svgContent += drawSeamlessCircle(x, y, r, "#FFFFFF", opacity);
  }
  
  // 5. Brighter Stars
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    let r = Math.random() * 1.5 + 0.5;
    if (r > 0.2) r = 0.18; // Apply reduced size
    const opacity = Math.random() * 0.8 + 0.2;
    // Slight blue tint for stars
    svgContent += drawSeamlessCircle(x, y, r, "#E0F2FE", opacity);
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgContent}</svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

/**
 * Generates a ring texture for planets (Saturn, Uranus, etc).
 * Creates a circular texture with transparency bands.
 */
export const generateRingTexture = (id: string, color: string): string => {
  const width = 512;
  const height = 512;
  
  // Base SVG
  let svgContent = '';
  
  if (id === 'saturn') {
     // Saturn Rings: Detailed, multiple bands
     svgContent = `
       <defs>
         <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <!-- Inner transparent gap (0-55% roughly hidden by geometry inner radius) -->
            <stop offset="50%" stop-color="#000000" stop-opacity="0" />
            
            <!-- B Ring (Bright, Dense) -->
            <stop offset="55%" stop-color="#BCAFA3" stop-opacity="0.8" />
            <stop offset="60%" stop-color="#CDBA88" stop-opacity="1" />
            <stop offset="70%" stop-color="#D6C69B" stop-opacity="0.9" />

            <!-- Cassini Division (Gap) -->
            <stop offset="75%" stop-color="#000000" stop-opacity="0.1" />
            <stop offset="78%" stop-color="#000000" stop-opacity="0.1" />

            <!-- A Ring -->
            <stop offset="79%" stop-color="#A69E92" stop-opacity="0.7" />
            <stop offset="85%" stop-color="#9C958B" stop-opacity="0.6" />
            <stop offset="95%" stop-color="#8B857E" stop-opacity="0.5" />
            
            <!-- Outer Edge Fade -->
            <stop offset="100%" stop-color="#000000" stop-opacity="0" />
         </radialGradient>
       </defs>
       <rect width="100%" height="100%" fill="url(#ringGrad)" />
       <!-- Add some noise for dust grain effect -->
       <filter id="noise">
         <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" />
       </filter>
       <rect width="100%" height="100%" filter="url(#noise)" opacity="0.15" style="mix-blend-mode: overlay;" />
     `;
  } else if (id === 'uranus') {
     // Uranus: Thin dark rings
     svgContent = `
       <defs>
         <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
            <stop offset="40%" stop-color="${color}" stop-opacity="0" />
            <stop offset="60%" stop-color="${color}" stop-opacity="0.1" />
            <stop offset="65%" stop-color="${color}" stop-opacity="0.4" /> <!-- Epsilon Ring -->
            <stop offset="66%" stop-color="${color}" stop-opacity="0.1" />
            <stop offset="75%" stop-color="${color}" stop-opacity="0.3" />
            <stop offset="80%" stop-color="${color}" stop-opacity="0" />
         </radialGradient>
       </defs>
       <rect width="100%" height="100%" fill="url(#ringGrad)" />
     `;
  } else {
     // Generic (Jupiter/Neptune)
     svgContent = `
       <defs>
         <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
            <stop offset="40%" stop-color="${color}" stop-opacity="0" />
            <stop offset="50%" stop-color="${color}" stop-opacity="0.2" />
            <stop offset="70%" stop-color="${color}" stop-opacity="0.4" />
            <stop offset="80%" stop-color="${color}" stop-opacity="0" />
         </radialGradient>
       </defs>
       <rect width="100%" height="100%" fill="url(#ringGrad)" />
     `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgContent}</svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

/**
 * Generates a texture for the China flag (Tiangong).
 */
export const generateChinaFlagTexture = (): string => {
  const width = 512;
  const height = 341; // Standard 2:3 ratio approx
  
  // Star generation helper
  const drawStar = (cx: number, cy: number, r: number, rot: number) => {
      const points = [];
      for(let i=0; i<5; i++){
          const angle = (rot + i * 72 - 18) * Math.PI / 180; // -18 to start pointing up
          points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
          const innerAngle = (rot + i * 72 + 18) * Math.PI / 180;
          points.push(`${cx + r * 0.382 * Math.cos(innerAngle)},${cy + r * 0.382 * Math.sin(innerAngle)}`);
      }
      return `<polygon points="${points.join(' ')}" fill="#FFDE00" />`;
  };

  const svgContent = `
    <rect width="100%" height="100%" fill="#DE2910" />
    
    <!-- Large Star -->
    ${drawStar(width * 0.16, height * 0.25, height * 0.09, 0)}
    
    <!-- Four Small Stars -->
    ${drawStar(width * 0.32, height * 0.12, height * 0.03, 18)}
    ${drawStar(width * 0.38, height * 0.22, height * 0.03, -18)}
    ${drawStar(width * 0.38, height * 0.37, height * 0.03, 0)}
    ${drawStar(width * 0.32, height * 0.47, height * 0.03, 18)}
    
    <!-- Subtle fabric texture -->
    <filter id="fabric">
       <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="3" />
       <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.1 0" />
       <feComposite operator="in" in2="SourceGraphic" />
    </filter>
    <rect width="100%" height="100%" fill="#000" opacity="0.1" filter="url(#fabric)" style="mix-blend-mode: multiply;" />
  `;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgContent}</svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

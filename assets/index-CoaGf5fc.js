const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./GestureController-DzGKJpE8.js","./vendor-C6RU7c1I.js","./react-CWTfKGRS.js"])))=>i.map(i=>d[i]);
var Jt=Object.defineProperty;var eo=(o,c,s)=>c in o?Jt(o,c,{enumerable:!0,configurable:!0,writable:!0,value:s}):o[c]=s;var wt=(o,c,s)=>eo(o,typeof c!="symbol"?c+"":c,s);import{j as e,r as n,a as to,R as oo}from"./react-CWTfKGRS.js";import{T as pe,C as U,B as It,u as ro,S as be,N as so,a as no,b as ce,D as Ge,c as Lt,A as ge,H as Ze,P as io,s as ao,e as co,L as ft,V as Xe,d as jt,M as Y,O as Ut,f as D,Q as Wt,g as lo,F as po,_ as uo,h as fo,i as ho,j as mo,E as xo,k as yo,l as go,m as bo,R as Fo,n as $o,o as vo}from"./vendor-C6RU7c1I.js";(function(){const c=document.createElement("link").relList;if(c&&c.supports&&c.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const m of i.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&r(m)}).observe(document,{childList:!0,subtree:!0});function s(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(t){if(t.ep)return;t.ep=!0;const i=s(t);fetch(t.href,i)}})();const H={id:"sun",name:"太阳 (The Sun)",color:"#FFD700",size:8,distance:0,realDistance:0,speed:0,rotationSpeed:5e-4,axisTilt:.12,orbitInclination:0,description:`我是太阳系的“大火球”家长！你看我很大，但实际上我比这还要大得多——如果我是个大篮球，地球只能算是一颗小芝麻！

⚠️ 记住哦：我是唯一会发光发热的恒星，但我太亮了，千万不要直接用眼睛看我，会受伤的！`,temperature:"表面 5,500°C / 核心 1,500万°C",composition:"氢 (73%), 氦 (25%)",funFact:"看到我外面那一层淡淡的白光了吗？那叫“日冕”(Corona)！有时候我会“打喷嚏”，喷出巨大的“太阳风”，这些带电的风吹到地球南北极，就变成了漂亮的极光！",textureConfig:{type:"sun",colors:["#FFD700","#FF8C00","#CD5C5C"]}},ve={id:"moon",name:"月球 (The Moon)",color:"#CCCCCC",size:.27,distance:0,realDistance:.38,speed:0,rotationSpeed:0,description:"我是地球唯一的天然卫星。我表面布满了陨石坑，但我没有空气，声音无法传播。我总是用同一面看着地球，因为我非常害羞（被潮汐锁定）！",temperature:"127°C / -173°C",composition:"岩石, 尘埃 (月壤)",funFact:"月球正在慢慢远离地球，每年大概跑远3.8厘米，和你的指甲生长速度差不多！",textureConfig:{type:"moon",colors:["#F5F5F5","#D6D6D6","#A0A0A0"]}},xe={id:"tiangong",name:"中国空间站 (Tiangong)",color:"#00BFFF",size:.1,distance:0,realDistance:4e-4,speed:0,rotationSpeed:0,description:"我是中国人的“太空豪宅”！我在距离地面400公里的轨道上飞行。我有核心舱、实验舱和载人飞船，航天员叔叔阿姨就在我的肚子里做实验和生活。",temperature:"舱内 23°C (恒温)",composition:"金属, 复合材料, 太阳能电池板",funFact:"我飞得超级快，每90分钟就能绕地球一圈，所以上面的航天员一天可以看到16次日出和日落！",textureConfig:{type:"solid",colors:["#FFFFFF"]}},qt=[{id:"io",name:"木卫一 (Io)",color:"#FAD5A5",size:.28,distance:6,realDistance:.42,speed:.8,rotationSpeed:.01,description:"我是太阳系中火山活动最剧烈的星球！因为木星巨大的引力不断拉扯我，我的表面布满了400多座活火山。看起来是不是像一块巨大的起司披萨？",temperature:"火山口 1600°C / 表面 -130°C",composition:"硅酸盐岩石, 硫磺",funFact:"木卫一喷出的火山羽流可以高达500公里！",textureConfig:{type:"io",colors:["#FAD5A5","#F96C18","#FFF"]}},{id:"europa",name:"木卫二 (Europa)",color:"#F5F5DC",size:.25,distance:9,realDistance:.67,speed:.5,rotationSpeed:.008,description:"我是一个冰冻的世界，表面非常光滑，布满了红褐色的裂纹。在厚厚的冰层下面，可能隐藏着一个巨大的液态咸水海洋，甚至可能有生命！",temperature:"-160°C",composition:"冰层, 地下海洋, 岩石核心",funFact:"木卫二的地下海洋水量可能比地球上所有海洋加起来还要多两倍！",textureConfig:{type:"europa",colors:["#F5F5DC","#C49C76","#FFF"]}},{id:"ganymede",name:"木卫三 (Ganymede)",color:"#7C7368",size:.45,distance:13,realDistance:1.07,speed:.3,rotationSpeed:.005,description:"我是太阳系中最大的卫星，个头比水星还要大！我也是唯一拥有自己磁场的卫星。我的表面一半是古老的黑暗陨石坑，一半是年轻的明亮冰脊。",temperature:"-163°C",composition:"硅酸盐岩石, 冰",funFact:"如果你站在木卫三上，你会看到巨大的木星挂在天上，比地球上看到的月亮大15倍！",textureConfig:{type:"ganymede",colors:["#7C7368","#C4B9AC","#FFF"]}},{id:"callisto",name:"木卫四 (Callisto)",color:"#524B43",size:.38,distance:18,realDistance:1.88,speed:.15,rotationSpeed:.003,description:"我是太阳系中遭受撞击最多的星球，表面布满了密密麻麻的古老陨石坑。我像一颗死寂的冰球，几十亿年来几乎没有发生过变化。",temperature:"-139°C",composition:"岩石, 冰",funFact:"木卫四是这四颗卫星中离木星最远的，所以它受到的辐射最少，可能是未来人类建立基地的候选地。",textureConfig:{type:"callisto",colors:["#3E3A36","#8B8680","#FFF"]}}],Ht=[{id:"titan",name:"土卫六 (Titan)",color:"#EDB663",size:.45,distance:12,realDistance:1.2,speed:.25,rotationSpeed:.005,atmosphereColor:"#FFA500",description:"我是土星最大的卫星，也是太阳系唯一拥有浓厚大气层的卫星！我的天空是橙色的，表面有液态甲烷组成的湖泊和河流。",temperature:"-179°C",composition:"冰, 岩石, 氮气大气层",funFact:"泰坦星的大气层比地球还要厚，如果你装上一对翅膀，也许真的能在那里飞起来！",textureConfig:{type:"titan",colors:["#D4A050","#C08535","#553311"]}},{id:"enceladus",name:"土卫二 (Enceladus)",color:"#F0F8FF",size:.15,distance:5,realDistance:.24,speed:.6,rotationSpeed:.01,description:"我是一颗非常明亮的冰球，表面洁白光滑。我的南极有像老虎条纹一样的裂缝，会喷出巨大的冰喷泉！",temperature:"-198°C",composition:"冰, 岩石",funFact:"土卫二喷出的冰粒构成了土星最外层的E环，它是太阳系中最反光的星球之一。",textureConfig:{type:"enceladus",colors:["#FFFFFF","#E0F7FA","#81D4FA"]}},{id:"mimas",name:"土卫一 (Mimas)",color:"#A9A9A9",size:.12,distance:3.5,realDistance:.18,speed:.8,rotationSpeed:.01,description:"我身上有一个巨大的撞击坑，叫赫歇尔陨石坑。这让我看起来非常像电影里的“死星”！",temperature:"-209°C",composition:"冰",funFact:"那个大坑占据了我身体直径的三分之一，如果再大一点，我可能就被撞碎了！",textureConfig:{type:"mimas",colors:["#C0C0C0","#808080","#505050"]}},{id:"iapetus",name:"土卫八 (Iapetus)",color:"#7f7f7f",size:.2,distance:22,realDistance:3.5,speed:.1,rotationSpeed:.002,orbitInclination:.26,description:"我是“阴阳脸”卫星，一面非常黑，像煤炭；另一面非常白，像雪。我的赤道上还有一道高高的山脊，看起来像核桃。",temperature:"-143°C",composition:"冰, 碳质物质",funFact:"我的黑脸是因为扫过了土星外围的一圈暗色尘埃环。",textureConfig:{type:"iapetus",colors:["#FFFFFF","#1a1a1a","#555555"]}}],ye=[{id:"mercury",name:"水星 (Mercury)",color:"#A5A5A5",size:.4,distance:14,realDistance:58,speed:.2,rotationSpeed:.001,axisTilt:0,orbitInclination:.12,description:"我是离太阳最近的行星。我看起来像月球，灰灰的，身上有很多陨石坑。",temperature:"430°C / -180°C",composition:"岩石和金属",funFact:"水星上的一天（从日出到日出）比它的一年还要长！",textureConfig:{type:"crater",colors:["#B0B0B0","#909090","#707070"]}},{id:"venus",name:"金星 (Venus)",color:"#E3BB76",size:.95,distance:20,realDistance:108,speed:.15,rotationSpeed:-5e-4,axisTilt:.05,orbitInclination:.06,atmosphereColor:"#FFD700",description:"我被厚厚的黄色云层包裹着，这些云层不仅反射阳光让我变得很亮，还让我变得超级热！",temperature:"462°C",composition:"二氧化碳 (96%), 岩石",funFact:"金星是顺时针自转的，所以在金星上，太阳是从西边升起的！",textureConfig:{type:"atmosphere",colors:["#F8E2B0","#E3BB76","#D4A96A"]}},{id:"earth",name:"地球 (Earth)",color:"#22A6B3",size:1,distance:28,realDistance:150,speed:.12,rotationSpeed:.005,axisTilt:.41,orbitInclination:0,atmosphereColor:"#00BFFF",description:"我们的家园！我有厚厚的大气层保护大家，还有液态水孕育生命。从太空看，我是一颗美丽的蓝色弹珠。",temperature:"15°C (平均)",composition:"岩石, 水 (71%), 氮气, 氧气",funFact:"地球并不是正圆形的，因为自转，它的肚子（赤道）稍微有点凸出来。",textureConfig:{type:"earth",colors:["#1E88E5","#43A047","#FFFFFF"]}},{id:"mars",name:"火星 (Mars)",color:"#E27B58",size:.53,distance:36,realDistance:228,speed:.08,rotationSpeed:.004,axisTilt:.44,orbitInclination:.03,atmosphereColor:"#FF5722",description:"红色的沙漠星球。我的红色来自于土壤里的铁锈。我的南北两极有冰盖哦！",temperature:"-63°C",composition:"岩石, 氧化铁 (铁锈)",funFact:"火星上的奥林帕斯山是太阳系最高的火山，高度超过21公里。",textureConfig:{type:"mars",colors:["#E27B58","#C05838","#A04020"]}},{id:"jupiter",name:"木星 (Jupiter)",color:"#C88B3A",size:4.2,distance:52,realDistance:778,speed:.04,rotationSpeed:.012,axisTilt:.05,orbitInclination:.02,hasRings:!0,ringColor:"#BCAFA3",atmosphereColor:"#FBC02D",description:"巨大的气态行星！我有漂亮的条纹和大红斑。你知道吗？其实我也有光环，只是它们由尘埃组成，非常暗淡。而且我有非常多的卫星朋友！",temperature:"-108°C",composition:"氢气, 氦气",funFact:"我身上的大红斑是一场刮了300多年的超级风暴，大得能装下整个地球！而且我是太阳系自转最快的行星，一天不到10个小时。",textureConfig:{type:"banded",colors:["#E3DCCB","#D6BC98","#C49C76","#A67B5B"]}},{id:"saturn",name:"土星 (Saturn)",color:"#E0D2B4",size:3.6,distance:72,realDistance:1430,speed:.03,rotationSpeed:.01,axisTilt:.47,orbitInclination:.04,hasRings:!0,ringColor:"#CDBA88",atmosphereColor:"#F4E4BC",description:"我是戴着戒指的宝石。我的光环非常漂亮，是由无数小冰块和石头组成的。我也有很多卫星，包括神奇的泰坦星。",temperature:"-139°C",composition:"氢气, 氦气",funFact:"土星的北极有一个神奇的六边形风暴，大得能装下两个地球！",textureConfig:{type:"saturn",colors:["#EBE3CC","#D6C69B","#C1A976","#A0957D"]}},{id:"uranus",name:"天王星 (Uranus)",color:"#D1F5F8",size:2,distance:90,realDistance:2870,speed:.02,rotationSpeed:.008,axisTilt:1.71,orbitInclination:.01,hasRings:!0,ringColor:"#555555",atmosphereColor:"#D1F5F8",description:"我是冰蓝色的，因为我大气层里有甲烷。我很冷，而且是躺着转的！我的光环非常暗，像煤炭一样黑。",temperature:"-197°C",composition:"冰 (水, 氨, 甲烷)",funFact:"天王星拥有太阳系中最冷的行星大气层，最低温度可达-224°C。",textureConfig:{type:"uranus",colors:["#D1F5F8","#A9E2EF","#91D2E3"]}},{id:"neptune",name:"海王星 (Neptune)",color:"#5B96C3",size:1.9,distance:110,realDistance:4500,speed:.015,rotationSpeed:.008,axisTilt:.49,orbitInclination:.03,hasRings:!0,ringColor:"#A0C4FF",atmosphereColor:"#8FAED9",description:"我是淡蓝色的冰巨星，颜色比天王星稍微深一点点。我有太阳系最快的风，时速可以达到2000公里！",temperature:"-201°C",composition:"冰 (水, 氨, 甲烷)",funFact:"最新的科学研究发现，海王星其实不是深蓝色的，而是和天王星很像的淡青蓝色！",textureConfig:{type:"neptune",colors:["#4A7FBA","#73A5D6","#A0C8EF"]}},{id:"pluto",name:"冥王星 (Pluto)",color:"#D4C6AA",size:.18,distance:130,realDistance:5900,speed:.01,rotationSpeed:-.002,axisTilt:2.1,orbitInclination:.3,atmosphereColor:"#E0E0E0",description:"我以前是第九大行星，现在是矮行星。我离太阳很远，非常冷。我身上有一个大大的白色爱心图案哦！",temperature:"-230°C",composition:"岩石, 冰 (氮冰)",funFact:"冥王星非常小，比我们的月球还要小。它的一年非常长，相当于地球的248年！",textureConfig:{type:"pluto",colors:["#C7B492","#695144","#FFFFFF"]}}],mt=(o,c,s)=>{const r=`<svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${c}" viewBox="0 0 ${o} ${c}">${s}</svg>`;return`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(r)))}`},xt=o=>{const{type:c,colors:s}=o.textureConfig,r=o.id==="jupiter"||o.id==="neptune"||o.id==="uranus"||o.id==="saturn"||o.id==="sun"?1024:512,t=o.id==="jupiter"||o.id==="neptune"||o.id==="uranus"||o.id==="saturn"||o.id==="sun"?512:256;let i="";const m=s[0];switch(c){case"solid":i=`<rect width="100%" height="100%" fill="${m}" />`,i+=`
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${s[0]};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${s[1]||s[0]};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)" opacity="0.5" />
      `;break;case"titan":const u=s[0],f=s[1],a=s[2];i=`
          <defs>
             <filter id="titanHaze">
                <feGaussianBlur stdDeviation="6" />
             </filter>
             <linearGradient id="titanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stop-color="${a}" /> <!-- Dark north hood -->
               <stop offset="20%" stop-color="${f}" />
               <stop offset="50%" stop-color="${u}" />
               <stop offset="80%" stop-color="${f}" />
               <stop offset="100%" stop-color="${a}" />
             </linearGradient>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#titanGrad)" />
          
          <!-- Atmospheric haze layers -->
          <rect width="100%" height="100%" fill="${u}" opacity="0.3" filter="url(#titanHaze)" />
          
          <!-- Subtle barely visible surface features (lakes?) -->
          <path d="M ${r*.2} ${r*.4} Q ${r*.5} ${t*.3} ${r*.8} ${t*.5}" 
                stroke="${a}" stroke-width="20" opacity="0.1" fill="none" filter="url(#titanHaze)" />
        `;break;case"enceladus":const p=s[0],d=s[2];i=`
          <defs>
             <filter id="iceCracks">
                <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" />
             </filter>
          </defs>
          <rect width="100%" height="100%" fill="${p}" />
          
          <!-- Tiger Stripes at South Pole -->
          <g transform="translate(0, ${t*.7})">
             <path d="M ${r*.2} ${t*.1} Q ${r*.5} ${t*.05} ${r*.8} ${t*.1}" stroke="${d}" stroke-width="2" fill="none" opacity="0.6" />
             <path d="M ${r*.15} ${t*.15} Q ${r*.5} ${t*.1} ${r*.85} ${t*.15}" stroke="${d}" stroke-width="2" fill="none" opacity="0.6" />
             <path d="M ${r*.25} ${t*.2} Q ${r*.5} ${t*.15} ${r*.75} ${t*.2}" stroke="${d}" stroke-width="2" fill="none" opacity="0.6" />
             <path d="M ${r*.3} ${t*.25} Q ${r*.5} ${t*.2} ${r*.7} ${t*.25}" stroke="${d}" stroke-width="2" fill="none" opacity="0.6" />
          </g>
          
          <!-- Subtle ice texture -->
          <rect width="100%" height="100%" fill="#E1F5FE" opacity="0.15" filter="url(#iceCracks)" style="mix-blend-mode: multiply;" />
        `;break;case"mimas":const y=s[0],j=s[2];i=`
          <rect width="100%" height="100%" fill="${y}" />
          
          <!-- Herschel Crater - The Death Star Eye -->
          <g transform="translate(${r*.6}, ${t*.4})">
             <circle cx="0" cy="0" r="${t*.15}" fill="${j}" opacity="0.8" />
             <circle cx="0" cy="0" r="${t*.14}" fill="${y}" opacity="0.2" />
             <!-- Central Peak -->
             <circle cx="0" cy="0" r="${t*.03}" fill="${s[1]}" opacity="0.9" />
          </g>
          
          <!-- Other small craters -->
          ${Array.from({length:40}).map(()=>{const h=Math.random()*r,b=Math.random()*t,g=Math.random()*5+1;return`<circle cx="${h}" cy="${b}" r="${g}" fill="${j}" opacity="0.4" />`}).join("")}
        `;break;case"iapetus":const $=s[0],x=s[1];i=`
          <defs>
            <linearGradient id="iapetusSplit" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="30%" stop-color="${x}" />
               <stop offset="50%" stop-color="${x}" />
               <stop offset="70%" stop-color="${$}" />
            </linearGradient>
            <filter id="iapetusNoise">
               <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" />
            </filter>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#iapetusSplit)" />
          
          <!-- Irregularity mask -->
          <rect width="100%" height="100%" fill="black" opacity="0.3" filter="url(#iapetusNoise)" style="mix-blend-mode: overlay;" />
          
          <!-- Equatorial Ridge hint -->
          <line x1="0" y1="${t/2}" x2="${r}" y2="${t/2}" stroke="#555" stroke-width="2" opacity="0.3" />
        `;break;case"saturn":const M=s[0],A=s[1],v=s[2],C=s[3];i=`
          <defs>
            <filter id="saturnHaze" x="-10%" y="-10%" width="120%" height="120%">
               <feGaussianBlur stdDeviation="6" />
            </filter>
            
            <filter id="saturnWinds">
               <feTurbulence type="fractalNoise" baseFrequency="0.005 0.1" numOctaves="3" result="noise"/>
               <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" />
            </filter>

            <linearGradient id="saturnBands" x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stop-color="${C}" /> 
               <stop offset="5%" stop-color="${v}" />
               <stop offset="15%" stop-color="${A}" />
               <stop offset="30%" stop-color="${M}" /> 
               <stop offset="50%" stop-color="${M}" />
               <stop offset="70%" stop-color="${A}" />
               <stop offset="85%" stop-color="${v}" />
               <stop offset="95%" stop-color="${C}" /> 
            </linearGradient>
            
            <linearGradient id="hexGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#3C3C3C" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="${v}" stop-opacity="0"/>
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#saturnBands)" />
          <rect width="100%" height="100%" filter="url(#saturnWinds)" opacity="0.4" style="mix-blend-mode: overlay;" />

          <g filter="url(#saturnHaze)" opacity="0.6">
             <rect y="${t*.2}" width="100%" height="${t*.1}" fill="${v}" />
             <rect y="${t*.6}" width="100%" height="${t*.05}" fill="${A}" />
             <rect y="${t*.45}" width="100%" height="${t*.1}" fill="#FFFFFF" opacity="0.2" /> 
          </g>

          <path d="M 0 0 L ${r} 0 L ${r} ${t*.06} 
                   Q ${r*.8} ${t*.08}, ${r*.6} ${t*.05}
                   T ${r*.2} ${t*.07}
                   L 0 ${t*.06} Z" 
                fill="${C}" opacity="0.9" filter="url(#saturnHaze)" />
                
          <rect x="0" y="0" width="100%" height="${t*.02}" fill="#2A2A2A" opacity="0.5" filter="url(#saturnHaze)" />
          <rect width="100%" height="100%" fill="#FFD700" opacity="0.1" style="mix-blend-mode: overlay;" />
        `;break;case"uranus":const B=s[0],G=s[1],se=s[2];i=`
          <defs>
             <filter id="uranusHaze">
                <feGaussianBlur stdDeviation="8" />
             </filter>
             <filter id="uranusNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" seed="99" />
                <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.1 0" />
             </filter>
             <linearGradient id="uranusBands" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${B}" /> 
                <stop offset="25%" stop-color="${G}" />
                <stop offset="45%" stop-color="${se}" /> 
                <stop offset="55%" stop-color="${se}" />
                <stop offset="75%" stop-color="${G}" />
                <stop offset="100%" stop-color="${B}" /> 
             </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#uranusBands)" />
          <rect y="${t*.3}" width="100%" height="${t*.05}" fill="#ffffff" opacity="0.05" filter="url(#uranusHaze)" />
          <rect y="${t*.65}" width="100%" height="${t*.08}" fill="#ffffff" opacity="0.03" filter="url(#uranusHaze)" />
          <ellipse cx="${r/2}" cy="0" rx="${r}" ry="${t*.25}" fill="#ffffff" opacity="0.2" filter="url(#uranusHaze)" />
          <ellipse cx="${r/2}" cy="${t}" rx="${r}" ry="${t*.25}" fill="#ffffff" opacity="0.2" filter="url(#uranusHaze)" />
          <ellipse cx="${r*.7}" cy="${t*.4}" rx="${r*.05}" ry="${t*.01}" fill="#ffffff" opacity="0.3" filter="url(#uranusHaze)" />
          <rect width="100%" height="100%" fill="${B}" opacity="0.1" style="mix-blend-mode: overlay;" />
        `;break;case"neptune":const ne=s[0],z=s[1],X=s[2],Z="#0D1546";i=`
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
              <stop offset="0%" stop-color="${ne}" />
              <stop offset="20%" stop-color="${z}" />
              <stop offset="50%" stop-color="${X}" stop-opacity="0.6" /> 
              <stop offset="80%" stop-color="${z}" />
              <stop offset="100%" stop-color="${ne}" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="${ne}" />
          <rect width="100%" height="100%" fill="url(#neptuneGrad)" opacity="0.8" />
          <g filter="url(#neptuneWinds)" opacity="0.4">
             ${Array.from({length:12}).map(()=>{const h=Math.random()*t,b=Math.random()*20+5,E=Math.random()>.5?Z:X,Q=Math.random()*.4;return`<rect x="0" y="${h}" width="100%" height="${b}" fill="${E}" opacity="${Q}" />`}).join("")}
          </g>
          <g transform="translate(${r*.3}, ${t*.6})">
             <ellipse cx="0" cy="0" rx="${r*.08}" ry="${t*.05}" fill="${Z}" opacity="0.9" />
             <ellipse cx="0" cy="0" rx="${r*.085}" ry="${t*.055}" stroke="${z}" stroke-width="2" fill="none" opacity="0.3" filter="url(#cloudGlow)"/>
          </g>
          <g filter="url(#cloudGlow)" opacity="0.8">
             <path d="M ${r*.25} ${t*.55} Q ${r*.3} ${t*.53} ${r*.35} ${t*.56}" 
                   stroke="white" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7" />
             <ellipse cx="${r*.32}" cy="${t*.72}" rx="${r*.02}" ry="${t*.008}" fill="white" opacity="0.9" />
             <path d="M ${r*.6} ${t*.25} L ${r*.8} ${t*.26}" 
                   stroke="white" stroke-width="2" fill="none" opacity="0.4" />
             <path d="M ${r*.1} ${t*.3} L ${r*.25} ${t*.28}" 
                   stroke="white" stroke-width="3" fill="none" opacity="0.3" />
          </g>
          <rect width="100%" height="100%" fill="${z}" opacity="0.1" style="mix-blend-mode: overlay;" />
        `;break;case"banded":if(o.id==="jupiter"){const h="#FDF2E3",b="#C99056",g="#9F6C41",E="#8C8C94";i=`
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
               <stop offset="0%" stop-color="${E}" />   
               <stop offset="10%" stop-color="${b}" />
               <stop offset="20%" stop-color="${h}" />
               <stop offset="30%" stop-color="${g}" /> 
               <stop offset="40%" stop-color="${h}" />  
               <stop offset="50%" stop-color="${h}" />
               <stop offset="55%" stop-color="${g}" /> 
               <stop offset="65%" stop-color="${h}" />
               <stop offset="75%" stop-color="${b}" />
               <stop offset="90%" stop-color="${E}" />   
               <stop offset="100%" stop-color="${E}" />
            </linearGradient>
            <radialGradient id="grsGrad" cx="50%" cy="50%" r="50%">
               <stop offset="0%" stop-color="#BC5B38" />
               <stop offset="60%" stop-color="#D68D64" />
               <stop offset="90%" stop-color="${h}" stop-opacity="0.5" />
               <stop offset="100%" stop-color="${h}" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#jupiterBands)" />
          <g filter="url(#jupiterGas)" opacity="0.7">
             <rect y="${t*.28}" width="100%" height="${t*.08}" fill="${g}" opacity="0.6" />
             <rect y="${t*.53}" width="100%" height="${t*.1}" fill="${g}" opacity="0.6" />
             ${Array.from({length:15}).map(()=>{const Ke=Math.random()*t,Je=Math.random()*5+1,ie=Math.random()*.3;return`<rect y="${Ke}" width="100%" height="${Je}" fill="#5e4b35" opacity="${ie}" />`}).join("")}
          </g>
          <g transform="translate(${r*.7}, ${t*.6})">
             <path d="M -80 -10 Q -40 -30 0 0 T 80 10" stroke="${g}" stroke-width="20" fill="none" opacity="0.6" filter="url(#jupiterGas)" />
             <g>
                <ellipse cx="0" cy="0" rx="${r*.07}" ry="${t*.06}" fill="url(#grsGrad)" />
                <path d="M -30 10 Q 0 25 30 5" stroke="#8B3A1B" stroke-width="3" fill="none" opacity="0.5" filter="url(#stormSwirl)" />
                <path d="M 20 -15 Q -10 -25 -25 -5" stroke="#E8B090" stroke-width="2" fill="none" opacity="0.4" filter="url(#stormSwirl)" />
             </g>
          </g>
          <g transform="translate(0, ${t*.72})" opacity="0.8">
             <circle cx="${r*.2}" cy="0" r="${r*.015}" fill="white" filter="url(#stormSwirl)" />
             <circle cx="${r*.35}" cy="5" r="${r*.012}" fill="white" filter="url(#stormSwirl)" />
             <circle cx="${r*.55}" cy="-2" r="${r*.018}" fill="white" filter="url(#stormSwirl)" />
             <circle cx="${r*.85}" cy="3" r="${r*.014}" fill="white" filter="url(#stormSwirl)" />
          </g>
          <rect width="100%" height="100%" fill="#FFD700" opacity="0.05" style="mix-blend-mode: overlay;" />
        `}else{i=`<rect width="100%" height="100%" fill="${m}" />`;const h=10,b=t/h;for(let g=0;g<h;g++){const E=s[g%s.length],Q=b+(Math.random()*10-5),ae=g*b;i+=`<rect x="0" y="${ae}" width="${r}" height="${Q}" fill="${E}" />`}}break;case"io":const le=s[0],F=s[1];i=`
           <defs>
             <filter id="ioNoise">
               <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" />
             </filter>
           </defs>
           <rect width="100%" height="100%" fill="${le}" />
           
           <!-- Dirty texture overlay for sulfuric look -->
           <rect width="100%" height="100%" filter="url(#ioNoise)" opacity="0.2" style="mix-blend-mode: multiply;" />

           <!-- Random Volcanic Pits (Black/Dark Brown) - The "Pepperoni" -->
           ${Array.from({length:30}).map(()=>{const h=Math.random()*r,b=Math.random()*t,g=Math.random()*8+3;return`<circle cx="${h}" cy="${b}" r="${g}" fill="#3E2723" opacity="0.9" />`}).join("")}

           <!-- Orange Sulfur Rings around volcanoes -->
           ${Array.from({length:15}).map(()=>{const h=Math.random()*r,b=Math.random()*t,g=Math.random()*50+20,E=Math.random()*40+10;return`<ellipse cx="${h}" cy="${b}" rx="${g}" ry="${E}" fill="${F}" opacity="0.6" filter="url(#ioNoise)" />`}).join("")}
           
           <!-- Reddish splashes -->
           ${Array.from({length:8}).map(()=>{const h=Math.random()*r,b=Math.random()*t,g=Math.random()*25+5;return`<circle cx="${h}" cy="${b}" r="${g}" fill="#D84315" opacity="0.5" filter="url(#ioNoise)" />`}).join("")}
        `;break;case"europa":const _=s[0],V=s[1];i=`
           <defs>
             <filter id="cracks">
               <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="4" />
               <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="contrast" />
             </filter>
           </defs>
           <!-- Base Ice -->
           <rect width="100%" height="100%" fill="${_}" />
           
           <!-- Subtle surface variation（静态：SVG 贴图只栅格化一次，SMIL 动画不会生效） -->
           <rect width="100%" height="100%" fill="#E0F7FA" opacity="0.15" />

           <!-- The Lineae (Reddish Cracks) - Long striations -->
           ${Array.from({length:15}).map(()=>{const h=Math.random()*r,b=Math.random()*t,g=Math.random()*r,E=Math.random()*t,Q=(h+g)/2+(Math.random()-.5)*150,ae=(b+E)/2+(Math.random()-.5)*150;return`<path d="M ${h} ${b} Q ${Q} ${ae} ${g} ${E}" stroke="${V}" stroke-width="${Math.random()*2+1.5}" fill="none" opacity="0.6" />`}).join("")}
           
           <!-- Chaos Terrain (blotchy brownish areas) -->
            ${Array.from({length:6}).map(()=>{const h=Math.random()*r,b=Math.random()*t,g=Math.random()*40+10;return`<circle cx="${h}" cy="${b}" r="${g}" fill="${V}" opacity="0.25" filter="url(#cracks)" />`}).join("")}
        `;break;case"ganymede":const te=s[0],w=s[1],I=s[2]||"#FFFFFF";i=`
           <defs>
              <!-- Noise for the grooved terrain stripes -->
              <!-- Use turbulence to create linear distortions -->
              <filter id="grooves">
                 <feTurbulence type="turbulence" baseFrequency="0.05 0.005" numOctaves="5" seed="5" result="noise"/>
                 <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
              </filter>
              <!-- Noise for cratered background -->
              <filter id="craterNoise">
                  <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="2" />
              </filter>
           </defs>
           
           <!-- 1. Dark Terrain Base (Galileo Regio style) -->
           <rect width="100%" height="100%" fill="${te}" />
           
           <!-- 2. Light Grooved Terrain (Tectonic Bands) -->
           <!-- We use rotated rectangles distorted by turbulence to simulate the sulci -->
           <g filter="url(#grooves)">
             ${Array.from({length:12}).map(()=>{const h=Math.random()*r,b=Math.random()*t,g=Math.random()*400+100,E=Math.random()*100+50,Q=Math.random()*180;return`<rect x="${h-g/2}" y="${b-E/2}" width="${g}" height="${E}" fill="${w}" opacity="0.75" transform="rotate(${Q} ${h} ${b})" />`}).join("")}
           </g>

           <!-- 3. Bright Ray Craters -->
           ${Array.from({length:15}).map(()=>{const h=Math.random()*r,b=Math.random()*t,g=Math.random()*3+1.5;return`
                <g>
                  <!-- Impact point -->
                  <circle cx="${h}" cy="${b}" r="${g}" fill="${I}" opacity="0.95" />
                  <!-- Rays -->
                  <circle cx="${h}" cy="${b}" r="${g*6}" fill="none" stroke="${I}" stroke-width="1" stroke-dasharray="2 6" opacity="0.5" />
                </g>
              `}).join("")}
           
           <!-- Surface Texture Blend -->
           <rect width="100%" height="100%" fill="#FFFFFF" opacity="0.05" filter="url(#craterNoise)" style="mix-blend-mode: overlay;" />
        `;break;case"callisto":const L=s[0],O=s[1];i=`
           <!-- Very dark base -->
           <rect width="100%" height="100%" fill="${L}" />
           
           <!-- Saturation of small craters (White speckles on dark background) -->
           ${Array.from({length:300}).map(()=>{const h=Math.random()*r,b=Math.random()*t,g=Math.random()*1.2+.3;return`<circle cx="${h}" cy="${b}" r="${g}" fill="${O}" opacity="0.6" />`}).join("")}

           <!-- Valhalla Basin style multi-ring structures -->
           <g opacity="0.3">
              <circle cx="${r*.3}" cy="${t*.4}" r="30" stroke="${O}" stroke-width="2" fill="none"/>
              <circle cx="${r*.3}" cy="${t*.4}" r="50" stroke="${O}" stroke-width="1.5" fill="none"/>
              <circle cx="${r*.3}" cy="${t*.4}" r="70" stroke="${O}" stroke-width="1" fill="none"/>
           </g>
           
           <!-- Another impact basin -->
           <g opacity="0.3">
              <circle cx="${r*.75}" cy="${t*.7}" r="20" stroke="${O}" stroke-width="2" fill="none"/>
              <circle cx="${r*.75}" cy="${t*.7}" r="35" stroke="${O}" stroke-width="1" fill="none"/>
           </g>
        `;break;case"crater":i=`<rect width="100%" height="100%" fill="${m}" />`;const we=40;for(let h=0;h<we;h++){const b=Math.random()*r,g=Math.random()*t,E=Math.random()*15+2,Q=s[Math.floor(Math.random()*(s.length-1))+1];i+=`<circle cx="${b}" cy="${g}" r="${E}" fill="${Q}" opacity="0.6" />`}break;case"moon":const Ie="#E6E6E6",je="#8C8C8C",Le="#555555";i=`
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

        <rect width="100%" height="100%" fill="${Ie}" />
        <g filter="url(#mareBlur)" opacity="0.8">
           <ellipse cx="${r*.25}" cy="${t*.4}" rx="${r*.15}" ry="${t*.2}" fill="${je}" />
           <circle cx="${r*.35}" cy="${t*.25}" r="${t*.12}" fill="${je}" />
           <ellipse cx="${r*.6}" cy="${t*.35}" rx="${r*.12}" ry="${t*.15}" fill="${je}" />
           <circle cx="${r*.7}" cy="${t*.4}" r="${t*.08}" fill="${je}" />
           <circle cx="${r*.85}" cy="${t*.5}" r="${t*.06}" fill="${je}" />
           <circle cx="${r*.1}" cy="${t*.6}" r="${t*.05}" fill="${je}" />
        </g>
        <rect width="100%" height="100%" fill="#000000" opacity="0.1" filter="url(#moonNoise)" />
        <g opacity="0.7">
           <path d="
             M ${r*.45} ${t*.75} L ${r*.3} ${t*.4} L ${r*.46} ${t*.75} 
             L ${r*.5} ${t*.2} L ${r*.48} ${t*.75}
             L ${r*.7} ${t*.5} L ${r*.5} ${t*.78}
             L ${r*.2} ${t*.8} L ${r*.45} ${t*.8}
           " fill="#FFFFFF" opacity="0.4" filter="url(#mareBlur)" />
           <circle cx="${r*.47}" cy="${t*.78}" r="4" fill="#FFFFFF" />
           <circle cx="${r*.47}" cy="${t*.78}" r="1.5" fill="${Le}" />
        </g>
        <circle cx="${r*.32}" cy="${t*.42}" r="3" fill="#FFFFFF" opacity="0.8" />
        <circle cx="${r*.32}" cy="${t*.42}" r="10" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.3" />
      `;const Ue=60;for(let h=0;h<Ue;h++){const b=Math.random()*r,g=Math.random()*t,E=Math.random()*6+1;i+=`<circle cx="${b}" cy="${g}" r="${E}" fill="${Le}" opacity="0.5" />`,i+=`<path d="M ${b-E} ${g} A ${E} ${E} 0 0 1 ${b+E} ${g}" fill="none" stroke="#FFFFFF" stroke-width="0.5" opacity="0.3" />`}break;case"mars":i=`<rect width="100%" height="100%" fill="${s[0]}" />`;const k=40;for(let h=0;h<k;h++){const b=Math.random()*r,g=Math.random()*t*.7+t*.15,E=Math.random()*12+2,Q=s[Math.floor(Math.random()*(s.length-1))+1];i+=`<circle cx="${b}" cy="${g}" r="${E}" fill="${Q}" opacity="0.6" />`}let T=`M 0 0 L ${r} 0 L ${r} ${t*.12}`;for(let h=r;h>=0;h-=20){const b=t*.12+Math.sin(h/30)*5+Math.random()*8;T+=` L ${h} ${b}`}T+=" Z",i+=`<path d="${T}" fill="#FFFFFF" opacity="0.95" />`;let S=`M 0 ${t} L ${r} ${t} L ${r} ${t*.88}`;for(let h=r;h>=0;h-=20){const b=t*.88+Math.sin(h/30)*5-Math.random()*8;S+=` L ${h} ${b}`}S+=" Z",i+=`<path d="${S}" fill="#FFFFFF" opacity="0.95" />`;break;case"pluto":const W=s[0],ue=s[1],fe=s[2];i=`<rect width="100%" height="100%" fill="${W}" />`;for(let h=0;h<20;h++){const b=Math.random()*r,g=Math.random()*t,E=Math.random()*30+5;i+=`<circle cx="${b}" cy="${g}" r="${E}" fill="${ue}" opacity="0.3" />`}const R=r*.6,q=t*.5,De=`
        M ${R} ${q+40} 
        C ${R-80} ${q-20}, ${R-50} ${q-80}, ${R} ${q-30}
        C ${R+50} ${q-80}, ${R+80} ${q-20}, ${R} ${q+40}
        Z
      `;i+=`<path d="${De}" fill="${fe}" opacity="0.9" />`;break;case"atmosphere":i=`
        <defs>
          <linearGradient id="atmos" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${s[0]}" />
            <stop offset="33%" style="stop-color:${s[1]}" />
            <stop offset="66%" style="stop-color:${s[2]}" />
            <stop offset="100%" style="stop-color:${s[0]}" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#atmos)" />
        <!-- 静态覆盖层：SVG 贴图只栅格化一次，SMIL 动画不会生效，直接取中间透明度 -->
        <rect width="100%" height="100%" fill="${s[1]}" opacity="0.25" />
      `;break;case"earth":const N="#002F6C",oe="#0057D9",re="#2E7D32",de="#8D6E63",Me="#F5F5F5";i=`
        <defs>
          <linearGradient id="earthOcean" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" style="stop-color:${N}" />
             <stop offset="20%" style="stop-color:${oe}" />
             <stop offset="50%" style="stop-color:${N}" />
             <stop offset="80%" style="stop-color:${oe}" />
             <stop offset="100%" style="stop-color:${N}" />
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
           <rect width="100%" height="100%" fill="${re}" />
           <filter id="mountainDetail">
              <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" seed="7" />
           </filter>
           <rect width="100%" height="100%" fill="${de}" opacity="0.3" filter="url(#mountainDetail)" style="mix-blend-mode: multiply;" />
        </g>
        <path d="M 0 0 L ${r} 0 L ${r} ${t*.12} Q ${r/2} ${t*.18} 0 ${t*.12} Z" fill="${Me}" opacity="0.95" />
        <path d="M 0 ${t} L ${r} ${t} L ${r} ${t*.88} Q ${r/2} ${t*.82} 0 ${t*.88} Z" fill="${Me}" opacity="0.95" />
        <g filter="url(#cloudFilter)" opacity="0.85">
           <rect width="100%" height="100%" fill="#FFFFFF" />
        </g>
      `;break;case"sun":const Se="#FFD700",Ee="#FF8C00",Fe="#3E2723";i=`
        <defs>
          <radialGradient id="sunBodyGrad" cx="50%" cy="50%" r="50%">
            <stop offset="20%" stop-color="${Se}" />
            <stop offset="85%" stop-color="${Ee}" />
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
           ${Array.from({length:8}).map(()=>{const h=Math.random()*r,b=Math.random()*t*.6+t*.2,g=Math.random()*80+20,E=Math.random()*40+10;return`<ellipse cx="${h}" cy="${b}" rx="${g}" ry="${E}" fill="#FFFACD" opacity="0.4" />`}).join("")}
        </g>

        <!-- 4. Sunspots (Darker, irregular magnetic fields) -->
        <g filter="url(#magneticLoops)" opacity="0.8">
           ${Array.from({length:6}).map(()=>{const h=Math.random()*r,b=Math.random()*t*.6+t*.2,g=Math.random()*5+2;return`<circle cx="${h}" cy="${b}" r="${g}" fill="${Fe}" />
                       <circle cx="${h}" cy="${b}" r="${g*2.5}" fill="${Fe}" opacity="0.3" />`}).join("")}
        </g>
      `;break}const l=`<svg xmlns="http://www.w3.org/2000/svg" width="${r}" height="${t}" viewBox="0 0 ${r} ${t}">${i}</svg>`;return`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(l)))}`},wo=()=>`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
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
  `)))}`,jo=()=>`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
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
  `)))}`,Vt=!1,Mo=[{name:"猎户座",labelOffset:[0,14],stars:[{ra:5.9195,dec:7.407,mag:.42,color:"#FF9E57"},{ra:5.2423,dec:-8.202,mag:.13,color:"#D2E2FF"},{ra:5.4189,dec:6.35,mag:1.64,color:"#C7D8FF"},{ra:5.6793,dec:-1.943,mag:1.77,color:"#C0D4FF"},{ra:5.6036,dec:-1.202,mag:1.69,color:"#C6D6FF"},{ra:5.5334,dec:-.299,mag:2.23,color:"#CBD9FF"},{ra:5.7959,dec:-9.67,mag:2.09,color:"#C4D2FF"}],lines:[[0,2],[0,3],[2,5],[3,4],[4,5],[3,6],[5,1],[6,1]]},{name:"双子座",labelOffset:[0,9],stars:[{ra:7.5766,dec:31.888,mag:1.58,color:"#F0F4FF"},{ra:7.7553,dec:28.026,mag:1.14,color:"#FFD9A0"},{ra:6.6285,dec:16.399,mag:1.92,color:"#EDF2FF"},{ra:7.3354,dec:21.982,mag:3.53,color:"#FFF4E0"},{ra:6.7322,dec:25.131,mag:2.98,color:"#FFE9C8"},{ra:6.3827,dec:22.514,mag:2.86,color:"#FFC890"}],lines:[[0,1],[0,4],[4,5],[1,3],[3,2]]},{name:"北斗七星",labelOffset:[0,9],stars:[{ra:11.0621,dec:61.751,mag:1.79,color:"#FFE3B3"},{ra:11.0307,dec:56.382,mag:2.37,color:"#F0F4FF"},{ra:11.8972,dec:53.695,mag:2.44,color:"#EDF2FF"},{ra:12.2571,dec:57.033,mag:3.31,color:"#F0F4FF"},{ra:12.9005,dec:55.96,mag:1.77,color:"#E4EBFF"},{ra:13.3988,dec:54.925,mag:2.27,color:"#F0F4FF"},{ra:13.7923,dec:49.313,mag:1.86,color:"#C9D8FF"}],lines:[[0,1],[1,2],[2,3],[3,0],[3,4],[4,5],[5,6]]},{name:"天蝎座",labelOffset:[0,-13],stars:[{ra:16.4901,dec:-26.432,mag:.96,color:"#FF7043"},{ra:16.0906,dec:-19.805,mag:2.62,color:"#C6D6FF"},{ra:16.0056,dec:-22.622,mag:2.32,color:"#C2D2FF"},{ra:15.9809,dec:-26.114,mag:2.89,color:"#C4D6FF"},{ra:16.3531,dec:-25.593,mag:2.89,color:"#C2D2FF"},{ra:16.598,dec:-28.216,mag:2.82,color:"#C6D6FF"},{ra:16.836,dec:-34.293,mag:2.29,color:"#FFE3C8"},{ra:16.8723,dec:-38.051,mag:3,color:"#C6D6FF"},{ra:16.9097,dec:-42.361,mag:3.62,color:"#FFD8B0"},{ra:17.2026,dec:-43.239,mag:3.33,color:"#FFE9D0"},{ra:17.622,dec:-42.998,mag:1.87,color:"#FFF2E0"},{ra:17.7931,dec:-40.127,mag:2.99,color:"#FFF4E4"},{ra:17.7081,dec:-39.03,mag:2.41,color:"#C0D0FF"},{ra:17.5601,dec:-37.104,mag:1.63,color:"#C6D6FF"},{ra:17.5127,dec:-37.296,mag:2.69,color:"#C4D4FF"}],lines:[[1,2],[2,3],[2,4],[4,0],[0,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14]]},{name:"仙后座",labelOffset:[0,-9],stars:[{ra:.153,dec:59.15,mag:2.27,color:"#FFF4E8"},{ra:.6751,dec:56.537,mag:2.24,color:"#FFDCAE"},{ra:.9451,dec:60.717,mag:2.47,color:"#C9D8FF"},{ra:1.4303,dec:60.235,mag:2.68,color:"#EDF2FF"},{ra:1.9066,dec:63.67,mag:3.38,color:"#C2D2FF"}],lines:[[0,1],[1,2],[2,3],[3,4]]}],Co=()=>{let s=`
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
  `;const r=["#312E81","#4C1D95","#1e3a8a","#581c87"],t=(l,u,f,a,p,d)=>{let y=`<ellipse cx="${l}" cy="${u}" rx="${f}" ry="${a}" fill="${p}" opacity="${d}" filter="url(#nebulaBlur)" />`;return l-f<0&&(y+=`<ellipse cx="${l+2048}" cy="${u}" rx="${f}" ry="${a}" fill="${p}" opacity="${d}" filter="url(#nebulaBlur)" />`),l+f>2048&&(y+=`<ellipse cx="${l-2048}" cy="${u}" rx="${f}" ry="${a}" fill="${p}" opacity="${d}" filter="url(#nebulaBlur)" />`),y};for(let l=0;l<6;l++){const u=Math.random()*2048,f=Math.random()*1024,a=Math.random()*300+200,p=Math.random()*200+100,d=r[Math.floor(Math.random()*r.length)],y=Math.random()*.15+.05;s+=t(u,f,a,p,d,y)}const i=(l,u,f,a,p)=>{let d=`<circle cx="${l}" cy="${u}" r="${f}" fill="${a}" opacity="${p}" />`;return l-f<0&&(d+=`<circle cx="${l+2048}" cy="${u}" r="${f}" fill="${a}" opacity="${p}" />`),l+f>2048&&(d+=`<circle cx="${l-2048}" cy="${u}" r="${f}" fill="${a}" opacity="${p}" />`),d};for(let l=0;l<800;l++){const u=Math.random()*2048,f=Math.random()*1024,a=Math.random()*.6+.2,p=Math.random();let d="#FFFFFF";p>.85&&(d="#BAE6FD"),p<.15&&(d="#FEF3C7");let y=Math.random()*.5+.2;a>.3&&(y=y*.5),s+=i(u,f,a,d,y)}for(let l=0;l<20;l++){const u=Math.random()*2048,f=Math.random()*1024,a=Math.random()*.8+.6;s+=i(u,f,a,"#FFFFFF",.8)}const m=`<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="1024" preserveAspectRatio="none" viewBox="0 0 2048 1024">${s}</svg>`;return`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(m)))}`},Qt=o=>{const c="#FFDE00",s="#DE2910",r=o/30,t=(u,f,a,p=0)=>{let d="";const y=a*r,j=y*.382;let $=p;const x=Math.PI/5,M=u*r,A=f*r;for(let v=0;v<5;v++){let C=M+Math.cos($)*y,B=A+Math.sin($)*y;d+=`${C},${B} `,$+=x,C=M+Math.cos($)*j,B=A+Math.sin($)*j,d+=`${C},${B} `,$+=x}return d},i=t(5,5,3,-Math.PI/2),m=[{x:10,y:2},{x:12,y:4},{x:12,y:7},{x:10,y:9}];let l="";return m.forEach(u=>{const f=Math.atan2(5-u.y,5-u.x);l+=`<polygon points="${t(u.x,u.y,1,f)}" fill="${c}" />`}),`
    <rect width="100%" height="100%" fill="${s}" />
    <polygon points="${i}" fill="${c}" />
    ${l}
  `},So=()=>mt(600,400,Qt(600)),ko=()=>{let t='<rect x="0" y="0" width="512" height="512" fill="#161B22" />';for(let a=0;a<512;a+=36)for(let p=0;p<512;p+=36){const d=Math.random();d>.6&&(t+=`<rect x="${p}" y="${a}" width="36" height="36" fill="${d>.85?"#2A3340":"#0D1117"}" opacity="0.5" />`)}let i="";for(let a=0;a<=512;a+=36)i+=`<line x1="${a}" y1="0" x2="${a}" y2="512" stroke="#39424E" stroke-width="1" opacity="0.55" />`;for(let a=0;a<=512;a+=36)i+=`<line x1="0" y1="${a}" x2="512" y2="${a}" stroke="#39424E" stroke-width="1" opacity="0.55" />`;let m='<rect x="512" y="0" width="512" height="512" fill="#D7DEE7" />';for(let a=0;a<130;a++){const p=512+Math.random()*512,d=Math.random()>.5;m+=`<line x1="${p}" y1="0" x2="${p}" y2="512" stroke="${d?"#FFFFFF":"#9AA8BA"}" stroke-width="${Math.random()*2+.5}" opacity="${Math.random()*.07+.02}" />`}let l="";[64,168,296,424,478].forEach(a=>{l+=`<line x1="0" y1="${a}" x2="1024" y2="${a}" stroke="#0A0D12" stroke-width="2.5" opacity="0.45" />`,l+=`<line x1="512" y1="${a+2}" x2="1024" y2="${a+2}" stroke="#FFFFFF" stroke-width="1" opacity="0.25" />`});const u='<rect x="510" y="0" width="4" height="512" fill="#3B4654" opacity="0.8" />',f=`
    <g transform="translate(672, 120) scale(0.32)">
      ${Qt(600)}
    </g>
    <text x="768" y="290" font-family="sans-serif" font-size="34" font-weight="bold"
          fill="#5B6B80" text-anchor="middle" letter-spacing="6">小豆子号</text>
  `;return mt(1024,512,t+i+m+l+u+f)},No=()=>{const o=["小","豆","子","号"],c=(r,t)=>o.map((i,m)=>`<text x="64" y="${r+m*118}" text-anchor="middle" font-family="sans-serif" font-size="92" font-weight="bold" ${t}>${i}</text>`).join(""),s=`
    <defs>
      <filter id="nameGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>
    ${c(96,'fill="#00FFFF" opacity="0.85" filter="url(#nameGlow)"')}
    ${c(96,'fill="#FFFFFF" stroke="#00FFFF" stroke-width="2" paint-order="stroke"')}
  `;return mt(128,512,s)},Do=(o,c)=>{let t="";o==="saturn"?t=`
      <defs>
        <radialGradient id="saturnRing" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="50%" style="stop-color:transparent;stop-opacity:0" />
          <stop offset="55%" style="stop-color:#5A5040;stop-opacity:0.3" />
          <stop offset="63%" style="stop-color:#5A5040;stop-opacity:0.4" />
          <stop offset="63.5%" style="stop-color:#2a2a2a;stop-opacity:0.1" />
          <stop offset="64%" style="stop-color:#CDBA88;stop-opacity:0.8" />
          <stop offset="70%" style="stop-color:#EFEBCF;stop-opacity:1" /> 
          <stop offset="72%" style="stop-color:#D8C48E;stop-opacity:0.9" />
          <stop offset="75%" style="stop-color:#BFA667;stop-opacity:0.8" />
          <stop offset="75.5%" style="stop-color:#000000;stop-opacity:0.05" />
          <stop offset="78%" style="stop-color:#000000;stop-opacity:0.05" />
          <stop offset="78.5%" style="stop-color:#A89870;stop-opacity:0.8" />
          <stop offset="85%" style="stop-color:#B0A076;stop-opacity:0.7" />
          <stop offset="86%" style="stop-color:#000000;stop-opacity:0.1" />
          <stop offset="86.5%" style="stop-color:#A89870;stop-opacity:0.7" />
          <stop offset="90%" style="stop-color:#958763;stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
        </radialGradient>
        <filter id="ringNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#saturnRing)" />
      <rect width="100%" height="100%" filter="url(#ringNoise)" opacity="0.4" style="mix-blend-mode: overlay;" />
      <circle cx="512" cy="512" r="300" stroke="#443322" stroke-width="1" fill="none" opacity="0.2" />
      <circle cx="512" cy="512" r="350" stroke="#443322" stroke-width="0.5" fill="none" opacity="0.2" />
      <circle cx="512" cy="512" r="400" stroke="#443322" stroke-width="1" fill="none" opacity="0.2" />
    `:o==="uranus"?t=`
      <defs>
        <radialGradient id="uranusBaseGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
           <stop offset="40%" style="stop-color:transparent;stop-opacity:0" />
           <stop offset="50%" style="stop-color:#71C9CE;stop-opacity:0" />
           <stop offset="65%" style="stop-color:#A6E3E9;stop-opacity:0.15" />
           <stop offset="85%" style="stop-color:#CBF1F5;stop-opacity:0.25" />
           <stop offset="95%" style="stop-color:#71C9CE;stop-opacity:0" />
        </radialGradient>
        <radialGradient id="uranusBands" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
           <stop offset="58%" style="stop-color:#FFFFFF;stop-opacity:0" />
           <stop offset="59%" style="stop-color:#FFFFFF;stop-opacity:0.7" />
           <stop offset="60%" style="stop-color:#FFFFFF;stop-opacity:0" />
           <stop offset="70%" style="stop-color:#FFFFFF;stop-opacity:0" />
           <stop offset="71%" style="stop-color:#FFFFFF;stop-opacity:0.8" />
           <stop offset="72%" style="stop-color:#FFFFFF;stop-opacity:0" />
           <stop offset="84%" style="stop-color:#FFFFFF;stop-opacity:0" />
           <stop offset="85%" style="stop-color:#E0FFFF;stop-opacity:0.9" /> 
           <stop offset="86%" style="stop-color:#FFFFFF;stop-opacity:1.0" />
           <stop offset="87%" style="stop-color:#E0FFFF;stop-opacity:0.9" />
           <stop offset="88%" style="stop-color:#FFFFFF;stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#uranusBaseGlow)" />
      <rect width="100%" height="100%" fill="url(#uranusBands)" />
      <circle cx="512" cy="512" r="440" stroke="#FFFFFF" stroke-width="4" fill="none" opacity="0.8" />
      <circle cx="512" cy="512" r="364" stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.5" />
    `:o==="neptune"?t=`
        <defs>
          <radialGradient id="neptuneRings" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
             <stop offset="55%" style="stop-color:transparent;stop-opacity:0" />
             <stop offset="60%" style="stop-color:#A0C4FF;stop-opacity:0.1" />
             <stop offset="65%" style="stop-color:#A0C4FF;stop-opacity:0.05" />
             <stop offset="66%" style="stop-color:transparent;stop-opacity:0" />
             <stop offset="75%" style="stop-color:transparent;stop-opacity:0" />
             <stop offset="75.5%" style="stop-color:#E0F0FF;stop-opacity:0.4" />
             <stop offset="76%" style="stop-color:transparent;stop-opacity:0" />
             <stop offset="88%" style="stop-color:transparent;stop-opacity:0" />
             <stop offset="88.5%" style="stop-color:#FFFFFF;stop-opacity:0.5" />
             <stop offset="89%" style="stop-color:#FFFFFF;stop-opacity:0.5" />
             <stop offset="89.5%" style="stop-color:transparent;stop-opacity:0" />
          </radialGradient>
          <filter id="neptuneNoise">
             <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#neptuneRings)" />
        <rect width="100%" height="100%" filter="url(#neptuneNoise)" opacity="0.3" style="mix-blend-mode: multiply;" />
        <circle cx="512" cy="512" r="455" stroke="#FFFFFF" stroke-width="4" fill="none" opacity="0.7" stroke-dasharray="40 250 60 180 50 1000" stroke-linecap="round" />
      `:o==="jupiter"?t=`
        <defs>
          <radialGradient id="jupiterRingGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="50%" style="stop-color:transparent;stop-opacity:0" />
            <stop offset="52%" style="stop-color:#8D7B68;stop-opacity:0.05" />
            <stop offset="58%" style="stop-color:#8D7B68;stop-opacity:0.1" />
            <stop offset="60%" style="stop-color:#A4907C;stop-opacity:0.2" /> 
            <stop offset="61%" style="stop-color:#BCAFA3;stop-opacity:0.25" />
            <stop offset="62%" style="stop-color:#A4907C;stop-opacity:0.2" />
            <stop offset="63%" style="stop-color:#8D7B68;stop-opacity:0.05" />
            <stop offset="70%" style="stop-color:#8D7B68;stop-opacity:0.02" />
            <stop offset="72%" style="stop-color:transparent;stop-opacity:0" />
          </radialGradient>
          <filter id="dustNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
            <feColorMatrix type="saturate" values="0"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#jupiterRingGrad)" />
        <rect width="100%" height="100%" filter="url(#dustNoise)" opacity="0.3" style="mix-blend-mode: multiply;" />
        <circle cx="512" cy="512" r="312" stroke="#BCAFA3" stroke-width="1" fill="none" opacity="0.1" />
      `:t=`
      <defs>
        <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="40%" style="stop-color:${c};stop-opacity:0" />
          <stop offset="50%" style="stop-color:${c};stop-opacity:0.2" />
          <stop offset="60%" style="stop-color:${c};stop-opacity:0.9" />
          <stop offset="65%" style="stop-color:${c};stop-opacity:0.3" />
          <stop offset="68%" style="stop-color:${c};stop-opacity:0.8" />
          <stop offset="85%" style="stop-color:${c};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${c};stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#ringGrad)" />
      <circle cx="512" cy="512" r="360" stroke="${c}" stroke-width="1" fill="none" opacity="0.3" />
      <circle cx="512" cy="512" r="400" stroke="${c}" stroke-width="2" fill="none" opacity="0.2" />
      <circle cx="512" cy="512" r="440" stroke="${c}" stroke-width="1" fill="none" opacity="0.3" />
    `;const i=`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${t}</svg>`;return`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(i)))}`};let et=null;const yt=()=>(et||(et=new pe().load(jo())),et),gt=({name:o,color:c})=>{const s=o.match(/^(.+?)\s*\((.+?)\)$/),r=s?s[1]:o,i=(s?s[2]:"").replace(/\s+/g,"");return e.jsxs("div",{className:"absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none w-max",children:[e.jsxs("div",{className:`mb-1 px-5 py-2 flex flex-row items-baseline gap-3
                    bg-linear-to-t from-black/80 to-transparent backdrop-blur-sm rounded-sm border-b-2
                    transform transition-all duration-300 animate-fade-in-up`,style:{borderColor:c,textShadow:`0 0 10px ${c}80`},children:[e.jsx("span",{className:"text-white font-bold text-2xl tracking-widest drop-shadow-md font-sans",children:r}),i&&e.jsx("span",{className:"text-xs font-mono font-medium tracking-[0.15em] text-cyan-200/80 uppercase",children:i})]}),e.jsxs("div",{className:"flex flex-col items-center relative",children:[e.jsx("div",{className:"w-px h-10 bg-linear-to-b from-white/40 to-transparent"}),e.jsxs("div",{className:"absolute bottom-0 w-6 h-6 flex items-center justify-center translate-y-1/2",children:[e.jsx("div",{className:"absolute w-full h-full border border-white/20 rounded-full animate-[spin_4s_linear_infinite]"}),e.jsx("div",{className:"absolute w-[70%] h-[70%] border-l border-r border-white/50 rounded-full animate-[spin_3s_linear_infinite_reverse]"}),e.jsx("div",{className:"w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]"})]})]})]})},tt={day:"./textures/planets/earth_day_4096.jpg",night:"./textures/planets/earth_night_4096.jpg",data:"./textures/planets/earth_bump_roughness_clouds_4096.jpg"},Yt="#4db2ff",Xt="#bc490b",ht=`
  varying vec3 vEarthWorldPosition;
  varying vec3 vEarthWorldNormal;
`,Zt=`
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
`,Eo=`
  float getEarthHeight(vec2 earthUv) {
    vec3 packedData = texture2D(earthDataMap, earthUv).rgb;
    return max(packedData.r, smoothstep(0.2, 1.0, packedData.b));
  }
`,To=no.bumpmap_pars_fragment.replace("texture2D( bumpMap, vBumpMapUv ).x","getEarthHeight( vBumpMapUv )").replace("texture2D( bumpMap, vBumpMapUv + dSTdx ).x","getEarthHeight( vBumpMapUv + dSTdx )").replace("texture2D( bumpMap, vBumpMapUv + dSTdy ).x","getEarthHeight( vBumpMapUv + dSTdy )"),Mt=()=>e.jsx("meshStandardMaterial",{color:"#195f9d",roughness:.65,metalness:.05});class Ro extends n.Component{constructor(){super(...arguments);wt(this,"state",{failed:!1})}static getDerivedStateFromError(){return{failed:!0}}componentDidCatch(s){console.warn("Earth textures failed to load; using fallback material.",s)}render(){return this.state.failed?this.props.fallback:this.props.children}}const Ao=()=>{const[o,c,s]=ro(pe,[tt.day,tt.night,tt.data]);n.useLayoutEffect(()=>{o.colorSpace=be,c.colorSpace=be,s.colorSpace=so;for(const t of[o,c,s])t.anisotropy=8,t.needsUpdate=!0},[o,c,s]);const r=n.useCallback(t=>{Object.assign(t.uniforms,{earthNightMap:{value:c},earthDataMap:{value:s},earthAtmosphereDayColor:{value:new U(Yt)},earthAtmosphereTwilightColor:{value:new U(Xt)}}),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
${ht}`).replace("#include <worldpos_vertex>",`
        #include <worldpos_vertex>
        vEarthWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vEarthWorldNormal = normalize(mat3(modelMatrix) * objectNormal);
      `),t.fragmentShader=t.fragmentShader.replace("#include <common>",`
        #include <common>
        uniform sampler2D earthNightMap;
        uniform sampler2D earthDataMap;
        uniform vec3 earthAtmosphereDayColor;
        uniform vec3 earthAtmosphereTwilightColor;
        ${ht}
        ${Zt}
      `).replace("#include <map_fragment>",`
        #include <map_fragment>
        vec3 earthData = texture2D(earthDataMap, vMapUv).rgb;
        float earthCloudStrength = smoothstep(0.2, 1.0, earthData.b);
        diffuseColor.rgb = mix(
          diffuseColor.rgb,
          vec3(1.0),
          clamp(earthCloudStrength * 2.0, 0.0, 1.0)
        );
      `).replace("#include <roughnessmap_fragment>",`
        #include <roughnessmap_fragment>
        float earthPackedRoughness = max(
          earthData.g,
          step(0.01, earthCloudStrength)
        );
        roughnessFactor = mix(0.25, 0.35, earthPackedRoughness);
      `).replace("#include <bumpmap_pars_fragment>",`
        ${Eo}
        ${To}
      `).replace("#include <opaque_fragment>",`
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
      `)},[s,c]);return e.jsx("meshStandardMaterial",{map:o,bumpMap:s,bumpScale:1,metalness:0,roughness:.35,onBeforeCompile:r})},Go=()=>e.jsx(n.Suspense,{fallback:e.jsx(Mt,{}),children:e.jsx(Ro,{fallback:e.jsx(Mt,{}),children:e.jsx(Ao,{})})}),zo=`
  varying vec3 vEarthWorldPosition;
  varying vec3 vEarthWorldNormal;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vEarthWorldPosition = worldPosition.xyz;
    vEarthWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`,Po=`
  uniform vec3 earthAtmosphereDayColor;
  uniform vec3 earthAtmosphereTwilightColor;
  ${ht}
  ${Zt}

  void main() {
    float sunOrientation = getEarthSunOrientation();
    float alpha = pow(clamp((1.0 - getEarthFresnel()) / 0.27, 0.0, 1.0), 3.0);
    alpha *= smoothstep(-0.5, 1.0, sunOrientation);

    gl_FragColor = vec4(getEarthAtmosphereColor(sunOrientation), alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`,Bo=({radius:o})=>{const c=n.useMemo(()=>({earthAtmosphereDayColor:{value:new U(Yt)},earthAtmosphereTwilightColor:{value:new U(Xt)}}),[]);return e.jsxs("mesh",{scale:1.04,raycast:()=>null,children:[e.jsx("sphereGeometry",{args:[o,64,64]}),e.jsx("shaderMaterial",{uniforms:c,vertexShader:zo,fragmentShader:Po,side:It,transparent:!0,depthWrite:!1})]})},_o=({texture:o})=>{const c=n.useRef(null),s=n.useMemo(()=>new io(1.5,1,10,8),[]);return n.useEffect(()=>()=>s.dispose(),[s]),ce(r=>{if(!c.current)return;const t=s.attributes.position,i=t.count,m=r.clock.elapsedTime;for(let l=0;l<i;l++){const u=t.getX(l),f=(u+.75)/1.5,p=Math.sin(u*5-m*8)*.1*f;t.setZ(l,p)}t.needsUpdate=!0}),e.jsx("mesh",{ref:c,geometry:s,position:[-.75,1.1,0],scale:[-1,1,1],children:e.jsx("meshBasicMaterial",{map:o,side:Ge,transparent:!0,opacity:.95})})},Ce={color:"#3b82f6",emissive:"#1d4ed8",emissiveIntensity:.5,metalness:1,roughness:.1},Ct=({mat:o})=>e.jsxs("group",{children:[e.jsxs("mesh",{position:[0,0,.175],rotation:[Math.PI/2,0,0],children:[e.jsx("cylinderGeometry",{args:[.14,.14,.35,24]}),e.jsx("meshPhysicalMaterial",{...o})]}),e.jsxs("mesh",{position:[0,0,.44],rotation:[Math.PI/2,0,0],children:[e.jsx("cylinderGeometry",{args:[.14,.19,.18,24]}),e.jsx("meshPhysicalMaterial",{...o})]}),e.jsxs("mesh",{position:[0,0,.705],rotation:[Math.PI/2,0,0],children:[e.jsx("cylinderGeometry",{args:[.19,.19,.35,24]}),e.jsx("meshPhysicalMaterial",{...o,color:"#C8A24B"})]}),e.jsxs("mesh",{position:[.52,0,.705],children:[e.jsx("boxGeometry",{args:[.66,.02,.3]}),e.jsx("meshPhysicalMaterial",{...Ce})]}),e.jsxs("mesh",{position:[-.52,0,.705],children:[e.jsx("boxGeometry",{args:[.66,.02,.3]}),e.jsx("meshPhysicalMaterial",{...Ce})]})]}),St=({mat:o,solarRef:c})=>e.jsxs("group",{children:[e.jsxs("mesh",{position:[.1,0,0],rotation:[0,0,Math.PI/2],children:[e.jsx("cylinderGeometry",{args:[.28,.35,.2,24]}),e.jsx("meshPhysicalMaterial",{...o})]}),e.jsxs("mesh",{position:[1.05,0,0],rotation:[0,0,Math.PI/2],children:[e.jsx("cylinderGeometry",{args:[.35,.35,1.7,32]}),e.jsx("meshPhysicalMaterial",{...o})]}),e.jsxs("mesh",{position:[2.15,0,0],rotation:[0,0,Math.PI/2],children:[e.jsx("cylinderGeometry",{args:[.26,.26,.5,24]}),e.jsx("meshPhysicalMaterial",{...o})]}),e.jsxs("group",{ref:c,position:[2.55,0,0],children:[e.jsxs("mesh",{rotation:[0,0,Math.PI/2],children:[e.jsx("cylinderGeometry",{args:[.05,.05,.3,12]}),e.jsx("meshPhysicalMaterial",{...o})]}),e.jsxs("mesh",{position:[0,0,1.15],children:[e.jsx("boxGeometry",{args:[.5,.03,2.2]}),e.jsx("meshPhysicalMaterial",{...Ce})]}),e.jsxs("mesh",{position:[0,0,-1.15],children:[e.jsx("boxGeometry",{args:[.5,.03,2.2]}),e.jsx("meshPhysicalMaterial",{...Ce})]})]})]}),Oo=({isPaused:o,simulationSpeed:c,onSelect:s,onDoubleClick:r,planetRefs:t})=>{const i=n.useRef(null),m=n.useRef(null),l=n.useRef(null),u=n.useRef(null),[f,a]=n.useState(!1),p=n.useRef({x:0,y:0}),d=n.useMemo(()=>So(),[]),y=n.useMemo(()=>{const M=new pe().load(d);return M.colorSpace=be,M},[d]);n.useEffect(()=>()=>y.dispose(),[y]);const j="#f0f2f5",$="#334155";n.useEffect(()=>(i.current&&(t.current[xe.id]=i.current),()=>{delete t.current[xe.id]}),[t]),ce((M,A)=>{if(i.current&&!o&&(i.current.rotation.y+=A*.8*c),!o){const v=Math.sin(M.clock.elapsedTime*.2)*.15;m.current&&(m.current.rotation.x=v),l.current&&(l.current.rotation.x=v),u.current&&(u.current.rotation.x=v)}});const x={roughness:.6,metalness:.8,emissive:xe.color,emissiveIntensity:f?.15:0,color:j};return e.jsx("group",{rotation:[Math.PI/6,0,Math.PI/4],children:e.jsxs("group",{ref:i,userData:{id:xe.id},children:[e.jsxs("group",{position:[2.2,0,0],scale:[.15,.15,.15],children:[e.jsxs("mesh",{scale:[6,6,6],onPointerDown:M=>{M.stopPropagation(),p.current={x:M.clientX,y:M.clientY}},onClick:M=>{M.stopPropagation();const A=M.clientX-p.current.x,v=M.clientY-p.current.y;Math.sqrt(A*A+v*v)<5&&s(xe.id)},onDoubleClick:M=>{M.stopPropagation(),r(xe.id)},onPointerOver:()=>{document.body.style.cursor="pointer",a(!0)},onPointerOut:()=>{document.body.style.cursor="auto",a(!1)},children:[e.jsx("sphereGeometry",{args:[1,16,16]}),e.jsx("meshBasicMaterial",{transparent:!0,opacity:0})]}),e.jsxs("group",{children:[e.jsxs("mesh",{position:[0,0,0],children:[e.jsx("sphereGeometry",{args:[.3,32,32]}),e.jsx("meshPhysicalMaterial",{...x,color:$})]}),e.jsxs("mesh",{position:[0,.34,0],children:[e.jsx("cylinderGeometry",{args:[.14,.16,.1,24]}),e.jsx("meshPhysicalMaterial",{...x})]}),e.jsx("group",{position:[0,0,.28],children:e.jsx(Ct,{mat:x})}),e.jsx("group",{position:[0,-.28,0],rotation:[Math.PI/2,0,0],children:e.jsx(Ct,{mat:x})}),e.jsxs("group",{children:[e.jsxs("mesh",{position:[0,0,-.4],rotation:[Math.PI/2,0,0],children:[e.jsx("cylinderGeometry",{args:[.22,.22,.8,32]}),e.jsx("meshPhysicalMaterial",{...x})]}),e.jsxs("mesh",{position:[0,0,-.9],rotation:[Math.PI/2,0,0],children:[e.jsx("cylinderGeometry",{args:[.22,.35,.2,32]}),e.jsx("meshPhysicalMaterial",{...x})]}),e.jsxs("mesh",{position:[0,0,-1.5],rotation:[Math.PI/2,0,0],children:[e.jsx("cylinderGeometry",{args:[.35,.35,1,32]}),e.jsx("meshPhysicalMaterial",{...x})]}),e.jsxs("mesh",{position:[0,0,-2.1],rotation:[Math.PI/2,0,0],children:[e.jsx("cylinderGeometry",{args:[.35,.2,.2,32]}),e.jsx("meshPhysicalMaterial",{...x})]}),e.jsxs("group",{ref:m,position:[0,0,-1.5],children:[e.jsxs("mesh",{position:[1.1,0,0],children:[e.jsx("boxGeometry",{args:[1.5,.04,.55]}),e.jsx("meshPhysicalMaterial",{...Ce})]}),e.jsxs("mesh",{position:[-1.1,0,0],children:[e.jsx("boxGeometry",{args:[1.5,.04,.55]}),e.jsx("meshPhysicalMaterial",{...Ce})]})]}),e.jsxs("group",{position:[0,.33,-1.55],children:[e.jsxs("mesh",{position:[0,.06,0],children:[e.jsx("cylinderGeometry",{args:[.07,.09,.12,12]}),e.jsx("meshPhysicalMaterial",{...x})]}),e.jsxs("mesh",{position:[0,.15,0],children:[e.jsx("sphereGeometry",{args:[.07,16,16]}),e.jsx("meshPhysicalMaterial",{...x})]}),e.jsxs("mesh",{position:[0,.15,-.27],rotation:[Math.PI/2,0,0],children:[e.jsx("cylinderGeometry",{args:[.045,.045,.5,12]}),e.jsx("meshPhysicalMaterial",{...x})]}),e.jsxs("mesh",{position:[0,.15,-.55],children:[e.jsx("sphereGeometry",{args:[.06,16,16]}),e.jsx("meshPhysicalMaterial",{...x})]}),e.jsxs("mesh",{position:[.24,.15,-.55],rotation:[0,0,Math.PI/2],children:[e.jsx("cylinderGeometry",{args:[.04,.04,.45,12]}),e.jsx("meshPhysicalMaterial",{...x})]}),e.jsxs("mesh",{position:[.49,.15,-.55],children:[e.jsx("sphereGeometry",{args:[.05,12,12]}),e.jsx("meshPhysicalMaterial",{...x,color:$})]})]}),e.jsxs("group",{position:[0,.2,-.5],scale:[.8,.8,.8],children:[e.jsxs("mesh",{position:[0,.9,0],children:[e.jsx("cylinderGeometry",{args:[.02,.02,1.8]}),e.jsx("meshStandardMaterial",{color:"#cbd5e1",roughness:1,metalness:0})]}),e.jsx(_o,{texture:y})]})]}),e.jsx("group",{position:[.25,0,0],children:e.jsx(St,{mat:x,solarRef:l})}),e.jsx("group",{position:[-.25,0,0],rotation:[0,Math.PI,0],children:e.jsx(St,{mat:x,solarRef:u})}),e.jsxs("group",{position:[0,0,-2.2],children:[e.jsxs("mesh",{position:[0,0,-.35],rotation:[Math.PI/2,0,0],children:[e.jsx("cylinderGeometry",{args:[.32,.32,.7,32]}),e.jsx("meshPhysicalMaterial",{...x})]}),e.jsxs("mesh",{position:[0,0,-.9],rotation:[Math.PI/2,0,0],children:[e.jsx("cylinderGeometry",{args:[.24,.24,.5,24]}),e.jsx("meshPhysicalMaterial",{...x,color:"#C8A24B"})]}),e.jsxs("mesh",{position:[.62,0,-.9],children:[e.jsx("boxGeometry",{args:[.76,.02,.32]}),e.jsx("meshPhysicalMaterial",{...Ce})]}),e.jsxs("mesh",{position:[-.62,0,-.9],children:[e.jsx("boxGeometry",{args:[.76,.02,.32]}),e.jsx("meshPhysicalMaterial",{...Ce})]})]})]})]}),f&&e.jsx(Ze,{position:[2.2,1,0],style:{pointerEvents:"none"},children:e.jsx(gt,{name:xe.name,color:xe.color})})]})})},Io=({data:o,onSelect:c,onDoubleClick:s,isPaused:r,simulationSpeed:t,planetRefs:i,showOrbit:m})=>{const l=n.useRef(null),u=n.useRef(null),f=n.useRef(null),[a,p]=n.useState(!1),d=n.useRef({x:0,y:0}),y=o.id==="earth",j=n.useMemo(()=>y?null:xt(o),[o,y]),$=n.useMemo(()=>{if(!j)return null;const C=new pe().load(j);return C.colorSpace=be,C},[j]),x=n.useMemo(()=>o.hasRings?Do(o.id,o.ringColor||"#ffffff"):null,[o]),M=n.useMemo(()=>{if(!x)return null;const C=new pe().load(x);return C.colorSpace=be,C},[x]),A=yt();n.useEffect(()=>()=>{$==null||$.dispose()},[$]),n.useEffect(()=>()=>{M==null||M.dispose()},[M]);const v=n.useMemo(()=>{let C=0;for(let B=0;B<o.id.length;B++)C=o.id.charCodeAt(B)+((C<<5)-C);return Math.abs(C)%1e3/1e3*Math.PI*2},[o.id]);return n.useEffect(()=>{f.current&&(f.current.rotation.y=v)},[v]),n.useEffect(()=>(l.current&&(i.current[o.id]=l.current),()=>{delete i.current[o.id]}),[o.id,i]),ce((C,B)=>{if(!u.current||r)return;const G=o.speed*t,se=o.rotationSpeed*t;f.current&&(f.current.rotation.y+=B*G),l.current&&(l.current.rotation.y+=B*se)}),e.jsx("group",{ref:u,children:e.jsxs("group",{rotation:[o.orbitInclination||0,0,0],children:[m&&e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[o.distance-.05,o.distance+.05,128]}),e.jsx("meshBasicMaterial",{color:"#ffffff",transparent:!0,opacity:.1,side:Ge})]}),e.jsx("group",{ref:f,children:e.jsxs("group",{position:[o.distance,0,0],children:[e.jsxs("group",{rotation:[o.axisTilt||0,0,0],children:[e.jsxs("mesh",{ref:l,userData:{id:o.id},onPointerDown:C=>{C.stopPropagation(),d.current={x:C.clientX,y:C.clientY}},onClick:C=>{C.stopPropagation();const B=C.clientX-d.current.x,G=C.clientY-d.current.y;Math.sqrt(B*B+G*G)<5&&c(o.id)},onDoubleClick:C=>{C.stopPropagation(),s(o.id)},onPointerOver:()=>{document.body.style.cursor="pointer",p(!0)},onPointerOut:()=>{document.body.style.cursor="auto",p(!1)},children:[e.jsx("sphereGeometry",{args:[o.size,64,64]}),y?e.jsx(Go,{}):e.jsx("meshStandardMaterial",{map:$,roughness:.8,metalness:.2})]}),y&&e.jsx(Bo,{radius:o.size}),o.hasRings&&M&&e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],children:[e.jsx("ringGeometry",{args:[o.size*1.4,o.size*2.8,128]}),e.jsx("meshStandardMaterial",{map:M,transparent:!0,opacity:.8,side:Ge})]})]}),o.atmosphereColor&&!y&&e.jsx(Lt,{children:e.jsxs("mesh",{raycast:()=>null,children:[e.jsx("planeGeometry",{args:[o.size*2.5,o.size*2.5]}),e.jsx("meshBasicMaterial",{map:A,transparent:!0,opacity:.3,blending:ge,color:o.atmosphereColor,depthWrite:!1})]})}),a&&e.jsx(Ze,{position:[0,o.size*1.5,0],style:{pointerEvents:"none"},children:e.jsx(gt,{name:o.name,color:o.color})}),o.id==="earth"&&e.jsxs(e.Fragment,{children:[e.jsx(Lo,{isPaused:r,simulationSpeed:t,onSelect:c,onDoubleClick:s,planetRefs:i}),e.jsx(Oo,{isPaused:r,simulationSpeed:t,onSelect:c,onDoubleClick:s,planetRefs:i})]}),o.id==="jupiter"&&qt.map(C=>e.jsx(kt,{data:C,isPaused:r,simulationSpeed:t,onSelect:c,onDoubleClick:s,planetRefs:i,parentRadius:o.size},C.id)),o.id==="saturn"&&Ht.map(C=>e.jsx(kt,{data:C,isPaused:r,simulationSpeed:t,onSelect:c,onDoubleClick:s,planetRefs:i,parentRadius:o.size},C.id))]})})]})})},Lo=({isPaused:o,simulationSpeed:c,onSelect:s,onDoubleClick:r,planetRefs:t})=>{const i=n.useRef(null),m=n.useRef(null),l=n.useRef({x:0,y:0}),u=n.useMemo(()=>xt(ve),[]),f=n.useMemo(()=>{const a=new pe().load(u);return a.colorSpace=be,a},[u]);return n.useEffect(()=>()=>f.dispose(),[f]),n.useEffect(()=>(i.current&&(t.current[ve.id]=i.current),()=>{delete t.current[ve.id]}),[t]),ce((a,p)=>{m.current&&!o&&(m.current.rotation.y+=p*.5*c)}),e.jsx("group",{ref:m,children:e.jsxs("mesh",{ref:i,userData:{id:ve.id},position:[3.5,0,0],onPointerDown:a=>{a.stopPropagation(),l.current={x:a.clientX,y:a.clientY}},onClick:a=>{a.stopPropagation();const p=a.clientX-l.current.x,d=a.clientY-l.current.y;Math.sqrt(p*p+d*d)<5&&s(ve.id)},onDoubleClick:a=>{a.stopPropagation(),r(ve.id)},children:[e.jsx("sphereGeometry",{args:[ve.size,32,32]}),e.jsx("meshStandardMaterial",{map:f})]})})},kt=({data:o,isPaused:c,simulationSpeed:s,onSelect:r,onDoubleClick:t,planetRefs:i,parentRadius:m})=>{const l=n.useRef(null),u=n.useRef(null),f=n.useRef({x:0,y:0}),a=n.useMemo(()=>xt(o),[o]),p=n.useMemo(()=>{const d=new pe().load(a);return d.colorSpace=be,d},[a]);return n.useEffect(()=>()=>p.dispose(),[p]),n.useEffect(()=>(l.current&&(i.current[o.id]=l.current),()=>{delete i.current[o.id]}),[o.id,i]),ce((d,y)=>{u.current&&!c&&(u.current.rotation.y+=y*o.speed*s)}),e.jsx("group",{ref:u,rotation:[o.orbitInclination||0,0,0],children:e.jsxs("mesh",{ref:l,userData:{id:o.id},position:[m+o.distance*.8,0,0],onPointerDown:d=>{d.stopPropagation(),f.current={x:d.clientX,y:d.clientY}},onClick:d=>{d.stopPropagation();const y=d.clientX-f.current.x,j=d.clientY-f.current.y;Math.sqrt(y*y+j*j)<5&&r(o.id)},onDoubleClick:d=>{d.stopPropagation(),t(o.id)},children:[e.jsx("sphereGeometry",{args:[o.size,32,32]}),e.jsx("meshStandardMaterial",{map:p})]})})},Uo=ao({uTime:0,uColorPrimary:new U("#FFD700"),uColorSecondary:new U("#FF4500"),uColorSunspot:new U("#000000"),uColorPenumbra:new U("#8B0000"),uColorBright:new U("#FFFFFF")},`
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,`
    uniform float uTime;
    uniform vec3 uColorPrimary;
    uniform vec3 uColorSecondary;
    uniform vec3 uColorSunspot;
    uniform vec3 uColorPenumbra;
    uniform vec3 uColorBright;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vViewPosition;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) { 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; 
      vec3 x3 = x0 - D.yyy;      
      i = mod289(i); 
      vec4 p = permute( permute( permute( 
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857; 
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z); 
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      float noiseScaleA = 6.0;
      float timeScaleA = 0.1;
      float n1 = snoise(vPosition * noiseScaleA + vec3(uTime * timeScaleA));
      float noiseScaleB = 2.0;
      float timeScaleB = 0.05;
      float n2 = snoise(vPosition * noiseScaleB - vec3(uTime * timeScaleB));
      float combinedNoise = n1 * 0.4 + n2 * 0.6; 
      float t = combinedNoise * 0.5 + 0.5;

      float umbraThreshold = 0.035;     
      float penumbraThreshold = 0.08; 
      float maskUmbra = smoothstep(umbraThreshold - 0.03, umbraThreshold + 0.02, t); 
      float maskPenumbra = smoothstep(penumbraThreshold - 0.04, penumbraThreshold + 0.04, t);

      float filamentNoise = snoise(vPosition * 12.0 + vec3(uTime * 0.02));
      vec3 detailedPenumbra = mix(uColorPenumbra, uColorSecondary * 0.8, filamentNoise * 0.4 + 0.4);

      vec3 surfaceColor = mix(uColorSecondary, uColorPrimary, t);
      
      float brightThreshold = 0.88; 
      float maskBright = smoothstep(brightThreshold, brightThreshold + 0.15, t);
      vec3 activeColor = mix(surfaceColor, uColorBright, maskBright);

      vec3 spotRegionColor = mix(detailedPenumbra, activeColor, maskPenumbra);
      vec3 finalBaseColor = mix(uColorSunspot, spotRegionColor, maskUmbra);

      vec3 viewDir = normalize(vViewPosition);
      float fresnel = dot(vNormal, viewDir); 
      float darkening = pow(fresnel, 0.45); 
      
      float rim = 1.0 - fresnel;
      vec3 rimColor = uColorPrimary * pow(rim, 3.5) * 0.8;

      gl_FragColor = vec4(finalBaseColor * darkening + rimColor, 1.0);
    }
  `);co({SunShaderMaterial:Uo});const Wo=new U("#FFD700"),qo=new U("#FF4500"),Ho=new U("#000000"),Vo=new U("#8B0000"),Qo=new U("#FFFFFF"),Yo=({onSelect:o,onDoubleClick:c,isPaused:s,simulationSpeed:r,planetRefs:t})=>{const i=n.useRef(null),m=n.useRef(null),l=n.useRef(null),u=n.useRef(null),f=n.useRef(null),a=n.useRef(null),[p,d]=n.useState(!1),y=n.useRef({x:0,y:0}),j=n.useMemo(()=>wo(),[]),$=n.useMemo(()=>new pe().load(j),[j]);return n.useEffect(()=>()=>$.dispose(),[$]),n.useLayoutEffect(()=>{l.current&&(l.current.raycast=()=>null),u.current&&(u.current.raycast=()=>null),f.current&&(f.current.raycast=()=>null)},[]),n.useEffect(()=>(a.current&&(t.current.sun=a.current),()=>{delete t.current.sun}),[t]),ce((x,M)=>{i.current&&!s&&(i.current.rotation.y+=M*.002*r),m.current&&(m.current.uniforms.uTime.value=x.clock.elapsedTime*r)}),e.jsxs("group",{ref:a,children:[e.jsx("group",{ref:i,children:e.jsxs("mesh",{raycast:()=>null,children:[e.jsx("sphereGeometry",{args:[H.size,64,64]}),e.jsx("sunShaderMaterial",{ref:m,uColorPrimary:Wo,uColorSecondary:qo,uColorSunspot:Ho,uColorPenumbra:Vo,uColorBright:Qo})]})}),e.jsxs("mesh",{userData:{id:H.id},onPointerDown:x=>{x.stopPropagation(),y.current={x:x.clientX,y:x.clientY}},onClick:x=>{x.stopPropagation();const M=x.clientX-y.current.x,A=x.clientY-y.current.y;Math.sqrt(M*M+A*A)<5&&o(H.id)},onDoubleClick:x=>{x.stopPropagation(),c(H.id)},onPointerOver:()=>{document.body.style.cursor="pointer",d(!0)},onPointerOut:()=>{document.body.style.cursor="auto",d(!1)},children:[e.jsx("sphereGeometry",{args:[H.size*1.05,32,32]}),e.jsx("meshBasicMaterial",{transparent:!0,opacity:0})]}),e.jsxs(Lt,{children:[e.jsxs("mesh",{ref:l,position:[0,0,-.1],raycast:()=>null,children:[e.jsx("planeGeometry",{args:[H.size*2.8,H.size*2.8]}),e.jsx("meshBasicMaterial",{map:$,transparent:!0,opacity:.6,depthWrite:!1,blending:ge,color:"#FFD700"})]}),e.jsxs("mesh",{ref:u,position:[0,0,-.2],raycast:()=>null,children:[e.jsx("planeGeometry",{args:[H.size*5.5,H.size*5.5]}),e.jsx("meshBasicMaterial",{map:$,transparent:!0,opacity:.4,depthWrite:!1,blending:ge,color:"#FF4500"})]}),e.jsxs("mesh",{ref:f,position:[0,0,-.3],raycast:()=>null,children:[e.jsx("planeGeometry",{args:[H.size*9,H.size*9]}),e.jsx("meshBasicMaterial",{map:$,transparent:!0,opacity:.15,depthWrite:!1,blending:ge,color:"#FFFFFF"})]})]}),p&&e.jsx(Ze,{position:[0,H.size*1.1,0],zIndexRange:[100,0],style:{pointerEvents:"none"},children:e.jsx(gt,{name:H.name,color:"#FFD700"})})]})},Nt=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Dt=`
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
`,Xo=[[.085,0],[.125,-.12],[.135,-.3],[.115,-.6],[.085,-.95],[.05,-1.35],[.018,-1.75],[0,-2.1]],Zo=[[.04,0],[.055,-.15],[.045,-.45],[.025,-.8],[0,-1.15]],Ko=({speedRef:o,maxSpeed:c,position:s=[0,-.98,0],scale:r=1})=>{const t=n.useRef(null),i=n.useRef(null),m=n.useRef(null),l=n.useRef(Math.random()*100),u=n.useRef(1),f=n.useMemo(()=>new ft(Xo.map(([j,$])=>new Xe(j,$)),24),[]),a=n.useMemo(()=>new ft(Zo.map(([j,$])=>new Xe(j,$)),20),[]),p=n.useMemo(()=>new jt({vertexShader:Nt,fragmentShader:Dt,transparent:!0,depthWrite:!1,blending:ge,side:Ge,uniforms:{uTime:{value:0},uThrottle:{value:1},uIntensity:{value:.9},uErode:{value:.95},uColorA:{value:new U("#eaf7ff")},uColorB:{value:new U("#38bdf8")},uColorC:{value:new U("#7c3aed")}}}),[]),d=n.useMemo(()=>new jt({vertexShader:Nt,fragmentShader:Dt,transparent:!0,depthWrite:!1,blending:ge,side:Ge,uniforms:{uTime:{value:0},uThrottle:{value:1},uIntensity:{value:1.5},uErode:{value:.3},uColorA:{value:new U("#ffffff")},uColorB:{value:new U("#a5f3fc")},uColorC:{value:new U("#22d3ee")}}}),[]),y=yt();return n.useEffect(()=>()=>{f.dispose(),a.dispose(),p.dispose(),d.dispose()},[f,a,p,d]),ce((j,$)=>{const x=Math.min($,.03333333333333333);l.current+=x;const M=Y.clamp(o.current/c,.12,1);u.current=Y.lerp(u.current,M,1-Math.exp(-4*x));const A=l.current,v=u.current;if(p.uniforms.uTime.value=A,p.uniforms.uThrottle.value=v,d.uniforms.uTime.value=A,d.uniforms.uThrottle.value=v,t.current&&(t.current.scale.y=.55+.45*v),i.current&&(i.current.intensity=.8+2.2*v+Math.sin(A*37)*.3*v),m.current){const C=.42+.28*v+.03*Math.sin(A*29);m.current.scale.set(C,C,1)}}),e.jsxs("group",{position:s,scale:r,children:[e.jsxs("group",{ref:t,children:[e.jsx("mesh",{geometry:f,material:p}),e.jsx("mesh",{geometry:a,material:d})]}),e.jsx("sprite",{ref:m,position:[0,-.04,0],scale:[.5,.5,1],children:e.jsx("spriteMaterial",{map:y,color:"#a5f3fc",transparent:!0,opacity:.85,depthWrite:!1,blending:ge})}),e.jsx("pointLight",{ref:i,position:[0,-.3,0],color:"#7dd3fc",distance:5,intensity:3})]})},We=28,Et=8,Tt=1.5,Jo=8,qe=H.size+6,er={jupiter:14.5,saturn:13.5},P=new D,K=new D,he=new D,ot=new D,rt=new D,_e=new D,ke=new D,st=new D,Rt=new D,nt=new D,J=new D,me=new D,it=new D,He=new D,ee=new D,At=new D,at=new D,Re=new D,ct=new D,Gt=new D,Ve=new D,lt=new D,dt=new D,Ne=new D,Qe=new D,Ye=new D,zt=new D,$e=new Ut,pt=new D,tr=new Wt,or=new Wt,rr=new D(1,0,0),Ae=Math.PI*2,Pt=[[.18,0,0],[-.09,0,.156],[-.09,0,-.156]],sr=[[.35,0],[.348,.08],[.34,.18],[.325,.28],[.3,.38],[.265,.48],[.22,.57],[.165,.65],[.1,.71],[.04,.75],[0,.76]],nr=({planetRefs:o,simulationSpeed:c,isPaused:s,onMissionComplete:r})=>{const t=n.useRef(null),i=n.useRef(null),m=n.useRef(null),l=n.useRef(null),u=n.useRef(null),f=n.useRef(null),a=n.useRef(null),p=n.useMemo(()=>{const k=new pe().load(ko());return k.colorSpace=be,k},[]),d=n.useMemo(()=>{const k=new pe().load(No());return k.colorSpace=be,k},[]),y=yt(),j=n.useMemo(()=>new ft(sr.map(([k,T])=>new Xe(k,T)),32),[]);n.useEffect(()=>()=>{p.dispose(),d.dispose(),j.dispose()},[p,d,j]);const[$,x]=n.useState(0),[M,A]=n.useState({current:0,total:0,targetName:""}),v=n.useRef("PLANNING"),C=n.useRef(!1),B=n.useRef(!1),G=n.useRef([]),se=n.useRef(0),ne=n.useRef(null),z=n.useRef(0),X=n.useRef(0),Z=n.useRef(15),le=n.useRef(0),F=n.useRef(0),_=n.useRef(15),V=n.useRef(16),te=n.useRef(new D),w=n.useRef(0),I=n.useRef(0),L=n.useRef(new D(0,0,1)),O=n.useRef(0),we=k=>{if(s)return 0;const T=ye.find(S=>S.id===k);return T?T.speed*c:0},Ie=(k,T,S)=>{var R;const W=o.current[k];if(!W)return S;W.getWorldPosition(S);const ue=we(k);if(ue===0||T<=0)return S;const fe=((R=ye.find(q=>q.id===k))==null?void 0:R.orbitInclination)||0;return pt.set(0,1,0),fe!==0&&pt.applyQuaternion(tr.setFromAxisAngle(rr,fe)),S.applyQuaternion(or.setFromAxisAngle(pt,ue*T)),S},je=()=>{const k=ye.filter(R=>{var q;return R.id!=="mercury"&&R.id!=="earth"&&((q=o.current[R.id])==null?void 0:q.parent)}).map(R=>R.id);for(let R=k.length-1;R>0;R--){const q=Math.floor(Math.random()*(R+1));[k[R],k[q]]=[k[q],k[R]]}const T=k.slice(0,5),S=[],W=new D,ue=new D,fe=o.current.earth;for(fe&&fe.getWorldPosition(W);T.length>0;){let R=0,q=1/0;for(let oe=0;oe<T.length;oe++){const re=o.current[T[oe]];if(!re)continue;re.getWorldPosition(ue);const de=ue.distanceToSquared(W);de<q&&(q=de,R=oe)}const De=T.splice(R,1)[0];S.push(De);const N=o.current[De];N&&N.getWorldPosition(W)}return S.push("earth"),S},Le=k=>{const T=ye.find(W=>W.id===k);if(!T)return 12;const S=T.hasRings?T.size*2.5+2:T.size*2.8+2;return Math.max(S,er[k]||0)},Ue=k=>{var S;const T=((S=ye.find(W=>W.id===k))==null?void 0:S.name)||k;A({current:se.current-G.current.length,total:se.current,targetName:T})};ce((k,T)=>{if(!t.current)return;const S=Math.min(T,1/30);if(!C.current){const N=o.current.earth;N&&(N.getWorldPosition(P),P.lengthSq()>1&&(P.y+=10,P.x+=10,t.current.position.copy(P),C.current=!0,v.current="PLANNING"));return}if(v.current==="PLANNING"){G.current=je(),se.current=G.current.length;const N=G.current[0],oe=N?o.current[N]:null;oe&&(oe.getWorldPosition(Re),$e.position.copy(t.current.position),$e.lookAt(Re),t.current.quaternion.copy($e.quaternion),ee.set(0,0,1).applyQuaternion(t.current.quaternion),te.current.copy(t.current.position).addScaledVector(ee,10),L.current.copy(ee)),v.current="LEAVING",w.current=0;return}if(v.current==="LEAVING"&&(w.current+=S,z.current+=(We-z.current)*1.5*S,ee.set(0,0,1).applyQuaternion(t.current.quaternion),t.current.position.addScaledVector(ee,z.current*S),i.current&&(i.current.rotation.z=Y.lerp(i.current.rotation.z,0,1-Math.exp(-2*S))),w.current>1))if(G.current.length>0){const N=G.current.shift();ne.current=N,Ue(N),ee.set(0,0,1).applyQuaternion(t.current.quaternion),L.current.copy(ee),v.current="TRAVELING"}else v.current="COMPLETED";if(v.current==="COMPLETED"){B.current||(B.current=!0,r());return}const W=ne.current;let ue=null;if(W){const N=o.current[W];N&&N.parent&&(ue=N,N.getWorldPosition(K))}if(!ue){(v.current==="TRAVELING"||v.current==="ORBITING")&&(ne.current=null,v.current="LEAVING",w.current=0);return}if(P.copy(t.current.position),v.current==="TRAVELING"){const N=Le(W);he.copy(K);for(let h=0;h<2;h++){const b=P.distanceTo(he)/Math.max(z.current,8);Ie(W,b,he)}rt.subVectors(he,P).normalize(),_e.set(rt.x,0,rt.z),_e.lengthSq()<1e-8?_e.set(1,0,0):_e.normalize(),ot.copy(he).addScaledVector(_e,-N);const oe=P.distanceTo(ot);ke.set(P.x-K.x,0,P.z-K.z);const re=Math.max(ke.length(),1e-4);st.set(-ke.z/re,0,ke.x/re),ee.set(0,0,1).applyQuaternion(t.current.quaternion);const de=Math.min(Et,Tt*N);let Me=de+Math.sqrt(2*Jo*Math.max(oe-1.5,0));oe<3&&(Me=de);const ze=Math.min(We,Me);z.current+=(ze-z.current)*(1-Math.exp(-2.5*S));const Se=ee.dot(st)>.6,Ee=Math.abs(P.y-K.y)<3,Fe=z.current<de+2;if(Math.abs(re-N)<2&&Se&&Ee&&Fe)v.current="ORBITING",Z.current=re,_.current=N,F.current=1.2,X.current=Math.atan2(ke.z,ke.x),le.current=0;else{nt.subVectors(ot,P).normalize(),Rt.copy(ke).divideScalar(re);const h=N-re;zt.copy(st).addScaledVector(Rt,Y.clamp(h*.25,-.75,.75)).normalize();const b=Y.smoothstep(1-(re-N)/(N*2.5),0,1);J.copy(nt).lerp(zt,b),J.y+=Y.clamp((K.y-P.y)*.1,-.35,.35),J.normalize();let g=!1;const E=Math.hypot(P.x,P.z);let Q=0;if(E<qe)Q=1;else{const ie=-(P.x*J.x+P.z*J.z);if(ie>0){const Te=P.x*P.x+P.z*P.z-ie*ie;Te<qe*qe&&(Q=.8*(1-Math.sqrt(Te)/qe))}}Q>0&&(it.set(P.x,0,P.z).normalize(),He.set(-it.z,0,it.x),He.dot(nt)<0&&He.negate(),me.set(J.x,0,J.z),me.lengthSq()>1e-8&&(me.normalize().lerp(He,Q).normalize(),J.set(me.x,J.y,me.z).normalize()),g=!0);let ae=0;for(const ie of ye){if(ie.id===W)continue;const Te=o.current[ie.id];if(!Te||!Te.parent)continue;Te.getWorldPosition(Ve),lt.subVectors(Ve,P);const Ft=lt.lengthSq(),Pe=ie.hasRings?ie.size*2.8+1:ie.size*2+1;if(Ft<Pe*Pe){ae=1,dt.copy(Ve);break}const Be=lt.dot(J);if(Be<0||Be>100)continue;const $t=Ft-Be*Be;if($t<Pe*Pe){const vt=(1-Math.sqrt($t)/Pe)*Y.clamp(1.5-Be/60,0,1);vt>ae&&(ae=vt,dt.copy(Ve))}}ae>0&&(Ne.subVectors(P,dt),Ne.y=0,Ne.lengthSq()<1e-8?Ne.set(1,0,0):Ne.normalize(),Qe.set(-Ne.z,0,Ne.x),Qe.dot(L.current)<0&&Qe.negate(),me.set(J.x,0,J.z),me.lengthSq()>1e-8&&(me.normalize().lerp(Qe,Math.min(ae*.95,1)).normalize(),J.set(me.x,J.y,me.z).normalize()),g=!0),L.current.dot(J)<-.9?L.current.copy(J):L.current.lerp(J,1-Math.exp(-(g?10:7)*S)).normalize(),O.current+=((g?1:0)-O.current)*(1-Math.exp(-(g?8:2)*S)),$e.position.copy(P),Re.copy(P).add(L.current),$e.lookAt(Re);const Ke=2+5*Y.smoothstep(1-oe/60,0,1)+O.current*3;t.current.quaternion.slerp($e.quaternion,1-Math.exp(-Ke*S)),ee.set(0,0,1).applyQuaternion(t.current.quaternion),t.current.position.addScaledVector(ee,z.current*S),At.set(1,0,0).applyQuaternion(t.current.quaternion);const Je=At.dot(L.current);if(i.current){const ie=Je*Math.PI/3;i.current.rotation.z=Y.lerp(i.current.rotation.z,ie,1-Math.exp(-3*S))}}}if(v.current==="ORBITING"){const N=Math.min(Et,Tt*Z.current);z.current+=(N-z.current)*(1-Math.exp(-2*S));const re=z.current/Z.current*S;X.current+=re,le.current+=re,Z.current+=(_.current-Z.current)*(1-Math.exp(-2*S)),at.set(K.x+Math.cos(X.current)*Z.current,K.y,K.z+Math.sin(X.current)*Z.current),F.current>0?(F.current-=S,t.current.position.lerp(at,1-Math.exp(-4*S)),F.current<=0&&(Ye.set(t.current.position.x-K.x,0,t.current.position.z-K.z),Ye.lengthSq()>1e-8&&(X.current=Math.atan2(Ye.z,Ye.x)))):t.current.position.copy(at);const de=X.current+Y.clamp(2.5/Z.current,.12,.45);Re.set(K.x+Math.cos(de)*Z.current,K.y,K.z+Math.sin(de)*Z.current),$e.position.copy(t.current.position),$e.lookAt(Re),t.current.quaternion.slerp($e.quaternion,1-Math.exp(-6*S)),ee.set(0,0,1).applyQuaternion(t.current.quaternion),L.current.copy(ee),i.current&&(i.current.rotation.z=Y.lerp(i.current.rotation.z,-Math.PI/4,1-Math.exp(-3*S)));const Me=W==="jupiter"||W==="saturn"?Math.PI*2:Math.PI*4;if(le.current>Me)if(G.current.length===0)v.current="COMPLETED";else{const ze=G.current[0],Se=o.current[ze];let Ee=!0;if(Se&&Se.parent){Se.getWorldPosition(he);const Fe=he.distanceTo(K)/We;Ie(ze,Fe,he);const h=he.x-K.x,b=he.z-K.z;if(Math.hypot(h,b)>.001){const g=Math.atan2(-h,b),E=(X.current%Ae+Ae)%Ae,Q=(g-E+Ae*2)%Ae,ae=le.current-Me;Ee=Q<(ae>Ae?.6:.12)}}if(Ee){const Fe=G.current.shift();ne.current=Fe,Ue(Fe),v.current="TRAVELING"}}}I.current+=S;const fe=Math.round(z.current*1e3);Math.abs(fe-$)>100&&I.current>.15&&(I.current=0,x(fe));const R=k.clock.elapsedTime;if(u.current&&(u.current.material.opacity=.55+.35*Math.sin(R*2)),f.current&&(f.current.material.opacity=.55+.35*Math.sin(R*2+Math.PI)),a.current){const N=R%1.4;a.current.material.opacity=N<.06||N>.18&&N<.24?1:.04}if(i.current){const N=i.current.rotation.z;m.current&&(m.current.rotation.z=.12+N*.45),l.current&&(l.current.rotation.z=-.12+N*.45)}const q=v.current==="ORBITING"?35:18;V.current=Y.lerp(V.current,q,1-Math.exp(-1*S)),ee.set(0,0,1).applyQuaternion(t.current.quaternion);const De=Y.lerp(5,12,(V.current-16)/19);ct.copy(t.current.position).addScaledVector(ee,-V.current),ct.y+=De,k.camera.position.lerp(ct,1-Math.exp(-5*S)),Gt.copy(t.current.position).addScaledVector(ee,10),te.current.lerp(Gt,1-Math.exp(-8*S)),k.camera.lookAt(te.current)});const bt=M.targetName;return e.jsx(e.Fragment,{children:e.jsxs("group",{ref:t,scale:[1.8,1.8,1.8],children:[e.jsx(Ze,{position:[2,1,0],center:!0,transform:!0,sprite:!0,zIndexRange:[100,0],children:e.jsxs("div",{className:"flex flex-col items-start pointer-events-none select-none gap-2",children:[e.jsxs("div",{className:"flex flex-col items-start",children:[e.jsxs("div",{className:"bg-cyan-900/40 border-l-2 border-cyan-400 backdrop-blur-sm px-3 py-1 mb-1 transform skew-x-[-10deg]",children:[e.jsx("span",{className:"text-[10px] text-cyan-200 font-mono tracking-widest uppercase",children:"Velocity"}),e.jsxs("div",{className:"text-xl font-bold text-white font-mono leading-none flex items-baseline gap-1",children:[$.toLocaleString(),e.jsx("span",{className:"text-[10px] text-cyan-400",children:"KM/H"})]})]}),e.jsxs("div",{className:"flex gap-0.5 mt-0.5",children:[e.jsx("div",{className:`h-1 w-2 rounded-sm ${z.current>5?"bg-green-500":"bg-gray-700"}`}),e.jsx("div",{className:`h-1 w-2 rounded-sm ${z.current>10?"bg-green-400":"bg-gray-700"}`}),e.jsx("div",{className:`h-1 w-2 rounded-sm ${z.current>15?"bg-yellow-400":"bg-gray-700"}`}),e.jsx("div",{className:`h-1 w-2 rounded-sm ${z.current>20?"bg-red-500":"bg-gray-700"}`})]})]}),M.total>0&&e.jsxs("div",{className:"bg-blue-900/40 border-l-2 border-blue-400 backdrop-blur-sm px-3 py-1 transform skew-x-[-10deg]",children:[e.jsx("span",{className:"text-[10px] text-blue-200 font-mono tracking-widest uppercase",children:"Mission Log"}),e.jsxs("div",{className:"text-sm font-bold text-white leading-tight mt-0.5",children:[bt.split(" ")[0],e.jsxs("span",{className:"text-[10px] ml-1 text-blue-300 opacity-80",children:["(",M.current,"/",M.total,")"]})]})]})]})}),e.jsx("group",{ref:i,children:e.jsxs("group",{rotation:[Math.PI/2,0,0],children:[e.jsxs("mesh",{position:[0,0,0],children:[e.jsx("cylinderGeometry",{args:[.35,.35,1.6,32]}),e.jsx("meshPhysicalMaterial",{map:p,color:"#ffffff",metalness:.85,roughness:.42,clearcoat:.5,clearcoatRoughness:.3})]}),e.jsxs("mesh",{position:[0,0,.36],children:[e.jsx("planeGeometry",{args:[.28,1.12]}),e.jsx("meshBasicMaterial",{map:d,transparent:!0,depthWrite:!1,toneMapped:!1})]}),e.jsxs("mesh",{position:[0,0,-.36],rotation:[0,Math.PI,0],children:[e.jsx("planeGeometry",{args:[.28,1.12]}),e.jsx("meshBasicMaterial",{map:d,transparent:!0,depthWrite:!1,toneMapped:!1})]}),e.jsx("mesh",{position:[0,.8,0],geometry:j,children:e.jsx("meshPhysicalMaterial",{map:p,color:"#ffffff",metalness:.85,roughness:.42,clearcoat:.5,clearcoatRoughness:.3})}),e.jsx("group",{ref:m,position:[-.33,-.55,0],children:e.jsxs("mesh",{position:[-.14,0,0],children:[e.jsx("boxGeometry",{args:[.28,.55,.06]}),e.jsx("meshStandardMaterial",{color:"#1f2937",metalness:.7,roughness:.45})]})}),e.jsx("group",{ref:l,position:[.33,-.55,0],children:e.jsxs("mesh",{position:[.14,0,0],children:[e.jsx("boxGeometry",{args:[.28,.55,.06]}),e.jsx("meshStandardMaterial",{color:"#1f2937",metalness:.7,roughness:.45})]})}),e.jsxs("group",{position:[0,-.85,0],children:[e.jsxs("mesh",{position:[0,.02,0],children:[e.jsx("cylinderGeometry",{args:[.28,.31,.08,24]}),e.jsx("meshStandardMaterial",{color:"#1e293b",metalness:.8,roughness:.4})]}),Pt.map((k,T)=>e.jsxs("group",{position:k,children:[e.jsxs("mesh",{position:[0,-.1,0],children:[e.jsx("cylinderGeometry",{args:[.07,.13,.28,16,1,!0]}),e.jsx("meshStandardMaterial",{color:"#475569",metalness:.9,roughness:.35,side:Ge})]}),e.jsxs("mesh",{position:[0,.03,0],children:[e.jsx("cylinderGeometry",{args:[.075,.075,.06,16]}),e.jsx("meshStandardMaterial",{color:"#0f172a",metalness:.7,roughness:.5})]})]},T))]}),Pt.map((k,T)=>e.jsx(Ko,{speedRef:z,maxSpeed:We,position:[k[0],-1.09,k[2]],scale:1.25},T)),e.jsx("sprite",{ref:u,position:[-.5,-.55,0],scale:[.16,.16,1],children:e.jsx("spriteMaterial",{map:y,color:"#ff3030",transparent:!0,opacity:.8,depthWrite:!1,blending:ge})}),e.jsx("sprite",{ref:f,position:[.5,-.55,0],scale:[.16,.16,1],children:e.jsx("spriteMaterial",{map:y,color:"#30ff60",transparent:!0,opacity:.8,depthWrite:!1,blending:ge})}),e.jsx("sprite",{ref:a,position:[0,1.6,0],scale:[.2,.2,1],children:e.jsx("spriteMaterial",{map:y,color:"#ffffff",transparent:!0,opacity:.8,depthWrite:!1,blending:ge})})]})})]})})},ir=({isPaused:o,simulationSpeed:c})=>{const s=n.useRef(null),r=n.useRef(null),t=750,i=n.useMemo(()=>new Ut,[]),m=n.useMemo(()=>{const l=[];for(let a=0;a<t;a++){const p=Y.randFloat(39,48),d=Y.randFloat(0,Math.PI*2),y=p*Math.cos(d),j=-p*Math.sin(d),$=Y.randFloatSpread(1.5),x=Y.randFloat(.1,.4),M=[Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI];l.push({x:y,y:$,z:j,scale:x,rotation:M})}return l},[]);return n.useLayoutEffect(()=>{if(s.current){const l=new U,u=["#E5E7EB","#D1D5DB","#9CA3AF","#C4B5FD"];m.forEach((f,a)=>{const{x:p,y:d,z:y,scale:j,rotation:$}=f;i.position.set(p,d,y),i.rotation.set($[0],$[1],$[2]),i.scale.set(j,j,j),i.updateMatrix(),s.current.setMatrixAt(a,i.matrix),l.set(u[Math.floor(Math.random()*u.length)]),l.offsetHSL(0,0,Math.random()*.1),l.multiplyScalar(.7),s.current.setColorAt(a,l)}),s.current.instanceMatrix.needsUpdate=!0,s.current.instanceColor&&(s.current.instanceColor.needsUpdate=!0)}},[m,i]),ce((l,u)=>{r.current&&!o&&(r.current.rotation.y+=u*.01*c)}),e.jsx("group",{ref:r,children:e.jsxs("instancedMesh",{ref:s,args:[void 0,void 0,t],children:[e.jsx("dodecahedronGeometry",{args:[.5,0]}),e.jsx("meshStandardMaterial",{roughness:.7,metalness:.2,color:"#ffffff",emissive:"#222222",emissiveIntensity:.35})]})})},Bt=(o,c,s)=>{const r=o/24*Math.PI*2,t=(90-c)/180*Math.PI,i=Math.sin(t);return[-s*Math.cos(r)*i,s*Math.cos(t),s*Math.sin(r)*i]},ar=({radius:o=790})=>{const c=n.useMemo(()=>{const s=[];for(const t of Mo)for(const[i,m]of t.lines){const l=t.stars[i],u=t.stars[m];s.push(...Bt(l.ra,l.dec,o)),s.push(...Bt(u.ra,u.dec,o))}const r=new lo;return r.setAttribute("position",new po(s,3)),r},[o]);return n.useEffect(()=>()=>c.dispose(),[c]),e.jsx("lineSegments",{geometry:c,raycast:()=>null,children:e.jsx("lineBasicMaterial",{color:"#7FB2FF",transparent:!0,opacity:.35,depthWrite:!1})})},_t=["io","europa","ganymede","callisto","moon","titan","enceladus","mimas","iapetus"],cr=({selectedPlanet:o,onClose:c,simulationSpeed:s,setSimulationSpeed:r,isStarshipActive:t,toggleStarship:i,showPluto:m,togglePluto:l,toggleGestureMode:u,isGestureMode:f,showOrbits:a,toggleOrbits:p,showConstellationLines:d,toggleConstellationLines:y})=>{const[j,$]=n.useState(!1),x=n.useRef(null),[M,A]=n.useState([]);n.useEffect(()=>{const F=window.speechSynthesis;if(!F)return;x.current=F;const _=()=>A(F.getVoices());return _(),F.addEventListener("voiceschanged",_),()=>{F.removeEventListener("voiceschanged",_)}},[]),n.useEffect(()=>{const F=()=>{var _;(_=x.current)!=null&&_.speaking&&(x.current.cancel(),$(!1))};return F(),()=>{F()}},[o]);const v=()=>{const F=M.filter(w=>w.lang.includes("zh")||w.lang.includes("CN")),_=F.find(w=>w.name.includes("Xiaoxiao")||w.name.includes("Natural"));if(_)return _;const V=F.find(w=>w.name.includes("Google"));if(V)return V;const te=F.find(w=>w.name.includes("Tingting"));return te||F[0]||null},C=()=>{if(!o)return;const F=x.current;if(F)if(j)F.cancel(),$(!1);else{const V=`嗨！小朋友，你好呀！欢迎来到${o.name.split(" ")[0]}。我是你们的导游。`,te=o.description,w=o.funFact?`哇，还有一个神奇的小秘密要告诉你：${o.funFact}`:"",L=`${V} ${te} ${w} 怎么样？宇宙是不是超级有趣呢？`,O=new SpeechSynthesisUtterance(L);O.lang="zh-CN";const we=v();we&&(O.voice=we),O.rate=.9,O.pitch=1.1,O.volume=1,O.onend=()=>$(!1),O.onerror=()=>$(!1),F.speak(O),$(!0)}},G=o?(F=>{const _=F.realDistance*1e6,V=(F.realDistance/18).toFixed(1),w=(_/900/24/365).toFixed(1),I=_/4e4,L=Math.round(I/24),O=(I/24/365).toFixed(1),we=L>365?`${O} 年`:`${L} 天`;return{lightMinutes:V,planeYears:w,rocketTimeDisplay:we}})(o):null,se=o&&_t.includes(o.id),ne=o&&o.id!=="earth"&&o.id!=="sun"&&o.id!=="tiangong"&&!se,z=(o==null?void 0:o.id)==="earth",X=F=>F.id==="sun"?{icon:"☀️",type:"恒星"}:F.id==="earth"?{icon:"🌍",type:"生命家园"}:F.id==="pluto"?{icon:"❄️",type:"矮行星"}:F.id==="tiangong"?{icon:"🛰️",type:"空间站"}:_t.includes(F.id)?{icon:"🌑",type:"卫星"}:F.realDistance<300?{icon:"🪨",type:"岩石系"}:F.realDistance>2e3?{icon:"🧊",type:"冰系"}:F.hasRings?{icon:"🪐",type:"光环系"}:{icon:"🎈",type:"气体系"},Z=F=>{if(F.id==="earth")return"0";if(F.id==="moon")return"38 万公里";if(F.id==="tiangong")return"400 公里";if(F.id==="sun")return"1.5 亿公里";const _=Math.abs(F.realDistance-150)/100;return`${Math.round(_*100)/100} 亿公里`};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
    @keyframes spin-slow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    @keyframes pop-up {
      0% { transform: scale(0.5) translateY(50px); opacity: 0; }
      80% { transform: scale(1.05) translateY(-10px); opacity: 1; }
      100% { transform: scale(1) translateY(0); }
    }
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes talking-wave {
      0% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.7); transform: scale(1); }
      50% { box-shadow: 0 0 0 10px rgba(34, 211, 238, 0); transform: scale(1.05); }
      100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); transform: scale(1); }
    }
    .animate-pop-up { animation: pop-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
    .animate-talking { animation: talking-wave 1.5s infinite; }
    
    /* Custom Scrollbar */
    .pika-scrollbar::-webkit-scrollbar { width: 6px; }
    .pika-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); border-radius: 3px; }
    .pika-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 3px; }
    
    /* Common Button Base */
    .action-btn {
      width: 3.5rem; height: 3.5rem;
      border: 2px solid rgba(255,255,255,0.2);
      border-radius: 50%;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      backdrop-filter: blur(10px);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: hidden;
    }
    @media (min-width: 640px) {
      .action-btn { width: 4rem; height: 4rem; border-width: 3px; }
    }
    .action-btn::before {
      content: ''; position: absolute; inset: 0; 
      background: radial-gradient(circle at top left, rgba(255,255,255,0.4), transparent 70%);
      opacity: 0.5;
    }
    .action-btn:active { transform: scale(0.95); }
    .action-btn:hover { border-color: rgba(255,255,255,0.8); transform: translateY(-2px); }

    /* Button Colors */
    .rocket-btn { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .pluto-btn { background: linear-gradient(135deg, #8b5cf6, #5b21b6); }
    .orbit-btn { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .gesture-btn { background: linear-gradient(135deg, #10b981, #047857); }
    .constellation-btn { background: linear-gradient(135deg, #ec4899, #be185d); }
    
    .action-btn.inactive { background: rgba(30, 41, 59, 0.8); border-color: rgba(255,255,255,0.1); }
    .action-btn .indicator {
       position: absolute; top: 8px; right: 8px;
       width: 6px; height: 6px; border-radius: 50%;
       box-shadow: 0 0 5px currentColor;
    }
    
    .gesture-active-pulse { animation: pulse-green 2s infinite; }
    @keyframes pulse-green {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .space-card-border {
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(12px);
    }
  `}),e.jsxs("div",{className:"absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 z-10 font-sans select-none",children:[e.jsxs("header",{className:"flex flex-col sm:flex-row justify-between items-start pointer-events-auto w-full gap-4",children:[e.jsxs("div",{className:"flex flex-col items-start relative pl-4 pt-4",children:[e.jsx("div",{className:"absolute -left-12 -top-12 text-cyan-500/10 z-0 animate-spin-slow",style:{animationDuration:"60s"},children:e.jsxs("svg",{width:"220",height:"220",viewBox:"0 0 100 100",fill:"none",stroke:"currentColor",strokeWidth:"1",children:[e.jsx("circle",{cx:"50",cy:"50",r:"48",strokeDasharray:"5 5"}),e.jsx("circle",{cx:"50",cy:"50",r:"38",opacity:"0.3"}),e.jsx("path",{d:"M50 5 L50 15 M50 85 L50 95 M5 50 L15 50 M85 50 L95 50",strokeWidth:"2",strokeLinecap:"round"})]})}),e.jsx("div",{className:"relative z-10",children:e.jsxs("div",{className:"bg-transparent p-2 sm:p-4 relative overflow-hidden group",children:[e.jsxs("div",{className:"mb-2 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 animate-fade-in hover:bg-white/20 transition-all w-fit relative z-20",children:[e.jsx("span",{className:"text-xl filter drop-shadow-sm",children:"👩‍🚀"}),e.jsxs("div",{className:"flex flex-col leading-none",children:[e.jsx("span",{className:"text-[8px] text-cyan-300 font-mono font-bold tracking-widest uppercase",children:"Captain"}),e.jsx("span",{className:"text-white font-bold text-xs sm:text-sm whitespace-nowrap",children:"一年3班 小豆子"})]})]}),e.jsxs("h1",{className:"text-3xl sm:text-5xl tracking-wider flex items-center gap-3 relative z-20",style:{fontFamily:'"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',textShadow:"0 4px 0 rgba(0,0,0,0.3), 0 0 15px rgba(255,255,255,0.2)"},children:[e.jsx("span",{className:"bg-linear-to-br from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]",children:"漫游"}),e.jsx("span",{className:"bg-linear-to-br from-cyan-300 via-blue-500 to-purple-500 bg-clip-text text-transparent filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]",children:"太阳系"})]})]})})]}),e.jsxs("div",{className:"flex flex-col items-end gap-4 pt-2 self-end sm:self-auto pointer-events-none",children:[e.jsxs("div",{className:"flex gap-2 sm:gap-4 pointer-events-auto",children:[e.jsxs("button",{onClick:i,title:"星际穿越",className:`action-btn rocket-btn pointer-events-auto ${t?"":"inactive"}`,children:[e.jsx("div",{className:`indicator ${t?"bg-green-400 shadow-green-400":"bg-red-400"}`}),e.jsx("span",{className:"text-xl sm:text-2xl mt-1",children:"🚀"})]}),e.jsxs("button",{onClick:u,title:"手势控制",className:`action-btn gesture-btn pointer-events-auto ${f?"gesture-active-pulse":"inactive"}`,children:[e.jsx("div",{className:`indicator ${f?"bg-green-400 shadow-green-400":"bg-red-400"}`}),e.jsx("span",{className:"text-xl sm:text-2xl mt-1",children:"👋"})]}),e.jsxs("button",{onClick:l,title:"冥王星开关",className:`action-btn pluto-btn pointer-events-auto ${m?"":"inactive"}`,children:[e.jsx("div",{className:`indicator ${m?"bg-green-400 shadow-green-400":"bg-red-400"}`}),e.jsx("span",{className:"text-xl sm:text-2xl mt-1",children:"❄️"})]}),e.jsxs("button",{onClick:p,title:"显示/隐藏轨道",className:`action-btn orbit-btn pointer-events-auto ${a?"":"inactive"}`,children:[e.jsx("div",{className:`indicator ${a?"bg-green-400 shadow-green-400":"bg-red-400"}`}),e.jsx("span",{className:"text-xl sm:text-2xl mt-1",children:"💫"})]}),Vt]}),!t&&!f&&e.jsxs("div",{className:"hidden sm:flex flex-col items-end pointer-events-auto relative mt-2 animate-fade-in",children:[e.jsx("div",{className:"h-4 w-1 bg-cyan-400 absolute -top-2 right-4 rounded-b-sm z-20 shadow-[0_0_8px_#22d3ee]"}),e.jsxs("div",{className:"bg-transparent rounded-xl p-1 w-auto relative group",children:[e.jsxs("div",{className:"flex items-center justify-between px-3 py-2 bg-transparent",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:`w-3 h-3 rounded-full border-2 border-cyan-400 ${s>0?"animate-spin":""}`,style:{borderTopColor:"transparent"}}),e.jsx("span",{className:"text-xs font-bold text-cyan-300 tracking-wider font-mono drop-shadow-sm",children:"TIME ENGINE"})]}),e.jsx("span",{className:"text-[10px] font-bold text-cyan-100/70 ml-4 font-mono",children:"时光引擎"})]}),e.jsxs("div",{className:"p-3 flex items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col items-end min-w-14",children:[e.jsxs("span",{className:"text-3xl font-black italic text-transparent bg-clip-text bg-linear-to-r from-cyan-200 to-white leading-none drop-shadow-md",style:{fontFamily:"monospace"},children:[s,e.jsx("span",{className:"text-sm text-cyan-400 not-italic ml-0.5",children:"x"})]}),e.jsx("span",{className:"text-[9px] text-cyan-300/80 tracking-[0.2em] uppercase mt-1 font-bold",children:"Speed"})]}),e.jsx("div",{className:"flex items-end gap-1.5 h-10 pb-1",children:[0,1,5,10,20].map((F,_)=>{const V=s===F,te=["h-3","h-4","h-6","h-8","h-10"][_],w=F===0?"bg-red-500 shadow-[0_0_10px_#ef4444]":F===20?"bg-purple-500 shadow-[0_0_10px_#a855f7]":"bg-cyan-400 shadow-[0_0_10px_#22d3ee]";return e.jsx("button",{onClick:()=>r(F),className:`w-5 rounded-t-sm transition-all duration-300 relative group/btn ${te} ${V?`${w} z-10 scale-110`:"bg-white/10 hover:bg-white/30 border border-white/5"}`,children:e.jsx("span",{className:`absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold font-mono transition-opacity pointer-events-none ${V?"opacity-100 text-white drop-shadow-md":"opacity-0 text-cyan-200 group-hover/btn:opacity-100"}`,children:F===0?"STOP":F})},F)})})]})]})]})]})]}),o&&e.jsx("div",{className:"pointer-events-auto self-end sm:self-auto sm:absolute sm:right-6 sm:top-28 sm:w-95 w-full max-h-[calc(100vh-160px)] flex flex-col animate-pop-up z-50",children:e.jsxs("div",{className:"bg-slate-900/90 space-card-border rounded-3xl p-1 shadow-2xl relative overflow-hidden",children:[e.jsx("div",{className:"absolute top-0 right-0 p-4 opacity-20 pointer-events-none",children:e.jsx("svg",{width:"80",height:"80",viewBox:"0 0 24 24",fill:"white",children:e.jsx("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"})})}),e.jsxs("div",{className:"bg-black/40 rounded-2xl border border-white/10 p-4 h-full flex flex-col relative overflow-hidden",children:[e.jsx("button",{onClick:c,className:"absolute top-3 right-3 z-20 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center active:scale-95 text-white font-bold backdrop-blur-sm transition-colors",children:"✕"}),e.jsxs("button",{onClick:C,className:`absolute top-3 right-14 z-20 h-8 px-3 rounded-full flex items-center justify-center active:scale-95 text-white font-bold backdrop-blur-sm transition-all border border-white/20
                    ${j?"bg-cyan-500 animate-talking shadow-[0_0_15px_#06b6d4]":"bg-white/10 hover:bg-white/20"}
                  `,children:[e.jsx("span",{className:"mr-1",children:j?"🔊":"🔈"}),e.jsx("span",{className:"text-xs",children:j?"讲解中...":"听讲解"})]}),e.jsxs("div",{className:"flex items-center gap-3 mb-4 z-10",children:[e.jsx("div",{className:"w-14 h-14 rounded-full border-2 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-linear-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-3xl",children:X(o).icon}),e.jsxs("div",{children:[e.jsx("div",{className:"text-cyan-400 text-[10px] font-mono tracking-widest uppercase mb-1",children:"New Discovery"}),e.jsx("h2",{className:"text-3xl text-white tracking-wide drop-shadow-lg",style:{fontFamily:'"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'},children:o.name.split(" ")[0]}),e.jsx("div",{className:"flex gap-2 mt-1",children:e.jsx("span",{className:"bg-white/10 text-blue-200 px-2 py-0.5 text-[10px] font-bold rounded border border-white/20 uppercase backdrop-blur-sm",children:X(o).type})})]})]}),e.jsxs("div",{className:"grow overflow-y-auto pr-2 pika-scrollbar space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsxs("div",{className:"bg-slate-800/50 border border-white/10 rounded-lg p-2 flex flex-col items-center",children:[e.jsx("span",{className:"text-[10px] font-bold text-gray-400 uppercase",children:"平均温度"}),e.jsx("span",{className:"text-sm font-bold text-white",children:o.temperature||"未知"})]}),e.jsxs("div",{className:"bg-slate-800/50 border border-white/10 rounded-lg p-2 flex flex-col items-center",children:[e.jsx("span",{className:"text-[10px] font-bold text-gray-400 uppercase",children:"主要成分"}),e.jsx("span",{className:"text-sm font-bold text-white text-center leading-tight",children:o.composition||"岩石/气体"})]})]}),e.jsxs("div",{className:"bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-3 flex justify-between items-center",children:[e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"text-[10px] text-indigo-300 font-bold uppercase tracking-wider",children:"距离地球"}),e.jsx("span",{className:"text-lg text-white font-mono font-bold leading-none mt-1",children:Z(o)})]}),e.jsx("span",{className:"text-2xl opacity-50",children:"📏"})]}),e.jsxs("div",{className:"bg-blue-900/20 border border-blue-500/20 rounded-lg p-3 relative mt-2",children:[e.jsx("div",{className:"absolute -top-2 -left-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded rotate-0 shadow-lg",children:"DATA LOG"}),e.jsx("p",{className:"text-gray-200 font-medium text-sm leading-relaxed mt-2",children:o.description}),o.funFact&&e.jsxs("div",{className:"mt-3 pt-2 border-t border-white/10 border-dashed",children:[e.jsx("span",{className:"text-yellow-400 font-bold text-xs mr-2",children:"⚠ 趣闻:"}),e.jsx("span",{className:"text-gray-300 text-xs",children:o.funFact})]})]}),ne&&G&&e.jsxs("div",{className:"bg-black/40 rounded-lg p-3 border border-white/10",children:[e.jsxs("h3",{className:"text-cyan-400 text-xs font-bold uppercase mb-3 flex items-center gap-1",children:[e.jsx("span",{className:"w-1 h-3 bg-cyan-400 rounded-full"}),"旅行时间估算"]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-[10px] font-bold text-gray-400 w-12 text-right",children:"光速"}),e.jsx("div",{className:"grow h-2 bg-gray-800 rounded-full overflow-hidden relative",children:e.jsx("div",{className:"absolute top-0 left-0 h-full bg-yellow-400 w-full animate-pulse shadow-[0_0_10px_#facc15]"})}),e.jsxs("span",{className:"text-[10px] font-mono text-yellow-400 w-16 text-right",children:[G.lightMinutes," 分"]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-[10px] font-bold text-gray-400 w-12 text-right",children:"火箭"}),e.jsx("div",{className:"grow h-2 bg-gray-800 rounded-full overflow-hidden relative",children:e.jsx("div",{className:"absolute top-0 left-0 h-full bg-red-500 w-[70%]"})}),e.jsx("span",{className:"text-[10px] font-mono text-red-400 w-16 text-right",children:G.rocketTimeDisplay})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-[10px] font-bold text-gray-400 w-12 text-right",children:"飞机"}),e.jsx("div",{className:"grow h-2 bg-gray-800 rounded-full overflow-hidden relative",children:e.jsx("div",{className:"absolute top-0 left-0 h-full bg-blue-500 w-[20%]"})}),e.jsxs("span",{className:"text-[10px] font-mono text-blue-400 w-16 text-right",children:[G.planeYears," 年"]})]})]})]}),z&&e.jsxs("div",{className:"bg-emerald-900/20 rounded-lg p-3 border border-emerald-500/30",children:[e.jsx("h3",{className:"text-emerald-400 text-xs font-bold uppercase mb-2 flex items-center",children:"💧 生命维持系统"}),e.jsx("p",{className:"text-emerald-100 text-xs leading-relaxed",children:"地球表面 71% 是海洋，只有 29% 是陆地。我们有厚厚的大气层，像被子一样挡住太阳的紫外线，还锁住空气和水，让我们能自由呼吸！"})]})]}),e.jsxs("div",{className:"h-4 flex justify-between items-center mt-2 px-1 border-t border-white/5 pt-2",children:[e.jsxs("div",{className:"flex gap-1",children:[e.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"}),e.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse",style:{animationDelay:"75ms"}}),e.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse",style:{animationDelay:"150ms"}})]}),e.jsx("div",{className:"text-[9px] text-cyan-700 font-mono tracking-wider",children:"SYS.VER 3.1"})]})]})]})})]})]})},lr=n.lazy(()=>uo(()=>import("./GestureController-DzGKJpE8.js"),__vite__mapDeps([0,1,2]),import.meta.url).then(o=>({default:o.GestureController}))),dr=({showConstellationLines:o})=>{const c=n.useRef(null),s=n.useMemo(()=>Co(),[]),r=n.useMemo(()=>{const t=new pe().load(s);return t.wrapS=$o,t.wrapT=vo,t.colorSpace=be,t},[s]);return n.useEffect(()=>()=>r.dispose(),[r]),ce((t,i)=>{c.current&&(c.current.rotation.y+=i*1e-4)}),e.jsxs("group",{ref:c,children:[e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[800,64,64]}),e.jsx("meshBasicMaterial",{map:r,side:It,color:"#ffffff"})]}),o&&e.jsx(ar,{radius:790})]})},Oe=new D,Ot=new D,ut=new D,pr=({target:o,planetRefs:c,controlsRef:s,setTarget:r,isStarshipActive:t})=>(ce((i,m)=>{if(!o||t)return;const{id:l,size:u}=o,f=c.current[l];if(!f){r(null);return}f.getWorldPosition(Oe),Ot.subVectors(i.camera.position,Oe).normalize();const a=l==="sun"?140:Math.max(u*4,6);ut.copy(Oe).addScaledVector(Ot,a);const p=4*m;s.current.target.lerp(Oe,p),i.camera.position.lerp(ut,p),s.current.update(),i.camera.position.distanceTo(ut)<.2&&s.current.target.distanceTo(Oe)<.1&&r(null)}),null),ur=({action:o,setAction:c,onDoubleClick:s,onClose:r})=>{const{camera:t,scene:i}=bo(),m=n.useMemo(()=>new Fo,[]);return n.useEffect(()=>{var l;if(o){if(o.type==="peace")r(),c(null);else if(o.type==="pinch"){const u=new Xe(o.x*2-1,-(o.y*2-1));m.setFromCamera(u,t);const f=i.__planetRefs||{},a=m.intersectObjects(Object.values(f),!0);if(a.length>0){let p=null;for(let d of a){let y=d.object;for(;y;){if((l=y.userData)!=null&&l.id){p=y.userData.id;break}const j=Object.keys(f).find($=>f[$]===y);if(j){p=j;break}y=y.parent}if(p)break}p&&s(p)}c(null)}}},[o,t,i,m,s,r,c]),null},fr=({controlsRef:o,gestureVelocity:c})=>{const s=n.useRef({dx:0,dy:0});return ce((r,t)=>{if(o.current&&o.current.enabled){const{dx:i,dy:m,gestureType:l}=c.current,u=5*t;s.current.dx=Y.lerp(s.current.dx,i,u),s.current.dy=Y.lerp(s.current.dy,m,u);const f=.001,a=Math.abs(s.current.dx)>f?s.current.dx:0,p=Math.abs(s.current.dy)>f?s.current.dy:0;if(a!==0||p!==0){if(l==="rotate")o.current.setAzimuthalAngle(o.current.getAzimuthalAngle()-a*.02),o.current.setPolarAngle(o.current.getPolarAngle()-p*.02);else if(l==="zoom"){const d=1+Math.abs(p*.015);p>0?o.current.dollyOut(d):o.current.dollyIn(d)}o.current.update()}}}),null},hr=()=>{const[o,c]=n.useState(null),[s,r]=n.useState(!1),[t,i]=n.useState(1),[m,l]=n.useState(!1),[u,f]=n.useState(!1),[a,p]=n.useState(!0),[d,y]=n.useState(!1),[j,$]=n.useState(!1),[x,M]=n.useState(!1),[A,v]=n.useState(null),[C,B]=n.useState(null),G=n.useRef({}),se=n.useRef(null),ne=n.useRef({dx:0,dy:0,gestureType:"rotate"});n.useEffect(()=>{document.body.style.backgroundColor=x?"transparent":"#000"},[x]);const z=w=>{c(w),r(!0)},X=()=>{c(null),r(!1),v({id:H.id,size:H.size})},Z=w=>{if(w==="sun")return H.size;if(w==="moon")return ve.size;if(w==="tiangong")return xe.size;const I=ye.find(L=>L.id===w);return I?I.size:1},le=w=>{const I=Z(w);v({id:w,size:I}),z(w)},F=(w,I,L)=>{B({x:w,y:I,type:L})},_=()=>{ne.current={dx:0,dy:0,gestureType:"rotate"},B(null),$(!1)},V=()=>{j?_():$(!0)},te=n.useMemo(()=>{if(o==="sun")return H;if(o==="moon")return ve;if(o==="tiangong")return xe;const w=ye.find(I=>I.id===o);return w||[...qt,...Ht].find(I=>I.id===o)||null},[o]);return e.jsxs("div",{className:"w-full h-screen relative overflow-hidden",style:{backgroundColor:x?"transparent":"#000"},children:[e.jsx(cr,{selectedPlanet:te,onClose:X,simulationSpeed:t,setSimulationSpeed:i,isStarshipActive:m,toggleStarship:()=>l(!m),showPluto:u,togglePluto:()=>f(!u),isGestureMode:j,toggleGestureMode:V,showOrbits:a,toggleOrbits:()=>p(!a),showConstellationLines:d,toggleConstellationLines:()=>y(!d)}),j&&e.jsx(n.Suspense,{fallback:null,children:e.jsx(lr,{onControl:(w,I,L)=>{const O=ne.current;O.dx=w,O.dy=I,O.gestureType=L},onAction:F,onClose:_,isARMode:x,toggleARMode:()=>M(!x)})}),e.jsx(fo,{dpr:[1,2],gl:{antialias:!0,alpha:!0},onPointerMissed:()=>o&&X(),onCreated:w=>{w.scene.__planetRefs=G.current},children:e.jsxs(n.Suspense,{fallback:null,children:[e.jsx(ho,{makeDefault:!0,position:[0,80,120],fov:45}),e.jsx(mo,{ref:se,makeDefault:!0,enabled:!m,enableDamping:!0,dampingFactor:.05,enablePan:!1,minDistance:2,maxDistance:500,autoRotate:!o&&!s&&!j&&!m&&!A,autoRotateSpeed:.1*t}),e.jsx(pr,{target:A,planetRefs:G,controlsRef:se,setTarget:v,isStarshipActive:m}),e.jsx(ur,{action:C,setAction:B,onDoubleClick:le,onClose:X}),e.jsx(fr,{controlsRef:se,gestureVelocity:ne}),e.jsx(xo,{files:"./hdri/potsdamer_platz_1k.hdr",environmentIntensity:.3}),e.jsx("pointLight",{position:[0,0,0],intensity:2.5,distance:500,decay:0}),e.jsx("ambientLight",{intensity:.15}),!x&&e.jsx(dr,{showConstellationLines:Vt}),e.jsx(yo,{radius:400}),e.jsx(go,{count:400,scale:200,size:6}),e.jsx(Yo,{onSelect:z,onDoubleClick:le,isPaused:s,simulationSpeed:t,planetRefs:G}),e.jsx(ir,{isPaused:s,simulationSpeed:t}),(u?ye:ye.filter(w=>w.id!=="pluto")).map(w=>e.jsx(Io,{data:w,onSelect:z,onDoubleClick:le,isPaused:s,simulationSpeed:t,planetRefs:G,showOrbit:a},w.id)),m&&e.jsx(nr,{planetRefs:G,simulationSpeed:t,isPaused:s,onMissionComplete:()=>{l(!1),v({id:H.id,size:H.size})}})]})})]})},Kt=document.getElementById("root");if(!Kt)throw new Error("Could not find root element to mount to");const mr=to.createRoot(Kt);mr.render(e.jsx(oo.StrictMode,{children:e.jsx(hr,{})}));

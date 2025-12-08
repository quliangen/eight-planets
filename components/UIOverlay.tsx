
import React from 'react';
import { PlanetData } from '../types';

interface UIOverlayProps {
  selectedPlanet: PlanetData | null;
  onClose: () => void;
  isPaused: boolean;
  togglePause: () => void;
  isStarshipActive: boolean;
  toggleStarship: () => void;
  showPluto: boolean;
  togglePluto: () => void;
  toggleGestureMode: () => void;
  isGestureMode: boolean;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ 
  selectedPlanet, 
  onClose,
  isPaused,
  togglePause,
  isStarshipActive,
  toggleStarship,
  showPluto,
  togglePluto,
  toggleGestureMode,
  isGestureMode
}) => {
  // Calculations for kids
  const calculateTravelTime = (planet: PlanetData) => {
    const distanceKm = planet.realDistance * 1000000;
    
    // Light speed: ~300,000 km/s (~18,000,000 km/min)
    const lightMinutes = (planet.realDistance / 18).toFixed(1);
    
    // Airplane: ~900 km/h
    const planeHours = distanceKm / 900;
    const planeYears = (planeHours / 24 / 365).toFixed(1);
    
    // Fast Rocket: ~40,000 km/h
    const rocketHours = distanceKm / 40000;
    const rocketDays = Math.round(rocketHours / 24);
    const rocketYears = (rocketHours / 24 / 365).toFixed(1);

    const rocketTimeDisplay = rocketDays > 365 
      ? `${rocketYears} 年` 
      : `${rocketDays} 天`;

    return { lightMinutes, planeYears, rocketTimeDisplay };
  };

  const travelInfo = selectedPlanet ? calculateTravelTime(selectedPlanet) : null;

  // Determine if we should show travel time (Not for Earth or Sun)
  const showTravelTime = selectedPlanet && selectedPlanet.id !== 'earth' && selectedPlanet.id !== 'sun';
  // Determine if we should show Habitat Info (Only for Earth)
  const isEarth = selectedPlanet?.id === 'earth';

  const getPlanetTheme = (planet: PlanetData) => {
    if (planet.id === 'sun') return { icon: '☀️', type: '恒星' };
    if (planet.id === 'earth') return { icon: '🌍', type: '生命家园' };
    if (planet.id === 'pluto') return { icon: '❄️', type: '矮行星' };
    if (planet.realDistance < 200) return { icon: '🪨', type: '岩石系' }; 
    if (planet.hasRings) return { icon: '🪐', type: '飞行系' };
    if (planet.realDistance > 2000) return { icon: '🧊', type: '冰系' };
    return { icon: '🎈', type: '气体系' };
  };

  const styles = `
    @keyframes spin-slow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 10px rgba(6,182,212,0.5); }
      50% { box-shadow: 0 0 20px rgba(6,182,212,0.8); }
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
    .animate-pop-up { animation: pop-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
    .animate-float { animation: float 4s ease-in-out infinite; }
    
    /* Custom Scrollbar */
    .pika-scrollbar::-webkit-scrollbar { width: 6px; }
    .pika-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); border-radius: 3px; }
    .pika-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 3px; }
    
    /* Common Button Base */
    .action-btn {
      width: 4rem; height: 4rem;
      border: 3px solid rgba(255,255,255,0.2);
      border-radius: 50%;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      backdrop-filter: blur(10px);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: hidden;
    }
    .action-btn::before {
      content: ''; position: absolute; inset: 0; 
      background: radial-gradient(circle at top left, rgba(255,255,255,0.4), transparent 70%);
      opacity: 0.5;
    }
    .action-btn:active { transform: scale(0.95); }
    .action-btn:hover { border-color: rgba(255,255,255,0.8); transform: translateY(-2px); }

    /* Pokeball (Pause) - Space Style */
    .pokeball {
      background: linear-gradient(135deg, #e11d48, #881337); /* Red planet style */
    }
    .pokeball.paused { filter: grayscale(1); opacity: 0.7; }
    
    /* Rocket Button Style */
    .rocket-btn {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }
    .rocket-btn.inactive { background: rgba(30, 41, 59, 0.8); border-color: rgba(255,255,255,0.1); }
    .rocket-btn .indicator {
       position: absolute; top: 10px; right: 10px;
       width: 8px; height: 8px; border-radius: 50%;
       box-shadow: 0 0 5px currentColor;
    }

    /* Pluto Button Style */
    .pluto-btn {
      background: linear-gradient(135deg, #8b5cf6, #5b21b6);
    }
    .pluto-btn.inactive { background: rgba(30, 41, 59, 0.8); border-color: rgba(255,255,255,0.1); }
    .pluto-btn .indicator {
       position: absolute; top: 10px; right: 10px;
       width: 8px; height: 8px; border-radius: 50%;
       box-shadow: 0 0 5px currentColor;
    }

    /* Gesture Button Style */
    .gesture-btn {
      background: linear-gradient(135deg, #10b981, #047857);
    }
    .gesture-btn.inactive { background: rgba(30, 41, 59, 0.8); border-color: rgba(255,255,255,0.1); }
    .gesture-btn .indicator {
       position: absolute; top: 10px; right: 10px;
       width: 8px; height: 8px; border-radius: 50%;
       box-shadow: 0 0 5px currentColor;
    }

    /* Comic Style Replacement - Space Info Card */
    .space-card-border {
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(12px);
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 z-10 font-sans select-none">
        
        {/* Header Section - Astronaut/HUD Theme */}
        <header className="flex justify-between items-start pointer-events-auto w-full max-w-5xl mx-auto sm:mx-0">
          <div className="flex flex-col items-start relative pl-2 pt-2">
            
            {/* Background Decorative HUD Ring */}
            <div className="absolute -left-12 -top-12 text-cyan-500/10 z-0 animate-spin-slow" style={{animationDuration: '60s'}}>
               <svg width="200" height="200" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                 <circle cx="50" cy="50" r="48" strokeDasharray="10 5" />
                 <circle cx="50" cy="50" r="35" opacity="0.5" />
                 <path d="M50 2 L50 10 M50 90 L50 98 M2 50 L10 50 M90 50 L98 50" strokeWidth="2" />
               </svg>
            </div>

            {/* Recipient Tag - HUD Style - MORE TRANSPARENT */}
            <div className="relative z-10 flex items-center gap-3 bg-slate-900/10 border border-cyan-500/20 backdrop-blur-md px-4 py-1.5 rounded-tr-xl rounded-bl-xl shadow-[0_0_15px_rgba(6,182,212,0.1)] mb-3 animate-float">
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
                  <span className="text-cyan-400 font-mono text-[10px] tracking-widest uppercase">Mission Target</span>
               </div>
               <div className="w-[1px] h-3 bg-white/20"></div>
               <span className="text-blue-50 font-bold text-sm tracking-wide">给：一年3班 小豆子</span>
            </div>

            {/* Main Title - Space Badge with Cute Font - MORE TRANSPARENT */}
            <div className="relative z-10">
              <div className="bg-slate-900/5 border-l-4 border-blue-500 border-y border-r border-blue-500/10 backdrop-blur-xl px-6 py-4 rounded-r-2xl shadow-2xl relative overflow-hidden group">
                {/* Glossy sheen */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                {/* Scanline */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 animate-pulse"></div>
                
                <div className="flex flex-col">
                   <div className="flex items-center gap-2 mb-1 opacity-80">
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.22-7.52-1.5 1.5-7.52 3.22 7.51z"/>
                      </svg>
                      <span className="text-[10px] font-mono text-blue-300 tracking-[0.3em] uppercase">System Online</span>
                   </div>
                   {/* UPDATED FONT STYLE HERE */}
                   <h1 className="text-3xl sm:text-4xl text-white tracking-widest flex items-center gap-2" 
                       style={{ 
                         fontFamily: '"ZCOOL KuaiLe", cursive, sans-serif',
                         textShadow: '0 0 15px rgba(59,130,246,0.6), 2px 2px 0px rgba(0,0,0,0.3)' 
                       }}>
                     太阳和它的朋友们
                   </h1>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 pt-2">
            {/* Pause Button */}
            <button 
              onClick={togglePause}
              className={`action-btn pokeball pointer-events-auto ${!isPaused ? 'spinning' : 'paused'}`}
              title={isPaused ? "Go! (继续)" : "Wait! (暂停)"}
            >
              <span className="text-2xl">{isPaused ? "⏸" : "▶️"}</span>
            </button>

            {/* Interstellar Travel Button */}
            <button
              onClick={toggleStarship}
              title="Toggle Starship"
              className={`action-btn rocket-btn pointer-events-auto ${!isStarshipActive ? 'inactive' : ''}`}
            >
              <div className={`indicator ${isStarshipActive ? 'bg-green-400 shadow-green-400' : 'bg-red-400'}`}></div>
              <span className="text-2xl mt-1">🚀</span>
            </button>

            {/* Gesture Toggle Button */}
            <button
              onClick={toggleGestureMode}
              title="手势控制"
              className={`action-btn gesture-btn pointer-events-auto ${!isGestureMode ? 'inactive' : ''}`}
            >
              <div className={`indicator ${isGestureMode ? 'bg-green-400 shadow-green-400' : 'bg-red-400'}`}></div>
              <span className="text-2xl mt-1">👋</span>
            </button>

            {/* Pluto Toggle Button */}
            <button
              onClick={togglePluto}
              title="Toggle Pluto"
              className={`action-btn pluto-btn pointer-events-auto ${!showPluto ? 'inactive' : ''}`}
            >
              <div className={`indicator ${showPluto ? 'bg-green-400 shadow-green-400' : 'bg-red-400'}`}></div>
              <span className="text-2xl mt-1">❄️</span>
            </button>
          </div>
        </header>

        {/* Planet Info Card (Right Side) */}
        {selectedPlanet && (
          <div className="pointer-events-auto self-end sm:self-auto sm:absolute sm:right-6 sm:top-28 sm:w-[380px] w-full max-h-[calc(100vh-160px)] flex flex-col animate-pop-up">
            
            <div className="bg-slate-900/90 space-card-border rounded-3xl p-1 shadow-2xl relative overflow-hidden">
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                 <svg width="80" height="80" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              </div>

              <div className="bg-black/40 rounded-2xl border border-white/10 p-4 h-full flex flex-col relative overflow-hidden">
                <button 
                  onClick={onClose} 
                  className="absolute top-3 right-3 z-20 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center active:scale-95 text-white font-bold backdrop-blur-sm transition-colors"
                >
                  ✕
                </button>

                <div className="flex items-center gap-3 mb-4 z-10">
                   <div className={`w-14 h-14 rounded-full border-2 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-3xl`}>
                     {getPlanetTheme(selectedPlanet).icon}
                   </div>
                   <div>
                     <div className="text-cyan-400 text-[10px] font-mono tracking-widest uppercase mb-1">
                       New Discovery
                     </div>
                     {/* Updated Planet Title Font too */}
                     <h2 className="text-3xl text-white tracking-wide drop-shadow-lg" style={{ fontFamily: '"ZCOOL KuaiLe", cursive, sans-serif' }}>
                       {selectedPlanet.name.split(' ')[0]}
                     </h2>
                     <div className="flex gap-2 mt-1">
                        <span className="bg-white/10 text-blue-200 px-2 py-0.5 text-[10px] font-bold rounded border border-white/20 uppercase backdrop-blur-sm">
                          {getPlanetTheme(selectedPlanet).type}
                        </span>
                     </div>
                   </div>
                </div>

                <div className="flex-grow overflow-y-auto pr-2 pika-scrollbar space-y-4">
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-800/50 border border-white/10 rounded-lg p-2 flex flex-col items-center">
                       <span className="text-[10px] font-bold text-gray-400 uppercase">平均温度</span>
                       <span className="text-sm font-bold text-white">{selectedPlanet.temperature || "未知"}</span>
                    </div>
                    <div className="bg-slate-800/50 border border-white/10 rounded-lg p-2 flex flex-col items-center">
                       <span className="text-[10px] font-bold text-gray-400 uppercase">主要成分</span>
                       <span className="text-sm font-bold text-white text-center leading-tight">{selectedPlanet.composition || "岩石/气体"}</span>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-3 relative mt-2">
                    <div className="absolute -top-2 -left-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded rotate-0 shadow-lg">
                      DATA LOG
                    </div>
                    <p className="text-gray-200 font-medium text-sm leading-relaxed mt-2">
                      {selectedPlanet.description}
                    </p>
                    {selectedPlanet.funFact && (
                      <div className="mt-3 pt-2 border-t border-white/10 border-dashed">
                        <span className="text-yellow-400 font-bold text-xs mr-2">⚠ 趣闻:</span>
                        <span className="text-gray-300 text-xs">{selectedPlanet.funFact}</span>
                      </div>
                    )}
                  </div>

                  {/* Travel Stats */}
                  {showTravelTime && travelInfo && (
                    <div className="bg-black/40 rounded-lg p-3 border border-white/10">
                       <h3 className="text-cyan-400 text-xs font-bold uppercase mb-3 flex items-center gap-1">
                         <span className="w-1 h-3 bg-cyan-400 rounded-full"></span>
                         旅行时间估算
                       </h3>
                       <div className="space-y-3">
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-gray-400 w-12 text-right">光速</span>
                             <div className="flex-grow h-2 bg-gray-800 rounded-full overflow-hidden relative"><div className="absolute top-0 left-0 h-full bg-yellow-400 w-full animate-pulse shadow-[0_0_10px_#facc15]"></div></div>
                             <span className="text-[10px] font-mono text-yellow-400 w-16 text-right">{travelInfo.lightMinutes} 分</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-gray-400 w-12 text-right">火箭</span>
                             <div className="flex-grow h-2 bg-gray-800 rounded-full overflow-hidden relative"><div className="absolute top-0 left-0 h-full bg-red-500 w-[70%]"></div></div>
                             <span className="text-[10px] font-mono text-red-400 w-16 text-right">{travelInfo.rocketTimeDisplay}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-gray-400 w-12 text-right">飞机</span>
                             <div className="flex-grow h-2 bg-gray-800 rounded-full overflow-hidden relative"><div className="absolute top-0 left-0 h-full bg-blue-500 w-[20%]"></div></div>
                             <span className="text-[10px] font-mono text-blue-400 w-16 text-right">{travelInfo.planeYears} 年</span>
                          </div>
                       </div>
                    </div>
                  )}

                  {/* Earth Habitat Info */}
                  {isEarth && (
                     <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-500/30">
                        <h3 className="text-emerald-400 text-xs font-bold uppercase mb-2 flex items-center">
                           💧 生命维持系统
                        </h3>
                        <p className="text-emerald-100 text-xs leading-relaxed">
                           地球表面 71% 是海洋，只有 29% 是陆地。我们有厚厚的大气层，像被子一样挡住太阳的紫外线，还锁住空气和水，让我们能自由呼吸！
                        </p>
                     </div>
                  )}

                </div>
                
                <div className="h-4 flex justify-between items-center mt-2 px-1 border-t border-white/5 pt-2">
                   <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse delay-75"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-150"></div>
                   </div>
                   <div className="text-[9px] text-cyan-700 font-mono tracking-wider">SYS.VER 3.0</div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

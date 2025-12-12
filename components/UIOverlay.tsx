
import React from 'react';
import { PlanetData } from '../types';

interface UIOverlayProps {
  selectedPlanet: PlanetData | null;
  onClose: () => void;
  isPaused: boolean;
  togglePause: () => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  isStarshipActive: boolean;
  toggleStarship: () => void;
  showPluto: boolean;
  togglePluto: () => void;
  isGestureMode: boolean;
  toggleGestureMode: () => void;
  showOrbits: boolean;
  toggleOrbits: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ 
  selectedPlanet, 
  onClose,
  isPaused,
  togglePause,
  simulationSpeed,
  setSimulationSpeed,
  isStarshipActive,
  toggleStarship,
  showPluto,
  togglePluto,
  toggleGestureMode,
  isGestureMode,
  showOrbits,
  toggleOrbits
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

  // Determine if we should show travel time (Not for Earth, Sun, or Moons)
  const MOON_IDS = ['io', 'europa', 'ganymede', 'callisto', 'moon', 'titan', 'enceladus', 'mimas', 'iapetus'];
  const isMoon = selectedPlanet && MOON_IDS.includes(selectedPlanet.id);
  const showTravelTime = selectedPlanet && selectedPlanet.id !== 'earth' && selectedPlanet.id !== 'sun' && !isMoon;
  
  // Determine if we should show Habitat Info (Only for Earth)
  const isEarth = selectedPlanet?.id === 'earth';

  const getPlanetTheme = (planet: PlanetData) => {
    if (planet.id === 'sun') return { icon: '☀️', type: '恒星' };
    if (planet.id === 'earth') return { icon: '🌍', type: '生命家园' };
    if (planet.id === 'pluto') return { icon: '❄️', type: '矮行星' };
    if (MOON_IDS.includes(planet.id)) return { icon: '🌑', type: '卫星' };
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

    /* Rocket Button Style */
    .rocket-btn {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }
    .rocket-btn.inactive { background: rgba(30, 41, 59, 0.8); border-color: rgba(255,255,255,0.1); }
    .rocket-btn .indicator {
       position: absolute; top: 8px; right: 8px;
       width: 6px; height: 6px; border-radius: 50%;
       box-shadow: 0 0 5px currentColor;
    }

    /* Pluto Button Style */
    .pluto-btn {
      background: linear-gradient(135deg, #8b5cf6, #5b21b6);
    }
    .pluto-btn.inactive { background: rgba(30, 41, 59, 0.8); border-color: rgba(255,255,255,0.1); }
    .pluto-btn .indicator {
       position: absolute; top: 8px; right: 8px;
       width: 6px; height: 6px; border-radius: 50%;
       box-shadow: 0 0 5px currentColor;
    }

    /* Orbit Button Style */
    .orbit-btn {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }
    .orbit-btn.inactive { background: rgba(30, 41, 59, 0.8); border-color: rgba(255,255,255,0.1); }
    .orbit-btn .indicator {
       position: absolute; top: 8px; right: 8px;
       width: 6px; height: 6px; border-radius: 50%;
       box-shadow: 0 0 5px currentColor;
    }

    /* Gesture Button Style */
    .gesture-btn {
      background: linear-gradient(135deg, #10b981, #047857);
    }
    .gesture-btn.inactive { background: rgba(30, 41, 59, 0.8); border-color: rgba(255,255,255,0.1); }
    .gesture-btn .indicator {
       position: absolute; top: 8px; right: 8px;
       width: 6px; height: 6px; border-radius: 50%;
       box-shadow: 0 0 5px currentColor;
    }
    
    /* Animation for active gesture mode */
    .gesture-active-pulse {
       animation: pulse-green 2s infinite;
    }
    @keyframes pulse-green {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    /* Space Info Card */
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
        <header className="flex flex-col sm:flex-row justify-between items-start pointer-events-auto w-full gap-4">
          <div className="flex flex-col items-start relative pl-4 pt-4">
            
            {/* Background Decorative HUD Ring */}
            <div className="absolute -left-12 -top-12 text-cyan-500/10 z-0 animate-spin-slow" style={{animationDuration: '60s'}}>
               <svg width="220" height="220" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                 <circle cx="50" cy="50" r="48" strokeDasharray="5 5" />
                 <circle cx="50" cy="50" r="38" opacity="0.3" />
                 <path d="M50 5 L50 15 M50 85 L50 95 M5 50 L15 50 M85 50 L95 50" strokeWidth="2" strokeLinecap="round" />
               </svg>
            </div>

            {/* Title Container */}
            <div className="relative z-10">
               <div className="bg-transparent p-2 sm:p-4 relative overflow-hidden group">
                  
                  {/* Captain Badge - Moved Above Title */}
                  <div className="mb-2 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 animate-fade-in hover:bg-white/20 transition-all w-fit relative z-20">
                    <span className="text-xl filter drop-shadow-sm">👩‍🚀</span>
                    <div className="flex flex-col leading-none">
                        <span className="text-[8px] text-cyan-300 font-mono font-bold tracking-widest uppercase">Captain</span>
                        <span className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">一年3班 小豆子</span>
                    </div>
                  </div>

                  {/* Main Title Text */}
                  <h1 className="text-3xl sm:text-5xl tracking-wider flex items-center gap-3 relative z-20" 
                      style={{ 
                        fontFamily: '"ZCOOL KuaiLe", cursive, sans-serif',
                        textShadow: '0 4px 0 rgba(0,0,0,0.3), 0 0 15px rgba(255,255,255,0.2)' 
                      }}>
                    <span className="bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">漫游</span>
                    <span className="bg-gradient-to-br from-cyan-300 via-blue-500 to-purple-500 bg-clip-text text-transparent filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">太阳系</span>
                  </h1>

               </div>
            </div>

          </div>
          
          {/* Controls - Right Aligned */}
          <div className="flex flex-col items-end gap-4 pt-2 self-end sm:self-auto pointer-events-none">
            
            <div className="flex gap-2 sm:gap-4 pointer-events-auto">
              {/* Interstellar Travel Button */}
              <button
                onClick={toggleStarship}
                title="星际穿越"
                className={`action-btn rocket-btn pointer-events-auto ${!isStarshipActive ? 'inactive' : ''}`}
              >
                <div className={`indicator ${isStarshipActive ? 'bg-green-400 shadow-green-400' : 'bg-red-400'}`}></div>
                <span className="text-xl sm:text-2xl mt-1">🚀</span>
              </button>

              {/* Gesture Toggle Button */}
              <button
                onClick={toggleGestureMode}
                title="手势控制"
                className={`action-btn gesture-btn pointer-events-auto ${!isGestureMode ? 'inactive' : 'gesture-active-pulse'}`}
              >
                <div className={`indicator ${isGestureMode ? 'bg-green-400 shadow-green-400' : 'bg-red-400'}`}></div>
                <span className="text-xl sm:text-2xl mt-1">👋</span>
              </button>

              {/* Pluto Toggle Button */}
              <button
                onClick={togglePluto}
                title="冥王星开关"
                className={`action-btn pluto-btn pointer-events-auto ${!showPluto ? 'inactive' : ''}`}
              >
                <div className={`indicator ${showPluto ? 'bg-green-400 shadow-green-400' : 'bg-red-400'}`}></div>
                <span className="text-xl sm:text-2xl mt-1">❄️</span>
              </button>

              {/* Orbit Toggle Button - Far Right */}
              <button
                onClick={toggleOrbits}
                title="显示/隐藏轨道"
                className={`action-btn orbit-btn pointer-events-auto ${!showOrbits ? 'inactive' : ''}`}
              >
                <div className={`indicator ${showOrbits ? 'bg-green-400 shadow-green-400' : 'bg-red-400'}`}></div>
                <span className="text-xl sm:text-2xl mt-1">💫</span>
              </button>
            </div>

            {/* SPEED CONTROL HUD - SCI-FI TIME ENGINE */}
            {/* Always rendered unless in Starship/Gesture mode */}
            {!isStarshipActive && !isGestureMode && (
              <div className="hidden sm:flex flex-col items-end pointer-events-auto relative mt-2 animate-fade-in">
                  {/* Decorator Line */}
                  <div className="h-4 w-1 bg-cyan-400 absolute -top-2 right-4 rounded-b-sm z-20 shadow-[0_0_8px_#22d3ee]"></div>

                  {/* Fully transparent background container */}
                  <div className="bg-transparent rounded-xl p-1 w-auto relative group">
                      
                      {/* Title Row */}
                      <div className="flex items-center justify-between px-3 py-2 bg-transparent">
                          <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full border-2 border-cyan-400 ${simulationSpeed > 0 ? 'animate-spin' : ''}`} style={{ borderTopColor: 'transparent' }}></div>
                              <span className="text-xs font-bold text-cyan-300 tracking-wider font-mono drop-shadow-sm">TIME ENGINE</span>
                          </div>
                          <span className="text-[10px] font-bold text-cyan-100/70 ml-4 font-mono">时光引擎</span>
                      </div>

                      {/* Content Row */}
                      <div className="p-3 flex items-center gap-4">
                          {/* Play/Pause Button REMOVED */}

                          {/* Big Digital Display */}
                          <div className="flex flex-col items-end min-w-[3.5rem]">
                              <span className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white leading-none drop-shadow-md" style={{ fontFamily: 'monospace' }}>
                                {simulationSpeed}<span className="text-sm text-cyan-400 not-italic ml-0.5">x</span>
                              </span>
                              <span className="text-[9px] text-cyan-300/80 tracking-[0.2em] uppercase mt-1 font-bold">Speed</span>
                          </div>

                          {/* Power Bars (Buttons) */}
                          <div className="flex items-end gap-1.5 h-10 pb-1">
                              {[0, 1, 5, 10, 20].map((speed, idx) => {
                                  const isActive = simulationSpeed === speed;
                                  // Height calculation for "rising" effect
                                  const heightClass = ['h-3', 'h-4', 'h-6', 'h-8', 'h-10'][idx];
                                  const activeColor = speed === 0 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' :
                                                      speed === 20 ? 'bg-purple-500 shadow-[0_0_10px_#a855f7]' : 
                                                      'bg-cyan-400 shadow-[0_0_10px_#22d3ee]';
                                  
                                  return (
                                      <button
                                          key={speed}
                                          onClick={() => setSimulationSpeed(speed)}
                                          className={`w-5 rounded-t-sm transition-all duration-300 relative group/btn ${heightClass}
                                            ${isActive 
                                              ? `${activeColor} z-10 scale-110` 
                                              : 'bg-white/10 hover:bg-white/30 border border-white/5'
                                            }
                                          `}
                                      >
                                          <span className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold font-mono transition-opacity pointer-events-none 
                                              ${isActive ? 'opacity-100 text-white drop-shadow-md' : 'opacity-0 text-cyan-200 group-hover/btn:opacity-100'}`}>
                                            {speed === 0 ? 'STOP' : speed}
                                          </span>
                                      </button>
                                  )
                              })}
                          </div>
                      </div>
                  </div>
              </div>
            )}

          </div>
        </header>

        {/* Planet Info Card (Right Side) - ADDED z-50 HERE */}
        {selectedPlanet && (
          <div className="pointer-events-auto self-end sm:self-auto sm:absolute sm:right-6 sm:top-28 sm:w-[380px] w-full max-h-[calc(100vh-160px)] flex flex-col animate-pop-up z-50">
            
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

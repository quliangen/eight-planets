
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
    @keyframes wiggle {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }
    @keyframes spin-slow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
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
    .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
    .animate-pop-up { animation: pop-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
    
    /* Pikachu Scrollbar */
    .pika-scrollbar::-webkit-scrollbar { width: 10px; }
    .pika-scrollbar::-webkit-scrollbar-track { background: #FFFBEB; border-radius: 5px; border: 2px solid #000; }
    .pika-scrollbar::-webkit-scrollbar-thumb { background: #FACC15; border-radius: 5px; border: 2px solid #000; }
    
    /* Common Button Base */
    .action-btn {
      width: 4rem; height: 4rem; /* w-16 h-16 */
      border: 4px solid #000;
      box-shadow: 4px 4px 0px #000;
      border-radius: 9999px; /* rounded-full */
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      transition: all 0.2s;
      position: relative;
    }
    .action-btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px #000; }

    /* Pokéball Button */
    .pokeball {
      background: linear-gradient(to bottom, #EF4444 48%, #000 48%, #000 52%, #FFFFFF 52%);
    }
    .pokeball::after {
      content: '';
      position: absolute;
      top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 20px; height: 20px; background: #FFFFFF;
      border: 3px solid #000; border-radius: 50%;
      box-shadow: inset 2px 2px 5px rgba(0,0,0,0.1);
    }
    .pokeball.paused { filter: grayscale(0.8); }
    .pokeball.spinning::after { background: #EF4444; }

    /* Comic Style */
    .comic-border { border: 4px solid #000; box-shadow: 4px 4px 0px #000; }
    /* Adjusted stroke for smaller text size */
    .comic-text-stroke { -webkit-text-stroke: 1px #000; text-shadow: 1px 1px 0 #000; }
    
    /* Rocket Button Style */
    .rocket-btn {
      background: linear-gradient(135deg, #3B82F6, #60A5FA);
    }
    .rocket-btn.inactive { filter: grayscale(1); background: #94A3B8; }
    .rocket-btn .indicator {
       position: absolute; top: 8px; right: 8px;
       width: 12px; height: 12px; border: 2px solid #000; border-radius: 50%;
    }

    /* Pluto Button Style */
    .pluto-btn {
      background: linear-gradient(135deg, #A5B4FC, #6366F1);
    }
    .pluto-btn.inactive { filter: grayscale(1); background: #94A3B8; }
    .pluto-btn .indicator {
       position: absolute; top: 8px; right: 8px;
       width: 12px; height: 12px; border: 2px solid #000; border-radius: 50%;
    }

    /* Gesture Button Style */
    .gesture-btn {
      background: linear-gradient(135deg, #34D399, #10B981);
    }
    .gesture-btn.inactive { filter: grayscale(1); background: #94A3B8; }
    .gesture-btn .indicator {
       position: absolute; top: 8px; right: 8px;
       width: 12px; height: 12px; border: 2px solid #000; border-radius: 50%;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 z-10 font-sans">
        
        {/* Header Section */}
        <header className="flex justify-between items-start pointer-events-auto w-full max-w-5xl mx-auto sm:mx-0">
          <div className="flex flex-col items-start gap-2 relative">
            <div className="absolute -left-6 -top-6 text-yellow-400 opacity-80 z-0 animate-pulse">
               <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            </div>
            <div className="bg-white comic-border px-4 py-2 rounded-full z-10 animate-wiggle origin-bottom-left flex items-center gap-2">
              <span className="text-red-500 font-black text-lg">⚡️ Pika!</span>
              <span className="text-black font-bold text-sm">给：一年3班 小豆子</span>
            </div>
            <div className="flex flex-col z-10 ml-2">
              {/* Reduced background intensity (opacity 50%) and smaller text size (text-xl/3xl) */}
              <div className="bg-yellow-400/50 backdrop-blur-md comic-border px-6 py-3 rounded-2xl transform -rotate-1 shadow-[8px_8px_0px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-2 mb-1">
                   <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-black"></div>
                   <span className="text-[10px] font-black text-black tracking-widest uppercase">Pokemon Explorer Mode</span>
                   <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-black"></div>
                </div>
                <h1 className="text-xl sm:text-3xl font-black text-yellow-100 italic tracking-wider comic-text-stroke">
                  太阳和它的朋友们
                </h1>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 pt-2">
            {/* Pause Button (Pokeball) */}
            <button 
              onClick={togglePause}
              className={`action-btn pokeball pointer-events-auto ${!isPaused ? 'spinning' : 'paused'}`}
              title={isPaused ? "Go! (继续)" : "Wait! (暂停)"}
              style={{ animation: !isPaused ? 'spin-slow 10s linear infinite' : 'none' }}
            >
            </button>

            {/* Interstellar Travel Button (Circular) */}
            <button
              onClick={toggleStarship}
              title="Toggle Starship"
              className={`action-btn rocket-btn pointer-events-auto ${!isStarshipActive ? 'inactive' : ''}`}
            >
              <div className={`indicator ${isStarshipActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-2xl mt-1">🚀</span>
            </button>

            {/* Gesture Toggle Button */}
            <button
              onClick={toggleGestureMode}
              title="手势控制"
              className={`action-btn gesture-btn pointer-events-auto ${!isGestureMode ? 'inactive' : ''}`}
            >
              <div className={`indicator ${isGestureMode ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-2xl mt-1">👋</span>
            </button>

            {/* Pluto Toggle Button */}
            <button
              onClick={togglePluto}
              title="Toggle Pluto"
              className={`action-btn pluto-btn pointer-events-auto ${!showPluto ? 'inactive' : ''}`}
            >
              <div className={`indicator ${showPluto ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-2xl mt-1">❄️</span>
            </button>
          </div>
        </header>

        {/* Planet Info Card */}
        {selectedPlanet && (
          <div className="pointer-events-auto self-end sm:self-auto sm:absolute sm:right-6 sm:top-28 sm:w-[380px] w-full max-h-[calc(100vh-160px)] flex flex-col animate-pop-up">
            
            <div className="bg-yellow-400 comic-border rounded-3xl p-2 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 text-yellow-200 opacity-50 pointer-events-none">
                 <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
              </div>

              <div className="bg-slate-800 rounded-2xl border-4 border-black p-4 h-full flex flex-col relative overflow-hidden">
                <button 
                  onClick={onClose} 
                  className="absolute top-3 right-3 z-20 w-8 h-8 bg-red-500 border-2 border-black rounded flex items-center justify-center hover:bg-red-400 active:scale-95 text-white font-bold"
                >
                  ✕
                </button>

                <div className="flex items-center gap-3 mb-4 z-10">
                   <div className={`w-14 h-14 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-3xl`}>
                     {getPlanetTheme(selectedPlanet).icon}
                   </div>
                   <div>
                     <div className="text-yellow-400 text-xs font-bold tracking-widest mb-1">
                       发现野生星球！
                     </div>
                     <h2 className="text-3xl font-black text-white italic tracking-wide">
                       {selectedPlanet.name.split(' ')[0]}
                     </h2>
                     <div className="flex gap-2 mt-1">
                        <span className="bg-white text-black px-2 py-0.5 text-[10px] font-bold rounded border border-black uppercase">
                          {getPlanetTheme(selectedPlanet).type}
                        </span>
                     </div>
                   </div>
                </div>

                <div className="flex-grow overflow-y-auto pr-2 pika-scrollbar space-y-4">
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-100 border-2 border-black rounded-lg p-2 flex flex-col items-center">
                       <span className="text-[10px] font-bold text-green-800 uppercase">平均温度</span>
                       <span className="text-sm font-black text-black">{selectedPlanet.temperature || "未知"}</span>
                    </div>
                    <div className="bg-blue-100 border-2 border-black rounded-lg p-2 flex flex-col items-center">
                       <span className="text-[10px] font-bold text-blue-800 uppercase">主要成分</span>
                       <span className="text-sm font-black text-black text-center leading-tight">{selectedPlanet.composition || "岩石/气体"}</span>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-black rounded-lg p-3 relative mt-2">
                    <div className="absolute -top-2 -left-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 border border-black rounded rotate-[-2deg]">
                      图鉴介绍
                    </div>
                    <p className="text-black font-bold text-sm leading-relaxed mt-1">
                      {selectedPlanet.description}
                    </p>
                    {selectedPlanet.funFact && (
                      <div className="mt-2 pt-2 border-t-2 border-dashed border-gray-300">
                        <span className="text-red-500 font-black text-xs mr-1">💡 知识点:</span>
                        <span className="text-gray-700 text-xs font-bold">{selectedPlanet.funFact}</span>
                      </div>
                    )}
                  </div>

                  {/* Travel Stats (Hide for Earth/Sun) */}
                  {showTravelTime && travelInfo && (
                    <div className="bg-black/40 rounded-lg p-3 border-2 border-white/20">
                       <h3 className="text-yellow-400 text-xs font-black uppercase mb-3 flex items-center">
                         <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"></path></svg>
                         旅行时间计算
                       </h3>
                       <div className="space-y-3">
                          <div className="flex items-center gap-2">
                             <span className="text-xs font-bold text-white w-12 text-right">光速</span>
                             <div className="flex-grow h-3 bg-gray-700 rounded-full border border-gray-600 overflow-hidden relative"><div className="absolute top-0 left-0 h-full bg-yellow-400 w-full animate-pulse"></div></div>
                             <span className="text-xs font-bold text-yellow-400 w-16 text-right">{travelInfo.lightMinutes} 分</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-xs font-bold text-white w-12 text-right">火箭</span>
                             <div className="flex-grow h-3 bg-gray-700 rounded-full border border-gray-600 overflow-hidden relative"><div className="absolute top-0 left-0 h-full bg-red-500 w-[70%]"></div></div>
                             <span className="text-xs font-bold text-red-400 w-16 text-right">{travelInfo.rocketTimeDisplay}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-xs font-bold text-white w-12 text-right">飞机</span>
                             <div className="flex-grow h-3 bg-gray-700 rounded-full border border-gray-600 overflow-hidden relative"><div className="absolute top-0 left-0 h-full bg-blue-500 w-[20%]"></div></div>
                             <span className="text-xs font-bold text-blue-400 w-16 text-right">{travelInfo.planeYears} 年</span>
                          </div>
                       </div>
                    </div>
                  )}

                  {/* Earth Habitat Info */}
                  {isEarth && (
                     <div className="bg-blue-500/20 rounded-lg p-3 border-2 border-blue-400">
                        <h3 className="text-cyan-300 text-xs font-black uppercase mb-2 flex items-center">
                           💧 生命之源
                        </h3>
                        <p className="text-white text-xs font-bold leading-relaxed">
                           地球表面 71% 是海洋，只有 29% 是陆地。我们有厚厚的大气层，像被子一样挡住太阳的紫外线，还锁住空气和水，让我们能自由呼吸！
                        </p>
                     </div>
                  )}

                </div>
                
                <div className="h-4 flex justify-between items-center mt-2 px-1">
                   <div className="flex gap-1">
                     <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce"></div>
                     <div className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce delay-75"></div>
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce delay-150"></div>
                   </div>
                   <div className="text-[9px] text-gray-400 font-mono">Ver 2.3 Gesture Fix</div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

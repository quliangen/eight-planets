
import React, { useState, useEffect, useRef } from 'react';
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
  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // 1. Initialize Voices (Wait for browser to load them)
  useEffect(() => {
    const loadVoices = () => {
        const voices = synthRef.current.getVoices();
        setAvailableVoices(voices);
    };

    loadVoices();
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Stop speech when planet changes or panel closes
  useEffect(() => {
    const stopSpeaking = () => {
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
    };

    stopSpeaking(); // Cancel any previous speech immediately on mount/change

    return () => {
      stopSpeaking(); // Cleanup on unmount
    };
  }, [selectedPlanet]);

  // Helper: Find the best "TV Host" like voice
  const getBestVoice = () => {
      const zhVoices = availableVoices.filter(v => v.lang.includes('zh') || v.lang.includes('CN'));
      
      // Priority 1: Edge's "Xiaoxiao" (Natural/Neural) - Extremely human-like
      const xiaoxiao = zhVoices.find(v => v.name.includes('Xiaoxiao') || v.name.includes('Natural'));
      if (xiaoxiao) return xiaoxiao;

      // Priority 2: Google's Online Voice (Chrome) - Smooth
      const google = zhVoices.find(v => v.name.includes('Google'));
      if (google) return google;

      // Priority 3: Apple's Tingting or similar (High quality local)
      const apple = zhVoices.find(v => v.name.includes('Tingting'));
      if (apple) return apple;

      // Fallback
      return zhVoices[0] || null;
  };

  // Handle Speech Toggle
  const toggleSpeech = () => {
    if (!selectedPlanet) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    } else {
      // 1. Construct "TV Host" Script
      const planetName = selectedPlanet.name.split(' ')[0];
      
      // Add "Host-like" interjections and flow
      // intro: Friendly greeting
      const intro = `嗨！小朋友，你好呀！欢迎来到${planetName}。我是你们的导游。`;
      
      // desc: The main content
      const desc = selectedPlanet.description; 
      
      // funFact: Add specific transition hook
      const funFact = selectedPlanet.funFact 
        ? `哇，还有一个神奇的小秘密要告诉你：${selectedPlanet.funFact}` 
        : '';
      
      // outro: Interactive closing
      const outro = "怎么样？宇宙是不是超级有趣呢？";

      const fullText = `${intro} ${desc} ${funFact} ${outro}`;

      // 2. Create Utterance
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = 'zh-CN';
      
      // 3. Tweak Voice Properties for "Host" Persona
      const bestVoice = getBestVoice();
      if (bestVoice) {
          utterance.voice = bestVoice;
      }

      // Tuned for "Warm & Friendly" (亲和力)
      // Rate: 0.9 (Clear, enunciated, storytelling pace)
      // Pitch: 1.1 (Slightly lifted, energetic but not squeaky)
      utterance.rate = 0.9; 
      utterance.pitch = 1.1; 
      utterance.volume = 1.0;

      // 4. Handle Events
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      // 5. Speak
      synthRef.current.speak(utterance);
      setIsSpeaking(true);
    }
  };

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
    if (planet.id === 'tiangong') return { icon: '🛰️', type: '空间站' };
    if (MOON_IDS.includes(planet.id)) return { icon: '🌑', type: '卫星' };
    if (planet.realDistance < 200) return { icon: '🪨', type: '岩石系' }; 
    if (planet.hasRings) return { icon: '🪐', type: '飞行系' };
    if (planet.realDistance > 2000) return { icon: '🧊', type: '冰系' };
    return { icon: '🎈', type: '气体系' };
  };

  const getDistanceFromEarth = (planet: PlanetData) => {
    if (planet.id === 'earth') return '0';
    if (planet.id === 'moon') return '38 万公里';
    if (planet.id === 'tiangong') return '400 公里';
    if (planet.id === 'sun') return '1.5 亿公里';
    
    // Crude approx for other planets based on average orbital distance difference
    // Earth is at 150 million km
    const diff = Math.abs(planet.realDistance - 150);
    return `${Math.round(diff * 100) / 100} 亿公里`;
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
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 z-10 font-sans select-none">
        
        {/* Header Section */}
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
                  <div className="mb-2 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 animate-fade-in hover:bg-white/20 transition-all w-fit relative z-20">
                    <span className="text-xl filter drop-shadow-sm">👩‍🚀</span>
                    <div className="flex flex-col leading-none">
                        <span className="text-[8px] text-cyan-300 font-mono font-bold tracking-widest uppercase">Captain</span>
                        <span className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">一年3班 小豆子</span>
                    </div>
                  </div>

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
              <button onClick={toggleStarship} title="星际穿越" className={`action-btn rocket-btn pointer-events-auto ${!isStarshipActive ? 'inactive' : ''}`}>
                <div className={`indicator ${isStarshipActive ? 'bg-green-400 shadow-green-400' : 'bg-red-400'}`}></div>
                <span className="text-xl sm:text-2xl mt-1">🚀</span>
              </button>
              <button onClick={toggleGestureMode} title="手势控制" className={`action-btn gesture-btn pointer-events-auto ${!isGestureMode ? 'inactive' : 'gesture-active-pulse'}`}>
                <div className={`indicator ${isGestureMode ? 'bg-green-400 shadow-green-400' : 'bg-red-400'}`}></div>
                <span className="text-xl sm:text-2xl mt-1">👋</span>
              </button>
              <button onClick={togglePluto} title="冥王星开关" className={`action-btn pluto-btn pointer-events-auto ${!showPluto ? 'inactive' : ''}`}>
                <div className={`indicator ${showPluto ? 'bg-green-400 shadow-green-400' : 'bg-red-400'}`}></div>
                <span className="text-xl sm:text-2xl mt-1">❄️</span>
              </button>
              <button onClick={toggleOrbits} title="显示/隐藏轨道" className={`action-btn orbit-btn pointer-events-auto ${!showOrbits ? 'inactive' : ''}`}>
                <div className={`indicator ${showOrbits ? 'bg-green-400 shadow-green-400' : 'bg-red-400'}`}></div>
                <span className="text-xl sm:text-2xl mt-1">💫</span>
              </button>
            </div>

            {!isStarshipActive && !isGestureMode && (
              <div className="hidden sm:flex flex-col items-end pointer-events-auto relative mt-2 animate-fade-in">
                  <div className="h-4 w-1 bg-cyan-400 absolute -top-2 right-4 rounded-b-sm z-20 shadow-[0_0_8px_#22d3ee]"></div>
                  <div className="bg-transparent rounded-xl p-1 w-auto relative group">
                      <div className="flex items-center justify-between px-3 py-2 bg-transparent">
                          <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full border-2 border-cyan-400 ${simulationSpeed > 0 ? 'animate-spin' : ''}`} style={{ borderTopColor: 'transparent' }}></div>
                              <span className="text-xs font-bold text-cyan-300 tracking-wider font-mono drop-shadow-sm">TIME ENGINE</span>
                          </div>
                          <span className="text-[10px] font-bold text-cyan-100/70 ml-4 font-mono">时光引擎</span>
                      </div>
                      <div className="p-3 flex items-center gap-4">
                          <div className="flex flex-col items-end min-w-[3.5rem]">
                              <span className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white leading-none drop-shadow-md" style={{ fontFamily: 'monospace' }}>
                                {simulationSpeed}<span className="text-sm text-cyan-400 not-italic ml-0.5">x</span>
                              </span>
                              <span className="text-[9px] text-cyan-300/80 tracking-[0.2em] uppercase mt-1 font-bold">Speed</span>
                          </div>
                          <div className="flex items-end gap-1.5 h-10 pb-1">
                              {[0, 1, 5, 10, 20].map((speed, idx) => {
                                  const isActive = simulationSpeed === speed;
                                  const heightClass = ['h-3', 'h-4', 'h-6', 'h-8', 'h-10'][idx];
                                  const activeColor = speed === 0 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' :
                                                      speed === 20 ? 'bg-purple-500 shadow-[0_0_10px_#a855f7]' : 
                                                      'bg-cyan-400 shadow-[0_0_10px_#22d3ee]';
                                  return (
                                      <button key={speed} onClick={() => setSimulationSpeed(speed)}
                                          className={`w-5 rounded-t-sm transition-all duration-300 relative group/btn ${heightClass} ${isActive ? `${activeColor} z-10 scale-110` : 'bg-white/10 hover:bg-white/30 border border-white/5'}`}
                                      >
                                          <span className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold font-mono transition-opacity pointer-events-none ${isActive ? 'opacity-100 text-white drop-shadow-md' : 'opacity-0 text-cyan-200 group-hover/btn:opacity-100'}`}>
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

        {/* Planet Info Card (Right Side) */}
        {selectedPlanet && (
          <div className="pointer-events-auto self-end sm:self-auto sm:absolute sm:right-6 sm:top-28 sm:w-[380px] w-full max-h-[calc(100vh-160px)] flex flex-col animate-pop-up z-50">
            
            <div className="bg-slate-900/90 space-card-border rounded-3xl p-1 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                 <svg width="80" height="80" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              </div>

              <div className="bg-black/40 rounded-2xl border border-white/10 p-4 h-full flex flex-col relative overflow-hidden">
                <button onClick={onClose} className="absolute top-3 right-3 z-20 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center active:scale-95 text-white font-bold backdrop-blur-sm transition-colors">✕</button>

                {/* Voice Playback Button */}
                <button 
                  onClick={toggleSpeech}
                  className={`absolute top-3 right-14 z-20 h-8 px-3 rounded-full flex items-center justify-center active:scale-95 text-white font-bold backdrop-blur-sm transition-all border border-white/20
                    ${isSpeaking ? 'bg-cyan-500 animate-talking shadow-[0_0_15px_#06b6d4]' : 'bg-white/10 hover:bg-white/20'}
                  `}
                >
                   <span className="mr-1">{isSpeaking ? '🔊' : '🔈'}</span>
                   <span className="text-xs">{isSpeaking ? '讲解中...' : '听讲解'}</span>
                </button>

                <div className="flex items-center gap-3 mb-4 z-10">
                   <div className={`w-14 h-14 rounded-full border-2 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-3xl`}>
                     {getPlanetTheme(selectedPlanet).icon}
                   </div>
                   <div>
                     <div className="text-cyan-400 text-[10px] font-mono tracking-widest uppercase mb-1">New Discovery</div>
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
                  
                  {/* Stats Grid */}
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

                  {/* Distance From Earth (New) */}
                  <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-3 flex justify-between items-center">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">距离地球</span>
                        <span className="text-lg text-white font-mono font-bold leading-none mt-1">
                           {getDistanceFromEarth(selectedPlanet)}
                        </span>
                     </div>
                     <span className="text-2xl opacity-50">📏</span>
                  </div>

                  {/* Description */}
                  <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-3 relative mt-2">
                    <div className="absolute -top-2 -left-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded rotate-0 shadow-lg">DATA LOG</div>
                    <p className="text-gray-200 font-medium text-sm leading-relaxed mt-2">{selectedPlanet.description}</p>
                    {selectedPlanet.funFact && (
                      <div className="mt-3 pt-2 border-t border-white/10 border-dashed">
                        <span className="text-yellow-400 font-bold text-xs mr-2">⚠ 趣闻:</span>
                        <span className="text-gray-300 text-xs">{selectedPlanet.funFact}</span>
                      </div>
                    )}
                  </div>

                  {/* Travel Time */}
                  {showTravelTime && travelInfo && (
                    <div className="bg-black/40 rounded-lg p-3 border border-white/10">
                       <h3 className="text-cyan-400 text-xs font-bold uppercase mb-3 flex items-center gap-1"><span className="w-1 h-3 bg-cyan-400 rounded-full"></span>旅行时间估算</h3>
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
                        <h3 className="text-emerald-400 text-xs font-bold uppercase mb-2 flex items-center">💧 生命维持系统</h3>
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
                   <div className="text-[9px] text-cyan-700 font-mono tracking-wider">SYS.VER 3.1</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

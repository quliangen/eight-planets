import React from 'react';

/**
 * 星球/天体名牌（Planet/Sun 共用）。
 * 解析 "中文名 (English Name)" 格式，渲染为中英双语的扫描样式标签。
 */
const TechLabel: React.FC<{ name: string; color: string }> = ({ name, color }) => {
  const match = name.match(/^(.+?)\s*\((.+?)\)$/);
  const cnName = match ? match[1] : name;
  const enNameRaw = match ? match[2] : '';
  const enName = enNameRaw.replace(/\s+/g, '');

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none w-max">
       <div
         className="mb-1 px-5 py-2 flex flex-row items-baseline gap-3
                    bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm rounded-sm border-b-2
                    transform transition-all duration-300 animate-fade-in-up"
         style={{
            borderColor: color,
            textShadow: `0 0 10px ${color}80`
         }}
       >
          <span className="text-white font-bold text-2xl tracking-widest drop-shadow-md font-sans">
            {cnName}
          </span>
          {enName && (
             <span className="text-xs font-mono font-medium tracking-[0.15em] text-cyan-200/80 uppercase">
                {enName}
             </span>
          )}
       </div>

       <div className="flex flex-col items-center relative">
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/40 to-transparent"></div>
          <div className="absolute bottom-0 w-6 h-6 flex items-center justify-center translate-y-1/2">
             <div className="absolute w-full h-full border border-white/20 rounded-full animate-[spin_4s_linear_infinite]"></div>
             <div className="absolute w-[70%] h-[70%] border-l border-r border-white/50 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
             <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]"></div>
          </div>
       </div>
    </div>
  );
};

export default TechLabel;

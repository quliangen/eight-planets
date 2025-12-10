
import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';

interface GestureControllerProps {
  onControl: (dx: number, dy: number, gestureType: 'rotate' | 'zoom') => void;
  onClose: () => void;
  isARMode: boolean;
  toggleARMode: () => void;
}

export const GestureController: React.FC<GestureControllerProps> = ({ 
  onControl, 
  onClose,
  isARMode,
  toggleARMode
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number>(0);
  
  // State for zoom logic
  const prevHandDistanceRef = useRef<number | null>(null);
  
  // UI State
  const [statusMessage, setStatusMessage] = useState<string>("启动魔法手势...");

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
        );
        
        if (!isMounted) return;

        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
        
        if (isMounted) startWebcam();
      } catch (error) {
        console.error("Error initializing MediaPipe:", error);
        if (isMounted) {
          setLoading(false);
          setStatusMessage("初始化失败");
        }
      }
    };

    init();

    return () => {
      isMounted = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(t => t.stop());
      }
    };
  }, []);

  const startWebcam = async () => {
    // Video element is now always rendered, so videoRef.current should be available
    if (!videoRef.current) {
        console.error("Video element not found");
        return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user" 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Event listener is handled via onLoadedData in JSX to ensure it fires
      }
      
      setLoading(false);
      setStatusMessage("准备好了！");
    } catch (err) {
      console.error("Webcam error:", err);
      setPermissionError(true);
      setLoading(false);
      setStatusMessage("无法打开摄像头");
    }
  };

  const predictWebcam = () => {
    if (!landmarkerRef.current || !videoRef.current) return;
    
    // Check if video is ready
    if (videoRef.current.readyState < 2) {
        requestRef.current = requestAnimationFrame(predictWebcam);
        return;
    }

    const startTimeMs = performance.now();
    const result = landmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);

    processGestures(result);
    // Only draw if canvas exists (it's hidden by default now)
    if (canvasRef.current) {
        draw(result);
    }

    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  const processGestures = (result: HandLandmarkerResult) => {
    const hands = result.landmarks;

    if (!hands || hands.length === 0) {
      onControl(0, 0, 'rotate');
      prevHandDistanceRef.current = null;
      setStatusMessage("挥挥手开始控制");
      return;
    }

    // --- TWO HANDS MODE (ZOOM) ---
    if (hands.length === 2) {
      // Use palm center (index 0 - wrist or 9 - middle knuckle) for stability
      const h1 = hands[0][9]; 
      const h2 = hands[1][9];
      const dist = Math.hypot(h1.x - h2.x, h1.y - h2.y);
      
      if (prevHandDistanceRef.current !== null) {
        // Calculate change in distance
        const delta = dist - prevHandDistanceRef.current;
        
        // Threshold to ignore micro-jitters
        if (Math.abs(delta) > 0.002) {
           // Pass delta directly. Positive = Spreading. Negative = Pinching.
           // Multiplier 300 makes the value useful for camera dolly speed
           onControl(0, delta * 300, 'zoom'); 
           
           if (delta > 0) setStatusMessage("🔍 放大 (拉近视角)");
           else setStatusMessage("🔭 缩小 (拉远视角)");
        } else {
           onControl(0, 0, 'zoom');
           setStatusMessage("✋ 双手保持距离");
        }
      }
      prevHandDistanceRef.current = dist;
      return;
    }

    // --- ONE HAND MODE (ROTATE) ---
    if (hands.length === 1) {
      prevHandDistanceRef.current = null;
      const hand = hands[0];
      const cursor = hand[9]; // Middle finger knuckle (more stable than tip)
      
      // X coordinates are 0-1. Mirroring is handled by CSS scale-x, but for logic:
      // MediaPipe coords: 0 is Left, 1 is Right (relative to camera feed)
      // If we mirror the video visually, we need to match that logic.
      // Let's assume standard: Move hand Right -> Rotate Right.
      
      const x = 1.0 - cursor.x; // Mirroring logic (0 becomes 1)
      const y = cursor.y; // 0 is Top, 1 is Bottom
      
      let dx = 0;
      let dy = 0;
      const DEADZONE = 0.15; // Slightly tighter deadzone
      const CENTER = 0.5;
      
      // Horizontal Control
      if (Math.abs(x - CENTER) > DEADZONE) {
         dx = (x - CENTER) * 2.0; 
      }
      
      // Vertical Control
      if (Math.abs(y - CENTER) > DEADZONE) {
         dy = (y - CENTER) * 2.0;
      }
      
      if (dx !== 0 || dy !== 0) {
        onControl(dx, dy, 'rotate');
        
        // Dynamic Status Message
        if (Math.abs(dx) > Math.abs(dy)) {
            setStatusMessage(dx > 0 ? "👉 向右旋转" : "👈 向左旋转");
        } else {
            setStatusMessage(dy > 0 ? "👇 向上看 (相机上移)" : "👆 向下看 (相机下移)");
        }
      } else {
        onControl(0, 0, 'rotate');
        setStatusMessage("✋ 居中暂停");
      }
    }
  };

  const draw = (result: HandLandmarkerResult) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Video Feed manually if in Mini Mode (since video element is hidden)
    if (!isARMode && videoRef.current) {
        ctx.save();
        ctx.scale(-1, 1); // Mirror draw
        ctx.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();
        
        // Draw dark overlay for better UI contrast
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Guide Box (Center Safe Zone)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        // Draw deadzone box relative to center
        const deadzoneSize = 0.3; // 30% of screen
        const x = canvas.width * (0.5 - deadzoneSize/2);
        const y = canvas.height * (0.5 - deadzoneSize/2);
        const w = canvas.width * deadzoneSize;
        const h = canvas.height * deadzoneSize;
        ctx.strokeRect(x, y, w, h);
        ctx.setLineDash([]);
    }

    // Draw Hands
    if (result.landmarks) {
      for (const landmarks of result.landmarks) {
        const connections = HandLandmarker.HAND_CONNECTIONS;
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 3;
        
        for (const conn of connections) {
          const start = landmarks[conn.start];
          const end = landmarks[conn.end];
          ctx.beginPath();
          ctx.moveTo((1 - start.x) * canvas.width, start.y * canvas.height);
          ctx.lineTo((1 - end.x) * canvas.width, end.y * canvas.height);
          ctx.stroke();
        }

        ctx.fillStyle = "#ff00ff";
        for (const lm of landmarks) {
           ctx.beginPath();
           ctx.arc((1 - lm.x) * canvas.width, lm.y * canvas.height, 4, 0, 2 * Math.PI);
           ctx.fill();
        }
        
        // Draw Palm Center for debug visualization
        const palmCenter = landmarks[9];
        ctx.fillStyle = "#ffff00";
        ctx.beginPath();
        ctx.arc((1 - palmCenter.x) * canvas.width, palmCenter.y * canvas.height, 8, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  return (
    <>
      {/* 
         ALWAYS RENDERED VIDEO 
         Used for processing and AR background. 
         Hidden when not in AR mode, but still active for canvas drawing.
      */}
      <video 
        ref={videoRef} 
        className={`fixed inset-0 w-full h-full object-cover -scale-x-100 transition-opacity duration-300
          ${isARMode ? 'z-[-10] opacity-100' : 'z-[-20] opacity-0 pointer-events-none'}
        `}
        autoPlay 
        playsInline 
        muted
        onLoadedData={() => {
            // Start the loop once data is loaded
            predictWebcam();
        }}
      />

      {/* AR Mode Overlay Background - Darken the video feed with Blue Tint 0.4 */}
      {isARMode && (
         <div className="fixed inset-0 w-full h-full bg-blue-950/40 z-[-9] pointer-events-none transition-colors duration-500" />
      )}

      {/* Helper Canvas for drawing feedback (Used in both modes potentially, but mainly mini mode) */}
      <canvas 
        ref={canvasRef}
        width={320}
        height={240}
        className={`fixed bottom-20 right-4 w-40 h-32 rounded-lg border-2 border-white/20 shadow-lg z-50 bg-black/50 pointer-events-none transition-opacity duration-300
           ${isARMode ? 'opacity-0' : 'opacity-100'}
        `}
      />

      <div className="absolute bottom-4 right-4 z-50 flex flex-col items-end gap-3 pointer-events-auto animate-fade-in">
        
        {/* Status Bubble */}
        <div className="bg-slate-900/80 backdrop-blur border border-cyan-500/30 text-cyan-300 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
           <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400' : 'bg-green-400'} animate-pulse`}></span>
           {statusMessage}
        </div>

        {/* Error Message Display */}
        {permissionError && (
           <div className="bg-red-500/80 text-white px-4 py-2 rounded-lg text-sm max-w-[200px]">
              请允许浏览器访问摄像头以使用手势功能。
           </div>
        )}

        <div className="flex items-center gap-3">
           <button 
             onClick={toggleARMode}
             disabled={loading || permissionError}
             className={`h-12 px-5 rounded-full font-bold text-sm shadow-lg border-2 transition-all flex items-center gap-2
               ${isARMode 
                 ? 'bg-cyan-500 text-black border-cyan-200 shadow-[0_0_15px_#22d3ee]' 
                 : 'bg-slate-800 text-white border-slate-600 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
               }`}
           >
             <span>{isARMode ? "📺 关闭画面" : "📹 显示画面 (AR)"}</span>
           </button>

           <button 
              onClick={onClose}
              className="w-12 h-12 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 active:scale-95 transition-all"
           >
              ✕
           </button>
        </div>
      </div>
    </>
  );
};


import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';

interface GestureControllerProps {
  onControl: (dx: number, dy: number, gestureType: 'rotate' | 'zoom') => void;
  onClose: () => void;
}

export const GestureController: React.FC<GestureControllerProps> = ({ onControl, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Default to hidden (stealth mode)
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number>(0);

  // Initialize MediaPipe HandLandmarker
  useEffect(() => {
    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
        );
        
        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        
        startWebcam();
      } catch (error) {
        console.error("Error initializing MediaPipe:", error);
        setLoading(false);
      }
    };
    init();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(t => t.stop());
      }
    };
  }, []);

  const startWebcam = async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      videoRef.current.srcObject = stream;
      videoRef.current.addEventListener('loadeddata', predictWebcam);
      setLoading(false);
    } catch (err) {
      console.error("Webcam error:", err);
      setPermissionError(true);
      setLoading(false);
    }
  };

  const predictWebcam = () => {
    if (!landmarkerRef.current || !videoRef.current || !canvasRef.current) return;
    
    // Safety check for video readiness
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
        requestRef.current = requestAnimationFrame(predictWebcam);
        return;
    }

    const startTimeMs = performance.now();
    const result = landmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);

    // Determine gesture state
    let isPinching = false;
    if (result.landmarks && result.landmarks.length > 0) {
        const landmarks = result.landmarks[0];
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const distance = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
        // Threshold for pinch (OK gesture)
        if (distance < 0.06) {
            isPinching = true;
        }
    }

    draw(result, isPinching);
    processGestures(result, isPinching);

    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  const processGestures = (result: HandLandmarkerResult, isPinching: boolean) => {
    if (result.landmarks && result.landmarks.length > 0) {
      // Get the first hand
      const landmarks = result.landmarks[0];
      
      // Use Index Finger Tip (8) for position tracking
      // If pinching, we can still use index tip as the cursor position
      const cursor = landmarks[8];
      
      const x = cursor.x; // 0 (Left) -> 1 (Right)
      const y = cursor.y; // 0 (Top) -> 1 (Bottom)

      let dx = 0;
      let dy = 0;

      // Deadzone logic (Center 30% is safe)
      const DEADZONE = 0.15;
      const CENTER_X = 0.5;
      const CENTER_Y = 0.5;

      // --- X Control (Rotation / Pan) ---
      // We want: Hand Left -> Map Left.
      // Hand Left (x small) -> dx negative.
      if (x < CENTER_X - DEADZONE) {
        // x is 0.2, center is 0.5. dx should be negative.
        // (0.2 - 0.35) = -0.15. 
        dx = (x - (CENTER_X - DEADZONE)) * 4; 
      } else if (x > CENTER_X + DEADZONE) {
        // x is 0.8, center is 0.5. dx should be positive.
        // (0.8 - 0.65) = 0.15.
        dx = (x - (CENTER_X + DEADZONE)) * 4;
      }

      // --- Y Control (Tilt / Zoom) ---
      // Hand Up (y small) -> dy negative.
      // Hand Down (y large) -> dy positive.
      if (y < CENTER_Y - DEADZONE) {
         dy = (y - (CENTER_Y - DEADZONE)) * 2; 
      } else if (y > CENTER_Y + DEADZONE) {
         dy = (y - (CENTER_Y + DEADZONE)) * 2;
      }

      onControl(dx, dy, isPinching ? 'zoom' : 'rotate');
    } else {
        // No hand -> No movement
        onControl(0, 0, 'rotate');
    }
  };

  const draw = (result: HandLandmarkerResult, isPinching: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Guide Box
    const w = canvas.width;
    const h = canvas.height;
    const zoneW = w * 0.3;
    const zoneH = h * 0.3;
    const zoneX = (w - zoneW) / 2;
    const zoneY = (h - zoneH) / 2;

    ctx.strokeStyle = isPinching ? 'rgba(0, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = isPinching ? 3 : 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(zoneX, zoneY, zoneW, zoneH);
    ctx.setLineDash([]);
    
    // Center Crosshair
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(w/2 - 1, h/2 - 5, 2, 10);
    ctx.fillRect(w/2 - 5, h/2 - 1, 10, 2);

    if (isPinching) {
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "#00FFFF";
        ctx.fillText("ZOOM MODE", 10, 20);
    }

    if (result.landmarks) {
      for (const landmarks of result.landmarks) {
        drawConnectors(ctx, landmarks, HandLandmarker.HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 3 });
        drawLandmarks(ctx, landmarks, { color: "#FF0000", lineWidth: 2, radius: 4 });
        
        // Connect Thumb and Index specifically
        const thumb = landmarks[4];
        const index = landmarks[8];
        
        ctx.beginPath();
        ctx.moveTo(thumb.x * w, thumb.y * h);
        ctx.lineTo(index.x * w, index.y * h);
        ctx.strokeStyle = isPinching ? "#FFFF00" : "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = isPinching ? 4 : 1;
        ctx.stroke();

        // Highlight Cursor (Index Tip)
        ctx.beginPath();
        ctx.arc(index.x * w, index.y * h, isPinching ? 10 : 8, 0, 2 * Math.PI);
        ctx.fillStyle = isPinching ? "#00FFFF" : "#FFFF00";
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  };

  const drawConnectors = (ctx: CanvasRenderingContext2D, landmarks: any[], connections: any[], style: any) => {
      ctx.strokeStyle = style.color;
      ctx.lineWidth = style.lineWidth;
      for (const conn of connections) {
          const start = landmarks[conn.start];
          const end = landmarks[conn.end];
          if (start && end) {
            ctx.beginPath();
            ctx.moveTo(start.x * canvasRef.current!.width, start.y * canvasRef.current!.height);
            ctx.lineTo(end.x * canvasRef.current!.width, end.y * canvasRef.current!.height);
            ctx.stroke();
          }
      }
  };

  const drawLandmarks = (ctx: CanvasRenderingContext2D, landmarks: any[], style: any) => {
      ctx.fillStyle = style.color;
      for (const lm of landmarks) {
          ctx.beginPath();
          ctx.arc(lm.x * canvasRef.current!.width, lm.y * canvasRef.current!.height, style.radius, 0, 2 * Math.PI);
          ctx.fill();
      }
  };

  return (
    <div className="absolute bottom-4 right-4 z-50 flex flex-col items-end gap-3 animate-fade-in pointer-events-auto">
      
      {/* Camera Feed Container */}
      <div className={`relative rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.5)] bg-black transition-all duration-300 ease-in-out origin-bottom-right ${
          isExpanded 
            ? 'w-[240px] h-[180px] opacity-100 scale-100 mb-2' 
            : 'w-[200px] h-[150px] opacity-0 scale-50 absolute bottom-0 right-0 -z-50 pointer-events-none'
        }`}>
        <video 
            ref={videoRef} 
            className="w-full h-full object-cover -scale-x-100" 
            autoPlay 
            playsInline 
            muted
        />
        <canvas 
            ref={canvasRef} 
            width={240}
            height={180}
            className="absolute top-0 left-0 w-full h-full -scale-x-100" 
        />
        
        {permissionError && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-4 text-center z-10">
             <div className="text-red-400 font-bold text-xs">
                无法访问摄像头<br/>请检查权限设置
             </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex items-center gap-3">
         {/* Status Pill */}
         <div className="bg-black/80 backdrop-blur-md text-white pl-4 pr-1 py-1.5 rounded-full border border-green-500/30 shadow-lg flex items-center gap-3">
            <div className="flex items-center gap-2">
               {/* Status Dot */}
               <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-ping' : 'bg-green-500 animate-pulse'}`}></span>
               <span className="text-xs font-bold font-mono text-green-400 tracking-wide">
                 {loading ? "正在启动..." : "魔法手势 ON"}
               </span>
            </div>
            
            {/* Show/Hide Camera Toggle */}
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1 rounded-full text-[10px] font-bold transition-colors border border-gray-600 uppercase"
              title={isExpanded ? "隐藏摄像头" : "显示摄像头"}
            >
              {isExpanded ? "隐藏画面" : "显示画面"}
            </button>
         </div>

         {/* Close Button */}
         <button 
            onClick={onClose}
            className="w-10 h-10 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white active:scale-95 transition-all"
            title="关闭手势控制"
         >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
               <line x1="18" y1="6" x2="6" y2="18"></line>
               <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
         </button>
      </div>

    </div>
  );
};

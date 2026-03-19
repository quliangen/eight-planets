
import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';

interface GestureControllerProps {
  onControl: (dx: number, dy: number, gestureType: 'rotate' | 'zoom') => void;
  onAction: (x: number, y: number, actionType: 'pinch' | 'peace') => void;
  onClose: () => void;
  isARMode: boolean;
  toggleARMode: () => void;
}

export const GestureController: React.FC<GestureControllerProps> = ({ 
  onControl, 
  onAction,
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
  
  const prevHandDistanceRef = useRef<number | null>(null);
  const lastActionTimeRef = useRef<number>(0);
  const isPinchingRef = useRef<boolean>(false);

  const [statusMessage, setStatusMessage] = useState<string>("启动魔法手势...");

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        // 使用本地 WASM 文件替代 CDN
        const vision = await FilesetResolver.forVisionTasks(
          "/mediapipe/wasm"
        );
        if (!isMounted) return;
        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            // 使用本地模型文件替代 Google Cloud
            modelAssetPath: "/mediapipe/models/hand_landmarker.task",
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
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
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
    if (videoRef.current.readyState < 2) {
        requestRef.current = requestAnimationFrame(predictWebcam);
        return;
    }
    const result = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());
    processGestures(result);
    if (canvasRef.current) draw(result);
    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  const processGestures = (result: HandLandmarkerResult) => {
    const hands = result.landmarks;
    if (!hands || hands.length === 0) {
      onControl(0, 0, 'rotate');
      prevHandDistanceRef.current = null;
      isPinchingRef.current = false;
      return;
    }

    const now = Date.now();
    const hand = hands[0];
    const cursor = hand[9]; // 掌心参考点
    const screenX = 1.0 - cursor.x;
    const screenY = cursor.y;

    // --- 1. 检测捏合 (大拇指和食指指尖靠近) ---
    const pinchDist = Math.hypot(hand[4].x - hand[8].x, hand[4].y - hand[8].y);
    const PINCH_THRESHOLD = 0.045;
    
    if (pinchDist < PINCH_THRESHOLD) {
      if (!isPinchingRef.current && (now - lastActionTimeRef.current > 800)) {
        isPinchingRef.current = true;
        lastActionTimeRef.current = now;
        onAction(screenX, screenY, 'pinch');
        setStatusMessage("👌 锁定目标！");
      }
    } else {
      isPinchingRef.current = false;
    }

    // --- 2. 检测比耶 (食指和中指伸出，其他合拢) ---
    const isIndexUp = hand[8].y < hand[6].y;
    const isMiddleUp = hand[12].y < hand[10].y;
    const isRingDown = hand[16].y > hand[14].y;
    const isPinkyDown = hand[20].y > hand[18].y;

    if (isIndexUp && isMiddleUp && isRingDown && isPinkyDown) {
      if (now - lastActionTimeRef.current > 1200) {
        lastActionTimeRef.current = now;
        onAction(screenX, screenY, 'peace');
        setStatusMessage("✌️ 魔法返回！");
      }
    }

    // --- 3. 基础缩放与旋转控制 ---
    if (hands.length === 2) {
      const h1 = hands[0][9]; 
      const h2 = hands[1][9];
      const dist = Math.hypot(h1.x - h2.x, h1.y - h2.y);
      if (prevHandDistanceRef.current !== null) {
        const delta = dist - prevHandDistanceRef.current;
        if (Math.abs(delta) > 0.002) onControl(0, delta * 300, 'zoom');
      }
      prevHandDistanceRef.current = dist;
    } else if (!isPinchingRef.current) {
      prevHandDistanceRef.current = null;
      const x = screenX; 
      const y = screenY; 
      let dx = 0, dy = 0;
      const DEADZONE = 0.15;
      const CENTER = 0.5;
      if (Math.abs(x - CENTER) > DEADZONE) dx = (x - CENTER) * 2.0;
      if (y < CENTER - DEADZONE) dy = (y - CENTER) * 2.0;
      onControl(dx, dy, 'rotate');
    }
  };

  const draw = (result: HandLandmarkerResult) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!isARMode && videoRef.current) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (result.landmarks) {
      for (const landmarks of result.landmarks) {
        const connections = HandLandmarker.HAND_CONNECTIONS;
        ctx.strokeStyle = isPinchingRef.current ? "#ff3e3e" : "#00ffff";
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
        // 绘制聚焦准星
        const cursor = landmarks[9];
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc((1 - cursor.x) * canvas.width, cursor.y * canvas.height, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo((1 - cursor.x) * canvas.width - 18, cursor.y * canvas.height);
        ctx.lineTo((1 - cursor.x) * canvas.width + 18, cursor.y * canvas.height);
        ctx.moveTo((1 - cursor.x) * canvas.width, cursor.y * canvas.height - 18);
        ctx.lineTo((1 - cursor.x) * canvas.width, cursor.y * canvas.height + 18);
        ctx.stroke();
      }
    }
  };

  return (
    <>
      <video ref={videoRef} className={`fixed inset-0 w-full h-full object-cover -scale-x-100 transition-opacity duration-300 ${isARMode ? 'z-[-10] opacity-100' : 'z-[-20] opacity-0 pointer-events-none'}`} autoPlay playsInline muted onLoadedData={predictWebcam} />
      {isARMode && <div className="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-md z-[-9] pointer-events-none transition-all duration-500" />}
      <canvas ref={canvasRef} width={320} height={240} className={`fixed bottom-20 right-4 w-40 h-32 rounded-lg border-2 border-white/20 shadow-lg z-50 bg-black/50 pointer-events-none transition-opacity duration-300 ${isARMode ? 'opacity-0' : 'opacity-100'}`} />
      <div className="absolute bottom-4 right-4 z-50 flex flex-col items-end gap-3 pointer-events-auto animate-fade-in">
        <div className="bg-slate-900/80 backdrop-blur border border-cyan-500/30 text-cyan-300 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
           <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400' : 'bg-green-400'} animate-pulse`}></span>
           {statusMessage}
        </div>
        <div className="flex items-center gap-3">
           <button onClick={toggleARMode} disabled={loading || permissionError} className={`h-12 px-5 rounded-full font-bold text-sm shadow-lg border-2 transition-all flex items-center gap-2 ${isARMode ? 'bg-cyan-500 text-black border-cyan-200 shadow-[0_0_15px_#22d3ee]' : 'bg-slate-800 text-white border-slate-600 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'}`}>
             <span>{isARMode ? "📺 关闭画面" : "📹 显示画面 (AR)"}</span>
           </button>
           <button onClick={onClose} className="w-12 h-12 bg-red-500 hover:bg-red-400 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 active:scale-95 transition-all">✕</button>
        </div>
      </div>
    </>
  );
};

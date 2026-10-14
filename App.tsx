
import React, { useState, Suspense, lazy, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { Vector3, TextureLoader, BackSide, Mesh, Object3D, RepeatWrapping, ClampToEdgeWrapping, MathUtils, Raycaster, Vector2 } from 'three';
import { PLANETS, SUN_DATA, JUPITER_MOONS, SATURN_MOONS, MOON_DATA, TIANGONG_DATA } from './constants';
import { Planet } from './components/Planet';
import { Sun } from './components/Sun';
import { Starship } from './components/Starship';
import { AsteroidBelt } from './components/AsteroidBelt';
import { UIOverlay } from './components/UIOverlay';
import { generateStarFieldTexture } from './utils/textureGenerator';

// 手势控制（含 MediaPipe 模型加载）体积大且默认关闭，按需分包懒加载
const GestureController = lazy(() => import('./components/GestureController').then(m => ({ default: m.GestureController })));

const Skybox: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const starTextureUrl = useMemo(() => generateStarFieldTexture(), []);
  const starTexture = useMemo(() => {
    const t = new TextureLoader().load(starTextureUrl);
    t.wrapS = RepeatWrapping;
    t.wrapT = ClampToEdgeWrapping;
    return t;
  }, [starTextureUrl]);

  // AR 模式切换会卸载天空盒，释放贴图避免泄漏
  useEffect(() => () => starTexture.dispose(), [starTexture]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.0001;
    }
  });

  return (
    // 半径需大于 maxDistance(500) + 冥王星轨道(130)，否则拉远相机会飞出球外丢失星空
    <mesh ref={meshRef}>
      <sphereGeometry args={[800, 64, 64]} />
      <meshBasicMaterial
        map={starTexture}
        side={BackSide}
        color="#ffffff"
      />
    </mesh>
  );
};

// CameraFlyTo 每帧复用的临时向量，避免飞行期间 60fps 反复 new 触发 GC 抖动
const _flyTargetPos = new Vector3();
const _flyDir = new Vector3();
const _flyDesiredPos = new Vector3();

const CameraFlyTo = ({ target, planetRefs, controlsRef, setTarget, isStarshipActive }: { target: { id: string, size: number } | null, planetRefs: any, controlsRef: any, setTarget: any, isStarshipActive: boolean }) => {
  useFrame((state, delta) => {
    if (!target || isStarshipActive) return;
    const { id, size } = target;
    const targetObj = planetRefs.current[id];

    if (!targetObj) {
      setTarget(null);
      return;
    }

    targetObj.getWorldPosition(_flyTargetPos);
    _flyDir.subVectors(state.camera.position, _flyTargetPos).normalize();

    const zoomDist = id === 'sun' ? 140 : Math.max(size * 4, 6.0);
    _flyDesiredPos.copy(_flyTargetPos).addScaledVector(_flyDir, zoomDist);

    const lerpFactor = 4.0 * delta;

    controlsRef.current.target.lerp(_flyTargetPos, lerpFactor);
    state.camera.position.lerp(_flyDesiredPos, lerpFactor);
    controlsRef.current.update();

    if (state.camera.position.distanceTo(_flyDesiredPos) < 0.2 &&
        controlsRef.current.target.distanceTo(_flyTargetPos) < 0.1) {
       setTarget(null);
    }
  });
  return null;
}

const GestureHandler = ({ action, setAction, onDoubleClick, onClose }: { action: any, setAction: any, onDoubleClick: any, onClose: any }) => {
  const { camera, scene } = useThree();
  const raycaster = useMemo(() => new Raycaster(), []);

  useEffect(() => {
    if (!action) return;

    if (action.type === 'peace') {
      onClose();
      setAction(null);
    } else if (action.type === 'pinch') {
      // 射线检测：寻找手势所在的 3D 物体
      // 手势坐标是 0 到 1，需要转换成 -1 到 1 的 NDC 坐标
      const mouse = new Vector2(action.x * 2 - 1, -(action.y * 2 - 1));
      raycaster.setFromCamera(mouse, camera);

      // 只对已注册的天体求交：全场景射线会命中天空盒/星空 Points/750 颗小行星，又慢又可能误选
      const planetRefs = (scene as any).__planetRefs || {};
      const intersects = raycaster.intersectObjects(Object.values(planetRefs), true);

      if (intersects.length > 0) {
        let targetId: string | null = null;
        // 查找击中物体或其父级是否在 planetRefs 中
        for (let intersect of intersects) {
           let obj: Object3D | null = intersect.object;
           while (obj) {
              if (obj.userData?.id) { targetId = obj.userData.id; break; }
              // 兼容性逻辑：通过 scene.__planetRefs 映射反向查找
              const foundId = Object.keys(planetRefs).find(id => planetRefs[id] === obj);
              if (foundId) { targetId = foundId; break; }
              obj = obj.parent;
           }
           if (targetId) break;
        }

        if (targetId) {
          onDoubleClick(targetId);
        }
      }
      setAction(null);
    }
  }, [action, camera, scene, raycaster, onDoubleClick, onClose, setAction]);

  return null;
}

const OrbitController = ({ controlsRef, gestureVelocity }: { controlsRef: any, gestureVelocity: React.MutableRefObject<{dx: number, dy: number, gestureType: 'rotate' | 'zoom'}> }) => {
  const smoothed = useRef({ dx: 0, dy: 0 });

  useFrame((_, delta) => {
    if (controlsRef.current && controlsRef.current.enabled) {
      const { dx, dy, gestureType } = gestureVelocity.current;
      const smoothFactor = 5.0 * delta;
      smoothed.current.dx = MathUtils.lerp(smoothed.current.dx, dx, smoothFactor);
      smoothed.current.dy = MathUtils.lerp(smoothed.current.dy, dy, smoothFactor);
      const threshold = 0.001; 
      const activeDx = Math.abs(smoothed.current.dx) > threshold ? smoothed.current.dx : 0;
      const activeDy = Math.abs(smoothed.current.dy) > threshold ? smoothed.current.dy : 0;
      if (activeDx !== 0 || activeDy !== 0) {
          if (gestureType === 'rotate') {
             controlsRef.current.setAzimuthalAngle(controlsRef.current.getAzimuthalAngle() - activeDx * 0.02);
             // 竖直方向双向响应：抬头/低头（OrbitControls 内部会夹取极角范围）
             controlsRef.current.setPolarAngle(controlsRef.current.getPolarAngle() - activeDy * 0.02);
          } else if (gestureType === 'zoom') {
             const speed = 1.0 + Math.abs(activeDy * 0.015);
             if (activeDy > 0) controlsRef.current.dollyOut(speed);
             else controlsRef.current.dollyIn(speed);
          }
          controlsRef.current.update();
      }
    }
  });
  return null;
}

const App: React.FC = () => {
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1.0); 
  const [isStarshipActive, setIsStarshipActive] = useState(false);
  const [showPluto, setShowPluto] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [isGestureMode, setIsGestureMode] = useState(false);
  const [isARMode, setIsARMode] = useState(false); 
  const [focusTarget, setFocusTarget] = useState<{ id: string, size: number } | null>(null);
  const [pendingAction, setPendingAction] = useState<{ x: number, y: number, type: 'pinch' | 'peace' } | null>(null);

  const planetRefs = useRef<{ [key: string]: Object3D }>({});
  const controlsRef = useRef<any>(null);
  const gestureVelocity = useRef<{dx: number, dy: number, gestureType: 'rotate' | 'zoom'}>({ dx: 0, dy: 0, gestureType: 'rotate' });

  useEffect(() => {
    document.body.style.backgroundColor = isARMode ? 'transparent' : '#000';
  }, [isARMode]);

  const handleSelect = (id: string) => {
    setSelectedPlanetId(id);
    setIsPaused(true); 
  };

  const handleClose = () => {
    setSelectedPlanetId(null);
    setIsPaused(false); 
    setFocusTarget({ id: SUN_DATA.id, size: SUN_DATA.size });
  };

  const getPlanetSize = (id: string): number => {
      if (id === 'sun') return SUN_DATA.size;
      if (id === 'moon') return MOON_DATA.size;
      if (id === 'tiangong') return TIANGONG_DATA.size;
      const p = PLANETS.find(x => x.id === id);
      if (p) return p.size;
      return 1; 
  };

  const handleDoubleClick = (id: string) => {
      const size = getPlanetSize(id);
      setFocusTarget({ id, size });
      handleSelect(id);
  };

  const handleGestureAction = (x: number, y: number, actionType: 'pinch' | 'peace') => {
    setPendingAction({ x, y, type: actionType });
  };

  const selectedPlanet = useMemo(() => {
    if (selectedPlanetId === 'sun') return SUN_DATA;
    if (selectedPlanetId === 'moon') return MOON_DATA;
    if (selectedPlanetId === 'tiangong') return TIANGONG_DATA;
    const planet = PLANETS.find(p => p.id === selectedPlanetId);
    if (planet) return planet;
    return [...JUPITER_MOONS, ...SATURN_MOONS].find(m => m.id === selectedPlanetId) || null;
  }, [selectedPlanetId]);

  return (
    <div className="w-full h-screen relative overflow-hidden" style={{ backgroundColor: isARMode ? 'transparent' : '#000' }}>
      <UIOverlay
        selectedPlanet={selectedPlanet} onClose={handleClose} simulationSpeed={simulationSpeed} setSimulationSpeed={setSimulationSpeed} isStarshipActive={isStarshipActive} toggleStarship={() => setIsStarshipActive(!isStarshipActive)} showPluto={showPluto} togglePluto={() => setShowPluto(!showPluto)} isGestureMode={isGestureMode} toggleGestureMode={() => setIsGestureMode(!isGestureMode)} showOrbits={showOrbits} toggleOrbits={() => setShowOrbits(!showOrbits)}
      />
      {isGestureMode && (
        <Suspense fallback={null}>
          <GestureController onControl={(dx, dy, gt) => { const v = gestureVelocity.current; v.dx = dx; v.dy = dy; v.gestureType = gt; }} onAction={handleGestureAction} onClose={() => setIsGestureMode(false)} isARMode={isARMode} toggleARMode={() => setIsARMode(!isARMode)} />
        </Suspense>
      )}
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }} onPointerMissed={() => selectedPlanetId && handleClose()} onCreated={(state) => { (state.scene as any).__planetRefs = planetRefs.current; }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 80, 120]} fov={45} />
          <OrbitControls ref={controlsRef} makeDefault enabled={!isStarshipActive} enableDamping dampingFactor={0.05} enablePan={false} minDistance={2} maxDistance={500} autoRotate={!selectedPlanetId && !isPaused && !isGestureMode && !isStarshipActive && !focusTarget} autoRotateSpeed={0.1 * simulationSpeed} />
          <CameraFlyTo target={focusTarget} planetRefs={planetRefs} controlsRef={controlsRef} setTarget={setFocusTarget} isStarshipActive={isStarshipActive} />
          <GestureHandler action={pendingAction} setAction={setPendingAction} onDoubleClick={handleDoubleClick} onClose={handleClose} />
          <OrbitController controlsRef={controlsRef} gestureVelocity={gestureVelocity} />
          <Environment files="./hdri/potsdamer_platz_1k.hdr" environmentIntensity={0.3} />
          {/* decay=0 关闭物理衰减：three r155+ 默认 decay=2，2.5 的强度在行星轨道上几乎为零，
              太阳方向光会完全失效（行星没有昼夜明暗面） */}
          <pointLight position={[0, 0, 0]} intensity={2.5} distance={500} decay={0} />
          <ambientLight intensity={0.15} />
          {!isARMode && <Skybox />}
          <Stars radius={400} />
          <Sparkles count={400} scale={200} size={6} />
          <Sun onSelect={handleSelect} onDoubleClick={handleDoubleClick} isPaused={isPaused} simulationSpeed={simulationSpeed} planetRefs={planetRefs} />
          <AsteroidBelt isPaused={isPaused} simulationSpeed={simulationSpeed} />
          {(showPluto ? PLANETS : PLANETS.filter(p => p.id !== 'pluto')).map((planet) => (
            <Planet key={planet.id} data={planet} onSelect={handleSelect} onDoubleClick={handleDoubleClick} isPaused={isPaused} simulationSpeed={simulationSpeed} planetRefs={planetRefs} showOrbit={showOrbits} />
          ))}
          {isStarshipActive && (
            <Starship
              planetRefs={planetRefs}
              simulationSpeed={simulationSpeed}
              isPaused={isPaused}
              onMissionComplete={() => {
                setIsStarshipActive(false);
                // Fly the camera back to the solar-system overview after the tour
                setFocusTarget({ id: SUN_DATA.id, size: SUN_DATA.size });
              }}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
export default App;

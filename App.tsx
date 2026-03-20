
import React, { useState, Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { Vector3, TextureLoader, BackSide, Mesh, Object3D, RepeatWrapping, ClampToEdgeWrapping, MathUtils, Raycaster, Vector2 } from 'three';
import { PLANETS, SUN_DATA, JUPITER_MOONS, SATURN_MOONS, MOON_DATA, TIANGONG_DATA } from './constants';
import { Planet } from './components/Planet';
import { Sun } from './components/Sun';
import { Starship } from './components/Starship';
import { AsteroidBelt } from './components/AsteroidBelt';
import { UIOverlay } from './components/UIOverlay';
import { GestureController } from './components/GestureController';
import { generateStarFieldTexture } from './utils/textureGenerator';

const Skybox: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const starTextureUrl = useMemo(() => generateStarFieldTexture(), []);
  const starTexture = useMemo(() => {
    const t = new TextureLoader().load(starTextureUrl);
    t.wrapS = RepeatWrapping;
    t.wrapT = ClampToEdgeWrapping; 
    return t;
  }, [starTextureUrl]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.0001; 
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[500, 64, 64]} />
      <meshBasicMaterial 
        map={starTexture} 
        side={BackSide} 
        color="#ffffff"
      />
    </mesh>
  );
};

const CameraFlyTo = ({ target, planetRefs, controlsRef, setTarget, isStarshipActive }: { target: { id: string, size: number } | null, planetRefs: any, controlsRef: any, setTarget: any, isStarshipActive: boolean }) => {
  useFrame((state, delta) => {
    if (!target || isStarshipActive) return;
    const { id, size } = target;
    const targetObj = planetRefs.current[id];
    
    if (!targetObj) {
      setTarget(null);
      return;
    }

    const targetPos = new Vector3();
    targetObj.getWorldPosition(targetPos);

    const currentCamPos = state.camera.position.clone();
    const dir = new Vector3().subVectors(currentCamPos, targetPos).normalize();
    
    const zoomDist = id === 'sun' ? 140 : Math.max(size * 4, 6.0); 
    const desiredCamPos = targetPos.clone().add(dir.multiplyScalar(zoomDist));

    const lerpFactor = 4.0 * delta;
    
    controlsRef.current.target.lerp(targetPos, lerpFactor);
    state.camera.position.lerp(desiredCamPos, lerpFactor);
    controlsRef.current.update();

    if (state.camera.position.distanceTo(desiredCamPos) < 0.2 && 
        controlsRef.current.target.distanceTo(targetPos) < 0.1) {
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
      
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        let targetId: string | null = null;
        // 查找击中物体或其父级是否在 planetRefs 中
        for (let intersect of intersects) {
           let obj: Object3D | null = intersect.object;
           while (obj) {
              if (obj.userData?.id) { targetId = obj.userData.id; break; }
              // 兼容性逻辑：通过 scene.__planetRefs 映射反向查找
              const planetRefs = (scene as any).__planetRefs || {};
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

  useFrame((state, delta) => {
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
             if (activeDy < 0) controlsRef.current.setPolarAngle(controlsRef.current.getPolarAngle() - activeDy * 0.02);
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

  const earthPositionRef = useRef<Vector3>(new Vector3(0, 0, 0));
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
        selectedPlanet={selectedPlanet} onClose={handleClose} isPaused={isPaused} togglePause={() => setIsPaused(!isPaused)} simulationSpeed={simulationSpeed} setSimulationSpeed={setSimulationSpeed} isStarshipActive={isStarshipActive} toggleStarship={() => setIsStarshipActive(!isStarshipActive)} showPluto={showPluto} togglePluto={() => setShowPluto(!showPluto)} isGestureMode={isGestureMode} toggleGestureMode={() => setIsGestureMode(!isGestureMode)} showOrbits={showOrbits} toggleOrbits={() => setShowOrbits(!showOrbits)}
      />
      {isGestureMode && (
        <GestureController onControl={(dx, dy, gt) => { gestureVelocity.current = { dx, dy, gestureType: gt }; }} onAction={handleGestureAction} onClose={() => setIsGestureMode(false)} isARMode={isARMode} toggleARMode={() => setIsARMode(!isARMode)} />
      )}
      <Canvas gl={{ antialias: true, alpha: true }} onPointerMissed={() => selectedPlanetId && handleClose()} onCreated={(state) => { (state.scene as any).__planetRefs = planetRefs.current; }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 80, 120]} fov={45} />
          <OrbitControls ref={controlsRef} makeDefault enabled={!isStarshipActive} enableDamping dampingFactor={0.05} enablePan={false} minDistance={2} maxDistance={500} autoRotate={!selectedPlanetId && !isPaused && !isGestureMode && !isStarshipActive && !focusTarget} autoRotateSpeed={0.1 * simulationSpeed} />
          <CameraFlyTo target={focusTarget} planetRefs={planetRefs} controlsRef={controlsRef} setTarget={setFocusTarget} isStarshipActive={isStarshipActive} />
          <GestureHandler action={pendingAction} setAction={setPendingAction} onDoubleClick={handleDoubleClick} onClose={handleClose} />
          <OrbitController controlsRef={controlsRef} gestureVelocity={gestureVelocity} />
          <Environment files="/hdri/potsdamer_platz_1k.hdr" environmentIntensity={0.3} />
          <pointLight position={[0, 0, 0]} intensity={2.5} distance={500} />
          <ambientLight intensity={0.15} />
          {!isARMode && <Skybox />}
          <Stars radius={400} />
          <Sparkles count={400} scale={200} size={6} />
          <Sun onSelect={handleSelect} onDoubleClick={handleDoubleClick} isSelected={selectedPlanetId === 'sun'} isPaused={isPaused} simulationSpeed={simulationSpeed} planetRefs={planetRefs} />
          <AsteroidBelt isPaused={isPaused} simulationSpeed={simulationSpeed} />
          {(showPluto ? PLANETS : PLANETS.filter(p => p.id !== 'pluto')).map((planet) => (
            <Planet key={planet.id} data={planet} isSelected={selectedPlanetId === planet.id} onSelect={handleSelect} onDoubleClick={handleDoubleClick} isPaused={isPaused} simulationSpeed={simulationSpeed} earthPositionRef={earthPositionRef} planetRefs={planetRefs} isStarshipActive={isStarshipActive} showOrbit={showOrbits} />
          ))}
          {isStarshipActive && <Starship planetRefs={planetRefs} onMissionComplete={() => setIsStarshipActive(false)} />}
        </Suspense>
      </Canvas>
    </div>
  );
};
export default App;

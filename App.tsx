
import React, { useState, Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { Vector3, TextureLoader, BackSide, Mesh, Object3D, RepeatWrapping, ClampToEdgeWrapping, MathUtils } from 'three';
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

const CameraFlyTo = ({ target, planetRefs, controlsRef, setTarget }: { target: { id: string, size: number } | null, planetRefs: any, controlsRef: any, setTarget: any }) => {
  useFrame((state, delta) => {
    if (!target) return;
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
    
    // 默认距离优化：太阳作为背景中心时，距离设为 140 (接近初始视角)，行星聚焦时则保持较近距离
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
             if (activeDy < 0) {
                controlsRef.current.setPolarAngle(controlsRef.current.getPolarAngle() - activeDy * 0.02);
             }
          } else if (gestureType === 'zoom') {
             const zoomSensitivity = 0.015; 
             const speed = 1.0 + Math.abs(activeDy * zoomSensitivity);
             if (activeDy > 0) {
                 controlsRef.current.dollyOut(speed);
             } else {
                 controlsRef.current.dollyIn(speed);
             }
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
  
  const earthPositionRef = useRef<Vector3>(new Vector3(0, 0, 0));
  const planetRefs = useRef<{ [key: string]: Object3D }>({});
  const controlsRef = useRef<any>(null);
  
  const gestureVelocity = useRef<{dx: number, dy: number, gestureType: 'rotate' | 'zoom'}>({ dx: 0, dy: 0, gestureType: 'rotate' });

  useEffect(() => {
    document.body.style.backgroundColor = isARMode ? 'transparent' : '#000';
    const root = document.getElementById('root');
    if (root) root.style.backgroundColor = isARMode ? 'transparent' : '#000';
  }, [isARMode]);

  const handleSelect = (id: string) => {
    setSelectedPlanetId(id);
    setIsPaused(true); 
  };

  const handleClose = () => {
    setSelectedPlanetId(null);
    setIsPaused(false); 
    // 飞回太阳，距离采用 CameraFlyTo 中定义的 140 默认距离
    setFocusTarget({ id: SUN_DATA.id, size: SUN_DATA.size });
  };

  const getPlanetSize = (id: string): number => {
      if (id === 'sun') return SUN_DATA.size;
      if (id === 'moon') return MOON_DATA.size;
      if (id === 'tiangong') return TIANGONG_DATA.size;
      
      const p = PLANETS.find(x => x.id === id);
      if (p) return p.size;
      
      const jm = JUPITER_MOONS.find(x => x.id === id);
      if (jm) return jm.size;
      
      const sm = SATURN_MOONS.find(x => x.id === id);
      if (sm) return sm.size;
      
      return 1; 
  };

  const handleDoubleClick = (id: string) => {
      const size = getPlanetSize(id);
      setFocusTarget({ id, size });
      handleSelect(id);
  };

  const togglePluto = () => {
    const newValue = !showPluto;
    setShowPluto(newValue);
    if (!newValue && selectedPlanetId === 'pluto') {
      handleClose();
    }
  };

  const toggleOrbits = () => {
    setShowOrbits(!showOrbits);
  };

  const handleGestureControl = (dx: number, dy: number, gestureType: 'rotate' | 'zoom') => {
    gestureVelocity.current = { dx, dy, gestureType };
  };

  const toggleGestureMode = () => {
    const nextState = !isGestureMode;
    setIsGestureMode(nextState);
    if (nextState) {
      setSimulationSpeed(1.0);
    } else {
      setIsARMode(false);
    }
  };

  const handleToggleStarship = () => {
    const activating = !isStarshipActive;
    setIsStarshipActive(activating);
    if (activating) {
       setIsPaused(false);
       setSimulationSpeed(0.5); 
       setFocusTarget(null);
    } else {
       setSimulationSpeed(1.0);
    }
  };

  const handleMissionComplete = () => {
     setIsStarshipActive(false);
     setSimulationSpeed(1.0); 
  };

  const selectedPlanet = useMemo(() => {
    if (selectedPlanetId === 'sun') return SUN_DATA;
    if (selectedPlanetId === 'moon') return MOON_DATA;
    if (selectedPlanetId === 'tiangong') return TIANGONG_DATA;
    
    const planet = PLANETS.find(p => p.id === selectedPlanetId);
    if (planet) return planet;
    const jMoon = JUPITER_MOONS.find(m => m.id === selectedPlanetId);
    if (jMoon) return jMoon;
    return SATURN_MOONS.find(m => m.id === selectedPlanetId) || null;
  }, [selectedPlanetId]);

  const displayedPlanets = useMemo(() => {
    return showPluto ? PLANETS : PLANETS.filter(p => p.id !== 'pluto');
  }, [showPluto]);

  return (
    <div className="w-full h-screen relative overflow-hidden transition-colors duration-500"
         style={{ backgroundColor: isARMode ? 'transparent' : '#000' }}
    >
      
      <UIOverlay 
        selectedPlanet={selectedPlanet}
        onClose={handleClose}
        isPaused={isPaused}
        togglePause={() => setIsPaused(!isPaused)}
        simulationSpeed={simulationSpeed}
        setSimulationSpeed={setSimulationSpeed}
        isStarshipActive={isStarshipActive}
        toggleStarship={handleToggleStarship}
        showPluto={showPluto}
        togglePluto={togglePluto}
        isGestureMode={isGestureMode}
        toggleGestureMode={toggleGestureMode}
        showOrbits={showOrbits}
        toggleOrbits={toggleOrbits}
      />

      {isGestureMode && (
        <GestureController 
          onControl={handleGestureControl} 
          onClose={() => toggleGestureMode()} 
          isARMode={isARMode}
          toggleARMode={() => setIsARMode(!isARMode)}
        />
      )}

      <Canvas 
        gl={{ antialias: true, toneMappingExposure: 1.2, alpha: true }}
        onPointerMissed={() => {
          if (selectedPlanetId) {
            handleClose();
          }
        }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 80, 120]} fov={45} />
          
          <OrbitControls 
            ref={controlsRef}
            makeDefault
            enabled={!isStarshipActive} 
            enableDamping={true}
            dampingFactor={0.05}
            enablePan={false}
            minDistance={2}
            maxDistance={500}
            maxPolarAngle={Math.PI / 1.8}
            autoRotate={!selectedPlanetId && !isPaused && !isGestureMode && !isStarshipActive && !focusTarget}
            autoRotateSpeed={0.1 * simulationSpeed} 
          />
          
          <CameraFlyTo 
             target={focusTarget} 
             planetRefs={planetRefs} 
             controlsRef={controlsRef} 
             setTarget={setFocusTarget} 
          />

          <OrbitController controlsRef={controlsRef} gestureVelocity={gestureVelocity} />

          <Environment preset="city" environmentIntensity={0.3} />
          <pointLight position={[0, 0, 0]} intensity={2.5} distance={500} decay={1} color="#FFF5E0" />
          <ambientLight intensity={0.15} color="#404060" />

          <Stars radius={400} depth={50} count={3000} factor={4} saturation={0.5} fade speed={0.5} />
          
          {!isARMode && <Skybox />}
          
          <Sparkles count={400} scale={200} size={6} speed={0.2} opacity={0.4} noise={0.1} color="#88AAFF" />
          <Sparkles count={150} scale={150} size={3} speed={0.3} opacity={0.6} color="#FFD700" />
          
          <Sun 
             onSelect={handleSelect}
             onDoubleClick={handleDoubleClick}
             isSelected={selectedPlanetId === 'sun'}
             isPaused={isPaused}
             simulationSpeed={simulationSpeed}
             planetRefs={planetRefs}
          />

          <AsteroidBelt isPaused={isPaused} simulationSpeed={simulationSpeed} />
          
          {displayedPlanets.map((planet) => (
            <Planet 
              key={planet.id} 
              data={planet} 
              isSelected={selectedPlanetId === planet.id}
              onSelect={handleSelect}
              onDoubleClick={handleDoubleClick}
              isPaused={isPaused}
              simulationSpeed={simulationSpeed}
              earthPositionRef={earthPositionRef}
              planetRefs={planetRefs}
              isStarshipActive={isStarshipActive}
              showOrbit={showOrbits}
            />
          ))}

          {isStarshipActive && (
             <Starship 
                planetRefs={planetRefs} 
                onMissionComplete={handleMissionComplete}
             />
          )}

        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;

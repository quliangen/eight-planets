import React, { useState, Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { Vector3, TextureLoader, BackSide, Mesh, Object3D, RepeatWrapping, ClampToEdgeWrapping } from 'three';
import { PLANETS, SUN_DATA } from './constants';
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
      meshRef.current.rotation.y += delta * 0.0002; 
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

const OrbitController = ({ controlsRef, gestureVelocity }: { controlsRef: any, gestureVelocity: React.MutableRefObject<{dx: number, dy: number, gestureType: 'rotate' | 'zoom'}> }) => {
  useFrame(() => {
    if (controlsRef.current && controlsRef.current.enabled) {
      const { dx, dy, gestureType } = gestureVelocity.current;
      
      const threshold = 0.01;
      const isActive = Math.abs(dx) > threshold || Math.abs(dy) > threshold;

      if (isActive) {
          if (gestureType === 'rotate') {
             // ROTATE MODE
             // dx: Left/Right movement.
             // dy: Up/Down movement.
             
             // Smooth damping is handled by OrbitControls 'enableDamping', 
             // but we need to feed it small increments.
             
             controlsRef.current.setAzimuthalAngle(controlsRef.current.getAzimuthalAngle() - dx * 0.02);
             controlsRef.current.setPolarAngle(controlsRef.current.getPolarAngle() - dy * 0.02);
          } else if (gestureType === 'zoom') {
             // ZOOM MODE
             // dy contains the "Delta" of hand distance.
             // dy < 0: Hands getting closer (Pull Near) -> Zoom In (Dolly In)
             // dy > 0: Hands getting apart (Pull Far) -> Zoom Out (Dolly Out)
             
             const zoomSensitivity = 0.01;
             
             // We use a base scale of 1.0. 
             // Dolly In needs scale > 1.0 (e.g. 1.05)
             // Dolly Out needs scale < 1.0 (e.g. 0.95) OR use dollyOut helper.
             
             // Let's rely on direction.
             // Note: OrbitControls dollyIn(s) means "move camera closer by scale s". s > 1 means bigger step? 
             // Actually dollyIn(1.05) moves closer. dollyOut(1.05) moves further.
             
             const speed = 1.0 + Math.abs(dy * zoomSensitivity);

             if (dy < 0) {
                 // Negative delta = hands closer = Zoom In
                 controlsRef.current.dollyIn(speed);
             } else {
                 // Positive delta = hands apart = Zoom Out
                 controlsRef.current.dollyOut(speed);
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
  
  const [isGestureMode, setIsGestureMode] = useState(false);
  const [isARMode, setIsARMode] = useState(false); // AR Mode State
  
  const earthPositionRef = useRef<Vector3>(new Vector3(0, 0, 0));
  const planetRefs = useRef<{ [key: string]: Object3D }>({});
  const controlsRef = useRef<any>(null);
  
  const gestureVelocity = useRef<{dx: number, dy: number, gestureType: 'rotate' | 'zoom'}>({ dx: 0, dy: 0, gestureType: 'rotate' });

  const handleSelect = (id: string) => {
    setSelectedPlanetId(id);
    setIsPaused(true); 
  };

  const handleClose = () => {
    setSelectedPlanetId(null);
    setIsPaused(false); 
  };

  const togglePluto = () => {
    const newValue = !showPluto;
    setShowPluto(newValue);
    if (!newValue && selectedPlanetId === 'pluto') {
      handleClose();
    }
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
      // If turning off gesture mode, also turn off AR
      setIsARMode(false);
    }
  };

  const handleToggleStarship = () => {
    const activating = !isStarshipActive;
    setIsStarshipActive(activating);
    if (activating) {
       setIsPaused(false);
       setSimulationSpeed(0.5); 
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
    return PLANETS.find(p => p.id === selectedPlanetId) || null;
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
      />

      {isGestureMode && (
        <GestureController 
          onControl={handleGestureControl} 
          onClose={() => toggleGestureMode()} 
          isARMode={isARMode}
          toggleARMode={() => setIsARMode(!isARMode)}
        />
      )}

      {/* 
         Canvas needs alpha: true for transparency.
         When AR Mode is ON, we hide the Skybox and opaque layers so the video behind shows through.
      */}
      <Canvas gl={{ antialias: true, toneMappingExposure: 1.2, alpha: true }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 80, 120]} fov={45} />
          
          <OrbitControls 
            ref={controlsRef}
            makeDefault
            enabled={!isStarshipActive} 
            enableDamping={true}
            dampingFactor={0.05}
            enablePan={false}
            minDistance={20}
            maxDistance={300}
            maxPolarAngle={Math.PI / 1.8}
            autoRotate={!selectedPlanetId && !isPaused && !isGestureMode && !isStarshipActive}
            autoRotateSpeed={0.15 * simulationSpeed}
          />
          
          <OrbitController controlsRef={controlsRef} gestureVelocity={gestureVelocity} />

          <Environment preset="city" environmentIntensity={0.3} />
          <pointLight position={[0, 0, 0]} intensity={2.5} distance={500} decay={1} color="#FFF5E0" />
          <ambientLight intensity={0.15} color="#404060" />

          {/* 1. Volumetric 3D Stars (Always show, they look nice floating in room) */}
          <Stars radius={400} depth={50} count={3000} factor={4} saturation={0.5} fade speed={0.5} />
          
          {/* 2. Painted Background (Skybox) - HIDE IN AR MODE */}
          {!isARMode && <Skybox />}
          
          {/* 3. Magical Dust */}
          <Sparkles count={400} scale={200} size={6} speed={0.2} opacity={0.4} noise={0.1} color="#88AAFF" />
          <Sparkles count={150} scale={150} size={3} speed={0.3} opacity={0.6} color="#FFD700" />
          
          <Sun 
             onSelect={handleSelect}
             isSelected={selectedPlanetId === 'sun'}
             isPaused={isPaused}
             simulationSpeed={simulationSpeed}
          />

          <AsteroidBelt isPaused={isPaused} simulationSpeed={simulationSpeed} />
          
          {displayedPlanets.map((planet) => (
            <Planet 
              key={planet.id} 
              data={planet} 
              isSelected={selectedPlanetId === planet.id}
              onSelect={handleSelect}
              isPaused={isPaused}
              simulationSpeed={simulationSpeed}
              earthPositionRef={earthPositionRef}
              planetRefs={planetRefs}
              isStarshipActive={isStarshipActive}
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
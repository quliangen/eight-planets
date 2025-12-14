
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
      meshRef.current.rotation.y += delta * 0.0001; // Slower background rotation
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

// Camera FlyTo Logic
const CameraFlyTo = ({ target, planetRefs, controlsRef, setTarget }: { target: { id: string, size: number } | null, planetRefs: any, controlsRef: any, setTarget: any }) => {
  useFrame((state, delta) => {
    if (!target) return;
    const { id, size } = target;
    const targetObj = planetRefs.current[id];
    
    // If we can't find object, abort
    if (!targetObj) {
      setTarget(null);
      return;
    }

    const targetPos = new Vector3();
    targetObj.getWorldPosition(targetPos);

    // Current camera state
    const currentCamPos = state.camera.position.clone();

    // Desired camera state
    // Direction from planet to camera (preserve current angle mostly)
    const dir = new Vector3().subVectors(currentCamPos, targetPos).normalize();
    
    // Zoom distance: 4x size is decent for overview, max at least 5 units
    // For Tiangong (0.1) -> 0.4 is too close, clamp to 3 minimum
    // For Sun (8.0) -> 32
    const zoomDist = Math.max(size * 4, 6.0); 
    const desiredCamPos = targetPos.clone().add(dir.multiplyScalar(zoomDist));

    // Smooth step
    const lerpFactor = 4.0 * delta;
    
    // Move controls target to planet center
    controlsRef.current.target.lerp(targetPos, lerpFactor);
    
    // Move camera position
    state.camera.position.lerp(desiredCamPos, lerpFactor);
    
    controlsRef.current.update();

    // Completion check: Close enough to target pos AND look target
    if (state.camera.position.distanceTo(desiredCamPos) < 0.5 && 
        controlsRef.current.target.distanceTo(targetPos) < 0.1) {
       setTarget(null); // Stop forcing animation
    }
  });
  return null;
}

// Updated Controller with Smoothing to prevent Jitter
const OrbitController = ({ controlsRef, gestureVelocity }: { controlsRef: any, gestureVelocity: React.MutableRefObject<{dx: number, dy: number, gestureType: 'rotate' | 'zoom'}> }) => {
  // Store smoothed values to prevent camera shaking from noisy hand data
  const smoothed = useRef({ dx: 0, dy: 0 });

  useFrame((state, delta) => {
    if (controlsRef.current && controlsRef.current.enabled) {
      const { dx, dy, gestureType } = gestureVelocity.current;
      
      // Smoothing factor: Lower = Smoother/Slower, Higher = More responsive/Jittery
      // 5.0 * delta gives a nice weighted average over ~0.2 seconds
      const smoothFactor = 5.0 * delta;
      
      smoothed.current.dx = MathUtils.lerp(smoothed.current.dx, dx, smoothFactor);
      smoothed.current.dy = MathUtils.lerp(smoothed.current.dy, dy, smoothFactor);

      // Use a small deadzone to stop movement completely when hands are steady
      const threshold = 0.001; 
      const activeDx = Math.abs(smoothed.current.dx) > threshold ? smoothed.current.dx : 0;
      const activeDy = Math.abs(smoothed.current.dy) > threshold ? smoothed.current.dy : 0;

      const isActive = activeDx !== 0 || activeDy !== 0;

      if (isActive) {
          if (gestureType === 'rotate') {
             // ROTATE MODE
             // Hand Left/Right (dx) -> Rotate Azimuth
             controlsRef.current.setAzimuthalAngle(controlsRef.current.getAzimuthalAngle() - activeDx * 0.02);
             
             // Hand Up/Down (dy) -> Rotate Polar Angle
             // Requirement: "Up movement -> Camera angle moves down"
             // Hand Up (dy < 0). 'activeDy' is negative.
             // We want Camera Down -> Increase Polar Angle (towards PI/2).
             // Subtracting negative activeDy adds to the angle.
             controlsRef.current.setPolarAngle(controlsRef.current.getPolarAngle() - activeDy * 0.02);
             
          } else if (gestureType === 'zoom') {
             // ZOOM MODE
             const zoomSensitivity = 0.015; // Adjusted sensitivity
             
             // Smooth zoom application
             const speed = 1.0 + Math.abs(activeDy * zoomSensitivity);

             // activeDy corresponds to change in distance between hands (Spread > 0, Close < 0)
             // Requirement: "Hands spread and lengthen distance -> view zooms in"
             if (activeDy > 0) {
                 // Spread -> Zoom In (Dolly In)
                 controlsRef.current.dollyIn(speed);
             } else {
                 // Close -> Zoom Out (Dolly Out)
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
  const [showOrbits, setShowOrbits] = useState(true);
  
  const [isGestureMode, setIsGestureMode] = useState(false);
  const [isARMode, setIsARMode] = useState(false); // AR Mode State

  // Camera Focus State
  const [focusTarget, setFocusTarget] = useState<{ id: string, size: number } | null>(null);
  
  const earthPositionRef = useRef<Vector3>(new Vector3(0, 0, 0));
  const planetRefs = useRef<{ [key: string]: Object3D }>({});
  const controlsRef = useRef<any>(null);
  
  const gestureVelocity = useRef<{dx: number, dy: number, gestureType: 'rotate' | 'zoom'}>({ dx: 0, dy: 0, gestureType: 'rotate' });

  // Safety Effect: Ensure body background is black on mount, and transparent on AR
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
  };

  // Helper to find planet size
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
      
      return 2; // default
  };

  const handleDoubleClick = (id: string) => {
      const size = getPlanetSize(id);
      setFocusTarget({ id, size });
      // Also ensure it is selected (paused and UI shown)
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
       // Reset focus if we start flying
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
    
    // Check main planets
    const planet = PLANETS.find(p => p.id === selectedPlanetId);
    if (planet) return planet;
    // Check Jupiter's moons
    const jMoon = JUPITER_MOONS.find(m => m.id === selectedPlanetId);
    if (jMoon) return jMoon;
    // Check Saturn's moons
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

      {/* 
         Canvas needs alpha: true for transparency.
         When AR Mode is ON, we hide the Skybox and opaque layers so the video behind shows through.
         onPointerMissed handles clicking empty space to deselect/close popups.
      */}
      <Canvas 
        gl={{ antialias: true, toneMappingExposure: 1.2, alpha: true }}
        onPointerMissed={() => {
          // If we clicked on empty space (not a mesh), close the info panel
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
            // Slower auto-rotate for better default experience
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

          {/* 1. Volumetric 3D Stars (Always show, they look nice floating in room) */}
          <Stars radius={400} depth={50} count={3000} factor={4} saturation={0.5} fade speed={0.5} />
          
          {/* 2. Painted Background (Skybox) - HIDE IN AR MODE */}
          {!isARMode && <Skybox />}
          
          {/* 3. Magical Dust */}
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

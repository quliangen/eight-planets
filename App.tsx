
import React, { useState, Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { Vector3, TextureLoader, BackSide, Mesh, Object3D, RepeatWrapping, ClampToEdgeWrapping, MathUtils } from 'three';
import { PLANETS, SUN_DATA, JUPITER_MOONS } from './constants';
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
  
  const [isGestureMode, setIsGestureMode] = useState(false);
  const [isARMode, setIsARMode] = useState(false); // AR Mode State
  
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
    // Check main planets
    const planet = PLANETS.find(p => p.id === selectedPlanetId);
    if (planet) return planet;
    // Check Jupiter's moons
    return JUPITER_MOONS.find(m => m.id === selectedPlanetId) || null;
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
            // Slower auto-rotate for better default experience
            autoRotate={!selectedPlanetId && !isPaused && !isGestureMode && !isStarshipActive}
            autoRotateSpeed={0.1 * simulationSpeed} 
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

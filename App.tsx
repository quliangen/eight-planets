

import React, { useState, Suspense, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { Vector3, TextureLoader, BackSide, Mesh, Object3D } from 'three';
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
  const starTexture = useMemo(() => new TextureLoader().load(starTextureUrl), [starTextureUrl]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.0002; // Reduced from 0.0005
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Increased radius to ensure it encompasses the 3D Stars volume */}
      <sphereGeometry args={[500, 64, 64]} />
      <meshBasicMaterial 
        map={starTexture} 
        side={BackSide} 
        color="#ffffff"
      />
    </mesh>
  );
};

// Component to handle applying gesture inputs to OrbitControls
const OrbitController = ({ controlsRef, gestureVelocity }: { controlsRef: any, gestureVelocity: React.MutableRefObject<{dx: number, dy: number, gestureType: 'rotate' | 'zoom'}> }) => {
  useFrame(() => {
    if (controlsRef.current) {
      const { dx, dy, gestureType } = gestureVelocity.current;
      
      const threshold = 0.01;
      const isActive = Math.abs(dx) > threshold || Math.abs(dy) > threshold;

      if (isActive) {
          if (gestureType === 'rotate') {
             // ROTATE MODE
             // dx negative (Hand Left) -> rotate left -> map moves left.
             controlsRef.current.setAzimuthalAngle(controlsRef.current.getAzimuthalAngle() + dx * 0.05);
             
             // dy negative (Hand Up) -> Drag Map Up -> Camera looks down -> Angle Increase
             // dy positive (Hand Down) -> Drag Map Down -> Camera looks up -> Angle Decrease
             // We subtract dy to match "Drag" feel.
             controlsRef.current.setPolarAngle(controlsRef.current.getPolarAngle() - dy * 0.05);
          } else if (gestureType === 'zoom') {
             // ZOOM MODE (Pinch)
             // dy negative (Hand Up) -> Zoom In (dollyIn)
             // dy positive (Hand Down) -> Zoom Out (dollyOut)
             const zoomSpeed = 0.05;
             const zoomFactor = 1.0 + Math.abs(dy) * zoomSpeed;
             
             if (dy < 0) {
                 controlsRef.current.dollyIn(zoomFactor);
             } else {
                 controlsRef.current.dollyOut(zoomFactor);
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
  const [isStarshipActive, setIsStarshipActive] = useState(false);
  const [showPluto, setShowPluto] = useState(false);
  const [isGestureMode, setIsGestureMode] = useState(false);
  
  const earthPositionRef = useRef<Vector3>(new Vector3(0, 0, 0));
  const planetRefs = useRef<{ [key: string]: Object3D }>({});
  const controlsRef = useRef<any>(null);
  
  // Ref to store current gesture velocity to avoid re-renders on every frame update
  const gestureVelocity = useRef<{dx: number, dy: number, gestureType: 'rotate' | 'zoom'}>({ dx: 0, dy: 0, gestureType: 'rotate' });

  const handleSelect = (id: string) => {
    setSelectedPlanetId(id);
    setIsPaused(true); // Stop orbit when a planet is selected
  };

  const handleClose = () => {
    setSelectedPlanetId(null);
    setIsPaused(false); // Resume orbit when closed
  };

  const togglePluto = () => {
    const newValue = !showPluto;
    setShowPluto(newValue);
    // If we are hiding Pluto and it is currently selected, deselect it
    if (!newValue && selectedPlanetId === 'pluto') {
      handleClose();
    }
  };

  const handleGestureControl = (dx: number, dy: number, gestureType: 'rotate' | 'zoom') => {
    gestureVelocity.current = { dx, dy, gestureType };
  };

  // Find the selected planet object (Sun or normal Planet)
  const selectedPlanet = useMemo(() => {
    if (selectedPlanetId === 'sun') return SUN_DATA;
    return PLANETS.find(p => p.id === selectedPlanetId) || null;
  }, [selectedPlanetId]);

  // Filter planets based on showPluto state
  const displayedPlanets = useMemo(() => {
    return showPluto ? PLANETS : PLANETS.filter(p => p.id !== 'pluto');
  }, [showPluto]);

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      
      <UIOverlay 
        selectedPlanet={selectedPlanet}
        onClose={handleClose}
        isPaused={isPaused}
        togglePause={() => setIsPaused(!isPaused)}
        isStarshipActive={isStarshipActive}
        toggleStarship={() => setIsStarshipActive(!isStarshipActive)}
        showPluto={showPluto}
        togglePluto={togglePluto}
        isGestureMode={isGestureMode}
        toggleGestureMode={() => setIsGestureMode(!isGestureMode)}
      />

      {isGestureMode && (
        <GestureController 
          onControl={handleGestureControl} 
          onClose={() => setIsGestureMode(false)} 
        />
      )}

      <Canvas gl={{ antialias: true, toneMappingExposure: 1.2 }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 80, 120]} fov={45} />
          
          <OrbitControls 
            ref={controlsRef}
            makeDefault
            enableDamping={true}
            dampingFactor={0.05}
            enablePan={false}
            minDistance={20}
            maxDistance={300}
            maxPolarAngle={Math.PI / 1.8}
            autoRotate={!selectedPlanetId && !isPaused && !isGestureMode}
            autoRotateSpeed={0.15} // Reduced from 0.5
          />
          
          <OrbitController controlsRef={controlsRef} gestureVelocity={gestureVelocity} />

          <Environment preset="city" environmentIntensity={0.3} />
          <pointLight position={[0, 0, 0]} intensity={2.5} distance={500} decay={1} color="#FFF5E0" />
          <ambientLight intensity={0.15} color="#404060" />

          {/* 1. Volumetric 3D Stars (Mid-distance) */}
          <Stars radius={400} depth={50} count={3000} factor={4} saturation={0.5} fade speed={0.5} />
          
          {/* 2. Painted Background (Infinite Distance) */}
          <Skybox />
          
          {/* 3. Magical Dust (Near-distance) */}
          <Sparkles count={400} scale={200} size={6} speed={0.2} opacity={0.4} noise={0.1} color="#88AAFF" />
          <Sparkles count={150} scale={150} size={3} speed={0.3} opacity={0.6} color="#FFD700" />
          
          <Sun 
             onSelect={handleSelect}
             isSelected={selectedPlanetId === 'sun'}
             isPaused={isPaused}
          />

          {/* Asteroid Belt located between Mars and Jupiter */}
          <AsteroidBelt isPaused={isPaused} />
          
          {displayedPlanets.map((planet) => (
            <Planet 
              key={planet.id} 
              data={planet} 
              isSelected={selectedPlanetId === planet.id}
              onSelect={handleSelect}
              isPaused={isPaused}
              earthPositionRef={earthPositionRef}
              planetRefs={planetRefs}
            />
          ))}

          {isStarshipActive && <Starship planetRefs={planetRefs} />}

        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;

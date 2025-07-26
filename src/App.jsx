import { Canvas } from "@react-three/fiber";
import { XR, XROrigin, createXRStore } from "@react-three/xr";
import { Float, Bvh } from "@react-three/drei";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { CustomGeometryParticles } from "./components/Particles"; // Corrected import path
import { useState, useEffect } from "react";
import { useSkyboxStore } from "./store/useSkyboxStore";

export const store = createXRStore({
  controller: undefined,
  meshDetection: false,
  planeDetection: false,
});

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(null); // for transition
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Particle system state
  const [particleState, setParticleState] = useState({
    isActive: false,
    opacity: 0,
    phase: 'inactive' // 'inactive', 'fading-in', 'active', 'fading-out'
  });
  
  // Get skybox data from store
  const skyboxTextures = useSkyboxStore((state) => state.skyboxTextures);

  // Particle timing configuration
  const particleConfig = {
    fadeInDuration: 2000,    // 2 seconds fade in
    activeDuration: 8000,    // 8 seconds active
    fadeOutDuration: 3000    // 3 seconds fade out
  };

  // Handler for UI button
  const handleNextSkybox = () => {
    if (isTransitioning) return;
    setNextIndex((currentIndex + 1) % skyboxTextures.length);
    setIsTransitioning(true);
  };

  // Handler for when transition completes
  const handleTransitionComplete = () => {
    setCurrentIndex(nextIndex);
    setNextIndex(null);
    setIsTransitioning(false);
  };

  // Handler for starting particle system
  const handleStartParticles = () => {
    if (particleState.isActive) return; // Don't restart if already active
    
    setParticleState({
      isActive: true,
      opacity: 0,
      phase: 'fading-in'
    });
  };

  // Particle lifecycle management
  useEffect(() => {
    if (!particleState.isActive) return;

    let timeoutId;
    
    if (particleState.phase === 'fading-in') {
      // Fade in over fadeInDuration
      const startTime = Date.now();
      
      const fadeIn = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / particleConfig.fadeInDuration, 1);
        
        setParticleState(prev => ({
          ...prev,
          opacity: progress
        }));
        
        if (progress < 1) {
          timeoutId = requestAnimationFrame(fadeIn);
        } else {
          // Start active phase
          setParticleState(prev => ({
            ...prev,
            phase: 'active'
          }));
        }
      };
      
      fadeIn();
      
    } else if (particleState.phase === 'active') {
      // Stay active for activeDuration
      timeoutId = setTimeout(() => {
        setParticleState(prev => ({
          ...prev,
          phase: 'fading-out'
        }));
      }, particleConfig.activeDuration);
      
    } else if (particleState.phase === 'fading-out') {
      // Fade out over fadeOutDuration
      const startTime = Date.now();
      const startOpacity = particleState.opacity;
      
      const fadeOut = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / particleConfig.fadeOutDuration, 1);
        
        setParticleState(prev => ({
          ...prev,
          opacity: startOpacity * (1 - progress)
        }));
        
        if (progress < 1) {
          timeoutId = requestAnimationFrame(fadeOut);
        } else {
          // Deactivate particles
          setParticleState({
            isActive: false,
            opacity: 0,
            phase: 'inactive'
          });
        }
      };
      
      fadeOut();
    }
    
    return () => {
      if (timeoutId) {
        if (typeof timeoutId === 'number') {
          clearTimeout(timeoutId);
        } else {
          cancelAnimationFrame(timeoutId);
        }
      }
    };
  }, [particleState.phase, particleState.isActive]);

  console.log('App:', { currentIndex, nextIndex, isTransitioning, currentTexture: skyboxTextures[currentIndex], nextTexture: nextIndex !== null ? skyboxTextures[nextIndex] : null });
  return (
    <Canvas shadows camera={{ position: [0.18, 0.60, 3.90], fov: 40 }}>
      <XR store={store}>
        <group position-y={1} position-z={-5}>
          <Float rotationIntensity={0.4} speed={1.5}>
            <UI onNextSkybox={handleNextSkybox} onStartParticles={handleStartParticles} />
          </Float>
        </group>
        <group position-y={-1}>
          <Bvh firstHitOnly>
            <Experience
              currentTexture={skyboxTextures[currentIndex]}
              nextTexture={nextIndex !== null ? skyboxTextures[nextIndex] : null}
              isTransitioning={isTransitioning}
              onTransitionComplete={handleTransitionComplete}
            />
          </Bvh>
          <XROrigin position-z={0.2} />
        </group>
        {/* Particles with fade effect - only render when active */}
        {particleState.isActive && (
          <CustomGeometryParticles 
            count={2000} 
            rotationSpeed={0.001} 
            sizeMultiplier={2.0}
            baseSize={3.0}
            opacity={particleState.opacity}
          />
        )}
        <XROrigin position-z={0.2} />
      </XR>
    </Canvas>
  );
}

export default App;
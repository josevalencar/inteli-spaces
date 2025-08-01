import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { XR, XROrigin, createXRStore } from "@react-three/xr";
import { Bvh } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import { FontFamilyProvider } from "@react-three/uikit";
import { SceneManager } from "./components/SceneManager";
import { useState, useEffect, useRef } from "react";

export const store = createXRStore({
  controller: undefined,
  meshDetection: false,
  planeDetection: false,
});

// Debug component to track camera position
function CameraTracker() {
  const { camera } = useThree();
  const lastLogTime = useRef(0);
  
  useFrame(() => {
    const now = Date.now();
    // Log camera position every 500ms for real-time tracking
    if (now - lastLogTime.current > 500) {
      console.log(`📷 Camera: [${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}]`);
      lastLogTime.current = now;
    }
  });
  
  return null;
}

function App() {
  // Particle system state (simplified)
  const [particleState, setParticleState] = useState({
    isActive: false,
    opacity: 0,
    phase: 'inactive' // 'inactive', 'fading-in', 'active', 'fading-out'
  });

  // Particle timing configuration
  const particleConfig = {
    fadeInDuration: 2000,    // 2 seconds fade in
    activeDuration: 8000,    // 8 seconds active
    fadeOutDuration: 3000    // 3 seconds fade out
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
  return (
    <Canvas shadows camera={{ position: [0.29, 0.04, 3.94], fov: 40 }}>
      <XR store={store}>
        <FontFamilyProvider
          roboto={{
            medium: "/fonts/fixed-roboto.json",
          }}
        >
          {/* Debug camera position tracker */}
          {/* <CameraTracker /> */}
          
          {/* Main scene manager handles all scenes and transitions */}
          <group position-y={-1}>
            <Bvh firstHitOnly>
              <SceneManager 
                particleState={particleState}
                onStartParticles={handleStartParticles}
              />
            </Bvh>
            <XROrigin position-z={0.1} />
          </group>
          
          {/* Camera controls for non-VR mode */}
          <OrbitControls 
            makeDefault 
            maxDistance={8}
            minDistance={1}
            maxPolarAngle={Math.PI * 0.8}
            minPolarAngle={Math.PI * 0.2}
          />
        </FontFamilyProvider>
      </XR>
    </Canvas>
  );
}

export default App;
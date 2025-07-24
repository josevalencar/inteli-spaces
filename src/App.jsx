import { Canvas } from "@react-three/fiber";
import { XR, XROrigin, createXRStore } from "@react-three/xr";
import { Float, Bvh } from "@react-three/drei";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { CustomGeometryParticles } from "./components/Particles"; // Corrected import path
import { useState } from "react";

export const store = createXRStore({
  controller: undefined,
  meshDetection: false,
  planeDetection: false,
});

const skyboxTextures = [
  "/textures/the_adventures_of_sherlock_holmes_1.jpg",
  "/textures/the_adventures_of_sherlock_holmes_9.jpg",
  "/textures/the_adventures_of_sherlock_holmes_10.jpg",
  "/textures/meditations.jpg"
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(null); // for transition
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  console.log('App:', { currentIndex, nextIndex, isTransitioning, currentTexture: skyboxTextures[currentIndex], nextTexture: nextIndex !== null ? skyboxTextures[nextIndex] : null });
  return (
    <Canvas shadows camera={{ position: [0.18, 0.60, 3.90], fov: 40 }}>
      <XR store={store}>
        <group position-y={1} position-z={-5}>
          <Float rotationIntensity={0.4} speed={1.5}>
            <UI onNextSkybox={handleNextSkybox} />
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
        {/* Particles positioned at camera origin with configurable rotation speed and size */}
        <CustomGeometryParticles 
          count={1000} 
          rotationSpeed={0.0009} 
          sizeMultiplier={5.0}
          baseSize={5.0}
        />
        <XROrigin position-z={0.2} />
      </XR>
    </Canvas>
  );
}

export default App;
import { Canvas } from "@react-three/fiber";
import { XR, XROrigin, createXRStore } from "@react-three/xr";
import { Float, Bvh } from "@react-three/drei";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { useState } from "react";
import { TransitionManager } from "./components/TransitionManager";
import { CustomGeometryParticles } from "./components/Particles"; // Corrected import path

export const store = createXRStore({
  controller: undefined,
  meshDetection: false,
  planeDetection: false,
});

function App() {
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [inTransition, setInTransition] = useState(false);
  const [showBlackSkybox, setShowBlackSkybox] = useState(false);

  const triggerTransition = () => {
    setInTransition(true);
    setTransitionProgress(0);
    setShowBlackSkybox(false);
  };

  return (
    <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
      {!showBlackSkybox && <color attach="background" args={["#ececec"]} />}
      <XR store={store}>
        <group position-y={1} position-z={-5}>
          <Float rotationIntensity={0.4} speed={1.5}>
            <UI triggerTransition={triggerTransition} />
          </Float>
        </group>
        {!showBlackSkybox && (
          <group position-y={-1}>
            <Bvh firstHitOnly>
              <Experience />
            </Bvh>
            <XROrigin position-z={0.2} />
          </group>
        )}
        {showBlackSkybox && (
           <group position-y={-1}>
             <CustomGeometryParticles count={4000} />
             <XROrigin position-z={0.2} />
           </group>
        )}
      </XR>
      <TransitionManager
        triggerTransition={triggerTransition}
        inTransition={inTransition}
        setInTransition={setInTransition}
        showBlackSkybox={showBlackSkybox}
        setShowBlackSkybox={setShowBlackSkybox}
        transitionProgress={transitionProgress}
        setTransitionProgress={setTransitionProgress}
      />
    </Canvas>
  );
}

export default App;
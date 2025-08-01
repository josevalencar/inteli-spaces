import React, { forwardRef, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useSkyboxStore } from "../store/useSkyboxStore";
import { SkyboxRenderer } from "./SkyboxRenderer";

const Skybox = forwardRef(() => {
  const { currentSkyboxIndex, previousSkyboxIndex, transitionSpeed, skyboxTextureObjects } = useSkyboxStore();
  const renderMaterial = useRef();
  
  const currentTexture = skyboxTextureObjects[currentSkyboxIndex];
  const previousTexture = skyboxTextureObjects[previousSkyboxIndex];

  // Reset progression when skybox changes (following transition-example pattern)
  useEffect(() => {
    if (currentSkyboxIndex === previousSkyboxIndex) {
      return;
    }
    if (renderMaterial.current) {
      renderMaterial.current.uProgression = 0;
    }
  }, [currentSkyboxIndex, previousSkyboxIndex]);

  // If no previous texture or same texture, show simple skybox
  if (!previousTexture || currentSkyboxIndex === previousSkyboxIndex) {
    return (
      <mesh scale={[50, 50, 50]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          map={currentTexture}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>
    );
  }

  // Show transition between previous and current
  return (
    <SkyboxRenderer
      ref={renderMaterial}
      currentSkybox={currentTexture}
      previousSkybox={previousTexture}
      transitionSpeed={transitionSpeed}
      repeat={3}
      smoothness={0.3}
    />
  );
});

Skybox.displayName = 'Skybox';

export default Skybox; 
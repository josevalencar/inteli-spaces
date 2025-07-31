import React from 'react';
import { Float } from '@react-three/drei';
import { UI } from '../UI';
import { CustomGeometryParticles } from '../Particles';
import { useSkyboxStore } from '../../store/useSkyboxStore';
import { useSceneStore } from '../../store/useSceneStore';
import ProceduralSkybox from '../ProceduralSkybox';

export const MenuScene = ({ particleState, onStartParticles }) => {
  const skyboxTextureObjects = useSkyboxStore((state) => state.skyboxTextureObjects);
  const startExperience = useSceneStore((state) => state.startExperience);
  const getSkyboxIndex = useSceneStore((state) => state.getSkyboxIndex);
  
  const skyboxIndex = getSkyboxIndex();

  return (
    <>
      {/* Skybox for menu scene */}
      <ProceduralSkybox
        currentTexture={skyboxTextureObjects[skyboxIndex]}
        previousTexture={null}
        isTransitioning={false}
        transitionDuration={0.8}
      />
      
      {/* UI positioned in XR space (following game-example pattern) */}
      <group position-y={1} position-z={-5}>
        <Float rotationIntensity={0.4} speed={1.5}>
          <UI 
            onNextSkybox={() => {}} // Disabled in scene-based mode
            onStartParticles={onStartParticles}
            onStartExperience={startExperience}
          />
        </Float>
      </group>

      {/* Particles with fade effect - only render when active */}
      {particleState?.isActive && (
        <CustomGeometryParticles 
          count={2000} 
          rotationSpeed={0.001} 
          sizeMultiplier={2.0}
          baseSize={3.0}
          opacity={particleState.opacity}
        />
      )}
    </>
  );
};
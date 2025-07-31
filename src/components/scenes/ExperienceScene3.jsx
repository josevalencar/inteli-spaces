import React from 'react';
import { useSkyboxStore } from '../../store/useSkyboxStore';
import { useSceneStore } from '../../store/useSceneStore';
import ProceduralSkybox from '../ProceduralSkybox';

export const ExperienceScene3 = () => {
  const skyboxTextureObjects = useSkyboxStore((state) => state.skyboxTextureObjects);
  const getSkyboxIndex = useSceneStore((state) => state.getSkyboxIndex);
  
  const skyboxIndex = getSkyboxIndex();

  return (
    <>
      {/* Skybox for third experience */}
      <ProceduralSkybox
        currentTexture={skyboxTextureObjects[skyboxIndex]}
        previousTexture={null}
        isTransitioning={false}
        transitionDuration={0.8}
      />
      
      {/* Future: Add 3D objects, animations, interactions here */}
      {/* For now, just the skybox experience */}
    </>
  );
};
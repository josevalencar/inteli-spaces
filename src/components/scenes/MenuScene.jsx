import React from 'react';
import { Float } from '@react-three/drei';
import { Container, Root, Image } from "@react-three/uikit";
import { Defaults } from "@react-three/uikit-apfel";
import { UI } from '../UI';
import { useSkyboxStore } from '../../store/useSkyboxStore';
import { useSceneStore } from '../../store/useSceneStore';
import ProceduralSkybox from '../ProceduralSkybox';

export const MenuScene = ({ onStartParticles }) => {
  const skyboxTextureObjects = useSkyboxStore((state) => state.skyboxTextureObjects);
  const startExperience = useSceneStore((state) => state.startExperience);
  const getSkyboxIndex = useSceneStore((state) => state.getSkyboxIndex);
  
  const skyboxIndex = getSkyboxIndex();

  // Get skybox texture URLs for UIKit Images
  const skyboxTextures = useSkyboxStore((state) => state.skyboxTextures);
  
  // Floating preview positions closer to main UI
  const previewPositions = [
    { position: [-2.0, 2.25, -4.8], textureSrc: skyboxTextures[1] },
    { position: [2.0, 2.25, -4.8], textureSrc: skyboxTextures[2] },
    { position: [-2.0, -0.2, -4.9], textureSrc: skyboxTextures[3] },
    { position: [2.0, -0.2, -4.9], textureSrc: skyboxTextures[4] },
    { position: [-2.75, 1, -4.3], textureSrc: skyboxTextures[0] },
    { position: [2.75, 1, -4.3], textureSrc: skyboxTextures[1] },
  ];

  return (
    <>
      {/* Skybox for menu scene */}
      <ProceduralSkybox
        currentTexture={skyboxTextureObjects[skyboxIndex]}
        previousTexture={null}
        isTransitioning={false}
        transitionDuration={0.8}
      />
      
      {/* Floating skybox previews for design */}
      {previewPositions.map((preview, index) => (
        <group key={index} position={preview.position}>
          <Float rotationIntensity={0.1} speed={2} floatIntensity={0.3}>
            <Defaults>
              <Root>
                <Container>
                  <Image
                    width={142}
                    height={142}
                    objectFit="cover"
                    keepAspectRatio={false}
                    borderRadius={16}
                    src={preview.textureSrc}
                  />
                </Container>
              </Root>
            </Defaults>
          </Float>
        </group>
      ))}

      {/* UI positioned in XR space (following game-example pattern) */}
      <group position-y={1} position-z={-5}>
        <Float rotationIntensity={0.4} speed={1.5}>
          <UI 
            onStartParticles={onStartParticles}
            onStartExperience={startExperience}
          />
        </Float>
      </group>
    </>
  );
};
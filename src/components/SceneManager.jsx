import React, { useEffect } from 'react';
import { useSceneStore, SCENE_TYPES } from '../store/useSceneStore';
import { MenuScene } from './scenes/MenuScene';
import { ExperienceScene1 } from './scenes/ExperienceScene1';
import { ExperienceScene2 } from './scenes/ExperienceScene2';
import { ExperienceScene3 } from './scenes/ExperienceScene3';

export const SceneManager = ({ particleState, onStartParticles }) => {
  const currentScene = useSceneStore((state) => state.currentScene);
  const isTransitioning = useSceneStore((state) => state.isTransitioning);
  const transitionProgress = useSceneStore((state) => state.transitionProgress);
  const cleanup = useSceneStore((state) => state.cleanup);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Scene component mapping
  const sceneComponents = {
    [SCENE_TYPES.MENU]: (
      <MenuScene 
        onStartParticles={onStartParticles}
      />
    ),
    [SCENE_TYPES.EXPERIENCE_1]: <ExperienceScene1 />,
    [SCENE_TYPES.EXPERIENCE_2]: <ExperienceScene2 />,
    [SCENE_TYPES.EXPERIENCE_3]: <ExperienceScene3 />,
  };

  // Get current scene component
  const CurrentSceneComponent = sceneComponents[currentScene];

  // Transition overlay for smooth scene changes
  const TransitionOverlay = () => {
    if (!isTransitioning) return null;

    return (
      <mesh position={[0, 0, -10]} scale={[50, 50, 1]}>
        <planeGeometry />
        <meshBasicMaterial 
          color="black" 
          transparent
          opacity={Math.sin(transitionProgress * Math.PI)} // Fade in and out
        />
      </mesh>
    );
  };

  return (
    <>
      {/* Current scene */}
      <group opacity={isTransitioning ? 1 - transitionProgress : 1}>
        {CurrentSceneComponent}
      </group>

      {/* Transition overlay */}
      <TransitionOverlay />
    </>
  );
};
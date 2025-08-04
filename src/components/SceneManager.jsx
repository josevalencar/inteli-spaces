import React, { useEffect } from 'react';
import { useSceneStore, SCENE_TYPES } from '../store/useSceneStore';
import { MenuScene } from './scenes/MenuScene';
import { TourScene } from './scenes/TourScene';

export const SceneManager = ({ particleState, onStartParticles }) => {
  const currentScene = useSceneStore((state) => state.currentScene);
  const cleanup = useSceneStore((state) => state.cleanup);
  const returnToMenu = useSceneStore((state) => state.returnToMenu);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Scene component mapping - simplified
  const sceneComponents = {
    [SCENE_TYPES.MENU]: (
      <MenuScene 
        onStartParticles={onStartParticles}
      />
    ),
    [SCENE_TYPES.TOUR]: (
      <TourScene 
        onComplete={returnToMenu}
      />
    ),
  };

  // Get current scene component
  const CurrentSceneComponent = sceneComponents[currentScene];

  return CurrentSceneComponent;
};
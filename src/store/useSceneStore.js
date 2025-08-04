import { create } from 'zustand';
import { useSkyboxStore } from './useSkyboxStore';

// Scene types and configurations - simplified for skybox tour
export const SCENE_TYPES = {
  MENU: 'MENU',
  TOUR: 'TOUR',
};

// Scene configurations - simplified 
export const SCENE_CONFIG = {
  [SCENE_TYPES.MENU]: {
    name: 'Menu Scene',
    skyboxIndex: 0,
    duration: null, // Manual progression
    showUI: true,
  },
  [SCENE_TYPES.TOUR]: {
    name: 'Skybox Tour',
    skyboxIndex: 1, // Tour will manage its own skybox transitions
    duration: null, // Tour handles its own timing
    showUI: false,
  },
};

export const useSceneStore = create((set, get) => {

  return {
    // Current scene state
    currentScene: SCENE_TYPES.MENU,
    
    // Scene history for debugging
    sceneHistory: [SCENE_TYPES.MENU],
    
    // Scene actions
    setScene: (sceneType) => {
      const currentScene = get().currentScene;
      
      // Don't change if already in this scene
      if (currentScene === sceneType) {
        return;
      }

      console.log(`Scene change: ${currentScene} -> ${sceneType}`);
      
      // For TOUR scene, no transition overlay - let TourScene handle skybox transitions
      if (sceneType === SCENE_TYPES.TOUR) {
        set({
          currentScene: sceneType,
          sceneHistory: [...get().sceneHistory, sceneType],
        });
        return;
      }
      
      // For MENU scene, simple transition with skybox change
      if (sceneType === SCENE_TYPES.MENU) {
        // Set intro skybox when returning to menu
        useSkyboxStore.getState().setSkyboxIndex(0);
        set({
          currentScene: sceneType,
          sceneHistory: [...get().sceneHistory, sceneType],
        });
        return;
      }
    },

    startExperience: () => {
      // Called when "Experiência Inteli" button is clicked - start tour
      get().setScene(SCENE_TYPES.TOUR);
    },

    returnToMenu: () => {
      // Return to menu from tour
      get().setScene(SCENE_TYPES.MENU);
    },

    // Helper getters
    getCurrentSceneConfig: () => {
      const currentScene = get().currentScene;
      return SCENE_CONFIG[currentScene];
    },

    getSkyboxIndex: () => {
      const config = get().getCurrentSceneConfig();
      return config?.skyboxIndex || 0;
    },

    shouldShowUI: () => {
      const config = get().getCurrentSceneConfig();
      return config?.showUI || false;
    },

    // Cleanup function
    cleanup: () => {
      // No more timers to clean up - TourScene handles its own
    },
  };
});
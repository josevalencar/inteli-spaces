import { create } from 'zustand';

// Scene types and configurations
export const SCENE_TYPES = {
  MENU: 'MENU',
  EXPERIENCE_1: 'EXPERIENCE_1',
  EXPERIENCE_2: 'EXPERIENCE_2',
  EXPERIENCE_3: 'EXPERIENCE_3',
};

// Scene configurations with skybox and timing
export const SCENE_CONFIG = {
  [SCENE_TYPES.MENU]: {
    name: 'Menu Scene',
    skyboxIndex: 0,
    duration: null, // Manual progression
    showUI: true,
  },
  [SCENE_TYPES.EXPERIENCE_1]: {
    name: 'First Experience',
    skyboxIndex: 1,
    duration: 15000, // 15 seconds
    showUI: false,
  },
  [SCENE_TYPES.EXPERIENCE_2]: {
    name: 'Second Experience', 
    skyboxIndex: 2,
    duration: 12000, // 12 seconds
    showUI: false,
  },
  [SCENE_TYPES.EXPERIENCE_3]: {
    name: 'Third Experience',
    skyboxIndex: 3,
    duration: 10000, // 10 seconds
    showUI: false,
  },
};

// Scene progression order
export const SCENE_PROGRESSION = [
  SCENE_TYPES.MENU,
  SCENE_TYPES.EXPERIENCE_1,
  SCENE_TYPES.EXPERIENCE_2,
  SCENE_TYPES.EXPERIENCE_3,
];

export const useSceneStore = create((set, get) => {
  // Timer management
  let sceneTimer = null;
  
  const clearTimer = () => {
    if (sceneTimer) {
      clearTimeout(sceneTimer);
      sceneTimer = null;
    }
  };

  const startSceneTimer = (duration) => {
    clearTimer();
    if (duration) {
      sceneTimer = setTimeout(() => {
        get().nextScene();
      }, duration);
    }
  };

  return {
    // Current scene state
    currentScene: SCENE_TYPES.MENU,
    isTransitioning: false,
    transitionProgress: 0,
    
    // Scene history for debugging
    sceneHistory: [SCENE_TYPES.MENU],
    
    // Scene actions
    setScene: (sceneType) => {
      const currentScene = get().currentScene;
      
      // Don't change if already in this scene or transitioning
      if (currentScene === sceneType || get().isTransitioning) {
        return;
      }

      console.log(`Scene transition: ${currentScene} -> ${sceneType}`);
      
      set((state) => ({
        isTransitioning: true,
        transitionProgress: 0,
        sceneHistory: [...state.sceneHistory, sceneType],
      }));

      // Start transition animation
      const transitionDuration = 1000; // 1 second transition
      const startTime = Date.now();
      
      const updateTransition = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / transitionDuration, 1);
        
        set({ transitionProgress: progress });
        
        if (progress < 1) {
          requestAnimationFrame(updateTransition);
        } else {
          // Transition complete
          clearTimer();
          set({
            currentScene: sceneType,
            isTransitioning: false,
            transitionProgress: 0,
          });
          
          // Start timer for new scene if it has duration
          const sceneConfig = SCENE_CONFIG[sceneType];
          if (sceneConfig?.duration) {
            startSceneTimer(sceneConfig.duration);
          }
        }
      };
      
      updateTransition();
    },

    nextScene: () => {
      const currentScene = get().currentScene;
      const currentIndex = SCENE_PROGRESSION.indexOf(currentScene);
      const nextIndex = (currentIndex + 1) % SCENE_PROGRESSION.length;
      const nextScene = SCENE_PROGRESSION[nextIndex];
      
      get().setScene(nextScene);
    },

    startExperience: () => {
      // Called when "Experiência Inteli" button is clicked
      get().setScene(SCENE_TYPES.EXPERIENCE_1);
    },

    returnToMenu: () => {
      clearTimer();
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
      clearTimer();
    },
  };
});
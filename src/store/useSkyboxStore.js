import { create } from 'zustand';
import * as THREE from 'three';

const textureUrls = [
  "/textures/intro.png",
  "/textures/space.png",
  "/textures/the_adventures_of_sherlock_holmes_10.jpg",
  "/textures/meditations.jpg",
  "/textures/the_adventures_of_sherlock_holmes_9.jpg",
  "/textures/the_adventures_of_sherlock_holmes_1.jpg",
];

const loader = new THREE.TextureLoader();
const preloadedTextures = textureUrls.map(url => loader.load(url));

export const useSkyboxStore = create((set, get) => ({
  skyboxTextures: textureUrls,
  skyboxTextureObjects: preloadedTextures,
  currentSkyboxIndex: 0,
  previousSkyboxIndex: 0,
  transitionType: 0, // 0: grid (both), 1: FBM
  transitionSpeed: 2,
  
  setSkyboxIndex: (index) => {
    const state = get();
    if (index === state.currentSkyboxIndex) return;
    
    set((state) => ({ 
      previousSkyboxIndex: state.currentSkyboxIndex,
      currentSkyboxIndex: index
    }));
  },
  
  nextSkybox: () => {
    const state = get();
    const nextIndex = (state.currentSkyboxIndex + 1) % state.skyboxTextures.length;
    get().setSkyboxIndex(nextIndex);
  },
  
  toggleTransitionType: () => set((state) => ({
    transitionType: state.transitionType === 0 ? 1 : 0
  })),
  
  setTransitionType: (type) => set({ transitionType: type }),
})); 
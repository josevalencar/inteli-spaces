import { create } from 'zustand';
import * as THREE from 'three';

const textureUrls = [
  "/textures/the_adventures_of_sherlock_holmes_1.jpg",
  "/textures/space.png",
  "/textures/the_adventures_of_sherlock_holmes_10.jpg",
  "/textures/meditations.jpg",
  "/textures/the_adventures_of_sherlock_holmes_9.jpg"
];

const loader = new THREE.TextureLoader();
const preloadedTextures = textureUrls.map(url => loader.load(url));

export const useSkyboxStore = create((set) => ({
  skyboxTextures: textureUrls,
  skyboxTextureObjects: preloadedTextures,
  currentSkyboxIndex: 0,
  setSkyboxIndex: (index) => set({ currentSkyboxIndex: index }),
  nextSkybox: () => set((state) => ({
    currentSkyboxIndex: (state.currentSkyboxIndex + 1) % state.skyboxTextures.length
  })),
})); 
import React, { createContext, useContext, useState } from 'react';

const skyboxTextures = [
  "/textures/the_adventures_of_sherlock_holmes_1.jpg",
  "/textures/the_adventures_of_sherlock_holmes_9.jpg",
  "/textures/the_adventures_of_sherlock_holmes_10.jpg",
  "/textures/meditations.jpg"
];

const SkyboxContext = createContext();

export const useSkybox = () => {
  const context = useContext(SkyboxContext);
  if (!context) {
    throw new Error('useSkybox must be used within a SkyboxProvider');
  }
  return context;
};

export const SkyboxProvider = ({ children }) => {
  const [shouldTransition, setShouldTransition] = useState(false);
  const [targetTexture, setTargetTexture] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const triggerTransition = (textureUrl) => {
    console.log("SkyboxContext: triggerTransition called with", textureUrl);
    setTargetTexture(textureUrl);
    setShouldTransition(true);
  };

  const goToNextTexture = () => {
    const nextIndex = (currentIndex + 1) % skyboxTextures.length;
    setCurrentIndex(nextIndex);
    triggerTransition(skyboxTextures[nextIndex]);
  };

  const resetTransition = () => {
    console.log("SkyboxContext: resetTransition called");
    setShouldTransition(false);
    setTargetTexture(null);
  };

  console.log("SkyboxContext: Current state - shouldTransition:", shouldTransition, "targetTexture:", targetTexture, "currentIndex:", currentIndex);

  return (
    <SkyboxContext.Provider value={{
      shouldTransition,
      targetTexture,
      triggerTransition,
      resetTransition,
      goToNextTexture,
      skyboxTextures,
      currentIndex
    }}>
      {children}
    </SkyboxContext.Provider>
  );
}; 
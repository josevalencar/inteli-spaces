import React, { useState, useEffect } from 'react';
import { useSkyboxStore } from '../../store/useSkyboxStore';
import { useSceneStore } from '../../store/useSceneStore';
import ProceduralSkybox from '../ProceduralSkybox';
import { CustomGeometryParticles } from '../Particles';

export const ExperienceScene1 = () => {
  const skyboxTextureObjects = useSkyboxStore((state) => state.skyboxTextureObjects);
  const getSkyboxIndex = useSceneStore((state) => state.getSkyboxIndex);
  
  const skyboxIndex = getSkyboxIndex();

  // Particle system state (scene-specific)
  const [particleState, setParticleState] = useState({
    isActive: false,
    opacity: 0,
    phase: 'inactive' // 'inactive', 'fading-in', 'active', 'fading-out'
  });

  // Particle timing configuration
  const particleConfig = {
    fadeInDuration: 500,    // 2 seconds fade in
    activeDuration: 11000,   // 11 seconds active (scene is 15s total)
    fadeOutDuration: 2000    // 2 seconds fade out
  };

  // Start particles when scene begins
  useEffect(() => {
    // Auto-start particles when this scene becomes active
    setParticleState({
      isActive: true,
      opacity: 0,
      phase: 'fading-in'
    });

    // Cleanup when scene unmounts
    return () => {
      setParticleState({
        isActive: false,
        opacity: 0,
        phase: 'inactive'
      });
    };
  }, []);

  // Particle lifecycle management (same as before)
  useEffect(() => {
    if (!particleState.isActive) return;

    let timeoutId;
    
    if (particleState.phase === 'fading-in') {
      // Fade in over fadeInDuration
      const startTime = Date.now();
      
      const fadeIn = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / particleConfig.fadeInDuration, 1);
        
        setParticleState(prev => ({
          ...prev,
          opacity: progress
        }));
        
        if (progress < 1) {
          timeoutId = requestAnimationFrame(fadeIn);
        } else {
          // Start active phase
          setParticleState(prev => ({
            ...prev,
            phase: 'active'
          }));
        }
      };
      
      fadeIn();
      
    } else if (particleState.phase === 'active') {
      // Stay active for activeDuration
      timeoutId = setTimeout(() => {
        setParticleState(prev => ({
          ...prev,
          phase: 'fading-out'
        }));
      }, particleConfig.activeDuration);
      
    } else if (particleState.phase === 'fading-out') {
      // Fade out over fadeOutDuration
      const startTime = Date.now();
      const startOpacity = particleState.opacity;
      
      const fadeOut = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / particleConfig.fadeOutDuration, 1);
        
        setParticleState(prev => ({
          ...prev,
          opacity: startOpacity * (1 - progress)
        }));
        
        if (progress < 1) {
          timeoutId = requestAnimationFrame(fadeOut);
        } else {
          // Deactivate particles
          setParticleState({
            isActive: false,
            opacity: 0,
            phase: 'inactive'
          });
        }
      };
      
      fadeOut();
    }
    
    return () => {
      if (timeoutId) {
        if (typeof timeoutId === 'number') {
          clearTimeout(timeoutId);
        } else {
          cancelAnimationFrame(timeoutId);
        }
      }
    };
  }, [particleState.phase, particleState.isActive, particleConfig]);

  return (
    <>
      {/* Skybox for first experience */}
      <ProceduralSkybox
        currentTexture={skyboxTextureObjects[skyboxIndex]}
        previousTexture={null}
        isTransitioning={false}
        transitionDuration={0.8}
      />
      
      {/* Scene-specific particles with same configuration as before */}
      {particleState.isActive && (
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
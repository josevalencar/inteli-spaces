import React, { forwardRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { MathUtils } from 'three';
import { SkyboxTransitionMaterial } from './SkyboxTransitionMaterial';

// Extend the material to be used as JSX element
extend({ SkyboxTransitionMaterial });

export const SkyboxRenderer = forwardRef(({ 
  currentSkybox, 
  previousSkybox, 
  transitionType = 0, // 0: grid, 1: FBM
  transitionSpeed = 2,
  repeat = 3,
  smoothness = 0.3 
}, ref) => {

  useFrame((_, delta) => {
    if (!ref.current) return;

    // Animate progression from 0 to 1 (following transition-example pattern)
    ref.current.uProgression = MathUtils.lerp(
      ref.current.uProgression,
      1, // target progression is always 1
      delta * transitionSpeed
    );
    
    ref.current.uTransition = transitionType;
    ref.current.uRepeat = repeat;
    ref.current.uSmoothness = smoothness;
  });

  return (
    <mesh scale={[50, 50, 50]}>
      <sphereGeometry args={[1, 64, 64]} />
      <skyboxTransitionMaterial
        ref={ref}
        uSkyboxA={previousSkybox}
        uSkyboxB={currentSkybox}
        side={THREE.BackSide}
        toneMapped={false}
      />
    </mesh>
  );
});

SkyboxRenderer.displayName = 'SkyboxRenderer';
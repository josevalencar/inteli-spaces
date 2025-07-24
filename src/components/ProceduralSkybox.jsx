import React, { forwardRef, useEffect, useState } from "react";
import * as THREE from "three";

const Skybox = forwardRef(({
  currentTexture,
  previousTexture,
  isTransitioning,
  transitionDuration = 0.8
}, ref) => {
  const [transitionProgress, setTransitionProgress] = useState(1);

  useEffect(() => {
    if (isTransitioning) {
      setTransitionProgress(0);
      let start;
      const animate = (timestamp) => {
        if (!start) start = timestamp;
        const elapsed = (timestamp - start) / 1000;
        const progress = Math.min(elapsed / transitionDuration, 1);
        setTransitionProgress(progress);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    } else {
      setTransitionProgress(1);
    }
  }, [isTransitioning, transitionDuration, currentTexture, previousTexture]);

  return (
    <group>
      {/* Previous skybox (fade out) */}
      {isTransitioning && previousTexture && (
        <mesh scale={[9, 9, 9]}>
          <sphereGeometry args={[1, 128, 128]} />
          <meshBasicMaterial
            map={previousTexture}
            side={THREE.BackSide}
            toneMapped={false}
            transparent={true}
            opacity={1 - transitionProgress}
          />
        </mesh>
      )}
      {/* Current skybox (fade in) */}
      <mesh scale={[9, 9, 9]}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshBasicMaterial
          map={currentTexture}
          side={THREE.BackSide}
          toneMapped={false}
          transparent={isTransitioning}
          opacity={isTransitioning ? transitionProgress : 1}
        />
      </mesh>
    </group>
  );
});

Skybox.displayName = 'Skybox';

export default Skybox; 
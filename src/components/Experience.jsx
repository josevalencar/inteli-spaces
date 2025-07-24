import React, { useEffect, useRef, useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import Skybox from './ProceduralSkybox'
import { useSkyboxStore } from '../store/useSkyboxStore';

export const Experience = () => {
  const controls = useThree((state) => state.controls)
  const camera = useThree((state) => state.camera)
  const skyboxRef = useRef()
  const currentSkyboxIndex = useSkyboxStore((state) => state.currentSkyboxIndex);
  const skyboxTextureObjects = useSkyboxStore((state) => state.skyboxTextureObjects);

  // For smooth transition
  const [previousTexture, setPreviousTexture] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousIndex = useRef(currentSkyboxIndex);

  useEffect(() => {
    if (!controls) return
    controls.target.set(0, 0.5, 0)
    controls.update()
  }, [controls])

  // Detect skybox change and trigger transition
  useEffect(() => {
    if (previousIndex.current !== currentSkyboxIndex) {
      setPreviousTexture(skyboxTextureObjects[previousIndex.current]);
      setIsTransitioning(true);
      previousIndex.current = currentSkyboxIndex;
    }
  }, [currentSkyboxIndex, skyboxTextureObjects]);

  // End transition after duration and clear previousTexture
  useEffect(() => {
    if (isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setPreviousTexture(null);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  return (
    <>
      <OrbitControls makeDefault />
      <Skybox
        ref={skyboxRef}
        currentTexture={skyboxTextureObjects[currentSkyboxIndex]}
        previousTexture={previousTexture}
        isTransitioning={isTransitioning}
        transitionDuration={0.8}
      />
      <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  )
}

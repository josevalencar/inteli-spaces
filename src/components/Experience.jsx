import React, { useEffect } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import Skybox from './ProceduralSkybox'

export const Experience = () => {
  const controls = useThree((state) => state.controls)

  useEffect(() => {
    if (!controls) return

    controls.target.set(0, 0.5, 0)
    controls.update()
  }, [controls])

  return (
    <>
      <OrbitControls makeDefault />

      <Skybox textureUrl="/textures/the_adventures_of_sherlock_holmes_1.jpg" />

      <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  )
}

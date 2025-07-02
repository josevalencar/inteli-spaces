import React, { useEffect } from 'react'
import { OrbitControls, Gltf } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

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

      <Gltf src="models/uploads_files_4381654_LightBlueSky.glb" />

      <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  )
}

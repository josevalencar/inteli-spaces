import React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function Skybox({ textureUrl = "/textures/the_adventures_of_sherlock_holmes_1.jpg" }) {
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  return (
    <mesh scale={[9, 9, 9]}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        toneMapped={false}
      />
    </mesh>
  );
} 
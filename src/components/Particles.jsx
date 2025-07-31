import { useMemo, useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

import vertexShader from "../shaders/particles/vertex.glsl?raw";
import fragmentShader from "../shaders/particles/fragment.glsl?raw";

// Create a custom material class using drei's shaderMaterial utility
const CustomParticlesMaterial = shaderMaterial(
  {
    uTime: 0.0,
    uRadius: 2.0,
    uRotationSpeed: 0.3,
    uSizeMultiplier: 10.0,
    uBaseSize: 10.0,
    uOpacity: 1.0,
  },
  vertexShader,
  fragmentShader,
  (self) => {
    self.transparent = true;
    self.blending = THREE.AdditiveBlending;
    self.depthWrite = false;
  }
);
extend({ CustomParticlesMaterial });

export const CustomGeometryParticles = (props) => {
  const { 
    count, 
    rotationSpeed = 0.3, 
    sizeMultiplier = 10.0, 
    baseSize = 10.0,
    opacity = 1.0
  } = props;
  const radius = 8; // Increased radius significantly for more spread

  // This reference gives us direct access to our points
  const points = useRef();
  const materialRef = useRef();

  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Create a more spread-out distribution using multiple techniques
      let x, y, z;
      
      // Use different distribution patterns for variety
      if (i < count * 0.3) {
        // Spherical distribution for core area
        const distance = Math.sqrt(Math.random()) * radius * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        x = distance * Math.sin(phi) * Math.cos(theta);
        y = distance * Math.cos(phi);
        z = distance * Math.sin(phi) * Math.sin(theta);
      } else if (i < count * 0.7) {
        // Shell distribution for middle area
        const distance = radius * 0.5 + Math.random() * radius * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        x = distance * Math.sin(phi) * Math.cos(theta);
        y = distance * Math.cos(phi);
        z = distance * Math.sin(phi) * Math.sin(theta);
      } else {
        // Outer shell distribution for maximum spread
        const distance = radius * 0.8 + Math.random() * radius * 0.2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        x = distance * Math.sin(phi) * Math.cos(theta);
        y = distance * Math.cos(phi);
        z = distance * Math.sin(phi) * Math.sin(theta);
      }

      positions.set([x, y, z], i * 3);
    }

    return positions;
  }, [count]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uRotationSpeed = rotationSpeed;
      materialRef.current.uSizeMultiplier = sizeMultiplier;
      materialRef.current.uBaseSize = baseSize;
      materialRef.current.uOpacity = opacity;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      {/* Use the custom material as a JSX component */}
      <customParticlesMaterial 
        ref={materialRef} 
        uRadius={radius} 
        uRotationSpeed={rotationSpeed}
        uSizeMultiplier={sizeMultiplier}
        uBaseSize={baseSize}
        uOpacity={opacity}
      />
    </points>
  );
};

import { useThree, useFrame } from "@react-three/fiber";
import { useMemo, useEffect } from "react";
import * as THREE from 'three';

import transitionVertexShader from "../transitionVertex.glsl?raw";
import transitionFragmentShader from "../transitionFragment.glsl?raw";

export function TransitionManager({
  triggerTransition,
  inTransition,
  setInTransition,
  showBlackSkybox,
  setShowBlackSkybox,
  transitionProgress,
  setTransitionProgress,
}) {
  const { gl, size, scene: mainScene, camera: mainCamera } = useThree();

  const targetA = useMemo(() => new THREE.WebGLRenderTarget(size.width, size.height, {
    format: THREE.RGBAFormat,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  }), [size]);

  const targetB = useMemo(() => new THREE.WebGLRenderTarget(size.width, size.height, {
    format: THREE.RGBAFormat,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  }), [size]);

  const transitionScene = useMemo(() => new THREE.Scene(), []);
  const transitionCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

  const transitionMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      textureA: { value: targetA.texture },
      textureB: { value: targetB.texture },
      progress: { value: 0 }
    },
    vertexShader: transitionVertexShader,
    fragmentShader: transitionFragmentShader,
    depthWrite: false,
    depthTest: false,
  }), [targetA, targetB]);

  const transitionPlane = useMemo(() => new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    transitionMaterial
  ), [transitionMaterial]);

  useEffect(() => {
    transitionScene.add(transitionPlane);
    return () => {
      transitionScene.remove(transitionPlane);
    };
  }, [transitionScene, transitionPlane]);

  useFrame(() => {
    if (inTransition) {
      // Render Scene A to target A
      gl.setRenderTarget(targetA);
      gl.render(mainScene, mainCamera);

      // Render Scene B (black skybox) to target B
      gl.setRenderTarget(targetB);
      gl.setClearColor(0x000000, 1);
      gl.clear();
      // You would render your black skybox here if it were a complex scene
      // For a solid color, clearing with black is sufficient.

      gl.setRenderTarget(null);

      // Render transition scene
      transitionMaterial.uniforms.progress.value = transitionProgress;
      gl.render(transitionScene, transitionCamera);

      // Update progress
      setTransitionProgress(prev => {
        const newProgress = prev + 0.01;
        if (newProgress >= 1) {
          setInTransition(false);
          setShowBlackSkybox(true);
          return 1;
        }
        return newProgress;
      });
    }
  });

  return null; // This component doesn't render anything directly
}
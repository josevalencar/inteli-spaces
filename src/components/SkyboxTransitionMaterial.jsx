import { shaderMaterial } from "@react-three/drei";
import { resolveLygia } from "resolve-lygia";

export const SkyboxTransitionMaterial = shaderMaterial(
  {
    uProgression: 1,
    uSkyboxA: undefined,
    uSkyboxB: undefined,
    uTransition: 0, // 0: grid (both), 1: FBM
    uRepeat: 3,
    uSmoothness: 0.3,
  },
  // Vertex Shader
  resolveLygia(/*glsl*/ `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `),
  // Fragment Shader
  resolveLygia(/*glsl*/ `
    varying vec2 vUv;
    
    uniform sampler2D uSkyboxA;
    uniform sampler2D uSkyboxB;
    uniform float uProgression;
    uniform float uRepeat;
    uniform int uTransition;
    uniform float uSmoothness;

    #include "lygia/generative/fbm.glsl"

    float inverseLerp(float value, float minValue, float maxValue){
      return (value - minValue) / (maxValue - minValue);
    }

    float remap(float value, float inMin, float inMax, float outMin, float outMax){
      float t = inverseLerp(value, inMin, inMax);
      return mix(outMin, outMax, t);
    }

    void main() {
      // Use the built-in UV coordinates from the sphere geometry
      vec2 uv = vUv;
      
      // Sample both skyboxes using the sphere's UV coordinates
      vec4 skyboxA = texture2D(uSkyboxA, uv);
      vec4 skyboxB = texture2D(uSkyboxB, uv);

      float pct = 1.0;
      
      if (uTransition == 0) { // GRID PATTERN (Both)
        pct = mod(uv.x * uRepeat, 1.0) * mod(uv.y * uRepeat, 1.0);
      }
      else if (uTransition == 1) { // FBM NOISE
        pct = fbm(uv * uRepeat) * 0.5 + 0.5;
      }

      // Apply smooth progression with controllable smoothness
      float smoothProgression = remap(uProgression, 0.0, 1.0, -uSmoothness / 2.0, 1.0 + uSmoothness / 2.0);
      pct = smoothstep(smoothProgression, smoothProgression + uSmoothness, pct);

      // Mix the two skyboxes
      vec4 finalColor = mix(skyboxB, skyboxA, pct);

      gl_FragColor = finalColor;
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `)
);
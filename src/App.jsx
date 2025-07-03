import { Canvas } from "@react-three/fiber";
import { XR, XROrigin, createXRStore } from "@react-three/xr";
import { Float, Bvh } from "@react-three/drei";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";

export const store = createXRStore({
  controller: undefined,
  meshDetection: false,
  planeDetection: false,
});

function App() {
  return (
    <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
      <color attach="background" args={["#ececec"]} />
      <XR store={store}>
        <group position-y={1} position-z={-5}>
          <Float rotationIntensity={0.4} speed={1.5}>
            <UI />
          </Float>
        </group>
        <group position-y={-1}>
          <Bvh firstHitOnly>
            <Experience />
          </Bvh>
          <XROrigin position-z={0.2} />
        </group>
      </XR>
    </Canvas>
  );
}

export default App;
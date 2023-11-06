import { Canvas } from "@react-three/fiber";
import "./App.css";
import { OrbitControls, Bounds, useTexture } from "@react-three/drei";
import { useRef } from "react";
import { useSpring, animated, config } from "@react-spring/three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import dImage from "./assets/d.png";
import bImage from "./assets/b.png";
import uilImage from "./assets/uil.png";
import ranImage from "./assets/ran.png";
import ranImageFlipped from "./assets/ran-flipped.png";
import { OrderedDither } from "./ordered dither/OrderedDither";
import { EffectComposer, SSAO } from "@react-three/postprocessing";

function App() {
  const geometry = new RoundedBoxGeometry(1, 1, 1, 6, 0.1);

  const STEP_DURATION = 2000;

  function Meshes() {
    const boxGroup = useRef();
    const centerBlock = useRef();
    const [dTexture, bTexture, uilTexture, ranTexture, ranTextureFlipped] =
      useTexture([dImage, bImage, uilImage, ranImage, ranImageFlipped]);

    const { rotateX } = useSpring({
      from: { rotateX: 0 },
      to: [
        {
          rotateX: -Math.PI / 2,
          delay: STEP_DURATION,
        },
        {
          rotateX: -Math.PI,
          delay: STEP_DURATION,
        },
        {
          rotateX: -1.5 * Math.PI,
          delay: STEP_DURATION,
        },
        {
          rotateX: -2 * Math.PI,
          delay: STEP_DURATION,
        },
      ],
      config: config.wobbly,
      loop: true,
    });

    return (
      <Bounds fit observe margin={1}>
        <group ref={boxGroup}>
          <mesh position={[-1.1, 0, 0]} geometry={geometry}>
            <meshLambertMaterial map={bTexture} />
          </mesh>
          <animated.mesh
            rotation-x={rotateX}
            ref={centerBlock}
            geometry={geometry}
          >
            <meshLambertMaterial attach="material-0" />
            <meshLambertMaterial attach="material-1" />
            <meshLambertMaterial attach="material-2" map={uilTexture} />
            <meshLambertMaterial attach="material-3" map={uilTexture} />
            <meshLambertMaterial attach="material-4" map={ranTexture} />
            <meshLambertMaterial attach="material-5" map={ranTextureFlipped} />
          </animated.mesh>
          <mesh position={[1.1, 0, 0]} geometry={geometry}>
            <meshLambertMaterial map={dTexture} />
          </mesh>
        </group>
      </Bounds>
    );
  }

  return (
    <>
      <Canvas>
        <OrbitControls makeDefault />
        <ambientLight intensity={2} color="#F8147F" />
        <directionalLight intensity={2} position={[0, 10, 20]} />
        <Meshes />
        <EffectComposer>
          <OrderedDither invertDither={false} darkThreshold={10} />
          <SSAO
            radius={0.4}
            intensity={50}
            luminanceInfluence={0.4}
            color="#F8147F"
          />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;

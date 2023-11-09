import { Canvas } from "@react-three/fiber";
import "./App.css";
import { OrbitControls, Bounds, useTexture, Environment } from "@react-three/drei";
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
import { useControls } from 'leva'

function App() {
  // const { backgroundColor, ambientColor, ambientIntensitiy, blockColor } = useControls({
  //   backgroundColor: '#00FFFF',
  //   ambientColor: '#35d9d9',
  //   ambientIntensitiy: 6,
  //   blockColor: '#FFFFFF'
  // })
  const { backgroundColor, ambientColor, ambientIntensitiy, blockColor } = {
    backgroundColor: '#00FFFF',
    ambientColor: '#35d9d9',
    ambientIntensitiy: 6,
    blockColor: '#FFFFFF'
  };

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
          <mesh castShadow receiveShadow position={[-1.1, 0, 0]} geometry={geometry}>
            <meshStandardMaterial metalness={1} roughness={.2} color={blockColor} map={bTexture} />
          </mesh>
          <animated.mesh
            rotation-x={rotateX}
            ref={centerBlock}
            geometry={geometry}
            castShadow receiveShadow
          >
            <meshStandardMaterial metalness={1} roughness={.2} attach="material-0" color={blockColor} />
            <meshStandardMaterial metalness={1} roughness={.2} attach="material-1" color={blockColor} />
            <meshStandardMaterial metalness={1} roughness={.2} attach="material-2" color={blockColor} map={uilTexture} />
            <meshStandardMaterial metalness={1} roughness={.2} attach="material-3" color={blockColor} map={uilTexture} />
            <meshStandardMaterial metalness={1} roughness={.2} attach="material-4" color={blockColor} map={ranTexture} />
            <meshStandardMaterial metalness={1} roughness={.2} attach="material-5" color={blockColor} map={ranTextureFlipped} />
          </animated.mesh>
          <mesh castShadow receiveShadow position={[1.1, 0, 0]} geometry={geometry}>
            <meshStandardMaterial metalness={1} roughness={.2} color={blockColor} map={dTexture} />
          </mesh>
        </group>
      </Bounds>
    );
  }

  return (
    <>
      <Canvas shadows>
        {/* <OrbitControls makeDefault /> */}
        <Environment preset="warehouse" background blur={0.5} />
        <Meshes />
        <EffectComposer>
          <OrderedDither invertDither={true} darkThreshold={25} />
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

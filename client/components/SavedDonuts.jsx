import {useFrame, useLoader} from "@react-three/fiber";
import {TextureLoader} from "three/src/loaders/TextureLoader";
import DonutModel from "./DonutModel";
import {useRef} from "react";
import {useGLTF} from "@react-three/drei";

import * as THREE from "three";

function Donuts(props) {
  const { glazeColorCode, baseColorCode, gold } = props;

  const { materials } = useGLTF("./donut_cat/scene.gltf");
  const goldCoat = useLoader(TextureLoader, "gold.jpg");

  const baseMaterial = materials["Material.003"].clone();
  baseMaterial.color = new THREE.Color(gold == 0 ? baseColorCode : "#FFFFFF");

  const glazeMaterial = materials["Material.003"].clone();
  glazeMaterial.color = new THREE.Color(gold == 0 ? glazeColorCode : "#FFFFFF");

  const ref = useRef();
  useFrame((_, delta) => {
    ref.current.rotation.y += 0.5 * delta;
    ref.current.rotation.x += 0.5 * delta;
  });

  return (
    <mesh ref={ref}>
      <ambientLight />
      <spotLight intensity={0.5} />

      <DonutModel
        scale={[1.5, 1.5, 1.5]}
        glazeColor={glazeMaterial}
        baseColor={baseMaterial}
        texture={gold == 1 ? goldCoat : null}
      />
    </mesh>
  );
}

export default Donuts;

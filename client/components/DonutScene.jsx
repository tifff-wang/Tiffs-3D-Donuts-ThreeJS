import { motion } from "framer-motion-3d";
import DonutModel from "./DonutModel.jsx";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function DonutScene(props) {
  const { glazeColor, baseColor, texture } = props;

  const ref = useRef();

  const scale = 1.1;

  useFrame((_, delta) => {
    ref.current.rotation.y += 0.5 * delta;
  });

  return (
    <>
      <motion.mesh ref={ref} whileHover={{ scale: 1.2 }}>
        <ambientLight />
        <spotLight intensity={0.5} />

        <DonutModel
          scale={[scale, scale, scale]}
          glazeColor={glazeColor}
          baseColor={baseColor}
          texture={texture}
        />
      </motion.mesh>
    </>
  );
}

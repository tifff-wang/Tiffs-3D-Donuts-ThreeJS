import { Canvas } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import Interfaces from "../components/Interfaces";
import DonutScene from "../components/DonutScene";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  const { materials } = useGLTF("./donut_cat/scene.gltf");

  const [glazeColor, setGlazeColor] = useState(
    materials["Material.004"].clone(),
  );

  const [donutMarginLeft, setDonutMarginLeft] = useState("0px");
  const [donutMarginTop, setDonutMarginTop] = useState("160px");
  const [baseColor, setBaseColor] = useState(materials["Material.003"].clone());
  const donutDivWidth = 800;
  const [texture, setTexture] = useState("");

  const canvasRef = useRef();

  useEffect(() => {
    const scrollHandler = () => {
      requestAnimationFrame(() => {
        const pageHeight =
          document.height !== undefined
            ? document.height
            : document.body.offsetHeight;
        const pageWidth =
          document.width !== undefined
            ? document.width
            : document.body.offsetWidth;
        const yOffset = window.scrollY;
        const presentage = yOffset / pageHeight;
        const maxMargin = pageWidth - donutDivWidth;

        setDonutMarginLeft(`${maxMargin * presentage * 0.7}px`);
        setDonutMarginTop(`${160 + 30 * presentage}px`);
      });
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [donutMarginLeft, donutMarginTop]);

  function updateGlaze(hex) {
    const newMaterials = glazeColor.clone();
    newMaterials.color = new THREE.Color(hex);
    setGlazeColor(newMaterials);
  }

  function updateBase(hex) {
    const newMaterials = baseColor.clone();
    newMaterials.color = new THREE.Color(hex);
    setBaseColor(newMaterials);
  }

  function updateTexture(newTexture) {
    setTexture(newTexture);
  }

  // Forward pointer events from the overlay to the canvas
  const onPointerMove = (e) => {
    canvasRef.current.dispatchEvent(
      new MouseEvent("pointermove", e.nativeEvent),
    );
  };

  const onPointerDown = (e) => {
    canvasRef.current.dispatchEvent(
      new MouseEvent("pointerdown", e.nativeEvent),
    );
  };

  const onPointerUp = (e) => {
    canvasRef.current.dispatchEvent(new MouseEvent("pointerup", e.nativeEvent));
  };

  return (
    <div style={{ position: "relative", scrollBehavior: "smooth" }}>
      <Canvas
        ref={canvasRef}
        shadows
        camera={{
          fov: 3.2,
          near: 0.1,
          far: 1000,
          position: [3, 3, 5],
        }}
        style={{
          position: "fixed",
          height: "100vh",
          width: `${donutDivWidth}px`,
          marginLeft: donutMarginLeft,
          marginTop: donutMarginTop,
          background: "rgba(0, 0, 200, 0)",
        }}
      >
        <OrbitControls enableZoom={false} enablePan={false} />

        <DonutScene
          glazeColor={glazeColor}
          baseColor={baseColor}
          texture={texture}
        />
      </Canvas>

      <div
        style={{ position: "absolute", top: 0, left: 0 }}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <QueryClientProvider client={queryClient}>
          <Interfaces
            updateGlaze={updateGlaze}
            updateBase={updateBase}
            updateTexture={updateTexture}
          />
        </QueryClientProvider>
      </div>
    </div>
  );
}

export default App;

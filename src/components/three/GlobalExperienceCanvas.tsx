"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { useSectionWorld } from "./useSectionWorld";

const WorldScene = dynamic(
  () => import("./WorldScene").then((module) => ({ default: module.WorldScene })),
  { ssr: false }
);

function Loader() {
  return (
    <div className="absolute inset-0 bg-transparent" />
  );
}

export function GlobalExperienceCanvas() {
  const reducedMotion = useReducedMotion();
  const world = useSectionWorld();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.06),transparent_28%)]" />
      <Suspense fallback={<Loader />}>
        <Canvas dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }} shadows={false}>
          <PerspectiveCamera makeDefault position={[0, 0.12, 7]} fov={34} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 4, 4]} intensity={0.9} color="#dbeafe" />
          <directionalLight position={[-3, -2, 2]} intensity={0.26} color="#7dd3fc" />
          <WorldScene
            activeSection={world.activeSection}
            pointer={world.pointer}
            reducedMotion={Boolean(reducedMotion)}
            sectionProgress={world.sectionProgress}
            scrollProgress={world.scrollProgress}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

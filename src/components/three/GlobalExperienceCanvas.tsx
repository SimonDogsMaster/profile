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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(125,211,252,0.08),transparent_24%),radial-gradient(circle_at_50%_78%,rgba(13,27,72,0.34),transparent_36%)]" />
      <Suspense fallback={<Loader />}>
        <Canvas dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }} shadows={false}>
          <PerspectiveCamera makeDefault position={[0, 0.06, 8.4]} fov={42} />
          <ambientLight intensity={0.22} />
          <directionalLight position={[2, 3, 5]} intensity={0.18} color="#dbeafe" />
          <WorldScene
            activeSection={world.activeSection}
            pointer={world.pointer}
            reducedMotion={Boolean(reducedMotion)}
            sectionProgress={world.sectionProgress}
            scrollProgress={world.scrollProgress}
            scrollVelocity={world.scrollVelocity}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

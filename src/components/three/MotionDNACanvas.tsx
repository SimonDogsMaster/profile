"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const MotionDNAObject = dynamic(
  () =>
    import("./MotionDNAObject").then((module) => ({
      default: module.MotionDNAObject
    })),
  { ssr: false }
);

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-44 w-44 rounded-full border border-cyan-300/12 bg-cyan-300/6 blur-[1px]" />
    </div>
  );
}

function MobileFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px] sm:rounded-[34px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.16),transparent_42%)]" />
      <div className="absolute left-[18%] top-[22%] h-28 w-40 rounded-[22px] border border-white/10 bg-white/[0.03]" />
      <div className="absolute bottom-[18%] right-[16%] h-32 w-44 rounded-[24px] border border-cyan-300/12 bg-cyan-300/[0.04]" />
      <div className="absolute left-[24%] top-1/2 h-px w-[52%] -translate-y-1/2 bg-gradient-to-r from-cyan-300/60 via-white/50 to-cyan-300/20" />
      <div className="absolute left-[34%] top-[44%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/80 shadow-[0_0_24px_rgba(103,232,249,0.28)]" />
      <div className="absolute left-[56%] top-[52%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/80 shadow-[0_0_24px_rgba(103,232,249,0.28)]" />
    </div>
  );
}

export function MotionDNACanvas() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <MobileFallback />;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[28px] sm:rounded-[34px]">
      <Suspense fallback={<Loader />}>
        <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }} shadows={false}>
          <PerspectiveCamera makeDefault position={[0, 0.1, 6]} fov={28} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 3, 4]} intensity={1.1} color="#dbeafe" />
          <directionalLight position={[-3, -2, 2]} intensity={0.4} color="#7dd3fc" />
          <MotionDNAObject reducedMotion={Boolean(reducedMotion)} />
        </Canvas>
      </Suspense>
    </div>
  );
}

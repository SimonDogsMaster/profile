"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { useScrollRig } from "./useScrollRig";

const FloatingIDE = dynamic(
  () => import("./FloatingIDE").then((module) => ({ default: module.FloatingIDE })),
  { ssr: false }
);

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="glass-panel flex w-[88%] max-w-lg animate-pulse flex-col gap-4 rounded-[32px] p-6">
        <div className="h-5 w-24 rounded-full bg-white/8" />
        <div className="h-24 rounded-[24px] bg-white/6" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-20 rounded-[20px] bg-white/6" />
          <div className="h-20 rounded-[20px] bg-white/6" />
        </div>
      </div>
    </div>
  );
}

function MobileFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[36px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.12),transparent_36%)]" />
      <div className="absolute -left-12 top-16 h-44 w-44 rounded-full bg-cyan-400/10 blur-[80px]" />
      <div className="absolute bottom-12 right-0 h-48 w-48 rounded-full bg-sky-400/10 blur-[90px]" />
    </div>
  );
}

export function SceneCanvas() {
  const { progress, offset } = useScrollRig();
  const reducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const media = window.matchMedia("(max-width: 767px)");
    const onMediaChange = () => setIsMobile(media.matches);
    onMediaChange();
    media.addEventListener("change", onMediaChange);

    return () => media.removeEventListener("change", onMediaChange);
  }, []);

  if (!isMounted) {
    return <Loader />;
  }

  if (isMobile) {
    return <MobileFallback />;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[36px]">
      <Suspense fallback={<Loader />}>
        <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }} shadows={false}>
          <PerspectiveCamera makeDefault position={[0, 0.1, 5.6]} fov={36} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 4, 4]} intensity={1.2} color="#dbeafe" />
          <directionalLight position={[-4, -2, 1]} intensity={0.35} color="#7dd3fc" />
          <FloatingIDE progress={progress} offset={offset} reducedMotion={Boolean(reducedMotion)} />
        </Canvas>
      </Suspense>
    </div>
  );
}

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
    <div className="absolute inset-0 p-5">
      <div className="glass-panel flex h-full flex-col rounded-[32px] border border-white/10 p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 rounded-[24px] border border-white/8 bg-[#09101f] p-4 font-mono text-xs leading-6 text-slate-300">
          <p className="text-cyan-300">const portfolio = {`{`}</p>
          <p className="pl-4 text-slate-300">
            name: <span className="text-amber-200">&quot;Simon&quot;</span>,
          </p>
          <p className="pl-4 text-slate-300">
            role: <span className="text-amber-200">&quot;Front-end Engineer&quot;</span>,
          </p>
          <p className="pl-4 text-slate-300">
            stack: <span className="text-amber-200">[&quot;Next.js&quot;, &quot;R3F&quot;, &quot;Motion&quot;]</span>
          </p>
          <p className="text-cyan-300">{`}`}</p>
        </div>
      </div>
    </div>
  );
}

export function SceneCanvas() {
  const { progress, offset } = useScrollRig();
  const reducedMotion = useReducedMotion();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
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
    <div
      className="absolute inset-0"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        setPointer({ x, y });
      }}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <Suspense fallback={<Loader />}>
        <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }} shadows={false}>
          <PerspectiveCamera makeDefault position={[0, 0.15, 5.8]} fov={34} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 4, 4]} intensity={1.2} color="#dbeafe" />
          <directionalLight position={[-4, -2, 1]} intensity={0.35} color="#7dd3fc" />
          <FloatingIDE progress={progress} offset={offset} reducedMotion={Boolean(reducedMotion)} pointer={pointer} />
        </Canvas>
      </Suspense>
    </div>
  );
}

"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 22, mass: 0.2 });

  return (
    <div className="theme-chip theme-border fixed right-4 top-1/2 z-40 hidden h-36 -translate-y-1/2 rounded-full border p-1 md:flex">
      <div className="relative w-1 overflow-hidden rounded-full bg-[var(--panel-hover)]">
        <motion.div
          style={{ scaleY, transformOrigin: "top" }}
          className="absolute inset-x-0 top-0 h-full rounded-full bg-gradient-to-b from-cyan-300 via-sky-300 to-[var(--accent-strong)]"
        />
      </div>
    </div>
  );
}

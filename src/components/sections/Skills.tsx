"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform
} from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

import { siteContent } from "@/content/site";

import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { sectionHeadingMotion, sectionItemMotion } from "./sectionMotion";

type StackIcon = (typeof siteContent.stackIcons)[number];

const gravityAnchors = [
  { x: 13, y: 19 },
  { x: 34, y: 18 },
  { x: 63, y: 17 },
  { x: 85, y: 20 },
  { x: 9, y: 46 },
  { x: 30, y: 31 },
  { x: 46, y: 41 },
  { x: 77, y: 41 },
  { x: 60, y: 68 },
  { x: 16, y: 82 },
  { x: 43, y: 82 },
  { x: 74, y: 82 },
  { x: 88, y: 82 }
] as const;
const gravityDepths = [0.74, 0.78, 0.76, 0.72, 0.9, 0.88, 1.08, 1.12, 1.02, 0.84, 0.88, 0.9, 0.82] as const;

function SkillGlyph({
  short,
  accent,
  glow,
  name,
  iconPath
}: {
  short: string;
  accent: string;
  glow: string;
  name: string;
  iconPath?: string;
}) {
  return (
    <div
      className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[20px] border"
      style={{
        borderColor: "color-mix(in srgb, var(--border) 82%, transparent)",
        background: `radial-gradient(circle at 30% 24%, ${glow}, transparent 52%), linear-gradient(180deg, color-mix(in srgb, ${accent} 12%, rgba(255,255,255,0.03)), rgba(255,255,255,0.02))`
      }}
    >
      <div
        className="absolute inset-[7px] rounded-[14px] opacity-90"
        style={{
          border: `1px solid color-mix(in srgb, ${accent} 44%, transparent)`,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))"
        }}
      />
      <div
        className="absolute left-2.5 top-2 h-2 w-2 rounded-full blur-[2px]"
        style={{ backgroundColor: accent }}
      />
      {iconPath ? (
        <div className="relative flex h-11 w-11 items-center justify-center rounded-[14px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(234,239,248,0.94))] shadow-[0_10px_24px_rgba(4,8,24,0.24),inset_0_1px_0_rgba(255,255,255,0.95)]">
          <Image
            src={iconPath}
            alt={name}
            width={34}
            height={34}
            className="h-[34px] w-[34px] object-contain"
          />
        </div>
      ) : (
        <span
          className="relative text-lg font-semibold tracking-[0.14em]"
          style={{ color: accent }}
        >
          {short}
        </span>
      )}
    </div>
  );
}

function GravityToken({
  item,
  index,
  anchor,
  pointer
}: {
  item: StackIcon;
  index: number;
  anchor: { x: number; y: number };
  pointer: { x: number; y: number } | null;
}) {
  const reducedMotion = useReducedMotion();
  const translateX = useMotionValue(0);
  const translateY = useMotionValue(0);
  const rotate = useMotionValue(0);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(1);
  const x = useSpring(translateX, { stiffness: 140, damping: 18, mass: 0.55 });
  const y = useSpring(translateY, { stiffness: 140, damping: 18, mass: 0.55 });
  const r = useSpring(rotate, { stiffness: 120, damping: 18, mass: 0.6 });
  const s = useSpring(scale, { stiffness: 180, damping: 18, mass: 0.5 });
  const o = useSpring(opacity, { stiffness: 130, damping: 20, mass: 0.6 });
  const shadow = useTransform(
    s,
    [1, 1.08],
    [
      "0 18px 40px rgba(4, 8, 24, 0.18)",
      "0 24px 54px rgba(4, 8, 24, 0.34)"
    ]
  );

  useAnimationFrame((time) => {
    const depth = gravityDepths[index] ?? 1;
    const isTopOrbit = index <= 3;

    if (reducedMotion) {
      translateX.set(0);
      translateY.set(0);
      rotate.set(0);
      scale.set(depth);
      opacity.set(isTopOrbit ? 0.72 : 0.84 + depth * 0.1);
      return;
    }

    const t = time / 1000;
    const ambientX =
      Math.sin(t * (0.78 + depth * 0.14) + index * 0.8) *
      (6 + depth * 2.8);
    const ambientY =
      Math.cos(t * (0.92 + depth * 0.16) + index * 0.65) *
      (7 + depth * 3.4);
    let targetX = ambientX;
    let targetY = ambientY;
    let targetRotate = Math.sin(t * 0.7 + index) * 1.8;
    let targetScale = depth;
    let targetOpacity = (isTopOrbit ? 0.66 : 0.8) + depth * 0.12;

    if (isTopOrbit) {
      targetY -= 4;
    }

    if (pointer) {
      const deltaX = pointer.x - anchor.x;
      const deltaY = pointer.y - anchor.y;
      const distance = Math.hypot(deltaX, deltaY);
      const gravityRadius = 25;
      const attraction = Math.max(0, 1 - distance / gravityRadius);
      targetX += deltaX * attraction * (0.34 + depth * 0.12);
      targetY += deltaY * attraction * (0.24 + depth * 0.14);
      targetRotate += deltaX * attraction * 0.07;
      targetScale = depth + attraction * 0.075;
      targetOpacity = Math.min(1, 0.82 + depth * 0.12 + attraction * 0.1);
      if (isTopOrbit) {
        targetOpacity = Math.min(0.88, 0.7 + depth * 0.08 + attraction * 0.08);
      }

      // Neighbor repulsion adds a soft "collision" feel when tokens gather around the cursor.
      for (let neighborIndex = 0; neighborIndex < gravityAnchors.length; neighborIndex += 1) {
        if (neighborIndex === index) {
          continue;
        }

        const neighbor = gravityAnchors[neighborIndex];
        const separationX = anchor.x - neighbor.x;
        const separationY = anchor.y - neighbor.y;
        const separationDistance = Math.hypot(separationX, separationY);

        if (separationDistance > 38) {
          continue;
        }

        const sharedPull = Math.max(
          0,
          1 - Math.hypot(pointer.x - neighbor.x, pointer.y - neighbor.y) / 28
        );

        if (sharedPull <= 0) {
          continue;
        }

        const repulsion = ((attraction + sharedPull) * 0.5 * 10) / Math.max(separationDistance, 8);
        targetX += (separationX / separationDistance) * repulsion * 8;
        targetY += (separationY / separationDistance) * repulsion * 6;
      }
    }

    translateX.set(targetX);
    translateY.set(targetY);
    rotate.set(targetRotate);
    scale.set(targetScale);
    opacity.set(targetOpacity);
  });

  return (
    <motion.div
      className="absolute left-0 top-0 hidden w-[188px] -translate-x-1/2 -translate-y-1/2 md:block lg:w-[202px] xl:w-[214px]"
      style={{
        left: `${anchor.x}%`,
        top: `${anchor.y}%`,
        x,
        y,
        rotate: r,
        scale: s,
        opacity: o,
        boxShadow: shadow
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: reducedMotion ? 1 : 1.06, y: reducedMotion ? 0 : -4 }}
    >
      <div
        className="theme-chip theme-border relative overflow-hidden rounded-[22px] border bg-[linear-gradient(180deg,rgba(15,20,45,0.9),rgba(8,12,28,0.84))] p-3 backdrop-blur-xl lg:p-3.5"
      >
        <div className="pointer-events-none absolute left-3 top-3 h-3.5 w-3.5 border-l border-t border-white/10" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-3.5 w-3.5 border-b border-r border-white/10" />
        <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/8 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.18em] text-white/28">
          N{String(index + 1).padStart(2, "0")}
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(circle at 16% 20%, ${item.glow}, transparent 32%), linear-gradient(90deg, transparent, color-mix(in srgb, ${item.accent} 12%, transparent), transparent)`
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-8 bottom-0 h-16 opacity-60 blur-2xl"
          style={{
            background: `radial-gradient(circle at center, color-mix(in srgb, ${item.accent} 16%, transparent), transparent 70%)`
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${item.accent} 78%, white 10%), transparent)`
          }}
        />
        <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-2">
          <motion.div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.accent, boxShadow: `0 0 18px ${item.accent}` }}
            animate={{ opacity: [0.35, 1, 0.4], scale: [1, 1.2, 1] }}
            transition={{
              duration: 2.1,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.12,
              ease: "easeInOut"
            }}
          />
        </div>
        <div className="relative flex items-center gap-3.5">
          <SkillGlyph
            name={item.name}
            short={item.short}
            accent={item.accent}
            glow={item.glow}
            iconPath={item.iconPath}
          />
          <div className="min-w-0 flex-1">
            <p className="theme-text text-[0.98rem] font-medium tracking-[-0.02em] lg:text-[1.05rem]">
              {item.name}
            </p>
            <p className="theme-muted mt-1 text-xs uppercase tracking-[0.26em]">
              {item.category}
            </p>
            <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-white/7">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${item.accent}, rgba(255,255,255,0.94))`
                }}
                animate={{ width: ["42%", "78%", "48%"] }}
                transition={{
                  duration: 5.4 + index * 0.16,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/22">
              <span>Link Stable</span>
              <span className="h-px flex-1 bg-white/8" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MobileToken({ item }: { item: StackIcon }) {
  return (
    <div className="theme-chip theme-border relative overflow-hidden rounded-[22px] border p-4 md:hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 14% 18%, ${item.glow}, transparent 28%)`
        }}
      />
      <div className="relative flex items-center gap-4">
        <SkillGlyph
          name={item.name}
          short={item.short}
          accent={item.accent}
          glow={item.glow}
          iconPath={item.iconPath}
        />
        <div>
          <p className="theme-text text-base font-medium">{item.name}</p>
          <p className="theme-muted mt-1 text-xs uppercase tracking-[0.22em]">
            {item.category}
          </p>
        </div>
      </div>
    </div>
  );
}

function CubeReactor() {
  return (
    <div className="absolute left-1/2 top-[57%] h-[20rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 opacity-90">
      <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 bg-cyan-300/10 blur-3xl" />
      <svg
        viewBox="0 0 320 240"
        className="absolute left-1/2 top-1/2 h-[15rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cubeEdge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="50%" stopColor="rgba(103,232,249,0.88)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0.14)" />
          </linearGradient>
          <linearGradient id="cubeEdgeSoft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(103,232,249,0.22)" />
          </linearGradient>
          <radialGradient id="cubeCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(186, 230, 253, 0.75)" />
            <stop offset="35%" stopColor="rgba(103, 232, 249, 0.22)" />
            <stop offset="100%" stopColor="rgba(103, 232, 249, 0)" />
          </radialGradient>
          <filter id="cubeGlow">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse cx="160" cy="120" rx="100" ry="64" fill="url(#cubeCoreGlow)" opacity="0.34" />

        <g filter="url(#cubeGlow)">
          <path d="M160 52 L218 86 L160 120 L102 86 Z" fill="none" stroke="url(#cubeEdge)" strokeWidth="1.5" />
          <path d="M160 92 L218 126 L160 160 L102 126 Z" fill="none" stroke="url(#cubeEdge)" strokeWidth="1.6" />
          <path d="M102 86 L102 126" fill="none" stroke="url(#cubeEdgeSoft)" strokeWidth="1.3" />
          <path d="M218 86 L218 126" fill="none" stroke="url(#cubeEdgeSoft)" strokeWidth="1.3" />
          <path d="M160 52 L160 92" fill="none" stroke="url(#cubeEdgeSoft)" strokeWidth="1.3" />
          <path d="M160 120 L160 160" fill="none" stroke="url(#cubeEdgeSoft)" strokeWidth="1.3" />
          <path d="M102 86 L160 92 L218 86" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <path d="M102 126 L160 120 L218 126" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        </g>

        <motion.path
          d="M160 52 L218 86 L160 120 L102 86 Z"
          fill="none"
          stroke="rgba(186,230,253,0.9)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="18 220"
          animate={{ strokeDashoffset: [0, -238] }}
          transition={{ duration: 6.8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.path
          d="M160 92 L218 126 L160 160 L102 126 Z"
          fill="none"
          stroke="rgba(103,232,249,0.82)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="16 220"
          animate={{ strokeDashoffset: [0, 236] }}
          transition={{ duration: 5.9, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.path
          d="M102 86 L102 126 M218 86 L218 126 M160 52 L160 92 M160 120 L160 160"
          fill="none"
          stroke="rgba(125,211,252,0.8)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="12 160"
          animate={{ strokeDashoffset: [0, -172] }}
          transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 22, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          style={{ originX: "160px", originY: "120px" }}
        >
          <path d="M160 38 L248 90 L160 142 L72 90 Z" fill="none" stroke="rgba(186,230,253,0.08)" strokeWidth="1" />
        </motion.g>

        <circle cx="160" cy="120" r="5.5" fill="rgba(186,230,253,0.95)" />
        <circle cx="160" cy="120" r="14" fill="none" stroke="rgba(186,230,253,0.16)" strokeWidth="1" />
      </svg>
    </div>
  );
}

export function SkillsSection() {
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = fieldRef.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }

    setPointer({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100
    });
  };

  return (
    <section id="skills" className="relative py-20 sm:py-24 lg:py-28">
      <Container className="relative">
        <motion.div
          className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          {...sectionHeadingMotion}
        >
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="system-label">Capability / 03</span>
              <span className="system-rule" />
            </div>
            <p className="system-kicker mb-3">Skills</p>
            <h2 className="theme-text text-3xl font-semibold tracking-tight sm:text-5xl">
              Systems for building clear, high-fidelity interfaces.
            </h2>
          </div>
          <p className="theme-muted max-w-md text-sm leading-7">
            I work across production UI, immersive marketing, and interface
            motion without treating any of them as separate disciplines.
          </p>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
          {siteContent.skills.map((group, index) => (
            <motion.div key={group.title} {...sectionItemMotion(index)}>
              <Card className="h-full rounded-[28px] p-6 sm:rounded-[30px] sm:p-7">
                <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-cyan-400/70">
                  Capability {index + 1}
                </p>
                <p className="theme-text text-lg font-medium">{group.title}</p>
                <p className="theme-muted mt-3 text-sm leading-7">
                  {group.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="theme-chip theme-border theme-soft rounded-full border px-3.5 py-2 text-sm sm:px-4"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
          <Card className="relative overflow-hidden rounded-[30px] p-6 sm:p-7">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.16),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.08),transparent_18%),linear-gradient(180deg,rgba(10,16,38,0.06),transparent_40%)]" />
            <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-400/72">
                  Stack Signals
                </p>
                <h3 className="theme-text mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Languages and tools I have shipped with repeatedly.
                </h3>
              </div>
              <p className="theme-muted max-w-md text-sm leading-7">
                A quick scan of the stack I keep returning to across product UI,
                launch builds, internal tools, and desktop workflows.
              </p>
            </div>

            <div className="mt-8 grid gap-3 md:hidden">
              {siteContent.stackIcons.map((item) => (
                <MobileToken key={item.name} item={item} />
              ))}
            </div>

            <div
              ref={fieldRef}
              className="relative mt-10 hidden h-[760px] overflow-hidden rounded-[34px] border border-white/8 bg-[radial-gradient(circle_at_center,rgba(22,30,68,0.28),transparent_44%),linear-gradient(180deg,rgba(7,11,26,0.22),rgba(5,8,19,0.08))] md:block"
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setPointer(null)}
            >
              <div className="pointer-events-none absolute inset-0">
                <div
                  className="absolute left-6 top-6 h-28 w-40 border border-white/6 opacity-50"
                  style={{ clipPath: "polygon(0 0, 88% 0, 100% 18%, 100% 100%, 0 100%)" }}
                />
                <div
                  className="absolute right-8 top-14 h-24 w-32 border border-cyan-200/8 opacity-40"
                  style={{ clipPath: "polygon(0 16%, 14% 0, 100% 0, 100% 100%, 0 100%)" }}
                />
                <div
                  className="absolute bottom-8 left-10 h-24 w-44 border border-white/5 opacity-35"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 82%, 88% 100%, 0 100%)" }}
                />
                <div className="absolute left-8 top-8 rounded-full border border-cyan-100/8 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-cyan-100/42">
                  Signal Mesh
                </div>
                <div className="absolute right-8 top-8 rounded-full border border-white/8 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-white/34">
                  Reactive Lattice
                </div>
                <div className="absolute left-[7%] top-[52%] text-[10px] uppercase tracking-[0.28em] text-white/18">
                  Orbit Band A3
                </div>
                <div className="absolute right-[8%] bottom-[18%] text-[10px] uppercase tracking-[0.28em] text-white/16">
                  Node Drift 07
                </div>
                {pointer ? (
                  <>
                    <motion.div
                      className="absolute h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/12 blur-3xl"
                      style={{ left: `${pointer.x}%`, top: `${pointer.y}%` }}
                      animate={{ opacity: [0.45, 0.72, 0.45], scale: [0.92, 1.08, 0.92] }}
                      transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/20"
                      style={{ left: `${pointer.x}%`, top: `${pointer.y}%` }}
                      animate={{ scale: [0.88, 1.25, 0.88], opacity: [0.2, 0.58, 0.2] }}
                      transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                  </>
                ) : null}
                <div className="absolute inset-x-[14%] top-[23%] h-px bg-[linear-gradient(90deg,transparent,rgba(125,211,252,0.12),transparent)]" />
                <div className="absolute inset-x-[18%] bottom-[16%] h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)]" />
                <div className="absolute inset-y-[18%] left-[52%] w-px bg-[linear-gradient(180deg,transparent,rgba(103,232,249,0.14),transparent)]" />
                <div className="absolute inset-y-[24%] left-[44%] w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.06),transparent)]" />
                <div className="absolute left-1/2 top-[57%] h-[28rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(103,232,249,0.04),rgba(59,130,246,0.025)_34%,transparent_70%)]" />
                <div className="absolute left-1/2 top-[57%] h-[18rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(ellipse_at_center,black_36%,transparent_78%)] bg-[repeating-radial-gradient(ellipse_at_center,rgba(148,163,184,0.08)_0_1px,transparent_1px_36px)] opacity-18" />
                <CubeReactor />
                <div className="absolute left-[38%] top-[43%] h-3 w-3 rounded-full border border-cyan-100/18" />
                <div className="absolute left-[62%] top-[62%] h-3 w-3 rounded-full border border-cyan-100/14" />
                <div className="absolute left-[46%] top-[67%] h-2 w-2 rounded-full bg-white/14" />
                <div className="absolute left-[48.8%] top-[51.2%] text-[9px] uppercase tracking-[0.28em] text-cyan-100/34">
                  Flux
                </div>
                <div className="absolute left-[55.2%] top-[60.8%] text-[9px] uppercase tracking-[0.28em] text-white/24">
                  Core
                </div>
                <div className="absolute left-1/2 top-[55%] h-[26rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-22 [mask-image:radial-gradient(ellipse_at_center,black_38%,transparent_82%)]">
                  <div className="absolute inset-0 bg-[repeating-radial-gradient(ellipse_at_center,rgba(148,163,184,0.08)_0_1px,transparent_1px_42px)]" />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:84px_84px] opacity-28 [mask-image:radial-gradient(circle_at_center,black_34%,transparent_86%)]" />
                <div className="absolute inset-x-6 bottom-0 h-36 rounded-[32px] bg-[linear-gradient(180deg,transparent,rgba(7,10,22,0.12)_26%,rgba(7,10,22,0.34))]" />
                <div className="absolute inset-x-[20%] bottom-[10%] h-px bg-[linear-gradient(90deg,transparent,rgba(103,232,249,0.12),transparent)]" />
                <div className="absolute left-[24%] bottom-[13%] h-20 w-20 rounded-full bg-white/4 blur-3xl" />
                <div className="absolute right-[20%] bottom-[12%] h-24 w-24 rounded-full bg-cyan-300/5 blur-3xl" />
              </div>

              {siteContent.stackIcons.map((item, index) => (
                <GravityToken
                  key={item.name}
                  item={item}
                  index={index}
                  anchor={gravityAnchors[index]}
                  pointer={pointer}
                />
              ))}
            </div>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
}

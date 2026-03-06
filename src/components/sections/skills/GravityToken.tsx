import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { KeyboardEvent, PointerEvent } from "react";

import { SkillGlyph } from "./SkillGlyph";
import { PointerPosition, StackIcon } from "./types";

export const gravityAnchors = [
  { x: 11, y: 21 },
  { x: 33, y: 21 },
  { x: 64, y: 20 },
  { x: 87, y: 21 },
  { x: 8, y: 46 },
  { x: 28, y: 34 },
  { x: 73, y: 35 },
  { x: 88, y: 46 },
  { x: 16, y: 86 },
  { x: 39, y: 86 },
  { x: 59, y: 86 },
  { x: 74, y: 86 },
  { x: 92, y: 72 },
] as const;

const gravityDepths = [
  0.74, 0.78, 0.76, 0.72, 0.9, 0.88, 1.08, 1.12, 1.02, 0.84, 0.88, 0.9, 0.82,
] as const;

type GravityTokenProps = {
  item: StackIcon;
  index: number;
  anchor: { x: number; y: number };
  pointer: PointerPosition;
  isActive: boolean;
  isPinned: boolean;
  forceInteractiveMotion?: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onTogglePin: () => void;
};

export function GravityToken({
  item,
  index,
  anchor,
  pointer,
  isActive,
  isPinned,
  forceInteractiveMotion = false,
  onHoverStart,
  onHoverEnd,
  onTogglePin,
}: GravityTokenProps) {
  const reducedMotionPreference = useReducedMotion();
  const reducedMotion = reducedMotionPreference && !forceInteractiveMotion;
  const translateX = useMotionValue(0);
  const translateY = useMotionValue(0);
  const rotate = useMotionValue(0);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(1);
  const x = useSpring(translateX, { stiffness: 124, damping: 24, mass: 0.62 });
  const y = useSpring(translateY, { stiffness: 124, damping: 24, mass: 0.62 });
  const r = useSpring(rotate, { stiffness: 96, damping: 22, mass: 0.66 });
  const s = useSpring(scale, { stiffness: 156, damping: 22, mass: 0.58 });
  const o = useSpring(opacity, { stiffness: 118, damping: 24, mass: 0.64 });
  const shadow = useTransform(
    s,
    [1, 1.08],
    ["0 14px 30px rgba(4, 8, 24, 0.14)", "0 18px 38px rgba(4, 8, 24, 0.24)"],
  );

  useAnimationFrame((time) => {
    const depth = gravityDepths[index] ?? 1;
    const isTopOrbit = index <= 3;

    if (reducedMotion) {
      translateX.set(0);
      translateY.set(0);
      rotate.set(0);
      scale.set(depth);
      opacity.set(isTopOrbit ? 0.66 : 0.74 + depth * 0.08);
      return;
    }

    const t = time / 1000;
    const tailDamping = index >= 11 ? 0.58 : 1;
    const ambientX =
      Math.sin(t * (0.56 + depth * 0.12) + index * 0.8) *
      (4 + depth * 1.6) *
      tailDamping;
    const ambientY =
      Math.cos(t * (0.64 + depth * 0.14) + index * 0.65) *
      (4.6 + depth * 2.1) *
      tailDamping;
    let targetX = ambientX;
    let targetY = ambientY;
    let targetRotate = Math.sin(t * 0.5 + index) * 1.1;
    let targetScale = depth;
    let targetOpacity = (isTopOrbit ? 0.62 : 0.76) + depth * 0.1;
    const chargeWave = (Math.sin(t * 0.86 - index * 0.55) + 1) * 0.5;
    targetOpacity *= 0.72 + chargeWave * 0.28;

    if (isTopOrbit) {
      targetY -= 4;
    }
    if (isActive) {
      const pullStrength = isPinned ? 0.16 : 0.09;
      targetX += (50 - anchor.x) * pullStrength;
      targetY += (57 - anchor.y) * pullStrength;
      targetScale += isPinned ? 0.08 : 0.05;
      targetOpacity = Math.min(0.97, targetOpacity + (isPinned ? 0.2 : 0.12));
    }

    if (pointer) {
      const deltaX = pointer.x - anchor.x;
      const deltaY = pointer.y - anchor.y;
      const distance = Math.hypot(deltaX, deltaY);
      const gravityRadius = 25;
      const attraction = Math.max(0, 1 - distance / gravityRadius);
      targetX += deltaX * attraction * (0.34 + depth * 0.12) * tailDamping;
      targetY += deltaY * attraction * (0.2 + depth * 0.1) * tailDamping;
      targetRotate += deltaX * attraction * 0.045;
      targetScale = depth + attraction * 0.045;
      targetOpacity = Math.min(0.95, targetOpacity + attraction * 0.12);
      if (isTopOrbit) {
        targetOpacity = Math.min(0.82, targetOpacity + attraction * 0.08);
      }

      // Neighbor repulsion adds a soft "collision" feel when tokens gather around the cursor.
      for (
        let neighborIndex = 0;
        neighborIndex < gravityAnchors.length;
        neighborIndex += 1
      ) {
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
          1 - Math.hypot(pointer.x - neighbor.x, pointer.y - neighbor.y) / 28,
        );

        if (sharedPull <= 0) {
          continue;
        }

        const repulsion =
          ((attraction + sharedPull) * 0.5 * 10) /
          Math.max(separationDistance, 8);
        targetX += (separationX / separationDistance) * repulsion * 8;
        targetY += (separationY / separationDistance) * repulsion * 6;
      }
    }

    // Keep cards clear of the cube core area.
    const cubeCenter = { x: 50, y: 57 };
    const nextX = anchor.x + targetX;
    const nextY = anchor.y + targetY;
    const toCenterX = nextX - cubeCenter.x;
    const toCenterY = nextY - cubeCenter.y;
    const centerDistance = Math.hypot(toCenterX, toCenterY);
    const exclusionRadius = 19;
    if (centerDistance < exclusionRadius) {
      const push = (1 - centerDistance / exclusionRadius) * 9;
      const safeDistance = Math.max(centerDistance, 0.001);
      targetX += (toCenterX / safeDistance) * push;
      targetY += (toCenterY / safeDistance) * push;
    }

    translateX.set(targetX);
    translateY.set(targetY);
    rotate.set(targetRotate);
    scale.set(targetScale);
    opacity.set(targetOpacity);
  });

  return (
    <motion.div
      className="absolute left-0 top-0 hidden w-[148px] -translate-x-1/2 -translate-y-1/2 transform-gpu md:block lg:w-[162px] xl:w-[174px]"
      style={{
        left: `${anchor.x}%`,
        top: `${anchor.y}%`,
        x,
        y,
        rotate: r,
        scale: s,
        opacity: o,
        boxShadow: shadow,
        willChange: "transform, opacity",
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isPinned}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.55,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ scale: reducedMotion ? 1 : 1.03, y: reducedMotion ? 0 : -1.8 }}
      onPointerEnter={onHoverStart}
      onPointerLeave={onHoverEnd}
      onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();
        onTogglePin();
      }}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onTogglePin();
        }
      }}
    >
      <div
        className="theme-chip theme-border relative overflow-hidden rounded-[18px] border p-2 backdrop-blur-lg lg:p-2.5"
        style={{
          borderColor: isActive
            ? `color-mix(in srgb, ${item.accent} 58%, rgba(226,232,240,0.46))`
            : "rgba(255,255,255,0.1)",
          background: isActive
            ? "linear-gradient(180deg, rgba(18,25,52,0.96), rgba(10,14,32,0.92))"
            : "linear-gradient(180deg, rgba(15,20,45,0.86), rgba(8,12,28,0.82))",
        }}
      >
        <div
          className="pointer-events-none absolute inset-y-3 left-1 w-[2px] rounded-full"
          style={{
            background: `linear-gradient(180deg, transparent, ${item.accent}, transparent)`,
            opacity: isActive ? 0.92 : 0.65,
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-[linear-gradient(180deg,rgba(148,163,184,0.08),transparent)]" />
        <div className="pointer-events-none absolute left-2 top-2 h-2.5 w-2.5 border-l border-t border-white/8" />
        <div className="pointer-events-none absolute bottom-2 right-2 h-2.5 w-2.5 border-b border-r border-white/8" />
        <div className="pointer-events-none absolute right-2 top-2 inline-flex items-center rounded-full border border-white/8 bg-white/[0.03] px-1.5 py-0.5 text-[7px] uppercase tracking-[0.17em] text-white/28">
          N{String(index + 1).padStart(2, "0")}
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at 16% 20%, ${item.glow}, transparent 32%), linear-gradient(90deg, transparent, color-mix(in srgb, ${item.accent} 12%, transparent), transparent)`,
            opacity: isActive ? 0.55 : 0.38,
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-8 bottom-0 h-16 opacity-34 blur-2xl"
          style={{
            background: `radial-gradient(circle at center, color-mix(in srgb, ${item.accent} 16%, transparent), transparent 70%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${item.accent} 78%, white 10%), transparent)`,
          }}
        />
        <div className="relative flex items-center gap-2">
          <div className="origin-left scale-[0.82]">
            <SkillGlyph
              name={item.name}
              short={item.short}
              accent={item.accent}
              glow={item.glow}
              iconPath={item.iconPath}
            />
          </div>
          <div className="min-w-0 flex-1 pr-7">
            <p className="theme-text whitespace-nowrap text-[0.84rem] font-semibold tracking-[-0.01em] lg:text-[0.9rem]">
              {item.name}
            </p>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-1.5 py-0.5">
              <span
                className="h-1 w-1 rounded-full"
                style={{ backgroundColor: item.accent }}
              />
              <p className="theme-muted text-[8px] uppercase tracking-[0.2em] text-white/64">
                {item.category}
              </p>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full shadow-[0_0_14px_rgba(125,211,252,0.25)]"
                style={{
                  background: `linear-gradient(90deg, ${item.accent}, rgba(255,255,255,0.94))`,
                }}
                animate={{ width: ["52%", "72%", "56%"] }}
                transition={{
                  duration: 8 + index * 0.2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              />
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-[7px] uppercase tracking-[0.15em] text-white/20">
              <span>Link Stable</span>
              <span className="h-px flex-1 bg-white/7" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

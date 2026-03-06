import { motion, useReducedMotion } from "framer-motion";
import { PointerEvent, RefObject, useEffect, useState } from "react";

import { siteContent } from "@/content/site";

import { Card } from "@/components/ui/Card";

import { CubeReactor } from "./CubeReactor";
import { gravityAnchors, GravityToken } from "./GravityToken";
import { MobileToken } from "./MobileToken";
import { PointerPosition } from "./types";

const coreRoutes = [
  { from: 0, path: "M11 21 L19 21 L19 32 L36 32 L36 48 L44.8 53.8", to: { x: 44.8, y: 53.8 } },
  { from: 1, path: "M33 21 L33 30 L40 30 L40 46 L45.4 53.6", to: { x: 45.4, y: 53.6 } },
  { from: 2, path: "M64 20 L64 30 L59 30 L59 46 L54.6 53.6", to: { x: 54.6, y: 53.6 } },
  { from: 3, path: "M87 21 L80 21 L80 34 L62 34 L62 48 L54.9 54.4", to: { x: 54.9, y: 54.4 } },
  { from: 4, path: "M8 46 L17 46 L17 54 L36 54 L44.2 56", to: { x: 44.2, y: 56 } },
  { from: 5, path: "M28 34 L35 34 L35 45 L42 45 L42 51 L45.6 54", to: { x: 45.6, y: 54 } },
  { from: 6, path: "M73 35 L66 35 L66 45 L60 45 L60 51 L54.4 54", to: { x: 54.4, y: 54 } },
  { from: 7, path: "M88 46 L79 46 L79 55 L63 55 L55.8 56", to: { x: 55.8, y: 56 } },
  { from: 8, path: "M16 86 L24 86 L24 74 L37 74 L37 62 L44.8 58.2", to: { x: 44.8, y: 58.2 } },
  { from: 9, path: "M39 86 L39 76 L44 76 L44 61 L45.8 58.3", to: { x: 45.8, y: 58.3 } },
  { from: 10, path: "M59 86 L59 76 L56 76 L56 61 L54.2 58.3", to: { x: 54.2, y: 58.3 } },
  { from: 11, path: "M74 86 L74 76 L65 76 L65 62 L55.2 58.2", to: { x: 55.2, y: 58.2 } },
  { from: 12, path: "M92 72 L82 72 L82 64 L68 64 L68 58 L54.8 57.3", to: { x: 54.8, y: 57.3 } },
] as const;

type StackSignalsCardProps = {
  fieldRef: RefObject<HTMLDivElement | null>;
  pointer: PointerPosition;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
};

export function StackSignalsCard({
  fieldRef,
  pointer,
  onPointerMove,
  onPointerLeave,
}: StackSignalsCardProps) {
  const reducedMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);
  const [stableMotionMode, setStableMotionMode] = useState(false);
  const activeIndex = pinnedIndex ?? hoveredIndex;
  const activeItem =
    activeIndex !== null ? (siteContent.stackIcons[activeIndex] ?? null) : null;
  const activeAccent = activeItem?.accent ?? null;
  const activeRoute = coreRoutes.find((route) => route.from === activeIndex);
  const cubeBoost = activeIndex !== null;
  const isBackRoute = (route: (typeof coreRoutes)[number]) => route.to.y >= 57;
  const backRoutes = coreRoutes.filter(isBackRoute);
  const frontRoutes = coreRoutes.filter((route) => !isBackRoute(route));
  const activeRouteIsBack = activeRoute ? isBackRoute(activeRoute) : false;
  const preferStableMotion = Boolean(reducedMotion) || stableMotionMode;

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const isWindows = /\bWindows\b/i.test(ua);
    const isChrome = /\bChrome\/\d+/i.test(ua);
    const isOtherChromium = /\bEdg\/|\bOPR\/|\bBrave\//i.test(ua);
    setStableMotionMode(isWindows && isChrome && !isOtherChromium);
  }, []);

  return (
    <motion.div
      className="mt-6 sm:mt-8"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
    >
      <Card className="relative overflow-hidden rounded-[30px] border border-cyan-100/12 bg-[linear-gradient(165deg,rgba(12,19,38,0.96),rgba(7,13,28,0.96))] p-6 shadow-[0_24px_80px_rgba(2,6,20,0.62),inset_0_1px_0_rgba(226,242,255,0.06)] sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(125,211,252,0.14),transparent_32%),radial-gradient(circle_at_84%_18%,rgba(147,197,253,0.1),transparent_26%),linear-gradient(180deg,rgba(7,13,32,0.16),transparent_44%)]" />
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
          className="relative mt-8 hidden h-[580px] overflow-hidden rounded-[34px] border border-cyan-100/12 bg-[radial-gradient(circle_at_50%_56%,rgba(74,161,228,0.12),transparent_50%),radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.06),transparent_42%),radial-gradient(circle_at_84%_24%,rgba(103,232,249,0.06),transparent_38%),linear-gradient(180deg,rgba(8,14,30,0.96),rgba(5,10,22,0.98))] shadow-[inset_0_1px_0_rgba(200,232,255,0.08),inset_0_-28px_68px_rgba(1,5,14,0.72)] md:block"
          onPointerMove={onPointerMove}
          onPointerLeave={() => {
            onPointerLeave();
            setHoveredIndex(null);
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setPinnedIndex(null);
            }
          }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_58%,rgba(84,161,255,0.16),transparent_56%),radial-gradient(ellipse_at_24%_20%,rgba(56,189,248,0.08),transparent_44%),radial-gradient(ellipse_at_86%_24%,rgba(59,130,246,0.08),transparent_40%)]" />
            <div className="absolute inset-4 rounded-[28px] border border-cyan-100/10 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.08)]" />
            <div className="absolute inset-6 rounded-[24px] border border-white/5" />
            <div
              className="absolute left-6 top-6 h-28 w-40 border border-white/6 opacity-50"
              style={{
                clipPath: "polygon(0 0, 88% 0, 100% 18%, 100% 100%, 0 100%)",
              }}
            />
            <div
              className="absolute right-8 top-14 h-24 w-32 border border-cyan-200/8 opacity-40"
              style={{
                clipPath: "polygon(0 16%, 14% 0, 100% 0, 100% 100%, 0 100%)",
              }}
            />
            <div
              className="absolute bottom-8 left-10 h-24 w-44 border border-white/5 opacity-35"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 82%, 88% 100%, 0 100%)",
              }}
            />
            <div className="absolute left-8 top-8 rounded-full border border-cyan-100/8 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-cyan-100/34">
              Stack Signals
            </div>
            <div className="absolute right-8 top-8 rounded-full border border-white/8 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-white/34">
              Production Surface
            </div>
            <div className="absolute left-8 top-[4.4rem] text-[10px] uppercase tracking-[0.22em] text-white/28">
              Core Stack / Repeatedly Shipped
            </div>
            <div className="absolute right-8 top-[4.4rem] text-right text-[10px] uppercase tracking-[0.22em] text-cyan-100/36">
              13 Nodes / Stable
            </div>
            <div className="absolute bottom-6 left-8 z-10 hidden flex-wrap items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white/40 lg:inline-flex">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/80" />
                UI/CSS
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400/80" />
                Frameworks
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80" />
                Languages
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
                Platform/Data
              </span>
            </div>
            <svg
              className="absolute inset-0 h-full w-full opacity-72"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="coreRouteBase"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="rgba(186,230,253,0.16)" />
                  <stop offset="52%" stopColor="rgba(103,232,249,0.45)" />
                  <stop offset="100%" stopColor="rgba(186,230,253,0.14)" />
                </linearGradient>
                <linearGradient
                  id="coreRoutePulse"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="rgba(226,246,255,0)" />
                  <stop offset="48%" stopColor="rgba(226,246,255,0.95)" />
                  <stop offset="100%" stopColor="rgba(226,246,255,0)" />
                </linearGradient>
                <filter id="routeGlow">
                  <feGaussianBlur stdDeviation="0.3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <mask id="routeOcclusionMask">
                  <rect width="100" height="100" fill="white" />
                  <path
                    d="M50 51.4 L54.2 53.8 L54.2 61.2 L50 63.6 L45.8 61.2 L45.8 53.8 Z"
                    fill="black"
                  />
                </mask>
              </defs>
              <g mask="url(#routeOcclusionMask)">
                {backRoutes.map((route) => (
                  <path
                    key={`route-base-${route.from}`}
                    d={route.path}
                    fill="none"
                    stroke="url(#coreRouteBase)"
                    strokeWidth="0.22"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={
                      activeRoute
                        ? activeRoute.from === route.from
                          ? 0.9
                          : 0.25
                        : 0.85
                    }
                  />
                ))}
                {backRoutes.map((route, index) =>
                  preferStableMotion ? (
                    <path
                      key={`route-pulse-${route.from}`}
                      d={route.path}
                      fill="none"
                      stroke="url(#coreRoutePulse)"
                      strokeWidth="0.26"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="5 12"
                    className="stack-route-flow"
                    style={{
                        animationDuration: `${8.2 + (index % 4) * 0.45}s, 3.4s`,
                        opacity: activeRoute
                          ? activeRoute.from === route.from
                            ? 0.5
                            : 0.1
                          : 0.32,
                      }}
                    />
                  ) : (
                    <motion.path
                      key={`route-pulse-${route.from}`}
                      d={route.path}
                      fill="none"
                      stroke="url(#coreRoutePulse)"
                      strokeWidth="0.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="6 10"
                      filter="url(#routeGlow)"
                      animate={{
                        strokeDashoffset: [0, -64],
                        opacity: activeRoute
                          ? activeRoute.from === route.from
                            ? [0.35, 0.58, 0.88, 0.42]
                            : [0.08, 0.15, 0.22, 0.12]
                          : [0.22, 0.5, 0.84, 0.28],
                      }}
                      transition={{
                        duration: 6.2 + (index % 4) * 0.45,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                  ),
                )}
                {activeRoute && activeRouteIsBack ? (
                  <>
                    <path
                      d={activeRoute.path}
                      fill="none"
                      stroke={activeAccent ?? "rgba(226,246,255,0.62)"}
                      strokeOpacity={activeAccent ? 0.64 : 1}
                      strokeWidth="0.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <motion.path
                      d={activeRoute.path}
                      fill="none"
                      stroke={activeAccent ?? "rgba(226,246,255,0.98)"}
                      strokeOpacity={activeAccent ? 0.95 : 1}
                      strokeWidth="0.65"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="12 40"
                      animate={{ strokeDashoffset: [56, 0] }}
                      transition={{
                        duration: pinnedIndex !== null ? 1.55 : 1.95,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                  </>
                ) : null}
                {coreRoutes.map((route) => (
                  <circle
                    key={`route-node-${route.from}`}
                    cx={gravityAnchors[route.from].x}
                    cy={gravityAnchors[route.from].y}
                    r="0.55"
                    fill="rgba(186,230,253,0.6)"
                  />
                ))}
              </g>
              <circle cx="50" cy="57" r="1.15" fill="rgba(226,246,255,0.72)" />
              <circle
                cx="50"
                cy="57"
                r="2.2"
                fill="none"
                stroke="rgba(125,211,252,0.28)"
                strokeWidth="0.2"
              />
            </svg>
            {pointer ? (
              <>
                <motion.div
                  className="absolute h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/8 blur-3xl"
                  style={{ left: `${pointer.x}%`, top: `${pointer.y}%` }}
                  animate={{
                    opacity: [0.35, 0.52, 0.35],
                    scale: [0.96, 1.04, 0.96],
                  }}
                  transition={{
                    duration: 3.8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/14"
                  style={{ left: `${pointer.x}%`, top: `${pointer.y}%` }}
                  animate={{
                    scale: [0.9, 1.1, 0.9],
                    opacity: [0.16, 0.34, 0.16],
                  }}
                  transition={{
                    duration: 3.4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </>
            ) : null}
            <div className="absolute left-1/2 top-[57%] h-[28rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(103,232,249,0.04),rgba(59,130,246,0.025)_34%,transparent_70%)]" />
            <div className="absolute left-1/2 top-[57%] h-[18rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(ellipse_at_center,black_36%,transparent_78%)] bg-[repeating-radial-gradient(ellipse_at_center,rgba(148,163,184,0.08)_0_1px,transparent_1px_36px)] opacity-12" />
            {!preferStableMotion ? (
              <>
                <motion.div
                  className="absolute left-[51%] top-[48%] h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(226,246,255,0.2),rgba(125,211,252,0.08)_34%,transparent_68%)] blur-2xl"
                  animate={{
                    opacity: [0.22, 0.38, 0.22],
                    scale: [0.94, 1.03, 0.95],
                  }}
                  transition={{
                    duration: 7.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute left-[50%] top-[50%] h-[19rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(170,228,255,0.14),transparent_62%)] blur-3xl"
                  animate={{
                    opacity: [0.08, 0.22, 0.08],
                    x: [-4, 5, -3],
                    y: [2, -3, 1],
                  }}
                  transition={{
                    duration: 11,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </>
            ) : (
              <div className="absolute left-1/2 top-1/2 h-[20rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(170,228,255,0.12),transparent_64%)] blur-2xl" />
            )}
            <CubeReactor energyColor={activeAccent} isActive={cubeBoost} preferStableMotion={preferStableMotion} />
            <svg
              className="absolute inset-0 h-full w-full opacity-78"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="frontRouteBase"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="rgba(186,230,253,0.2)" />
                  <stop offset="52%" stopColor="rgba(103,232,249,0.52)" />
                  <stop offset="100%" stopColor="rgba(186,230,253,0.16)" />
                </linearGradient>
                <linearGradient
                  id="frontRoutePulse"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="rgba(226,246,255,0)" />
                  <stop offset="48%" stopColor="rgba(226,246,255,0.98)" />
                  <stop offset="100%" stopColor="rgba(226,246,255,0)" />
                </linearGradient>
                <filter id="frontRouteGlow">
                  <feGaussianBlur stdDeviation="0.25" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {frontRoutes.map((route) => (
                <path
                  key={`front-base-${route.from}`}
                  d={route.path}
                  fill="none"
                  stroke="url(#frontRouteBase)"
                  strokeWidth="0.24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={
                    activeRoute
                      ? activeRoute.from === route.from
                        ? 0.92
                        : 0.22
                      : 0.86
                  }
                />
              ))}
              {frontRoutes.map((route, index) =>
                preferStableMotion ? (
                  <path
                    key={`front-pulse-${route.from}`}
                    d={route.path}
                    fill="none"
                    stroke="url(#frontRoutePulse)"
                    strokeWidth="0.26"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="5 12"
                    className="stack-route-flow"
                    style={{
                      animationDuration: `${8 + (index % 4) * 0.42}s, 3.4s`,
                      opacity: activeRoute
                        ? activeRoute.from === route.from
                          ? 0.52
                          : 0.1
                        : 0.34,
                    }}
                  />
                ) : (
                  <motion.path
                    key={`front-pulse-${route.from}`}
                    d={route.path}
                    fill="none"
                    stroke="url(#frontRoutePulse)"
                    strokeWidth="0.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="6 10"
                    filter="url(#frontRouteGlow)"
                    animate={{
                      strokeDashoffset: [0, -64],
                      opacity: activeRoute
                        ? activeRoute.from === route.from
                          ? [0.36, 0.6, 0.9, 0.42]
                          : [0.06, 0.12, 0.18, 0.08]
                        : [0.24, 0.52, 0.86, 0.3],
                    }}
                    transition={{
                      duration: 6 + (index % 4) * 0.42,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                ),
              )}
              {activeRoute && !activeRouteIsBack ? (
                <>
                  <path
                    d={activeRoute.path}
                    fill="none"
                    stroke={activeAccent ?? "rgba(226,246,255,0.62)"}
                    strokeOpacity={activeAccent ? 0.64 : 1}
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <motion.path
                    d={activeRoute.path}
                    fill="none"
                    stroke={activeAccent ?? "rgba(226,246,255,0.98)"}
                    strokeOpacity={activeAccent ? 0.95 : 1}
                    strokeWidth="0.65"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="12 40"
                    animate={{ strokeDashoffset: [56, 0] }}
                    transition={{
                      duration: pinnedIndex !== null ? 1.55 : 1.95,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                </>
              ) : null}
            </svg>
            {cubeBoost ? (
              <motion.div
                className="pointer-events-none absolute left-1/2 top-[57%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                style={{ backgroundColor: activeAccent ?? "rgba(165,243,252,0.8)" }}
                animate={{
                  opacity: pinnedIndex !== null ? [0.3, 0.58, 0.34] : [0.2, 0.42, 0.24],
                  scale: pinnedIndex !== null ? [0.92, 1.12, 0.95] : [0.94, 1.06, 0.96],
                }}
                transition={{
                  duration: pinnedIndex !== null ? 2.1 : 2.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            ) : null}
            <div className="absolute left-1/2 top-[55%] h-[26rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-14 [mask-image:radial-gradient(ellipse_at_center,black_38%,transparent_82%)]">
              <div className="absolute inset-0 bg-[repeating-radial-gradient(ellipse_at_center,rgba(148,163,184,0.08)_0_1px,transparent_1px_42px)]" />
            </div>
            <div className="absolute inset-x-6 bottom-0 h-36 rounded-[32px] bg-[linear-gradient(180deg,transparent,rgba(7,10,22,0.08)_26%,rgba(7,10,22,0.22))]" />
            <div className="absolute inset-x-[20%] bottom-[10%] h-px bg-[linear-gradient(90deg,transparent,rgba(103,232,249,0.12),transparent)]" />
            <div className="absolute left-[24%] bottom-[13%] h-16 w-16 rounded-full bg-white/3 blur-3xl" />
            <div className="absolute right-[20%] bottom-[12%] h-20 w-20 rounded-full bg-cyan-300/4 blur-3xl" />
          </div>

          {siteContent.stackIcons.map((item, index) => (
            <GravityToken
              key={item.name}
              item={item}
              index={index}
              anchor={gravityAnchors[index]}
              pointer={pointer}
              isActive={activeIndex === index}
              isPinned={pinnedIndex === index}
              forceInteractiveMotion={stableMotionMode}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex((prev) => (prev === index ? null : prev))}
              onTogglePin={() =>
                setPinnedIndex((prev) => (prev === index ? null : index))
              }
            />
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

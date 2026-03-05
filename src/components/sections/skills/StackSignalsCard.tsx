import { motion } from "framer-motion";
import { PointerEvent, RefObject } from "react";

import { siteContent } from "@/content/site";

import { Card } from "@/components/ui/Card";

import { CubeReactor } from "./CubeReactor";
import { gravityAnchors, GravityToken } from "./GravityToken";
import { MobileToken } from "./MobileToken";
import { PointerPosition } from "./types";

const meshLinks = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 5],
  [1, 5],
  [2, 6],
  [3, 6],
  [4, 5],
  [6, 7],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
] as const;

const coreRoutes = [
  { from: 0, path: "M11 21 L19 21 L19 32 L36 32 L36 48 L44 54" },
  { from: 1, path: "M33 21 L33 30 L40 30 L40 46 L46 54" },
  { from: 2, path: "M64 20 L64 30 L59 30 L59 46 L54 54" },
  { from: 3, path: "M87 21 L80 21 L80 34 L62 34 L62 48 L56 54" },
  { from: 4, path: "M8 46 L17 46 L17 54 L36 54 L44 56" },
  { from: 7, path: "M88 46 L79 46 L79 55 L63 55 L56 56" },
  { from: 8, path: "M16 86 L24 86 L24 74 L37 74 L37 62 L45 58" },
  { from: 9, path: "M39 86 L39 76 L44 76 L44 61 L47 58" },
  { from: 10, path: "M59 86 L59 76 L56 76 L56 61 L53 58" },
  { from: 11, path: "M74 86 L74 76 L65 76 L65 62 L56 58" },
  { from: 12, path: "M92 72 L82 72 L82 64 L68 64 L68 58 L57 57" },
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
        <div className="pointer-events-none absolute inset-0 opacity-30 [mask-image:linear-gradient(180deg,transparent,black_22%,black_78%,transparent)]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>
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
          className="relative mt-8 hidden h-[780px] overflow-hidden rounded-[34px] border border-cyan-100/12 bg-[radial-gradient(circle_at_50%_56%,rgba(74,161,228,0.12),transparent_50%),radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.06),transparent_42%),radial-gradient(circle_at_84%_24%,rgba(103,232,249,0.06),transparent_38%),linear-gradient(180deg,rgba(8,14,30,0.96),rgba(5,10,22,0.98))] shadow-[inset_0_1px_0_rgba(200,232,255,0.08),inset_0_-28px_68px_rgba(1,5,14,0.72)] md:block"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_58%,rgba(84,161,255,0.16),transparent_56%),radial-gradient(ellipse_at_24%_20%,rgba(56,189,248,0.08),transparent_44%),radial-gradient(ellipse_at_86%_24%,rgba(59,130,246,0.08),transparent_40%)]" />
            <div className="absolute inset-4 rounded-[28px] border border-cyan-100/10 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.08)]" />
            <div className="absolute inset-6 rounded-[24px] border border-white/5" />
            <div className="absolute inset-0 opacity-35 [mask-image:linear-gradient(180deg,transparent,black_18%,black_78%,transparent)]">
              <div className="absolute inset-y-0 left-[18%] w-px bg-[linear-gradient(180deg,transparent,rgba(148,163,184,0.24),transparent)]" />
              <div className="absolute inset-y-0 left-[46%] w-px bg-[linear-gradient(180deg,transparent,rgba(226,232,240,0.24),transparent)]" />
              <div className="absolute inset-y-0 right-[21%] w-px bg-[linear-gradient(180deg,transparent,rgba(148,163,184,0.2),transparent)]" />
            </div>
            <div className="absolute inset-0 opacity-16 [mask-image:radial-gradient(circle_at_center,black_38%,transparent_84%)]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:76px_76px]" />
            </div>
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
              className="absolute inset-0 h-full w-full opacity-36"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="meshStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(186,230,253,0.08)" />
                  <stop offset="50%" stopColor="rgba(103,232,249,0.32)" />
                  <stop offset="100%" stopColor="rgba(186,230,253,0.08)" />
                </linearGradient>
              </defs>
              {meshLinks.map(([start, end]) => (
                <line
                  key={`${start}-${end}`}
                  x1={gravityAnchors[start].x}
                  y1={gravityAnchors[start].y}
                  x2={gravityAnchors[end].x}
                  y2={gravityAnchors[end].y}
                  stroke="url(#meshStroke)"
                  strokeWidth="0.16"
                  strokeDasharray="0.75 1.2"
                />
              ))}
              {gravityAnchors.map((anchor, index) => (
                <circle
                  key={`node-${index}`}
                  cx={anchor.x}
                  cy={anchor.y}
                  r="0.35"
                  fill="rgba(186,230,253,0.26)"
                />
              ))}
            </svg>
            <svg
              className="absolute inset-0 h-full w-full opacity-55"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="trace" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(186,230,253,0.12)" />
                  <stop offset="45%" stopColor="rgba(125,211,252,0.6)" />
                  <stop offset="100%" stopColor="rgba(186,230,253,0.12)" />
                </linearGradient>
              </defs>
              <path
                d="M12 18 L24 18 L24 36 L38 36"
                fill="none"
                stroke="url(#trace)"
                strokeWidth="0.28"
                strokeLinecap="round"
              />
              <path
                d="M88 20 L77 20 L77 34 L62 34"
                fill="none"
                stroke="url(#trace)"
                strokeWidth="0.28"
                strokeLinecap="round"
              />
              <path
                d="M10 68 L24 68 L24 57 L36 57"
                fill="none"
                stroke="url(#trace)"
                strokeWidth="0.28"
                strokeLinecap="round"
              />
              <path
                d="M90 72 L76 72 L76 58 L64 58"
                fill="none"
                stroke="url(#trace)"
                strokeWidth="0.28"
                strokeLinecap="round"
              />
              <circle cx="24" cy="36" r="0.52" fill="rgba(186,230,253,0.45)" />
              <circle cx="77" cy="34" r="0.52" fill="rgba(186,230,253,0.45)" />
              <circle cx="24" cy="57" r="0.52" fill="rgba(186,230,253,0.45)" />
              <circle cx="76" cy="58" r="0.52" fill="rgba(186,230,253,0.45)" />
            </svg>
            <svg
              className="absolute inset-0 h-full w-full opacity-72"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="coreRouteBase" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(186,230,253,0.16)" />
                  <stop offset="52%" stopColor="rgba(103,232,249,0.45)" />
                  <stop offset="100%" stopColor="rgba(186,230,253,0.14)" />
                </linearGradient>
                <linearGradient id="coreRoutePulse" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(226,246,255,0)" />
                  <stop offset="48%" stopColor="rgba(226,246,255,0.95)" />
                  <stop offset="100%" stopColor="rgba(226,246,255,0)" />
                </linearGradient>
                <filter id="routeGlow">
                  <feGaussianBlur stdDeviation="0.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {coreRoutes.map((route) => (
                <path
                  key={`route-base-${route.from}`}
                  d={route.path}
                  fill="none"
                  stroke="url(#coreRouteBase)"
                  strokeWidth="0.22"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                />
              ))}
              {coreRoutes.map((route, index) => (
                <motion.path
                  key={`route-pulse-${route.from}`}
                  d={route.path}
                  fill="none"
                  stroke="url(#coreRoutePulse)"
                  strokeWidth="0.34"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="3.5 8.5"
                  filter="url(#routeGlow)"
                  animate={{ strokeDashoffset: [0, -40] }}
                  transition={{
                    duration: 2.8 + (index % 4) * 0.45,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              ))}
              {coreRoutes.map((route) => (
                <circle
                  key={`route-node-${route.from}`}
                  cx={gravityAnchors[route.from].x}
                  cy={gravityAnchors[route.from].y}
                  r="0.55"
                  fill="rgba(186,230,253,0.6)"
                />
              ))}
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
            <motion.div
              className="absolute left-[51%] top-[48%] h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(226,246,255,0.2),rgba(125,211,252,0.08)_34%,transparent_68%)] blur-2xl"
              animate={{ opacity: [0.22, 0.38, 0.22], scale: [0.94, 1.03, 0.95] }}
              transition={{
                duration: 7.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute left-[50%] top-[50%] h-[19rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(170,228,255,0.14),transparent_62%)] blur-3xl"
              animate={{ opacity: [0.08, 0.22, 0.08], x: [-4, 5, -3], y: [2, -3, 1] }}
              transition={{
                duration: 11,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <CubeReactor />
            <div className="absolute left-[48.8%] top-[51.2%] text-[9px] uppercase tracking-[0.28em] text-cyan-100/28">
              Flux
            </div>
            <div className="absolute left-1/2 top-[55%] h-[26rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-14 [mask-image:radial-gradient(ellipse_at_center,black_38%,transparent_82%)]">
              <div className="absolute inset-0 bg-[repeating-radial-gradient(ellipse_at_center,rgba(148,163,184,0.08)_0_1px,transparent_1px_42px)]" />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:84px_84px] opacity-18 [mask-image:radial-gradient(circle_at_center,black_34%,transparent_86%)]" />
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
            />
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

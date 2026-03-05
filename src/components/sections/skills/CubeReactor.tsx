import { motion } from "framer-motion";

type CubeReactorProps = {
  energyColor?: string | null;
  isActive?: boolean;
};

const DEFAULT_ENERGY_COLOR = "#67e8f9";

export function CubeReactor({ energyColor, isActive = false }: CubeReactorProps) {
  const tone = energyColor ?? DEFAULT_ENERGY_COLOR;
  const shellOpacity = isActive ? [0.68, 0.9, 1, 0.76] : [0.72, 0.92, 1, 0.8];
  const cloudOpacity = isActive ? [0.52, 0.86, 0.52] : [0.42, 0.72, 0.42];

  return (
    <motion.div
      className="absolute left-1/2 top-[57%] h-[20rem] w-[24rem] -translate-x-1/2 -translate-y-1/2"
      animate={{ opacity: [0.72, 0.92, 1, 0.8] }}
      transition={{
        duration: 8.2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: tone }}
        animate={{ opacity: [0.35, 0.62, 0.35], scale: [0.9, 1.06, 0.92] }}
        transition={{
          duration: 6.6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <svg
        viewBox="0 0 320 240"
        className="absolute left-1/2 top-1/2 h-[15rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cubeEdge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(220,248,255,0.96)" />
            <stop offset="52%" stopColor={tone} stopOpacity="0.9" />
            <stop offset="100%" stopColor={tone} stopOpacity="0.72" />
          </linearGradient>
          <linearGradient id="cubeTopFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(190,240,255,0.45)" />
            <stop offset="100%" stopColor={tone} stopOpacity="0.24" />
          </linearGradient>
          <linearGradient id="cubeLeftFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tone} stopOpacity="0.3" />
            <stop offset="100%" stopColor={tone} stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="cubeRightFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(186,230,253,0.28)" />
            <stop offset="100%" stopColor={tone} stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="cubeEnergyCloud" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(244,252,255,0.92)" />
            <stop offset="36%" stopColor={tone} stopOpacity="0.52" />
            <stop offset="100%" stopColor={tone} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cubeCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(236, 249, 255, 0.96)" />
            <stop offset="34%" stopColor={tone} stopOpacity="0.42" />
            <stop offset="100%" stopColor={tone} stopOpacity="0" />
          </radialGradient>
          <filter id="cubeGlow">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse
          cx="160"
          cy="124"
          rx="94"
          ry="62"
          fill="url(#cubeCoreGlow)"
          opacity="0.5"
        />
        <ellipse
          cx="160"
          cy="124"
          rx="118"
          ry="78"
          fill="none"
          stroke="rgba(148, 163, 184, 0.14)"
          strokeWidth="1"
          strokeDasharray="3 7"
        />
        <ellipse
          cx="160"
          cy="124"
          rx="138"
          ry="92"
          fill="none"
          stroke="rgba(103, 232, 249, 0.12)"
          strokeWidth="1"
          strokeDasharray="4 11"
        />

        <motion.g
          filter="url(#cubeGlow)"
          animate={{ opacity: shellOpacity }}
          transition={{
            duration: 8.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <polygon
            points="96,84 160,58 224,84 160,110"
            fill="url(#cubeTopFace)"
          />
          <polygon
            points="96,84 160,110 160,178 96,152"
            fill="url(#cubeLeftFace)"
          />
          <polygon
            points="224,84 160,110 160,178 224,152"
            fill="url(#cubeRightFace)"
          />

          <path
            d="M96 84 L160 58 L224 84 L160 110 Z"
            fill="none"
            stroke="url(#cubeEdge)"
            strokeWidth="1.8"
          />
          <path
            d="M96 84 L96 152 L160 178 L224 152 L224 84"
            fill="none"
            stroke="url(#cubeEdge)"
            strokeWidth="1.8"
          />
          <path
            d="M160 110 L160 178"
            fill="none"
            stroke="rgba(220,248,255,0.9)"
            strokeWidth="1.8"
          />

          <path
            d="M96 84 L160 110 L224 84"
            fill="none"
            stroke="rgba(220,248,255,0.3)"
            strokeWidth="1.05"
          />
          <path
            d="M96 152 L160 136 L224 152"
            fill="none"
            stroke="rgba(186,230,253,0.22)"
            strokeWidth="1"
          />
        </motion.g>
        <motion.g
          animate={{ opacity: cloudOpacity }}
          transition={{
            duration: 4.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <polygon
            points="106,94 160,72 214,94 160,117"
            fill="url(#cubeEnergyCloud)"
          />
          <polygon
            points="106,94 160,117 160,168 106,146"
            fill="url(#cubeEnergyCloud)"
            opacity="0.75"
          />
          <polygon
            points="214,94 160,117 160,168 214,146"
            fill="url(#cubeEnergyCloud)"
            opacity="0.68"
          />
        </motion.g>

        <motion.path
          d="M96 84 L160 58 L224 84 L160 110 Z"
          fill="none"
          stroke="rgba(234,248,255,0.92)"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeDasharray="18 220"
          animate={{ strokeDashoffset: [0, -236], opacity: [0.66, 1, 0.66] }}
          transition={{
            duration: 8.6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.path
          d="M96 84 L96 152 L160 178 L224 152 L224 84"
          fill="none"
          stroke={tone}
          strokeOpacity="0.85"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeDasharray="16 260"
          animate={{ strokeDashoffset: [0, 248], opacity: [0.55, 0.92, 0.55] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.path
          d="M160 110 L160 178"
          fill="none"
          stroke="rgba(232,247,255,0.9)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="8 54"
          animate={{ strokeDashoffset: [0, -62], opacity: [0.62, 1, 0.62] }}
          transition={{
            duration: 4.6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.ellipse
          cx="160"
          cy="124"
          rx="138"
          ry="92"
          fill="none"
          stroke={tone}
          strokeOpacity="0.34"
          strokeWidth="1"
          animate={{ opacity: [0.18, 0.42, 0.18] }}
          transition={{
            duration: 6.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.circle
          cx="160"
          cy="120"
          r="5.8"
          fill="rgba(238,250,255,0.95)"
          animate={{ r: [5.4, 6.8, 5.4] }}
          transition={{
            duration: 3.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <circle
          cx="160"
          cy="120"
          r="14"
          fill="none"
          stroke="rgba(186,230,253,0.24)"
          strokeWidth="1"
        />
      </svg>
    </motion.div>
  );
}

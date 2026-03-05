import { motion } from "framer-motion";

import { sectionHeadingMotion } from "../sectionMotion";

export function SkillsHeading() {
  return (
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
        I work across production UI, immersive marketing, and interface motion
        without treating any of them as separate disciplines.
      </p>
    </motion.div>
  );
}

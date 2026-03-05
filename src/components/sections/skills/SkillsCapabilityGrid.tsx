import { motion } from "framer-motion";

import { siteContent } from "@/content/site";

import { Card } from "@/components/ui/Card";

import { sectionItemMotion } from "../sectionMotion";

export function SkillsCapabilityGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
      {siteContent.skills.map((group, index) => (
        <motion.div key={group.title} {...sectionItemMotion(index)}>
          <Card className="h-full rounded-[28px] p-6 sm:rounded-[30px] sm:p-7">
            <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-cyan-400/70">
              Capability {index + 1}
            </p>
            <p className="theme-text text-lg font-medium">{group.title}</p>
            <p className="theme-muted mt-3 text-sm leading-7">{group.summary}</p>
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
  );
}

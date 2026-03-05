import { motion } from "framer-motion";

import { siteContent } from "@/content/site";

import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { sectionHeadingMotion } from "./sectionMotion";

export function SkillsProofSection() {
  return (
    <section className="relative pb-20 sm:pb-24 lg:pb-28">
      <Container>
        <Card className="theme-border rounded-[30px] p-6 sm:p-8">
          <motion.div
            className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
            {...sectionHeadingMotion}
          >
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-400/68">
                {siteContent.credibility.eyebrow}
              </p>
              <h3 className="theme-text mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                {siteContent.credibility.title}
              </h3>
            </div>
            <p className="theme-muted max-w-md text-sm leading-7">
              {siteContent.credibility.summary}
            </p>
          </motion.div>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--subtle-text)]">
                Selected engagements
              </p>
              <div className="mt-4 space-y-3">
                {siteContent.credibility.engagements.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-start justify-between gap-3 border-b border-white/6 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="theme-text text-sm font-medium">{item.name}</p>
                      <p className="theme-muted mt-1 text-xs leading-6">{item.scope}</p>
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#8f9ab7]">
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--subtle-text)]">
                Outcome highlights
              </p>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {siteContent.credibility.outcomes.map((metric) => (
                  <div
                    key={metric}
                    className="theme-chip theme-border theme-soft rounded-2xl border px-3 py-2.5 text-xs"
                  >
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="#projects" variant="secondary" className="h-11 px-5">
              View case snapshots
            </Button>
            <Button href="#contact" variant="ghost" className="h-11 px-5">
              Discuss a similar scope
            </Button>
          </div>
        </Card>
      </Container>
    </section>
  );
}

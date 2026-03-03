"use client";

import { motion } from "framer-motion";

import { siteContent } from "@/content/site";

import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { sectionHeadingMotion, sectionItemMotion } from "./sectionMotion";

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-20 sm:py-24 lg:py-28">
      <Container className="relative">
        <motion.div
          className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          {...sectionHeadingMotion}
        >
          <div className="max-w-2xl">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-400/72">
              Skills
            </p>
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
      </Container>
    </section>
  );
}

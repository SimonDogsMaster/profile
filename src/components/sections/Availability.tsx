"use client";

import { motion } from "framer-motion";

import { siteContent } from "@/content/site";

import { Container } from "../ui/Container";
import { sectionHeadingMotion, sectionItemMotion } from "./sectionMotion";

export function AvailabilitySection() {
  return (
    <section id="availability" className="relative pb-0 sm:pb-2">
      <Container>
        <motion.div
          className="rounded-[28px] border border-white/8 bg-white/[0.025] p-5 sm:rounded-[30px] sm:p-6 lg:p-7"
          {...sectionHeadingMotion}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <div className="max-w-xl lg:max-w-2xl">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-400/72">
                Availability
              </p>
              <h2 className="theme-text text-2xl font-semibold tracking-tight sm:text-3xl">
                Open for carefully scoped collaborations with product teams, studios, and founders.
              </h2>
            </div>

            <p className="theme-muted max-w-lg text-sm leading-7">
              {siteContent.availability}
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {siteContent.availabilityHighlights.map((item, index) => (
              <motion.div
                key={item}
                className="rounded-[22px] border border-white/8 bg-white/[0.02] px-4 py-4 sm:rounded-[24px]"
                {...sectionItemMotion(index)}
              >
                <p className="theme-soft text-sm leading-7">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

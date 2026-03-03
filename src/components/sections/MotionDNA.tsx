"use client";

import { motion } from "framer-motion";

import { siteContent } from "@/content/site";

import { MotionDNACanvas } from "../three/MotionDNACanvas";
import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { sectionHeadingMotion, sectionItemMotion } from "./sectionMotion";

export function MotionDNASection() {
  return (
    <section id="motion-dna" className="relative py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center xl:gap-12">
          <motion.div className="max-w-xl" {...sectionHeadingMotion}>
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-400/72">
              {siteContent.motionDNA.eyebrow}
            </p>
            <h2 className="theme-text text-3xl font-semibold tracking-tight sm:text-5xl">
              {siteContent.motionDNA.title}
            </h2>
            <p className="theme-muted mt-5 text-sm leading-7 sm:text-[15px]">
              {siteContent.motionDNA.body}
            </p>

            <div className="mt-6 space-y-3">
              {siteContent.motionDNA.notes.map((item, index) => (
                <motion.div key={item} {...sectionItemMotion(index)}>
                  <Card className="rounded-[24px] px-4 py-4 sm:px-5">
                    <p className="theme-soft text-sm leading-7">{item}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            {...sectionItemMotion(2)}
          >
            <div className="relative min-h-[320px] overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(11,16,34,0.88),rgba(7,11,23,0.96))] sm:min-h-[380px] sm:rounded-[34px] lg:min-h-[420px]">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-[14%] top-[14%] h-28 w-28 rounded-full bg-cyan-300/10 blur-[70px]" />
                <div className="absolute bottom-[12%] right-[16%] h-32 w-32 rounded-full bg-sky-400/10 blur-[90px]" />
              </div>
              <MotionDNACanvas />
              <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between sm:inset-x-6 sm:top-6">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-[#ff7f67]" />
                  <span className="size-2.5 rounded-full bg-[#f2d05e]" />
                  <span className="size-2.5 rounded-full bg-[#7bd968]" />
                </div>
                <span className="text-[11px] uppercase tracking-[0.22em] text-[#7f8cab]">
                  System study
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

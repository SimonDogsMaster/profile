"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Command } from "lucide-react";

import { siteContent } from "@/content/site";

import { CodeTabs } from "./CodeTabs";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";

export function Hero({ onOpenCommand }: { onOpenCommand: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative overflow-hidden pb-14 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36"
    >
      {/* <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-16 h-72 w-72 rounded-full bg-cyan-400/12 blur-[110px]" />
        <div className="absolute right-[8%] top-1/3 h-64 w-64 rounded-full bg-indigo-400/10 blur-[120px]" />
        {[
          "left-[11%] top-[23%]",
          "left-[24%] top-[37%]",
          "left-[64%] top-[28%]",
          "left-[79%] top-[42%]",
          "left-[58%] top-[62%]",
        ].map((position) => (
          <motion.span
            key={position}
            initial={reduceMotion ? undefined : { opacity: 0.25, y: 0 }}
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0.18, 0.34, 0.18], y: [-4, 4, -4] }
            }
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute ${position} h-2.5 w-2.5 rounded-full bg-cyan-100/80 shadow-[0_0_28px_rgba(125,211,252,0.28)]`}
          />
        ))}
        {[
          "left-[16%] top-[18%]",
          "left-[31%] top-[29%]",
          "left-[46%] top-[21%]",
          "left-[53%] top-[44%]",
          "left-[69%] top-[24%]",
          "left-[73%] top-[58%]",
          "left-[84%] top-[36%]",
        ].map((position, index) => (
          <motion.span
            key={`${position}-${index}`}
            initial={reduceMotion ? undefined : { opacity: 0.14, scale: 0.9 }}
            animate={
              reduceMotion
                ? undefined
                : {
                    opacity: [0.12, 0.28, 0.12],
                    scale: [0.92, 1.06, 0.92],
                    y: [-6, 6, -6],
                  }
            }
            transition={{
              duration: 10 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute ${position} h-1.5 w-1.5 rounded-full bg-cyan-200/90 shadow-[0_0_24px_rgba(125,211,252,0.22)]`}
          />
        ))}
        {[
          "left-[20%] top-[47%]",
          "left-[37%] top-[33%]",
          "left-[48%] top-[56%]",
          "left-[66%] top-[16%]",
          "left-[77%] top-[48%]",
        ].map((position, index) => (
          <motion.span
            key={`large-${position}-${index}`}
            initial={reduceMotion ? undefined : { opacity: 0.18, scale: 0.92 }}
            animate={
              reduceMotion
                ? undefined
                : {
                    opacity: [0.14, 0.32, 0.14],
                    scale: [0.94, 1.12, 0.94],
                    y: [-8, 8, -8],
                  }
            }
            transition={{
              duration: 12 + index * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute ${position} h-4 w-4 rounded-full bg-cyan-50/88 shadow-[0_0_34px_rgba(125,211,252,0.32)]`}
          />
        ))}
      </div> */}

      <Container className="relative">
        <div className="grid items-center gap-12 lg:gap-14 xl:grid-cols-[0.92fr_1.08fr] xl:gap-10">
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 lg:max-w-[40rem]"
          >
            <div className="theme-muted flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.28em] sm:text-xs">
              <span className="text-cyan-300/90">System / 01</span>
              <span>{siteContent.role}</span>
            </div>

            <h1 className="theme-text mt-5 max-w-3xl text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.05em] sm:mt-7 sm:text-[3.25rem] lg:text-[3.95rem] xl:text-[4rem]">
              Interfaces with{" "}
              <span className="text-gradient">technical depth</span> and
              cinematic calm.
            </h1>

            <p className="theme-muted mt-7 max-w-[31rem] text-[15px] leading-7 sm:text-[17px] sm:leading-8">
              {siteContent.tagline}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#projects" magnetic className="min-w-[10.5rem]">
                View projects
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                href="#contact"
                variant="secondary"
                magnetic
                className="min-w-[8.5rem]"
              >
                Contact
              </Button>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {siteContent.heroStats.map((item) => (
                <div
                  key={item.label}
                  className="theme-chip rounded-[22px] border px-4 py-4 sm:rounded-[24px]"
                >
                  <p className="theme-text text-2xl font-semibold">
                    {item.value}
                  </p>
                  <p className="theme-muted mt-2 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="relative mx-auto w-full max-w-[820px] min-h-[360px] sm:min-h-[420px] lg:min-h-[500px] xl:min-h-[600px]">
            <div className="relative z-10 flex min-h-[360px] items-start justify-center px-0 py-0 sm:min-h-[420px] sm:px-2 sm:py-0 lg:min-h-[500px] lg:px-0 xl:min-h-[600px] xl:justify-end xl:pl-0 xl:pr-0 xl:translate-y-16">
              <CodeTabs />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

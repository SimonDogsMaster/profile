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
      className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-36"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-16 h-72 w-72 rounded-full bg-cyan-400/12 blur-[110px]" />
        <div className="absolute right-[8%] top-1/3 h-64 w-64 rounded-full bg-indigo-400/10 blur-[120px]" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-12 lg:gap-12 xl:grid-cols-[0.82fr_1.18fr] xl:gap-8">
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 lg:max-w-[42rem]"
          >
            <h1 className="theme-text mt-6 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-[4.8rem] xl:text-7xl">
              Interfaces with{" "}
              <span className="text-gradient">technical depth</span> and
              cinematic calm.
            </h1>

            <p className="theme-muted mt-6 max-w-2xl text-base leading-8 sm:text-lg">
              {siteContent.name} is a {siteContent.role}. {siteContent.tagline}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#projects" magnetic>
                View projects
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button href="#contact" variant="secondary" magnetic>
                Contact
              </Button>
              <button
                type="button"
                onClick={onOpenCommand}
                className="theme-chip theme-border theme-muted theme-interactive inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
              >
                <Command className="size-4" />
                Command palette
              </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {siteContent.heroStats.map((item) => (
                <div
                  key={item.label}
                  className="theme-chip rounded-[24px] border px-4 py-4"
                >
                  <p className="theme-text text-2xl font-semibold">
                    {item.value}
                  </p>
                  <p className="theme-muted mt-2 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="relative mx-auto w-full max-w-[860px] min-h-[420px] lg:min-h-[500px] xl:min-h-[620px]">
            <div className="relative z-10 flex min-h-[420px] items-center justify-center px-2 py-3 sm:px-4 lg:min-h-[500px] lg:px-0 xl:min-h-[620px] xl:justify-end xl:pl-6 xl:pr-0">
              <CodeTabs />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

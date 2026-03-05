"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { siteContent } from "@/content/site";

import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { sectionItemMotion } from "./sectionMotion";

export function ProcessSection() {
  return (
    <section id="process" className="relative py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="system-label">Workflow / 04</span>
              <span className="system-rule" />
            </div>
            <p className="system-kicker mb-3">Process</p>
            <h2 className="theme-text text-3xl font-semibold tracking-tight sm:text-5xl">
              A clear working rhythm from concept to shipped interface.
            </h2>
          </div>
          <p className="theme-muted max-w-md text-sm leading-7">
            The goal is not ceremony. It is enough structure for the work to feel sharp, aligned, and ready for production.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
          {siteContent.process.map((step, index) => (
            <motion.div key={step.title} {...sectionItemMotion(index)}>
              <Card className="h-full rounded-[30px] p-6 sm:p-7">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-400/72">
                  0{index + 1}
                </p>
                <h3 className="theme-text mt-5 text-2xl font-medium">{step.title}</h3>
                <p className="theme-muted mt-4 text-sm leading-7">{step.body}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10"
          {...sectionItemMotion(3)}
        >
          <Button href="#projects" variant="secondary" magnetic>
            See selected work
            <ArrowRight className="ml-2 size-4" />
          </Button>
          <Button href="#contact" magnetic>
            Start a conversation
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}

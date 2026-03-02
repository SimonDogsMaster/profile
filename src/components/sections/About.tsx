"use client";

import { motion } from "framer-motion";

import { siteContent } from "@/content/site";

import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { sectionHeadingMotion, sectionItemMotion } from "./sectionMotion";

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 sm:py-28">
      <Container>
        <motion.div className="mb-12 max-w-2xl" {...sectionHeadingMotion}>
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-400/72">About</p>
          <h2 className="theme-text text-3xl font-semibold tracking-tight sm:text-5xl">
            Product thinking with motion built into the system.
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.9fr]">
          <motion.div {...sectionItemMotion()}>
            <Card className="rounded-[32px] p-7 sm:p-8">
              <p className="theme-soft max-w-2xl text-lg leading-8">{siteContent.about.intro}</p>
              <div className="theme-muted mt-6 space-y-4 text-sm leading-7">
                {siteContent.about.body.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </Card>
          </motion.div>

          <div className="space-y-4">
            {siteContent.about.highlights.map((highlight, index) => (
              <motion.div key={highlight} {...sectionItemMotion(index + 1)}>
                <Card className="rounded-[28px] p-6">
                  <p className="theme-soft text-sm leading-7">{highlight}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

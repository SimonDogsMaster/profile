"use client";

import { motion } from "framer-motion";

import { siteContent } from "@/content/site";

import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { sectionHeadingMotion, sectionItemMotion } from "./sectionMotion";

export function TimelineSection() {
  return (
    <section id="timeline" className="relative py-24 sm:py-28">
      <Container>
        <motion.div className="mb-12 max-w-2xl" {...sectionHeadingMotion}>
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-400/72">Experience</p>
          <h2 className="theme-text text-3xl font-semibold tracking-tight sm:text-5xl">
            A path shaped by product detail and interactive storytelling.
          </h2>
        </motion.div>

        <div className="space-y-5">
          {siteContent.timeline.map((item, index) => (
            <motion.div key={`${item.year}-${item.title}`} {...sectionItemMotion(index)}>
              <Card className="grid gap-5 rounded-[30px] p-6 md:grid-cols-[140px_1fr] md:items-start md:p-7">
                <p className="text-sm uppercase tracking-[0.22em] text-cyan-400/72">{item.year}</p>
                <div>
                  <h3 className="theme-text text-xl font-medium">{item.title}</h3>
                  <p className="theme-muted mt-3 text-sm leading-7">{item.summary}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

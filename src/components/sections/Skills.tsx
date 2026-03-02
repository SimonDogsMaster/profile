"use client";

import { motion } from "framer-motion";

import { siteContent } from "@/content/site";

import { Card } from "../ui/Card";
import { Container } from "../ui/Container";

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-24 sm:py-28">
      <div className="section-grid absolute inset-0 opacity-40" />
      <Container className="relative">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-400/72">Skills</p>
            <h2 className="theme-text text-3xl font-semibold tracking-tight sm:text-5xl">
              Systems for shipping premium interfaces.
            </h2>
          </div>
          <p className="theme-muted max-w-md text-sm leading-7">
            I work across production UI, immersive marketing, and interface motion without treating any
            of them as separate disciplines.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {siteContent.skills.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card className="h-full rounded-[30px] p-7">
                <p className="theme-text text-lg font-medium">{group.title}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="theme-chip theme-border theme-soft rounded-full border px-4 py-2 text-sm"
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

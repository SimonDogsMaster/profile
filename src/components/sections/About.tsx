"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { siteContent } from "@/content/site";

import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { sectionHeadingMotion, sectionItemMotion } from "./sectionMotion";

export function AboutSection() {
  const editorialHighlights = siteContent.about.highlights.slice(0, 2);
  const metaItems = [
    siteContent.location,
    siteContent.role,
    "Available for select freelance work"
  ];

  return (
    <section id="about" className="relative py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-8 xl:gap-12">
          <motion.div className="order-2 lg:order-1" {...sectionHeadingMotion}>
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-400/72">
              About
            </p>
            <h2 className="theme-text max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Product thinking with motion built into the system.
            </h2>

            <div className="mt-6 rounded-[28px] border border-white/8 bg-white/[0.02] px-6 py-6 sm:mt-8 sm:rounded-[32px] sm:px-8 sm:py-8">
              <p className="theme-soft max-w-3xl text-lg leading-8 sm:text-[1.15rem] sm:leading-9">
                {siteContent.about.intro}
              </p>

              <div className="theme-muted mt-6 max-w-2xl space-y-4 text-sm leading-7 sm:mt-7 sm:space-y-5 sm:text-[15px]">
                {siteContent.about.body.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {metaItems.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.16em] text-[#9eabc9]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="order-1 space-y-4 lg:order-2">
            <motion.div {...sectionItemMotion()}>
              <Card className="overflow-hidden rounded-[32px] p-0">
                <div className="relative aspect-[4/4.15] sm:aspect-[4/4.5] lg:aspect-[4/4.8]">
                  <Image
                    src="/simon.jpg"
                    alt="Portrait of Simon Riverman"
                    fill
                    sizes="(min-width: 1024px) 34vw, 100vw"
                    className="object-cover"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,24,0.02),rgba(7,11,24,0.3)_55%,rgba(7,11,24,0.82)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <p className="theme-text text-xl font-semibold tracking-tight">
                      {siteContent.name}
                    </p>
                    <p className="mt-2 text-sm text-[#c3cee7]">
                      {siteContent.location}
                    </p>
                    <p className="mt-1 text-sm text-[#8f9cba]">
                      Front-end / Motion
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {editorialHighlights.map((highlight, index) => (
              <motion.div key={highlight} {...sectionItemMotion(index + 1)}>
                <Card className="rounded-[28px] p-6">
                  <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-cyan-400/70">
                    Editorial Note {index + 1}
                  </p>
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

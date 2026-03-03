"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { siteContent } from "@/content/site";

import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { sectionHeadingMotion, sectionItemMotion } from "./sectionMotion";

export function ContactSection() {
  return (
    <section id="contact" className="relative py-20 sm:py-24 lg:py-28">
      <Container>
        <motion.div {...sectionHeadingMotion}>
          <Card className="rounded-[32px] p-6 sm:rounded-[36px] sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
              <motion.div {...sectionItemMotion()}>
                <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-400/72">Contact</p>
                <h2 className="theme-text max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">
                  Let&apos;s build something with depth, clarity, and intent.
                </h2>
                <p className="theme-muted mt-5 max-w-xl text-sm leading-7">
                  {siteContent.availability} If you have a launch, redesign, or motion-led interface that needs
                  sharp execution, I&apos;m interested.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {siteContent.socials.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
                        className="theme-chip theme-border theme-soft theme-interactive inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
                      >
                        <Icon className="size-4" />
                        {item.label}
                      </a>
                    );
                  })}
                </div>
              </motion.div>

              <motion.form className="grid gap-4" aria-label="Contact form" {...sectionItemMotion(1)}>
                <label className="theme-soft grid gap-2 text-sm">
                  Name
                  <input
                    type="text"
                    placeholder="Your name"
                    className="theme-chip theme-border theme-text rounded-2xl border px-4 py-3 outline-none placeholder:text-[var(--subtle-text)] focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
                  />
                </label>
                <label className="theme-soft grid gap-2 text-sm">
                  Email
                  <input
                    type="email"
                    placeholder="you@company.com"
                    className="theme-chip theme-border theme-text rounded-2xl border px-4 py-3 outline-none placeholder:text-[var(--subtle-text)] focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
                  />
                </label>
                <label className="theme-soft grid gap-2 text-sm">
                  Project
                  <textarea
                    rows={5}
                    placeholder="Share the brief, timeline, scope, and what kind of experience you want to ship."
                    className="theme-chip theme-border theme-text rounded-[24px] border px-4 py-3 outline-none placeholder:text-[var(--subtle-text)] focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
                  />
                </label>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button type="submit" magnetic className="min-w-[10rem]">
                    Send inquiry
                  </Button>
                  <a
                    href={`mailto:${siteContent.email}`}
                    className="theme-muted theme-interactive inline-flex items-center gap-2 text-sm"
                  >
                    {siteContent.email}
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
              </motion.form>
            </div>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
}

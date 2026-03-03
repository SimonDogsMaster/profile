"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { type Project, siteContent } from "@/content/site";

import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { sectionHeadingMotion, sectionItemMotion } from "./sectionMotion";

export function ProjectsSection() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative py-20 sm:py-24 lg:py-28">
      <Container>
        <motion.div
          className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          {...sectionHeadingMotion}
        >
          <div className="max-w-2xl">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-400/72">Selected Work / Archive</p>
            <h2 className="theme-text text-3xl font-semibold tracking-tight sm:text-5xl">
              Selected work across product, launch, and developer experience.
            </h2>
          </div>
          <p className="theme-muted max-w-md text-sm leading-7">
            A compact archive of systems, launch surfaces, and developer-facing work. Open any entry for a fuller view.
          </p>
        </motion.div>

        <LayoutGroup>
          <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
            {siteContent.projects.map((project, index) => (
              <motion.button
                key={project.slug}
                layoutId={`project-card-${project.slug}`}
                onClick={() => setActiveProject(project)}
                className="group text-left"
                {...sectionItemMotion(index)}
              >
                <Card className="theme-border h-full rounded-[30px] p-6 transition duration-300 group-hover:-translate-y-1 group-hover:border-cyan-300/30 group-hover:shadow-[0_24px_64px_rgba(56,189,248,0.12)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.26em] text-cyan-400/72">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--subtle-text)]">{project.eyebrow}</p>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs uppercase tracking-[0.18em] text-[#7f8cab]">
                        {project.year}
                      </span>
                      <span className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-cyan-300/76">
                        Open file
                        <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 h-px bg-white/6" />

                  <h3 className="theme-text mt-6 text-2xl font-medium">{project.title}</h3>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-cyan-400/72">
                    {project.roleLabel}
                  </p>
                  <p className="theme-muted mt-4 text-sm leading-7">{project.description}</p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--subtle-text)]">Impact</p>
                      <p className="theme-soft mt-2 text-sm leading-6">{project.impact}</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--subtle-text)]">Signals</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {project.metrics.slice(0, 2).map((metric) => (
                          <span
                            key={metric}
                            className="rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5 text-xs text-[#a9b4cf]"
                          >
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="theme-chip theme-border theme-soft rounded-full border px-3 py-1.5 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {activeProject ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-[var(--overlay)] p-4 backdrop-blur-sm"
                onClick={() => setActiveProject(null)}
              >
                <motion.div
                  layoutId={`project-card-${activeProject.slug}`}
                  className="glass-panel theme-border mx-auto mt-[8vh] max-w-3xl rounded-[36px] border p-6 sm:p-8"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-[11px] uppercase tracking-[0.26em] text-cyan-400/72">
                          {String(siteContent.projects.findIndex((item) => item.slug === activeProject.slug) + 1).padStart(2, "0")}
                        </p>
                        <p className="text-xs uppercase tracking-[0.22em] text-cyan-400/72">
                          {activeProject.eyebrow}
                        </p>
                        <span className="text-xs uppercase tracking-[0.18em] text-[#7f8cab]">
                          {activeProject.year}
                        </span>
                      </div>
                      <h3 className="theme-text mt-3 text-3xl font-semibold">{activeProject.title}</h3>
                      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-cyan-400/72">
                        {activeProject.roleLabel}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Close project modal"
                      onClick={() => setActiveProject(null)}
                      className="theme-chip theme-border theme-muted rounded-full border p-2"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <p className="theme-soft mt-5 max-w-2xl text-base leading-8">{activeProject.longDescription}</p>
                  <p className="theme-muted mt-4 max-w-2xl text-sm leading-7">
                    {activeProject.impact}
                  </p>

                  <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.9fr]">
                    <div>
                      <p className="theme-text text-sm font-medium">Stack / Surface</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activeProject.tags.map((tag) => (
                          <span key={tag} className="theme-chip theme-border theme-soft rounded-full border px-3 py-1.5 text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="theme-text text-sm font-medium">Outcomes / Signals</p>
                      <div className="mt-3 space-y-2">
                        {activeProject.metrics.map((metric) => (
                          <div key={metric} className="theme-chip theme-border theme-soft rounded-2xl border px-4 py-3 text-sm">
                            {metric}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {activeProject.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
                        className="theme-chip theme-border theme-text inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition hover:border-cyan-300/40"
                      >
                        {link.label}
                        <ArrowUpRight className="size-4" />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </LayoutGroup>
      </Container>
    </section>
  );
}

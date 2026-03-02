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
    <section id="projects" className="relative py-24 sm:py-28">
      <Container>
        <motion.div
          className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          {...sectionHeadingMotion}
        >
          <div className="max-w-2xl">
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-cyan-400/72">Projects</p>
            <h2 className="theme-text text-3xl font-semibold tracking-tight sm:text-5xl">
              Selected work across product, launch, and developer experience.
            </h2>
          </div>
          <p className="theme-muted max-w-md text-sm leading-7">
            Each card opens a richer project view with metrics, stack, and links. The motion stays light,
            but the hierarchy is intentional.
          </p>
        </motion.div>

        <LayoutGroup>
          <div className="grid gap-5 lg:grid-cols-3">
            {siteContent.projects.map((project, index) => (
              <motion.button
                key={project.slug}
                layoutId={`project-card-${project.slug}`}
                onClick={() => setActiveProject(project)}
                className="group text-left"
                {...sectionItemMotion(index)}
              >
                <Card className="theme-border h-full rounded-[30px] p-6 transition duration-300 group-hover:-translate-y-1 group-hover:border-cyan-300/30 group-hover:shadow-[0_24px_64px_rgba(56,189,248,0.12)]">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--subtle-text)]">{project.eyebrow}</p>
                  <h3 className="theme-text mt-5 text-2xl font-medium">{project.title}</h3>
                  <p className="theme-muted mt-4 text-sm leading-7">{project.description}</p>
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
                      <p className="text-xs uppercase tracking-[0.22em] text-cyan-400/72">{activeProject.eyebrow}</p>
                      <h3 className="theme-text mt-3 text-3xl font-semibold">{activeProject.title}</h3>
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

                  <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.9fr]">
                    <div>
                      <p className="theme-text text-sm font-medium">Stack</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activeProject.tags.map((tag) => (
                          <span key={tag} className="theme-chip theme-border theme-soft rounded-full border px-3 py-1.5 text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="theme-text text-sm font-medium">Outcomes</p>
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

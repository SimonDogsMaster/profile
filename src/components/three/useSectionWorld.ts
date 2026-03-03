"use client";

import { useEffect, useRef, useState } from "react";

type SectionId =
  | "hero"
  | "availability"
  | "about"
  | "motion-dna"
  | "skills"
  | "process"
  | "projects"
  | "timeline"
  | "contact";

type SectionWorldState = {
  activeSection: SectionId;
  pointer: { x: number; y: number };
  sectionProgress: number;
  scrollProgress: number;
  scrollVelocity: number;
};

const sectionIds: SectionId[] = [
  "hero",
  "availability",
  "about",
  "motion-dna",
  "skills",
  "process",
  "projects",
  "timeline",
  "contact"
];

export function useSectionWorld(): SectionWorldState {
  const [state, setState] = useState<SectionWorldState>({
    activeSection: "hero",
    pointer: { x: 0, y: 0 },
    sectionProgress: 0,
    scrollProgress: 0,
    scrollVelocity: 0
  });
  const velocityFrame = useRef<number | null>(null);

  useEffect(() => {
    let lastScrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    let lastTimestamp = performance.now();

    const update = () => {
      const viewportHeight = Math.max(window.innerHeight, 1);
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - viewportHeight,
        document.body.scrollHeight - viewportHeight,
        1
      );
      const scrollProgress = Math.min(scrollTop / viewportHeight, 6);
      const timestamp = performance.now();
      const deltaScroll = scrollTop - lastScrollTop;
      const deltaTime = Math.max(timestamp - lastTimestamp, 16);
      const nextVelocity = Math.min(Math.abs(deltaScroll) / deltaTime / 1.2, 1.35);

      lastScrollTop = scrollTop;
      lastTimestamp = timestamp;

      let closestSection: SectionId = "hero";
      let closestDistance = Number.POSITIVE_INFINITY;
      let nextSectionProgress = 0;

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportHeight / 2);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = id;
          const normalized = 1 - Math.min(distance / viewportHeight, 1);
          nextSectionProgress = normalized;
        }
      });

      setState((current) => ({
        activeSection: closestSection,
        pointer: current.pointer,
        sectionProgress: nextSectionProgress,
        scrollProgress,
        scrollVelocity: Math.max(current.scrollVelocity * 0.74, nextVelocity)
      }));
    };

    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;

      setState((current) => ({
        ...current,
        pointer: { x, y }
      }));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const decayVelocity = () => {
      setState((current) => {
        if (current.scrollVelocity < 0.001) {
          return current;
        }

        return {
          ...current,
          scrollVelocity: current.scrollVelocity * 0.92
        };
      });

      velocityFrame.current = window.requestAnimationFrame(decayVelocity);
    };

    velocityFrame.current = window.requestAnimationFrame(decayVelocity);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("pointermove", onPointerMove);
      if (velocityFrame.current !== null) {
        window.cancelAnimationFrame(velocityFrame.current);
      }
    };
  }, []);

  return state;
}

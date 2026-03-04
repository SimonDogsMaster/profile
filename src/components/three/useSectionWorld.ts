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
  const pointerFrame = useRef<number | null>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });

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
      const velocitySign = deltaScroll === 0 ? 0 : Math.sign(deltaScroll);
      const nextVelocity = velocitySign * Math.min(Math.abs(deltaScroll) / deltaTime / 1.2, 1.35);

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
        scrollVelocity:
          Math.abs(nextVelocity) > Math.abs(current.scrollVelocity * 0.74)
            ? nextVelocity
            : current.scrollVelocity * 0.74
      }));
    };

    const flushPointer = () => {
      pointerFrame.current = null;
      setState((current) => {
        const { x, y } = pointerTarget.current;
        if (current.pointer.x === x && current.pointer.y === y) {
          return current;
        }

        return {
          ...current,
          pointer: { x, y }
        };
      });
    };

    const schedulePointerUpdate = () => {
      if (pointerFrame.current !== null) {
        return;
      }

      pointerFrame.current = window.requestAnimationFrame(flushPointer);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1
      };
      schedulePointerUpdate();
    };

    const resetPointer = () => {
      pointerTarget.current = { x: 0, y: 0 };
      schedulePointerUpdate();
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", resetPointer);
    window.addEventListener("blur", resetPointer);

    const decayVelocity = () => {
      setState((current) => {
        if (Math.abs(current.scrollVelocity) < 0.01) {
          return current;
        }

        return {
          ...current,
          scrollVelocity:
            Math.abs(current.scrollVelocity * 0.9) < 0.01
              ? 0
              : current.scrollVelocity * 0.9
        };
      });

      velocityFrame.current = window.requestAnimationFrame(decayVelocity);
    };

    velocityFrame.current = window.requestAnimationFrame(decayVelocity);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("blur", resetPointer);
      if (velocityFrame.current !== null) {
        window.cancelAnimationFrame(velocityFrame.current);
      }
      if (pointerFrame.current !== null) {
        window.cancelAnimationFrame(pointerFrame.current);
      }
    };
  }, []);

  return state;
}

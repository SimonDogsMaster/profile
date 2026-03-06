"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";

import { Container } from "../ui/Container";
import { SkillsCapabilityGrid } from "./skills/SkillsCapabilityGrid";
import { SkillsHeading } from "./skills/SkillsHeading";
import { StackSignalsCard } from "./skills/StackSignalsCard";
import { PointerPosition } from "./skills/types";

export function SkillsSection() {
  const [pointer, setPointer] = useState<PointerPosition>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const pointerFrame = useRef<number | null>(null);
  const pointerTarget = useRef<PointerPosition>(null);
  const pointerLast = useRef<PointerPosition>(null);

  useEffect(() => {
    return () => {
      if (pointerFrame.current !== null) {
        window.cancelAnimationFrame(pointerFrame.current);
      }
    };
  }, []);

  const flushPointer = () => {
    pointerFrame.current = null;
    const target = pointerTarget.current;

    if (!target) {
      pointerLast.current = null;
      setPointer(null);
      return;
    }

    const roundStep = 5; // 0.2% precision
    const next = {
      x: Math.round(target.x * roundStep) / roundStep,
      y: Math.round(target.y * roundStep) / roundStep,
    };

    const previous = pointerLast.current;
    if (previous && previous.x === next.x && previous.y === next.y) {
      return;
    }

    pointerLast.current = next;
    setPointer(next);
  };

  const schedulePointerFlush = () => {
    if (pointerFrame.current !== null) {
      return;
    }

    pointerFrame.current = window.requestAnimationFrame(flushPointer);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = fieldRef.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }

    pointerTarget.current = {
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    };
    schedulePointerFlush();
  };

  const handlePointerLeave = () => {
    pointerTarget.current = null;
    schedulePointerFlush();
  };

  return (
    <section id="skills" className="relative py-20 sm:py-24 lg:py-28">
      <Container className="relative">
        <SkillsHeading />
        <SkillsCapabilityGrid />

        <StackSignalsCard
          fieldRef={fieldRef}
          pointer={pointer}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        />
      </Container>
    </section>
  );
}

"use client";

import { PointerEvent, useRef, useState } from "react";

import { Container } from "../ui/Container";
import { SkillsCapabilityGrid } from "./skills/SkillsCapabilityGrid";
import { SkillsHeading } from "./skills/SkillsHeading";
import { StackSignalsCard } from "./skills/StackSignalsCard";
import { PointerPosition } from "./skills/types";

export function SkillsSection() {
  const [pointer, setPointer] = useState<PointerPosition>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = fieldRef.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }

    setPointer({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
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
          onPointerLeave={() => setPointer(null)}
        />
      </Container>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";

import { CommandPalette } from "@/components/CommandPalette";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AboutSection } from "@/components/sections/About";
import { AvailabilitySection } from "@/components/sections/Availability";
import { ContactSection } from "@/components/sections/Contact";
import { MotionDNASection } from "@/components/sections/MotionDNA";
import { ProcessSection } from "@/components/sections/Process";
import { ProjectsSection } from "@/components/sections/Projects";
import { SkillsSection } from "@/components/sections/Skills";
import { TimelineSection } from "@/components/sections/Timeline";
import { GlobalExperienceCanvas } from "@/components/three/GlobalExperienceCanvas";

type ThemeMode = "dark" | "light";

export default function HomePage() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("portfolio-theme");
    const initialTheme: ThemeMode = storedTheme === "light" ? "light" : "dark";
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  return (
    <>
      <GlobalExperienceCanvas />
      <Navbar
        theme={theme}
        onToggleTheme={() =>
          setTheme((value) => (value === "dark" ? "light" : "dark"))
        }
        onOpenCommand={() => setCommandOpen(true)}
      />
      <ScrollProgress />
      <main className="relative z-10">
        <Hero onOpenCommand={() => setCommandOpen(true)} />
        <AvailabilitySection />
        <AboutSection />
        <SkillsSection />
        <ProcessSection />
        <ProjectsSection />
        <TimelineSection />
        <ContactSection />
      </main>
      <Footer />
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
      />
    </>
  );
}

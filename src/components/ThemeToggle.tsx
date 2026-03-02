"use client";

import { Moon, SunMedium } from "lucide-react";

type ThemeMode = "dark" | "light";

export function ThemeToggle({
  theme,
  onToggle
}: {
  theme: ThemeMode;
  onToggle: () => void;
}) {
  const isDark = theme === "dark";
  const Icon = isDark ? SunMedium : Moon;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="theme-toggle inline-flex items-center justify-center rounded-full border p-2.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
    >
      <Icon className="size-4" />
    </button>
  );
}

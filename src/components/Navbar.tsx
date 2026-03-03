"use client";

import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Command, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { siteContent } from "@/content/site";
import { cn } from "@/lib/utils";

import { Button } from "./ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { Container } from "./ui/Container";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Process", href: "#process" },
  { label: "Projects", href: "#projects" },
  { label: "Timeline", href: "#timeline" },
  { label: "Contact", href: "#contact" },
];

export function Navbar({
  onOpenCommand,
  onToggleTheme,
  theme,
}: {
  onOpenCommand: () => void;
  onToggleTheme: () => void;
  theme: "dark" | "light";
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (value) => setIsScrolled(value > 16));
  }, [scrollY]);

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        isScrolled ? "pt-3" : "pt-5",
      )}
    >
      <Container>
        <div
          className={cn(
            "mx-auto flex max-w-5xl items-center justify-between rounded-full border px-3 py-3 sm:px-4 transition-all duration-500",
            isScrolled
              ? "glass-panel theme-border"
              : "border-transparent bg-transparent",
          )}
        >
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <Link
              href="#hero"
              className="theme-text shrink-0 text-[13px] font-semibold tracking-[0.18em] uppercase sm:text-sm sm:tracking-[0.2em]"
            >
              {siteContent.name}
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="theme-muted hover-theme-surface theme-interactive rounded-full px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex xl:gap-3">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button
              type="button"
              aria-label="Open command palette"
              onClick={onOpenCommand}
              className="theme-chip theme-border theme-muted theme-interactive inline-flex h-12 items-center gap-2 rounded-full border px-5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
            >
              <span>⌘K</span>
            </button>
            <Button href="#contact" variant="secondary" magnetic className="h-12 px-7">
              Let&apos;s talk
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            className="theme-chip theme-border theme-muted inline-flex rounded-full border p-2 lg:hidden"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass-panel theme-border mt-3 rounded-[28px] border p-3 lg:hidden"
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="theme-muted text-xs uppercase tracking-[0.2em]">Theme</span>
                <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              </div>
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="theme-soft hover-theme-surface block rounded-2xl px-4 py-3 text-sm transition"
                >
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenCommand();
                }}
                className="theme-chip theme-border theme-text mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm"
              >
                <Command className="size-4" />
                Open command palette
              </button>
              <Button href="#contact" variant="secondary" className="mt-2 w-full justify-center">
                Let&apos;s talk
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Container>
    </motion.header>
  );
}

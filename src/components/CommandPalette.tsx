"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Command, CornerDownLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { siteContent } from "@/content/site";

export function CommandPalette({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");

  const navigate = (href: string) => {
    if (href.startsWith("#")) {
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", href);
    } else {
      window.location.assign(href);
    }
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) {
          onClose();
        }
      }

      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  const items = useMemo(() => {
    return siteContent.commandMenu.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-[var(--overlay)] p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="glass-panel theme-border mx-auto mt-[12vh] max-w-2xl rounded-[32px] border p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="theme-border flex items-center gap-3 border-b px-3 pb-3">
              <Command className="theme-muted size-4" />
              <input
                autoFocus
                aria-label="Command palette"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && items[0]) {
                    event.preventDefault();
                    navigate(items[0].href);
                  }
                }}
                placeholder="Jump to a section or open a link"
                className="theme-text w-full bg-transparent text-sm outline-none placeholder:text-[var(--subtle-text)]"
              />
            </div>

            <div className="mt-3 space-y-2">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.href)}
                    className="theme-soft hover-theme-surface flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="theme-chip theme-border rounded-xl border p-2">
                        <Icon className="size-4" />
                      </span>
                      {item.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[var(--subtle-text)]">
                      Enter
                      <CornerDownLeft className="size-3.5" />
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

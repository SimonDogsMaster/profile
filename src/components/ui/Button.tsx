"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  magnetic?: boolean;
  href?: string;
} & ComponentPropsWithoutRef<"button">;

const sharedClasses =
  "inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-medium tracking-[0.02em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]";

export function Button({
  children,
  className,
  variant = "primary",
  magnetic = false,
  href,
  ...props
}: ButtonProps) {
  const reduceMotion = useReducedMotion();

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost"
  };

  const motionProps =
    magnetic && !reduceMotion
      ? {
          whileHover: { y: -2, scale: 1.01 },
          whileTap: { scale: 0.985 }
        }
      : {};

  if (href) {
    return (
      <motion.div {...motionProps}>
        <Link href={href} className={cn(sharedClasses, variantClasses[variant], className)}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button className={cn(sharedClasses, variantClasses[variant], className)} {...motionProps} {...props}>
      {children}
    </motion.button>
  );
}

export const sectionHeadingMotion = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.55, ease: "easeOut" }
} as const;

export const sectionItemMotion = (index = 0) =>
  ({
    initial: { opacity: 0, y: 18, scale: 0.985 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.28 },
    transition: { duration: 0.48, delay: index * 0.07, ease: "easeOut" }
  }) as const;

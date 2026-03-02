import { siteContent } from "@/content/site";

import { Container } from "./ui/Container";

export function Footer() {
  return (
    <footer className="pb-8 pt-4">
      <Container className="theme-muted flex flex-col items-start justify-between gap-3 border-t border-[var(--border)] pt-6 text-sm md:flex-row">
        <p>
          {siteContent.name} · {siteContent.role}
        </p>
        <p>Built with Next.js, Framer Motion, and React Three Fiber.</p>
      </Container>
    </footer>
  );
}

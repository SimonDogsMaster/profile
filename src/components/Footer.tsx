import { siteContent } from "@/content/site";

import { Container } from "./ui/Container";

export function Footer() {
  return (
    <footer className="pb-8 pt-8 sm:pt-14">
      <Container>
        <div className="grid gap-8 border-t border-[var(--border)] pt-8 sm:pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div>
            <p className="theme-text text-sm font-semibold uppercase tracking-[0.22em]">
              {siteContent.name}
            </p>
            <p className="theme-soft mt-4 max-w-xl text-base leading-8 sm:text-lg">
              Building high-fidelity interfaces with motion, clarity, and production-level discipline.
            </p>
            <div className="theme-muted mt-5 flex flex-wrap gap-x-3 gap-y-2 text-sm">
              <span>{siteContent.role}</span>
              <span>{siteContent.location}</span>
              <span className="max-w-sm">{siteContent.availability}</span>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="theme-text text-xs uppercase tracking-[0.24em]">Contact</p>
              <div className="mt-4 space-y-3 text-sm">
                <a
                  href={`mailto:${siteContent.email}`}
                  className="theme-muted theme-interactive block"
                >
                  {siteContent.email}
                </a>
                <a href="#contact" className="theme-muted theme-interactive block">
                  Start a project
                </a>
              </div>
            </div>

            <div>
              <p className="theme-text text-xs uppercase tracking-[0.24em]">Elsewhere</p>
              <div className="mt-4 space-y-3 text-sm">
                {siteContent.socials.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
                    className="theme-muted theme-interactive block"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="theme-muted mt-6 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <p>
            {siteContent.name} · {new Date().getFullYear()}
          </p>
          <p>Built with Next.js, Framer Motion, and a custom DOM-based code hero.</p>
        </div>
      </Container>
    </footer>
  );
}

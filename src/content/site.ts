import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Database,
  Globe,
  Layers3,
  Rocket,
  Sparkles
} from "lucide-react";

export const siteContent = {
  name: "Simon S.",
  role: "Front-end Engineer / Motion Designer",
  tagline: "I build tactile interfaces where code, motion, and 3D space feel like one system.",
  location: "Bangkok, Thailand",
  email: "hello@simon.dev",
  availability: "Available for select freelance and product collaborations in 2026.",
  heroStats: [
    { label: "Years crafting interfaces", value: "7+" },
    { label: "Shipped products", value: "24" },
    { label: "Avg performance score", value: "95+" }
  ],
  about: {
    intro:
      "I design and engineer premium web experiences with a product mindset. My focus is clarity, motion, and building interfaces that feel alive without becoming noisy.",
    body: [
      "My work sits between front-end architecture and visual storytelling, from design systems and immersive landing pages to full-scale product surfaces.",
      "I care about performance, restraint, and making complex interactions feel obvious on the first scroll."
    ],
    highlights: [
      "Own the bridge between design exploration and production UI.",
      "Build motion systems that support hierarchy, not decoration.",
      "Ship responsive experiences that keep their edge on mobile."
    ]
  },
  skills: [
    {
      title: "Interface Engineering",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Accessibility", "Design Systems"]
    },
    {
      title: "Motion + 3D",
      items: ["Framer Motion", "React Three Fiber", "Three.js", "Scroll Choreography", "Interactive Prototyping"]
    },
    {
      title: "Product + Platform",
      items: ["Performance", "Component Architecture", "CMS Integrations", "Analytics", "Experimentation"]
    }
  ],
  projects: [
    {
      slug: "signal-os",
      title: "Signal OS",
      eyebrow: "Product Platform",
      description:
        "A modular analytics workspace for product teams, combining real-time monitoring, onboarding funnels, and collaborative insights in one visual system.",
      longDescription:
        "I led the front-end architecture and motion language for the platform redesign. The result was a faster dashboard shell, higher perceived polish, and a component system used across growth, billing, and reporting surfaces.",
      tags: ["Next.js", "TypeScript", "Motion", "Dashboard"],
      metrics: ["-31% bundle cost", "+18% trial activation", "95 Lighthouse"],
      links: [
        { label: "Live Preview", href: "#" },
        { label: "Case Study", href: "#" }
      ]
    },
    {
      slug: "helium-commerce",
      title: "Helium Commerce",
      eyebrow: "Immersive Launch",
      description:
        "A premium commerce launch site with immersive product reveals, editorial pacing, and a scroll system tuned for storytelling without losing speed.",
      longDescription:
        "The site used layered depth, subtle WebGL accents, and a lightweight motion system to support a major launch. The focus was premium feel with strict performance budgets across regions and devices.",
      tags: ["R3F", "Framer Motion", "Tailwind", "Storytelling"],
      metrics: ["2.4s LCP", "60fps mobile hero", "+23% conversion"],
      links: [
        { label: "Launch Site", href: "#" },
        { label: "Technical Notes", href: "#" }
      ]
    },
    {
      slug: "atlas-labs",
      title: "Atlas Labs",
      eyebrow: "Developer Experience",
      description:
        "A developer-first docs and sandbox hub that turns complex APIs into guided, interactive learning flows with strong navigation and fast search.",
      longDescription:
        "I rebuilt the information architecture, page templates, and code interaction layer to reduce cognitive load. The system improved doc discoverability and made product adoption more self-serve.",
      tags: ["Docs", "Search UX", "MDX", "Developer Tools"],
      metrics: ["-42% bounce", "+29% docs completion", "AA compliant"],
      links: [
        { label: "Docs Hub", href: "#" },
        { label: "Architecture", href: "#" }
      ]
    }
  ],
  timeline: [
    {
      year: "2026",
      title: "Senior Front-end Engineer, Independent",
      summary: "Designing premium launch experiences and product surfaces for founders, studios, and SaaS teams."
    },
    {
      year: "2024",
      title: "Lead UI Engineer, Signal OS",
      summary: "Scaled the design system, led dashboard rebuilds, and shipped motion guidelines across the platform."
    },
    {
      year: "2022",
      title: "Creative Developer, Studio Practice",
      summary: "Built interactive marketing sites, editorial experiences, and experimental prototypes for global brands."
    }
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/", icon: Code2 },
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: BriefcaseBusiness },
    { label: "Dribbble", href: "https://dribbble.com/", icon: Sparkles },
    { label: "Email", href: "mailto:hello@simon.dev", icon: ArrowUpRight }
  ],
  commandMenu: [
    { id: "hero", label: "Jump to Hero", href: "#hero", icon: Rocket },
    { id: "about", label: "Open About", href: "#about", icon: Globe },
    { id: "skills", label: "See Skills", href: "#skills", icon: Layers3 },
    { id: "projects", label: "View Projects", href: "#projects", icon: Code2 },
    { id: "timeline", label: "Open Timeline", href: "#timeline", icon: Database },
    { id: "contact", label: "Contact", href: "#contact", icon: ArrowUpRight }
  ]
} as const;

export type Project = (typeof siteContent.projects)[number];

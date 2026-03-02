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
  name: "Simon Riverman",
  role: "Front-end Engineer / Motion Designer",
  tagline: "I design and build polished web experiences where engineering precision and motion direction work as one system.",
  location: "Bangkok, Thailand",
  email: "simon.r1verman@gmail.com",
  availability: "Available for freelance product work, launch sites, and front-end collaborations.",
  heroStats: [
    { label: "Years crafting interfaces", value: "7+" },
    { label: "Shipped products", value: "24" },
    { label: "Avg performance score", value: "95+" }
  ],
  about: {
    intro:
      "I build premium interfaces for products and brands that need more than clean implementation. My focus is structure, motion, and making the final experience feel intentional at every breakpoint.",
    body: [
      "My work sits between front-end architecture and visual storytelling, from design systems and product surfaces to launch pages that need a stronger sense of atmosphere.",
      "I care about performance, restraint, and interactions that feel confident rather than overloaded."
    ],
    highlights: [
      "Translate design intent into production-ready UI without losing detail.",
      "Build motion systems that support hierarchy instead of decoration.",
      "Ship responsive experiences that still feel sharp on tablet and mobile."
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
        "A modular analytics workspace for product teams, combining monitoring, onboarding funnels, and collaborative insights in a single interface system.",
      longDescription:
        "I led the front-end architecture and motion language for the platform redesign. The result was a faster dashboard shell, stronger perceived polish, and a component system used across growth, billing, and reporting surfaces.",
      tags: ["Next.js", "TypeScript", "Motion", "Dashboard"],
      metrics: ["-31% bundle cost", "+18% trial activation", "95 Lighthouse"],
      links: [
        { label: "Repository", href: "https://gitlab.com/simonr1verman/simon-s" },
        { label: "Contact About This Work", href: "mailto:simon.r1verman@gmail.com?subject=Signal%20OS%20Case%20Study" }
      ]
    },
    {
      slug: "helium-commerce",
      title: "Helium Commerce",
      eyebrow: "Immersive Launch",
      description:
        "A premium commerce launch site with editorial pacing, layered product reveals, and a scroll system tuned for storytelling without losing speed.",
      longDescription:
        "The site used layered depth, subtle visual accents, and a lightweight motion system to support a major launch. The focus was premium feel with strict performance budgets across regions and devices.",
      tags: ["R3F", "Framer Motion", "Tailwind", "Storytelling"],
      metrics: ["2.4s LCP", "60fps mobile hero", "+23% conversion"],
      links: [
        { label: "GitHub Profile", href: "https://github.com/simonr1verman" },
        { label: "Request Walkthrough", href: "mailto:simon.r1verman@gmail.com?subject=Helium%20Commerce%20Walkthrough" }
      ]
    },
    {
      slug: "atlas-labs",
      title: "Atlas Labs",
      eyebrow: "Developer Experience",
      description:
        "A developer-first docs and sandbox hub that turns complex APIs into guided learning flows with stronger navigation and faster search.",
      longDescription:
        "I rebuilt the information architecture, page templates, and code interaction layer to reduce cognitive load. The system improved discoverability and made product adoption more self-serve.",
      tags: ["Docs", "Search UX", "MDX", "Developer Tools"],
      metrics: ["-42% bounce", "+29% docs completion", "AA compliant"],
      links: [
        { label: "LinkedIn", href: "https://www.linkedin.com/in/simonr1verman/" },
        { label: "Discuss Project", href: "mailto:simon.r1verman@gmail.com?subject=Atlas%20Labs%20Project" }
      ]
    }
  ],
  timeline: [
    {
      year: "2026",
      title: "Senior Front-end Engineer, Independent",
      summary: "Designing premium launch experiences, marketing sites, and product surfaces for founders, studios, and SaaS teams."
    },
    {
      year: "2024",
      title: "Lead UI Engineer, Signal OS",
      summary: "Scaled the design system, led dashboard rebuilds, and shipped a motion language across the platform."
    },
    {
      year: "2022",
      title: "Creative Developer, Studio Practice",
      summary: "Built interactive marketing sites, editorial experiences, and prototypes for brands that needed stronger visual direction."
    }
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/simonr1verman", icon: Code2 },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/simonr1verman/", icon: BriefcaseBusiness },
    { label: "Dribbble", href: "https://dribbble.com/", icon: Sparkles },
    { label: "Email", href: "mailto:simon.r1verman@gmail.com", icon: ArrowUpRight }
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

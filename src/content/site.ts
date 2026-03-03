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
  tagline: "I design and build high-fidelity web experiences where engineering precision and motion direction work as one system.",
  location: "Bangkok, Thailand",
  email: "simon.r1verman@gmail.com",
  availability: "Available for freelance product work, launch sites, and front-end collaborations.",
  availabilityHighlights: [
    "Booking selected freelance work for Q2 2026",
    "Open to launch sites, polished product surfaces, and motion-led front-end builds",
    "Based in Bangkok, working remotely with product teams and studios"
  ],
  heroStats: [
    { label: "Years crafting interfaces", value: "7+" },
    { label: "Shipped products", value: "24" },
    { label: "Avg performance score", value: "95+" }
  ],
  about: {
    intro:
      "I build high-fidelity interfaces for products and brands that need more than clean implementation. My focus is structure, motion, and making the final experience feel intentional at every breakpoint.",
    body: [
      "My work sits between front-end architecture and visual storytelling, from design systems and product surfaces to launch pages that need stronger atmosphere and pacing.",
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
      summary: "Production-ready UI systems built for clarity, scale, and maintainability.",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Accessibility", "Design Systems"]
    },
    {
      title: "Motion + 3D",
      summary: "Motion language and spatial interaction used to support hierarchy, not distract from it.",
      items: ["Framer Motion", "React Three Fiber", "Three.js", "Scroll Choreography", "Interactive Prototyping"]
    },
    {
      title: "Product + Platform",
      summary: "The layer where implementation quality meets performance, analytics, and iteration.",
      items: ["Performance", "Component Architecture", "CMS Integrations", "Analytics", "Experimentation"]
    }
  ],
  projects: [
    {
      slug: "signal-os",
      title: "Signal OS",
      eyebrow: "Product Platform",
      year: "2026",
      roleLabel: "Lead UI Architecture",
      description:
        "A modular analytics workspace for product teams, combining monitoring, onboarding funnels, and collaborative insights in a single interface system.",
      longDescription:
        "I led the front-end architecture and motion language for the platform redesign. The result was a faster dashboard shell, clearer interaction patterns, and a component system used across growth, billing, and reporting surfaces.",
      tags: ["Next.js", "TypeScript", "Motion", "Dashboard"],
      impact: "Platform redesign with measurable adoption and performance gains.",
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
      year: "2025",
      roleLabel: "Creative Front-end Direction",
      description:
        "A commerce launch site with editorial pacing, layered product reveals, and a scroll system tuned for storytelling without losing speed.",
      longDescription:
        "The site used layered depth, subtle visual accents, and a lightweight motion system to support a major launch. The focus was a high-end feel with strict performance budgets across regions and devices.",
      tags: ["R3F", "Framer Motion", "Tailwind", "Storytelling"],
      impact: "Launch storytelling balanced against strict speed budgets on every device.",
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
      year: "2024",
      roleLabel: "Docs Experience Systems",
      description:
        "A developer-first docs and sandbox hub that turns complex APIs into guided learning flows with stronger navigation and faster search.",
      longDescription:
        "I rebuilt the information architecture, page templates, and code interaction layer to reduce cognitive load. The system improved discoverability and made product adoption more self-serve.",
      tags: ["Docs", "Search UX", "MDX", "Developer Tools"],
      impact: "Documentation surfaces redesigned to reduce friction and improve self-serve adoption.",
      metrics: ["-42% bounce", "+29% docs completion", "AA compliant"],
      links: [
        { label: "LinkedIn", href: "https://www.linkedin.com/in/simonr1verman/" },
        { label: "Discuss Project", href: "mailto:simon.r1verman@gmail.com?subject=Atlas%20Labs%20Project" }
      ]
    }
  ],
  process: [
    {
      title: "Define",
      body: "Map the product, story, and user intent first so the interface has a clear point of view before polish is added."
    },
    {
      title: "Design",
      body: "Shape hierarchy, pacing, and motion as one system, with responsiveness and restraint considered from the start."
    },
    {
      title: "Ship",
      body: "Translate the direction into production-ready components that stay performant, maintainable, and sharp at every breakpoint."
    }
  ],
  timeline: [
    {
      year: "2026",
      title: "Senior Front-end Engineer, Independent",
      eyebrow: "Independent Practice",
      summary: "Designing launch experiences, marketing sites, and product surfaces for founders, studios, and SaaS teams."
    },
    {
      year: "2024",
      title: "Lead UI Engineer, Signal OS",
      eyebrow: "Product Systems",
      summary: "Scaled the design system, led dashboard rebuilds, and shipped a motion language across the platform."
    },
    {
      year: "2022",
      title: "Creative Developer, Studio Practice",
      eyebrow: "Interactive Direction",
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
    { id: "availability", label: "Open Availability", href: "#availability", icon: Sparkles },
    { id: "about", label: "Open About", href: "#about", icon: Globe },
    { id: "skills", label: "See Skills", href: "#skills", icon: Layers3 },
    { id: "process", label: "Open Process", href: "#process", icon: BriefcaseBusiness },
    { id: "projects", label: "View Projects", href: "#projects", icon: Code2 },
    { id: "timeline", label: "Open Timeline", href: "#timeline", icon: Database },
    { id: "contact", label: "Contact", href: "#contact", icon: ArrowUpRight }
  ]
} as const;

export type Project = (typeof siteContent.projects)[number];

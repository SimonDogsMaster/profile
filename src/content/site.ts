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
  motionDNA: {
    eyebrow: "Code to Interface",
    title: "Systems shaped through code, layout, and motion.",
    body:
      "This signature element represents how I approach front-end work: code structures becoming interface, motion reinforcing hierarchy, and every layer working together as one system. The goal is clarity you can feel before you name it.",
    notes: [
      "Code, layout, and motion treated as a single design surface.",
      "Built to make interfaces feel more legible, responsive, and alive."
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
  stackIcons: [
    {
      name: "Bootstrap",
      short: "Bs",
      category: "Framework",
      iconPath: "/icons/tech/bootstrap.svg",
      accent: "#a78bfa",
      glow: "rgba(167, 139, 250, 0.2)"
    },
    {
      name: "Tailwind CSS",
      short: "Tw",
      category: "CSS",
      iconPath: "/icons/tech/tailwindcss.svg",
      accent: "#22d3ee",
      glow: "rgba(34, 211, 238, 0.22)"
    },
    {
      name: "MUI UI",
      short: "Mu",
      category: "UI Kit",
      iconPath: "/icons/tech/mui.svg",
      accent: "#60a5fa",
      glow: "rgba(96, 165, 250, 0.2)"
    },
    {
      name: "Material UI",
      short: "Md",
      category: "UI Kit",
      iconPath: "/icons/tech/materialdesign.svg",
      accent: "#38bdf8",
      glow: "rgba(56, 189, 248, 0.2)"
    },
    {
      name: "Angular",
      short: "Ng",
      category: "Framework",
      iconPath: "/icons/tech/angular.svg",
      accent: "#dd0031",
      glow: "rgba(221, 0, 49, 0.22)"
    },
    {
      name: "Ruby",
      short: "Rb",
      category: "Language",
      iconPath: "/icons/tech/ruby.svg",
      accent: "#ef4444",
      glow: "rgba(239, 68, 68, 0.2)"
    },
    {
      name: "Laravel",
      short: "Lv",
      category: "Framework",
      iconPath: "/icons/tech/laravel.svg",
      accent: "#ff2d20",
      glow: "rgba(255, 45, 32, 0.2)"
    },
    {
      name: "JavaScript",
      short: "JS",
      category: "Language",
      iconPath: "/icons/tech/javascript.svg",
      accent: "#facc15",
      glow: "rgba(250, 204, 21, 0.22)"
    },
    {
      name: "TypeScript",
      short: "TS",
      category: "Language",
      iconPath: undefined,
      accent: "#38bdf8",
      glow: "rgba(56, 189, 248, 0.22)"
    },
    {
      name: "Electron",
      short: "El",
      category: "Desktop",
      iconPath: "/icons/tech/electron.svg",
      accent: "#67e8f9",
      glow: "rgba(103, 232, 249, 0.22)"
    },
    {
      name: "Next.js",
      short: "Nx",
      category: "Framework",
      iconPath: "/icons/tech/nextdotjs.svg",
      accent: "#cbd5e1",
      glow: "rgba(203, 213, 225, 0.18)"
    },
    {
      name: "Vue.js",
      short: "Vu",
      category: "Framework",
      iconPath: "/icons/tech/vuedotjs.svg",
      accent: "#34d399",
      glow: "rgba(52, 211, 153, 0.22)"
    },
    {
      name: "Prisma",
      short: "Pr",
      category: "ORM",
      iconPath: "/icons/tech/prisma.svg",
      accent: "#a78bfa",
      glow: "rgba(167, 139, 250, 0.22)"
    }
  ],
  projects: [
    {
      slug: "signal-os",
      title: "Admin Platform Kit",
      eyebrow: "Product Platform",
      year: "2026",
      roleLabel: "Lead Front-end Architecture",
      description:
        "A multi-role admin starter built on Next.js 16 App Router with locale routing, dashboard shell, reusable data tables, and role-aware access states.",
      longDescription:
        "I designed and implemented a production-ready admin foundation with locale-prefixed routing (/en, /th, /lo), role switching for admin/manager/staff/partner, and a token-driven theme layer that stays aligned with shadcn/ui. The platform includes DataTable patterns, RHF + zod form workflows, mock RBAC + users CRUD APIs, and modular admin surfaces for dashboard, users, roles, audit logs, notifications, and settings.",
      images: [
        "/image-snex-theme/1.png",
        "/image-snex-theme/2.png",
        "/image-snex-theme/3.png",
        "/image-snex-theme/4.png",
        "/image-snex-theme/5.png"
      ],
      tags: ["Next.js 16", "TypeScript", "shadcn/ui", "TanStack Table", "RHF + zod", "RBAC"],
      impact: "Delivered a reusable admin baseline that accelerates feature delivery while keeping access control, locale behavior, and visual consistency stable across modules.",
      metrics: ["Locales: en / th / lo", "Roles: admin / manager / staff / partner", "Modules: dashboard, users, roles, audit, notifications, settings"],
      links: [
        { label: "Repository", href: "https://gitlab.com/simonr1verman/simon-s" },
        { label: "Request Admin Platform Walkthrough", href: "mailto:simon.r1verman@gmail.com?subject=Admin%20Platform%20Kit%20Walkthrough" }
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
      images: [],
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
      images: [],
      tags: ["Docs", "Search UX", "MDX", "Developer Tools"],
      impact: "Documentation surfaces redesigned to reduce friction and improve self-serve adoption.",
      metrics: ["-42% bounce", "+29% docs completion", "AA compliant"],
      links: [
        { label: "LinkedIn", href: "https://www.linkedin.com/in/simonr1verman/" },
        { label: "Discuss Project", href: "mailto:simon.r1verman@gmail.com?subject=Atlas%20Labs%20Project" }
      ]
    }
  ],
  credibility: {
    eyebrow: "Delivery Signals",
    title: "Selected engagements and measurable outcomes.",
    summary:
      "A quick evidence layer after the stack view, focused on work context and outcomes from shipped projects.",
    engagements: [
      {
        name: "Signal OS",
        scope: "Platform redesign, dashboard architecture, motion system",
        year: "2026"
      },
      {
        name: "Helium Commerce",
        scope: "Launch storytelling, interactive front-end direction",
        year: "2025"
      },
      {
        name: "Atlas Labs",
        scope: "Docs IA rebuild, search UX, component templates",
        year: "2024"
      }
    ],
    outcomes: [
      "-31% bundle cost on platform surfaces",
      "+23% conversion on launch flow",
      "95+ Lighthouse score on production builds",
      "-42% docs bounce with stronger navigation"
    ]
  },
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
    { id: "motion-dna", label: "Open Motion DNA", href: "#motion-dna", icon: Sparkles },
    { id: "skills", label: "See Skills", href: "#skills", icon: Layers3 },
    { id: "process", label: "Open Process", href: "#process", icon: BriefcaseBusiness },
    { id: "projects", label: "View Projects", href: "#projects", icon: Code2 },
    { id: "timeline", label: "Open Timeline", href: "#timeline", icon: Database },
    { id: "contact", label: "Contact", href: "#contact", icon: ArrowUpRight }
  ]
} as const;

export type Project = (typeof siteContent.projects)[number];

# 3D Portfolio

Modern single-page portfolio built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and React Three Fiber.

## Create and run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## What to edit

- Main content: `src/content/site.ts`
- Theme tokens and global styling: `src/styles/globals.css`
- Hero 3D typing scene: `src/components/three/FloatingIDE.tsx`
- Projects modal and sections: `src/app/page.tsx` and `src/components/sections/*`

## Add projects

Update the `projects` array in `src/content/site.ts` with:

- `slug`
- `title`
- `description`
- `tags`
- `metrics`
- `links`

## Customize colors

Edit the CSS variables in `src/styles/globals.css`:

- `--background`
- `--surface`
- `--border`
- `--text`
- `--muted`
- `--accent`

## Notes

- The 3D scene uses no external models.
- Reduced-motion users get a calmer experience and a static mobile-friendly fallback.

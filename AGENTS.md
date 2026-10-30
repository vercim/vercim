# AGENTS.md

Guidance for AI coding agents and contributors. `CLAUDE.md` is a symlink to this file — edit `AGENTS.md` only.

## Overview

Single-page personal site, deployed on Vercel. Next.js 15 App Router, React 19, strict TypeScript, Tailwind CSS v4. It is aimed at people who liked the owner's Minecraft mods and at Roblox developers: a client with an idea should see the work and write in. The site is being redesigned from scratch; blocks are added one at a time.

Principles: show results, not claims; minimal text, no filler headings; bold visuals; everything large and readable; no decorative animations or captions. Copy about the owner's skills, advantages or philosophy is always written by the owner — leave a `TODO` placeholder instead of inventing it. All copy is in English. The site shows no name or branding; the favicon (`src/app/icon.svg`, a card) is the only mark.

Every block sits inside one rounded canvas (`.site-frame__canvas`) on the `--c-frame` background, so the page reads as one space without dividers.

Planned blocks, in order: hero (done), Minecraft (character render, live download count, hand-drawn project icons, no project links), Roblox, advantages bento, footer marquee along an SVG path.

## Commands

Use pnpm and keep `pnpm-lock.yaml` in sync with `package.json`.

- `pnpm install` — install locked dependencies.
- `pnpm dev` — dev server on port 3000.
- `pnpm lint` — ESLint (`next/core-web-vitals`).
- `pnpm build` — production build; also type-checks and catches rendering errors.
- `pnpm start` — serve the production build.

There is no test runner. Run `pnpm lint` and `pnpm build` after every change; both must pass without warnings.

## Layout

```
src/app/            layout.tsx (metadata, font), page.tsx (frame + blocks), globals.css, icon.svg
src/components/     page blocks: HeroSection
src/components/ui/  primitives: cloud-shader, contact-buttons, two-worlds-ground
src/data/           social.ts (contacts and mod-platform accounts)
src/lib/            one server-side fetcher per external service (modrinth, curseforge)
public/images/      owner-supplied art: hero/, icons/, roblox/, marquee/
```

## Hero

Sky (`CloudShader`) inside the frame, the owner's phrase (`HERO_PHRASE` in `HeroSection.tsx`), contact buttons, and at the bottom the "two worlds" ground: blocky Minecraft terrain on the left blending into smooth Roblox terrain on the right, with the owner's two characters standing on it.

Art lives in `public/images/hero/`: `minecraft.png`, `roblox.png` (transparent PNG characters) and optionally `ground.png`. `HeroSection` checks at build time whether each file exists and otherwise renders a placeholder (`TwoWorldsGround` SVG for the ground, a dashed box for a character), so adding a file needs a rebuild. Character position and size are `.hero__character*` rules in `globals.css`.

## Data

`page.tsx` sets `export const revalidate = 21600` (6 hours); every `fetch` in `src/lib/` uses `next: { revalidate: 21600 }` — keep them in sync. Fetching stays in server components and `src/lib/`; client components get plain data.

- **Contacts** — edit only `contacts` in `src/data/social.ts`. `account` is the single place a username lives; `profileUrl` builds the link. An entry without `profileUrl` (Discord) copies its account on click, silently — no toast or icon change. Array order is the on-page order.
- **Mod platforms** — `modAccounts` in `social.ts` feeds `lib/modrinth.ts` and `lib/curseforge.ts` (public APIs, no credentials; `User-Agent: vercim/portfolio/1.0 (contact@verc.im)`).
- Fetchers never throw: they return `{ status: 'success', ... } | { status: 'error', message }` and log with `console.error('[service] ...')`. The UI must render a sensible state for every failure.
- Remote images rendered through `next/image` need their host in `images.remotePatterns` in `next.config.ts` (none at the moment).

## Environment

Secrets live in `.env.local` (all `.env*` files and `.vercel/` are git-ignored). Never commit, print, or paste their values. The current code reads no environment variables.

## Styling

- Tailwind v4 through PostCSS; `globals.css` starts with `@import "tailwindcss"`.
- Colors are `--c-*` tokens on `:root`; reuse them instead of hard-coding colors. `--c-sky-*` duplicate the `CloudShader` defaults (the shader takes literal colors). The placeholder terrain colors are literals in `two-worlds-ground.tsx`.
- Component styles are BEM-like classes in `@layer components`, grouped by block: `site-frame*`, `hero*`, `contact-button*`. Extend an existing block before inventing a new one.
- Breakpoints in use: 680px and 520px.
- The font is Inter Tight via `next/font` (`--font-sans`).

## Code style

- Two-space indent, single quotes, semicolons, trailing commas in multiline literals.
- Strict TypeScript; no `any`. Prefer the `@/` alias over relative imports across directories.
- Components are named exports. Block components in `src/components/` use PascalCase filenames; primitives in `src/components/ui/` use kebab-case. Utilities are camelCase.
- Server components by default; add `'use client'` only for state, effects, browser APIs, or interaction. Do not pass functions (including icon components) from server to client components — import the data in the client module instead.
- Comments and log/UI strings are in English. Comment sparingly: only where the reason is not obvious from the code.

## Verification

Besides `pnpm lint` and `pnpm build`, for UI changes check at a mobile width (≤520px) and a desktop width: layout, no horizontal scroll, readable text over the moving clouds, and external links.

## Commits and pull requests

- Short, imperative, focused commit subjects (for example `Refine project card layout`); avoid `update` or `fix stuff`.
- A pull request describes the user-visible result, lists the validation performed, links related issues, and includes before/after screenshots for visual changes. Call out any new dependency or environment variable.

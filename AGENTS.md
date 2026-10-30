# AGENTS.md

Guidance for AI coding agents and contributors. `CLAUDE.md` is a symlink to this file — edit `AGENTS.md` only.

## Overview

Single-page personal site, deployed on Vercel. Next.js 15 App Router, React 19, strict TypeScript, Tailwind CSS v4. It is aimed at people who liked the owner's Minecraft mods and at Roblox developers: a client with an idea should see the work and write in. The site is being redesigned from scratch; blocks are added one at a time.

Principles: show results, not claims; minimal text, no filler headings; no project names on the page (icons only, names go to `alt`); readable but restrained type in the spirit of the references (imput.net, the Petalpay and dental studio templates on 21st.dev); no text shadows, decorative animations or captions. Copy about the owner's skills, advantages or philosophy is always written by the owner — leave a `TODO` placeholder instead of inventing it. All copy is in English. The site shows no name or branding; the favicon (`src/app/icon.svg`, a card) is the only mark.

Page structure, top to bottom, on the white page background (`--c-frame`):

- a static (not sticky) header: the small card mark in the top left corner (equal gap above and beside it), lowercase section links on the right (`contacts`, `minecraft`, `roblox`, `fancy`; `#fancy` has no block yet);
- the hero: a rounded sky card inset by `--frame-pad`, the only block with the sky;
- the Minecraft block, directly on the white page, so the white around the hero flows into it without a divider;
- the Roblox block: a full-width black band that starts with a hard edge, which cuts the Minecraft character at the bottom.

The hero content and every block share one left edge and one right edge (`--inset-start` / `--inset-end`, plus `--frame-pad` outside the hero card).

Planned blocks, in order: hero (done), Minecraft (done), Roblox (started), advantages bento, footer marquee along an SVG path.

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
src/app/            layout.tsx (metadata, fonts), page.tsx (header + blocks), globals.css, icon.svg
src/components/     page blocks: SiteHeader, HeroSection, MinecraftSection, RobloxSection
src/components/ui/  primitives: cloud-shader, contact-list, art-slot
src/data/           social.ts (contacts and mod-platform accounts)
src/lib/            one server-side fetcher per external service (modrinth, curseforge), plus mods.ts (merges them)
public/images/      owner-supplied art: minecraft/, roblox/, marquee/
```

## Hero

Sky only, with no game-style decoration; the card fills the viewport below the header. The contacts sit top left as plain text lines (`discord: vercim`, `telegram: @kntex`, `x.com: @vercims`, no underline), and the owner's phrase sits bottom right, tilted by -3deg. The phrase is the owner's own wording in `HeroSection.tsx`; change it only on request.

## Minecraft

On the left a two-tone headline (the total download count in ink, the owner's label "downloads i have in total" muted) above a row of project icons (no names, no per-project counts); on the right the owner's character render, standing on the bottom edge of the block so the black Roblox block cuts it (below the stats on phones). No headings and no links to the projects: visitors usually come from them.

- The render is `public/images/minecraft/character.png` (transparent PNG), shown through `ArtSlot` in a 3:4 slot. The image covers the slot from the top (`object-fit: cover; object-position: top`), so a full-body render is cut at the bottom; the slot's `aspect-ratio` decides how much is shown. While the file is missing, the slot shows its expected path instead; the check happens in the browser (`onError`), not with `fs`, because public files are not available to the server during ISR revalidation on Vercel.
- The icons and the count come live from Modrinth and CurseForge through `fetchModsOverview` (`lib/mods.ts`): the union of both platforms, matched by title with punctuation ignored ("Drag It!" = "Drag It"), so a project published on only one platform is kept. Modrinth's icon wins and projects are sorted by downloads. The icons are the owner's own hand-drawn pixel art uploaded to those platforms, so a new mod shows up after the next revalidation. If no platform answers, the count and the icons are hidden; if one fails, the count covers the other.

## Roblox

A black block (`--c-dark`) with the owner's phrase "i also make games!" and "(roblox, luau lang)" muted under it. Only the start of the block so far.

## Data

`page.tsx` sets `export const revalidate = 21600` (6 hours); every `fetch` in `src/lib/` uses `next: { revalidate: 21600 }` — keep them in sync. Fetching stays in server components and `src/lib/`; client components get plain data.

- **Contacts** — edit only `contacts` in `src/data/social.ts`. `account` is the single place a username lives; `profileUrl` builds the link and `showAt` prefixes the shown handle with `@`. An entry without `profileUrl` (Discord) copies its account on click, silently — no toast or icon change. Array order is the on-page order.
- **Mod platforms** — `modAccounts` in `social.ts` feeds `lib/modrinth.ts` and `lib/curseforge.ts` (public APIs, no credentials; `User-Agent: vercim/portfolio/1.0 (contact@verc.im)`). Both return the account's projects as `ModProject` (`title`, `iconUrl`, `downloads`). cfwidget's author search caches the project list for a long time and misses new projects, so `curseforge.ts` also reads the author by id (`api.cfwidget.com/author/{id}`) and merges both lists.
- Fetchers never throw: they return `{ status: 'success', ... } | { status: 'error', message }` and log with `console.error('[service] ...')`. The UI must render a sensible state for every failure.
- Remote images rendered through `next/image` need their host in `images.remotePatterns` in `next.config.ts` (currently `cdn.modrinth.com` and `media.forgecdn.net`). Animated GIF icons are served as they are.

## Environment

Secrets live in `.env.local` (all `.env*` files and `.vercel/` are git-ignored). Never commit, print, or paste their values. The current code reads no environment variables.

## Styling

- Tailwind v4 through PostCSS; `globals.css` starts with `@import "tailwindcss"`.
- Colors are `--c-*` tokens on `:root`; reuse them instead of hard-coding colors. `--c-sky-*` duplicate the `CloudShader` defaults (the shader takes literal colors). Over the sky the phrase is `--c-ink` with the owner's `mix-blend-mode: overlay`, and the contacts are `--c-on-sky` (white). The white blocks use `--c-ink`, the black ones `--c-dark` with `--c-on-dark`.
- Layout tokens: `--frame-pad` and `--frame-radius` (the hero card), `--header-h`, `--inset-start` / `--inset-end` (the shared content edges).
- Component styles are BEM-like classes in `@layer components`, grouped by block: `site-header*`, `site-nav*`, `hero*`, `contact-list*`, `minecraft*`, `roblox*`, `art-slot*`. Extend an existing block before inventing a new one.
- Sizes scale with `clamp()`; the only breakpoint is 680px, where the Minecraft block stacks into one column.
- One font: Geist from `next/font` in `layout.tsx` (`--font-sans`), weights 400, 500 and 600. Sizes come from `--text-body`, `--text-lead` and `--text-title`; headings, phrases and the download count are 600 with tight tracking, and a heading's second part is muted (`--c-muted`, regular weight).
- Links have a thin underline (1px, offset 0.3em), never a text shadow.

## Code style

- Two-space indent, single quotes, semicolons, trailing commas in multiline literals.
- Strict TypeScript; no `any`. Prefer the `@/` alias over relative imports across directories.
- Components are named exports. Block components in `src/components/` use PascalCase filenames; primitives in `src/components/ui/` use kebab-case. Utilities are camelCase.
- Server components by default; add `'use client'` only for state, effects, browser APIs, or interaction. Do not pass functions (including icon components) from server to client components — import the data in the client module instead.
- Comments and log/UI strings are in English. Comment sparingly: only where the reason is not obvious from the code.

## Verification

Besides `pnpm lint` and `pnpm build`, for UI changes check at a mobile width (≤520px) and a desktop width: layout, no horizontal scroll, readable text over the moving clouds, and external links. For the Minecraft block, also check the failure state: point `modAccounts` at a missing user and confirm the block still renders without the count and icons.

## Commits and pull requests

- Short, imperative, focused commit subjects (for example `Refine project card layout`); avoid `update` or `fix stuff`.
- A pull request describes the user-visible result, lists the validation performed, links related issues, and includes before/after screenshots for visual changes. Call out any new dependency or environment variable.

# AGENTS.md

Guidance for AI coding agents and contributors. `CLAUDE.md` is a symlink to this file — edit `AGENTS.md` only.

## Overview

Single-page personal portfolio ("Vercim Creative"), deployed on Vercel. Next.js 15 App Router, React 19, strict TypeScript, Tailwind CSS v4, framer-motion. The page has two parts:

- **Hero** — an interactive 3D business card plus a social dock whose items open live previews (Discord profile, YouTube channel, GitHub contribution graph, Modrinth and CurseForge download stats).
- **Projects** — a bento grid built from the owner's public GitHub repositories, with language breakdowns. The section is at least one viewport tall (exactly one on desktop) and ends the page.

The hero is dark; the projects screen sits on an animated sky (the WebGL `CloudShader`) behind translucent white cards (`--c-paper*` tokens, Arial). There is no theme switching.

## Commands

Use pnpm and keep `pnpm-lock.yaml` in sync with `package.json`.

- `pnpm install` — install locked dependencies.
- `pnpm dev` — dev server on port 3000.
- `pnpm lint` — ESLint (`next/core-web-vitals`).
- `pnpm build` — production build; also type-checks and catches rendering errors.
- `pnpm start` — serve the production build.

There is no test runner. Run `pnpm lint` and `pnpm build` after every change. `pnpm lint` currently reports `react-hooks/exhaustive-deps` warnings from `admit-one-ticket.tsx` (see Code style); errors and any new warnings elsewhere are not acceptable.

## Layout

```
src/app/            layout.tsx (metadata, font), page.tsx, globals.css, icon.svg
src/components/     page sections: HeroSection*, ProjectsSection, ProjectsBento, ProjectCard, LanguageBar
src/components/ui/  interactive primitives: admit-one-ticket, hover-business-card, social-preview-dock, cloud-shader
src/data/           social.ts (single source for social accounts and links), languages.ts (language colors)
src/lib/            one server-side fetcher per external service, plus bentoLayout.ts (pure tiling logic)
src/types/          RepoCard / RepoLanguage models
```

There is no `src/hooks/` yet; create it (`useCamelCase.ts`) when a hook is shared between components.

## Data flow

`page.tsx` is a server component with `export const revalidate = 21600` (6 hours). Every `fetch` in `src/lib/` uses `next: { revalidate: 21600 }` — keep the two in sync.

- `HeroSectionWithData` (async server) calls all five fetchers with `Promise.all`, taking each account from `getSocialAccount(id)` in `src/data/social.ts`, and passes the results to `HeroSection` (client). `HeroSection` merges them with `socialLinks` into `SocialPreviewItem[]` for `SocialPreviewDock`.
- `ProjectsSection` (async server) calls `fetchRepos(getSocialAccount('github'))` and `fetchRepoLanguages`, then hands the cards to `ProjectsBento`, which takes the placement from `createBentoLayout` (`src/lib/bentoLayout.ts`) and renders `ProjectCard` (client) for each repo. Repositories arrive most recently pushed first (`sort=pushed`, then an explicit sort on `pushed_at`); the first one is the `featured` 2x2 tile and the only card with the dithering shader. The layout tiles the grid exactly for any repository count (no empty cells; rows are added as repositories appear), and new repositories show up on the next 6-hour revalidation. With no repositories it shows a short empty-state message instead of the grid.

Keep fetching in server components and `src/lib/`; pass plain data to client components as props.

### External services

| Module | Source | Credential |
| --- | --- | --- |
| `lib/github.ts` | GitHub REST (repos, languages), GraphQL (contribution calendar), HTML scraping as fallback | `GITHUB_TOKEN`, optional (higher rate limits, enables GraphQL) |
| `lib/discord.ts` | Discord API v10 `users/{id}` | `DISCORD_BOT_TOKEN`, required |
| `lib/youtube.ts` | YouTube Data API v3 `channels?forHandle` | `YOUTUBE_API_KEY`, required |
| `lib/modrinth.ts` | Modrinth v2 public API | none |
| `lib/curseforge.ts` | `api.cfwidget.com` public widget API | none |

### Fetcher conventions

- Fetchers never throw. Discord, YouTube, Modrinth and CurseForge return `{ status: 'success', ... } | { status: 'error', message }`; GitHub returns `null` or `[]`. The UI must render a sensible state for every failure, including missing tokens.
- Log failures with `console.error('[service] ...')`.
- Response and result types live next to the fetcher; `src/types/` holds only the repo-card models.
- Send a descriptive `User-Agent` (`vercim/portfolio/1.0 (contact@verc.im)` for Modrinth and CurseForge).
- Remote images rendered through `next/image` need their host in `images.remotePatterns` in `next.config.ts` (currently YouTube and Discord CDNs).

## Environment

Secrets live in `.env.local` (all `.env*` files and `.vercel/` are git-ignored). Never commit, print, or paste their values. `VERCEL_OIDC_TOKEN` there is written by the Vercel CLI and is not read by the code.

## Common changes

- **Accounts and social links** — edit only `src/data/social.ts`; there is no second config file. `account` is the single value per service (username, `@handle`, or Discord user ID): the API fetchers read it through `getSocialAccount(id)` and the profile `href` is built from it by `profileUrl`, so renaming an account is a one-line change. Do not duplicate an account name in `href` or elsewhere. Array order is the on-page order. An entry without `profileUrl` is preview-only (`href` is empty). `handle` is only for non-link values (the `email` address, the Discord tag). The `email` entry is not shown in the dock; it is passed to it separately.
- **New platform** — add its id to `SocialId`, then an entry in `social.ts`. Previews are hard-wired by `id` in the ternary chain in `HeroSection.tsx`, and an unknown `id` falls through to the CurseForge branch, so the platform also needs its own branch, fetcher and `SocialPreview` variant.
- **Business card text** — props passed to `AdmitOneTicket` in `hover-business-card.tsx`. The ticket date (`dates`) is not hard-coded: it is today's `DD.MM` in the visitor's local time, computed client-side (the ticket renders only after mount, so there is no hydration mismatch).
- **Page metadata** — `metadata` in `src/app/layout.tsx`.

## Styling

- Tailwind v4 is loaded through PostCSS; `globals.css` starts with `@import "tailwindcss"`.
- Colors are `--c-*` tokens on `:root`, exposed to Tailwind through `@theme inline` (`bg-surface`, `text-muted`, `border-divider`, ...). Reuse them; do not hard-code new grays. The projects screen uses its own `--c-paper*` tokens, `--c-ticket` (the ticket orange, also the hover accent) and `--c-sky-*` (the section's fallback gradient); they are not exposed to Tailwind. The shaders take literal colors, so the orange is duplicated in `ProjectCard.tsx` (dithering) and the sky blues in `CloudShader`'s defaults.
- Component styles are BEM-like classes in `@layer components` of `globals.css`, grouped by block: `hero-*`, `business-card-*`, `social-preview-dock*` / `social-preview-card*`, `projects-*`, `project-card*`, `language-bar*`. Extend an existing block before inventing a new one.
- Pass per-instance dynamic values as CSS custom properties through `style` (see `--language-color`, the bento `--desktop-*` variables) rather than inline layout styles. The sky wrapper in `ProjectsSection` is `position: sticky` and viewport-tall, so the canvas keeps its proportions when the section grows past one screen; `CloudShader` stops rendering while off screen, and the card glass colors are the `--projects-glass*` variables on `.projects-section`.
- Breakpoints in use: 900px, 680px, 520px, and a short-landscape query (`max-height: 610px` and `min-width: 521px`). At 520px and below the hero uses a rotated card and viewport-height offsets computed in `HeroSection.tsx`; check that layout after any hero change.
- The font is JetBrains Mono via `next/font` (`--font-jetbrains-mono`).

## Code style

- Two-space indent, single quotes, semicolons, trailing commas in multiline literals.
- Strict TypeScript; no `any`. Prefer the `@/` alias over relative imports across directories.
- Components are named exports. Section components in `src/components/` use PascalCase filenames (`ProjectCard.tsx`); primitives in `src/components/ui/` use kebab-case (`social-preview-dock.tsx`). Utilities are camelCase.
- Components are server components by default. Add `'use client'` only for state, effects, browser APIs, or interaction.
- Comments and log/UI strings are in English. Comment sparingly: only where the reason is not obvious from the code.
- `src/components/ui/admit-one-ticket.tsx` is a ~2,400-line bundled WebGL component with `// @ts-nocheck` and a default export. Do not reformat or refactor it; make targeted edits only and drive it through props.

## Verification

Besides `pnpm lint` and `pnpm build`, for UI changes check at a mobile width (≤520px) and a desktop width: layout, hover/tap motion, external links, and the error states of the social previews (unset a token in `.env.local` and confirm the card shows a message instead of breaking). The business card tilts toward a mouse or pen pointer only (eased in a `requestAnimationFrame` loop in `TiltCard`); it is static on touch devices and at ≤520px.

## Commits and pull requests

- Short, imperative, focused commit subjects (for example `Refine project card layout`); avoid `update` or `fix stuff`.
- A pull request describes the user-visible result, lists the validation performed, links related issues, and includes before/after screenshots for visual changes. Call out any new dependency or environment variable.

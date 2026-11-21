# AGENTS.md

Guidance for AI coding agents and contributors. `CLAUDE.md` is a symlink to this file — edit `AGENTS.md` only.

## Overview

Single-page personal site, deployed on Vercel. Next.js 15 App Router, React 19, strict TypeScript, Tailwind CSS v4. It is aimed at people who liked the owner's Minecraft mods and at Roblox developers: a client with an idea should see the work and write in. The site is being redesigned from scratch; blocks are added one at a time.

Principles: show results, not claims; minimal text, no filler headings; no project names on the page (icons only, names go to `alt`); readable but restrained type in the spirit of the references (imput.net, the Petalpay and dental studio templates on 21st.dev); no text shadows, decorative animations or captions. Copy about the owner's skills, advantages or philosophy is always written by the owner — leave a `TODO` placeholder instead of inventing it. All copy is in English. The site shows no name or branding; the favicon (`src/app/icon.svg`, a card) is the only mark.

Page structure, top to bottom, on the white page background (`--c-frame`):

- a static (not sticky) header: the small card mark in the top left corner (equal gap above and beside it), lowercase section links on the right: `hero`, `mods`, `games` (anchors `#hero`, `#mods` on the Minecraft block, `#games` on the Roblox block);
- the hero: a rounded sky card inset by `--frame-pad`, the only block with the sky;
- the Minecraft block, directly on the white page, so the white around the hero flows into it without a divider;
- the Roblox block: a rounded blue card framed by a transition from the page background to black;
- the advantages bento: the content section of the page, its heart — owner-written copy in a bento grid;

The hero content and every block share one left edge and one right edge (`--inset-start` / `--inset-end`, plus `--frame-pad` outside the hero card).

Blocks, in order: hero, Minecraft, Roblox (all built; owner art still missing), then an advantages bento (planned; copy written by the owner). No footer is currently rendered.

## Commands

Use pnpm and keep `pnpm-lock.yaml` in sync with `package.json`.

- `pnpm install` — install locked dependencies.
- `pnpm dev` — dev server on port 3000.
- `pnpm lint` — ESLint (`next/core-web-vitals`).
- `pnpm build` — production build; also type-checks and catches rendering errors.
- `pnpm start` — serve the production build.

Development output lives in `.next-dev`; production build/start use `.next` so validation builds do not overwrite a running dev server's files.

There is no test runner. Run `pnpm lint` and `pnpm build` after every change; both must pass without warnings.

## Layout

```
src/app/            layout.tsx (metadata, fonts), page.tsx (header + blocks), globals.css, icon.svg
src/components/     page blocks: SiteHeader, HeroSection, MinecraftSection, RobloxSection
src/components/ui/  primitives: cloud-shader, contact-list, art-slot, scroll-reveal
src/data/           social.ts (contacts and mod-platform accounts)
src/lib/            one server-side fetcher per external service (modrinth, curseforge), plus mods.ts (merges them)
public/             owner-supplied art: char_mc.png, char_rbx.png
```

## Hero

Sky only, with no game-style decoration; the card fills the viewport below the header. The section uses `id="hero"`. Social links sit top left in a vertical list, showing platform names and usernames at the Minecraft and Roblox headline size, with the same weight, line height, and tracking as the hero paragraph, without underlines. Discord silently copies the username. `CloudShader` renders synchronized cloud masks over the social list and the owner's paragraph. The glyphs stay white over the sky and turn black where a cloud crosses them. WebKit uses a CSS canvas mask on an inert text overlay, and other browsers apply an SVG filter to the glyphs. The paragraph sits bottom right, without rotation. Once the sky is ready, it fades in while all text lines rise from behind their masks; the header has no intro. Contacts show keyboard focus with an underline, since the mask would clip an outline. The phrase is the owner's own wording in `HeroSection.tsx`; change it only on request.

## Minecraft

On the left a two-tone headline (the total download count in ink, the owner's label "downloads i have in total" muted) above a row of project icons (no names, no per-project counts); on the right the owner's character render, standing on the bottom edge of the block so the black Roblox block cuts it (below the stats on phones). No headings and no links to the projects: visitors usually come from them.

- The render is `public/char_mc.png`. `ArtSlot` keeps its aspect ratio and aligns the figure to the bottom of the section. If the file is missing, the slot hides the image after the browser reports a load error.
- The icons and the count come live from Modrinth and CurseForge through `fetchModsOverview` (`lib/mods.ts`): the union of both platforms, matched by title with punctuation ignored ("Drag It!" = "Drag It"), so a project published on only one platform is kept. Modrinth's icon wins and projects are sorted by downloads. The icons are the owner's own hand-drawn pixel art uploaded to those platforms, so a new mod shows up after the next revalidation. If no platform answers, the count and the icons are hidden; if one fails, the count covers the other.

## Roblox

A blue card with the owner's Roblox character on the left and the section copy on the right. The render is `public/char_rbx.png`. Both characters use `ArtSlot` and the shared showcase layout.

## Bento and animated sticker colors

The bento section uses `bg-dark`. Cards use `--c-bento-card`, borders use `--c-bento-border`, and text and stickers inherit `text-on-dark`.

The five monochrome stickers live in `src/assets/lottie/*.json` and render through `BentoIcon` with the SVG renderer. Their original white colors are embedded in the JSON; changing the wrapper's text color alone does not recolor them.

- After importing or replacing a monochrome sticker, run `node scripts/prepare-lottie-colors.mjs`. This idempotent script adds `cl: "lottie-fill"` to solid fills (`ty: "fl"`) and `cl: "lottie-stroke"` to solid strokes (`ty: "st"`), preserving existing classes and animation data.
- Lottie SVG copies `cl` onto its generated paths. In `globals.css`, `.bento-icon .lottie-fill` sets `fill: currentColor`, and `.bento-icon .lottie-stroke` sets `stroke: currentColor`. Change the section text color for all stickers or set the text color on the sticker's wrapper for one sticker.
- Keep fill and stroke rules separate: setting both on every path adds unwanted outlines or fills. Do not recolor SVG masks or clip paths with a blanket selector. CSS overrides the SVG color presentation attributes even when an animation or expression writes them again.
- This preparation is intended for these monochrome, solid-color assets. Review multicolor or gradient assets separately before adding them to this directory. It preserves opacity, stroke width, paths, expressions, timing, marker segments, and hover playback.
- Verify all five stickers on desktop and mobile, including hover playback. Check computed `fill`/`stroke`, not just JSON colors.

Renderer reference: [Lottie SVG shape styles](https://github.com/airbnb/lottie-web/blob/master/player/js/elements/svgElements/SVGShapeElement.js) (`createStyleElement` copies `data.cl` to the SVG path).

## Reveal animation

Every block has the same entrance. Text lines rise from behind a mask (`.reveal` wraps `.reveal__line`); images and icons fade in while sliding up (`.reveal__fade`). `--reveal-delay` on an element staggers it, and `--reveal-base` delays a whole block. The hero starts its sky and text animations together once the shader draws; blocks with `data-reveal` stay paused until `ScrollReveal` (`ui/scroll-reveal.tsx`, an IntersectionObserver) adds `.is-visible` the first time they scroll into view. `prefers-reduced-motion` and disabled JavaScript show everything without animation.

## Data

`page.tsx` sets `export const revalidate = 21600` (6 hours); every `fetch` in `src/lib/` uses `next: { revalidate: 21600 }` — keep them in sync. Fetching stays in server components and `src/lib/`; client components get plain data.

- **Contacts** — edit the usernames in `src/data/social.ts`. Each entry in `contacts` has a `username` and an optional `link`. Keys are platform names in display order. Telegram and Twitter show `@username` and link to their profiles. Discord shows the username and copies it silently on click.
- **Mod platforms** — `modAccounts` in `social.ts` feeds `lib/modrinth.ts` and `lib/curseforge.ts` (public APIs, no credentials; `User-Agent: vercim/portfolio/1.0 (contact@verc.im)`). Both return the account's projects as `ModProject` (`title`, `iconUrl`, `downloads`). cfwidget's author search caches the project list for a long time and misses new projects, so `curseforge.ts` also reads the author by id (`api.cfwidget.com/author/{id}`) and merges both lists.
- Fetchers never throw: they return `{ status: 'success', ... } | { status: 'error', message }` and log with `console.error('[service] ...')`. The UI must render a sensible state for every failure.
- Remote images rendered through `next/image` need their host in `images.remotePatterns` in `next.config.ts` (currently `cdn.modrinth.com` and `media.forgecdn.net`). Mod GIF icons are converted on the server to static PNGs from their first frame.

## Environment

Secrets live in `.env.local` (all `.env*` files and `.vercel/` are git-ignored). Never commit, print, or paste their values. The current code reads no environment variables.

## Styling

- Tailwind v4 through PostCSS; `globals.css` starts with `@import "tailwindcss"`.
- Colors are `--c-*` tokens on `:root`; reuse them instead of hard-coding colors. `--c-sky-*` duplicate the `CloudShader` defaults (the shader takes literal colors). Both text blocks in the hero use the cloud mask with `--c-on-sky` (white) as their fallback. The white blocks use `--c-ink`, the black ones `--c-dark` with `--c-on-dark`.
- Use the standard Tailwind sizing scale and group repeated styles into component classes in `globals.css`. Compose them with utilities for local adjustments. Register shared tokens in `@theme` and keep viewport calculations in CSS. Use named breakpoints for responsive sizes and spacing.
- Use `framed-section` for inset cards and `page-gutters` for full-width sections. Both use the same frame and content insets. Keep the reveal keyframes, masks, and global image drag prevention in CSS.
- The `desktop` breakpoint (42.5rem) switches the showcases and bento to their desktop layouts. Larger screens use Tailwind's standard `lg` and `xl` breakpoints for sizing.
- Use Geist via `font-sans`. Use `display-type` for section headings and `paragraph-copy` for supporting text. The default weight is 600, with 400 for body copy and navigation. Anchor links scroll smoothly.
- Header links have a thin underline (1px, offset 0.3em); social links have no underline except on keyboard focus. No text shadows.

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

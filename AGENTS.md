# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js App Router portfolio written in TypeScript. Routes, layout metadata, and global styles live in `src/app/`. Reusable page sections and UI elements belong in `src/components/`; keep specialized primitives in `src/components/ui/`. Static configuration and social-link data live in `src/data/`, GitHub fetching and normalization in `src/lib/`, shared hooks in `src/hooks/`, and TypeScript models in `src/types/`. The site icon is `src/app/icon.svg`. Generated directories such as `.next/` and `node_modules/` must not be committed.

## Build, Test, and Development Commands

Use pnpm and keep `pnpm-lock.yaml` synchronized with dependency changes.

- `pnpm install` — install the locked dependencies.
- `pnpm dev` — start the local development server.
- `pnpm lint` — run the configured Next.js lint checks.
- `pnpm build` — create a production build and catch type or rendering errors.
- `pnpm start` — serve the completed production build locally.

## Coding Style & Naming Conventions

Follow the existing TypeScript style: two-space indentation, single quotes, semicolons, and trailing commas in multiline objects. Keep strict typing; avoid `any` and reuse models from `src/types/`. Components use PascalCase filenames and named exports (`ProjectCard.tsx`), hooks use `useCamelCase`, and utilities use camelCase. Prefer the `@/` alias over long relative imports. Add `'use client'` only when browser APIs, state, or interaction require it. Reuse CSS tokens and established BEM-like classes in `globals.css` instead of adding one-off inline styling.

## Testing Guidelines

No automated test framework or coverage threshold is currently configured. For every change, run `pnpm lint` and `pnpm build`. Manually verify affected layouts at mobile and desktop widths, external links, motion, and GitHub-data fallbacks. If adding a test runner, place tests beside their module as `*.test.ts` or `*.test.tsx` and add the corresponding pnpm script in the same pull request.

## Commit & Pull Request Guidelines

Recent history favors short, imperative summaries such as `Refine portfolio layout and project presentation`. Keep each commit focused and avoid generic messages like `update`. Pull requests should explain the user-visible result, list validation performed, and link relevant issues. Include before/after screenshots for visual changes and note any dependency or environment-variable changes. Never commit secrets; use `.env.local` for `GITHUB_TOKEN`.

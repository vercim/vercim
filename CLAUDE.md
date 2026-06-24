# CLAUDE.md

## Commands

```bash
pnpm dev      # start dev server (localhost:3000)
pnpm build    # production build
pnpm lint     # ESLint
```

No test suite exists.

## Architecture

Single-page Next.js 15 (App Router) portfolio site with three scroll-sections: `HeroSection`, `ProjectsSection`, `VideoSection`. The root page (`src/app/page.tsx`) sets `revalidate = 21600` (6h ISR).

### Configuration entry points

All user-facing content lives in three files — no other files need editing for typical customization:

- **`src/data/config.ts`** — GitHub username, pinned repos fallback, GIF pool, marketplace URL, YouTube channel IDs, pagination settings
- **`src/data/social.ts`** — social link chips (icon, label, handle/href). Links with a non-empty `href` open in a new tab; links with an empty `href` copy `handle` to clipboard on click.
- **`src/data/projects.ts`** — `youtubeOverrides`: maps repo name → YouTube video ID to attach a video embed to a specific project card

### Data fetching (`src/lib/`)

- **`github.ts`** — `fetchRepos` (REST, filters forks/archived/profile-repo), `fetchPinnedRepoNames` (GraphQL, requires `GITHUB_TOKEN`; falls back to `config.pinnedRepos`), `fetchLatestReleaseUrl`. All use `next: { revalidate: 21600 }`.
- **`youtube.ts`** — `fetchChannelVideos` parses the public YouTube RSS feed (no API key needed). `enrichWithStats` calls the YouTube Data API v3 for view/like counts and requires `YOUTUBE_API_KEY` env var.

### Styling

Tailwind CSS v4 with a custom design-token layer. All colors are defined as CSS variables in `src/app/globals.css` and exposed to Tailwind via `@theme inline`. Use semantic token names (`text-fg`, `text-muted`, `text-subtle`, `text-faint`, `text-ghost`, `border-line-soft`, etc.) rather than raw colors. Default theme is dark; light theme uses the `.light` class.

Font: JetBrains Mono only, loaded via `next/font/google`.

### Client-side feature toggles

Three React contexts (in `src/hooks/`) persist user preferences to `localStorage`:

| Hook | Key | Controls |
|---|---|---|
| `useGifEnabled` | `gif_enabled` | whether GIFs rotate in hero |
| `useMotionEnabled` | `motion_enabled` | animations & smooth scroll (also sets `html.no-motion` class) |
| `useSidebarEnabled` | `sidebar_enabled` | fixed left ScrollNav visibility |

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `GITHUB_TOKEN` | No | Enables pinned repo GraphQL query; increases rate limits |
| `YOUTUBE_API_KEY` | No | Enriches videos with view/like counts |

### `next.config.ts`

`images.remotePatterns` allows `**.giphy.com` and `i.ytimg.com`. Add new image domains here when needed.
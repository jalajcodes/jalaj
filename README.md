# jalaj.fyi

[![Deploy](https://github.com/jalajcodes/jalaj/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/jalajcodes/jalaj/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

The personal site and blog of Jalaj Gupta, an AI-first fullstack developer from Bengaluru, India. Live at **[jalaj.fyi](https://jalaj.fyi)**.

Built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com) v4 and Markdown content collections. Search is [Pagefind](https://pagefind.app). It is hosted on Cloudflare Workers (static assets) and deployed from GitHub Actions.

## What's in it

- **Pages:** home, projects, about, writing (with tags and RSS), search and a 404.
- **Writing:** Markdown posts with reading time, tags, previous/next links and a reading-progress bar. Code blocks use [Expressive Code](https://expressive-code.com) (themes that follow the light/dark switch, a copy button, line highlighting and frames).
- **Search:** Pagefind runs in the visitor's browser and indexes the posts plus the Projects and About pages. It only exists on the built site, not in `npm run dev`.
- **Whimsy:**
  - a `JJ` hexagon intro that plays once per browser session
  - letters that squish as you move the cursor across them
  - a cursor-reactive skills field and a soft glow that trails the pointer
  - a circular theme-switch transition (View Transitions API) and native page transitions
  - **Shoot the page:** the footer button (on every page) or typing the word `shoot` starts an Asteroids-style game where your bullets destroy the page's own words and letters. Fly off the top or bottom edge and the page scrolls. Arrow keys or WASD to fly, Space to fire, M to mute, Esc to exit, with on-screen buttons on touch screens. Sound is synthesised with the Web Audio API (no audio files) and the mute choice is remembered. The code is `src/scripts/asteroids.ts`, loaded only when you start it, and exiting reloads the page to put everything back.
- **Theme:** dark by default, with a light mode. A saved choice wins. There is no flash on load.
- **Accessibility and motion:** all animation respects `prefers-reduced-motion`, and the pointer effects are skipped on touch screens.
- **Links:** external links open in a new tab.
- **SEO:** a canonical URL, Open Graph and Twitter tags and a 1200×630 social card on every page. The site-wide card is `public/og.png` (made from `scripts/og.html`), and every post gets its own card, drawn at build time by [astro-og-canvas](https://github.com/delucis/astro-og-canvas) (`src/pages/og/[...route].ts`). Home and About carry `Person`/`WebSite` structured data, and posts carry `BlogPosting` and breadcrumbs. There is also a sitemap, `robots.txt`, and `noindex` on the search and 404 pages.

## Develop

Requires **Node 22.23.4 or newer** (Astro 7).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # build to dist/, then index search with Pagefind
npm run preview   # serve the built site (search works here)
npm run deploy    # build and deploy with Wrangler (needs `wrangler login`)
```

To type-check the project: `npx astro check`.

If code blocks look unstyled after changing the Expressive Code settings in `astro.config.mjs`, delete `node_modules/.astro` and rebuild. A stale build cache can leave pages pointing at a stylesheet name that no longer exists. A fresh build, like CI, is not affected.

## Content

| What | Where |
| --- | --- |
| Posts | `src/content/blog/*.md` with `title`, `description`, `date`, optional `tags` and `draft` |
| Projects | `src/data/projects.ts` (set `featured: true` to show one on the home page) |
| Socials, skills, GitHub facts, nav | `src/data/site.ts` |
| Theme colours and effects | `src/styles/global.css` |

A post's `date` is shown as written, so set it to when you actually published it.

## Project structure

```text
src/
  components/   Header, Footer, Chars (squishy text), Preloader, Blob, SkillField, ...
  content/blog/ Markdown posts
  data/         site and projects data
  layouts/      Base.astro (head, theme script, shared scripts)
  pages/        index, about, projects, search, 404, blog/, tags/, rss.xml
  styles/       global.css (Tailwind v4 theme tokens, keyframes)
public/         favicon.svg, favicon.png, apple-touch-icon.png
wrangler.jsonc  Worker config and the jalaj.fyi custom domains
.github/        CI/deploy workflow and Dependabot
```

## Deploy

`.github/workflows/deploy.yml` builds and type-checks on every push and pull request. A push to `main` also deploys to Cloudflare Workers with Wrangler. It needs two repository secrets:

- `CLOUDFLARE_API_TOKEN`: an account API token made from the "Edit Cloudflare Workers" template
- `CLOUDFLARE_ACCOUNT_ID`

`wrangler.jsonc` attaches `jalaj.fyi` and `www.jalaj.fyi` as custom domains. Dependabot opens grouped updates for npm and GitHub Actions once a month.

## History

This site started on Gatsby. The old version is preserved on the [`gatsby-legacy`](https://github.com/jalajcodes/jalaj/tree/gatsby-legacy) branch.

## License

MIT

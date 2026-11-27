# jalaj.fyi

Personal site and blog. Built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com) v4, Markdown content collections and [Pagefind](https://pagefind.app) search, hosted on Cloudflare Workers (static assets).

Highlights: a one-per-session `<JJ>` intro, squishy hover letters, a cursor-reactive skills field, a circular theme-switch transition, and native page transitions. All of it respects `prefers-reduced-motion`.

## Develop

Requires Node 22.23.4 or newer.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # builds to dist/ and indexes search
npm run deploy    # build + wrangler deploy
```

## Content

- **Posts:** add a Markdown file to `src/content/blog/` with `title`, `description`, `date` and optional `tags` / `draft` frontmatter.
- **Projects:** edit `src/data/projects.ts`.
- **Socials and skills:** edit `src/data/site.ts`.

## History

The previous Gatsby version of this site is preserved on the `gatsby-legacy` branch.

## License

MIT

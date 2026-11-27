# jalaj.fyi

Personal site and blog. Built with [Astro](https://astro.build), plain CSS, Markdown content collections and [Pagefind](https://pagefind.app) search, hosted on Cloudflare Workers (static assets).

## Develop

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # builds to dist/ and indexes search
npm run deploy    # build + wrangler deploy
```

## Writing a post

Add a Markdown file to `src/content/blog/` with `title`, `description`, `date` and optional `tags` / `draft` frontmatter.

## History

The previous Gatsby version of this site is preserved on the `gatsby-legacy` branch.

## License

MIT

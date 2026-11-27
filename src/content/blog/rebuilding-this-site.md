---
title: 'Rebuilding this site on Astro and Cloudflare'
description: 'Why I dropped Gatsby, and what the new stack looks like.'
date: 2026-11-27
tags: [meta, astro]
---

This site used to run on Gatsby v2. Gatsby is no longer actively developed, the dependencies were years out of date, and for a site with a handful of Markdown posts the GraphQL data layer was more machinery than I needed.

The new version is:

- **Astro** for static pages and Markdown content collections
- **Plain CSS** with a light and dark theme
- **Pagefind** for search
- **Cloudflare Workers** (static assets) for hosting

The old code lives on the `gatsby-legacy` branch of the repo.

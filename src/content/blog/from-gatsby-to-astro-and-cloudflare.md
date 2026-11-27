---
title: 'From Gatsby to Astro and Cloudflare'
description: 'Why I rebuilt this site, what I kept from the old one, and the DNS detail that tripped up the cutover.'
date: 2026-11-27
tags: [meta, astro, cloudflare]
---

This site used to run on Gatsby v2. I rebuilt it in one sitting with Astro, Tailwind and Cloudflare Workers. Here is why, what I kept, and what to watch for if you do the same.

## Why leave Gatsby

Looking at the old repo made the case on its own:

- It was a **Gatsby v2 and React 16** project. It needed `NODE_OPTIONS=--openssl-legacy-provider` to start on a modern Node.
- The last real commit was in **2022**. Dependabot had open pull requests I could not merge, because one of them jumped a major version of a plugin that would have needed a newer Gatsby core.
- The site itself was small: about 6,000 lines of JavaScript, two placeholder posts and a handful of pages. Roughly a quarter of the code was animated SVG backgrounds. A GraphQL data layer for two Markdown files is a lot of machinery.

The old site had also started from an open-source site template, and part of it, like the guides, speaking and interviews data, was leftover from that template.

## The new stack

- **Astro** with a content collection for Markdown posts: type-checked frontmatter, and zero JavaScript on pages that do not need it.
- **Tailwind CSS v4** with theme colours as CSS variables, so light and dark mode are one set of tokens.
- **Pagefind** for search. It indexes the built HTML, so there is no search service to run.
- **Cloudflare Workers** with static assets for hosting.
- **GitHub Actions** to build on every push and deploy from the main branch.

The old code is not gone. It lives on the `gatsby-legacy` branch of the [repo](https://github.com/jalajcodes/jalaj).

## What I kept

The first version had a lot of personality, and I did not want to lose it. Three things came over, rebuilt without any animation library:

- **The intro.** The hexagon with `<JJ>` inside is the same logo path as before. It draws itself, the brackets slide out, and a curtain lifts. It plays once per browser session and skips itself for reduced-motion users.
- **The squishy letters.** Hover over a heading and a character does a rubber-band wobble. It is a nested pair of spans so the entrance animation and the hover animation do not fight each other.
- **The cursor-reactive grid.** On the About page, the list of tools swells as your cursor gets near. It is one `pointermove` handler that sets a CSS variable per word.

New this time: the circular theme switch that grows out from where you click (View Transitions API), page transitions with a single line of CSS (`@view-transition { navigation: auto; }`), and a soft glow that trails the cursor.

## The Cloudflare detail

Moving a domain that already points at another host has one catch. The old site's DNS records were two CNAMEs, `jalaj.fyi` and `www`, pointing at Netlify. When you add a custom domain to a Worker, Cloudflare refuses if the hostname already has records it does not manage:

```text
Hostname 'jalaj.fyi' already has externally managed DNS records (A, CNAME, etc).
Delete them first or try a different hostname.
```

So the cutover is: deploy the Worker, delete exactly those two conflicting records (and nothing else, since other subdomains on the same zone were still in use), then attach the custom domains. The site was live within a minute.

For CI, a scoped token was enough. Cloudflare's "Edit Cloudflare Workers" template covers deploying a Worker that already has its custom domains attached. I held back on adding DNS permissions until a deploy proved they were needed, and they were not.

## Was it worth it

The build now takes under a second, there is nothing to patch, and adding a post is dropping a Markdown file in a folder. The site is faster, smaller, and finally easy to change, which was the real goal.

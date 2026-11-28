import { defineConfig, fontProviders } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import expressiveCode from 'astro-expressive-code'
import mdx from '@astrojs/mdx'

export default defineConfig({
  site: 'https://jalaj.fyi',
  // Fetch a page as soon as you hover or focus its link, so the click usually lands on a page that is already loaded.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // Fonts: Astro preloads them, writes the @font-face rules and builds metric-matched fallbacks so a swap does not
  // shift the layout. The files come from the installed @fontsource packages, so nothing is fetched at build time.
  fonts: [
    {
      name: 'Righteous',
      cssVariable: '--font-righteous',
      provider: fontProviders.local(),
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            weight: 400,
            style: 'normal',
            display: 'block', // headline font: hold the text briefly instead of flashing a fallback
            src: ['./node_modules/@fontsource/righteous/files/righteous-latin-400-normal.woff2'],
          },
        ],
      },
    },
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.local(),
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            weight: '100 900',
            style: 'normal',
            src: ['./node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'],
          },
        ],
      },
    },
    {
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains',
      provider: fontProviders.local(),
      fallbacks: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      options: {
        variants: [
          {
            weight: '100 800',
            style: 'normal',
            src: ['./node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2'],
          },
        ],
      },
    },
  ],
  integrations: [
    // Code blocks: frames, line highlighting, diffs and a copy button. Themes follow the site's own light/dark switch.
    expressiveCode({
      themes: ['github-dark-dimmed', 'github-light'],
      themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
      useDarkModeMediaQuery: false,
      styleOverrides: {
        borderRadius: '0.75rem',
        borderColor: 'var(--line)',
        codeFontFamily: 'var(--font-jetbrains)',
        codeFontSize: '0.82rem',
        frames: { frameBoxShadowCssValue: 'none' },
      },
    }),
    // Expressive Code has to come before MDX. MDX lets posts use components, e.g. <Callout>.
    mdx(),
    sitemap({ filter: (page) => !page.includes('/search') }),
  ],
  vite: { plugins: [tailwindcss()] },
})

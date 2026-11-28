import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import expressiveCode from 'astro-expressive-code'

export default defineConfig({
  site: 'https://jalaj.fyi',
  // Fetch a page as soon as you hover or focus its link, so the click usually lands on a page that is already loaded.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [
    // Code blocks: frames, line highlighting, diffs and a copy button. Themes follow the site's own light/dark switch.
    expressiveCode({
      themes: ['github-dark-dimmed', 'github-light'],
      themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
      useDarkModeMediaQuery: false,
      styleOverrides: {
        borderRadius: '0.75rem',
        borderColor: 'var(--line)',
        codeFontFamily: '"JetBrains Mono Variable", ui-monospace, "SF Mono", Menlo, monospace',
        codeFontSize: '0.82rem',
        frames: { frameBoxShadowCssValue: 'none' },
      },
    }),
    sitemap({ filter: (page) => !page.includes('/search') }),
  ],
  vite: { plugins: [tailwindcss()] },
})

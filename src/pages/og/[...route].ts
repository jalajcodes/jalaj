// A social-card image for every post, drawn at build time (shown when a post link is shared).
import { OGImageRoute } from 'astro-og-canvas'
import { getPosts } from '../../lib'

const posts = await getPosts()
const pages = Object.fromEntries(
  posts.map((p) => [`blog/${p.id}`, { title: p.data.title, description: p.data.description }]),
)

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page) => {
    // Long titles get smaller type so the card always keeps its margins.
    const long = page.title.length > 60
    return {
      title: page.title,
      description: page.description,
      bgGradient: [[10, 12, 13]],
      border: { color: [33, 230, 193], width: 16, side: 'inline-start' },
      padding: 80,
      logo: { path: './public/apple-touch-icon.png', size: [96] },
      font: {
        title: { size: long ? 52 : 66, lineHeight: 1.12, color: [236, 235, 230], families: ['Righteous'] },
        description: { size: long ? 25 : 30, lineHeight: 1.4, color: [154, 160, 166], families: ['Inter'] },
      },
      fonts: [
        './node_modules/@fontsource/righteous/files/righteous-latin-400-normal.woff',
        './node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
      ],
    }
  },
})

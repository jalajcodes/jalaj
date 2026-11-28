import { getCollection, type CollectionEntry } from 'astro:content'

export async function getPosts() {
  // Drafts show up in `npm run dev` so they can be previewed, never in a build.
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft)
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.data.title.localeCompare(b.data.title))
}

export const readingTime = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 200))

export const fmtDate = (d: Date, long = false) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: long ? 'long' : 'short', day: 'numeric', timeZone: 'UTC' })

export type Post = CollectionEntry<'blog'>

// Posts that share tags with `post`, most shared first, then newest.
export function relatedPosts(post: Post, all: Post[], n = 3) {
  const mine = new Set(post.data.tags)
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, shared: p.data.tags.filter((t) => mine.has(t)).length }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared || b.p.data.date.valueOf() - a.p.data.date.valueOf())
    .slice(0, n)
    .map((x) => x.p)
}

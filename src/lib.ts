import { getCollection, type CollectionEntry } from 'astro:content'

export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => !data.draft)
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.data.title.localeCompare(b.data.title))
}

export const readingTime = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 200))

export const fmtDate = (d: Date, long = false) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: long ? 'long' : 'short', day: 'numeric', timeZone: 'UTC' })

export type Post = CollectionEntry<'blog'>

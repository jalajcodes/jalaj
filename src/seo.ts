import { SITE, SOCIALS, SKILLS } from './data/site'

export const abs = (path: string) => new URL(path, SITE.url).toString()

/** The one person this site is about. Other schema objects point at it by @id. */
export const PERSON_ID = `${SITE.url}/#person`

export const person = () => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: SITE.title,
  url: SITE.url,
  image: abs('/og.png'),
  jobTitle: 'Lead Software Development Engineer',
  description: SITE.description,
  address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
  sameAs: SOCIALS.map((s) => s.href),
  knowsAbout: SKILLS,
})

export const website = () => ({
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.title,
  description: SITE.description,
  inLanguage: 'en',
  publisher: { '@id': PERSON_ID },
})

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
})

export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes })

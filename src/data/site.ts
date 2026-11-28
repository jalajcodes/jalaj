export const SITE = {
  title: 'Jalaj Gupta',
  tagline: 'Lead Software Development Engineer in Bengaluru, India',
  description:
    'Jalaj Gupta is a Lead Software Development Engineer from Bengaluru, India. AI agents on AWS Bedrock AgentCore, fullstack engineering across React, Node and cloud infrastructure.',
  url: 'https://jalaj.fyi',
}

// Facts about the GitHub account (jalajcodes), checked on 2026-11-27.
export const GITHUB_FACTS = { since: 2016, publicRepos: 93 }

export const NAV = [
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Writing' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
]

export const SOCIALS = [
  { name: 'GitHub', handle: 'jalajcodes', href: 'https://github.com/jalajcodes' },
  { name: 'X', handle: '@jalajcodes', href: 'https://twitter.com/jalajcodes' },
  { name: 'LinkedIn', handle: 'jalajgupta', href: 'https://linkedin.com/in/jalajgupta' },
  { name: 'CodePen', handle: 'jalajcodes', href: 'https://codepen.io/jalajcodes' },
]

export const SKILLS = [
  'AI',
  'LLM Agents',
  'MCP',
  'RAG',
  'Vector Search',
  'Embeddings',
  'Prompt Engineering',
  'Amazon Bedrock',
  'Bedrock AgentCore',
  'AWS',
  'Claude',
  'OpenAI',
  'OpenRouter',
  'Workers AI',
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Express',
  'Hono',
  'MongoDB',
  'PostgreSQL',
  'SQLite',
  'Tailwind',
  'Astro',
  'Gatsby',
  'Redux',
  'Firebase',
  'Prisma',
  'Cloudflare Workers',
  'D1',
]

// One-liners shown when a skill is clicked on the About page. Only things that are true and checkable are listed;
// a skill without a note is simply not clickable.
export const SKILL_NOTES: Record<string, string> = {
  'Amazon Bedrock': 'Where my agent work runs. See the post on the agent-assisted SDLC.',
  'Bedrock AgentCore': 'Used to build an agent-assisted software development flow. There is a post about it.',
  Astro: 'This site is built with Astro.',
  Tailwind: 'Every style on this site is Tailwind v4.',
  'Cloudflare Workers': 'Serves this site and the leaderboard API.',
  D1: 'Stores the Shoot the page scores.',
  SQLite: 'The engine under D1, so the leaderboard is SQLite.',
  Gatsby: 'The old version of this site. It lives on the gatsby-legacy branch.',
  TypeScript: 'This whole site, the game and the Worker are TypeScript.',
}

// The short list shown in the home page marquee: things I can back up with work. The full list is SKILLS.
export const HEADLINE_SKILLS = [
  'AI agents',
  'Amazon Bedrock AgentCore',
  'MCP',
  'RAG',
  'TypeScript',
  'React',
  'Node.js',
  'AWS',
  'Terraform',
  'PostgreSQL',
  'Cloudflare Workers',
]

// Numbers from my resume, shown under the home page hero.
export const PROOF = [
  { n: '5+', label: 'years shipping production software' },
  { n: '2M+', label: 'users on a system I shipped to' },
  { n: '75%', label: 'Google sign-up conversion' },
  { n: '50%', label: 'less time from ticket to production' },
]

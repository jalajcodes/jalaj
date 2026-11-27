export interface Project {
  slug: string
  name: string
  blurb: string
  year: number
  stack: string[]
  stars?: number
  live?: string
  featured?: boolean
}

export const repoUrl = (slug: string) => `https://github.com/jalajcodes/${slug}`

export const PROJECTS: Project[] = [
  {
    slug: 'postdaily',
    name: 'PostDaily',
    blurb:
      'A LinkedIn writing companion: AI drafts in your own voice, an idea bank, a scheduler, streaks, voice notes and PDF carousels. Runs free on Cloudflare, or on your Mac.',
    year: 2026,
    stack: ['React', 'Hono', 'Cloudflare Workers', 'D1', 'TypeScript'],
    stars: 1,
    live: 'https://postdaily.jalaj.fyi',
    featured: true,
  },
  {
    slug: 'homesweethome-client',
    name: 'Home Sweet Home',
    blurb:
      'A fullstack home-rental app: sign in with Google, connect Stripe to host listings, and book homes hosted by other people.',
    year: 2020,
    stack: ['React', 'TypeScript', 'GraphQL', 'Ant Design', 'Stripe'],
    live: 'https://homesweethomee.netlify.app',
    featured: true,
  },
  {
    slug: 'max-connect',
    name: 'Max Connect',
    blurb: 'A social media app built with React, Redux, Tailwind and MirageJS.',
    year: 2022,
    stack: ['React', 'Redux', 'Tailwind', 'MirageJS'],
    live: 'https://max-connect.netlify.app',
    featured: true,
  },
  {
    slug: 'cache-api',
    name: 'Cache API',
    blurb: 'A key-value cache API with a configurable size limit, stats and cleanup, documented with Swagger.',
    year: 2025,
    stack: ['Express', 'Sequelize', 'SQLite', 'Swagger'],
    live: 'https://cache-api-hvwz.onrender.com/api-docs/',
    featured: true,
  },
  {
    slug: 'click-master',
    name: 'Click Master',
    blurb: 'A clicker-game MVP that runs as a Telegram Mini App, with TON wallet connect.',
    year: 2025,
    stack: ['Next.js', 'Prisma', 'MongoDB', 'TON Connect'],
    live: 'https://click-master-kohl.vercel.app',
  },
  {
    slug: 'task-trek',
    name: 'Task Trek',
    blurb: 'A MERN stack app to keep track of online stuff.',
    year: 2023,
    stack: ['MongoDB', 'Express', 'React', 'Node.js'],
    live: 'https://task-trek.onrender.com/',
    featured: true,
  },
  {
    slug: 'gatsby-theme-yoyo',
    name: 'gatsby-theme-yoyo',
    blurb: 'A GatsbyJS theme created for Gatsby Theme Jam.',
    year: 2019,
    stack: ['Gatsby', 'React'],
    stars: 6,
  },
  {
    slug: 'quizzy',
    name: 'Quizzy',
    blurb: 'A quiz app.',
    year: 2023,
    stack: ['React'],
    live: 'https://quizzyyy.vercel.app/',
  },
  {
    slug: 'zoomeet',
    name: 'Zoomeet',
    blurb: 'Zoom and Google Meet automater, so you never miss a meeting.',
    year: 2022,
    stack: ['JavaScript'],
    live: 'https://zoomeet.netlify.app/',
  },
  {
    slug: 'max-store-react',
    name: 'Max Store',
    blurb: 'An e-commerce store.',
    year: 2022,
    stack: ['React'],
    live: 'https://max-store.onrender.com/',
  },
  {
    slug: 'max-ui',
    name: 'Max UI',
    blurb: 'A component library.',
    year: 2022,
    stack: ['HTML', 'CSS'],
    stars: 1,
    live: 'https://maxui.netlify.app',
  },
  {
    slug: 'awesome-chatgpt-tools',
    name: 'awesome-chatgpt-tools',
    blurb: 'A curated list of tools and services built with ChatGPT and other AI tools.',
    year: 2022,
    stack: ['List'],
    stars: 3,
  },
  {
    slug: 'chatcord',
    name: 'Chatcord',
    blurb: 'A highly performant realtime chat app with React, Redux, Firebase and Semantic UI.',
    year: 2021,
    stack: ['React', 'Redux', 'Firebase'],
    live: 'https://chatcord.web.app',
  },
  {
    slug: 'hotflix',
    name: 'Hotflix',
    blurb: 'A movie tracker application.',
    year: 2021,
    stack: ['JavaScript', 'Firebase'],
    live: 'https://hotflix.web.app',
  },
  {
    slug: 'forevernote',
    name: 'Forevernote',
    blurb: 'An Evernote clone using Firebase and React.',
    year: 2021,
    stack: ['React', 'Firebase'],
    live: 'https://forevernote-f80da.web.app/',
  },
  {
    slug: 'galleryish',
    name: 'Galleryish',
    blurb: 'A photo gallery app created with React and Firebase.',
    year: 2021,
    stack: ['React', 'Firebase'],
    live: 'https://galleryish-8d74e.web.app/',
  },
  {
    slug: 'writeandlearn-client',
    name: 'Write and Learn',
    blurb: 'A fullstack blogging app built with React and Node, with live chat and live search built in.',
    year: 2020,
    stack: ['React', 'Node.js'],
  },
  {
    slug: 'react-image-gallery',
    name: 'React Image Gallery',
    blurb: 'An image gallery on the Unsplash API with infinite loading and image search.',
    year: 2020,
    stack: ['React'],
    stars: 1,
    live: 'https://infinite-qg4u.onrender.com',
  },
  {
    slug: 'bootcamping',
    name: 'Bootcamping',
    blurb: 'A full-featured REST API for a bootcamp website, with geocoding and advanced resource filtering.',
    year: 2020,
    stack: ['Node.js', 'MongoDB'],
  },
]

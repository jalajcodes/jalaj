// The resume page. Taken from Jalaj's PDF resume plus what has happened since (AI agents work, PostDaily, this site).
// Edit here and bump `updated`.
export const RESUME = {
  updated: '2026-11-28',
  title: 'AI-first fullstack developer',
  profile:
    'Fullstack developer in Bengaluru, India who builds AI agents and the products around them end to end: React on the front, Node and APIs on the back, shipped on AWS and Cloudflare. Passionate about open source, project architecture and user experience.',
  available: 'Open to freelance and full-time remote work.',
  skills: [
    {
      group: 'AI',
      items: ['LLM agents', 'MCP', 'RAG', 'Vector search', 'Amazon Bedrock AgentCore', 'Claude', 'OpenAI'],
    },
    { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Ruby', 'HTML', 'CSS'] },
    { group: 'Frontend', items: ['React', 'Next.js', 'Redux', 'Tailwind', 'Astro'] },
    { group: 'Backend', items: ['Node.js', 'Ruby on Rails', 'Sidekiq', 'BullMQ', 'Elasticsearch', 'GraphQL'] },
    { group: 'Data', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'SQLite and D1'] },
    { group: 'Cloud and tools', items: ['AWS', 'Cloudflare Workers', 'Docker', 'Git', 'GitHub Actions'] },
  ],
  experience: [
    {
      role: 'Senior Software Development Engineer',
      org: 'HabitNu',
      when: 'September 2023 to present',
      points: [
        'Building autonomous agents for the full software delivery flow, from ticket to production, cutting delivery time by half.',
        'Used AI and LLMs to create a full-fledged meal planner application.',
        'In charge of the billing product: worked on features and wrote code to keep it bug free and scalable.',
        'Deployed and maintained a self-hosted error and bug tracking application on AWS, which helped the team catch errors promptly and fix them.',
        'Integrated error tracking with Slack and set up processes around it so critical errors get caught on staging and fixed periodically.',
        'Interviewed candidates for SDE roles and mentored new hires as their Dev Buddy.',
        'Introduced team practices that help us move faster, such as Pair Reviews and Stop and Fix.',
      ],
    },
    {
      role: 'Software Development Engineer',
      org: 'GreatLearning (Byju’s)',
      when: 'August 2021 to September 2023',
      points: [
        'Implemented Google sign-up across applications, which has a 75% conversion rate and 15k monthly new users.',
        'Improved page speed scores from 50 to 95+ on desktop and made the majority of pages pass Core Web Vitals.',
        'Built an internal audit tool from scratch to production, reducing customer escalations by 33%.',
        'Migrated crucial APIs from Ruby to Node and heavily refactored the code to support all mobile and web services.',
        'Implemented a dark theme in the internal sales application, increasing productivity of the international team working nights.',
        'Integrated BullMQ in a Node application to process heavy operations in the background and serve as a robust backend.',
        'Learnt Elasticsearch and worked with the backend team to create advanced search capabilities.',
        'Over two years pushed code to support a system used by over 2 million users.',
      ],
    },
    {
      role: 'Open Source Hack Mentor',
      org: 'AnitaB.org',
      when: 'April',
      points: [
        'Created and triaged 20+ GitHub issues related to design and coding.',
        'Reviewed 20+ pull requests, ensuring code quality and compatibility.',
        'Helped people with programming issues on Zulip chat and GitHub.',
      ],
    },
  ],
  projects: [
    {
      name: 'PostDaily',
      href: 'https://postdaily.jalaj.fyi',
      stack: 'React, Hono, Cloudflare Workers, D1, TypeScript',
      points: [
        'A LinkedIn writing companion that I build and run end to end: AI drafts in your own voice, an idea bank, a scheduler, streaks, voice notes and PDF carousels.',
      ],
    },
    {
      name: 'jalaj.fyi',
      href: 'https://jalaj.fyi',
      stack: 'Astro, Tailwind, Cloudflare Workers, D1',
      points: [
        'This site and blog, with a game that blasts the page’s own words and a leaderboard backed by D1.',
        'Wrote up an agent-assisted SDLC on Amazon Bedrock AgentCore.',
      ],
    },
    {
      name: 'Chatcord',
      href: 'https://chatcord.web.app',
      stack: 'React, Redux, Firebase, Semantic UI',
      points: [
        'Realtime chat with image upload and avatars, responsive on mobile, with animations and micro interactions.',
      ],
    },
    {
      name: 'Home Sweet Home',
      href: 'https://homesweethomee.netlify.app',
      stack: 'React, TypeScript, Ant Design, GraphQL, Node',
      points: ['A rental app with the frontend and backend written from scratch in TypeScript, plus Stripe payments.'],
    },
  ],
  education: [
    { name: 'Bachelor of Science', where: 'St. Wilfred’s', when: '2018 to 2021' },
    { name: 'Full Stack Development', where: 'University of Helsinki', when: '' },
  ],
}

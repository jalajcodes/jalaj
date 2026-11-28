// Case studies for the home page. Kept to what can be said in public: no customer data, no internal names.
export interface Work {
  title: string
  org: string
  when: string
  problem: string
  did: string
  result: string
  stack: string[]
  href?: string
  hrefLabel?: string
}

export const WORK: Work[] = [
  {
    title: 'Agents for the whole delivery flow',
    org: 'HabitNu',
    when: '2025 to now',
    problem: 'Getting a ticket all the way to production took too long.',
    did: 'Built an agent-assisted software delivery flow on Amazon Bedrock AgentCore: isolated sessions, one gateway for tools, and agents that never hold credentials.',
    result: 'Cut the time from ticket to production by half.',
    stack: ['Amazon Bedrock AgentCore', 'AI agents', 'AWS', 'Terraform'],
    href: '/blog/agent-assisted-sdlc-on-bedrock-agentcore',
    hrefLabel: 'Read how it works',
  },
  {
    title: 'Smart scales to full body composition',
    org: 'HabitNu',
    when: 'Lead engineer',
    problem: 'Weight alone does not tell users much. They wanted the full picture of their body composition.',
    did: 'Integrated Bluetooth and Wi-Fi smart scales with the app, end to end.',
    result: 'Users get a full body composition analysis straight from their scale.',
    stack: ['Bluetooth', 'Wi-Fi devices', 'Fullstack'],
  },
  {
    title: 'An AI meal planner',
    org: 'HabitNu',
    when: 'Lead engineer',
    problem: 'Planning meals by hand takes time.',
    did: 'Used AI and LLMs to build a full-fledged meal planner inside the product.',
    result: 'Shipped to users as part of the app.',
    stack: ['LLMs', 'AI', 'Fullstack'],
  },
  {
    title: 'Sign-up and speed at scale',
    org: 'GreatLearning (Byju’s)',
    when: '2021 to 2023',
    problem: 'Page speed, sign-up and customer escalations all needed work, on systems used by millions.',
    did: 'Added Google sign-up across the applications, took page speed scores from 50 to 95+, moved crucial APIs from Ruby to Node, and built an internal audit tool from scratch.',
    result:
      '75% sign-up conversion and 15k new users a month, Core Web Vitals passing on most pages, and 33% fewer customer escalations.',
    stack: ['Node.js', 'React', 'Ruby', 'Elasticsearch', 'BullMQ'],
  },
]

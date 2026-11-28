// Case studies for the home page. Kept to what can be said in public: no customer data, no internal names.
export interface Work {
  title: string
  org: string
  when: string
  problem: string
  did: string
  result: string
  highlights?: string[]
  stack: string[]
  href?: string
  hrefLabel?: string
  /** Inline SVG id used to pick the diagram rendered in the card. */
  diagram?: 'agents' | 'scales' | 'meal' | 'speed'
}

export const WORK: Work[] = [
  {
    title: 'Agents for the whole delivery flow',
    org: 'HabitNu',
    when: '2025 to now',
    problem: 'Getting a ticket all the way to production took too long.',
    did: 'Built an agent-assisted software delivery flow on Amazon Bedrock AgentCore: isolated sessions, one gateway for tools, and agents that never hold credentials. Each agent handles a stage — code generation, review, testing, deployment — with human checkpoints in between.',
    result: 'Cut the time from ticket to production by half.',
    highlights: ['50% faster delivery', 'Zero credential exposure', 'Human-in-the-loop at every stage'],
    stack: ['Amazon Bedrock AgentCore', 'AI agents', 'AWS', 'Terraform'],
    href: '/blog/agent-assisted-sdlc-on-bedrock-agentcore',
    hrefLabel: 'Read how it works',
    diagram: 'agents',
  },
  {
    title: 'Smart scales to full body composition',
    org: 'HabitNu',
    when: 'Lead engineer',
    problem: 'Weight alone does not tell users much. They wanted the full picture of their body composition.',
    did: 'Integrated Bluetooth and Wi-Fi smart scales with the app, end to end — pairing, real-time data sync, parsing the proprietary protocols, and presenting 15+ body metrics in the UI.',
    result: 'Users get a full body composition analysis straight from their scale.',
    highlights: ['15+ body metrics', 'BLE + Wi-Fi support', 'Real-time sync'],
    stack: ['Bluetooth', 'Wi-Fi devices', 'React Native', 'Node.js'],
    diagram: 'scales',
  },
  {
    title: 'An AI meal planner',
    org: 'HabitNu',
    when: 'Lead engineer',
    problem: 'Planning meals by hand takes time, and most users gave up within a week.',
    did: 'Built an AI-powered meal planner that takes dietary preferences, health goals and restrictions as input and generates personalised weekly meal plans with recipes, nutritional breakdown and a grocery list.',
    result: 'Shipped to users as part of the app.',
    highlights: ['Personalised plans', 'Nutritional breakdown', 'Auto grocery list'],
    stack: ['LLMs', 'AI', 'Node.js', 'React Native'],
    diagram: 'meal',
  },
  {
    title: 'Sign-up and speed at scale',
    org: "GreatLearning (Byju's)",
    when: '2021 to 2023',
    problem: 'Page speed, sign-up and customer escalations all needed work, on systems used by millions.',
    did: 'Added Google sign-up across the applications, took page speed scores from 50 to 95+, moved crucial APIs from Ruby to Node, and built an internal audit tool from scratch that tracked every support escalation to resolution.',
    result:
      '75% sign-up conversion and 15k new users a month, Core Web Vitals passing on most pages, and 33% fewer customer escalations.',
    highlights: ['75% sign-up conversion', '50 → 95+ page speed', '33% fewer escalations'],
    stack: ['Node.js', 'React', 'Ruby', 'Elasticsearch', 'BullMQ'],
    diagram: 'speed',
  },
]

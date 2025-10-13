// Default Epic offerings and focus areas
export const DEFAULT_SPRINT_FOCUSES = [
  {
    id: 'epic-network',
    name: 'Epic Network',
    description: 'Community + Group Coaching + Software',
    color: 'oklch(0.75 0.15 264)',
    products: [
      'Epic Acquisition Accelerator',
      'DealDone Software',
      'Epic Business Suite',
      'Weekly Expert Coaching Calls',
      'Epic Network Investor Community'
    ],
    active: true
  },
  {
    id: 'epic-deal-fastrack',
    name: 'Epic Deal Fastrack',
    description: 'Private Coaching + Authority Assets',
    color: 'oklch(0.65 0.2 150)',
    products: [
      '1-on-1 Acquisition Roadmap Session',
      '1-on-1 coaching for 16 weeks',
      'Done-With-You Brand & Authority Assets',
      'Epic Deal Room WhatsApp Community',
      'Daily Deal Reviews'
    ],
    active: true
  },
  {
    id: 'epic-board',
    name: 'Epic Board',
    description: 'High-Level Mastermind (Invite-Only)',
    color: 'oklch(0.7 0.25 60)',
    products: [
      'Investor Mastermind',
      'Forever Board Option',
      'Exclusive Deal Flow Access'
    ],
    active: true
  },
  {
    id: 'dealdone-software',
    name: 'DealDone Software',
    description: 'All-in-one deal analysis tool',
    color: 'oklch(0.8 0.15 100)',
    products: [
      'Deal criteria definition',
      'Financial analysis',
      'Creative financing structures',
      'NDA/LOI/Pro forma generation'
    ],
    active: true
  },
  {
    id: 'epic-business-suite',
    name: 'Epic Business Suite',
    description: 'CRM for serious acquirers',
    color: 'oklch(0.75 0.2 200)',
    products: [
      'Seller conversation tracking',
      'Deal status management',
      'Opportunity pipeline'
    ],
    active: true
  },
  {
    id: 'consulting-equity',
    name: 'Consulting for Equity',
    description: 'Master Class on equity deals',
    color: 'oklch(0.65 0.15 30)',
    products: [
      'Equity deal structuring',
      'Upfront payment strategies',
      'Consulting project conversion'
    ],
    active: true
  },
  {
    id: 'seller-first',
    name: 'Seller-First Negotiation',
    description: 'Negotiation Playbook & Strategies',
    color: 'oklch(0.7 0.18 320)',
    products: [
      'Negotiation scripts',
      'Rapport building',
      'Seller financing strategies'
    ],
    active: true
  },
  {
    id: 'sba-preflight',
    name: 'SBA Preflight',
    description: 'SBA funding concierge service',
    color: 'oklch(0.75 0.15 180)',
    products: [
      'SBA funding guidance',
      '1-on-1 concierge support',
      'Deal funding assistance'
    ],
    active: true
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant Library',
    description: 'Pre-trained AI tools for deal-making',
    color: 'oklch(0.8 0.2 280)',
    products: [
      'Deal brainstorming AI',
      'Document generation',
      'Analysis automation'
    ],
    active: true
  },
  {
    id: 'general-content',
    name: 'General Content',
    description: 'Regular content and engagement',
    color: 'oklch(0.6 0.1 220)',
    products: [],
    active: true
  }
];

// Investment tiers
export const INVESTMENT_TIERS = {
  'epic-network-basic': {
    name: 'Epic Network Basic',
    price: '$79/mo',
    hidden: true,
    includes: ['Community', 'Coaching Calls', 'Templates']
  },
  'epic-network': {
    name: 'Epic Network Full',
    price: '$2,995 + $295/mo',
    includes: ['Everything in Basic', 'DealDone Software', 'Epic Business Suite']
  },
  'epic-deal-fastrack': {
    name: 'Epic Deal Fastrack',
    price: '$15,000 + $995/mo',
    includes: ['1-on-1 Coaching', 'Authority Assets', '6 months Epic Network']
  },
  'epic-board': {
    name: 'Epic Board',
    price: '$40,000/yr',
    includes: ['Invite-Only Mastermind', 'Forever Board Option: $100K']
  }
};
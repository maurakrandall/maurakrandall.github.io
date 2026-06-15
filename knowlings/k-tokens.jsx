// KNOWlings — Strategy Document
// Shared design tokens for the field-journal aesthetic.

const K = {
  // Paper & ink
  paper:      '#F5F1E8',    // warm off-white
  paperDeep:  '#EDE6D4',    // aged paper
  paperEdge:  '#E3D9C2',    // darker crease
  hairline:   '#1A2840',    // ink hairlines (low opacity uses)
  ink:        '#1A2840',    // deep indigo ink
  inkSoft:    '#34425A',
  inkMute:    '#6B7285',

  // Accents (single gold, single plum, nothing else)
  known:      '#C9A24B',    // gold — knowns, progress, attribution
  knownDeep:  '#A8842F',
  unknown:    '#6E5880',    // muted plum — unknowns, anonymous
  unknownSoft:'#8F7AA3',

  // Phase colors (subtle — shared chroma, varying hue)
  phase: {
    wondering: '#6E5880',   // plum (unknown)
    exploring: '#4E6A8A',   // slate blue
    learning:  '#4E7B6B',   // muted green
    seeing:    '#9B7435',   // burnt amber
    knowing:   '#C9A24B',   // gold
  },

  // Vertical colors (Markets, Burnout, etc)
  verticalMarkets:  '#4E6A8A',
  verticalBurnout:  '#B2532E',
  verticalWine:     '#7B3B4A',
  verticalLeader:   '#4E7B6B',
  verticalAI:       '#6E5880',
  verticalCook:     '#9B7435',

  // Type stacks
  display: "'Fraunces', 'Georgia', serif",
  serif:   "'Fraunces', 'Georgia', serif",
  sans:    "'Inter', system-ui, sans-serif",
  mono:    "'JetBrains Mono', ui-monospace, monospace",
};

// Phase definitions
const PHASES = [
  { id: 'wondering', label: 'Wondering', roman: 'I',
    meter: 8,  color: K.phase.wondering,
    summary: 'Arrived with questions. Full of unknowns.',
    sharing: 'Anonymous search · involuntary contribution',
    contrib: 'Step 0 — the aggregate count of searches tells you you are not alone.',
  },
  { id: 'exploring', label: 'Exploring', roman: 'II',
    meter: 28, color: K.phase.exploring,
    summary: 'Actively seeking. One-tap insight selection.',
    sharing: 'Anonymous · selection only · feeds aggregate',
    contrib: 'Level 1 — The Signal. One tap. No account needed.',
  },
  { id: 'learning', label: 'Learning', roman: 'III',
    meter: 55, color: K.phase.learning,
    summary: 'Patterns forming. Private labels stick.',
    sharing: 'Private labels · feeds aggregate data',
    contrib: 'Level 2 — The Label. Private, feeds aggregate, earns Spark.',
  },
  { id: 'seeing', label: 'Seeing', roman: 'IV',
    meter: 76, color: K.phase.seeing,
    summary: 'Connects things others don\u2019t yet see. Knowings written.',
    sharing: 'Public Knowings · attributed · community-facing',
    contrib: 'Level 3 — The Knowing. Public, attributed, earns Flame.',
  },
  { id: 'knowing', label: 'Knowing', roman: 'V',
    meter: 94, color: K.phase.knowing,
    summary: 'Never complete. Always in motion. Guides others.',
    sharing: 'Mentorship · vertical leadership · sponsorship',
    contrib: 'Level 4 — The Thread. Community conversation. Ace territory.',
  },
];

// The 8-step loop (from starter doc)
const LOOP = [
  { n: 0, title: 'The Query',            sub: 'involuntary · fully anonymous',
    body: 'You and 7 others researched this today.' },
  { n: 1, title: 'Assess',               sub: 'where are you right now?',
    body: 'Experience-level check.' },
  { n: 2, title: 'Receive',              sub: 'contextual, expert-backed',
    body: 'Multiple voices, attributed, non-prescriptive.' },
  { n: 3, title: 'Select',               sub: 'lowest conscious contribution',
    body: 'Choose an insight or \u201cother.\u201d Private, aggregate only.' },
  { n: 4, title: 'Act, decide, observe', sub: 'life happens',
    body: 'No requirement. Reality gets a turn.' },
  { n: 5, title: 'Reflect',              sub: 'tap, label, or Knowing',
    body: 'Three contribution levels. All optional.' },
  { n: 6, title: 'Shed unknowing',       sub: 'the meter rises',
    body: 'Knowns grow. Unknowns shred.' },
  { n: 7, title: 'Share',                sub: 'reputation compounds',
    body: 'Anonymous, selective, or attributed.' },
];

const VERTICALS = [
  { id: 'markets',  label: 'Markets',     status: 'MVP · Private Alpha',       color: K.verticalMarkets, meter: 62, knowlings: 187 },
  { id: 'burnout',  label: 'Burnout',     status: 'Prototype · this doc',       color: K.verticalBurnout, meter: 34, knowlings: 42 },
  { id: 'leader',   label: 'Leadership',  status: 'Concept',                   color: K.verticalLeader,  meter: 12, knowlings: 8 },
  { id: 'wine',     label: 'Wine',        status: 'Concept',                   color: K.verticalWine,    meter: 0,  knowlings: 3 },
  { id: 'cook',     label: 'Cooking',     status: 'Nominated',                 color: K.verticalCook,    meter: 0,  knowlings: 14 },
  { id: 'ai',       label: 'AI Skills',   status: 'Seeded by founder',          color: K.verticalAI,      meter: 18, knowlings: 23 },
];

// Contribution levels
const CONTRIB = [
  { level: 1, label: 'The Signal',  cost: 'one tap',            account: 'none',       sharing: 'Anonymous',   earns: 'Aggregate entry' },
  { level: 2, label: 'The Label',   cost: 'private note',       account: 'created',    sharing: 'Private',     earns: 'Spark · feeds data' },
  { level: 3, label: 'The Knowing', cost: 'written, attributed',account: 'verified',   sharing: 'Public',      earns: 'Flame · reputation' },
  { level: 4, label: 'The Thread',  cost: 'community-led',      account: 'verified',   sharing: 'Attributed',  earns: 'Ace · vertical standing' },
];

Object.assign(window, { K, PHASES, LOOP, VERTICALS, CONTRIB });

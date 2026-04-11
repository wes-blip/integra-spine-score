export type QuizOption = {
  id: string
  label: string
  points: number
}

export type QuizQuestion = {
  id: string
  topic: string
  headline: string
  options: QuizOption[]
}

/** Six questions; max points per row sum to 100. */
export const QUESTIONS: QuizQuestion[] = [
  {
    id: 'workday',
    topic: 'Your workday',
    headline:
      'How many hours per day do you spend sitting — including desk work and commuting?',
    options: [
      { id: 'workday-lt3', label: 'Less than 3 hours', points: 0 },
      { id: 'workday-3to5', label: '3 to 5 hours', points: 5 },
      { id: 'workday-6to8', label: '6 to 8 hours', points: 10 },
      { id: 'workday-gt8', label: 'More than 8 hours', points: 15 },
    ],
  },
  {
    id: 'feel',
    topic: 'How you feel',
    headline: 'How does your body typically feel during a workday?',
    options: [
      { id: 'feel-none', label: 'Little to no tension', points: 0 },
      {
        id: 'feel-eod',
        label: 'End of day tension, clears overnight',
        points: 8,
      },
      {
        id: 'feel-intermittent',
        label: 'Discomfort that comes and goes',
        points: 15,
      },
      {
        id: 'feel-persistent',
        label: 'Consistent tension or pain most days',
        points: 25,
      },
    ],
  },
  {
    id: 'posture',
    topic: 'Posture',
    headline:
      'How often do you catch yourself slouching or rounding your shoulders?',
    options: [
      { id: 'posture-rarely', label: 'Rarely', points: 0 },
      { id: 'posture-sometimes', label: 'Sometimes', points: 5 },
      { id: 'posture-often', label: 'Often', points: 10 },
      { id: 'posture-always', label: 'Almost all the time', points: 15 },
    ],
  },
  {
    id: 'movement',
    topic: 'Movement',
    headline:
      'How often do you stand, stretch, or move during your workday?',
    options: [
      { id: 'move-hourly', label: 'At least every hour', points: 0 },
      { id: 'move-few', label: 'A few times per day', points: 5 },
      { id: 'move-rarely', label: 'Rarely', points: 10 },
      { id: 'move-never', label: 'Almost never', points: 15 },
    ],
  },
  {
    id: 'recovery',
    topic: 'Recovery',
    headline: 'How do you feel when you wake up in the morning?',
    options: [
      { id: 'recovery-loose', label: 'Loose and comfortable', points: 0 },
      {
        id: 'recovery-slight',
        label: 'Slightly stiff, clears quickly',
        points: 5,
      },
      { id: 'recovery-stiff', label: 'Stiff most mornings', points: 10 },
      {
        id: 'recovery-achy',
        label: 'Stiff or achy almost every day',
        points: 15,
      },
    ],
  },
  {
    id: 'habits',
    topic: 'Current habits',
    headline:
      'Do you currently do anything to actively support your posture or spinal health?',
    options: [
      { id: 'habits-yes', label: 'Yes, consistently', points: 0 },
      { id: 'habits-occasional', label: 'Occasionally', points: 5 },
      { id: 'habits-notreally', label: 'Not really', points: 10 },
      { id: 'habits-no', label: 'No', points: 15 },
    ],
  },
]

export const MAX_SCORE = 100

export function scoreFromSelections(selectedOptionIndex: number[]): number {
  return selectedOptionIndex.reduce((sum, optIdx, qIdx) => {
    const q = QUESTIONS[qIdx]
    if (optIdx < 0 || !q?.options[optIdx]) return sum
    return sum + q.options[optIdx].points
  }, 0)
}

export type StressTier = 'high' | 'moderate' | 'low'

export function getTier(score: number): StressTier {
  if (score >= 70) return 'high'
  if (score >= 40) return 'moderate'
  return 'low'
}

/** Option indices 0–3 per question; -1 = unanswered. */
export function getPersonalizationSentence(
  tier: StressTier,
  selectedOptionIndex: number[],
): string | null {
  const q1 = selectedOptionIndex[0]
  const q3 = selectedOptionIndex[2]
  const q4 = selectedOptionIndex[3]

  if (tier === 'high' && (q4 === 2 || q4 === 3)) {
    return 'A significant driver here is limited movement throughout your day. Your spine needs regular decompression to recover from sustained sitting.'
  }
  if (tier === 'moderate' && (q1 === 2 || q1 === 3)) {
    return 'Extended sitting hours appear to be a key contributor to your pattern. Duration alone creates cumulative load, even with decent posture.'
  }
  if (tier === 'low' && (q3 === 2 || q3 === 3)) {
    return 'One area worth watching: your posture awareness suggests a pattern that could build over time, even when symptoms are low right now.'
  }
  return null
}

/** "What this means" — copy matches SpineScore ResultPage Copy v3.pdf per tier. */
export const RESULTS_BODY: Record<StressTier, { paragraphs: string[] }> = {
  high: {
    paragraphs: [
      'A score in this range indicates your spine is under sustained mechanical load that your body is actively compensating for every day. Most people at this level have already developed postural adaptation patterns they cannot feel yet but that show up clearly on examination.',
      'This does not resolve with stretches or ergonomic adjustments. The compensation patterns are already set.',
      'At this stage, these patterns do not stay stable. They typically progress into recurring stiffness, nerve irritation, or pain with routine activities. This is usually the point where people wish they had addressed it earlier. What changes them is a focused clinical intervention that identifies where the load is concentrated and resets the pattern before it becomes permanent.',
    ],
  },
  moderate: {
    paragraphs: [
      'Moderate is the most consequential tier because the symptoms are not severe enough to act on yet. Most people in this range already feel this. They just have not labeled it yet. That mid-day tightness, the need to stretch, the fatigue in your upper back. That is this pattern showing up.',
      'You are in the window where spinal stress is accumulating faster than your body is recovering. Most people do not act here, and that is why it turns into something bigger. This is the stage where the pattern either gets corrected or quietly compounds into something that takes significantly longer to address.',
    ],
  },
  low: {
    paragraphs: [
      'You are ahead of most desk workers your age. Your habits are working.',
      'Most people who eventually develop issues started here and assumed they were fine. This is where staying ahead is easy, or where people slowly fall behind. The question is not whether something is wrong. It is whether small imbalances are developing beneath the surface before symptoms appear. This is the only stage where correction is simple.',
      'The highest-performing patients we work with arrive before they have to. They treat their spine the way an athlete treats their body: proactively, not reactively.',
    ],
  },
}

export const RESULTS_WHAT_WE_IDENTIFY_BULLETS = [
  'Exactly where your spine is taking the most load.',
  'Whether joints, discs, or muscle patterns are driving it.',
  'How far the pattern has progressed.',
  'What will actually change your score, not just temporarily relieve it.',
] as const

export const RESULTS_NEXT_STEP: Record<StressTier, string> = {
  high:
    'The 2-Visit Spine Reset was built for exactly this presentation. A thorough exam, targeted adjustment, and a clear picture of what is driving your score. You will leave knowing what is actually happening in your spine.',
  moderate:
    'The 2-Visit Spine Reset gives us a clinical baseline on your spine before the pattern advances. Most patients in this tier leave their first visit with a clear picture of what is building and a specific plan to reverse it.',
  low:
    'The 2-Visit Spine Reset gives you an objective clinical baseline. Your actual spinal status, not just your habits. If everything looks clean, you will know. If there is something worth addressing early, you have caught it at the right time.',
}

/** Tier-specific subline beneath the Results CTA (PDF v3). */
export const RESULTS_CTA_SUBLINE: Record<StressTier, string> = {
  high: 'Built to identify and correct the exact stress pattern driving your score.',
  moderate:
    'Designed to catch and reverse this pattern before it becomes harder to fix.',
  low: 'Gives you a true baseline so small imbalances do not quietly build.',
}

export const TIER_COPY: Record<
  StressTier,
  { title: string; badgeClass: string; ringClass: string }
> = {
  high: {
    title: 'High Spinal Stress',
    badgeClass:
      'bg-amber-50 text-[var(--color-tier-high)] ring-1 ring-amber-200',
    ringClass: 'ring-amber-300/80',
  },
  moderate: {
    title: 'Moderate Stress',
    badgeClass:
      'bg-yellow-50 text-[var(--color-tier-mod)] ring-1 ring-yellow-200',
    ringClass: 'ring-yellow-300/80',
  },
  low: {
    title: 'Low Stress',
    badgeClass:
      'bg-emerald-50 text-[var(--color-tier-low)] ring-1 ring-emerald-200',
    ringClass: 'ring-emerald-300/80',
  },
}

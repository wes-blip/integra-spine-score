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

export const RESULTS_CLOSING = 'Based on your score, this is your next best step.'

export const RESULTS_BODY: Record<
  StressTier,
  { paragraph1: string; paragraph2: string; paragraph3: string }
> = {
  high: {
    paragraph1:
      'Your responses are consistent with a high level of spinal stress, particularly through the neck and upper back.',
    paragraph2:
      'This pattern is typically driven by forward head posture and sustained compression from long hours at a screen, causing the neck, shoulders, and mid-back to round forward and work against each other.',
    paragraph3:
      "Most people at this stage are already dealing with recurring tension, stiffness, or headaches. It's no longer occasional. It's becoming your normal. The encouraging part: this is exactly what we assess and correct every day, and most people feel noticeable relief fairly quickly once the right structure is in place.",
  },
  moderate: {
    paragraph1:
      "This is where most people land, and it's the most important stage to catch it.",
    paragraph2:
      "You're likely noticing some tension in the neck, shoulders, or low back that comes and goes. It settles when things ease up, then returns when life gets busy again. Without changing the pattern, this usually becomes more consistent and harder to ignore over time.",
    paragraph3:
      "This group tends to be busy, driven, and used to pushing through. That's exactly why this is also where we see the fastest improvements. When we address it early, restoring proper movement is straightforward, and most people notice a difference in both how they feel and how they perform.",
  },
  low: {
    paragraph1:
      "You're doing a lot of things right. Your habits are keeping spinal stress relatively low, and that reflects someone who's already paying attention to their health.",
    paragraph2:
      "You're actually the type of person we love working with. Proactive. Values performance. Thinks like an athlete.",
    paragraph3:
      "The goal at this stage isn't to wait for symptoms. It's to stay ahead of them and keep your body functioning at a high level before small imbalances quietly build into something harder to correct.",
  },
}

export const TIER_COPY: Record<
  StressTier,
  { title: string; badgeClass: string; ringClass: string }
> = {
  high: {
    title: 'High Stress',
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

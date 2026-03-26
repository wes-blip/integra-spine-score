export type QuizOption = {
  label: string
  /** Higher = worse habits / more spinal stress load */
  points: number
}

export type QuizQuestion = {
  id: string
  topic: string
  headline: string
  options: QuizOption[]
}

/** Worst habits use highest points per question (max 17 each → 102 total). */
export const QUESTIONS: QuizQuestion[] = [
  {
    id: 'sitting',
    topic: 'Sitting hours per day',
    headline: 'On a typical workday, about how many hours do you spend sitting?',
    options: [
      { label: 'Under 2 hours', points: 0 },
      { label: '2–4 hours', points: 5 },
      { label: '5–8 hours', points: 10 },
      { label: 'More than 8 hours', points: 17 },
    ],
  },
  {
    id: 'symptoms',
    topic: 'Current symptoms',
    headline:
      'During or after work, which best describes neck, mid-back, low back, or headaches?',
    options: [
      {
        label: 'None — I rarely notice these',
        points: 0,
      },
      {
        label: 'Neck tension and/or headaches tied to posture or screen time',
        points: 5,
      },
      {
        label: 'Mid-back or between the shoulder blades',
        points: 10,
      },
      {
        label: 'Low back — or several areas (neck, mid-back, low back, headaches)',
        points: 17,
      },
    ],
  },
  {
    id: 'screen',
    topic: 'Screen position',
    headline: 'Where is your main screen relative to your eyes?',
    options: [
      { label: 'Top of screen at or slightly below eye level', points: 0 },
      { label: 'Slightly low — I look down a bit', points: 5 },
      { label: 'Clearly below eye level', points: 10 },
      { label: 'It changes / I am unsure', points: 17 },
    ],
  },
  {
    id: 'slouch',
    topic: 'Slouching frequency',
    headline: 'How often do you notice yourself slouching or rounding your shoulders?',
    options: [
      { label: 'Rarely', points: 0 },
      { label: 'Sometimes', points: 5 },
      { label: 'Often', points: 10 },
      { label: 'Almost all the time', points: 17 },
    ],
  },
  {
    id: 'breaks',
    topic: 'Movement breaks',
    headline: 'How often do you stand, stretch, or walk during the workday?',
    options: [
      { label: 'At least every hour', points: 0 },
      { label: 'A few times per day', points: 5 },
      { label: 'Rarely', points: 10 },
      { label: 'Almost never', points: 17 },
    ],
  },
  {
    id: 'stiffness',
    topic: 'Morning stiffness',
    headline: 'How stiff or tight does your neck or back feel in the morning?',
    options: [
      { label: 'Little or none', points: 0 },
      { label: 'Mild', points: 5 },
      { label: 'Moderate', points: 10 },
      { label: 'Strong or most mornings', points: 17 },
    ],
  },
]

export const MAX_SCORE = QUESTIONS.length * 17

export type StressTier = 'high' | 'moderate' | 'low'

export function getTier(score: number): StressTier {
  if (score >= 70) return 'high'
  if (score >= 40) return 'moderate'
  return 'low'
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
    badgeClass: 'bg-emerald-50 text-[var(--color-tier-low)] ring-1 ring-emerald-200',
    ringClass: 'ring-emerald-300/80',
  },
}

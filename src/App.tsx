import { useMemo, useState, type FormEvent, type SVGProps } from 'react'
import {
  QUESTIONS,
  TIER_COPY,
  getTier,
  type StressTier,
} from './data/quiz'

type Phase = 'landing' | 'quiz' | 'lead' | 'results'

const BOOK_URL = 'https://book.integraoc.com'

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

const PLACEHOLDER_INSIGHT: Record<StressTier, string> = {
  high:
    'Your answers suggest your workday habits may be placing sustained load on your neck and upper back. This pattern is common for people who sit long hours with limited movement. A focused evaluation can help pinpoint what to change first.',
  moderate:
    'Your score shows a mix of supportive and stressful habits. You may already feel intermittent tension or fatigue. Small adjustments to posture, breaks, and screen setup often make a noticeable difference within a few weeks.',
  low:
    'Your routines appear relatively spine-friendly compared with typical desk-based work. Staying consistent with movement and ergonomics will help you keep this advantage as workloads change.',
}

const PLACEHOLDER_RECOMMENDATIONS: Record<StressTier, [string, string, string]> = {
  high: [
    'Schedule a brief posture and desk setup review with a professional.',
    'Set a timer to stand or walk for 2–3 minutes every hour.',
    'Raise your monitor so the top third is near eye level.',
  ],
  moderate: [
    'Add one structured stretch break mid-morning and mid-afternoon.',
    'Check chair height so hips and knees are near 90° when seated.',
    'Notice slouching early and reset shoulders gently without forcing.',
  ],
  low: [
    'Keep varying posture — even “good” sitting benefits from change.',
    'Maintain regular movement you already enjoy (walks, gym, yoga).',
    'Re-check ergonomics if you change monitors, chairs, or work location.',
  ],
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('landing')
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>(() =>
    Array(QUESTIONS.length).fill(-1),
  )
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [score, setScore] = useState(0)

  const current = QUESTIONS[stepIndex]
  const progress = (stepIndex + 1) / QUESTIONS.length

  const tier = useMemo(() => getTier(score), [score])
  const tierStyle = TIER_COPY[tier]

  function selectOption(points: number) {
    setAnswers((prev) => {
      const next = [...prev]
      next[stepIndex] = points
      return next
    })
  }

  function goNext() {
    if (answers[stepIndex] < 0) return
    if (stepIndex < QUESTIONS.length - 1) {
      setStepIndex((i) => i + 1)
    } else {
      setPhase('lead')
    }
  }

  function goBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1)
    else setPhase('landing')
  }

  function submitLead(e: FormEvent) {
    e.preventDefault()
    const nameOk = firstName.trim().length >= 1
    const emailOk = isValidEmail(email)
    if (!nameOk || !emailOk) {
      setFormError('Please enter your first name and a valid email address.')
      return
    }
    setFormError(null)
    // Proposal: feed leads into GoHighLevel — add webhook/API when credentials exist.
    const total = answers.reduce((a, b) => a + b, 0)
    setScore(total)
    setPhase('results')
  }

  function restart() {
    setPhase('landing')
    setStepIndex(0)
    setAnswers(Array(QUESTIONS.length).fill(-1))
    setFirstName('')
    setEmail('')
    setFormError(null)
    setScore(0)
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-card)]/90 backdrop-blur-sm">
        <div
          className={`mx-auto flex max-w-3xl items-center gap-4 px-4 py-5 sm:px-6 ${
            phase === 'landing' || phase === 'results'
              ? 'justify-center'
              : 'justify-between'
          }`}
        >
          {phase === 'landing' || phase === 'results' ? (
            <img
              src="/integra-logo.png"
              alt="Integra Health"
              className="h-14 w-auto max-w-[min(100%,220px)] object-contain object-center"
              width={220}
              height={56}
            />
          ) : (
            <>
              <div className="flex items-center gap-3">
                <img
                  src="/integra-logo.png"
                  alt=""
                  className="h-10 w-auto max-w-[140px] object-contain object-left"
                  width={140}
                  height={40}
                />
                <div className="text-left">
                  <p className="font-display text-sm font-semibold tracking-tight text-[var(--color-ink)]">
                    Workday Spine Score™
                  </p>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                    Integra Health
                  </p>
                </div>
              </div>
              {phase === 'quiz' && (
                <p className="hidden text-xs font-medium text-[var(--color-ink-muted)] sm:block">
                  Confidential · ~2 min
                </p>
              )}
            </>
          )}
        </div>
      </header>

      <main className="flex flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto w-full max-w-xl flex-1">
          {phase === 'landing' && (
            <section aria-labelledby="landing-title">
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                Desk & neck health
              </p>
              <h1
                id="landing-title"
                className="font-display mt-3 text-center text-3xl font-bold leading-tight tracking-tight text-[var(--color-ink)] sm:text-4xl"
              >
                See how your workday may be affecting your spine
              </h1>
              <p className="mt-4 text-center text-[var(--color-ink-muted)] leading-relaxed">
                Six quick questions for desk workers — sitting, posture, symptoms,
                and habits. You will see a stress score and next steps, and you can
                book a{' '}
                <span className="font-medium text-[var(--color-ink)]">
                  $99 Spine Reset
                </span>{' '}
                at Integra Health when you are ready.
              </p>
              <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm ring-1 ring-black/5">
                <ul className="space-y-3 text-left text-sm text-[var(--color-ink)]">
                  <li className="flex gap-2">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-cta)]" />
                    <span>Step-by-step quiz with clear progress</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-cta)]" />
                    <span>Personalized score and tier</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-cta)]" />
                    <span>Optional booking with Integra Health</span>
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={() => setPhase('quiz')}
                  className="mt-6 flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[var(--color-primary)] text-base font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                >
                  Start the assessment
                </button>
              </div>
              <p className="mt-6 text-center text-xs text-[var(--color-ink-muted)]">
                For education only — not a medical diagnosis.
              </p>
            </section>
          )}

          {phase === 'quiz' && current && (
            <section aria-labelledby="quiz-title">
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between gap-2 text-xs font-medium text-[var(--color-ink-muted)]">
                  <span>
                    Question {stepIndex + 1} of {QUESTIONS.length}
                  </span>
                  <span className="tabular-nums">
                    {Math.round(progress * 100)}%
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-[var(--color-progress-track)]"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress * 100)}
                  aria-label="Quiz progress"
                >
                  <div
                    className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-300 ease-out"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-[var(--color-primary)]">
                  {current.topic}
                </p>
                <h2
                  id="quiz-title"
                  className="font-display mt-1 text-xl font-semibold leading-snug text-[var(--color-ink)] sm:text-2xl"
                >
                  {current.headline}
                </h2>
              </div>

              <div
                className="space-y-2"
                role="radiogroup"
                aria-labelledby="quiz-title"
              >
                {current.options.map((opt) => {
                  const selected = answers[stepIndex] === opt.points
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => selectOption(opt.points)}
                      className={`flex w-full cursor-pointer rounded-xl border px-4 py-3.5 text-left text-sm leading-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:text-base ${
                        selected
                          ? 'border-[var(--color-primary)] bg-[var(--color-option-selected)] ring-2 ring-[var(--color-primary)]/25'
                          : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-option-hover)]'
                      }`}
                    >
                      <span
                        className={`mr-3 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          selected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                            : 'border-[var(--color-border-strong)] bg-white'
                        }`}
                        aria-hidden
                      >
                        {selected && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </span>
                      <span className="text-[var(--color-ink)]">{opt.label}</span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="h-11 cursor-pointer rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-option-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                >
                  {stepIndex === 0 ? 'Back to intro' : 'Previous'}
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={answers[stepIndex] < 0}
                  className="h-11 cursor-pointer rounded-xl bg-[var(--color-primary)] px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {stepIndex === QUESTIONS.length - 1 ? 'Continue' : 'Next'}
                </button>
              </div>
            </section>
          )}

          {phase === 'lead' && (
            <section aria-labelledby="lead-title">
              <h2
                id="lead-title"
                className="font-display text-2xl font-bold text-[var(--color-ink)]"
              >
                Almost there
              </h2>
              <p className="mt-2 text-[var(--color-ink-muted)] leading-relaxed">
                Enter your details to see your Workday Spine Score™ and tailored
                takeaways. We may follow up by email about your score and next
                steps.
              </p>
              <form
                onSubmit={submitLead}
                className="mt-8 space-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm ring-1 ring-black/5"
                noValidate
              >
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-[var(--color-ink)]"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1.5 h-12 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 text-[var(--color-ink)] shadow-inner outline-none transition-[box-shadow] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    aria-invalid={formError ? true : undefined}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--color-ink)]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 h-12 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 text-[var(--color-ink)] shadow-inner outline-none transition-[box-shadow] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                    aria-invalid={formError ? true : undefined}
                  />
                </div>
                {formError && (
                  <p role="alert" className="text-sm font-medium text-red-700">
                    {formError}
                  </p>
                )}
                <button
                  type="submit"
                  className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[var(--color-primary)] text-base font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                >
                  See My Score
                </button>
              </form>
            </section>
          )}

          {phase === 'results' && (
            <section aria-live="polite" aria-labelledby="results-title">
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                Your results
              </p>
              <h2
                id="results-title"
                className="font-display mt-2 text-center text-2xl font-bold text-[var(--color-ink)] sm:text-3xl"
              >
                Hi{firstName.trim() ? `, ${firstName.trim()}` : ''}
              </h2>
              <p className="mt-1 text-center text-sm text-[var(--color-ink-muted)]">
                Here is your Workday Spine Score™
              </p>

              <div className="mt-8 flex flex-col items-center">
                <div
                  className={`relative flex h-40 w-40 flex-col items-center justify-center rounded-full bg-white shadow-md ring-4 ${tierStyle.ringClass}`}
                >
                  <span className="font-display text-4xl font-bold tabular-nums text-[var(--color-ink)]">
                    {score}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                    points
                  </span>
                </div>
                <span
                  className={`mt-4 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold ${tierStyle.badgeClass}`}
                >
                  {tierStyle.title}
                </span>
              </div>

              <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-left shadow-sm ring-1 ring-black/5">
                <h3 className="font-display text-lg font-semibold text-[var(--color-ink)]">
                  What this may mean
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  {PLACEHOLDER_INSIGHT[tier]}
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-left shadow-sm ring-1 ring-black/5">
                <h3 className="font-display text-lg font-semibold text-[var(--color-ink)]">
                  Three simple recommendations
                </h3>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  {PLACEHOLDER_RECOMMENDATIONS[tier].map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ol>
              </div>

              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex h-14 w-full cursor-pointer items-center justify-center rounded-xl bg-[var(--color-cta)] text-base font-bold text-white shadow-md transition-colors hover:bg-[var(--color-cta-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta)]"
              >
                Book Your Spine Reset
              </a>

              <button
                type="button"
                onClick={restart}
                className="mt-4 w-full cursor-pointer py-3 text-sm font-medium text-[var(--color-primary)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              >
                Start over
              </button>
            </section>
          )}
        </div>
      </main>

      <footer className="border-t border-[var(--color-border)] bg-[var(--color-card)]/80 py-6 text-center text-xs text-[var(--color-ink-muted)]">
        <p className="font-medium text-[var(--color-ink)]">
          Integra Health — Santa Ana &amp; Tustin, Orange County
        </p>
        <p className="mt-2">
          <a
            href={BOOK_URL}
            className="text-[var(--color-primary)] underline-offset-2 hover:underline"
          >
            book.integraoc.com
          </a>
          <span aria-hidden> · </span>
          <a
            href="tel:+17148523003"
            className="text-[var(--color-primary)] underline-offset-2 hover:underline"
          >
            714-852-3003
          </a>
        </p>
        <p className="mt-3">
          © {new Date().getFullYear()} Integra Health. All rights reserved.
        </p>
        <p className="mt-2 max-w-md mx-auto px-4">
          Prototype for learning and marketing. Not a medical diagnosis — Dr.
          Brock will replace placeholder result copy with clinical voice after
          review.
        </p>
      </footer>
    </div>
  )
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 010 1.42l-7.005 7.005a1 1 0 01-1.42 0L3.296 9.32a1 1 0 111.42-1.42l3.005 3.005 6.295-6.295a1 1 0 011.42 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

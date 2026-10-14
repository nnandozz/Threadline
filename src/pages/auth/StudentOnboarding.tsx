import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SelectableOption } from '@/components/auth/SelectableOption'
import { OnboardingProgress } from '@/components/auth/OnboardingProgress'
import { saveOnboardingAnswers, clearPendingSignup } from '@/lib/onboardingStore'
import {
  ONBOARDING_SUBJECTS,
  ONBOARDING_LEVELS,
  ONBOARDING_GOALS,
  ONBOARDING_FREQUENCIES,
  type StudentOnboardingAnswers,
} from '@/types/onboarding'

const TOTAL_STEPS = 4

const SUBJECT_DESCRIPTIONS: Record<string, string> = {
  English: 'Conversation, grammar, and fluency',
  Mathematics: 'From arithmetic to calculus',
  Programming: 'Learn to code, one lesson at a time',
  Science: 'Biology, chemistry, physics, and more',
  Other: "Something else — we'll match you with the right tutor",
}

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  Beginner: 'Just getting started',
  Elementary: 'Know the basics',
  Intermediate: 'Comfortable, want to go further',
  Advanced: 'Refining fluency and precision',
}

const FREQUENCY_DESCRIPTIONS: Record<string, string> = {
  '2–3 times a week': 'A steady, sustainable pace',
  '4–5 times a week': 'Faster progress, more practice',
  'Every day': 'Immersive, daily habit',
}

interface StudentOnboardingProps {
  name: string
}

export function StudentOnboarding({ name }: StudentOnboardingProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<StudentOnboardingAnswers>({
    subject: null,
    level: null,
    goals: [],
    frequency: null,
  })

  const firstName = name.trim().split(/\s+/)[0] || 'there'

  function toggleGoal(goal: StudentOnboardingAnswers['goals'][number]) {
    setAnswers((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal) ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal],
    }))
  }

  function canContinue(): boolean {
    if (step === 1) return answers.subject !== null
    if (step === 2) return answers.level !== null
    if (step === 3) return answers.goals.length > 0
    if (step === 4) return answers.frequency !== null
    return true
  }

  function handleContinue() {
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    } else {
      saveOnboardingAnswers('student', answers)
      setStep(TOTAL_STEPS + 1) // completion screen
    }
  }

  function handleBack() {
    if (step > 1) setStep(step - 1)
  }

  // ───────────────────────── Completion screen ─────────────────────────
  if (step > TOTAL_STEPS) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-light text-success">
          <PartyPopper size={26} />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-h2">You're all set, {firstName}!</h1>
          <p className="text-body text-ink-secondary">
            We'll match you with a tutor and get your first lesson ready.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            clearPendingSignup()
            navigate('/dashboard')
          }}
          className="mt-2 w-full"
        >
          Go to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <OnboardingProgress current={step} total={TOTAL_STEPS} />

      {step === 1 && (
        <StepBlock title="What are you learning?">
          <div className="flex flex-col gap-2">
            {ONBOARDING_SUBJECTS.map((subject) => (
              <SelectableOption
                key={subject}
                label={subject}
                description={SUBJECT_DESCRIPTIONS[subject]}
                selected={answers.subject === subject}
                onClick={() => setAnswers((prev) => ({ ...prev, subject }))}
              />
            ))}
          </div>
        </StepBlock>
      )}

      {step === 2 && (
        <StepBlock title="What is your current level?">
          <div className="flex flex-col gap-2">
            {ONBOARDING_LEVELS.map((level) => (
              <SelectableOption
                key={level}
                label={level}
                description={LEVEL_DESCRIPTIONS[level]}
                selected={answers.level === level}
                onClick={() => setAnswers((prev) => ({ ...prev, level }))}
              />
            ))}
          </div>
        </StepBlock>
      )}

      {step === 3 && (
        <StepBlock title="What are your goals?" hint="Choose as many as apply.">
          <div className="flex flex-col gap-2">
            {ONBOARDING_GOALS.map((goal) => (
              <SelectableOption
                key={goal}
                label={goal}
                selected={answers.goals.includes(goal)}
                onClick={() => toggleGoal(goal)}
              />
            ))}
          </div>
        </StepBlock>
      )}

      {step === 4 && (
        <StepBlock title="How often do you want to learn?">
          <div className="flex flex-col gap-2">
            {ONBOARDING_FREQUENCIES.map((frequency) => (
              <SelectableOption
                key={frequency}
                label={frequency}
                description={FREQUENCY_DESCRIPTIONS[frequency]}
                selected={answers.frequency === frequency}
                onClick={() => setAnswers((prev) => ({ ...prev, frequency }))}
              />
            ))}
          </div>
        </StepBlock>
      )}

      <div className="flex items-center gap-3">
        {step > 1 && (
          <Button variant="secondary" size="lg" onClick={handleBack} className="flex-1">
            Back
          </Button>
        )}
        <Button size="lg" onClick={handleContinue} disabled={!canContinue()} className="flex-1">
          {step === TOTAL_STEPS ? 'Finish' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}

function StepBlock({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-h3">{title}</h2>
        {hint && <p className="text-small text-ink-secondary">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

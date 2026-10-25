import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { PartyPopper, Check, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Avatar } from '@/components/ui/Avatar'
import { SelectableOption } from '@/components/auth/SelectableOption'
import { OnboardingProgress } from '@/components/auth/OnboardingProgress'
import { saveOnboardingAnswers, clearPendingSignup } from '@/lib/onboardingStore'
import { useAuth } from '@/context/AuthContext'
import { publishTutorProfile } from '@/lib/tutorProfile'
import { cn } from '@/lib/utils'
import {
  TUTOR_SUBJECTS,
  TUTOR_EXPERIENCE_LEVELS,
  TUTOR_AVAILABILITY_OPTIONS,
  type TutorOnboardingAnswers,
} from '@/types/onboarding'

const TOTAL_STEPS = 4

// Preset options only — real photo upload needs a backend, which doesn't
// exist yet. Same source (pravatar.cc) as the rest of the app's mock data,
// so this doesn't introduce a new visual style.
const AVATAR_PRESETS = [
  'https://i.pravatar.cc/200?img=11',
  'https://i.pravatar.cc/200?img=32',
  'https://i.pravatar.cc/200?img=5',
  'https://i.pravatar.cc/200?img=48',
  'https://i.pravatar.cc/200?img=15',
  'https://i.pravatar.cc/200?img=41',
]

interface TutorOnboardingProps {
  name: string
}

export function TutorOnboarding({ name }: TutorOnboardingProps) {
  const navigate = useNavigate()
  const { user, completeTutorOnboarding } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<TutorOnboardingAnswers>({
    subjects: [],
    experience: null,
    education: '',
    teachingStyle: '',
    bio: '',
    avatarUrl: null,
    availability: [],
    pricePerHour: 600,
    formats: ['online'],
    city: 'Delhi NCR',
    area: '',
  })

  const firstName = name.trim().split(/\s+/)[0] || 'there'

  function toggleSubject(subject: string) {
    setAnswers((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }))
  }

  function toggleAvailability(slot: TutorOnboardingAnswers['availability'][number]) {
    setAnswers((prev) => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter((a) => a !== slot)
        : [...prev.availability, slot],
    }))
  }

  function canContinue(): boolean {
    if (step === 1)
      return answers.subjects.length > 0 && answers.experience !== null && answers.formats.length > 0 && answers.pricePerHour > 0
    if (step === 2)
      return answers.education.trim().length > 0 && answers.teachingStyle.trim().length > 0 && answers.city.trim().length > 0
    if (step === 3) return answers.bio.trim().length > 0 && answers.avatarUrl !== null
    if (step === 4) return answers.availability.length > 0
    return true
  }

  async function handleContinue() {
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)
    try {
      saveOnboardingAnswers('tutor', answers)
      const headline = `${answers.subjects.join(' & ')} tutor`

      const res = await completeTutorOnboarding(
        answers.subjects,
        headline,
        answers.bio,
        answers.avatarUrl,
        answers.pricePerHour,
      )

      if (!res.success) {
        setSubmitError(res.error || 'Failed to complete tutor onboarding. Please try again.')
        return
      }

      if (user) {
        publishTutorProfile(
          {
            ...user,
            headline,
            bio: answers.bio,
            avatarUrl: answers.avatarUrl || user.avatarUrl,
            pricePerHour: answers.pricePerHour,
            targetSubjects: answers.subjects,
            onboardingCompleted: true,
          },
          answers,
        )
      }

      setStep(TOTAL_STEPS + 1)
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
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
            Your public profile is listed with the details you provided. Students can find you once they search the marketplace.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            clearPendingSignup()
            navigate('/tutor/dashboard')
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
        <StepBlock title="What do you teach?" hint="Select every subject that applies.">
          <div className="flex flex-wrap gap-2">
            {TUTOR_SUBJECTS.map((subject) => (
              <SelectableOption
                key={subject}
                label={subject}
                selected={answers.subjects.includes(subject)}
                onClick={() => toggleSubject(subject)}
                variant="chip"
              />
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <p className="text-small font-medium text-ink">Years of experience</p>
            <div className="flex flex-col gap-2">
              {TUTOR_EXPERIENCE_LEVELS.map((level) => (
                <SelectableOption
                  key={level}
                  label={level}
                  selected={answers.experience === level}
                  onClick={() => setAnswers((prev) => ({ ...prev, experience: level }))}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-2">
            <label className="text-small font-medium text-ink">Base hourly tuition rate (₹)</label>
            <Input
              type="number"
              min="200"
              max="3000"
              step="50"
              value={answers.pricePerHour}
              onChange={(e) => setAnswers((prev) => ({ ...prev, pricePerHour: Number(e.target.value) }))}
            />
          </div>
        </StepBlock>
      )}

      {step === 2 && (
        <StepBlock title="Tell us about your background & location">
          <Input
            label="Education"
            placeholder="e.g. B.Tech in Computer Science, IIT Delhi or M.A. English, Delhi University"
            value={answers.education}
            onChange={(e) => setAnswers((prev) => ({ ...prev, education: e.target.value }))}
          />
          <Input
            label="Teaching style"
            placeholder="e.g. Structured but relaxed, focused on conceptual clarity and real conversation"
            value={answers.teachingStyle}
            onChange={(e) => setAnswers((prev) => ({ ...prev, teachingStyle: e.target.value }))}
          />
          <div className="flex flex-col gap-1">
            <label className="text-small font-medium text-ink">Primary City / Region</label>
            <select
              value={answers.city}
              onChange={(e) => setAnswers((prev) => ({ ...prev, city: e.target.value }))}
              aria-label="Primary city or region"
              className="h-10 rounded-lg border border-border bg-white px-3 text-small text-ink focus:border-primary focus:outline-none"
            >
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Gurugram">Gurugram</option>
            </select>
          </div>
          <Input
            label="Area / Neighborhood (Optional for in-person discovery)"
            placeholder="e.g. South Delhi, Koramangala, Bandra West"
            value={answers.area}
            onChange={(e) => setAnswers((prev) => ({ ...prev, area: e.target.value }))}
          />
        </StepBlock>
      )}

      {step === 3 && (
        <StepBlock title="Write a short bio">
          <Textarea
            label="Bio"
            placeholder="Tell students what makes your lessons worth booking."
            rows={4}
            value={answers.bio}
            onChange={(e) => setAnswers((prev) => ({ ...prev, bio: e.target.value }))}
          />

          <div className="flex flex-col gap-2">
            <p className="text-small font-medium text-ink">Profile photo</p>
            <div className="flex flex-wrap gap-3">
              {AVATAR_PRESETS.map((url) => {
                const selected = answers.avatarUrl === url
                return (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, avatarUrl: url }))}
                    aria-pressed={selected}
                    aria-label="Choose this profile photo"
                    className={cn(
                      'relative rounded-full transition-all duration-150',
                      selected ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80',
                    )}
                  >
                    <Avatar src={url} name={name || 'Tutor'} size="lg" />
                    {selected && (
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-primary text-white">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </StepBlock>
      )}

      {step === 4 && (
        <StepBlock title="When are you available?" hint="Select every time block that generally works.">
          <div className="flex flex-col gap-2">
            {TUTOR_AVAILABILITY_OPTIONS.map((slot) => (
              <SelectableOption
                key={slot}
                label={slot}
                selected={answers.availability.includes(slot)}
                onClick={() => toggleAvailability(slot)}
              />
            ))}
          </div>
        </StepBlock>
      )}

      {submitError && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
          <p className="flex-1">{submitError}</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        {step > 1 && (
          <Button variant="secondary" size="lg" onClick={handleBack} disabled={isSubmitting} className="flex-1">
            Back
          </Button>
        )}
        <Button size="lg" onClick={handleContinue} disabled={!canContinue() || isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving Profile…
            </>
          ) : step === TOTAL_STEPS ? (
            'Finish'
          ) : (
            'Continue'
          )}
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

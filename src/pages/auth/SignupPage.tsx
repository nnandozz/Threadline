import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SelectableOption } from '@/components/auth/SelectableOption'
import { isValidEmail } from '@/lib/validation'
import { savePendingSignup } from '@/lib/onboardingStore'
import type { UserRole } from '@/types'

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

// The brief describes two distinct flows (a light student signup followed
// by a separate onboarding survey, vs. a tutor signup that leads into a
// profile-building onboarding) but doesn't specify how the person picks
// which one they're on — so this page adds a simple role toggle up front.
// Account fields are identical either way; only the onboarding that follows
// differs, decided by the selected role.
export function SignupPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState<UserRole>('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): boolean {
    const next: FormErrors = {}
    if (!name.trim()) next.name = 'Enter your name.'
    if (!email.trim()) next.email = 'Enter your email address.'
    else if (!isValidEmail(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Create a password.'
    else if (password.length < 8) next.password = 'Use at least 8 characters.'
    if (confirmPassword !== password) next.confirmPassword = "Passwords don't match."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    const pendingSignup = { role, name: name.trim(), email: email.trim() }
    savePendingSignup(pendingSignup)

    // Simulated network delay — no real auth backend yet.
    window.setTimeout(() => {
      navigate('/onboarding', { state: pendingSignup })
    }, 600)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-h2">Create your account</h1>
        <p className="text-body text-ink-secondary">Start a learning journey that remembers.</p>
      </div>

      <div className="flex gap-2" role="group" aria-label="I'm signing up as">
        <SelectableOption
          label="I'm a student"
          selected={role === 'student'}
          onClick={() => setRole('student')}
          variant="chip"
          className="flex-1 text-center"
        />
        <SelectableOption
          label="I'm a tutor"
          selected={role === 'tutor'}
          onClick={() => setRole('tutor')}
          variant="chip"
          className="flex-1 text-center"
        />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          disabled={isSubmitting}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={isSubmitting}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          hint={!errors.password ? 'At least 8 characters.' : undefined}
          disabled={isSubmitting}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          disabled={isSubmitting}
        />

        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating account…
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <p className="text-center text-small text-ink-secondary">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
          Log in
        </Link>
      </p>
    </div>
  )
}

import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SelectableOption } from '@/components/auth/SelectableOption'
import { isValidEmail } from '@/lib/validation'
import { savePendingSignup } from '@/lib/onboardingStore'
import { useAuth } from '@/context/AuthContext'
import { AuthPreviewNotice } from '@/components/auth/AuthPreviewNotice'
import type { UserRole } from '@/types'

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export function SignupPage() {
  const navigate = useNavigate()
  const { register, user, isAuthenticated, isLoading } = useAuth()
  const [role, setRole] = useState<UserRole>('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (!user.onboardingCompleted) {
        navigate('/onboarding', { replace: true })
      } else if (user.role === 'tutor') {
        navigate('/tutor/dashboard', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [isLoading, isAuthenticated, user, navigate])

  function validate(): boolean {
    const next: FormErrors = {}
    if (!name.trim()) next.name = 'Enter your full name.'
    if (!email.trim()) next.email = 'Enter your email address.'
    else if (!isValidEmail(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Create a password.'
    else if (password.length < 8) next.password = 'Use at least 8 characters.'
    if (confirmPassword !== password) next.confirmPassword = "Passwords don't match."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setFormError(null)
    setIsSubmitting(true)
    try {
      const result = await register(name.trim(), email.trim(), password, role)
      if (result.error || !result.user) {
        setFormError(result.error || 'Could not create this account.')
        return
      }

      const pendingSignup = { role: result.user.role, name: result.user.name, email: result.user.email }
      savePendingSignup(pendingSignup)

      // If Supabase project has email confirmation enabled and session is not yet active,
      // inform the user to check their email. Otherwise proceed directly to onboarding.
      if (!isAuthenticated && !user) {
        // Check if session was returned or if email verification is needed
        setEmailConfirmationRequired(true)
      } else {
        navigate('/onboarding', { state: pendingSignup })
      }
    } catch {
      setFormError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (emailConfirmationRequired) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Check your email</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            We sent a verification link to <span className="font-semibold text-slate-900">{email}</span>. Click the link in that email to confirm your account, then log in to continue your {role} onboarding.
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Link
            to={`/login`}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            Go to Log In
          </Link>
          <button
            type="button"
            onClick={() => setEmailConfirmationRequired(false)}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Back to registration
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
        <p className="text-sm text-slate-500">Join Threadline to start learning or teaching.</p>
      </div>

      <AuthPreviewNotice />

      {formError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{formError}</p>
      )}

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
          id="signup-name"
          label="Full name"
          type="text"
          autoComplete="name"
          value={name}
          placeholder="e.g. Ananya Sharma"
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          disabled={isSubmitting}
        />
        <Input
          id="signup-email"
          label="Email address"
          type="email"
          autoComplete="email"
          value={email}
          placeholder="name@example.com"
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={isSubmitting}
        />
        <Input
          id="signup-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          placeholder="At least 8 characters"
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          hint={!errors.password ? 'At least 8 characters.' : undefined}
          disabled={isSubmitting}
        />
        <Input
          id="signup-confirm-password"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          placeholder="Repeat password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          disabled={isSubmitting}
        />

        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating account…
            </>
          ) : (
            'Continue to Onboarding'
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}

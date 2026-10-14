import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { isValidEmail } from '@/lib/validation'

interface FormErrors {
  email?: string
  password?: string
}

// Mocked: there's no backend yet, so "logging in" just validates the form,
// simulates a brief network delay, and routes to the student dashboard.
// (Login doesn't ask for a role, so we default to the student destination —
// the primary persona this app is built around so far.)
export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): boolean {
    const next: FormErrors = {}
    if (!email.trim()) next.email = 'Enter your email address.'
    else if (!isValidEmail(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Enter your password.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    // Simulated network delay — no real auth backend yet.
    window.setTimeout(() => {
      navigate('/dashboard')
    }, 600)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-h2">Welcome back</h1>
        <p className="text-body text-ink-secondary">Log in to continue your lessons.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={isSubmitting}
        />
        <div className="flex flex-col gap-1.5">
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            disabled={isSubmitting}
          />
          <Link to="/forgot-password" className="self-end text-small font-medium text-primary hover:text-primary-hover">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Logging in…
            </>
          ) : (
            'Log in'
          )}
        </Button>
      </form>

      <p className="text-center text-small text-ink-secondary">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-primary hover:text-primary-hover">
          Sign up
        </Link>
      </p>
    </div>
  )
}

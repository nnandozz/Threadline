import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { isValidEmail } from '@/lib/validation'
import { useAuth } from '@/context/AuthContext'
import { AuthPreviewNotice } from '@/components/auth/AuthPreviewNotice'

interface FormErrors {
  email?: string
  password?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, user, isAuthenticated, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectUrl = searchParams.get('redirect')

  // Check for password recovery link arriving at /login
  useEffect(() => {
    if (window.location.hash.includes('type=recovery') || searchParams.get('type') === 'recovery') {
      navigate('/reset-password' + window.location.hash, { replace: true })
      return
    }
  }, [navigate, searchParams])

  // If already authenticated, redirect to appropriate destination
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (redirectUrl && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//') && !redirectUrl.startsWith('/login') && !redirectUrl.startsWith('/signup')) {
        navigate(redirectUrl, { replace: true })
      } else if (!user.onboardingCompleted) {
        navigate('/onboarding', { replace: true })
      } else if (user.role === 'tutor') {
        navigate('/tutor/dashboard', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [isLoading, isAuthenticated, user, redirectUrl, navigate])

  function validate(): boolean {
    const next: FormErrors = {}
    if (!email.trim()) next.email = 'Enter your email address.'
    else if (!isValidEmail(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Enter your password.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setAuthError(null)
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const res = await login(email.trim(), password)
      if (!res.success) {
        setAuthError(res.error || 'Could not sign in with these credentials.')
        setIsSubmitting(false)
        return
      }

      const loggedInUser = res.user
      if (
        redirectUrl &&
        redirectUrl.startsWith('/') &&
        !redirectUrl.startsWith('//') &&
        !redirectUrl.startsWith('/login') &&
        !redirectUrl.startsWith('/signup')
      ) {
        navigate(redirectUrl)
      } else if (loggedInUser && !loggedInUser.onboardingCompleted) {
        navigate('/onboarding')
      } else if (loggedInUser?.role === 'tutor') {
        navigate('/tutor/dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch {
      setAuthError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">Log in to your Threadline account.</p>
      </div>

      <AuthPreviewNotice />

      {authError && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
          <div className="flex-1">
            <p>{authError}</p>
            <p className="mt-1 font-medium">
              New to Threadline?{' '}
              <Link to="/signup" className="font-bold underline hover:text-red-900">
                Create an account here
              </Link>
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          value={email}
          placeholder="name@example.com"
          onChange={(e) => {
            setEmail(e.target.value)
            setAuthError(null)
          }}
          error={errors.email}
          disabled={isSubmitting}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          placeholder="••••••••"
          onChange={(e) => {
            setPassword(e.target.value)
            setAuthError(null)
          }}
          error={errors.password}
          disabled={isSubmitting}
        />

        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing in…
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500">
        <Link to="/forgot-password" className="font-medium text-slate-600 hover:underline">
          Forgot password?
        </Link>
      </p>

      <p className="text-center text-xs text-slate-500">
        Don't have an account yet?{' '}
        <Link to="/signup" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}

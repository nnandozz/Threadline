import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button, buttonClasses } from '@/components/ui/Button'
import { isValidEmail } from '@/lib/validation'
import { useAuth } from '@/context/AuthContext'

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setFieldError(null)

    const trimmed = email.trim()
    if (!trimmed) {
      setFieldError('Enter your email address.')
      return
    }
    if (!isValidEmail(trimmed)) {
      setFieldError('Enter a valid email address.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await resetPassword(trimmed)
      if (!res.success) {
        setError(res.error || 'Failed to send password reset email.')
      } else {
        setIsSuccess(true)
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-5 text-center">
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Check your inbox</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            If an account exists for <span className="font-semibold text-slate-900">{email}</span>, we have sent instructions to reset your password.
          </p>
        </div>
        <Link to="/login" className={buttonClasses('primary', 'md', 'w-full mt-2')}>
          Back to log in
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset your password</h1>
        <p className="text-sm text-slate-500">
          Enter your registered email address and we'll send you a link to reset your password.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
          <p className="flex-1">{error}</p>
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
            setError(null)
            setFieldError(null)
          }}
          error={fieldError ?? undefined}
          disabled={isSubmitting}
        />

        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending reset link…
            </>
          ) : (
            'Send Password Reset Link'
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Remembered your password?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  )
}

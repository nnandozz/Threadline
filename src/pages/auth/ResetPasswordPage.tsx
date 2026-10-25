import { useState, useEffect, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button, buttonClasses } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { getSupabaseClient } from '@/lib/supabaseClient'

interface FormErrors {
  password?: string
  confirmPassword?: string
}

export function ResetPasswordPage() {
  const { updatePassword, isAuthenticated } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isRecoverySession, setIsRecoverySession] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkRecovery() {
      // In Supabase Auth, clicking a recovery link sets an active recovery session in the URL or client
      const hash = window.location.hash
      const isRecoveryHash = hash.includes('type=recovery') || hash.includes('access_token=')

      if (isRecoveryHash) {
        setIsRecoverySession(true)
        return
      }

      // Check if client has an active session from the recovery token
      try {
        const supabase = getSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()
        setIsRecoverySession(Boolean(session))
      } catch {
        setIsRecoverySession(false)
      }
    }

    checkRecovery()
  }, [])

  function validate(): boolean {
    const next: FormErrors = {}
    if (!password) next.password = 'Enter a new password.'
    else if (password.length < 8) next.password = 'Use at least 8 characters.'

    if (confirmPassword !== password) next.confirmPassword = "Passwords don't match."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setAuthError(null)
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const res = await updatePassword(password)
      if (!res.success) {
        setAuthError(res.error || 'Failed to update your password. The recovery link may have expired.')
        setIsSubmitting(false)
        return
      }

      setIsSuccess(true)
    } catch {
      setAuthError('An unexpected error occurred while resetting your password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Password updated!</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your Threadline account password has been successfully reset. You can now log in with your new credentials.
          </p>
        </div>
        <Link to="/login" className={buttonClasses('primary', 'md', 'w-full mt-2')}>
          Go to Log In
        </Link>
      </div>
    )
  }

  if (isRecoverySession === false && !isAuthenticated) {
    return (
      <div className="flex flex-col gap-5 text-center">
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <KeyRound size={24} />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Invalid or Expired Link</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            This password recovery link is either invalid or has expired. Please request a new link to reset your password.
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Link to="/forgot-password" className={buttonClasses('primary', 'md', 'w-full')}>
            Request New Reset Link
          </Link>
          <Link to="/login" className={buttonClasses('secondary', 'md', 'w-full')}>
            Back to Log In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Choose a new password</h1>
        <p className="text-sm text-slate-500">
          Create a secure password of at least 8 characters.
        </p>
      </div>

      {authError && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
          <div className="flex-1">
            <p>{authError}</p>
            <p className="mt-1 font-medium">
              Need a new link?{' '}
              <Link to="/forgot-password" className="font-bold underline hover:text-red-900">
                Request one here
              </Link>
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          value={password}
          placeholder="At least 8 characters"
          onChange={(e) => {
            setPassword(e.target.value)
            setAuthError(null)
          }}
          error={errors.password}
          disabled={isSubmitting}
        />
        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          placeholder="Repeat new password"
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            setAuthError(null)
          }}
          error={errors.confirmPassword}
          disabled={isSubmitting}
        />

        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Updating password…
            </>
          ) : (
            'Set New Password'
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500">
        <Link to="/login" className="font-medium text-slate-600 hover:underline">
          Cancel and return to log in
        </Link>
      </p>
    </div>
  )
}

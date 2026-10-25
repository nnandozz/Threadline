import { useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { Loader2, AlertTriangle } from 'lucide-react'
import { StudentOnboarding } from './StudentOnboarding'
import { TutorOnboarding } from './TutorOnboarding'
import { EmptyState } from '@/components/ui/EmptyState'
import { buttonClasses } from '@/components/ui/Button'
import { getPendingSignup, type PendingSignup } from '@/lib/onboardingStore'
import { useAuth } from '@/context/AuthContext'

export function OnboardingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading, schemaError } = useAuth()

  // For unauthenticated visitors only, router state or localStorage is checked
  const pendingSignup = !isAuthenticated ? ((location.state as PendingSignup | null) ?? getPendingSignup()) : null

  // If the user is authenticated and has already completed onboarding, route them to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.onboardingCompleted) {
      navigate(user.role === 'tutor' ? '/tutor/dashboard' : '/dashboard', { replace: true })
    }
  }, [isLoading, isAuthenticated, user, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
        <Loader2 size={24} className="animate-spin text-primary" />
        <span className="text-xs text-slate-500">Checking onboarding profile…</span>
      </div>
    )
  }

  // Handle missing database schema gracefully
  if (schemaError) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-amber-600" />
          <h2 className="text-sm font-bold">Database Schema Required</h2>
        </div>
        <p className="text-xs leading-relaxed">
          {schemaError}
        </p>
        <div className="rounded-lg bg-white/80 p-3 text-xs font-mono border border-amber-200">
          File: supabase/migrations/20261024000000_create_profiles.sql
        </div>
        <p className="text-xs text-amber-800">
          Apply the migration in your Supabase project dashboard under SQL Editor to activate profile persistence.
        </p>
        <Link to="/" className={buttonClasses('secondary', 'sm', 'self-start mt-2')}>
          Back to Home
        </Link>
      </div>
    )
  }

  // The authenticated profile is the absolute source of truth.
  // Stale localStorage data is never allowed to override an authenticated user.
  const activeRole = isAuthenticated && user ? user.role : pendingSignup?.role
  const activeName = isAuthenticated && user ? user.name : pendingSignup?.name

  if (!activeRole) {
    return (
      <EmptyState
        title="Let's get you signed up first"
        description="We couldn't find an account in progress — create one to start onboarding."
        action={
          <Link to="/signup" className={buttonClasses('primary', 'md')}>
            Go to sign up
          </Link>
        }
      />
    )
  }

  return activeRole === 'tutor' ? (
    <TutorOnboarding name={activeName || 'Tutor'} />
  ) : (
    <StudentOnboarding name={activeName || 'Student'} />
  )
}

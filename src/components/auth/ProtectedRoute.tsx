import { Navigate, useLocation, Link } from 'react-router-dom'
import { Loader2, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { buttonClasses } from '@/components/ui/Button'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  requiredRole?: UserRole
  children: React.ReactElement
}

export function ProtectedRoute({ requiredRole, children }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, schemaError } = useAuth()
  const location = useLocation()

  // Prevent protected pages from rendering or redirecting while Supabase session is resolving
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-body font-bold text-white shadow-sm">
            T
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 size={16} className="animate-spin text-primary" />
            <span>Restoring session…</span>
          </div>
        </div>
      </div>
    )
  }

  // If database schema is missing, inform developer/user cleanly rather than infinite loop
  if (schemaError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex max-w-md flex-col gap-4 rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-600" />
            <h2 className="text-sm font-bold">Database Setup Required</h2>
          </div>
          <p className="text-xs leading-relaxed">
            {schemaError}
          </p>
          <div className="rounded-lg bg-white/80 p-3 text-xs font-mono border border-amber-200">
            File: supabase/migrations/20261024000000_create_profiles.sql
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Link to="/" className={buttonClasses('secondary', 'sm')}>
              Go to Home
            </Link>
            <Link to="/login" className={buttonClasses('primary', 'sm')}>
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    const fullPath = `${location.pathname}${location.search}`
    return <Navigate to={`/login?redirect=${encodeURIComponent(fullPath)}`} replace />
  }

  // A logged-in user with an incomplete profile is routed to onboarding
  if (!user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    // Route user to their own role-appropriate dashboard
    return <Navigate to={user.role === 'tutor' ? '/tutor/dashboard' : '/dashboard'} replace />
  }

  return children
}

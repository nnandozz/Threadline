import { useLocation, Link } from 'react-router-dom'
import { StudentOnboarding } from './StudentOnboarding'
import { TutorOnboarding } from './TutorOnboarding'
import { EmptyState } from '@/components/ui/EmptyState'
import { buttonClasses } from '@/components/ui/Button'
import { getPendingSignup, type PendingSignup } from '@/lib/onboardingStore'

export function OnboardingPage() {
  const location = useLocation()

  // Router state covers the normal case (arriving right after signup);
  // localStorage covers a page refresh mid-onboarding.
  const pendingSignup = (location.state as PendingSignup | null) ?? getPendingSignup()

  if (!pendingSignup) {
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

  return pendingSignup.role === 'tutor' ? (
    <TutorOnboarding name={pendingSignup.name} />
  ) : (
    <StudentOnboarding name={pendingSignup.name} />
  )
}

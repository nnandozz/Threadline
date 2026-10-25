import { Outlet, useLocation } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { MarketingLayout } from '@/pages/marketing/MarketingLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { titleFromPath } from '@/lib/utils'

export function StudentLayout() {
  const location = useLocation()
  const { user, isAuthenticated, isLoading } = useAuth()

  const isPublicExplore =
    location.pathname.startsWith('/tutors') ||
    location.pathname.startsWith('/courses') ||
    location.pathname.startsWith('/book')

  // If a public explore route is accessed by a guest or non-student, render MarketingLayout
  if (isPublicExplore && !isLoading && (!isAuthenticated || user?.role !== 'student')) {
    return <MarketingLayout />
  }

  const userModel = {
    id: user?.id || '',
    name: user?.name || '',
    avatarUrl:
      user?.avatarUrl ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'Student')}`,
  }

  return (
    <ProtectedRoute requiredRole="student">
      <AppShell role="student" user={userModel} title={titleFromPath(location.pathname)}>
        <Outlet />
      </AppShell>
    </ProtectedRoute>
  )
}


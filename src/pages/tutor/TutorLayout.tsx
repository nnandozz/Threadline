import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { useAuth } from '@/context/AuthContext'
import { titleFromPath } from '@/lib/utils'

export function TutorLayout() {
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  if (user.role !== 'tutor') {
    return <Navigate to="/dashboard" replace />
  }

  const userModel = {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
  }

  return (
    <AppShell role="tutor" user={userModel} title={titleFromPath(location.pathname)}>
      <Outlet />
    </AppShell>
  )
}

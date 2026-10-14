import { Outlet, useLocation } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { alexMorgan } from '@/data/mockData'
import { titleFromPath } from '@/lib/utils'

// Hardcoded to Alex for now — there is no real auth yet.
export function TutorLayout() {
  const location = useLocation()

  return (
    <AppShell role="tutor" user={alexMorgan} title={titleFromPath(location.pathname)}>
      <Outlet />
    </AppShell>
  )
}

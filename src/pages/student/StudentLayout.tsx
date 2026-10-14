import { Outlet, useLocation } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { sarahThompson } from '@/data/mockData'
import { titleFromPath } from '@/lib/utils'

// Hardcoded to Sarah for now — there is no real auth yet.
// Swapping in a real session/user is a data-source change here only.
export function StudentLayout() {
  const location = useLocation()

  return (
    <AppShell role="student" user={sarahThompson} title={titleFromPath(location.pathname)}>
      <Outlet />
    </AppShell>
  )
}

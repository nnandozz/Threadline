import { type ReactNode, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import type { User, UserRole } from '@/types'

interface AppShellProps {
  role: UserRole
  user: User
  title?: string
  children: ReactNode
}

// Composes the role-aware sidebar + header + content area.
// On small screens, the sidebar becomes a slide-over drawer
// triggered by a menu button in place of the fixed column.
export function AppShell({ role, user, title, children }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar role={role} />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-ink/30"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 h-full">
            <Sidebar role={role} />
            <button
              aria-label="Close navigation"
              onClick={() => setMobileNavOpen(false)}
              className="absolute right-3 top-5 flex h-8 w-8 items-center justify-center rounded text-ink-secondary hover:bg-slate-50"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center border-b border-border bg-white md:hidden">
          <button
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
            className="flex h-16 w-14 items-center justify-center text-ink-secondary hover:text-ink"
          >
            <Menu size={20} />
          </button>
        </div>
        <Header user={user} title={title} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

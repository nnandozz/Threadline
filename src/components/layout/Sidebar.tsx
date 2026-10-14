import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  Calendar,
  BookOpen,
  TrendingUp,
  Library,
  MessageSquare,
  Settings,
  Users,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  to: string
  icon: typeof LayoutDashboard
}

const studentNav: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Find Tutors', to: '/tutors', icon: Search },
  { label: 'Lessons', to: '/lessons', icon: Calendar },
  { label: 'Homework', to: '/homework', icon: BookOpen },
  { label: 'Progress', to: '/progress', icon: TrendingUp },
  { label: 'Vocabulary', to: '/vocabulary', icon: Library },
  { label: 'Messages', to: '/messages', icon: MessageSquare },
  { label: 'Settings', to: '/settings', icon: Settings },
]

const tutorNav: NavItem[] = [
  { label: 'Dashboard', to: '/tutor/dashboard', icon: LayoutDashboard },
  { label: 'Students', to: '/tutor/students', icon: Users },
  { label: 'Calendar', to: '/tutor/schedule', icon: Calendar },
  { label: 'Messages', to: '/tutor/messages', icon: MessageSquare },
  { label: 'Earnings', to: '/tutor/earnings', icon: Wallet },
  { label: 'Settings', to: '/tutor/settings', icon: Settings },
]

interface SidebarProps {
  role: UserRole
  className?: string
}

export function Sidebar({ role, className }: SidebarProps) {
  const items = role === 'student' ? studentNav : tutorNav

  return (
    <nav
      aria-label="Primary"
      className={cn(
        'flex h-full w-60 shrink-0 flex-col gap-1 border-r border-border bg-white px-3 py-5',
        className,
      )}
    >
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-small font-bold text-white">
          T
        </div>
        <span className="text-body font-semibold text-ink">Threadline</span>
      </div>

      {items.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded px-3 py-2 text-small font-medium text-ink-secondary transition-colors duration-150',
              'hover:bg-slate-50 hover:text-ink',
              isActive && 'bg-primary-light text-primary hover:bg-primary-light hover:text-primary',
            )
          }
        >
          <Icon size={17} strokeWidth={2} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

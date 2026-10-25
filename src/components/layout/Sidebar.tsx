import { NavLink, Link, useNavigate } from 'react-router-dom'
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
  Compass,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  to: string
  icon: typeof LayoutDashboard
}

const studentNav: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Find Tutors', to: '/tutors', icon: Search },
  { label: 'Courses', to: '/courses', icon: BookOpen },
  { label: 'My Learning', to: '/lessons', icon: Calendar },
  { label: 'Homework', to: '/homework', icon: BookOpen },
  { label: 'Progress', to: '/progress', icon: TrendingUp },
  { label: 'Vocabulary', to: '/vocabulary', icon: Library },
  { label: 'Messages', to: '/messages', icon: MessageSquare },
  { label: 'Settings & Privacy', to: '/settings', icon: Settings },
]

const tutorNav: NavItem[] = [
  { label: 'Dashboard', to: '/tutor/dashboard', icon: LayoutDashboard },
  { label: 'Students', to: '/tutor/students', icon: Users },
  { label: 'Schedule', to: '/tutor/schedule', icon: Calendar },
  { label: 'My Services', to: '/tutor/services', icon: Compass },
  { label: 'Courses', to: '/tutor/courses', icon: BookOpen },
  { label: 'Earnings', to: '/tutor/earnings', icon: Wallet },
  { label: 'Messages', to: '/tutor/messages', icon: MessageSquare },
  { label: 'Settings', to: '/tutor/settings', icon: Settings },
]

interface SidebarProps {
  role: UserRole
  className?: string
}

export function Sidebar({ role, className }: SidebarProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const items = role === 'student' ? studentNav : tutorNav

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav
      aria-label="Primary"
      className={cn(
        'flex h-full w-56 lg:w-60 shrink-0 flex-col justify-between border-r border-slate-200/80 bg-white px-3 py-5',
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <Link to="/" className="mb-6 flex items-center gap-2.5 px-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white shadow-xs">
            T
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">Threadline</span>
        </Link>

        <div className="flex flex-col gap-0.5">
          {items.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition-colors duration-150',
                  'hover:bg-slate-50 hover:text-slate-900',
                  isActive && 'bg-indigo-50/80 text-primary font-semibold hover:bg-indigo-50/80 hover:text-primary',
                )
              }
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Account Role & Sign Out */}
      <div className="border-t border-slate-100 pt-4 px-2 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs py-1">
          <span className="font-semibold text-slate-700 capitalize">{role} Account</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500" title="Active Account" />
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-red-600 transition-colors text-left"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  )
}

import { Link, useNavigate } from 'react-router-dom'
import { Bell, Compass, LogOut } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'
import type { User } from '@/types'

interface HeaderProps {
  user: User
  title?: string
}

export function Header({ user, title }: HeaderProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-6">
      <p className="text-sm font-semibold text-slate-900 tracking-tight">{title}</p>

      <div className="flex items-center gap-3.5">
        {/* Quick link to explore marketplace */}
        <Link
          to="/tutors"
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Compass size={14} />
          <span>Find Tutors</span>
        </Link>

        <button
          aria-label="Notifications"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <Bell size={16} />
        </button>

        <div className="flex items-center gap-3 border-l border-slate-100 pl-3">
          <div className="flex items-center gap-2">
            <Avatar src={user.avatarUrl} name={user.name} size="sm" className="h-7 w-7" />
            <span className="hidden sm:inline-block text-xs font-medium text-slate-800">{user.name}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  )
}

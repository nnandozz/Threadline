import { Bell } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import type { User } from '@/types'

interface HeaderProps {
  user: User
  title?: string
}

export function Header({ user, title }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-6">
      {/* Intentionally not an <h1> — this is app chrome, not the page's
          primary heading. Each real page owns its own <h1> in its content. */}
      <p className="text-h3 text-ink">{title}</p>
      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-secondary transition-colors duration-150 hover:bg-slate-50 hover:text-ink"
        >
          <Bell size={18} />
        </button>
        <Avatar src={user.avatarUrl} name={user.name} size="sm" />
      </div>
    </header>
  )
}

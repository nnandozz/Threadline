import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

// Empty states are an invitation to act, not an apology.
// Always pair a clear next step (action) with the message where possible.
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-12 text-center',
        className,
      )}
    >
      {icon && <div className="text-ink-secondary">{icon}</div>}
      <div className="flex flex-col gap-1">
        <p className="text-body font-semibold text-ink">{title}</p>
        {description && <p className="max-w-sm text-small text-ink-secondary">{description}</p>}
      </div>
      {action}
    </div>
  )
}

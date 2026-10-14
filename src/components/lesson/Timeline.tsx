import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TimelineItemProps {
  dateLabel: string // e.g. "AUG 10"
  title: string
  children?: ReactNode // topic tags, summary excerpt, etc.
  onClick?: () => void
  isLast?: boolean
}

export function TimelineItem({ dateLabel, title, children, onClick, isLast = false }: TimelineItemProps) {
  const content = (
    <>
      <p className="text-label uppercase text-ink-secondary">{dateLabel}</p>
      <p className="mt-0.5 text-body font-semibold text-ink">{title}</p>
      {children && <div className="mt-2">{children}</div>}
    </>
  )

  const contentClassName = cn(
    'flex-1 pb-6 text-left',
    onClick && 'cursor-pointer rounded transition-colors duration-150 hover:bg-slate-50 -mt-1 px-2 py-1',
  )

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-primary bg-white" />
        {!isLast && <div className="w-px flex-1 bg-border" />}
      </div>
      {/* Rendered as a real <button> (not a dynamic tag) when clickable, so keyboard
          activation (Enter/Space) works natively without extra ARIA wiring. */}
      {onClick ? (
        <button type="button" onClick={onClick} className={contentClassName}>
          {content}
        </button>
      ) : (
        <div className={contentClassName}>{content}</div>
      )}
    </div>
  )
}

export function Timeline({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col', className)}>{children}</div>
}

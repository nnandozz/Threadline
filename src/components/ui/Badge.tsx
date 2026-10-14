import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'neutral' | 'primary' | 'accent' | 'success' | 'warning'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

const toneStyles: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-ink-secondary',
  primary: 'bg-primary-light text-primary',
  accent: 'bg-accent-light text-accent-hover',
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-small font-medium',
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  )
}

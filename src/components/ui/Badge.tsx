import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'neutral' | 'primary' | 'accent' | 'success' | 'warning'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

const toneStyles: Record<Tone, string> = {
  neutral: 'bg-slate-100/80 text-slate-600 border border-slate-200/60',
  primary: 'bg-indigo-50 text-indigo-700 border border-indigo-100/80',
  accent: 'bg-teal-50 text-teal-700 border border-teal-100/80',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-100/80',
  warning: 'bg-amber-50 text-amber-700 border border-amber-100/80',
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  )
}

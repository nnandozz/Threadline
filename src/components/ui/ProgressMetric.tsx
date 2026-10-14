import { cn } from '@/lib/utils'

interface ProgressMetricProps {
  label: string
  value: number // 0–100
  delta?: number // optional change since last period, e.g. +12
  className?: string
}

// Displays a skill trend, not a precise measurement.
// Language elsewhere referencing this should say "trend" / "observed",
// per Threadline's rule against overclaiming precision on subjective skills.
export function ProgressMetric({ label, value, delta, className }: ProgressMetricProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between">
        <span className="text-small text-ink-secondary">{label}</span>
        <span className="flex items-center gap-1.5 text-small font-semibold text-ink">
          {clamped}%
          {typeof delta === 'number' && delta !== 0 && (
            <span className={cn('text-small font-medium', delta > 0 ? 'text-success' : 'text-ink-secondary')}>
              {delta > 0 ? '+' : ''}
              {delta}
            </span>
          )}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  )
}

interface OnboardingProgressProps {
  current: number // 1-indexed
  total: number
}

export function OnboardingProgress({ current, total }: OnboardingProgressProps) {
  const percent = Math.round((current / total) * 100)

  return (
    <div className="flex flex-col gap-2">
      <p className="text-small font-medium text-ink-secondary">
        Step {current} of {total}
      </p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Step ${current} of ${total}`}
        />
      </div>
    </div>
  )
}

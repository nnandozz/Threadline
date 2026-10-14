import { AlertCircle } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

// Errors state plainly what happened and how to fix it — never vague, never apologetic.
export function ErrorState({
  title = 'Something went wrong',
  description = 'This section couldn\u2019t load. Try again in a moment.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-white px-6 py-12 text-center',
        className,
      )}
    >
      <AlertCircle className="text-red-500" size={22} />
      <div className="flex flex-col gap-1">
        <p className="text-body font-semibold text-ink">{title}</p>
        <p className="max-w-sm text-small text-ink-secondary">{description}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

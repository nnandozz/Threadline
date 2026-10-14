import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Simple skeleton block — compose these to build skeleton layouts
// that match the real content's shape (see usage guidance below).
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded bg-slate-100', className)} />
}

interface LoadingStateProps {
  label?: string
  className?: string
}

// Full-area spinner state for when a skeleton isn't practical
// (e.g. short async actions, modal contents).
export function LoadingState({ label = 'Loading…', className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 py-12 text-ink-secondary', className)}>
      <Loader2 className="animate-spin" size={20} />
      <p className="text-small">{label}</p>
    </div>
  )
}

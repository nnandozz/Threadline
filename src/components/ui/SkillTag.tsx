import { Check, Circle, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

type SkillTagStatus = 'mastered' | 'needs-practice' | 'recurring'

interface SkillTagProps {
  label: string
  status: SkillTagStatus
  className?: string
}

const config: Record<SkillTagStatus, { icon: typeof Check; classes: string }> = {
  mastered: {
    icon: Check,
    classes: 'bg-success-light text-success',
  },
  'needs-practice': {
    icon: Circle,
    classes: 'bg-warning-light text-warning',
  },
  recurring: {
    icon: RotateCcw,
    classes: 'bg-slate-100 text-ink-secondary',
  },
}

// Consistent visual language for a student's learning state.
// Used on the dashboard, student memory profile, and tutor brief alike —
// so "mastered" always looks the same everywhere it appears.
export function SkillTag({ label, status, className }: SkillTagProps) {
  const { icon: Icon, classes } = config[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-small font-medium',
        classes,
        className,
      )}
    >
      <Icon size={13} strokeWidth={2.5} />
      {label}
    </span>
  )
}

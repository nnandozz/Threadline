import { BookOpen, Mic, Layers, PenLine, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { HomeworkType } from '@/types'

interface HomeworkCardProps {
  title: string
  description: string
  type: HomeworkType
  durationMinutes: number
  completed?: boolean
  dueDateLabel?: string // e.g. "Due Aug 14" — optional, omitted renders the original copy
  onStart?: () => void
  className?: string
}

const typeIcon: Record<HomeworkType, typeof BookOpen> = {
  grammar: PenLine,
  vocabulary: BookOpen,
  speaking: Mic,
  flashcards: Layers,
}

const typeLabel: Record<HomeworkType, string> = {
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  speaking: 'Speaking',
  flashcards: 'Flashcards',
}

// The "Generated from your lesson" line is the differentiator —
// never omit it. It's what makes homework feel personalized rather
// than a generic worksheet.
export function HomeworkCard({
  title,
  description,
  type,
  durationMinutes,
  completed = false,
  dueDateLabel,
  onStart,
  className,
}: HomeworkCardProps) {
  const Icon = typeIcon[type]

  return (
    <Card className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-small font-medium text-accent-hover">
          <Icon size={15} />
          {typeLabel[type]}
        </div>
        {completed && (
          <span className="flex items-center gap-1 text-small font-medium text-success">
            <CheckCircle2 size={14} />
            Completed
          </span>
        )}
      </div>
      <div>
        <p className="text-body font-semibold text-ink">{title}</p>
        <p className="mt-1 text-small text-ink-secondary">{description}</p>
      </div>
      <div className="flex items-center justify-between pt-1">
        <span className="text-small text-ink-secondary">
          {durationMinutes} min · Generated from your last lesson
          {dueDateLabel && !completed ? ` · ${dueDateLabel}` : ''}
        </span>
        {!completed && (
          <Button size="sm" variant="secondary" onClick={onStart}>
            Start
          </Button>
        )}
      </div>
    </Card>
  )
}

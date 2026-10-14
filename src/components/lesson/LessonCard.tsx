import { Calendar, Video } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface LessonCardProps {
  title: string
  withPersonName: string
  withPersonAvatarUrl?: string
  dateLabel: string // e.g. "Tomorrow · 7:00 PM"
  statusLabel?: string // e.g. "Upcoming" — optional, omitted renders no badge
  onJoin?: () => void
  joinDisabled?: boolean
  joinLabel?: string
  className?: string
}

// Shown as the "next lesson" surface on both student and tutor dashboards.
// Kept intentionally simple: who, what, when, and one clear action.
export function LessonCard({
  title,
  withPersonName,
  withPersonAvatarUrl,
  dateLabel,
  statusLabel,
  onJoin,
  joinDisabled = true,
  joinLabel = 'Join Lesson',
  className,
}: LessonCardProps) {
  return (
    <Card className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex items-center gap-4">
        <Avatar src={withPersonAvatarUrl} name={withPersonName} size="lg" />
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-h3">{title}</p>
            {statusLabel && <Badge tone="primary">{statusLabel}</Badge>}
          </div>
          <p className="text-small text-ink-secondary">with {withPersonName}</p>
          <p className="flex items-center gap-1.5 text-small font-medium text-primary">
            <Calendar size={14} />
            {dateLabel}
          </p>
        </div>
      </div>
      <Button onClick={onJoin} disabled={joinDisabled} className="shrink-0">
        <Video size={16} />
        {joinLabel}
      </Button>
    </Card>
  )
}

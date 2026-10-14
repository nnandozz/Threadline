import { Star } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { Tutor } from '@/types'

interface TutorCardProps {
  tutor: Tutor
  onView?: () => void
  className?: string
}

// Trust and clarity over flashy design, per brief — photo, rating, price,
// and specialties are the load-bearing facts; keep everything else quiet.
export function TutorCard({ tutor, onView, className }: TutorCardProps) {
  return (
    <Card className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-start gap-3">
        <Avatar src={tutor.avatarUrl} name={tutor.name} size="lg" />
        <div className="flex flex-col gap-0.5">
          <p className="text-body font-semibold text-ink">{tutor.name}</p>
          <p className="text-small text-ink-secondary">{tutor.headline}</p>
          <div className="mt-1 flex items-center gap-1 text-small">
            <Star size={13} className="fill-warning text-warning" />
            <span className="font-medium text-ink">{tutor.rating}</span>
            <span className="text-ink-secondary">({tutor.reviewCount})</span>
          </div>
        </div>
      </div>

      <p className="line-clamp-2 text-small text-ink-secondary">{tutor.bio}</p>

      <div className="flex flex-wrap gap-1.5">
        {tutor.specialties.slice(0, 3).map((s) => (
          <Badge key={s} tone="primary">
            {s}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <p className="text-body font-semibold text-ink">
          ${tutor.pricePerHour}
          <span className="text-small font-normal text-ink-secondary"> / hour</span>
        </p>
        <Button size="sm" onClick={onView}>
          View Profile
        </Button>
      </div>
    </Card>
  )
}

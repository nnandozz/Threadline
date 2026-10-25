import { Video, MapPin, Home, Layers, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { TeachingFormat } from '@/types'

interface FormatBadgeProps {
  format: TeachingFormat
  showIcon?: boolean
  className?: string
}

export function FormatBadge({ format, showIcon = true, className }: FormatBadgeProps) {
  switch (format) {
    case 'online':
      return (
        <Badge tone="primary" className={className}>
          {showIcon && <Video size={12} className="mr-1 inline-block shrink-0" />}
          Online Video
        </Badge>
      )
    case 'in-person-tutor':
      return (
        <Badge tone="neutral" className={className}>
          {showIcon && <MapPin size={12} className="mr-1 inline-block shrink-0 text-slate-500" />}
          Studio
        </Badge>
      )
    case 'in-person-student':
      return (
        <Badge tone="neutral" className={className}>
          {showIcon && <Home size={12} className="mr-1 inline-block shrink-0 text-slate-500" />}
          In-Home
        </Badge>
      )
    case 'hybrid':
      return (
        <Badge tone="accent" className={className}>
          {showIcon && <Layers size={12} className="mr-1 inline-block shrink-0" />}
          Hybrid
        </Badge>
      )
    case 'group':
      return (
        <Badge tone="warning" className={className}>
          {showIcon && <Users size={12} className="mr-1 inline-block shrink-0" />}
          Group Cohort
        </Badge>
      )
    default:
      return (
        <Badge tone="neutral" className={className}>
          {format}
        </Badge>
      )
  }
}

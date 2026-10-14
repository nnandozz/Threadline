import { Sparkle } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'

interface StudentBriefPreviewProps {
  studentName: string
  studentAvatarUrl: string
  studentLevelLabel: string
  lastLessonTitle: string
  recurringPatterns: string[]
  homeworkCompleted: number
  homeworkTotal: number
  recommendedFocus: string
}

// A simplified preview for the marketing page — not the real tutor-facing
// component (that gets built properly in the Tutor step). Deliberately
// restrained: a draft-style card, not a glowing "AI dashboard."
export function StudentBriefPreview({
  studentName,
  studentAvatarUrl,
  studentLevelLabel,
  lastLessonTitle,
  recurringPatterns,
  homeworkCompleted,
  homeworkTotal,
  recommendedFocus,
}: StudentBriefPreviewProps) {
  return (
    <div className="rounded-lg border border-border bg-white p-6 shadow-raised">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Avatar src={studentAvatarUrl} name={studentName} size="md" />
        <div>
          <p className="text-body font-semibold text-ink">{studentName}</p>
          <p className="text-small text-ink-secondary">{studentLevelLabel}</p>
        </div>
        <span className="ml-auto flex items-center gap-1 text-label uppercase text-accent-hover">
          <Sparkle size={12} />
          Brief
        </span>
      </div>

      <dl className="flex flex-col gap-4 pt-4">
        <BriefRow label="Last lesson" value={lastLessonTitle} />
        <div>
          <dt className="text-label uppercase text-ink-secondary">Recurring</dt>
          <dd className="mt-1.5 flex flex-wrap gap-1.5">
            {recurringPatterns.map((pattern) => (
              <Badge key={pattern} tone="warning">
                {pattern}
              </Badge>
            ))}
          </dd>
        </div>
        <BriefRow label="Homework" value={`${homeworkCompleted}/${homeworkTotal} completed`} />
        <BriefRow label="Recommended focus" value={recommendedFocus} />
      </dl>
    </div>
  )
}

function BriefRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-label uppercase text-ink-secondary">{label}</dt>
      <dd className="mt-1 text-small font-medium text-ink">{value}</dd>
    </div>
  )
}

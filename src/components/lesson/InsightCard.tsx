import { type ReactNode } from 'react'
import { Sparkle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InsightCardProps {
  eyebrow?: string // defaults to "Threadline Insight"
  children: ReactNode
  className?: string
}

// Deliberately restrained — no glow, no gradient, no "AI chatbot" affect.
// Ration this component: one clear insight per context, never a running feed.
// This is what makes the AI layer feel like calm infrastructure, not a chatbot.
export function InsightCard({ eyebrow = 'Threadline Insight', children, className }: InsightCardProps) {
  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg border border-accent/20 bg-accent-light px-4 py-4',
        className,
      )}
    >
      <Sparkle size={16} className="mt-0.5 shrink-0 text-accent-hover" strokeWidth={2} />
      <div className="flex flex-col gap-1">
        <p className="text-label uppercase text-accent-hover">{eyebrow}</p>
        <div className="text-small text-ink">{children}</div>
      </div>
    </div>
  )
}

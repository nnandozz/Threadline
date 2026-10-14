import { RotateCcw, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const traditionalSteps = ['Lesson', 'Notes', 'Lesson ends']
const threadlineSteps = ['Lesson', 'Memory', 'Practice', 'Progress', 'Next lesson']

// Two small flow diagrams, side by side: one that visibly resets, one that
// visibly continues. The contrast IS the argument — no extra copy needed
// beyond the two labels above each row.
export function ComparisonFlow() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-white p-6">
        <p className="text-label uppercase text-ink-secondary">Traditional tutoring</p>
        <FlowRow steps={traditionalSteps} tone="muted" />
        <div className="flex items-center gap-2 text-small text-ink-secondary">
          <RotateCcw size={14} />
          Next lesson starts again from zero
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-accent/30 bg-accent-light p-6">
        <p className="text-label uppercase text-accent-hover">Threadline</p>
        <FlowRow steps={threadlineSteps} tone="accent" />
        <div className="flex items-center gap-2 text-small text-ink">
          <ArrowRight size={14} className="text-accent-hover" />
          Every lesson carries context into the next
        </div>
      </div>
    </div>
  )
}

function FlowRow({ steps, tone }: { steps: string[]; tone: 'muted' | 'accent' }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <span
            className={cn(
              'rounded-full px-3 py-1.5 text-small font-medium',
              tone === 'accent' ? 'bg-white text-accent-hover' : 'bg-slate-100 text-ink-secondary',
            )}
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            <ArrowRight
              size={14}
              className={tone === 'accent' ? 'text-accent-hover/60' : 'text-ink-secondary/50'}
            />
          )}
        </div>
      ))}
    </div>
  )
}

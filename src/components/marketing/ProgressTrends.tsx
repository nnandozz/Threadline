import { Sparkline } from '@/components/ui/Sparkline'
import type { ProgressPoint } from '@/types'

interface ProgressTrendsProps {
  progressHistory: ProgressPoint[]
}

// "Trend" language throughout — never "score" or "accuracy" as a precise
// measurement, per Threadline's rule against overclaiming on subjective skills.
export function ProgressTrends({ progressHistory }: ProgressTrendsProps) {
  const grammar = progressHistory.map((p) => p.skillLevels.grammar)
  const vocabulary = progressHistory.map((p) => p.skillLevels.vocabulary)
  const speaking = progressHistory.map((p) => p.skillLevels.speaking)

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <TrendCard label="Grammar trend" from={grammar[0]} to={grammar.at(-1)!} values={grammar} color="primary" />
      <TrendCard
        label="Vocabulary growth"
        from={vocabulary[0]}
        to={vocabulary.at(-1)!}
        values={vocabulary}
        color="accent"
        unit="%"
      />
      <TrendCard label="Speaking trend" from={speaking[0]} to={speaking.at(-1)!} values={speaking} color="success" />
    </div>
  )
}

function TrendCard({
  label,
  from,
  to,
  values,
  color,
  unit = '%',
}: {
  label: string
  from: number
  to: number
  values: number[]
  color: 'primary' | 'accent' | 'success'
  unit?: string
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-white p-5">
      <p className="text-small text-ink-secondary">{label}</p>
      <p className="text-h3 text-ink">
        {from}
        {unit} <span className="text-ink-secondary">→</span> {to}
        {unit}
      </p>
      <Sparkline values={values} color={color} className="mt-1 w-full" />
    </div>
  )
}

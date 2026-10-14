import { cn } from '@/lib/utils'

type SparklineColor = 'primary' | 'accent' | 'success'

interface SparklineProps {
  values: number[] // e.g. skill trend values over time, oldest first
  className?: string
  color?: SparklineColor
  width?: number
  height?: number
}

const colorClasses: Record<SparklineColor, { stroke: string; fill: string }> = {
  primary: { stroke: 'stroke-primary', fill: 'fill-primary' },
  accent: { stroke: 'stroke-accent', fill: 'fill-accent' },
  success: { stroke: 'stroke-success', fill: 'fill-success' },
}

// A quiet trend line — deliberately not a full chart library. Shows shape and
// direction only, which is all a "trend" claim needs (see ProgressMetric's
// note on not overclaiming precision for subjective skills).
export function Sparkline({ values, className, color = 'primary', width = 160, height = 48 }: SparklineProps) {
  if (values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const padding = 4

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - padding * 2) + padding
    const y = height - padding - ((v - min) / range) * (height - padding * 2)
    return `${x},${y}`
  })

  const [lastX, lastY] = points.at(-1)!.split(',').map(Number)
  const { stroke, fill } = colorClasses[color]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn('overflow-visible', className)}
      role="img"
      aria-label={`Trend from ${values[0]} to ${values.at(-1)}`}
    >
      <polyline
        points={points.join(' ')}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={stroke}
      />
      <circle cx={lastX} cy={lastY} r={3} className={fill} />
    </svg>
  )
}

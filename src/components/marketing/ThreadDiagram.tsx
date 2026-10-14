interface ThreadNode {
  label: string
  caption: string
}

const nodes: ThreadNode[] = [
  { label: 'Lesson', caption: 'Live, 1-on-1' },
  { label: 'Memory', caption: 'Quietly captured' },
  { label: 'Practice', caption: 'Personalized' },
  { label: 'Progress', caption: 'Visible' },
  { label: 'Next lesson', caption: 'Picks up right here' },
]

// Node x/y positions in a 380×660 viewBox, zig-zagging gently left/right —
// literally a thread stitching down the page. This is the page's one
// deliberate visual risk; everything else stays quiet around it.
// (Right-side nodes sit at x=210, leaving 150 units for label text before
// the viewBox edge at 380 — enough room for "Next lesson" without clipping.)
const positions = [
  { x: 110, y: 56 },
  { x: 210, y: 196 },
  { x: 110, y: 336 },
  { x: 210, y: 476 },
  { x: 110, y: 600 },
]

const path = `
  M ${positions[0].x} ${positions[0].y}
  C ${positions[0].x + 90} ${positions[0].y + 40}, ${positions[1].x - 90} ${positions[1].y - 40}, ${positions[1].x} ${positions[1].y}
  S ${positions[2].x + 90} ${positions[2].y - 40}, ${positions[2].x} ${positions[2].y}
  S ${positions[3].x - 90} ${positions[3].y - 40}, ${positions[3].x} ${positions[3].y}
  S ${positions[4].x + 90} ${positions[4].y - 40}, ${positions[4].x} ${positions[4].y}
`

export function ThreadDiagram() {
  return (
    <svg
      viewBox="0 0 380 660"
      className="h-auto w-full max-w-sm"
      role="img"
      aria-label="A thread connecting Lesson, Memory, Practice, Progress, and back to the next Lesson — representing how Threadline carries context forward between lessons."
    >
      {/* The thread itself */}
      <path d={path} fill="none" className="stroke-accent" strokeWidth={2.5} strokeLinecap="round" />

      {/* A faint return-stitch from the last node back toward the first,
          hinting the loop continues rather than ending. */}
      <path
        d={`M ${positions[4].x - 36} ${positions[4].y} C ${positions[4].x - 120} ${positions[4].y - 60}, ${positions[0].x - 90} ${positions[0].y + 60}, ${positions[0].x - 36} ${positions[0].y}`}
        fill="none"
        className="stroke-accent/25"
        strokeWidth={2}
        strokeDasharray="3 6"
        strokeLinecap="round"
      />

      {nodes.map((node, i) => {
        const { x, y } = positions[i]
        const isLast = i === nodes.length - 1
        return (
          <g key={node.label}>
            <circle
              cx={x}
              cy={y}
              r={9}
              className={isLast ? 'fill-primary stroke-primary' : 'fill-white stroke-primary'}
              strokeWidth={2.5}
            />
            <circle cx={x} cy={y} r={3} className={isLast ? 'fill-white' : 'fill-primary'} />
            <text
              x={x > 160 ? x + 20 : x - 20}
              y={y - 4}
              textAnchor={x > 160 ? 'start' : 'end'}
              className="fill-ink font-sans text-body font-semibold"
            >
              {node.label}
            </text>
            <text
              x={x > 160 ? x + 20 : x - 20}
              y={y + 16}
              textAnchor={x > 160 ? 'start' : 'end'}
              className="fill-ink-secondary font-sans text-small"
            >
              {node.caption}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

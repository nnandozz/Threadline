interface Step {
  number: string
  title: string
  description: string
}

const steps: Step[] = [
  { number: '01', title: 'Learn', description: 'Have a live 1-on-1 lesson with a real tutor.' },
  {
    number: '02',
    title: 'Remember',
    description: 'Threadline quietly captures what you learned, where you struggled, and what needs practice.',
  },
  { number: '03', title: 'Practice', description: 'Receive personalized homework based on your actual lesson.' },
  {
    number: '04',
    title: 'Continue',
    description: 'Your tutor sees where you left off, so every lesson picks up where the previous one ended.',
  },
]

// A real sequence, so numbering earns its place here (unlike a generic feature
// grid). Connected by one continuous line running behind the circles — their
// white fill "cuts" the line at each stop, which reads as connected without
// needing per-segment position math.
export function HowItWorksSteps() {
  return (
    <div className="relative grid gap-8 md:grid-cols-4 md:gap-6">
      <div aria-hidden="true" className="absolute inset-x-6 top-6 hidden h-px bg-border md:block" />
      {steps.map((step) => (
        <div key={step.number} className="relative flex flex-col gap-3">
          <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-white text-small font-bold text-primary">
            {step.number}
          </div>
          <p className="text-h3">{step.title}</p>
          <p className="text-small text-ink-secondary">{step.description}</p>
        </div>
      ))}
    </div>
  )
}

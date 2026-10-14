import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectableOptionProps {
  label: string
  description?: string
  selected: boolean
  onClick: () => void
  variant?: 'row' | 'chip'
  className?: string
}

// A real <button> (not a styled div) so it's keyboard-operable and
// announces its pressed state to assistive tech for free via aria-pressed.
// Whether a step behaves as single- or multi-select is entirely up to the
// parent's onClick handler — this component only renders the choice.
export function SelectableOption({
  label,
  description,
  selected,
  onClick,
  variant = 'row',
  className,
}: SelectableOptionProps) {
  if (variant === 'chip') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        className={cn(
          'rounded-full border px-4 py-2 text-small font-medium transition-colors duration-150',
          selected
            ? 'border-primary bg-primary-light text-primary'
            : 'border-border bg-white text-ink-secondary hover:border-primary/40 hover:text-ink',
          className,
        )}
      >
        {label}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3.5 text-left transition-colors duration-150',
        selected ? 'border-primary bg-primary-light' : 'border-border bg-white hover:border-primary/40',
        className,
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className={cn('text-body font-medium', selected ? 'text-primary' : 'text-ink')}>{label}</span>
        {description && <span className="text-small text-ink-secondary">{description}</span>}
      </div>
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150',
          selected ? 'border-primary bg-primary' : 'border-border bg-white',
        )}
      >
        {selected && <Check size={12} strokeWidth={3} className="text-white" />}
      </span>
    </button>
  )
}

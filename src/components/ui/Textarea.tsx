import { type TextareaHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

// Mirrors Input.tsx's API and visual treatment exactly, for the rare cases
// (tutor bio, lesson notes editing, etc.) that need more than one line.
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, rows = 4, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-small font-medium text-ink">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            'w-full resize-y rounded border border-border bg-white px-3 py-2 text-body text-ink placeholder:text-ink-secondary',
            'transition-colors duration-150',
            'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-small text-red-600">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-small text-ink-secondary">
            {hint}
          </p>
        ) : null}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

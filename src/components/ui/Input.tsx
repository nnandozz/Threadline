import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-small font-medium text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            'h-10 w-full rounded border border-border bg-white px-3 text-body text-ink placeholder:text-ink-secondary',
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
Input.displayName = 'Input'

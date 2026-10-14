import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover disabled:bg-primary/50',
  secondary: 'bg-white text-ink border border-border hover:bg-slate-50 disabled:opacity-50',
  ghost: 'bg-transparent text-ink hover:bg-slate-100 disabled:opacity-50',
  danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-small rounded-sm gap-1.5',
  md: 'h-10 px-4 text-body rounded gap-2',
  lg: 'h-12 px-6 text-body rounded-lg gap-2',
}

// Exported so link-styled-as-button cases (see buttonClasses below) can reuse
// the exact same visual treatment without nesting a <button> inside an <a> —
// nesting interactive elements is invalid HTML and breaks keyboard/screen-reader behavior.
export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center font-medium transition-colors duration-150',
    'disabled:cursor-not-allowed',
    variantStyles[variant],
    sizeStyles[size],
    className,
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return <button ref={ref} className={buttonClasses(variant, size, className)} {...props} />
  },
)
Button.displayName = 'Button'

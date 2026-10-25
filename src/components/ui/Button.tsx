import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover shadow-xs active:scale-[0.99] disabled:bg-primary/50 disabled:shadow-none disabled:active:scale-100',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-xs active:scale-[0.99] disabled:opacity-50 disabled:shadow-none disabled:active:scale-100',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.99] disabled:opacity-50 disabled:active:scale-100',
  danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 shadow-xs active:scale-[0.99] disabled:opacity-50 disabled:active:scale-100',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5 font-medium',
  md: 'h-9.5 px-3.5 text-sm rounded-lg gap-2 font-medium',
  lg: 'h-11 px-5 text-sm md:text-base rounded-lg gap-2 font-medium',
}

// Exported so link-styled-as-button cases (see buttonClasses below) can reuse
// the exact same visual treatment without nesting a <button> inside an <a> —
// nesting interactive elements is invalid HTML and breaks keyboard/screen-reader behavior.
// eslint-disable-next-line react-refresh/only-export-components
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

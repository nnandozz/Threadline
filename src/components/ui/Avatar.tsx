import { useState } from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: 'h-8 w-8 text-small',
  md: 'h-11 w-11 text-body',
  lg: 'h-16 w-16 text-h3',
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const [errored, setErrored] = useState(false)

  if (!src || errored) {
    return (
      <div
        role="img"
        aria-label={name}
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full bg-primary-light font-semibold text-primary',
          sizeStyles[size],
          className,
        )}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setErrored(true)}
      className={cn('shrink-0 rounded-full object-cover', sizeStyles[size], className)}
    />
  )
}

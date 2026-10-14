import type { ReactNode } from 'react'
import { Card } from './Card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string
  className?: string
}

export function StatCard({ icon, label, value, className }: StatCardProps) {
  return (
    <Card className={cn('flex items-center gap-3', className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
        {icon}
      </div>
      <div className="flex flex-col">
        <p className="text-h3 text-ink">{value}</p>
        <p className="text-small text-ink-secondary">{label}</p>
      </div>
    </Card>
  )
}

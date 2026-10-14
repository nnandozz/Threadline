import { Construction } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'

interface PlaceholderProps {
  pageName: string
}

// Temporary stand-in used by routes not yet implemented.
// Every real page replaces this with actual content in a later step —
// nothing here is meant to ship.
export function Placeholder({ pageName }: PlaceholderProps) {
  return (
    <EmptyState
      icon={<Construction size={28} />}
      title={`${pageName} is coming in a later step`}
      description="This route is wired up and ready — the real screen hasn't been built yet."
    />
  )
}

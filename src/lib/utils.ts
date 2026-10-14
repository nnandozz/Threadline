import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Standard shadcn-style class merge helper.
// Lets components accept a `className` prop and override defaults safely.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Derives a header title from a URL path, e.g. "/tutor/students" -> "Students".
// Used as a lightweight fallback until pages set their own explicit titles.
// Takes pathname as an argument (from useLocation()) so callers stay reactive
// to client-side navigation — reading window.location directly would not
// re-render when React Router swaps the matched child route.
export function titleFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const last = segments.at(-1) ?? 'dashboard'
  if (/^[a-f0-9-]{8,}$/i.test(last)) {
    // looks like an id (e.g. a lesson or student id) — fall back to the parent segment
    const parent = segments.at(-2) ?? 'dashboard'
    return parent.charAt(0).toUpperCase() + parent.slice(1).replace(/-/g, ' ')
  }
  return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ')
}

// Formats a lesson's ISO date + 24h time into a short display label,
// e.g. "Fri · 7:00 PM". Derived from real data rather than hardcoded so it
// can't drift out of sync with a lesson's actual date.
export function formatLessonDateLabel(isoDate: string, time24h: string): string {
  const [hours, minutes] = time24h.split(':').map(Number)
  const date = new Date(`${isoDate}T00:00:00`)
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  const minuteLabel = String(minutes).padStart(2, '0')
  return `${weekday} · ${hour12}:${minuteLabel} ${period}`
}

// Short, friendly date label for lists/cards, e.g. "Aug 14".
export function formatShortDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Time-of-day greeting based on the visitor's real local clock.
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

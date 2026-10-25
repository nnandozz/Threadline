import type { AvailabilitySlot } from '@/types'
import type { TutorAvailabilityOption } from '@/types/onboarding'

const WEEKDAY_WINDOWS: Record<string, string[]> = {
  'Weekday mornings': ['09:00'],
  'Weekday afternoons': ['14:00'],
  'Weekday evenings': ['19:00'],
  'Weekend mornings': ['10:00'],
  'Weekend afternoons': ['13:00'],
  'Weekend evenings': ['18:00'],
}

export function generateAvailabilityFromWindows(
  windows: TutorAvailabilityOption[],
  daysAhead = 14,
): AvailabilitySlot[] {
  if (windows.length === 0) return []

  const slots: AvailabilitySlot[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let offset = 1; offset <= daysAhead; offset += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() + offset)
    const day = date.getDay()
    const isWeekend = day === 0 || day === 6
    const times: string[] = []

    for (const window of windows) {
      const applies = window.startsWith('Weekend') ? isWeekend : !isWeekend
      if (!applies) continue
      for (const time of WEEKDAY_WINDOWS[window] ?? []) {
        if (!times.includes(time)) times.push(time)
      }
    }

    if (times.length > 0) {
      times.sort()
      slots.push({ date: toIsoDate(date), times })
    }
  }

  return slots
}

export function mergeAvailability(
  current: AvailabilitySlot[],
  date: string,
  time: string,
): AvailabilitySlot[] {
  const existing = current.find((slot) => slot.date === date)
  if (!existing) {
    return [...current, { date, times: [time] }].sort((a, b) => a.date.localeCompare(b.date))
  }
  if (existing.times.includes(time)) return current
  return current.map((slot) =>
    slot.date === date ? { ...slot, times: [...slot.times, time].sort() } : slot,
  )
}

export function removeAvailabilityTime(
  current: AvailabilitySlot[],
  date: string,
  time: string,
): AvailabilitySlot[] {
  return current
    .map((slot) =>
      slot.date === date ? { ...slot, times: slot.times.filter((t) => t !== time) } : slot,
    )
    .filter((slot) => slot.times.length > 0)
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

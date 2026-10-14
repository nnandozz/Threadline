// ─────────────────────────────────────────────────────────────
// Mock auth / onboarding persistence
//
// There's no backend yet, so this just needs to survive the handoff
// from Signup -> Onboarding -> Dashboard, including a page refresh in
// between. Router state (navigate(path, { state })) handles the normal
// case; localStorage is the fallback so refreshing mid-onboarding
// doesn't lose the user's role/name/email.
//
// This is intentionally separate from the canonical Student/Tutor mock
// data in `data/mockData.ts` — wiring a freshly "signed up" user into
// the dashboard's single source of truth is a later step's job.
// ─────────────────────────────────────────────────────────────

import type { UserRole } from '@/types'

const PENDING_SIGNUP_KEY = 'threadline:pendingSignup'

export interface PendingSignup {
  role: UserRole
  name: string
  email: string
}

export function savePendingSignup(data: PendingSignup) {
  try {
    localStorage.setItem(PENDING_SIGNUP_KEY, JSON.stringify(data))
  } catch {
    // localStorage can be unavailable (private browsing, storage full, etc.)
    // Onboarding still works for the current session via router state.
  }
}

export function getPendingSignup(): PendingSignup | null {
  try {
    const raw = localStorage.getItem(PENDING_SIGNUP_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (
      parsed &&
      (parsed.role === 'student' || parsed.role === 'tutor') &&
      typeof parsed.name === 'string' &&
      typeof parsed.email === 'string'
    ) {
      return parsed as PendingSignup
    }
    return null
  } catch {
    return null
  }
}

export function clearPendingSignup() {
  try {
    localStorage.removeItem(PENDING_SIGNUP_KEY)
  } catch {
    // no-op — nothing to clean up if storage isn't available
  }
}

// Stores the finished onboarding answers keyed by role, for whenever a
// later step wires this into a real dashboard. Not read anywhere yet.
export function saveOnboardingAnswers(role: UserRole, answers: unknown) {
  try {
    localStorage.setItem(`threadline:onboarding:${role}`, JSON.stringify(answers))
  } catch {
    // no-op
  }
}

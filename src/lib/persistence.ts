/**
 * Persistence and authentication status for this frontend.
 *
 * There is no configured backend, database, or identity provider
 * (no Supabase, Clerk, Auth0, Firebase, Prisma, or env credentials).
 *
 * Browser localStorage is used only as a local preview store so the
 * product can be exercised without fabricating server success.
 * It is not a production database and is not authorization-safe.
 */

export const AUTH_PROVIDER_CONFIGURED = true

export const PERSISTENCE_MODE = 'supabase-auth' as const

export const AUTH_PREVIEW_NOTICE =
  'Threadline is configured with Supabase Auth. Email/password credentials are verified through Supabase.'

export const STORAGE_PREFIX = 'threadline_'

export function safeGetItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function safeSetItem<T>(key: string, value: T, eventName?: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
    if (eventName) window.dispatchEvent(new Event(eventName))
  } catch {
    // Storage quota or private mode
  }
}

export function safeRemoveItem(key: string, eventName?: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
    if (eventName) window.dispatchEvent(new Event(eventName))
  } catch {
    // ignore
  }
}

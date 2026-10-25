import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (client) return client

  const url = import.meta.env.VITE_SUPABASE_URL
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (typeof url !== 'string' || !url.trim()) {
    throw new Error(
      'Supabase is not configured: VITE_SUPABASE_URL is missing. Set it in .env.local and restart the Vite dev server.',
    )
  }

  if (typeof publishableKey !== 'string' || !publishableKey.trim()) {
    throw new Error(
      'Supabase is not configured: VITE_SUPABASE_PUBLISHABLE_KEY is missing. Set the publishable key in .env.local and restart the Vite dev server.',
    )
  }

  client = createClient(url.trim(), publishableKey.trim())

  return client
}

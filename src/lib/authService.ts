import type { UserRole } from '@/types'
import { getSupabaseClient } from '@/lib/supabaseClient'

export type TutorVerificationStatus = 'not_applicable' | 'pending' | 'approved' | 'rejected'

export interface ProfileRecord {
  id: string
  full_name: string | null
  email: string | null
  role: UserRole
  verification_status: TutorVerificationStatus
  onboarding_completed: boolean
  avatar_url: string | null
  headline: string | null
  bio: string | null
  price_per_hour: number | null
  target_subjects: string[] | null
  level: string | null
  learning_goals: string[] | null
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  verificationStatus: TutorVerificationStatus
  avatarUrl?: string
  createdAt: string
  onboardingCompleted: boolean
  learningGoals?: string[]
  targetSubjects?: string[]
  level?: string
  headline?: string
  bio?: string
  pricePerHour?: number
}

export interface ProfileFetchResult {
  profile: ProfileRecord | null
  error?: {
    code?: string
    message: string
    isMissingSchema?: boolean
  }
}

export interface MutationResult<T> {
  data?: T
  error?: string
  isMissingSchema?: boolean
}

// In-memory cache for synchronous callers (e.g. legacy helper stores).
// The source of truth remains the active Supabase session and public.profiles.
let cachedCurrentUser: AuthUser | null = null

export function getCurrentUser(): AuthUser | null {
  return cachedCurrentUser
}

export function setCurrentUser(user: AuthUser | null): void {
  cachedCurrentUser = user
}

export function profileToAuthUser(
  profile: Partial<ProfileRecord> & { id: string },
  fallbackEmail?: string,
  metadata?: Record<string, unknown>,
): AuthUser {
  const rawRole = profile.role || (metadata?.role as UserRole) || 'student'
  const role: UserRole = rawRole === 'tutor' ? 'tutor' : 'student'
  const name =
    profile.full_name ||
    (metadata?.full_name as string) ||
    (metadata?.name as string) ||
    'Threadline Member'
  const email = profile.email || fallbackEmail || (metadata?.email as string) || ''
  const avatarUrl = profile.avatar_url || (metadata?.avatar_url as string) || undefined

  const verificationStatus: TutorVerificationStatus =
    profile.verification_status ||
    (role === 'tutor' ? 'pending' : 'not_applicable')

  return {
    id: profile.id,
    name,
    email,
    role,
    verificationStatus,
    avatarUrl,
    createdAt: profile.created_at || new Date().toISOString(),
    onboardingCompleted: Boolean(profile.onboarding_completed),
    learningGoals: profile.learning_goals || [],
    targetSubjects: profile.target_subjects || [],
    level: profile.level || undefined,
    headline: profile.headline || undefined,
    bio: profile.bio || undefined,
    pricePerHour: profile.price_per_hour ? Number(profile.price_per_hour) : undefined,
  }
}

export async function fetchUserProfile(userId: string): Promise<ProfileFetchResult> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      const isMissing =
        error.code === '42P01' ||
        (error.message && error.message.toLowerCase().includes('relation "public.profiles" does not exist'))

      return {
        profile: null,
        error: {
          code: error.code,
          message: error.message,
          isMissingSchema: Boolean(isMissing),
        },
      }
    }

    return { profile: data as ProfileRecord | null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to query profiles table.'
    const isMissing = message.toLowerCase().includes('relation') || message.includes('42P01')
    return {
      profile: null,
      error: {
        message,
        isMissingSchema: Boolean(isMissing),
      },
    }
  }
}

export async function completeStudentOnboarding(
  targetSubjects: string[],
  level: string,
  goals: string[],
): Promise<MutationResult<ProfileRecord>> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.rpc('complete_student_onboarding', {
      p_target_subjects: targetSubjects,
      p_level: level,
      p_learning_goals: goals,
    })

    if (error) {
      const isMissing =
        error.code === '42883' ||
        error.code === '42P01' ||
        (error.message && error.message.includes('function public.complete_student_onboarding'))

      return {
        error: error.message,
        isMissingSchema: Boolean(isMissing),
      }
    }

    return { data: data as ProfileRecord }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to complete student onboarding.'
    return { error: message }
  }
}

export async function completeTutorOnboarding(
  targetSubjects: string[],
  headline: string,
  bio: string,
  avatarUrl?: string | null,
  pricePerHour?: number,
): Promise<MutationResult<ProfileRecord>> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.rpc('complete_tutor_onboarding', {
      p_target_subjects: targetSubjects,
      p_headline: headline,
      p_bio: bio,
      p_avatar_url: avatarUrl || null,
      p_price_per_hour: pricePerHour || 40,
    })

    if (error) {
      const isMissing =
        error.code === '42883' ||
        error.code === '42P01' ||
        (error.message && error.message.includes('function public.complete_tutor_onboarding'))

      return {
        error: error.message,
        isMissingSchema: Boolean(isMissing),
      }
    }

    return { data: data as ProfileRecord }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to complete tutor onboarding.'
    return { error: message }
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<AuthUser>,
): Promise<MutationResult<ProfileRecord>> {
  try {
    const supabase = getSupabaseClient()

    // Map camelCase AuthUser updates to snake_case profiles table columns.
    // Explicitly exclude `role`, `id`, `email`, `verification_status`, and `onboarding_completed`.
    const dbUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (updates.name !== undefined) dbUpdates.full_name = updates.name
    if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl
    if (updates.learningGoals !== undefined) dbUpdates.learning_goals = updates.learningGoals
    if (updates.targetSubjects !== undefined) dbUpdates.target_subjects = updates.targetSubjects
    if (updates.level !== undefined) dbUpdates.level = updates.level
    if (updates.headline !== undefined) dbUpdates.headline = updates.headline
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio
    if (updates.pricePerHour !== undefined) dbUpdates.price_per_hour = updates.pricePerHour

    const { data, error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId)
      .select('*')
      .maybeSingle()

    if (error) {
      return { error: error.message }
    }

    return { data: data as ProfileRecord }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Exception during profile update.'
    return { error: message }
  }
}

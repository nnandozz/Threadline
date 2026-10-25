import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react'
import { getSupabaseClient } from '@/lib/supabaseClient'
import {
  fetchUserProfile,
  completeStudentOnboarding as apiCompleteStudentOnboarding,
  completeTutorOnboarding as apiCompleteTutorOnboarding,
  updateUserProfile as apiUpdateUserProfile,
  profileToAuthUser,
  setCurrentUser,
  type AuthUser,
  type TutorVerificationStatus,
} from '@/lib/authService'
import { clearPendingSignup } from '@/lib/onboardingStore'
import type { UserRole } from '@/types'

export interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  role: UserRole | null
  verificationStatus: TutorVerificationStatus
  isLoading: boolean
  schemaError: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) => Promise<{ user?: AuthUser; error?: string }>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ success: boolean; user?: AuthUser; error?: string }>
  completeStudentOnboarding: (
    targetSubjects: string[],
    level: string,
    goals: string[],
  ) => Promise<{ success: boolean; error?: string }>
  completeTutorOnboarding: (
    targetSubjects: string[],
    headline: string,
    bio: string,
    avatarUrl?: string | null,
    pricePerHour?: number,
  ) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [schemaError, setSchemaError] = useState<string | null>(null)

  // Monotonic sequence counter to prevent out-of-order async operations from clobbering newer state
  const requestIdRef = useRef(0)

  // Session verification and event subscription
  useEffect(() => {
    let isMounted = true
    const supabase = getSupabaseClient()

    async function syncSession(source: string) {
      const currentReqId = ++requestIdRef.current

      try {
        // Server-verified user authentication
        const { data: { user: authUser }, error: userError } = await supabase.auth.getUser()

        if (userError || !authUser) {
          if (isMounted && currentReqId === requestIdRef.current) {
            setUser(null)
            setCurrentUser(null)
            setIsLoading(false)
          }
          return
        }

        // Fetch verified database profile
        const { profile, error: profileError } = await fetchUserProfile(authUser.id)

        if (!isMounted || currentReqId !== requestIdRef.current) return

        if (profileError?.isMissingSchema) {
          setSchemaError(
            'Database table "public.profiles" does not exist. Please apply migration 20261024000000_create_profiles.sql in the Supabase SQL editor.',
          )
          setUser(null)
          setCurrentUser(null)
          setIsLoading(false)
          return
        }

        if (profileError) {
          console.warn(`[${source}] Profile query error:`, profileError.message)
          setUser(null)
          setCurrentUser(null)
          setIsLoading(false)
          return
        }

        if (!profile) {
          console.warn(`[${source}] Authenticated user has no profile row in public.profiles.`)
          setUser(null)
          setCurrentUser(null)
          setIsLoading(false)
          return
        }

        const mapped = profileToAuthUser(profile, authUser.email, authUser.user_metadata)
        setSchemaError(null)
        setUser(mapped)
        setCurrentUser(mapped)
        setIsLoading(false)
      } catch (err) {
        if (isMounted && currentReqId === requestIdRef.current) {
          console.error(`[${source}] Unexpected authentication sync error:`, err)
          setUser(null)
          setCurrentUser(null)
          setIsLoading(false)
        }
      }
    }

    // Initial server-side verification
    syncSession('mount')

    // Listen to Supabase auth transitions
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (!isMounted) return

      if (event === 'SIGNED_OUT') {
        requestIdRef.current++
        setUser(null)
        setCurrentUser(null)
        setIsLoading(false)
        clearPendingSignup()
        return
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        syncSession(event)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    setIsLoading(true)
    const currentReqId = ++requestIdRef.current

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: 'Login succeeded but user credentials were not returned.' }
      }

      const { profile, error: profileError } = await fetchUserProfile(data.user.id)

      if (profileError?.isMissingSchema) {
        const msg =
          'Database table "public.profiles" is missing. Please apply migration 20261024000000_create_profiles.sql in the Supabase SQL editor.'
        setSchemaError(msg)
        return { success: false, error: msg }
      }

      if (profileError) {
        return { success: false, error: `Failed to load user profile: ${profileError.message}` }
      }

      if (!profile) {
        return {
          success: false,
          error: 'User profile not found. The database trigger handle_new_user may not have executed.',
        }
      }

      const authUser = profileToAuthUser(profile, data.user.email, data.user.user_metadata)

      if (currentReqId === requestIdRef.current) {
        setUser(authUser)
        setCurrentUser(authUser)
        setSchemaError(null)
      }

      return { success: true, user: authUser }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during login.'
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  async function register(
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ): Promise<{ user?: AuthUser; error?: string }> {
    setIsLoading(true)
    const currentReqId = ++requestIdRef.current

    try {
      const supabase = getSupabaseClient()
      const trimmedName = name.trim()
      const trimmedEmail = email.trim()

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
            role,
          },
        },
      })

      if (error) {
        return { error: error.message }
      }

      if (!data.user) {
        return { error: 'Account registration failed: no user data returned.' }
      }

      // If email confirmation is required and session is null, return user representation
      if (!data.session) {
        const pendingUser: AuthUser = {
          id: data.user.id,
          name: trimmedName,
          email: trimmedEmail,
          role,
          verificationStatus: role === 'tutor' ? 'pending' : 'not_applicable',
          createdAt: new Date().toISOString(),
          onboardingCompleted: false,
        }
        return { user: pendingUser }
      }

      // If session is immediately active, fetch the trigger-created profile
      const { profile, error: profileError } = await fetchUserProfile(data.user.id)

      if (profileError?.isMissingSchema) {
        setSchemaError(
          'Database table "public.profiles" is missing. Please apply migration 20261024000000_create_profiles.sql in the Supabase SQL editor.',
        )
      }

      const authUser = profile
        ? profileToAuthUser(profile, data.user.email, { full_name: trimmedName, role })
        : {
            id: data.user.id,
            name: trimmedName,
            email: trimmedEmail,
            role,
            verificationStatus: role === 'tutor' ? ('pending' as const) : ('not_applicable' as const),
            createdAt: new Date().toISOString(),
            onboardingCompleted: false,
          }

      if (currentReqId === requestIdRef.current) {
        setUser(authUser)
        setCurrentUser(authUser)
      }

      return { user: authUser }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during signup.'
      return { error: message }
    } finally {
      setIsLoading(false)
    }
  }

  async function logout(): Promise<void> {
    try {
      requestIdRef.current++
      const supabase = getSupabaseClient()
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('Sign out encountered an error:', err)
    } finally {
      setUser(null)
      setCurrentUser(null)
      clearPendingSignup()
    }
  }

  async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred while requesting password reset.'
      return { success: false, error: message }
    }
  }

  async function updatePassword(password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update password.'
      return { success: false, error: message }
    }
  }

  async function completeStudentOnboarding(
    targetSubjects: string[],
    level: string,
    goals: string[],
  ): Promise<{ success: boolean; error?: string }> {
    if (!user) return { success: false, error: 'User is not logged in.' }

    const res = await apiCompleteStudentOnboarding(targetSubjects, level, goals)
    if (res.error) {
      return { success: false, error: res.error }
    }

    if (res.data) {
      const updatedUser = profileToAuthUser(res.data, user.email)
      setUser(updatedUser)
      setCurrentUser(updatedUser)
      clearPendingSignup()
      return { success: true }
    }

    return { success: false, error: 'Onboarding completed but no updated profile was returned.' }
  }

  async function completeTutorOnboarding(
    targetSubjects: string[],
    headline: string,
    bio: string,
    avatarUrl?: string | null,
    pricePerHour?: number,
  ): Promise<{ success: boolean; error?: string }> {
    if (!user) return { success: false, error: 'User is not logged in.' }

    const res = await apiCompleteTutorOnboarding(targetSubjects, headline, bio, avatarUrl, pricePerHour)
    if (res.error) {
      return { success: false, error: res.error }
    }

    if (res.data) {
      const updatedUser = profileToAuthUser(res.data, user.email)
      setUser(updatedUser)
      setCurrentUser(updatedUser)
      clearPendingSignup()
      return { success: true }
    }

    return { success: false, error: 'Onboarding completed but no updated profile was returned.' }
  }

  async function updateProfile(
    updates: Partial<AuthUser>,
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    if (!user) return { success: false, error: 'User is not authenticated.' }

    // Strip sensitive fields
    const sanitized: Partial<AuthUser> = { ...updates }
    delete sanitized.role
    delete sanitized.id
    delete sanitized.email
    delete sanitized.verificationStatus
    delete sanitized.onboardingCompleted

    const res = await apiUpdateUserProfile(user.id, sanitized)
    if (res.error) {
      return { success: false, error: res.error }
    }

    if (!res.data) {
      return { success: false, error: 'Profile update failed to return saved record.' }
    }

    const nextUser = profileToAuthUser(res.data, user.email)
    setUser(nextUser)
    setCurrentUser(nextUser)
    return { success: true, user: nextUser }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user ? user.role : null,
        verificationStatus: user ? user.verificationStatus : 'not_applicable',
        isLoading,
        schemaError,
        login,
        register,
        logout,
        resetPassword,
        updatePassword,
        updateProfile,
        completeStudentOnboarding,
        completeTutorOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

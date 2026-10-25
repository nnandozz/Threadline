import type { TeachingFormat } from '@/types'

// ─────────────────────────────────────────────────────────────
// Onboarding intake types
//
// Kept separate from the canonical Student/Tutor shapes in
// `types/index.ts` on purpose: this is what a signup form collects,
// not yet the richer profile the dashboard reads from. Merging a new
// signup into the real Student/Tutor mock data is later-step work.
// ─────────────────────────────────────────────────────────────

export const ONBOARDING_SUBJECTS = ['English', 'Mathematics', 'Programming', 'Science', 'Other'] as const
export type OnboardingSubject = (typeof ONBOARDING_SUBJECTS)[number]

export const ONBOARDING_LEVELS = ['Beginner', 'Elementary', 'Intermediate', 'Advanced'] as const
export type OnboardingLevel = (typeof ONBOARDING_LEVELS)[number]

export const ONBOARDING_GOALS = [
  'Improve speaking',
  'Improve grammar',
  'Prepare for exams',
  'Homework help',
  'Build confidence',
  'Career skills',
] as const
export type OnboardingGoal = (typeof ONBOARDING_GOALS)[number]

export const ONBOARDING_FREQUENCIES = ['2–3 times a week', '4–5 times a week', 'Every day'] as const
export type OnboardingFrequency = (typeof ONBOARDING_FREQUENCIES)[number]

export interface StudentOnboardingAnswers {
  subject: OnboardingSubject | null
  level: OnboardingLevel | null
  goals: OnboardingGoal[]
  frequency: OnboardingFrequency | null
}

export const TUTOR_SUBJECTS = [
  'English',
  'Mathematics',
  'Programming',
  'Science',
  'Spanish',
  'Test Prep',
  'Music',
  'Other',
] as const

export const TUTOR_EXPERIENCE_LEVELS = ['Less than 1 year', '1–3 years', '3–5 years', '5+ years'] as const
export type TutorExperienceLevel = (typeof TUTOR_EXPERIENCE_LEVELS)[number]

export const TUTOR_AVAILABILITY_OPTIONS = [
  'Weekday mornings',
  'Weekday afternoons',
  'Weekday evenings',
  'Weekend mornings',
  'Weekend afternoons',
  'Weekend evenings',
] as const
export type TutorAvailabilityOption = (typeof TUTOR_AVAILABILITY_OPTIONS)[number]

export interface TutorOnboardingAnswers {
  subjects: string[]
  experience: TutorExperienceLevel | null
  education: string
  teachingStyle: string
  bio: string
  avatarUrl: string | null
  availability: TutorAvailabilityOption[]
  pricePerHour: number
  formats: TeachingFormat[]
  city: string
  area: string
}

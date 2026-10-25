import type { TeachingFormat, Tutor } from '@/types'
import type { TutorOnboardingAnswers } from '@/types/onboarding'
import type { AuthUser } from '@/lib/authService'
import { generateAvailabilityFromWindows } from '@/lib/availability'
import { getTutorById, upsertTutorProfile } from '@/lib/marketplaceStore'

const SUBJECT_CATEGORIES: Record<string, string> = {
  English: 'Languages',
  Mathematics: 'Mathematics',
  Programming: 'Programming & CS',
  Science: 'Science',
  Spanish: 'Languages',
  'Test Prep': 'Competitive Exams',
  Music: 'Music & Arts',
  Other: 'Other',
}

const EXPERIENCE_YEARS: Record<string, number> = {
  'Less than 1 year': 0,
  '1–3 years': 2,
  '3–5 years': 4,
  '5+ years': 6,
}

export function buildTutorProfile(user: AuthUser, answers?: Partial<TutorOnboardingAnswers> & {
  pricePerHour?: number
  formats?: TeachingFormat[]
  city?: string
  area?: string
}): Tutor {
  const existing = getTutorById(user.id)
  const subjects = answers?.subjects ?? user.targetSubjects ?? existing?.specialties ?? []
  const formats = answers?.formats ?? existing?.formats ?? ['online']
  const city = answers?.city ?? existing?.location?.city ?? ''
  const area = answers?.area ?? existing?.location?.area ?? ''
  const availability =
    answers?.availability && answers.availability.length > 0
      ? generateAvailabilityFromWindows(answers.availability)
      : existing?.availability ?? []

  return {
    id: user.id,
    role: 'tutor',
    name: user.name,
    avatarUrl: user.avatarUrl || existing?.avatarUrl || '',
    headline: user.headline || (subjects.length ? `${subjects.join(' & ')} tutor` : 'Tutor on Threadline'),
    bio: answers?.bio ?? user.bio ?? existing?.bio ?? '',
    rating: existing?.rating ?? 0,
    reviewCount: existing?.reviewCount ?? 0,
    languages: existing?.languages ?? ['English'],
    specialties: subjects.length > 0 ? subjects : existing?.specialties ?? [],
    teachingStyle: answers?.teachingStyle ?? existing?.teachingStyle ?? '',
    pricePerHour: answers?.pricePerHour ?? user.pricePerHour ?? existing?.pricePerHour ?? 600,
    yearsExperience: answers?.experience ? EXPERIENCE_YEARS[answers.experience] ?? existing?.yearsExperience ?? 0 : existing?.yearsExperience ?? 0,
    availability,
    formats,
    location: {
      city: city || existing?.location?.city || 'Delhi NCR',
      area,
      country: existing?.location?.country ?? 'India',
      travelRadiusKm: existing?.location?.travelRadiusKm,
      offersInPersonStudent: formats.includes('in-person-student'),
      offersInPersonTutor: formats.includes('in-person-tutor'),
      travelFee: existing?.location?.travelFee,
      addressGeneral: existing?.location?.addressGeneral,
    },
    subjectCategories: Array.from(
      new Set(subjects.map((subject) => SUBJECT_CATEGORIES[subject] ?? subject)),
    ),
    educationLevels: existing?.educationLevels ?? [],
    qualifications: answers?.education ? [answers.education] : existing?.qualifications ?? [],
    verificationStatus: 'pending',
    packageOffers: existing?.packageOffers ?? [],
    badges: [],
  }
}

export function publishTutorProfile(user: AuthUser, answers?: Parameters<typeof buildTutorProfile>[1]): Tutor {
  return upsertTutorProfile(buildTutorProfile(user, answers))
}

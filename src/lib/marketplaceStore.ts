import { useEffect, useState } from 'react'
import type {
  Booking,
  Course,
  StudentLearningPreferences,
  AIMemoryPrivacySettings,
  TeachingFormat,
  Tutor,
  AvailabilitySlot,
} from '@/types'
import { getCurrentUser } from '@/lib/authService'
import { safeGetItem, safeSetItem } from '@/lib/persistence'
import { mergeAvailability, removeAvailabilityTime } from '@/lib/availability'

const STORE_EVENT = 'threadline_store_updated'
const BOOKINGS_KEY = 'threadline_bookings'
const TUTORS_KEY = 'threadline_tutor_directory'
const COURSES_KEY = 'threadline_course_directory'
const ENROLLED_COURSES_KEY = 'threadline_enrolled_courses'
const SAVED_TUTORS_KEY = 'threadline_saved_tutors'
const LEARNING_PREFERENCES_KEY = 'threadline_learning_preferences'
const AI_PRIVACY_KEY = 'threadline_ai_privacy'

export const defaultLearningPreferences: StudentLearningPreferences = {
  targetSubjects: [],
  educationLevel: '',
  preferredFormats: ['online'],
  maxBudgetPerHour: 1500,
  weeklyAvailability: [],
  learningGoal: '',
  city: 'Delhi NCR',
  area: 'South Delhi & Gurugram',
}

export const defaultAiPrivacySettings: AIMemoryPrivacySettings = {
  shareGoals: true,
  shareRecurringErrors: true,
  shareVocabulary: true,
  shareAssessmentNotes: true,
  allowLessonAudioAnalysisConsent: true,
}

function persist<T>(key: string, value: T): void {
  safeSetItem(key, value, STORE_EVENT)
}

// ─────────────────────────────────────────────────────────────
// Tutor directory (registered tutors only — never seeded)
// ─────────────────────────────────────────────────────────────

export function listTutors(): Tutor[] {
  return safeGetItem<Tutor[]>(TUTORS_KEY, [])
}

export function getTutorById(tutorId: string): Tutor | undefined {
  return listTutors().find((tutor) => tutor.id === tutorId)
}

export function upsertTutorProfile(tutor: Tutor): Tutor {
  const current = listTutors()
  const exists = current.some((item) => item.id === tutor.id)
  const updated = exists ? current.map((item) => (item.id === tutor.id ? tutor : item)) : [...current, tutor]
  persist(TUTORS_KEY, updated)
  return tutor
}

export function patchTutorProfile(tutorId: string, patch: Partial<Tutor>): Tutor | null {
  const existing = getTutorById(tutorId)
  if (!existing) return null
  return upsertTutorProfile({ ...existing, ...patch, id: tutorId })
}

export function addTutorAvailability(tutorId: string, date: string, time: string): Tutor | null {
  const existing = getTutorById(tutorId)
  if (!existing) return null
  return upsertTutorProfile({
    ...existing,
    availability: mergeAvailability(existing.availability, date, time),
  })
}

export function removeTutorAvailability(tutorId: string, date: string, time: string): Tutor | null {
  const existing = getTutorById(tutorId)
  if (!existing) return null
  return upsertTutorProfile({
    ...existing,
    availability: removeAvailabilityTime(existing.availability, date, time),
  })
}

export function setTutorAvailability(tutorId: string, availability: AvailabilitySlot[]): Tutor | null {
  return patchTutorProfile(tutorId, { availability })
}

// ─────────────────────────────────────────────────────────────
// Course directory (tutor-created only — never seeded)
// ─────────────────────────────────────────────────────────────

export function listCourses(): Course[] {
  return safeGetItem<Course[]>(COURSES_KEY, [])
}

export function getCourseById(courseId: string): Course | undefined {
  return listCourses().find((course) => course.id === courseId)
}

export function listCoursesByTutor(tutorId: string): Course[] {
  return listCourses().filter((course) => course.tutorId === tutorId)
}

export function upsertCourse(course: Course): Course {
  const current = listCourses()
  const exists = current.some((item) => item.id === course.id)
  const updated = exists ? current.map((item) => (item.id === course.id ? course : item)) : [...current, course]
  persist(COURSES_KEY, updated)
  return course
}

export function useCatalog() {
  const [tutors, setTutors] = useState<Tutor[]>(() => listTutors())
  const [courses, setCourses] = useState<Course[]>(() => listCourses())

  useEffect(() => {
    function load() {
      setTutors(listTutors())
      setCourses(listCourses())
    }
    load()
    window.addEventListener(STORE_EVENT, load)
    return () => window.removeEventListener(STORE_EVENT, load)
  }, [])

  return { tutors, courses }
}

// ─────────────────────────────────────────────────────────────
// Bookings Store
// ─────────────────────────────────────────────────────────────

export function getAllBookings(): Booking[] {
  return safeGetItem<Booking[]>(BOOKINGS_KEY, [])
}

export function getBookings(userId?: string): Booking[] {
  const uid = userId || getCurrentUser()?.id
  if (!uid) return []
  return getAllBookings().filter((b) => b.studentId === uid || b.tutorId === uid)
}

export function getBookingById(bookingId: string): Booking | undefined {
  return getAllBookings().find((booking) => booking.id === bookingId)
}

export function hasBookingConflict(tutorId: string, date: string, time: string, excludeId?: string): boolean {
  return getAllBookings().some(
    (booking) =>
      booking.tutorId === tutorId &&
      booking.date === date &&
      booking.time === time &&
      booking.status !== 'cancelled' &&
      booking.id !== excludeId,
  )
}

export function saveBooking(booking: Booking): void {
  const current = getAllBookings()
  const exists = current.some((b) => b.id === booking.id)
  const updated = exists ? current.map((b) => (b.id === booking.id ? booking : b)) : [booking, ...current]
  persist(BOOKINGS_KEY, updated)
}

export function createBookingRequest(booking: Booking): { booking?: Booking; error?: string } {
  const tutor = getTutorById(booking.tutorId)
  if (!tutor) return { error: 'This tutor is no longer listed.' }

  const slotOpen = tutor.availability.some((slot) => slot.date === booking.date && slot.times.includes(booking.time))
  if (!slotOpen) return { error: 'That time is not on the tutor’s current availability.' }

  if (hasBookingConflict(booking.tutorId, booking.date, booking.time)) {
    return { error: 'That time is already requested or booked.' }
  }

  saveBooking(booking)
  return { booking }
}

export function cancelBooking(bookingId: string): void {
  const current = getAllBookings()
  const updated = current.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
  persist(BOOKINGS_KEY, updated)
}

// ─────────────────────────────────────────────────────────────
// Course Enrollment Store (Scoped to user)
// ─────────────────────────────────────────────────────────────

export function getEnrolledCourseIds(userId?: string): string[] {
  const uid = userId || getCurrentUser()?.id
  if (!uid) return []
  return safeGetItem<string[]>(`${ENROLLED_COURSES_KEY}_${uid}`, [])
}

export function enrollInCourse(courseId: string, userId?: string): void {
  const uid = userId || getCurrentUser()?.id
  if (!uid) return
  const current = getEnrolledCourseIds(uid)
  if (!current.includes(courseId)) {
    persist(`${ENROLLED_COURSES_KEY}_${uid}`, [...current, courseId])
    const course = getCourseById(courseId)
    if (course && course.enrolledCount < course.maxCapacity) {
      upsertCourse({ ...course, enrolledCount: course.enrolledCount + 1 })
    }
  }
}

export function isCourseEnrolled(courseId: string, userId?: string): boolean {
  return getEnrolledCourseIds(userId).includes(courseId)
}

// ─────────────────────────────────────────────────────────────
// Saved / Shortlisted Tutors (Scoped to user)
// ─────────────────────────────────────────────────────────────

export function getSavedTutorIds(userId?: string): string[] {
  const uid = userId || getCurrentUser()?.id
  if (!uid) return []
  return safeGetItem<string[]>(`${SAVED_TUTORS_KEY}_${uid}`, [])
}

export function toggleSaveTutor(tutorId: string, userId?: string): boolean {
  const uid = userId || getCurrentUser()?.id
  if (!uid) return false
  const current = getSavedTutorIds(uid)
  const isSaved = current.includes(tutorId)
  const updated = isSaved ? current.filter((id) => id !== tutorId) : [...current, tutorId]
  persist(`${SAVED_TUTORS_KEY}_${uid}`, updated)
  return !isSaved
}

export function isTutorSaved(tutorId: string, userId?: string): boolean {
  return getSavedTutorIds(userId).includes(tutorId)
}

// ─────────────────────────────────────────────────────────────
// Learning Preferences Store
// ─────────────────────────────────────────────────────────────

// Known non-Indian city values that may exist in localStorage from pre-localisation sessions.
const STALE_CITIES = new Set([
  'London', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'San Francisco',
  'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow', 'Sydney', 'Melbourne',
  'Toronto', 'Vancouver', 'Dubai', 'Singapore',
])

export function getLearningPreferences(userId?: string): StudentLearningPreferences {
  const uid = userId || getCurrentUser()?.id
  const key = uid ? `${LEARNING_PREFERENCES_KEY}_${uid}` : LEARNING_PREFERENCES_KEY
  const stored = safeGetItem<StudentLearningPreferences>(key, defaultLearningPreferences)

  // Non-destructive sanitisation: fix stale USD/UK-locale values without
  // touching any field the user intentionally set (subjects, goals, etc.).
  let needsResave = false
  const patched = { ...stored }

  // If maxBudgetPerHour looks like an old USD value (< 200), reset to INR default.
  if (typeof patched.maxBudgetPerHour === 'number' && patched.maxBudgetPerHour < 200) {
    patched.maxBudgetPerHour = defaultLearningPreferences.maxBudgetPerHour
    needsResave = true
  }

  // If city is a known non-Indian city from old sessions, reset to INR default.
  if (typeof patched.city === 'string' && STALE_CITIES.has(patched.city)) {
    patched.city = defaultLearningPreferences.city
    patched.area = defaultLearningPreferences.area
    needsResave = true
  }

  if (needsResave) {
    // Persist the corrected value silently so the next read is already clean.
    safeSetItem(key, patched, STORE_EVENT)
  }

  return patched
}

export function updateLearningPreferences(
  prefs: Partial<StudentLearningPreferences>,
  userId?: string,
): StudentLearningPreferences {
  const current = getLearningPreferences(userId)
  const updated = { ...current, ...prefs }
  const uid = userId || getCurrentUser()?.id
  const key = uid ? `${LEARNING_PREFERENCES_KEY}_${uid}` : LEARNING_PREFERENCES_KEY
  persist(key, updated)
  return updated
}

// ─────────────────────────────────────────────────────────────
// AI Privacy Settings Store
// ─────────────────────────────────────────────────────────────

export function getAiPrivacySettings(userId?: string): AIMemoryPrivacySettings {
  const uid = userId || getCurrentUser()?.id
  const key = uid ? `${AI_PRIVACY_KEY}_${uid}` : AI_PRIVACY_KEY
  return safeGetItem<AIMemoryPrivacySettings>(key, defaultAiPrivacySettings)
}

export function updateAiPrivacySettings(
  settings: Partial<AIMemoryPrivacySettings>,
  userId?: string,
): AIMemoryPrivacySettings {
  const current = getAiPrivacySettings(userId)
  const updated = { ...current, ...settings }
  const uid = userId || getCurrentUser()?.id
  const key = uid ? `${AI_PRIVACY_KEY}_${uid}` : AI_PRIVACY_KEY
  persist(key, updated)
  return updated
}

// ─────────────────────────────────────────────────────────────
// Format Helpers
// ─────────────────────────────────────────────────────────────

export function formatTeachingFormatLabel(format: TeachingFormat): string {
  switch (format) {
    case 'online':
      return 'Online Video'
    case 'in-person-tutor':
      return "In-Person (Tutor's Studio)"
    case 'in-person-student':
      return "In-Person (Student's Home)"
    case 'hybrid':
      return 'Hybrid (Online + In-Person)'
    case 'group':
      return 'Group Class'
    default:
      return format
  }
}

export function formatTeachingFormatBadgeTone(format: TeachingFormat): 'primary' | 'accent' | 'success' | 'warning' {
  switch (format) {
    case 'online':
      return 'primary'
    case 'hybrid':
      return 'accent'
    case 'in-person-tutor':
    case 'in-person-student':
      return 'success'
    case 'group':
      return 'warning'
    default:
      return 'primary'
  }
}

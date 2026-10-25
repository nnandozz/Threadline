// ─────────────────────────────────────────────────────────────
// Threadline domain model
//
// This is the shape real API responses should eventually match.
// The mock data layer (src/data) is built against these types so
// swapping mock data for a real backend later is a data-source
// change, not a component rewrite.
// ─────────────────────────────────────────────────────────────

export type SkillKey = 'grammar' | 'vocabulary' | 'speaking' | 'listening' | 'pronunciation'

export type SkillLevels = Record<SkillKey, number> // 0–100, treated as a trend indicator, not a lab measurement

export type MasteryState = 'new' | 'learning' | 'mastered'

export interface User {
  id: string
  name: string
  avatarUrl: string
}

export interface AvailabilitySlot {
  date: string // ISO date, e.g. "2026-08-12"
  times: string[] // e.g. ["09:00", "14:00", "18:30"]
}

export type TeachingFormat = 'online' | 'in-person-tutor' | 'in-person-student' | 'hybrid' | 'group'

export interface TutorLocation {
  city: string
  area: string // e.g. "Connaught Place", "Koramangala", "South Delhi"
  country: string
  travelRadiusKm?: number
  offersInPersonStudent: boolean // tutor travels to student
  offersInPersonTutor: boolean // student visits tutor's studio
  travelFee?: number
  addressGeneral?: string
}

export interface TutorPackage {
  id: string
  title: string
  lessonCount: number
  durationMinutes: number
  discountPercent: number
  price: number
  format: TeachingFormat
}

export interface Tutor extends User {
  role: 'tutor'
  headline: string
  bio: string
  rating: number
  reviewCount: number
  languages: string[]
  specialties: string[]
  teachingStyle: string
  pricePerHour: number
  yearsExperience: number
  introVideoThumbnailUrl?: string
  availability: AvailabilitySlot[]
  // Marketplace extensions
  formats: TeachingFormat[]
  location?: TutorLocation
  subjectCategories: string[]
  educationLevels: string[]
  qualifications: string[]
  verificationStatus: 'verified' | 'pending' | 'demo'
  packageOffers?: TutorPackage[]
  badges?: string[]
}

export interface Student extends User {
  role: 'student'
  targetLanguage: string
  level: 'Beginner' | 'Elementary' | 'Intermediate' | 'Upper Intermediate' | 'Advanced'
  goal: string
  tutorId: string
  skillLevels: SkillLevels
  // Cumulative distinct words learned to date. Distinct from `vocabulary` below,
  // which holds only the recent/notable words worth showing in detail — a real
  // running total wouldn't keep every word's full detail in memory at once.
  totalVocabularyLearned: number
  // Consecutive days with learning activity (lesson or homework). Same kind of
  // cumulative summary stat as totalVocabularyLearned above — not backed by a
  // day-by-day activity log yet, just a running count a real backend would own.
  currentStreakDays: number
  masteredConcepts: string[]
  needsPractice: string[]
  recurringErrors: RecurringError[]
  vocabulary: VocabularyWord[]
  progressHistory: ProgressPoint[]
  learningPreferences?: StudentLearningPreferences
  aiPrivacySettings?: AIMemoryPrivacySettings
}

export interface StudentLearningPreferences {
  targetSubjects: string[]
  educationLevel: string
  preferredFormats: TeachingFormat[]
  city?: string
  area?: string
  maxBudgetPerHour: number
  weeklyAvailability: string[]
  learningGoal: string
}

export interface AIMemoryPrivacySettings {
  shareGoals: boolean
  shareRecurringErrors: boolean
  shareVocabulary: boolean
  shareAssessmentNotes: boolean
  allowLessonAudioAnalysisConsent: boolean
}

export interface CourseModule {
  id: string
  title: string
  description: string
  durationHours: number
  topics: string[]
}

export interface Course {
  id: string
  tutorId: string
  title: string
  subtitle: string
  description: string
  subject: string
  category: string
  level: string
  format: TeachingFormat
  price: number
  totalHours: number
  weeksDuration: number
  startDate: string
  schedule: string
  maxCapacity: number
  enrolledCount: number
  syllabus: CourseModule[]
  learningObjectives: string[]
  prerequisites: string[]
  rating: number
  reviewCount: number
  imageUrl?: string
}

export type BookingType = 'single' | 'package' | 'course' | 'group'
export type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled'

export interface Booking {
  id: string
  studentId: string
  studentName?: string
  tutorId: string
  courseId?: string
  type: BookingType
  subject: string
  format: TeachingFormat
  date: string
  time: string
  durationMinutes: number
  price: number
  status: BookingStatus
  locationDetails?: string
  onlineMeetingUrl?: string
  packageId?: string
  notes?: string
  createdAt: string
}

export interface RecurringError {
  id: string
  pattern: string // human label, e.g. "Present perfect tense"
  example: string // e.g. "I have went to the store yesterday."
  category: SkillKey
  firstSeenLessonId: string
  lastSeenLessonId: string
  occurrences: number
  status: 'active' | 'improving' | 'resolved'
}

export interface VocabularyWord {
  id: string
  word: string
  definition: string
  exampleSentence: string
  mastery: MasteryState
  sourceLessonId: string
  dateAdded: string // ISO date
}

export interface ProgressPoint {
  date: string // ISO date
  skillLevels: SkillLevels
}

export type LessonStatus = 'upcoming' | 'completed' | 'cancelled'

export interface Lesson {
  id: string
  studentId: string
  tutorId: string
  title: string
  date: string // ISO date
  time: string // e.g. "19:00"
  durationMinutes: number
  status: LessonStatus
  topics: string[]
  format?: TeachingFormat
  locationDetails?: string
  courseId?: string
  meetingUrl?: string
  // Populated only once status === 'completed'
  summary?: LessonSummary
}

export interface LessonSummary {
  topicsCovered: string[]
  strengths: string[]
  needsPractice: string[]
  newVocabularyIds: string[]
  tutorNotes: string
  aiDraftNotes: string
  notesApproved: boolean
  skillDeltas: Partial<Record<SkillKey, number>> // e.g. { grammar: +12 } shown as "62% → 74%"
}

export type HomeworkType = 'grammar' | 'vocabulary' | 'speaking' | 'flashcards'

export interface HomeworkItem {
  id: string
  studentId: string
  sourceLessonId: string
  type: HomeworkType
  title: string
  description: string
  durationMinutes: number
  completed: boolean
  dateAssigned: string
  dueDate: string
  courseId?: string
  tutorId?: string
}

export type UserRole = 'student' | 'tutor'


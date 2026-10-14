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
}

export interface AvailabilitySlot {
  date: string // ISO date, e.g. "2026-08-12"
  times: string[] // e.g. ["09:00", "14:00", "18:30"]
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
  // The date of the next lesson after the one this was generated from —
  // homework is meant to be practiced before picking the thread back up.
  dueDate: string
}

export type UserRole = 'student' | 'tutor'

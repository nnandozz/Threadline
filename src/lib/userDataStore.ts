import type {
  Lesson,
  HomeworkItem,
  VocabularyWord,
  RecurringError,
  ProgressPoint,
} from '@/types'
import { getCurrentUser } from '@/lib/authService'

function safeGetItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeSetItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new Event('threadline_user_data_updated'))
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────────────────────
// User-Scoped Lessons Store
// ─────────────────────────────────────────────────────────────

export function getUserLessons(userId?: string): Lesson[] {
  const uid = userId || getCurrentUser()?.id
  if (!uid) return []
  return safeGetItem<Lesson[]>(`threadline_lessons_${uid}`, [])
}

export function saveUserLesson(lesson: Lesson, userId?: string): void {
  const uid = userId || getCurrentUser()?.id
  if (!uid) return
  const current = getUserLessons(uid)
  const exists = current.some((l) => l.id === lesson.id)
  const updated = exists ? current.map((l) => (l.id === lesson.id ? lesson : l)) : [lesson, ...current]
  safeSetItem(`threadline_lessons_${uid}`, updated)
}

// ─────────────────────────────────────────────────────────────
// User-Scoped Homework Store
// ─────────────────────────────────────────────────────────────

export function getUserHomework(userId?: string): HomeworkItem[] {
  const uid = userId || getCurrentUser()?.id
  if (!uid) return []
  return safeGetItem<HomeworkItem[]>(`threadline_homework_${uid}`, [])
}

export function saveUserHomework(item: HomeworkItem, userId?: string): void {
  const uid = userId || getCurrentUser()?.id
  if (!uid) return
  const current = getUserHomework(uid)
  const exists = current.some((h) => h.id === item.id)
  const updated = exists ? current.map((h) => (h.id === item.id ? item : h)) : [item, ...current]
  safeSetItem(`threadline_homework_${uid}`, updated)
}

export function toggleHomeworkCompleted(itemId: string, userId?: string): void {
  const uid = userId || getCurrentUser()?.id
  if (!uid) return
  const current = getUserHomework(uid)
  const updated = current.map((h) => (h.id === itemId ? { ...h, completed: !h.completed } : h))
  safeSetItem(`threadline_homework_${uid}`, updated)
}

// ─────────────────────────────────────────────────────────────
// User-Scoped Vocabulary Store
// ─────────────────────────────────────────────────────────────

export function getUserVocabulary(userId?: string): VocabularyWord[] {
  const uid = userId || getCurrentUser()?.id
  if (!uid) return []
  return safeGetItem<VocabularyWord[]>(`threadline_vocab_${uid}`, [])
}

export function saveUserVocabulary(word: VocabularyWord, userId?: string): void {
  const uid = userId || getCurrentUser()?.id
  if (!uid) return
  const current = getUserVocabulary(uid)
  const exists = current.some((v) => v.id === word.id)
  const updated = exists ? current.map((v) => (v.id === word.id ? word : v)) : [word, ...current]
  safeSetItem(`threadline_vocab_${uid}`, updated)
}

// ─────────────────────────────────────────────────────────────
// User-Scoped Recurring Errors & Learning Memory
// ─────────────────────────────────────────────────────────────

export function getUserRecurringErrors(userId?: string): RecurringError[] {
  const uid = userId || getCurrentUser()?.id
  if (!uid) return []
  return safeGetItem<RecurringError[]>(`threadline_errors_${uid}`, [])
}

export function getUserProgressPoints(userId?: string): ProgressPoint[] {
  const uid = userId || getCurrentUser()?.id
  if (!uid) return []
  return safeGetItem<ProgressPoint[]>(`threadline_progress_${uid}`, [])
}

export function saveUserRecurringError(errorItem: RecurringError, userId?: string): void {
  const uid = userId || getCurrentUser()?.id
  if (!uid) return
  const current = getUserRecurringErrors(uid)
  const exists = current.some((e) => e.id === errorItem.id)
  const updated = exists ? current.map((e) => (e.id === errorItem.id ? errorItem : e)) : [errorItem, ...current]
  safeSetItem(`threadline_errors_${uid}`, updated)
}

export function saveUserProgressPoint(point: ProgressPoint, userId?: string): void {
  const uid = userId || getCurrentUser()?.id
  if (!uid) return
  const current = getUserProgressPoints(uid)
  const exists = current.some((p) => p.date === point.date)
  const updated = exists ? current.map((p) => (p.date === point.date ? point : p)) : [...current, point]
  safeSetItem(`threadline_progress_${uid}`, updated)
}

// ─────────────────────────────────────────────────────────────
// Tutor-Scoped Booking Requests & Earnings
// ─────────────────────────────────────────────────────────────

export interface TutorEarningsRecord {
  id: string
  studentName: string
  lessonTitle: string
  amount: number
  date: string
  status: 'pending' | 'paid'
  format: string
}

export function getTutorEarnings(tutorId?: string): TutorEarningsRecord[] {
  const uid = tutorId || getCurrentUser()?.id
  if (!uid) return []
  return safeGetItem<TutorEarningsRecord[]>(`threadline_earnings_${uid}`, [])
}

export function addTutorEarningsRecord(record: TutorEarningsRecord, tutorId?: string): void {
  const uid = tutorId || getCurrentUser()?.id
  if (!uid) return
  const current = getTutorEarnings(uid)
  safeSetItem(`threadline_earnings_${uid}`, [record, ...current])
}

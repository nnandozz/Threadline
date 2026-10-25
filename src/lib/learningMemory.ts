import type {
  Lesson,
  LessonSummary,
  VocabularyWord,
  RecurringError,
  ProgressPoint,
  SkillKey,
  SkillLevels,
} from '@/types'
import {
  saveUserLesson,
  saveUserVocabulary,
  saveUserRecurringError,
  saveUserProgressPoint,
  getUserProgressPoints,
} from '@/lib/userDataStore'

export interface ObservationAnalysisResult {
  primaryTopic: string
  topicsCovered: string[]
  masteredConcepts: string[]
  needsPractice: string[]
  recurringErrors: RecurringError[]
  vocabulary: VocabularyWord[]
  continuityRecommendation: string
  skillDeltas: Partial<Record<SkillKey, number>>
}

export interface RecordObservationParams {
  studentId: string
  tutorId: string
  tutorName?: string
  subject: string
  notes: string
  date?: string
  time?: string
  bookingId?: string
  durationMinutes?: number
}

/**
 * Intelligent rule-based parser that turns natural tutor observation notes
 * into structured Learning Memory categories (mastered concepts, errors, vocab, next-lesson action plan).
 */
export function analyzeLessonNotes(notes: string, subject = 'General Tutoring', lessonId = `lesson-${Date.now()}`): ObservationAnalysisResult {
  const cleanNotes = notes.trim()
  const lines = cleanNotes.split('\n').map((l) => l.trim()).filter(Boolean)
  const today = new Date().toISOString().split('T')[0]

  const masteredConcepts: string[] = []
  const needsPractice: string[] = []
  const recurringErrors: RecurringError[] = []
  const vocabulary: VocabularyWord[] = []
  const topicsCovered: string[] = []

  // Default subject topic if notes are brief
  let primaryTopic = subject

  // 1. Topic detection
  for (const line of lines) {
    const lower = line.toLowerCase()
    if (lower.startsWith('topic:') || lower.startsWith('subject:') || lower.startsWith('concept:')) {
      const topic = line.replace(/^(topic|subject|concept):\s*/i, '').trim()
      if (topic) {
        primaryTopic = topic
        topicsCovered.push(topic)
      }
    }
  }

  if (topicsCovered.length === 0) {
    topicsCovered.push(primaryTopic)
  }

  // 2. Strengths / Mastered Concept detection
  const strengthKeywords = ['mastered', 'understood', 'good grasp', 'strong foundation', 'accurate', 'excelled', 'fluent', 'positive']
  for (const line of lines) {
    const lower = line.toLowerCase()
    if (strengthKeywords.some((kw) => lower.includes(kw))) {
      const cleaned = line.replace(/^[-\d.*•]\s*/, '').replace(/^(strengths?|mastered|pros?):\s*/i, '').trim()
      if (cleaned.length > 5) {
        masteredConcepts.push(cleaned)
      }
    }
  }

  // 3. Needs Practice / Recurring Errors detection
  const struggleKeywords = ['struggled with', 'difficulty with', 'error', 'mistake', 'confused', 'forgot', 'needs practice', 'weakness', 'mixed up']
  for (const line of lines) {
    const lower = line.toLowerCase()
    if (struggleKeywords.some((kw) => lower.includes(kw))) {
      const cleaned = line.replace(/^[-\d.*•]\s*/, '').replace(/^(needs practice|weaknesses?|errors?|stumbling block):\s*/i, '').trim()
      if (cleaned.length > 5) {
        needsPractice.push(cleaned)

        // Classify category
        let category: SkillKey = 'grammar'
        if (lower.includes('pronounc') || lower.includes('sound') || lower.includes('accent')) {
          category = 'pronunciation'
        } else if (lower.includes('word') || lower.includes('vocab') || lower.includes('term')) {
          category = 'vocabulary'
        } else if (lower.includes('speak') || lower.includes('fluency') || lower.includes('hesitat')) {
          category = 'speaking'
        } else if (lower.includes('listen') || lower.includes('comprehension')) {
          category = 'listening'
        }

        recurringErrors.push({
          id: `err-${Date.now()}-${recurringErrors.length + 1}`,
          pattern: cleaned.length > 40 ? `${cleaned.slice(0, 37)}...` : cleaned,
          example: cleaned,
          category,
          firstSeenLessonId: lessonId,
          lastSeenLessonId: lessonId,
          occurrences: 1,
          status: 'active',
        })
      }
    }
  }

  // 4. Vocabulary / Key Term extraction (quoted phrases or "Term - Definition" patterns)
  const quoteMatches = cleanNotes.match(/["']([^"']{3,35})["']/g)
  if (quoteMatches) {
    for (const match of quoteMatches.slice(0, 4)) {
      const word = match.replace(/["']/g, '').trim()
      // Skip if it looks like a sentence rather than a word or short term
      if (word.split(' ').length <= 4 && !vocabulary.some((v) => v.word.toLowerCase() === word.toLowerCase())) {
        vocabulary.push({
          id: `vocab-${Date.now()}-${vocabulary.length + 1}`,
          word: word.charAt(0).toUpperCase() + word.slice(1),
          definition: `Key terminology reinforced during ${subject} lesson.`,
          exampleSentence: `Context: "${cleanNotes.slice(Math.max(0, cleanNotes.indexOf(word) - 30), Math.min(cleanNotes.length, cleanNotes.indexOf(word) + 70)).trim()}"`,
          mastery: 'learning',
          sourceLessonId: lessonId,
          dateAdded: today,
        })
      }
    }
  }

  // Fallbacks if notes were too brief
  if (masteredConcepts.length === 0) {
    masteredConcepts.push(`Active engagement and participation in ${subject}`)
  }
  if (needsPractice.length === 0) {
    needsPractice.push(`Continued contextual practice on core ${subject} concepts`)
  }

  // 5. Next-Lesson Continuity Action Plan
  const topNeed = needsPractice[0] || 'core concepts'
  const continuityRecommendation =
    `Next Session Focus: Begin with a 5-minute review on "${topNeed}". Reinforce with active application before introducing new material.`

  // 6. Skill deltas
  const skillDeltas: Partial<Record<SkillKey, number>> = {
    grammar: 4,
    vocabulary: vocabulary.length > 0 ? 6 : 3,
    speaking: 5,
  }

  return {
    primaryTopic,
    topicsCovered,
    masteredConcepts,
    needsPractice,
    recurringErrors,
    vocabulary,
    continuityRecommendation,
    skillDeltas,
  }
}

/**
 * Records a lesson observation, runs the Learning Memory Analyzer,
 * and persists the lesson, vocabulary, recurring errors, and progress point to storage.
 */
export function recordLessonObservation(params: RecordObservationParams): {
  lesson: Lesson
  analysis: ObservationAnalysisResult
} {
  const lessonId = `lesson-${Date.now().toString().slice(-6)}`
  const date = params.date || new Date().toISOString().split('T')[0]
  const time = params.time || '10:00'

  const analysis = analyzeLessonNotes(params.notes, params.subject, lessonId)

  const summary: LessonSummary = {
    topicsCovered: analysis.topicsCovered,
    strengths: analysis.masteredConcepts,
    needsPractice: analysis.needsPractice,
    newVocabularyIds: analysis.vocabulary.map((v) => v.id),
    tutorNotes: params.notes,
    aiDraftNotes: analysis.continuityRecommendation,
    notesApproved: true,
    skillDeltas: analysis.skillDeltas,
  }

  const lesson: Lesson = {
    id: lessonId,
    studentId: params.studentId,
    tutorId: params.tutorId,
    title: `${params.subject}: ${analysis.primaryTopic}`,
    date,
    time,
    durationMinutes: params.durationMinutes || 60,
    status: 'completed',
    topics: analysis.topicsCovered,
    summary,
  }

  // 1. Save Lesson
  saveUserLesson(lesson, params.studentId)

  // 2. Save Extracted Vocabulary Words
  analysis.vocabulary.forEach((word) => {
    saveUserVocabulary(word, params.studentId)
  })

  // 3. Save Extracted Recurring Errors
  analysis.recurringErrors.forEach((errorItem) => {
    saveUserRecurringError(errorItem, params.studentId)
  })

  // 4. Record Updated Progress Point
  const previousPoints = getUserProgressPoints(params.studentId)
  const lastSkills: SkillLevels = previousPoints.length > 0
    ? previousPoints[previousPoints.length - 1].skillLevels
    : {
        grammar: 65,
        vocabulary: 60,
        speaking: 58,
        listening: 70,
        pronunciation: 62,
      }

  const updatedSkills: SkillLevels = {
    grammar: Math.min(100, lastSkills.grammar + (analysis.skillDeltas.grammar || 3)),
    vocabulary: Math.min(100, lastSkills.vocabulary + (analysis.skillDeltas.vocabulary || 4)),
    speaking: Math.min(100, lastSkills.speaking + (analysis.skillDeltas.speaking || 4)),
    listening: Math.min(100, lastSkills.listening + (analysis.skillDeltas.listening || 2)),
    pronunciation: Math.min(100, lastSkills.pronunciation + (analysis.skillDeltas.pronunciation || 2)),
  }

  const progressPoint: ProgressPoint = {
    date,
    skillLevels: updatedSkills,
  }
  saveUserProgressPoint(progressPoint, params.studentId)

  return { lesson, analysis }
}

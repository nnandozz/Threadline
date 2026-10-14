import type {
  Tutor,
  Student,
  Lesson,
  HomeworkItem,
  VocabularyWord,
  RecurringError,
  ProgressPoint,
} from '@/types'

// ─────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH
//
// Every screen (Sarah's dashboard, Sarah's progress page, Alex's
// tutor dashboard, Alex's student brief, lesson summaries...)
// reads from this same dataset. This is what makes Threadline's
// "memory" demonstrable rather than decorative: change a value
// here and it is consistent everywhere it appears.
//
// IDs are hand-authored and stable so pages can cross-reference
// each other (e.g. a HomeworkItem.sourceLessonId points at a
// real Lesson.id below).
// ─────────────────────────────────────────────────────────────

export const CURRENT_STUDENT_ID = 'student-sarah'
export const CURRENT_TUTOR_ID = 'tutor-alex'

export const alexMorgan: Tutor = {
  id: CURRENT_TUTOR_ID,
  role: 'tutor',
  name: 'Alex Morgan',
  avatarUrl: 'https://i.pravatar.cc/200?img=13',
  headline: 'Conversational English & Exam Prep Specialist',
  bio: 'I help intermediate learners move from "textbook English" to real, natural conversation. 7 years teaching professionals and exam candidates, with a focus on speaking confidence and grammar that actually sticks.',
  rating: 4.9,
  reviewCount: 214,
  languages: ['English (Native)', 'Spanish (Conversational)'],
  specialties: ['Conversational English', 'Business English', 'IELTS Speaking', 'Grammar Foundations'],
  teachingStyle: 'Structured but relaxed — every lesson builds on what we covered last time, with real conversation over rote drills.',
  pricePerHour: 28,
  yearsExperience: 7,
  availability: [
    { date: '2026-08-11', times: ['09:00', '14:00', '19:00'] },
    { date: '2026-08-12', times: ['10:00', '17:30'] },
    { date: '2026-08-13', times: ['09:00', '13:00', '19:00'] },
  ],
}

// Additional tutors — needed so the marketplace (and any "recommended
// tutors" surface) has more than one real person to draw from. Same shape
// and level of detail as Alex, not placeholders.
export const priyaSharma: Tutor = {
  id: 'tutor-priya',
  role: 'tutor',
  name: 'Priya Sharma',
  avatarUrl: 'https://i.pravatar.cc/200?img=32',
  headline: 'Business English & IELTS Coach',
  bio: 'Former corporate trainer turned English tutor. I specialize in helping professionals sound confident in meetings, interviews, and exams — with a strong focus on precision over memorized phrases.',
  rating: 4.8,
  reviewCount: 156,
  languages: ['English (Native)', 'Hindi (Native)'],
  specialties: ['Business English', 'IELTS Speaking', 'Interview Prep', 'Grammar Foundations'],
  teachingStyle: 'Direct and goal-oriented — we set a target for each lesson and measure progress against it.',
  pricePerHour: 32,
  yearsExperience: 9,
  availability: [
    { date: '2026-08-12', times: ['08:00', '12:00', '18:00'] },
    { date: '2026-08-13', times: ['08:00', '15:00'] },
    { date: '2026-08-14', times: ['08:00', '12:00', '18:00'] },
  ],
}

export const marcusWebb: Tutor = {
  id: 'tutor-marcus',
  role: 'tutor',
  name: 'Marcus Webb',
  avatarUrl: 'https://i.pravatar.cc/200?img=51',
  headline: 'Conversational English & Pronunciation Coach',
  bio: 'I focus on the sounds that trip up learners most — TH, vowel length, word stress — inside real conversation, not isolated drills. Patient, encouraging, and detail-oriented.',
  rating: 4.7,
  reviewCount: 98,
  languages: ['English (Native)', 'French (Conversational)'],
  specialties: ['Pronunciation', 'Conversational English', 'Grammar Foundations'],
  teachingStyle: 'Warm and encouraging, with gentle, specific correction rather than interrupting your flow.',
  pricePerHour: 24,
  yearsExperience: 5,
  availability: [
    { date: '2026-08-11', times: ['16:00', '20:00'] },
    { date: '2026-08-13', times: ['10:00', '16:00', '20:00'] },
  ],
}

export const allTutors: Tutor[] = [alexMorgan, priyaSharma, marcusWebb]

// Vocabulary Sarah has picked up across recent lessons.
export const sarahVocabulary: VocabularyWord[] = [
  {
    id: 'vocab-1',
    word: 'itinerary',
    definition: 'A planned route or schedule for a journey.',
    exampleSentence: 'Our itinerary includes three days in Lisbon before heading south.',
    mastery: 'learning',
    sourceLessonId: 'lesson-aug10',
    dateAdded: '2026-08-10',
  },
  {
    id: 'vocab-2',
    word: 'reservation',
    definition: 'An arrangement to have a table, room, or seat kept for you.',
    exampleSentence: 'I made a reservation for two at seven o\u2019clock.',
    mastery: 'mastered',
    sourceLessonId: 'lesson-aug04',
    dateAdded: '2026-08-04',
  },
  {
    id: 'vocab-3',
    word: 'destination',
    definition: 'The place someone is travelling to.',
    exampleSentence: 'Kyoto has become a popular destination for autumn travel.',
    mastery: 'learning',
    sourceLessonId: 'lesson-aug10',
    dateAdded: '2026-08-10',
  },
  {
    id: 'vocab-4',
    word: 'commute',
    definition: 'To travel regularly between home and work.',
    exampleSentence: 'She commutes forty minutes each way by train.',
    mastery: 'mastered',
    sourceLessonId: 'lesson-jul28',
    dateAdded: '2026-07-28',
  },
  {
    id: 'vocab-5',
    word: 'colleague',
    definition: 'A person you work with.',
    exampleSentence: 'I grabbed lunch with a colleague from the marketing team.',
    mastery: 'mastered',
    sourceLessonId: 'lesson-jul28',
    dateAdded: '2026-07-28',
  },
  {
    id: 'vocab-6',
    word: 'overwhelmed',
    definition: 'Feeling like you have too much to deal with.',
    exampleSentence: 'I felt a bit overwhelmed on my first day at the new job.',
    mastery: 'new',
    sourceLessonId: 'lesson-aug10',
    dateAdded: '2026-08-10',
  },
]

// Sarah's recurring grammar/pronunciation patterns, tracked across lessons.
export const sarahRecurringErrors: RecurringError[] = [
  {
    id: 'error-present-perfect',
    pattern: 'Present perfect tense',
    example: '"I have went to the store yesterday."',
    category: 'grammar',
    firstSeenLessonId: 'lesson-jul28',
    lastSeenLessonId: 'lesson-aug10',
    occurrences: 6,
    status: 'improving',
  },
  {
    id: 'error-articles',
    pattern: 'Article usage (a / an / the)',
    example: '"I went to store to buy a bread."',
    category: 'grammar',
    firstSeenLessonId: 'lesson-aug04',
    lastSeenLessonId: 'lesson-aug10',
    occurrences: 4,
    status: 'active',
  },
  {
    id: 'error-th-sound',
    pattern: 'TH pronunciation',
    example: '"tink" instead of "think"',
    category: 'pronunciation',
    firstSeenLessonId: 'lesson-jul28',
    lastSeenLessonId: 'lesson-aug10',
    occurrences: 4,
    status: 'active',
  },
]

// Skill trend snapshots over time — powers the Progress dashboard.
// Each point is mathematically derived from the previous point plus that
// lesson's skillDeltas (see `lessons` below) — a skill omitted from a
// lesson's skillDeltas is unchanged from the prior point. This is what
// makes the flagship demo moment (present perfect / grammar 62% → 74%
// between the Aug 7 and Aug 10 lessons) a provable fact of the dataset,
// not just a narrative claim.
export const sarahProgressHistory: ProgressPoint[] = [
  { date: '2026-07-14', skillLevels: { grammar: 55, vocabulary: 61, speaking: 53, listening: 75, pronunciation: 54 } },
  { date: '2026-07-21', skillLevels: { grammar: 59, vocabulary: 66, speaking: 56, listening: 78, pronunciation: 55 } },
  { date: '2026-07-28', skillLevels: { grammar: 62, vocabulary: 66, speaking: 60, listening: 78, pronunciation: 55 } },
  { date: '2026-08-04', skillLevels: { grammar: 62, vocabulary: 71, speaking: 60, listening: 81, pronunciation: 55 } },
  { date: '2026-08-07', skillLevels: { grammar: 62, vocabulary: 74, speaking: 63, listening: 81, pronunciation: 55 } },
  { date: '2026-08-10', skillLevels: { grammar: 74, vocabulary: 77, speaking: 65, listening: 81, pronunciation: 55 } },
]

export const lessons: Lesson[] = [
  {
    id: 'lesson-jul28',
    studentId: CURRENT_STUDENT_ID,
    tutorId: CURRENT_TUTOR_ID,
    title: 'Daily Conversation',
    date: '2026-07-28',
    time: '19:00',
    durationMinutes: 30,
    status: 'completed',
    topics: ['Present tense', 'Hobbies', 'Talking about routines'],
    summary: {
      topicsCovered: ['Daily routines', 'Present simple vs. present continuous', 'Hobbies vocabulary'],
      strengths: ['Confident with present simple', 'Strong hobby-related vocabulary'],
      needsPractice: ['Present perfect tense', 'TH pronunciation'],
      newVocabularyIds: ['vocab-5', 'vocab-4'],
      tutorNotes: 'Sarah communicates clearly about routine topics. Starting to introduce present perfect next lesson since she reached for past simple where perfect was needed a few times.',
      aiDraftNotes: 'Student showed strong command of present simple constructions and routine vocabulary. Present perfect tense appeared as an area to introduce gradually. TH sounds in "think" and "three" showed some difficulty.',
      notesApproved: true,
      skillDeltas: { grammar: 3, speaking: 4 },
    },
  },
  {
    id: 'lesson-aug04',
    studentId: CURRENT_STUDENT_ID,
    tutorId: CURRENT_TUTOR_ID,
    title: 'Restaurant Conversation',
    date: '2026-08-04',
    time: '19:00',
    durationMinutes: 30,
    status: 'completed',
    topics: ['Food vocabulary', 'Ordering food', 'Making reservations'],
    summary: {
      topicsCovered: ['Ordering at a restaurant', 'Making a reservation', 'Food vocabulary'],
      strengths: ['Picked up reservation vocabulary quickly', 'Good listening comprehension'],
      needsPractice: ['Article usage', 'Present perfect tense'],
      newVocabularyIds: ['vocab-2'],
      tutorNotes: 'Great engagement today — picked up "reservation" quickly and used it unprompted by the end. Article mistakes ("a bread", "the lunch") are becoming the more pressing pattern.',
      aiDraftNotes: 'Vocabulary retention for food and dining terms was strong. Article usage (a/an/the) surfaced as a recurring pattern across several sentences. Present perfect tense continues to appear as an area for continued practice.',
      notesApproved: true,
      skillDeltas: { vocabulary: 5, listening: 3 },
    },
  },
  {
    id: 'lesson-aug07',
    studentId: CURRENT_STUDENT_ID,
    tutorId: CURRENT_TUTOR_ID,
    title: 'Restaurant Conversation',
    date: '2026-08-07',
    time: '19:00',
    durationMinutes: 30,
    status: 'completed',
    topics: ['Food vocabulary', 'Ordering food'],
    summary: {
      topicsCovered: ['Restaurant role-play', 'Ordering food', 'Polite requests'],
      strengths: ['Natural use of polite request forms', 'Reservation vocabulary now solid'],
      needsPractice: ['Present perfect tense', 'TH pronunciation'],
      newVocabularyIds: [],
      tutorNotes: '"Reservation" is fully mastered now — used it correctly three times without prompting. Present perfect is still the main gap heading into next lesson.',
      aiDraftNotes: 'Reservation-related vocabulary from the previous lesson was recalled and used correctly without prompting. Present perfect tense remains an observed area for continued focus.',
      notesApproved: true,
      skillDeltas: { vocabulary: 3, speaking: 3 },
    },
  },
  {
    id: 'lesson-aug10',
    studentId: CURRENT_STUDENT_ID,
    tutorId: CURRENT_TUTOR_ID,
    title: 'Travel Conversations',
    date: '2026-08-10',
    time: '19:00',
    durationMinutes: 30,
    status: 'completed',
    topics: ['Travel vocabulary', 'Past experiences', 'Present perfect'],
    summary: {
      topicsCovered: ['Travel vocabulary', 'Talking about past trips', 'Present perfect practice'],
      strengths: ['Vocabulary recall', 'Conversational confidence when talking about travel'],
      needsPractice: ['Present perfect', 'Articles', 'TH pronunciation'],
      newVocabularyIds: ['vocab-1', 'vocab-3', 'vocab-6'],
      tutorNotes: 'Noticeable improvement on present perfect today compared to two weeks ago — fewer slips into past simple when describing life experiences. Keep reinforcing with storytelling practice.',
      aiDraftNotes: 'Present perfect usage showed a marked improvement over the previous two lessons when describing past travel experiences. Article usage and TH pronunciation remain observed practice areas. Three new travel-related vocabulary items were introduced.',
      notesApproved: true,
      skillDeltas: { grammar: 12, vocabulary: 3, speaking: 2 },
    },
  },
  {
    id: 'lesson-aug14',
    studentId: CURRENT_STUDENT_ID,
    tutorId: CURRENT_TUTOR_ID,
    title: 'English Conversation',
    date: '2026-08-14',
    time: '19:00',
    durationMinutes: 30,
    status: 'upcoming',
    topics: ['Present perfect practice', 'Travel storytelling'],
  },
]

export const homeworkItems: HomeworkItem[] = [
  {
    id: 'hw-1',
    studentId: CURRENT_STUDENT_ID,
    sourceLessonId: 'lesson-aug10',
    type: 'grammar',
    title: 'Present Perfect Practice',
    description: 'Speak for 10 minutes about three things you have done this year, focusing on present perfect forms.',
    durationMinutes: 10,
    completed: true,
    dateAssigned: '2026-08-10',
    dueDate: '2026-08-14', // date of lesson-aug14, the next lesson after this one was assigned
  },
  {
    id: 'hw-2',
    studentId: CURRENT_STUDENT_ID,
    sourceLessonId: 'lesson-aug10',
    type: 'vocabulary',
    title: 'Travel Vocabulary Review',
    description: 'Review and use this lesson\u2019s 3 new travel words in original sentences.',
    durationMinutes: 8,
    completed: true,
    dateAssigned: '2026-08-10',
    dueDate: '2026-08-14',
  },
  {
    id: 'hw-3',
    studentId: CURRENT_STUDENT_ID,
    sourceLessonId: 'lesson-aug10',
    type: 'speaking',
    title: 'Tell a Story About Your Last Trip',
    description: 'Record yourself talking for 5 minutes about your most recent trip, using present perfect where it fits naturally.',
    durationMinutes: 5,
    completed: false,
    dateAssigned: '2026-08-10',
    dueDate: '2026-08-14',
  },
  {
    id: 'hw-4',
    studentId: CURRENT_STUDENT_ID,
    sourceLessonId: 'lesson-aug07',
    type: 'flashcards',
    title: 'Review Words You Hesitated On',
    description: 'Quick flashcard review of vocabulary you paused on during the restaurant conversation lesson.',
    durationMinutes: 6,
    completed: true,
    dateAssigned: '2026-08-07',
    dueDate: '2026-08-10', // date of lesson-aug10, the next lesson after this one was assigned
  },
  {
    id: 'hw-5',
    studentId: CURRENT_STUDENT_ID,
    sourceLessonId: 'lesson-aug04',
    type: 'grammar',
    title: 'Article Usage Drill',
    description: 'Short exercise practicing a / an / the in everyday sentences.',
    durationMinutes: 8,
    completed: true,
    dateAssigned: '2026-08-04',
    dueDate: '2026-08-07', // date of lesson-aug07, the next lesson after this one was assigned
  },
]

export const sarahThompson: Student = {
  id: CURRENT_STUDENT_ID,
  role: 'student',
  name: 'Sarah Thompson',
  avatarUrl: 'https://i.pravatar.cc/200?img=47',
  targetLanguage: 'English',
  level: 'Intermediate',
  goal: 'Speak confidently in work meetings and while travelling',
  tutorId: CURRENT_TUTOR_ID,
  // Must always equal the last entry in sarahProgressHistory — this is
  // Sarah's "right now" state, and the two must never diverge.
  skillLevels: { grammar: 74, vocabulary: 77, speaking: 65, listening: 81, pronunciation: 55 },
  totalVocabularyLearned: 432,
  currentStreakDays: 6,
  masteredConcepts: ['Basic travel vocabulary', 'Present tense', 'Restaurant phrases', 'Making reservations'],
  needsPractice: ['Present perfect', 'Articles (a / an / the)', 'TH pronunciation'],
  recurringErrors: sarahRecurringErrors,
  vocabulary: sarahVocabulary,
  progressHistory: sarahProgressHistory,
}

// Convenience export: homework generated from Sarah's most recent completed lesson.
export const latestLesson = lessons
  .filter((l) => l.status === 'completed')
  .sort((a, b) => (a.date < b.date ? 1 : -1))[0]

export const upcomingLesson = lessons.find((l) => l.status === 'upcoming')

// Derived, not hardcoded — always reflects the real homeworkItems array above.
export const homeworkCompletion = {
  completed: homeworkItems.filter((h) => h.completed).length,
  total: homeworkItems.length,
}

// A simple, honest recommendation: other tutors who teach the student's
// target language, excluding the tutor she already has. No fabricated
// "match score" — just a real filter over real fields.
export const recommendedTutorsForSarah = allTutors.filter(
  (tutor) =>
    tutor.id !== sarahThompson.tutorId &&
    tutor.languages.some((lang) => lang.toLowerCase().startsWith(sarahThompson.targetLanguage.toLowerCase())),
)

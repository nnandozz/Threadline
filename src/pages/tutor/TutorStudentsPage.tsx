import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Users,
  Calendar,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Brain,
  Compass,
  ArrowRight,
  Clock,
  Loader2,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button, buttonClasses } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { useAuth } from '@/context/AuthContext'
import { fetchUserBookings } from '@/lib/bookingService'
import { getBookings } from '@/lib/marketplaceStore'
import {
  getUserLessons,
  getUserRecurringErrors,
  getUserVocabulary,
} from '@/lib/userDataStore'
import {
  recordLessonObservation,
  type ObservationAnalysisResult,
} from '@/lib/learningMemory'
import { formatLessonDateLabel } from '@/lib/utils'
import type { Booking, Lesson, RecurringError, VocabularyWord } from '@/types'

const TEMPLATES = {
  english: `Topic: Present Perfect vs. Past Simple Distinction
Strengths: Accurately constructed irregular past participles (e.g., "spoken", "written"). Strong conversational engagement.
Needs practice: Struggled with time prepositions ("since 2021" vs "for 3 years"). Tends to mix past simple with present perfect in storytelling.
Key terms: "Prerequisite", "Colloquialism", "Nuance"`,
  stem: `Topic: Differential Calculus & Chain Rule Applications
Strengths: Mastered power rule and polynomial derivatives. Good conceptual grasp of instantaneous velocity.
Needs practice: Frequent sign errors during composite trigonometric differentiation. Needs practice with chain rule multi-layer substitution.
Key terms: "Derivative", "Instantaneous rate", "Composite function"`,
  general: `Topic: Core Concept Review & Practical Application
Strengths: Understood fundamental principles and demonstrated clear logical reasoning.
Needs practice: Struggled with structured problem pacing and complex application under time constraints.
Key terms: "Hypothesis", "Systematic approach"`,
}

export function TutorStudentsPage() {
  const { studentId: paramStudentId } = useParams<{ studentId: string }>()
  const { user } = useAuth()
  const tutorId = user?.id || ''

  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string>(paramStudentId || '')
  const [observationNotes, setObservationNotes] = useState(TEMPLATES.english)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [latestAnalysis, setLatestAnalysis] = useState<ObservationAnalysisResult | null>(null)
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false)

  // Student specific memory data
  const [studentLessons, setStudentLessons] = useState<Lesson[]>([])
  const [studentErrors, setStudentErrors] = useState<RecurringError[]>([])
  const [studentVocab, setStudentVocab] = useState<VocabularyWord[]>([])

  const reloadData = useCallback(async () => {
    if (!tutorId) return
    const { bookings: fetched } = await fetchUserBookings(tutorId, 'tutor')
    const effective = fetched.length > 0 ? fetched : getBookings(tutorId)
    setBookings(effective)

    if (effective.length > 0) {
      setSelectedStudentId((prev) => (prev && effective.some((b) => b.studentId === prev) ? prev : effective[0].studentId))
    }
  }, [tutorId])

  useEffect(() => {
    reloadData()
    window.addEventListener('threadline_store_updated', reloadData)
    window.addEventListener('threadline_user_data_updated', reloadData)
    return () => {
      window.removeEventListener('threadline_store_updated', reloadData)
      window.removeEventListener('threadline_user_data_updated', reloadData)
    }
  }, [reloadData])

  // Derive unique student records from real bookings
  const students = Array.from(new Set(bookings.map((b) => b.studentId))).map((sid) => {
    const studentBookings = bookings.filter((b) => b.studentId === sid)
    const latest = studentBookings[0]
    return {
      id: sid,
      name: latest?.studentName || `Student #${sid.slice(-4)}`,
      subject: latest?.subject || 'Tutoring',
      bookingsCount: studentBookings.length,
      nextSession: latest ? `${formatLessonDateLabel(latest.date, latest.time)} (${latest.format})` : 'Pending',
    }
  })

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0]
  const activeStudentId = activeStudent?.id

  // Reload memory for active student
  useEffect(() => {
    if (!activeStudentId) return
    setStudentLessons(getUserLessons(activeStudentId))
    setStudentErrors(getUserRecurringErrors(activeStudentId))
    setStudentVocab(getUserVocabulary(activeStudentId))
    setLatestAnalysis(null)
  }, [activeStudentId])

  async function handleAnalyzeAndSaveObservation() {
    if (!activeStudent || !observationNotes.trim()) return

    setIsAnalyzing(true)
    setSaveSuccessNotice(false)

    // Simulate realistic AI cognitive processing
    await new Promise((resolve) => setTimeout(resolve, 600))

    const { analysis } = recordLessonObservation({
      studentId: activeStudent.id,
      tutorId,
      tutorName: user?.name,
      subject: activeStudent.subject,
      notes: observationNotes,
    })

    setLatestAnalysis(analysis)
    setStudentLessons(getUserLessons(activeStudent.id))
    setStudentErrors(getUserRecurringErrors(activeStudent.id))
    setStudentVocab(getUserVocabulary(activeStudent.id))
    setIsAnalyzing(false)
    setSaveSuccessNotice(true)
  }

  // Find latest next-lesson recommendation
  const latestLessonWithAi = studentLessons.find((l) => l.summary?.aiDraftNotes)
  const activeNextRecommendation = latestLessonWithAi?.summary?.aiDraftNotes ||
    'Schedule your next session to generate tailored continuity notes.'

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles size={14} />
          <span>AI Learning Continuity System</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Student Dossiers & Continuity Memory
        </h1>
        <p className="max-w-3xl text-sm text-slate-500">
          Threadline remembers what each student understands, where they stumble, and what should be reinforced next—enabling every tutor to pick up seamlessly where the last lesson left off.
        </p>
      </div>

      {students.length > 0 && activeStudent ? (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Student Roster (4 cols) */}
          <div className="flex flex-col gap-3 lg:col-span-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
              Active Students ({students.length})
            </h2>

            <div className="flex flex-col gap-2">
              {students.map((st) => {
                const isSelected = st.id === activeStudent.id

                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStudentId(st.id)}
                    className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-white shadow-xs ring-2 ring-indigo-600/10'
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
                    }`}
                  >
                    <Avatar name={st.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-sm truncate">{st.name}</span>
                        <Badge tone="accent">{st.bookingsCount} booked</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{st.subject}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Calendar size={12} />
                        <span className="truncate">{st.nextSession}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Column: AI Continuity Dossier & Note-Taker (8 cols) */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            {/* Student Header Summary */}
            <Card className="p-6">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <Avatar name={activeStudent.name} size="lg" className="h-14 w-14" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{activeStudent.name}</h3>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        Active Learner
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Focus: {activeStudent.subject} · {studentLessons.length} completed sessions recorded</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link to="/tutor/schedule" className={buttonClasses('primary', 'sm')}>
                    Schedule Session
                  </Link>
                </div>
              </div>

              {/* AI Next-Lesson Action Plan Card */}
              <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                  <Brain size={15} />
                  <span>AI Continuity Brief (For Upcoming Tutor)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {activeNextRecommendation}
                </p>
              </div>

              {/* Persistent Weaknesses & Mastered Concepts Strip */}
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Needs Practice / Weaknesses */}
                <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 mb-2">
                    <AlertCircle size={14} />
                    <span>Active Weaknesses ({studentErrors.length})</span>
                  </div>
                  {studentErrors.length > 0 ? (
                    <ul className="flex flex-col gap-1.5">
                      {studentErrors.slice(0, 4).map((err) => (
                        <li key={err.id} className="text-xs text-slate-700 flex items-start gap-1.5">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                          <span>
                            <strong className="text-slate-900 capitalize">{err.category}:</strong> {err.pattern}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No recurring errors flagged yet. Record a lesson note below to generate diagnostic tags.</p>
                  )}
                </div>

                {/* Vocabulary Bank */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
                    <CheckCircle2 size={14} />
                    <span>Vocabulary & Concepts ({studentVocab.length})</span>
                  </div>
                  {studentVocab.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {studentVocab.slice(0, 6).map((v) => (
                        <span key={v.id} className="rounded-md bg-white border border-emerald-200 px-2 py-0.5 text-xs font-medium text-emerald-800 shadow-2xs">
                          {v.word}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No vocabulary terms logged yet. Highlight words in quotes in your observation notes.</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Observation Note-Taker & AI Memory Analyzer Form */}
            <Card className="p-6">
              <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-primary" size={18} />
                    <h3 className="text-base font-bold text-slate-900">
                      Record Lesson Observations & AI Memory
                    </h3>
                  </div>
                  {saveSuccessNotice && (
                    <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 animate-pulse">
                      ✓ Analyzed & Persisted to Memory
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Write teaching observations or paste session takeaways. Threadline extracts mastered concepts, recurring difficulties, and next-lesson recommendations automatically.
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => setObservationNotes(TEMPLATES.english)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  English Grammar & Speaking
                </button>
                <button
                  type="button"
                  onClick={() => setObservationNotes(TEMPLATES.stem)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Math & Calculus
                </button>
                <button
                  type="button"
                  onClick={() => setObservationNotes(TEMPLATES.general)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  General Concept Review
                </button>
              </div>

              {/* Textarea */}
              <div className="mt-3">
                <Textarea
                  rows={6}
                  value={observationNotes}
                  onChange={(e) => setObservationNotes(e.target.value)}
                  placeholder="Record your observations here... Example:
Topic: Quadratic equations
Strengths: Mastered factoring method.
Needs practice: Struggled with negative discriminant cases.
Key terms: 'Discriminant', 'Complex root'"
                  className="font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-[11px] text-slate-400">
                  Notes are structured into skills, vocabulary, and persistent learning history.
                </p>
                <Button
                  size="md"
                  variant="primary"
                  onClick={handleAnalyzeAndSaveObservation}
                  disabled={isAnalyzing || !observationNotes.trim()}
                  className="gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Analyzing Continuity Memory...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Analyze & Save to Learning Memory
                    </>
                  )}
                </Button>
              </div>

              {/* Live AI Analysis Result Display */}
              {latestAnalysis && (
                <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50/50 p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      AI Learning Memory Analysis Result
                    </span>
                    <Badge tone="accent">Processed Just Now</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Mastered Concepts</span>
                      <ul className="mt-1 flex flex-col gap-1">
                        {latestAnalysis.masteredConcepts.map((item, idx) => (
                          <li key={idx} className="text-xs text-slate-800 flex items-start gap-1">
                            <span className="text-emerald-600 font-bold">✓</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Identified Weaknesses</span>
                      <ul className="mt-1 flex flex-col gap-1">
                        {latestAnalysis.needsPractice.map((item, idx) => (
                          <li key={idx} className="text-xs text-slate-800 flex items-start gap-1">
                            <span className="text-rose-500 font-bold">!</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {latestAnalysis.vocabulary.length > 0 && (
                    <div className="border-t border-indigo-100 pt-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Extracted Vocabulary</span>
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        {latestAnalysis.vocabulary.map((vocab) => (
                          <span key={vocab.id} className="rounded-lg bg-white border border-indigo-200 px-2.5 py-1 text-xs font-semibold text-slate-800">
                            {vocab.word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-indigo-100 pt-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Generated Next-Lesson Recommendation</span>
                    <p className="mt-1 text-xs text-slate-800 font-medium bg-white p-3 rounded-lg border border-indigo-100">
                      {latestAnalysis.continuityRecommendation}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Past Lesson Memory History */}
            {studentLessons.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                  <Clock size={16} className="text-slate-500" />
                  <h3 className="text-base font-bold text-slate-900">
                    Recorded Sessions & Summaries ({studentLessons.length})
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  {studentLessons.map((les) => (
                    <div key={les.id} className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{les.title}</span>
                        <span className="text-xs text-slate-400">{les.date}</span>
                      </div>
                      {les.summary && (
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {les.summary.tutorNotes}
                        </p>
                      )}
                      <Link
                        to={`/lesson/${les.id}/summary`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline self-start mt-1"
                      >
                        View Full AI Lesson Summary <ArrowRight size={13} />
                      </Link>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-3">
            <Users size={22} />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No active students yet</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
            When students book your lessons or enroll in your courses, their profiles, goals, and learning continuity dossiers will appear here.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <Link to="/tutor/services" className={buttonClasses('secondary', 'sm')}>
              <Compass size={14} />
              Set Your Rates
            </Link>
            <Link to="/tutor/schedule" className={buttonClasses('primary', 'sm')}>
              <Calendar size={14} />
              Add Availability
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

import { useParams, Link } from 'react-router-dom'
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowLeft,
  BookMarked,
  ShieldCheck,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { buttonClasses } from '@/components/ui/Button'
import { FormatBadge } from '@/components/ui/FormatBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/context/AuthContext'
import { getUserLessons, getUserVocabulary } from '@/lib/userDataStore'
import { getTutorById } from '@/lib/marketplaceStore'
import {
  lessons,
  allTutors,
  sarahVocabulary,
  homeworkItems,
} from '@/data/mockData'
import { formatShortDate } from '@/lib/utils'

export function LessonSummaryPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const { user } = useAuth()

  const userLessons = getUserLessons(user?.id)
  const lesson = userLessons.find((l) => l.id === lessonId) || lessons.find((l) => l.id === lessonId) || lessons[3]
  const tutor = (lesson ? getTutorById(lesson.tutorId) : undefined) || allTutors.find((t) => t.id === lesson?.tutorId) || allTutors[0]

  if (!lesson || !lesson.summary) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          title="Lesson summary not found"
          description="This session may not have taken place yet or does not have recorded notes."
          action={
            <Link to="/lessons" className={buttonClasses('primary', 'md')}>
              Back to My Learning
            </Link>
          }
        />
      </div>
    )
  }

  const { summary } = lesson
  const userVocab = getUserVocabulary(user?.id)
  const combinedVocab = [...userVocab, ...sarahVocabulary]
  const newVocab = combinedVocab.filter((v) => summary.newVocabularyIds.includes(v.id))
  const lessonHomework = homeworkItems.filter((h) => h.sourceLessonId === lesson.id)

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-8 pb-12">
      {/* Header Breadcrumb */}
      <div>
        <Link to="/lessons" className="inline-flex items-center gap-1.5 text-small font-medium text-ink-secondary hover:text-ink mb-4">
          <ArrowLeft size={16} />
          Back to Sessions
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-label uppercase tracking-wider text-primary font-bold">
                AI Lesson Memory Summary
              </span>
              {lesson.format && <FormatBadge format={lesson.format} />}
            </div>
            <h1 className="text-h1 text-ink">{lesson.title}</h1>
            <p className="text-body text-ink-secondary">
              Session conducted on {formatShortDate(lesson.date)} · Duration: {lesson.durationMinutes} minutes
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-3 shadow-sm">
            <Avatar src={tutor.avatarUrl} name={tutor.name} size="md" />
            <div>
              <p className="text-small font-bold text-ink">{tutor.name}</p>
              <p className="text-label text-ink-secondary">{tutor.headline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flagship Skill Impact Callout */}
      {summary.skillDeltas && Object.keys(summary.skillDeltas).length > 0 && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
          <div className="flex items-center gap-2 text-primary font-semibold text-small mb-2">
            <Sparkles size={16} />
            Continuity Tracker: Measured Skill Progress
          </div>
          <div className="flex flex-wrap gap-6">
            {Object.entries(summary.skillDeltas).map(([skill, delta]) => (
              <div key={skill} className="flex items-baseline gap-2">
                <span className="text-body font-semibold capitalize text-ink">{skill}:</span>
                <span className="text-h3 font-bold text-primary">+{delta}%</span>
                <span className="text-label text-ink-secondary">(Integrated into Threadline Profile)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Strengths, Areas for Practice, Topics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Strengths & Concepts Mastered */}
        <Card className="flex flex-col gap-4 border-t-4 border-t-success p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-success" />
            <h2 className="text-h3 text-ink">Observed Strengths & Mastery</h2>
          </div>
          <ul className="flex flex-col gap-2.5">
            {summary.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2 text-small text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-success mt-2 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Needs Practice */}
        <Card className="flex flex-col gap-4 border-t-4 border-t-warning p-6">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-warning" />
            <h2 className="text-h3 text-ink">Areas for Reinforcement</h2>
          </div>
          <ul className="flex flex-col gap-2.5">
            {summary.needsPractice.map((gap, i) => (
              <li key={i} className="flex items-start gap-2 text-small text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-warning mt-2 shrink-0" />
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Tutor Notes & AI Draft Notes */}
      <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8">
        <h2 className="text-h3 text-ink mb-4">Instructor Feedback & AI Synthesis</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Approved Tutor Notes */}
          <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-small font-bold text-ink">Tutor's Direct Feedback</span>
              <Badge tone="success">Approved</Badge>
            </div>
            <p className="mt-2 text-small text-ink-secondary leading-relaxed">
              "{summary.tutorNotes}"
            </p>
          </div>

          {/* AI Assisted Analysis */}
          <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-small font-bold text-ink">
                <Sparkles size={14} className="text-accent-hover" />
                AI Context Draft
              </span>
              <span className="text-label text-ink-secondary">(Consensual Demo AI)</span>
            </div>
            <p className="mt-2 text-small text-ink-secondary leading-relaxed">
              {summary.aiDraftNotes}
            </p>
          </div>
        </div>
      </section>

      {/* Vocabulary Added */}
      {newVocab.length > 0 && (
        <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <BookMarked size={20} className="text-primary" />
            <h2 className="text-h3 text-ink">New Concepts & Vocabulary Added ({newVocab.length})</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {newVocab.map((w) => (
              <div key={w.id} className="rounded-xl border border-border p-4 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-body font-bold text-ink">{w.word}</h3>
                  <Badge tone={w.mastery === 'mastered' ? 'success' : 'accent'}>{w.mastery}</Badge>
                </div>
                <p className="mt-1 text-small text-ink-secondary">{w.definition}</p>
                <p className="mt-2 text-label italic text-ink-secondary border-t border-border pt-2">
                  "{w.exampleSentence}"
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Associated Homework */}
      {lessonHomework.length > 0 && (
        <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-primary" />
              <h2 className="text-h3 text-ink">Practice Assigned From This Session</h2>
            </div>
            <Link to="/homework" className="text-small font-medium text-primary hover:text-primary-hover">
              Go to Homework Hub
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {lessonHomework.map((hw) => (
              <div key={hw.id} className="flex flex-col justify-between rounded-xl border border-border p-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-label uppercase tracking-wider font-semibold text-primary">
                      {hw.type} · {hw.durationMinutes} mins
                    </span>
                    {hw.completed ? (
                      <Badge tone="success">Completed</Badge>
                    ) : (
                      <Badge tone="warning">Pending</Badge>
                    )}
                  </div>
                  <h4 className="text-body font-semibold text-ink">{hw.title}</h4>
                  <p className="text-small text-ink-secondary mt-1">{hw.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Continuity Privacy Safeguard note */}
      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-small text-ink-secondary border border-border">
        <ShieldCheck size={18} className="shrink-0 text-primary mt-0.5" />
        <span>
          <strong>Learning Continuity Guarantee:</strong> This session's mastered concepts and focus areas are stored in your Threadline Learning Record. You can choose whether to share this history with future tutors under <Link to="/settings" className="text-primary underline">Settings</Link>.
        </span>
      </div>
    </div>
  )
}

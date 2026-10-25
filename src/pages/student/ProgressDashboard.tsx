import { Link } from 'react-router-dom'
import {
  Sparkles,
  Brain,
  ShieldCheck,
  Compass,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { buttonClasses } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import {
  getUserProgressPoints,
  getUserRecurringErrors,
  getUserVocabulary,
  getUserLessons,
} from '@/lib/userDataStore'

const SKILL_KEYS = ['grammar', 'vocabulary', 'speaking', 'listening', 'pronunciation'] as const

export function ProgressDashboard() {
  const { user } = useAuth()
  const studentId = user?.id || ''

  const progressHistory = getUserProgressPoints(studentId)
  const recurringErrors = getUserRecurringErrors(studentId)
  const vocabulary = getUserVocabulary(studentId)
  const completedLessons = getUserLessons(studentId).filter((l) => l.status === 'completed')

  const hasHistory = progressHistory.length > 0 || completedLessons.length > 0

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-2 border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles size={13} />
          <span>Continuous Context</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Learning Progress & Skill Continuity
        </h1>
        <p className="max-w-2xl text-sm text-slate-500">
          Threadline's AI Learning Memory tracks your trajectory across every lesson and tutor,
          ensuring past gains are reinforced rather than re-taught from scratch.
        </p>
      </div>

      {/* Overview Metrics Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500">Completed Lessons</span>
          <span className="text-xl font-bold text-slate-900">{completedLessons.length}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500">Active Learning Streak</span>
          <span className="text-xl font-bold text-slate-900">
            {completedLessons.length > 0 ? '1 day' : '0 days'}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500">Vocabulary & Terms</span>
          <span className="text-xl font-bold text-slate-900">{vocabulary.length}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500">Active Error Patterns</span>
          <span className="text-xl font-bold text-slate-900">{recurringErrors.length}</span>
        </div>
      </div>

      {hasHistory ? (
        /* Real Progress View when student has completed lessons */
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-slate-900">Skill Competency Trajectory</h3>
            <p className="text-xs text-slate-500 mt-1">Calculated from completed lesson analyses.</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-4">
              {SKILL_KEYS.map((key) => (
                <div key={key} className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50">
                  <span className="text-xs font-semibold capitalize text-slate-700">{key}</span>
                  <span className="text-lg font-bold text-slate-900">Active</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        /* Clean Onboarding State for new accounts */
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-xs mb-3">
                <Brain size={14} />
                <span>Learning Memory Ready</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Your skill analytics will generate after your first lesson
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                As you complete lessons on Threadline, verified educator notes and consensual session transcripts
                automatically populate your skill trajectories, vocabulary retention rate, and persistent mistake patterns.
              </p>
            </div>

            <Link to="/tutors" className={buttonClasses('primary', 'lg', 'shrink-0')}>
              <Compass size={16} />
              Book Your First Lesson
            </Link>
          </div>

          {/* Skill Framework Preview */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900">Tracked Learning Dimensions</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Threadline's continuity system actively measures progress across five key core capabilities:
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-4">
              {SKILL_KEYS.map((key) => (
                <div key={key} className="flex flex-col gap-1.5 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{key}</span>
                  <p className="text-xs text-slate-600">Continuous diagnostic monitoring</p>
                  <span className="text-[11px] font-medium text-slate-400 mt-2">Awaiting baseline lesson</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Guarantee */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs text-xs text-slate-600">
        <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
        <span>
          <strong>Privacy-Protected Context:</strong> Your learning progress, mistake history, and vocabulary data are private to your account.
          They are only shared with tutors you book lessons with to ensure continuity.
        </span>
      </div>
    </div>
  )
}

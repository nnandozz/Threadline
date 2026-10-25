import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Users,
  Calendar,
  FileText,
  Save,
  Compass,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button, buttonClasses } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { useAuth } from '@/context/AuthContext'
import { getBookings } from '@/lib/marketplaceStore'
import { formatLessonDateLabel } from '@/lib/utils'

export function TutorStudentsPage() {
  const { studentId: paramStudentId } = useParams<{ studentId: string }>()
  const { user } = useAuth()
  const tutorId = user?.id || ''

  const [bookings, setBookings] = useState(() => getBookings(tutorId))
  const [selectedStudentId, setSelectedStudentId] = useState<string>(paramStudentId || '')
  const [privateTutorNotes, setPrivateTutorNotes] = useState('')
  const [savedNotesNotice, setSavedNotesNotice] = useState(false)

  useEffect(() => {
    if (!tutorId) return
    const b = getBookings(tutorId)
    setBookings(b)
    if (!selectedStudentId && b.length > 0) {
      setSelectedStudentId(b[0].studentId)
    }
  }, [tutorId, selectedStudentId])

  // Derive unique student records from real bookings
  const students = Array.from(new Set(bookings.map((b) => b.studentId))).map((sid) => {
    const studentBookings = bookings.filter((b) => b.studentId === sid)
    const latest = studentBookings[0]
    return {
      id: sid,
      name: `Student #${sid.slice(-4)}`,
      subject: latest?.subject || 'Tutoring',
      bookingsCount: studentBookings.length,
      nextSession: latest ? `${formatLessonDateLabel(latest.date, latest.time)} (${latest.format})` : 'Pending',
    }
  })

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0]

  function handleSaveNotes() {
    setSavedNotesNotice(true)
    setTimeout(() => setSavedNotesNotice(false), 2500)
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-slate-200/80 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Student Dossiers & Learning Context
        </h1>
        <p className="text-sm text-slate-500">
          Review active students, upcoming agendas, and continuous lesson notes before your scheduled sessions.
        </p>
      </div>

      {students.length > 0 && activeStudent ? (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Roster Column (4 cols) */}
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
                        ? 'border-indigo-600 bg-white shadow-xs'
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
                    }`}
                  >
                    <Avatar name={st.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-sm">{st.name}</span>
                        <Badge tone="neutral">{st.bookingsCount} sessions</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{st.subject}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Calendar size={12} />
                        <span>{st.nextSession}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Dossier Column (8 cols) */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            {/* Student Header Card */}
            <Card className="p-6">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <Avatar name={activeStudent.name} size="lg" className="h-14 w-14" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{activeStudent.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Focus: {activeStudent.subject}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link to="/tutor/messages" className={buttonClasses('secondary', 'sm')}>
                    Open Chat
                  </Link>
                  <Link to="/tutor/schedule" className={buttonClasses('primary', 'sm')}>
                    Schedule Lesson
                  </Link>
                </div>
              </div>

              {/* Private Educator Notes */}
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700">
                    <FileText size={14} />
                    <span>Private Educator Notes (Only visible to you)</span>
                  </div>
                  {savedNotesNotice && (
                    <span className="text-xs font-medium text-emerald-600">Saved successfully</span>
                  )}
                </div>

                <Textarea
                  rows={4}
                  value={privateTutorNotes}
                  onChange={(e) => setPrivateTutorNotes(e.target.value)}
                  placeholder="Record private teaching observations, recommended next steps, or specific weaknesses to reinforce..."
                  className="text-xs"
                />

                <Button size="sm" variant="secondary" onClick={handleSaveNotes} className="self-end">
                  <Save size={14} />
                  Save Private Notes
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Clean Empty State */
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

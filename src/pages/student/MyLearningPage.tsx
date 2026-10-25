import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  ArrowRight,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button, buttonClasses } from '@/components/ui/Button'
import { FormatBadge } from '@/components/ui/FormatBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/context/AuthContext'
import {
  getBookings,
  getEnrolledCourseIds,
  cancelBooking,
  getTutorById,
  getCourseById,
  useCatalog,
} from '@/lib/marketplaceStore'
import { getUserLessons } from '@/lib/userDataStore'
import { formatLessonDateLabel, formatShortDate, formatINR } from '@/lib/utils'
import type { Booking, Lesson } from '@/types'

export function MyLearningPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'courses' | 'tutors'>('upcoming')
  const [formatFilter, setFormatFilter] = useState<string>('all')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([])
  const [pastLessons, setPastLessons] = useState<Lesson[]>([])

  const { tutors, courses } = useCatalog()
  const studentId = user?.id || ''

  useEffect(() => {
    if (!studentId) return

    function loadData() {
      setBookings(getBookings(studentId))
      setEnrolledCourseIds(getEnrolledCourseIds(studentId))
      setPastLessons(getUserLessons(studentId))
    }

    loadData()
    window.addEventListener('threadline_store_updated', loadData)
    window.addEventListener('threadline_user_data_updated', loadData)
    return () => {
      window.removeEventListener('threadline_store_updated', loadData)
      window.removeEventListener('threadline_user_data_updated', loadData)
    }
  }, [studentId])

  const enrolledCourses = enrolledCourseIds
    .map((id) => getCourseById(id) ?? courses.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  // Upcoming bookings
  const upcomingBookings = bookings
    .filter((b) => b.status === 'confirmed')
    .filter((b) => formatFilter === 'all' || b.format === formatFilter)
    .sort((a, b) => (a.date > b.date ? 1 : -1))

  // Active tutors
  const activeTutorIds = Array.from(new Set([...bookings.map((b) => b.tutorId), ...pastLessons.map((l) => l.tutorId)]))
  const activeTutors = activeTutorIds
    .map((id) => getTutorById(id) ?? tutors.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-h1 text-ink">My Learning & Sessions</h1>
        <p className="text-body text-ink-secondary">
          Manage your upcoming online and in-person lessons, cohort schedules, and view past session summaries.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            Upcoming Sessions ({upcomingBookings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('past')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'past'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            Past Lessons & Summaries ({pastLessons.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'courses'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            Enrolled Courses ({enrolledCourses.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tutors')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'tutors'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            My Tutors ({activeTutors.length})
          </button>
        </div>

        {activeTab === 'upcoming' && (
          <div className="flex items-center gap-2 text-small">
            <span className="text-ink-secondary">Format:</span>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              aria-label="Filter sessions by format"
              className="h-9 rounded-lg border border-border bg-white px-2.5 text-small font-medium text-ink focus:outline-none"
            >
              <option value="all">All Formats</option>
              <option value="online">Online Video</option>
              <option value="in-person-student">In-Person (Home)</option>
              <option value="in-person-tutor">In-Person (Studio)</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Upcoming Sessions */}
      {activeTab === 'upcoming' && (
        <div className="flex flex-col gap-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((b) => {
              const tutor = getTutorById(b.tutorId) ?? tutors.find((t) => t.id === b.tutorId)
              if (!tutor) return null
              const isOnline = b.format === 'online' || b.format === 'hybrid'

              return (
                <Card key={b.id} className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center">
                  <div className="flex items-start gap-4">
                    <Avatar src={tutor.avatarUrl} name={tutor.name} size="lg" />
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-h3 text-ink">{b.subject}</span>
                        <FormatBadge format={b.format} />
                        <span className="text-label text-ink-secondary capitalize">({b.type})</span>
                      </div>

                      <p className="text-small text-ink-secondary">
                        Tutor: <Link to={`/tutors/${tutor.id}`} className="font-semibold text-ink hover:text-primary">{tutor.name}</Link> · {b.durationMinutes} minutes
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-small">
                        <span className="flex items-center gap-1 font-semibold text-primary">
                          <Calendar size={14} />
                          {formatLessonDateLabel(b.date, b.time)}
                        </span>
                        {b.locationDetails && (
                          <span className="flex items-center gap-1 text-ink-secondary">
                            <MapPin size={14} className="text-success" />
                            {b.locationDetails}
                          </span>
                        )}
                      </div>

                      {b.notes && (
                        <p className="mt-1 text-label text-ink-secondary italic bg-slate-50 p-2 rounded">
                          Goal: "{b.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3 md:border-0 md:pt-0">
                    {isOnline ? (
                      <Button
                        size="md"
                        onClick={() => navigate(b.onlineMeetingUrl || `/lesson/lesson-aug14/live`)}
                      >
                        <Video size={16} />
                        Join Session
                      </Button>
                    ) : (
                      <div className="rounded-lg bg-success-light px-3 py-2 text-small font-medium text-success">
                        Location Confirmed
                      </div>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-ink-secondary hover:text-red-600"
                      onClick={() => cancelBooking(b.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Card>
              )
            })
          ) : (
            <EmptyState
              title="No upcoming sessions found"
              description="You have no sessions booked under the selected filter."
              action={
                <Link to="/tutors" className={buttonClasses('primary', 'md')}>
                  Book a lesson
                </Link>
              }
            />
          )}
        </div>
      )}

      {/* Tab 2: Past Lessons & AI Summaries */}
      {activeTab === 'past' && (
        <div className="flex flex-col gap-4">
          {pastLessons.map((l) => {
            const tutor = getTutorById(l.tutorId) ?? tutors.find((t) => t.id === l.tutorId)
            if (!tutor) return null

            return (
              <Card key={l.id} className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center">
                <div className="flex items-start gap-4">
                  <Avatar src={tutor.avatarUrl} name={tutor.name} size="md" />
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-h3 text-ink">{l.title}</span>
                      <Badge tone="success">Completed</Badge>
                      {l.format && <FormatBadge format={l.format} />}
                    </div>
                    <p className="text-small text-ink-secondary">
                      Tutor: <span className="font-semibold text-ink">{tutor.name}</span> · {formatShortDate(l.date)} at {l.time} ({l.durationMinutes}m)
                    </p>

                    {/* Topics covered pill list */}
                    {l.summary && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {l.summary.topicsCovered.map((topic) => (
                          <span key={topic} className="rounded bg-slate-100 px-2 py-0.5 text-label font-medium text-ink-secondary">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <Link to={`/lessons/${l.id}`} className={buttonClasses('secondary', 'sm')}>
                    View AI Lesson Summary
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Tab 3: Enrolled Courses */}
      {activeTab === 'courses' && (
        <div className="grid gap-6 md:grid-cols-2">
          {enrolledCourses.map((c) => (
            <Card key={c.id} className="flex flex-col justify-between gap-4 p-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <FormatBadge format={c.format} />
                  <Badge tone="neutral">{c.category}</Badge>
                </div>
                <h3 className="text-h3 text-ink">{c.title}</h3>
                <p className="text-small text-ink-secondary">{c.subtitle}</p>
                <div className="mt-2 flex items-center gap-2 text-small text-ink-secondary">
                  <Clock size={14} className="text-primary" />
                  <span>{c.schedule}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="mb-2 flex justify-between text-label text-ink-secondary">
                  <span>Curriculum Progress</span>
                  <span className="font-semibold text-ink">Module 2 of {c.syllabus.length}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '40%' }} />
                </div>
                <div className="mt-4 flex justify-end">
                  <Link to={`/courses/${c.id}`} className={buttonClasses('primary', 'sm')}>
                    Open Course Hub
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 4: My Tutors */}
      {activeTab === 'tutors' && (
        <div className="grid gap-6 md:grid-cols-2">
          {activeTutors.map((tutor) => (
            <Card key={tutor.id} className="flex flex-col justify-between gap-4 p-5">
              <div className="flex items-start gap-4">
                <Avatar src={tutor.avatarUrl} name={tutor.name} size="lg" />
                <div className="flex flex-col gap-1">
                  <Link to={`/tutors/${tutor.id}`} className="text-body font-bold text-ink hover:text-primary">
                    {tutor.name}
                  </Link>
                  <p className="line-clamp-1 text-small text-ink-secondary">{tutor.headline}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {tutor.formats.map((f) => (
                      <FormatBadge key={f} format={f} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <p className="text-body font-bold text-ink">{formatINR(tutor.pricePerHour)} / hr</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => navigate('/messages')}>
                    Message
                  </Button>
                  <Link to={`/book/${tutor.id}`} className={buttonClasses('primary', 'sm')}>
                    Book Again
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

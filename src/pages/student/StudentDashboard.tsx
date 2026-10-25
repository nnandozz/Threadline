import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Calendar,
  BookOpen,
  MapPin,
  Video,
  Sparkles,
  Compass,
  Clock,
  Brain,
  CheckCircle2,
  Plus,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button, buttonClasses } from '@/components/ui/Button'
import { FormatBadge } from '@/components/ui/FormatBadge'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'
import {
  getEnrolledCourseIds,
  getLearningPreferences,
  getTutorById,
  getCourseById,
  useCatalog,
} from '@/lib/marketplaceStore'
import { fetchUserBookings, updateBookingStatus } from '@/lib/bookingService'
import {
  getUserHomework,
  getUserVocabulary,
  getUserRecurringErrors,
} from '@/lib/userDataStore'
import { formatLessonDateLabel, getGreeting, formatINR } from '@/lib/utils'
import type { Booking, HomeworkItem } from '@/types'

export function StudentDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([])
  const [homework, setHomework] = useState<HomeworkItem[]>([])
  const [preferences, setPreferences] = useState(getLearningPreferences(user?.id))
  const [activeTab, setActiveTab] = useState<'sessions' | 'cohorts' | 'homework'>('sessions')

  const { tutors, courses } = useCatalog()
  const studentId = user?.id || ''

  useEffect(() => {
    if (!studentId) return

    async function loadData() {
      setEnrolledCourseIds(getEnrolledCourseIds(studentId))
      setHomework(getUserHomework(studentId))
      setPreferences(getLearningPreferences(studentId))

      const { bookings: fetched } = await fetchUserBookings(studentId, 'student')
      setBookings(fetched)
    }

    loadData()

    window.addEventListener('threadline_store_updated', loadData)
    window.addEventListener('threadline_user_data_updated', loadData)
    return () => {
      window.removeEventListener('threadline_store_updated', loadData)
      window.removeEventListener('threadline_user_data_updated', loadData)
    }
  }, [studentId])

  const firstName = user?.name ? user.name.split(' ')[0] : 'there'

  // Enrolled courses
  const enrolledCourses = enrolledCourseIds
    .map((id) => getCourseById(id) ?? courses.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  // Bookings grouped by status
  const pendingBookings = bookings.filter((b) => b.status === 'pending')

  // Upcoming confirmed bookings sorted by date
  const upcomingBookings = bookings
    .filter((b) => b.status === 'confirmed')
    .sort((a, b) => (a.date > b.date ? 1 : -1))

  const nextBooking = upcomingBookings[0]
  const nextTutor = nextBooking
    ? getTutorById(nextBooking.tutorId) ?? tutors.find((t) => t.id === nextBooking.tutorId) ?? null
    : null

  // Homework items
  const pendingHomework = homework.filter((h) => !h.completed)

  // Real user vocabulary & errors
  const userVocabulary = getUserVocabulary(studentId)
  const userErrors = getUserRecurringErrors(studentId)

  // Recommended tutors based on user target subjects or top rated
  const recommendedTutors = tutors.filter((t) => {
    if (preferences.targetSubjects.length > 0) {
      return t.subjectCategories.some((sc) =>
        preferences.targetSubjects.some((ts) => ts.toLowerCase().includes(sc.toLowerCase())),
      )
    }
    return t.rating >= 4.8
  }).slice(0, 3)

  async function handleCancelBooking(bookingId: string) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      const res = await updateBookingStatus(bookingId, 'cancelled')
      if (res.error) {
        alert(res.error)
      } else {
        const { bookings: fetched } = await fetchUserBookings(studentId, 'student')
        setBookings(fetched || [])
      }
    }
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* ───────────────────────── Header & Welcome ───────────────────────── */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {getGreeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {preferences.learningGoal ? (
              <>
                Current Focus:{' '}
                <span className="font-medium text-slate-800">{preferences.learningGoal}</span>
              </>
            ) : (
              'Welcome to your learning dashboard. Find a tutor or explore courses to get started.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/tutors" className={buttonClasses('primary', 'sm')}>
            <Compass size={14} />
            Find Tutors
          </Link>
          <Link to="/courses" className={buttonClasses('secondary', 'sm')}>
            Explore Courses
          </Link>
        </div>
      </div>

      {/* ───────────────────────── Next Session Spotlight or Intent Discovery ───────────────────────── */}
      {nextBooking && nextTutor ? (
        <div className="relative overflow-hidden rounded-2xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/70 via-white to-slate-50 p-6 shadow-xs">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <Avatar
                src={nextTutor.avatarUrl}
                name={nextTutor.name}
                size="lg"
                className="h-14 w-14 shrink-0 rounded-full ring-2 ring-indigo-200"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Next Scheduled Lesson
                  </span>
                  <span className="text-slate-300">·</span>
                  <FormatBadge format={nextBooking.format} />
                </div>

                <h2 className="text-base font-semibold text-slate-900 mt-1">
                  {nextBooking.subject} with {nextTutor.name}
                </h2>

                <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <Calendar size={13} className="text-primary" />
                    {formatLessonDateLabel(nextBooking.date, nextBooking.time)}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span>{nextBooking.durationMinutes} minutes</span>
                  {nextBooking.locationDetails && (
                    <>
                      <span className="text-slate-300">·</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin size={12} className="text-slate-400" />
                        {nextBooking.locationDetails}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
              {nextBooking.format === 'online' ? (
                <Button
                  size="md"
                  variant="primary"
                  onClick={() => navigate(`/lesson/${nextBooking.id}/live`)}
                >
                  <Video size={15} />
                  Join Classroom
                </Button>
              ) : (
                <Link
                  to="/messages"
                  className={buttonClasses('secondary', 'md')}
                >
                  <MapPin size={15} />
                  View Studio Details
                </Link>
              )}
              <Button
                size="md"
                variant="ghost"
                onClick={() => handleCancelBooking(nextBooking.id)}
                className="text-slate-500 hover:text-red-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Clean Subject & Goal Discovery Banner for accounts with no bookings yet */
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Get Started
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                What would you like to learn?
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Search verified educators by academic subject, competitive exam preparation, or specific learning goals.
              </p>
            </div>

            <Link to="/tutors" className={buttonClasses('primary', 'md', 'shrink-0 w-fit')}>
              <Plus size={15} />
              Book Your First Lesson
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4 text-xs">
            <span className="text-slate-400 font-medium py-1">Browse topics:</span>
            {[
              'Calculus & Analysis',
              'Computer Science',
              'English Fluency',
              'STEP & MAT Prep',
              'Physics',
              'Classical Piano',
            ].map((topic) => (
              <Link
                key={topic}
                to={`/tutors?query=${encodeURIComponent(topic)}`}
                className="rounded-lg bg-slate-50 border border-slate-200/80 px-2.5 py-1 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────── Main Dashboard Content ───────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column (2 Cols): Tabs for Sessions, Cohorts, and Homework */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Custom Tabs Navigation */}
          <div className="flex border-b border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveTab('sessions')}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'sessions'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar size={15} />
              <span>Upcoming Lessons</span>
              {upcomingBookings.length > 0 && (
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-bold text-primary">
                  {upcomingBookings.length}
                </span>
              )}
              {pendingBookings.length > 0 && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                  {pendingBookings.length} pending
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cohorts')}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'cohorts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen size={15} />
              <span>Enrolled Courses</span>
              {enrolledCourses.length > 0 && (
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-700">
                  {enrolledCourses.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('homework')}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'homework'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <CheckCircle2 size={15} />
              <span>Assignments</span>
              {pendingHomework.length > 0 && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                  {pendingHomework.length}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: Upcoming Sessions */}
          {activeTab === 'sessions' && (
            <div className="flex flex-col gap-4">
              {/* Pending Booking Requests awaiting tutor acceptance */}
              {pendingBookings.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-amber-600" />
                      <h3 className="text-sm font-semibold text-amber-950">
                        Pending Booking Requests ({pendingBookings.length})
                      </h3>
                    </div>
                    <span className="text-xs font-medium text-amber-700">Awaiting Tutor Acceptance</span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {pendingBookings.map((b) => {
                      const tutor = getTutorById(b.tutorId) ?? tutors.find((t) => t.id === b.tutorId)
                      return (
                        <div
                          key={b.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-amber-200/60 bg-white p-3.5 shadow-xs"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar
                              src={tutor?.avatarUrl}
                              name={tutor?.name || 'Tutor'}
                              size="sm"
                              className="h-9 w-9 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-slate-900">
                                  {tutor?.name || 'Assigned Tutor'}
                                </span>
                                <span className="text-slate-300">·</span>
                                <span className="text-xs text-slate-500">{b.subject}</span>
                                <Badge tone="warning">Pending Approval</Badge>
                                <FormatBadge format={b.format} />
                              </div>
                              <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1 font-medium text-slate-700">
                                  <Clock size={12} className="text-slate-400" />
                                  {formatLessonDateLabel(b.date, b.time)}
                                </span>
                                <span className="text-slate-300">·</span>
                                <span>{b.durationMinutes} min</span>
                                <span className="text-slate-300">·</span>
                                <span className="font-semibold text-slate-800">{formatINR(b.price)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCancelBooking(b.id)}
                              className="text-xs text-slate-500 hover:text-red-600 px-2 py-1 h-8"
                            >
                              Cancel Request
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((b) => {
                  const tutor = getTutorById(b.tutorId) ?? tutors.find((t) => t.id === b.tutorId)
                  if (!tutor) return null

                  return (
                    <div
                      key={b.id}
                      className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar src={tutor.avatarUrl} name={tutor.name} size="sm" className="h-10 w-10 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-slate-900">{tutor.name}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-xs text-slate-500">{b.subject}</span>
                            <FormatBadge format={b.format} />
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <Clock size={12} className="text-slate-400" />
                              {formatLessonDateLabel(b.date, b.time)}
                            </span>
                            <span className="text-slate-300">·</span>
                            <span>{b.durationMinutes} min</span>
                            {b.locationDetails && (
                              <span className="truncate max-w-[200px] text-slate-500">
                                · {b.locationDetails}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        {b.format === 'online' ? (
                          <Link to={`/lesson/${b.id}/live`} className={buttonClasses('primary', 'sm')}>
                            <Video size={13} />
                            Join
                          </Link>
                        ) : (
                          <Link to="/messages" className={buttonClasses('secondary', 'sm')}>
                            Messages
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(b.id)}
                          className="text-xs text-slate-400 hover:text-red-600 px-2 py-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : pendingBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-3">
                    <Calendar size={22} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">No upcoming lessons</h3>
                  <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
                    You haven't scheduled any tutoring sessions yet. Browse our verified tutors to book online, in-studio, or in-home lessons.
                  </p>
                  <Link to="/tutors" className={buttonClasses('primary', 'sm', 'mt-4')}>
                    Find a Tutor
                  </Link>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 2: Enrolled Cohorts */}
          {activeTab === 'cohorts' && (
            <div className="flex flex-col gap-3">
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((c) => {
                  const tutor = getTutorById(c.tutorId) ?? tutors.find((t) => t.id === c.tutorId)
                  return (
                    <div
                      key={c.id}
                      className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge tone="accent">Cohort</Badge>
                          <span className="text-xs text-slate-500">{c.weeksDuration} weeks</span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 mt-1">{c.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Instructor: {tutor?.name}</p>
                      </div>
                      <Link to={`/courses/${c.id}`} className={buttonClasses('secondary', 'sm')}>
                        View Syllabus
                      </Link>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-3">
                    <BookOpen size={22} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">No active course enrollments</h3>
                  <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
                    You are not currently enrolled in any structured cohort programmes. Explore our multi-week masterclasses.
                  </p>
                  <Link to="/courses" className={buttonClasses('primary', 'sm', 'mt-4')}>
                    Explore Courses
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Homework & Assignments */}
          {activeTab === 'homework' && (
            <div className="flex flex-col gap-3">
              {pendingHomework.length > 0 ? (
                pendingHomework.map((h) => (
                  <div
                    key={h.id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center"
                  >
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        Due Soon
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 mt-0.5">{h.title}</h4>
                      <p className="text-xs text-slate-500">{h.description}</p>
                    </div>
                    <Link to="/homework" className={buttonClasses('secondary', 'sm')}>
                      Open Exercise
                    </Link>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-3">
                    <CheckCircle2 size={22} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">No pending assignments</h3>
                  <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
                    You are all caught up! Once your tutors assign practice problems or flashcard sets, they will appear here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): AI Learning Memory & Recommendations */}
        <div className="flex flex-col gap-6">
          {/* AI Learning Memory Card */}
          <Card className="p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Brain size={16} className="text-primary" />
                <h3 className="text-sm font-semibold text-slate-900">AI Learning Memory</h3>
              </div>
              <Link to="/progress" className="text-xs font-medium text-primary hover:underline">
                View Details
              </Link>
            </div>

            {userErrors.length > 0 || userVocabulary.length > 0 ? (
              <div className="flex flex-col gap-3 text-xs">
                {userErrors.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Active Error Patterns
                    </span>
                    <div className="mt-1.5 flex flex-col gap-1">
                      {userErrors.slice(0, 2).map((err) => (
                        <div key={err.id} className="rounded bg-slate-50 p-2 text-slate-700">
                          <p className="font-medium">{err.pattern}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{err.occurrences}x noted</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-slate-500">
                  <span>Vocabulary bank:</span>
                  <span className="font-semibold text-slate-800">{userVocabulary.length} terms</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 text-xs text-slate-600">
                <p className="leading-relaxed">
                  Threadline's Learning Memory automatically activates once you attend sessions.
                </p>
                <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 text-[11px] text-slate-500 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Sparkles size={12} className="text-primary" />
                    <span>What gets tracked:</span>
                  </div>
                  <span>• Mastered formulas & concepts</span>
                  <span>• Persistent grammar or coding patterns</span>
                  <span>• Pre-lesson briefs shared with tutors</span>
                </div>
              </div>
            )}
          </Card>

          {/* Recommended Tutors */}
          <Card className="p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Verified Tutors</h3>
              <Link to="/tutors" className="text-xs text-slate-500 hover:text-primary">
                All Tutors →
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {recommendedTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-3"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar src={tutor.avatarUrl} name={tutor.name} size="sm" className="h-8 w-8" />
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/tutors/${tutor.id}`}
                        className="text-xs font-semibold text-slate-900 hover:text-primary block truncate"
                      >
                        {tutor.name}
                      </Link>
                      <p className="text-[11px] text-slate-500 truncate">{tutor.headline}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-slate-900">{formatINR(tutor.pricePerHour)}/hr</span>
                    <Link to={`/book/${tutor.id}`} className={buttonClasses('primary', 'sm', 'h-7 text-xs px-2.5')}>
                      Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

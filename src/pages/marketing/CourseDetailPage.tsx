import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Users,
  Star,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button, buttonClasses } from '@/components/ui/Button'
import { FormatBadge } from '@/components/ui/FormatBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { allCourses, allTutors } from '@/data/mockData'
import { isCourseEnrolled, enrollInCourse } from '@/lib/marketplaceStore'
import { formatINR } from '@/lib/utils'

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const [enrolled, setEnrolled] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const course = allCourses.find((c) => c.id === courseId)

  if (!course) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          title="Course not found"
          description="The course you are looking for does not exist or has concluded."
          action={
            <Link to="/courses" className={buttonClasses('primary', 'md')}>
              Browse all courses
            </Link>
          }
        />
      </div>
    )
  }

  const tutor = allTutors.find((t) => t.id === course.tutorId)
  const isAlreadyEnrolled = isCourseEnrolled(course.id) || enrolled
  const seatsLeft = Math.max(0, course.maxCapacity - (course.enrolledCount + (enrolled ? 1 : 0)))

  function handleEnroll() {
    enrollInCourse(course!.id)
    setEnrolled(true)
    setShowConfirmation(true)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-small text-ink-secondary" aria-label="Breadcrumb">
        <Link to="/courses" className="hover:text-ink">
          Courses
        </Link>
        <span>/</span>
        <span className="text-ink font-medium">{course.title}</span>
      </nav>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl bg-white p-8 text-center shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-light text-success">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-h3 text-ink">Enrollment Confirmed!</h3>
            <p className="text-body text-ink-secondary">
              You are now enrolled in <strong className="text-ink">{course.title}</strong>. The syllabus,
              cohort schedule, and assignments have been added to your Student Dashboard.
            </p>
            <div className="mt-2 flex w-full flex-col gap-2">
              <Button size="lg" onClick={() => navigate('/dashboard')}>
                Go to My Dashboard
              </Button>
              <Button variant="secondary" size="md" onClick={() => setShowConfirmation(false)}>
                Stay on course page
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Course Overview & Syllabus */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          {/* Header Card */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <FormatBadge format={course.format} />
              <Badge tone="neutral">{course.category}</Badge>
              <Badge tone="accent">{course.level}</Badge>
            </div>

            <h1 className="text-h1 text-ink">{course.title}</h1>
            <p className="mt-2 text-body text-ink-secondary leading-relaxed">{course.subtitle}</p>

            <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-border pt-4 text-small">
              <div className="flex items-center gap-1.5">
                <Star size={16} className="fill-warning text-warning" />
                <span className="font-bold text-ink">{course.rating}</span>
                <span className="text-ink-secondary">({course.reviewCount} cohort reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 text-ink-secondary">
                <Clock size={16} className="text-primary" />
                <span>{course.weeksDuration} Weeks ({course.totalHours} total hours)</span>
              </div>
              <div className="flex items-center gap-1.5 text-ink-secondary">
                <Users size={16} className="text-accent-hover" />
                <span>{seatsLeft} spots left of {course.maxCapacity}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8">
            <h2 className="text-h3 text-ink mb-4">Course Description</h2>
            <p className="text-body text-ink-secondary leading-relaxed">{course.description}</p>
          </section>

          {/* Learning Objectives */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8">
            <h2 className="text-h3 text-ink mb-4">What You Will Learn</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {course.learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2.5 text-small text-ink">
                  <CheckCircle2 size={16} className="shrink-0 text-success mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Detailed Syllabus */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h3 text-ink">Syllabus Breakdown</h2>
              <span className="text-small text-ink-secondary">
                {course.syllabus.length} Modules · {course.totalHours} Hours of Live Instruction
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {course.syllabus.map((mod, index) => (
                <div key={mod.id} className="rounded-xl border border-border bg-slate-50/60 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-label font-bold uppercase tracking-wider text-primary">
                      Module {index + 1} ({mod.durationHours} Hours)
                    </span>
                  </div>
                  <h3 className="mt-1 text-body font-semibold text-ink">{mod.title}</h3>
                  <p className="mt-1 text-small text-ink-secondary">{mod.description}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {mod.topics.map((t) => (
                      <span key={t} className="rounded bg-white px-2 py-0.5 text-label font-medium text-ink-secondary border border-border">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Prerequisites */}
          {course.prerequisites.length > 0 && (
            <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8">
              <h2 className="text-h3 text-ink mb-3">Prerequisites</h2>
              <ul className="flex flex-col gap-2">
                {course.prerequisites.map((p, i) => (
                  <li key={i} className="flex items-center gap-2 text-small text-ink-secondary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column: Instructor & Enrollment Widget */}
        <div className="flex flex-col gap-6">
          <div className="sticky top-20 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-baseline justify-between border-b border-border pb-4">
              <div>
                <span className="text-h2 font-bold text-ink">{formatINR(course.price)}</span>
                <span className="text-small text-ink-secondary"> full programme</span>
              </div>
              <FormatBadge format={course.format} />
            </div>

            {/* Schedule Info */}
            <div className="mt-5 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 text-small">
              <div className="flex items-center gap-2 text-ink font-medium">
                <Calendar size={16} className="text-primary" />
                Starts {course.startDate}
              </div>
              <p className="text-ink-secondary">{course.schedule}</p>
              <div className="flex items-center gap-2 text-ink-secondary">
                <Users size={16} className="text-accent-hover" />
                {seatsLeft > 0 ? (
                  <span className="font-semibold text-warning">{seatsLeft} seats left</span>
                ) : (
                  <span className="font-semibold text-ink-secondary">Cohort full</span>
                )}
              </div>
            </div>

            {/* Instructor Card */}
            {tutor && (
              <div className="mt-5 rounded-xl border border-border p-4">
                <p className="text-label uppercase tracking-wider text-ink-secondary font-semibold mb-2">
                  Course Instructor
                </p>
                <div className="flex items-center gap-3">
                  <Avatar src={tutor.avatarUrl} name={tutor.name} size="md" />
                  <div className="min-w-0">
                    <Link to={`/tutors/${tutor.id}`} className="text-body font-semibold text-ink hover:text-primary">
                      {tutor.name}
                    </Link>
                    <p className="line-clamp-1 text-label text-ink-secondary">{tutor.headline}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Enrollment Action */}
            <div className="mt-6 flex flex-col gap-3">
              {isAlreadyEnrolled ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center gap-2 rounded-lg bg-success-light p-3 text-small font-semibold text-success">
                    <CheckCircle2 size={18} />
                    You are enrolled in this cohort
                  </div>
                  <Button size="md" onClick={() => navigate('/dashboard')}>
                    View in Student Dashboard
                  </Button>
                </div>
              ) : (
                <Button size="lg" onClick={handleEnroll} disabled={seatsLeft === 0}>
                  Enroll in Cohort (${course.price})
                  <ArrowRight size={16} />
                </Button>
              )}
            </div>

            {/* Guarantee */}
            <div className="mt-6 flex items-start gap-2.5 border-t border-border pt-4 text-label text-ink-secondary">
              <ShieldCheck size={18} className="shrink-0 text-success mt-0.5" />
              <span>
                Verified tutor curriculum. Includes all live recordings, problem sets, and post-session AI summaries.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

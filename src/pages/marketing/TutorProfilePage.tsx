import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Star,
  MapPin,
  CheckCircle2,
  Bookmark,
  Calendar,
  Award,
  ShieldCheck,
  Loader2,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { buttonClasses } from '@/components/ui/Button'
import { FormatBadge } from '@/components/ui/FormatBadge'
import { CourseCard } from '@/components/course/CourseCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { getTutorById, fetchTutorById, isTutorSaved, toggleSaveTutor, useCatalog } from '@/lib/marketplaceStore'
import { formatLessonDateLabel, formatINR } from '@/lib/utils'
import type { TeachingFormat, Tutor } from '@/types'

export function TutorProfilePage() {
  const { tutorId } = useParams<{ tutorId: string }>()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<TeachingFormat>('online')

  const { tutors, courses } = useCatalog()
  const cached = (tutorId ? getTutorById(tutorId) : undefined) ?? tutors.find((t) => t.id === tutorId)
  const [tutor, setTutor] = useState<Tutor | undefined>(cached)
  const [isLoading, setIsLoading] = useState<boolean>(!cached)

  useEffect(() => {
    if (!tutorId) {
      setIsLoading(false)
      return
    }

    const localTutor = getTutorById(tutorId) ?? tutors.find((t) => t.id === tutorId)
    if (localTutor) {
      setTutor(localTutor)
      setIsLoading(false)
      return
    }

    let isMounted = true
    setIsLoading(true)
    fetchTutorById(tutorId)
      .then((res) => {
        if (isMounted) {
          setTutor(res ?? undefined)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [tutorId, tutors])

  useEffect(() => {
    if (tutor) {
      setSaved(isTutorSaved(tutor.id))
      setSelectedFormat(tutor.formats[0] ?? 'online')
    }
  }, [tutor])

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[400px] max-w-4xl items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-small text-ink-muted">Loading tutor profile...</p>
        </div>
      </div>
    )
  }

  if (!tutor) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          title="Tutor not found"
          description="The tutor profile you requested does not exist or may have been removed."
          action={
            <Link to="/tutors" className={buttonClasses('primary', 'md')}>
              Browse all tutors
            </Link>
          }
        />
      </div>
    )
  }

  const tutorCourses = courses.filter((c) => c.tutorId === tutor.id)
  const hasInPerson = tutor.formats.some((f) => f === 'in-person-tutor' || f === 'in-person-student' || f === 'hybrid')

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-small text-ink-secondary" aria-label="Breadcrumb">
        <Link to="/tutors" className="hover:text-ink">
          Tutors
        </Link>
        <span>/</span>
        <span className="text-ink font-medium">{tutor.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Profile Info (2 columns) */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          {/* Header Card */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-5">
                <Avatar src={tutor.avatarUrl} name={tutor.name} size="lg" className="h-20 w-20 ring-4 ring-primary/10 text-h2" />
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-h2 text-ink">{tutor.name}</h1>
                    {tutor.verificationStatus === 'verified' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2.5 py-0.5 text-label font-medium text-primary">
                        <CheckCircle2 size={13} />
                        Verified Tutor
                      </span>
                    )}
                  </div>
                  <p className="text-body font-medium text-ink-secondary">{tutor.headline}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-small">
                    <div className="flex items-center gap-1">
                      <Star size={15} className="fill-warning text-warning" />
                      <span className="font-bold text-ink">{tutor.rating}</span>
                      <span className="text-ink-secondary">({tutor.reviewCount} reviews)</span>
                    </div>
                    <span className="text-border">·</span>
                    <span className="text-ink-secondary">{tutor.yearsExperience} years teaching experience</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const state = toggleSaveTutor(tutor.id)
                  setSaved(state)
                }}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-small font-medium transition-colors ${
                  saved
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-border text-ink-secondary hover:bg-slate-50 hover:text-ink'
                }`}
              >
                <Bookmark size={16} className={saved ? 'fill-primary' : ''} />
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>

            {/* Badges row */}
            {tutor.badges && tutor.badges.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                {tutor.badges.map((b) => (
                  <Badge key={b} tone="accent" className="px-2.5 py-1">
                    {b}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Teaching Formats & Service Area */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8">
            <h2 className="text-h3 text-ink mb-4">Teaching Formats & Location</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {tutor.formats.map((format) => (
                <div
                  key={format}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-slate-50/60 p-4"
                >
                  <div className="flex items-center gap-2">
                    <FormatBadge format={format} />
                  </div>
                  <p className="text-small text-ink-secondary">
                    {format === 'online' && 'Interactive online sessions with audio/video, real-time code/notes sharing, and AI-assisted summaries.'}
                    {format === 'in-person-tutor' && `Learn at the tutor's dedicated studio space in ${tutor.location?.area || 'Central location'}. Quiet, equipped learning environment.`}
                    {format === 'in-person-student' && `Tutor travels directly to your home or library (travel radius up to ${tutor.location?.travelRadiusKm || 10}km). Student address kept private.`}
                    {format === 'hybrid' && 'Combine online sessions for flexible check-ins with in-person sessions for deep problem sets.'}
                    {format === 'group' && 'Structured group workshops and cohorts with interactive peer discussions.'}
                  </p>
                </div>
              ))}
            </div>

            {hasInPerson && tutor.location && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-small">
                <MapPin className="shrink-0 text-success mt-0.5" size={18} />
                <div className="flex flex-col gap-0.5">
                  <p className="font-semibold text-ink">Service Area & In-Person Policy</p>
                  <p className="text-ink-secondary">
                    Based in <span className="font-medium text-ink">{tutor.location.area}, {tutor.location.city}</span>.
                    {tutor.location.offersInPersonStudent && ` Available for home visits within ${tutor.location.travelRadiusKm}km.`}
                    {tutor.location.travelFee ? ` (Modest travel fee of $${tutor.location.travelFee} per visit apply).` : ' (No extra travel fee).'}
                  </p>
                  <p className="mt-1 text-label text-ink-secondary italic">
                    Note: Exact private home addresses are never published publicly. Location is arranged securely after booking confirmation.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* About & Philosophy */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8">
            <h2 className="text-h3 text-ink mb-4">About {tutor.name}</h2>
            <div className="flex flex-col gap-4 text-body text-ink-secondary leading-relaxed">
              <p>{tutor.bio}</p>
              <div className="rounded-xl border border-primary/20 bg-primary-light/30 p-4">
                <p className="font-semibold text-ink mb-1">Teaching Approach</p>
                <p className="text-small text-ink">{tutor.teachingStyle}</p>
              </div>
            </div>

            {/* Subjects & Specialties */}
            <div className="mt-6 border-t border-border pt-6">
              <h3 className="text-body font-semibold text-ink mb-3">Subjects & Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {tutor.specialties.map((s) => (
                  <span key={s} className="rounded-lg bg-slate-100 px-3 py-1.5 text-small font-medium text-ink">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Education Levels */}
            <div className="mt-6 border-t border-border pt-6">
              <h3 className="text-body font-semibold text-ink mb-3">Student Levels Supported</h3>
              <div className="flex flex-wrap gap-2">
                {tutor.educationLevels.map((lvl) => (
                  <Badge key={lvl} tone="neutral" className="px-2.5 py-1 text-small">
                    {lvl}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="mt-6 border-t border-border pt-6">
              <h3 className="text-body font-semibold text-ink mb-3">Languages Spoken</h3>
              <p className="text-small text-ink-secondary">{tutor.languages.join(' · ')}</p>
            </div>
          </section>

          {/* Qualifications & Experience */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-primary" size={22} />
              <h2 className="text-h3 text-ink">Qualifications & Certifications</h2>
            </div>
            <ul className="flex flex-col gap-3">
              {tutor.qualifications.map((q) => (
                <li key={q} className="flex items-start gap-2.5 text-small text-ink">
                  <CheckCircle2 size={16} className="shrink-0 text-success mt-0.5" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Package Offers */}
          {tutor.packageOffers && tutor.packageOffers.length > 0 && (
            <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8">
              <h2 className="text-h3 text-ink mb-4">Lesson Packages & Discounts</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {tutor.packageOffers.map((pkg) => (
                  <div key={pkg.id} className="flex flex-col justify-between rounded-xl border border-border p-4 bg-slate-50/50">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-label font-bold uppercase tracking-wider text-primary">
                          {pkg.discountPercent}% Off
                        </span>
                        <FormatBadge format={pkg.format} />
                      </div>
                      <h4 className="text-body font-semibold text-ink">{pkg.title}</h4>
                      <p className="text-small text-ink-secondary">
                        {pkg.lessonCount} sessions ({pkg.durationMinutes} mins each)
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <p className="text-h3 text-ink">{formatINR(pkg.price)}</p>
                      <Link
                        to={`/book/${tutor.id}?package=${pkg.id}&format=${pkg.format}`}
                        className={buttonClasses('primary', 'sm')}
                      >
                        Book Package
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tutor Courses */}
          {tutorCourses.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-h3 text-ink">Structured Courses by {tutor.name}</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {tutorCourses.map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky Booking Sidebar (1 column) */}
        <div className="flex flex-col gap-6">
          <div className="sticky top-20 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-baseline justify-between border-b border-border pb-4">
              <div>
                <span className="text-h2 font-bold text-ink">{formatINR(tutor.pricePerHour)}</span>
                <span className="text-small text-ink-secondary"> / hour</span>
              </div>
              <div className="flex items-center gap-1 text-small">
                <Star size={14} className="fill-warning text-warning" />
                <span className="font-semibold text-ink">{tutor.rating}</span>
                <span className="text-ink-secondary">({tutor.reviewCount})</span>
              </div>
            </div>

            {/* Choose Format for booking */}
            <div className="mt-5 flex flex-col gap-2">
              <label className="text-small font-medium text-ink">Select Desired Format</label>
              <div className="flex flex-col gap-2">
                {tutor.formats.map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setSelectedFormat(fmt)}
                    className={`flex items-center justify-between rounded-lg border p-3 text-small font-medium transition-colors ${
                      selectedFormat === fmt
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-border bg-white text-ink-secondary hover:bg-slate-50 hover:text-ink'
                    }`}
                  >
                    <span>
                      {fmt === 'online' && 'Online Video Lesson'}
                      {fmt === 'in-person-tutor' && "In-Person (Tutor's Studio)"}
                      {fmt === 'in-person-student' && "In-Person (Your Location)"}
                      {fmt === 'hybrid' && 'Hybrid Learning'}
                      {fmt === 'group' && 'Group Cohort'}
                    </span>
                    {selectedFormat === fmt && <CheckCircle2 size={16} className="text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Next Slot */}
            {tutor.availability.length > 0 && (
              <div className="mt-5 rounded-xl bg-slate-50 p-3.5 text-small">
                <div className="flex items-center gap-1.5 font-medium text-ink mb-1">
                  <Calendar size={14} className="text-primary" />
                  Next Available Slot:
                </div>
                <p className="text-ink-secondary">
                  {formatLessonDateLabel(tutor.availability[0].date, tutor.availability[0].times[0])}
                </p>
              </div>
            )}

            {/* CTA Button */}
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to={`/book/${tutor.id}?format=${selectedFormat}`}
                className={buttonClasses('primary', 'lg')}
              >
                <Calendar size={16} />
                Book a Session Now
              </Link>

              <button
                type="button"
                onClick={() => navigate('/messages')}
                className={buttonClasses('secondary', 'md')}
              >
                Send Message
              </button>
            </div>

            {/* Trust and Guarantee */}
            <div className="mt-6 flex items-start gap-2.5 border-t border-border pt-4 text-label text-ink-secondary">
              <ShieldCheck size={18} className="shrink-0 text-success mt-0.5" />
              <span>
                100% Satisfaction Guarantee. AI continuity automatically retains your lesson notes and concepts.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

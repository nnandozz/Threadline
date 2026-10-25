import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import {
  Calendar,
  MapPin,
  Video,
  Home,
  Layers,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button, buttonClasses } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { FormatBadge } from '@/components/ui/FormatBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/context/AuthContext'
import { getTutorById, fetchTutorById, useCatalog } from '@/lib/marketplaceStore'
import { createBooking } from '@/lib/bookingService'
import { formatLessonDateLabel, formatINR } from '@/lib/utils'
import type { TeachingFormat, BookingType, Booking, Tutor } from '@/types'

export function BookingPage() {
  const { tutorId } = useParams<{ tutorId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { tutors } = useCatalog()

  const cachedTutor = (tutorId ? getTutorById(tutorId) : undefined) ?? tutors.find((t) => t.id === tutorId)
  const [tutor, setTutor] = useState<Tutor | undefined>(cachedTutor)
  const [isLoadingTutor, setIsLoadingTutor] = useState<boolean>(!cachedTutor)

  useEffect(() => {
    if (!tutorId) {
      setIsLoadingTutor(false)
      return
    }

    const localTutor = getTutorById(tutorId) ?? tutors.find((t) => t.id === tutorId)
    if (localTutor) {
      setTutor(localTutor)
      setIsLoadingTutor(false)
      return
    }

    let isMounted = true
    setIsLoadingTutor(true)
    fetchTutorById(tutorId)
      .then((fetched) => {
        if (isMounted) {
          setTutor(fetched ?? undefined)
          setIsLoadingTutor(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoadingTutor(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [tutorId, tutors])

  const initialFormat = (searchParams.get('format') as TeachingFormat) || (tutor?.formats[0] ?? 'online')

  // Booking state
  const [bookingType, setBookingType] = useState<BookingType>('single')
  const [format, setFormat] = useState<TeachingFormat>(initialFormat)
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<{ date: string; time: string } | null>(null)
  const [durationMinutes, setDurationMinutes] = useState<number>(60)
  const [studentNotes, setStudentNotes] = useState<string>('')
  const [locationAddress, setLocationAddress] = useState<string>('South Extension, New Delhi')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null)

  // Initialize format & slot selection once tutor loads
  useEffect(() => {
    if (tutor) {
      const paramFormat = searchParams.get('format') as TeachingFormat
      if (paramFormat && tutor.formats.includes(paramFormat)) {
        setFormat(paramFormat)
      } else {
        setFormat((prev) => (tutor.formats.includes(prev) ? prev : (tutor.formats[0] ?? 'online')))
      }

      setSelectedSlotIndex((prev) => {
        if (prev) return prev
        if (tutor.availability.length > 0 && tutor.availability[0].times.length > 0) {
          return {
            date: tutor.availability[0].date,
            time: tutor.availability[0].times[0],
          }
        }
        return null
      })
    }
  }, [tutor, searchParams])

  if (isLoadingTutor) {
    return (
      <div className="mx-auto flex min-h-[400px] max-w-4xl items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="text-small text-ink-muted">Loading tutor details...</p>
        </div>
      </div>
    )
  }

  if (!tutor) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          title="Tutor not found"
          description="We couldn't find the requested tutor to book."
          action={
            <Link to="/tutors" className={buttonClasses('primary', 'md')}>
              Browse tutors
            </Link>
          }
        />
      </div>
    )
  }

  // Price calculation
  const hourlyRate = tutor.pricePerHour
  const durationMultiplier = durationMinutes / 60
  const travelFee = format === 'in-person-student' && tutor.location?.travelFee ? tutor.location.travelFee : 0
  const packageDiscountPercent = bookingType === 'package' ? 12 : 0

  let rawPrice = hourlyRate * durationMultiplier
  if (bookingType === 'package') {
    rawPrice = rawPrice * 5 * (1 - packageDiscountPercent / 100)
  } else if (bookingType === 'group') {
    rawPrice = Math.round(rawPrice * 0.6)
  }
  const totalPrice = Math.round(rawPrice + travelFee)

  async function handleConfirmBooking() {
    if (!selectedSlotIndex || !tutor) return
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/book/${tutor.id}`)}`)
      return
    }
    if (user.role !== 'student') {
      navigate('/tutor/dashboard')
      return
    }
    setBookingError(null)
    setIsSubmitting(true)

    const newBooking: Booking = {
      id: `booking-${Date.now().toString().slice(-6)}`,
      studentId: user.id,
      studentName: user.name || 'Student',
      tutorId: tutor.id,
      type: bookingType,
      subject: tutor.specialties[0] || 'Private Tutoring',
      format: format,
      date: selectedSlotIndex.date,
      time: selectedSlotIndex.time,
      durationMinutes: durationMinutes,
      price: totalPrice,
      status: 'pending',
      locationDetails:
        format === 'in-person-student'
          ? `Student Location: ${locationAddress}`
          : format === 'in-person-tutor'
          ? tutor.location?.addressGeneral || `Tutor Studio in ${tutor.location?.area}`
          : undefined,
      onlineMeetingUrl: format === 'online' || format === 'hybrid' ? `/lesson/lesson-${Date.now().toString().slice(-4)}/live` : undefined,
      notes: studentNotes || 'Focused topic practice session.',
      createdAt: new Date().toISOString().split('T')[0],
    }

    const res = await createBooking(newBooking)
    if (res.error) {
      setBookingError(res.error)
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)
    setConfirmedBooking(res.data || newBooking)
  }

  // Confirmation View
  if (confirmedBooking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="flex flex-col items-center gap-6 rounded-xl border border-slate-200/80 bg-white p-8 text-center shadow-sm md:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <CheckCircle2 size={32} />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Reference #{confirmedBooking.id.toUpperCase()}
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Booking Request Submitted!</h1>
            <p className="text-sm text-slate-600 max-w-lg">
              Your session request with <strong className="text-slate-900">{tutor.name}</strong> has been registered with status{' '}
              <span className="rounded-md bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">Pending Review</span>.
              The tutor has been notified and can confirm or coordinate arrangements from their dashboard.
            </p>
          </div>

          <div className="w-full rounded-xl border border-border bg-slate-50/70 p-5 text-left text-small">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-ink-secondary">Arrangement</p>
                <p className="font-semibold text-ink">
                  {bookingType === 'single' && 'Individual Lesson'}
                  {bookingType === 'package' && '5-Lesson Package'}
                  {bookingType === 'group' && 'Group Cohort Session'}
                </p>
              </div>
              <div>
                <p className="text-ink-secondary">Request Status</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/80 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Awaiting Tutor Acceptance
                </span>
              </div>
              <div>
                <p className="text-ink-secondary">Teaching Format</p>
                <FormatBadge format={confirmedBooking.format} />
              </div>
              <div>
                <p className="text-ink-secondary">Date & Time</p>
                <p className="font-semibold text-ink">
                  {formatLessonDateLabel(confirmedBooking.date, confirmedBooking.time)}
                </p>
              </div>
              <div>
                <p className="text-ink-secondary">Total Session Fee</p>
                <p className="font-semibold text-ink">{formatINR(confirmedBooking.price)}</p>
              </div>
              {confirmedBooking.locationDetails && (
                <div className="col-span-2 border-t border-border pt-2">
                  <p className="text-ink-secondary">Requested Location</p>
                  <p className="font-medium text-ink">{confirmedBooking.locationDetails}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
            <Button size="lg" onClick={() => navigate('/dashboard')}>
              Go to Student Dashboard
              <ArrowRight size={16} />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/tutors')}>
              Browse More Educators
            </Button>
          </div>

          <p className="text-label text-ink-secondary italic">
            Threadline AI Memory: Pre-session learning goals will be made accessible to {tutor.name} upon confirmation.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-small text-ink-secondary" aria-label="Breadcrumb">
        <Link to="/tutors" className="hover:text-ink">
          Tutors
        </Link>
        <span>/</span>
        <Link to={`/tutors/${tutor.id}`} className="hover:text-ink">
          {tutor.name}
        </Link>
        <span>/</span>
        <span className="text-ink font-medium">Book Session</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-h1 text-ink">Book a Tutoring Session</h1>
        <p className="mt-1 text-body text-ink-secondary">
          Configure your learning arrangement, format, and schedule with {tutor.name}.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Booking Form (2 cols) */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Step 1: Booking Type */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h2 className="text-h3 text-ink mb-3">1. Select Arrangement</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setBookingType('single')}
                className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition-colors ${
                  bookingType === 'single'
                    ? 'border-primary bg-primary-light/50 ring-1 ring-primary'
                    : 'border-border hover:bg-slate-50'
                }`}
              >
                <span className="text-body font-semibold text-ink">Single Lesson</span>
                <span className="text-small text-ink-secondary">One-off deep dive session</span>
              </button>

              <button
                type="button"
                onClick={() => setBookingType('package')}
                className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition-colors ${
                  bookingType === 'package'
                    ? 'border-primary bg-primary-light/50 ring-1 ring-primary'
                    : 'border-border hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-body font-semibold text-ink">5-Lesson Bundle</span>
                  <span className="text-label font-bold text-primary">Save 12%</span>
                </div>
                <span className="text-small text-ink-secondary">Structured multi-week streak</span>
              </button>

              <button
                type="button"
                onClick={() => setBookingType('group')}
                className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition-colors ${
                  bookingType === 'group'
                    ? 'border-primary bg-primary-light/50 ring-1 ring-primary'
                    : 'border-border hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-body font-semibold text-ink">Group Workshop</span>
                  <span className="text-label font-bold text-warning">40% Off</span>
                </div>
                <span className="text-small text-ink-secondary">Shared cohort problem set</span>
              </button>
            </div>
          </section>

          {/* Step 2: Teaching Format */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h2 className="text-h3 text-ink mb-3">2. Choose Teaching Format</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {tutor.formats.map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                    format === fmt
                      ? 'border-primary bg-primary-light/50 ring-1 ring-primary'
                      : 'border-border hover:bg-slate-50'
                  }`}
                >
                  <div className="mt-0.5">
                    {fmt === 'online' && <Video className="text-primary" size={20} />}
                    {fmt === 'in-person-tutor' && <MapPin className="text-success" size={20} />}
                    {fmt === 'in-person-student' && <Home className="text-success" size={20} />}
                    {fmt === 'hybrid' && <Layers className="text-accent-hover" size={20} />}
                    {fmt === 'group' && <Users className="text-warning" size={20} />}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">
                      {fmt === 'online' && 'Online Video Session'}
                      {fmt === 'in-person-tutor' && "At Tutor's Studio Space"}
                      {fmt === 'in-person-student' && "In-Person (At Your Home)"}
                      {fmt === 'hybrid' && 'Hybrid Arrangement'}
                      {fmt === 'group' && 'Group Cohort'}
                    </p>
                    <p className="text-small text-ink-secondary mt-0.5">
                      {fmt === 'online' && 'Browser-based HD video with live scratchpad.'}
                      {fmt === 'in-person-tutor' && `Located in ${tutor.location?.area || 'Central Area'}.`}
                      {fmt === 'in-person-student' && `Tutor travels to your home (travel fee +${formatINR(tutor.location?.travelFee || 0)}).`}
                      {fmt === 'hybrid' && 'Mix of online and offline sessions.'}
                      {fmt === 'group' && 'Collaborative learning with peers.'}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* In-Person location specification */}
            {format === 'in-person-student' && (
              <div className="mt-4 flex flex-col gap-2 rounded-xl border border-border bg-slate-50 p-4">
                <label className="text-small font-semibold text-ink flex items-center gap-1.5">
                  <Home size={15} className="text-success" />
                  Your General Neighborhood or Address
                </label>
                <Input
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder="e.g. South Extension II, New Delhi or college hostel / PG"
                />
                <p className="text-label text-ink-secondary">
                  Your address is kept confidential and only shared with {tutor.name} after booking confirmation.
                </p>
              </div>
            )}
          </section>

          {/* Step 3: Date, Time & Duration */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h2 className="text-h3 text-ink mb-3">3. Date, Time & Duration</h2>

            {/* Duration Selector */}
            <div className="mb-5 flex flex-col gap-2">
              <label className="text-small font-medium text-ink">Lesson Duration</label>
              <div className="flex flex-wrap gap-2">
                {[30, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`rounded-lg border px-4 py-2 text-small font-medium transition-colors ${
                      durationMinutes === mins
                        ? 'border-primary bg-primary text-white'
                        : 'border-border text-ink-secondary hover:bg-slate-50 hover:text-ink'
                    }`}
                  >
                    {mins} minutes
                  </button>
                ))}
              </div>
            </div>

            {/* Slot Picker */}
            <label className="text-small font-medium text-ink block mb-2">Available Time Slots</label>
            <div className="flex flex-col gap-3">
              {tutor.availability.map((avail) => (
                <div key={avail.date} className="rounded-xl border border-border p-3.5 bg-slate-50/50">
                  <div className="flex items-center gap-2 text-small font-semibold text-ink mb-2">
                    <Calendar size={14} className="text-primary" />
                    {avail.date}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {avail.times.map((t) => {
                      const isSelected =
                        selectedSlotIndex?.date === avail.date && selectedSlotIndex?.time === t
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedSlotIndex({ date: avail.date, time: t })}
                          className={`rounded-lg border px-3.5 py-1.5 text-small font-medium transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary text-white shadow-sm'
                              : 'border-border bg-white text-ink hover:border-primary hover:text-primary'
                          }`}
                        >
                          {t}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Step 4: Learning Goal or Notes */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h2 className="text-h3 text-ink mb-2">4. Learning Focus / Notes for Tutor</h2>
            <p className="text-small text-ink-secondary mb-3">
              Tell {tutor.name} what specific topics, assignments, or goals you want to tackle during this session.
            </p>
            <Textarea
              rows={3}
              placeholder="e.g. I want to review dynamic programming memoization, solve LeetCode medium questions, and clarify recursion trees."
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
            />
          </section>
        </div>

        {/* Order Summary & Confirm (1 col) */}
        <div className="flex flex-col gap-6">
          <div className="sticky top-20 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <h3 className="text-h3 text-ink mb-4 border-b border-border pb-3">Booking Summary</h3>

            {/* Tutor card info */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={tutor.avatarUrl} name={tutor.name} size="md" />
              <div>
                <p className="font-semibold text-ink">{tutor.name}</p>
                <p className="text-label text-ink-secondary line-clamp-1">{tutor.headline}</p>
              </div>
            </div>

            {/* Selected Summary Breakdown */}
            <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 text-small border border-slate-200">
              <div className="flex justify-between">
                <span className="text-ink-secondary">Arrangement</span>
                <span className="font-medium text-ink capitalize">{bookingType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ink-secondary">Format</span>
                <FormatBadge format={format} />
              </div>
              <div className="flex justify-between">
                <span className="text-ink-secondary">Duration</span>
                <span className="font-medium text-ink">{durationMinutes} mins</span>
              </div>
              {selectedSlotIndex && (
                <div className="flex justify-between">
                  <span className="text-ink-secondary">Slot</span>
                  <span className="font-medium text-ink">
                    {selectedSlotIndex.date} at {selectedSlotIndex.time}
                  </span>
                </div>
              )}
            </div>

            {/* Price lines */}
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-small">
              <div className="flex justify-between text-ink-secondary">
                <span>Base tuition rate</span>
                <span>{formatINR(tutor.pricePerHour)}/hr</span>
              </div>
              {travelFee > 0 && (
                <div className="flex justify-between text-ink-secondary">
                  <span>Travel fee (in-home visit)</span>
                  <span>+{formatINR(travelFee)}</span>
                </div>
              )}
              {bookingType === 'package' && (
                <div className="flex justify-between text-primary font-medium">
                  <span>5-Session Bundle Discount (12%)</span>
                  <span>Applied</span>
                </div>
              )}
              <div className="mt-2 flex justify-between border-t border-border pt-2 text-body font-bold text-ink">
                <span>Total Due</span>
                <span className="text-h3 text-ink">{formatINR(totalPrice)}</span>
              </div>
            </div>

            {/* Payment simulation disclaimer */}
            <div className="mt-4 rounded-lg bg-amber-50 p-3 text-label text-amber-900 border border-amber-200 flex items-start gap-2">
              <CreditCard size={15} className="shrink-0 mt-0.5 text-amber-700" />
              <span>
                <strong>Simulated Demo Payment:</strong> No actual credit card charge will occur. The session will be confirmed instantly in your student account.
              </span>
            </div>

            {/* Booking error notice */}
            {bookingError && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 shadow-xs">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                <span>{bookingError}</span>
              </div>
            )}

            {/* Confirm CTA */}
            <div className="mt-6 flex flex-col gap-3">
              <Button
                size="lg"
                onClick={handleConfirmBooking}
                disabled={isSubmitting || !selectedSlotIndex}
              >
                {isSubmitting ? 'Confirming...' : `Confirm Booking (${formatINR(totalPrice)})`}
                <CheckCircle2 size={16} />
              </Button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-label text-ink-secondary">
              <ShieldCheck size={14} className="text-success" />
              <span>Free cancellation up to 24 hours prior</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

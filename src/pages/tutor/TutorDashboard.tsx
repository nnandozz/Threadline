import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  XCircle,
  Compass,
  DollarSign,
  Users,
  Settings,
  Plus,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Button, buttonClasses } from '@/components/ui/Button'
import { FormatBadge } from '@/components/ui/FormatBadge'
import { useAuth } from '@/context/AuthContext'
import { getBookings, saveBooking } from '@/lib/marketplaceStore'
import { getTutorEarnings } from '@/lib/userDataStore'
import { formatLessonDateLabel, formatINR } from '@/lib/utils'
import type { Booking } from '@/types'

export function TutorDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])

  const tutorId = user?.id || ''

  useEffect(() => {
    if (!tutorId) return

    function loadData() {
      setBookings(getBookings(tutorId))
    }

    loadData()
    window.addEventListener('threadline_store_updated', loadData)
    return () => window.removeEventListener('threadline_store_updated', loadData)
  }, [tutorId])

  const firstName = user?.name ? user.name.split(' ')[0] : 'there'

  // Confirmed upcoming sessions
  const upcomingSessions = bookings
    .filter((b) => b.status === 'confirmed')
    .sort((a, b) => (a.date > b.date ? 1 : -1))

  // Pending booking requests
  const pendingRequests = bookings.filter((b) => b.status === 'pending')

  // Real earnings
  const earningsRecords = getTutorEarnings(tutorId)
  const totalEarnings = earningsRecords.reduce((sum, r) => sum + r.amount, 0)

  // Unique student IDs
  const activeStudentIds = Array.from(new Set(bookings.map((b) => b.studentId)))

  function handleAcceptRequest(booking: Booking) {
    saveBooking({ ...booking, status: 'confirmed' })
    setBookings(getBookings(tutorId))
  }

  function handleDeclineRequest(booking: Booking) {
    saveBooking({ ...booking, status: 'cancelled' })
    setBookings(getBookings(tutorId))
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* ───────────────────────── Header ───────────────────────── */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Welcome, {firstName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tutor Workspace · Manage your teaching schedule, availability, and active student context.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/tutor/schedule" className={buttonClasses('primary', 'sm')}>
            <Calendar size={14} />
            Manage Availability
          </Link>
          <Link to="/tutor/services" className={buttonClasses('secondary', 'sm')}>
            <Compass size={14} />
            Services & Rates
          </Link>
        </div>
      </div>

      {/* ───────────────────────── Verification Status Banner ───────────────────────── */}
      {user?.verificationStatus === 'pending' && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-5 text-amber-900 shadow-xs">
          <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-amber-950">Tutor Verification Status: Pending Administrative Review</span>
              <span className="rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900">
                Awaiting Verification
              </span>
            </div>
            <p className="mt-1.5 text-xs text-amber-800 leading-relaxed">
              Your tutor onboarding has been recorded in your profile. Your account is currently in <strong>pending</strong> status while credentials and teaching qualifications are reviewed. During this stage, you may configure your schedule, services, and rates. Public bookable listings require administrator approval.
            </p>
          </div>
        </div>
      )}
      {user?.verificationStatus === 'approved' && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-5 py-4 text-emerald-900 shadow-xs">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div className="flex-1 text-xs text-emerald-800">
            <strong className="font-semibold text-emerald-950">Verified Educator Status Active.</strong> Your tutor profile is officially approved and visible in the public discovery catalog for student bookings.
          </div>
        </div>
      )}
      {user?.verificationStatus === 'rejected' && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 px-5 py-4 text-rose-900 shadow-xs">
          <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <div className="flex-1 text-xs text-rose-800">
            <strong className="font-semibold text-rose-950">Verification Notice:</strong> Your tutor listing application was not approved. Please reach out to Threadline support if you believe this was in error.
          </div>
        </div>
      )}

      {/* ───────────────────────── Profile Completion Checklist ───────────────────────── */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Tutor Setup
              </span>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-primary">
                Profile Active
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              Complete your educator profile to attract students
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ensure your teaching formats, studio locations, and availability calendar are up to date.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/tutor/services" className={buttonClasses('secondary', 'sm')}>
              <Settings size={14} />
              Edit Services
            </Link>
            <Link to="/tutor/schedule" className={buttonClasses('primary', 'sm')}>
              <Plus size={14} />
              Add Slots
            </Link>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>Account created ({user?.email})</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>Role: Professional Tutor</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-700">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>AI Continuity Enabled</span>
          </div>
        </div>
      </div>

      {/* ───────────────────────── Operational Metrics Strip ───────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <Calendar size={13} className="text-slate-400" />
            Confirmed Lessons
          </span>
          <span className="text-xl font-bold text-slate-900">{upcomingSessions.length}</span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <Users size={13} className="text-slate-400" />
            Active Students
          </span>
          <span className="text-xl font-bold text-slate-900">{activeStudentIds.length}</span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <Clock size={13} className="text-slate-400" />
            Pending Requests
          </span>
          <span className="text-xl font-bold text-slate-900">{pendingRequests.length}</span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <DollarSign size={13} className="text-slate-400" />
            Completed Earnings
          </span>
          <span className="text-xl font-bold text-slate-900">{formatINR(totalEarnings)}</span>
        </div>
      </div>

      {/* ───────────────────────── Main Workspace Grid ───────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column (2 cols): Upcoming Schedule & Requests */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Upcoming Teaching Sessions */}
          <Card className="p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Upcoming Teaching Schedule</h3>
              <Link to="/tutor/schedule" className="text-xs font-medium text-primary hover:underline">
                View Full Calendar →
              </Link>
            </div>

            {upcomingSessions.length > 0 ? (
              <div className="flex flex-col gap-3">
                {upcomingSessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">{s.subject}</span>
                        <FormatBadge format={s.format} />
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Calendar size={12} className="text-slate-400" />
                          {formatLessonDateLabel(s.date, s.time)}
                        </span>
                        <span>{s.durationMinutes} min</span>
                        {s.locationDetails && (
                          <span className="truncate max-w-[200px] text-slate-500">
                            · {s.locationDetails}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {s.format === 'online' ? (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => navigate(`/tutor/lesson/${s.id}/live`)}
                        >
                          <Video size={13} />
                          Launch Session
                        </Button>
                      ) : (
                        <Link to="/tutor/messages" className={buttonClasses('secondary', 'sm')}>
                          Contact Student
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 mb-3">
                  <Calendar size={20} />
                </div>
                <h4 className="text-sm font-semibold text-slate-900">No scheduled sessions</h4>
                <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
                  When students book lessons from your public profile, they will appear on this schedule.
                </p>
                <Link to="/tutor/schedule" className={buttonClasses('primary', 'sm', 'mt-4')}>
                  Set Availability Slots
                </Link>
              </div>
            )}
          </Card>

          {/* Pending Booking Requests */}
          <Card className="p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Pending Booking Requests</h3>
              <span className="text-xs text-slate-500">{pendingRequests.length} pending</span>
            </div>

            {pendingRequests.length > 0 ? (
              <div className="flex flex-col gap-3">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-amber-100 bg-amber-50/30 p-4 sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">{req.subject}</span>
                        <FormatBadge format={req.format} />
                      </div>
                      <div className="mt-1 flex items-center gap-2.5 text-xs text-slate-500">
                        <span>{formatLessonDateLabel(req.date, req.time)}</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-800">{formatINR(req.price)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAcceptRequest(req)}
                      >
                        <CheckCircle2 size={13} />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeclineRequest(req)}
                        className="text-slate-500 hover:text-red-600"
                      >
                        <XCircle size={13} />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                <p className="text-xs text-slate-500">No pending booking requests at this time.</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column (1 col): Active Students & Quick Links */}
        <div className="flex flex-col gap-6">
          <Card className="p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Active Students</h3>
              <Link to="/tutor/students" className="text-xs font-medium text-primary hover:underline">
                View All →
              </Link>
            </div>

            {activeStudentIds.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {activeStudentIds.map((sid) => (
                  <div key={sid} className="flex items-center gap-2.5 rounded-lg border border-slate-100 p-2 text-xs">
                    <Avatar name={`Student ${sid.slice(-4)}`} size="sm" className="h-7 w-7" />
                    <span className="font-medium text-slate-800">Student #{sid.slice(-4)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
                  <Users size={18} />
                </div>
                <h4 className="text-xs font-semibold text-slate-800">No active students yet</h4>
                <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                  Once students book sessions with you, their profiles and learning continuity notes will appear here.
                </p>
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-3">
              Quick Setup Links
            </h3>
            <div className="flex flex-col gap-2 text-xs">
              <Link
                to="/tutor/services"
                className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <span>Manage Teaching Rates & Travel Radius</span>
                <span className="text-slate-400">→</span>
              </Link>
              <Link
                to="/tutor/schedule"
                className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <span>Edit Weekly Availability Calendar</span>
                <span className="text-slate-400">→</span>
              </Link>
              <Link
                to="/tutor/courses"
                className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <span>Create a Structured Cohort Course</span>
                <span className="text-slate-400">→</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

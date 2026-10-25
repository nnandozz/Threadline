import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  DollarSign,
  Calendar,
  ShieldCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { buttonClasses } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { getBookings } from '@/lib/marketplaceStore'
import { getTutorEarnings } from '@/lib/userDataStore'
import { formatINR } from '@/lib/utils'

export function TutorEarningsPage() {
  const { user } = useAuth()
  const tutorId = user?.id || ''
  const [earnings, setEarnings] = useState(() => getTutorEarnings(tutorId))
  const [confirmedBookings, setConfirmedBookings] = useState(() =>
    getBookings(tutorId).filter((b) => b.status === 'confirmed'),
  )

  useEffect(() => {
    if (!tutorId) return
    setEarnings(getTutorEarnings(tutorId))
    setConfirmedBookings(getBookings(tutorId).filter((b) => b.status === 'confirmed'))
  }, [tutorId])

  const totalPaid = earnings.reduce((sum, r) => sum + r.amount, 0)
  const pendingBookingRevenue = confirmedBookings.reduce((sum, b) => sum + b.price, 0)

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Earnings & Payout Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track revenue across your online sessions, in-person lessons, and structured courses.
        </p>
      </div>

      {/* Payout Security Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-4 text-xs text-slate-600 shadow-xs">
        <ShieldCheck size={18} className="shrink-0 text-emerald-600 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Secure Direct Payouts:</span> Lesson fees are held in escrow at the time of booking and transferred automatically to your verified bank account following completed sessions.
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs text-slate-500">Disbursed Earnings</span>
          <span className="text-2xl font-bold text-slate-900">{formatINR(totalPaid)}</span>
          <span className="text-[11px] text-slate-400 mt-1">Available for withdrawal</span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs text-slate-500">Scheduled Lesson Pipeline</span>
          <span className="text-2xl font-bold text-slate-900">{formatINR(pendingBookingRevenue)}</span>
          <span className="text-[11px] text-slate-400 mt-1">{confirmedBookings.length} confirmed upcoming lessons</span>
        </div>

        <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs text-slate-500">Hourly Rate Base</span>
          <span className="text-2xl font-bold text-slate-900">{formatINR(user?.pricePerHour || 600)}/hr</span>
          <Link to="/tutor/services" className="text-[11px] font-medium text-primary hover:underline mt-1">
            Update pricing in services →
          </Link>
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Transaction History</h3>

        {earnings.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {earnings.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3.5 text-xs">
                <div>
                  <p className="font-semibold text-slate-900">{tx.lessonTitle}</p>
                  <p className="text-slate-400 mt-0.5">{tx.studentName} · {tx.date}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 text-sm">{formatINR(tx.amount)}</span>
                  <Badge tone={tx.status === 'paid' ? 'success' : 'neutral'} className="ml-2">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-3">
              <DollarSign size={20} />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">No completed payouts yet</h4>
            <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
              Once you conduct lessons with students, your payouts and transaction ledger will appear here.
            </p>
            <Link to="/tutor/schedule" className={buttonClasses('primary', 'sm', 'mt-4')}>
              <Calendar size={14} />
              Set Availability
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

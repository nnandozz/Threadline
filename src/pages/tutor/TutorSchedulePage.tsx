import { useState, useEffect } from 'react'
import {
  Calendar,
  MapPin,
  Plus,
  Trash2,
  Clock,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FormatBadge } from '@/components/ui/FormatBadge'
import { useAuth } from '@/context/AuthContext'
import { getBookings } from '@/lib/marketplaceStore'
import { formatLessonDateLabel } from '@/lib/utils'
import type { TeachingFormat, Booking } from '@/types'

interface ScheduleSlot {
  id: string
  date: string
  time: string
  durationMinutes: number
  format: TeachingFormat
  studentName?: string
  status: 'booked' | 'available'
  location?: string
}

export function TutorSchedulePage() {
  const { user } = useAuth()
  const tutorId = user?.id || ''
  const [slots, setSlots] = useState<ScheduleSlot[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  // Form state
  const [newDate, setNewDate] = useState('2026-08-20')
  const [newTime, setNewTime] = useState('10:00')
  const [newDuration, setNewDuration] = useState(60)
  const [newFormat, setNewFormat] = useState<TeachingFormat>('online')
  const [newLocation, setNewLocation] = useState('')

  useEffect(() => {
    if (!tutorId) return
    const raw = localStorage.getItem(`threadline_schedule_${tutorId}`)
    if (raw) {
      try {
        setSlots(JSON.parse(raw))
      } catch {
        setSlots([])
      }
    }
    setBookings(getBookings(tutorId).filter((b) => b.status === 'confirmed'))
  }, [tutorId])

  function saveSlots(updated: ScheduleSlot[]) {
    setSlots(updated)
    if (tutorId) {
      localStorage.setItem(`threadline_schedule_${tutorId}`, JSON.stringify(updated))
    }
  }

  function handleAddSlot(e: React.FormEvent) {
    e.preventDefault()
    const newSlot: ScheduleSlot = {
      id: `slot-${Date.now()}`,
      date: newDate,
      time: newTime,
      durationMinutes: newDuration,
      format: newFormat,
      location: newLocation || undefined,
      status: 'available',
    }
    saveSlots([newSlot, ...slots])
    setShowAddModal(false)
  }

  function handleDeleteSlot(id: string) {
    saveSlots(slots.filter((s) => s.id !== id))
  }

  // Combine custom available slots + confirmed student bookings
  const allScheduledItems = [
    ...bookings.map((b) => ({
      id: b.id,
      date: b.date,
      time: b.time,
      durationMinutes: b.durationMinutes,
      format: b.format,
      studentName: `Student #${b.studentId.slice(-4)}`,
      status: 'booked' as const,
      location: b.locationDetails,
    })),
    ...slots,
  ].sort((a, b) => (a.date > b.date ? 1 : -1))

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Teaching Schedule & Availability
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure your available booking slots and manage scheduled student sessions across online and in-person formats.
          </p>
        </div>

        <Button size="md" variant="primary" onClick={() => setShowAddModal(true)}>
          <Plus size={15} />
          Add Available Slot
        </Button>
      </div>

      {allScheduledItems.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allScheduledItems.map((slot) => (
            <div
              key={slot.id}
              className={`flex flex-col justify-between rounded-xl border p-5 shadow-xs transition-all ${
                slot.status === 'booked'
                  ? 'border-indigo-100 bg-indigo-50/20'
                  : 'border-slate-200/80 bg-white'
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Badge tone={slot.status === 'booked' ? 'primary' : 'success'}>
                    {slot.status === 'booked' ? 'Booked Session' : 'Available for Booking'}
                  </Badge>
                  <FormatBadge format={slot.format} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {formatLessonDateLabel(slot.date, slot.time)}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={12} className="text-slate-400" />
                    <span>{slot.durationMinutes} minutes duration</span>
                  </div>
                </div>

                {slot.studentName && (
                  <p className="text-xs font-medium text-slate-700 bg-white p-2 rounded-lg border border-slate-100">
                    Student: {slot.studentName}
                  </p>
                )}

                {slot.location && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{slot.location}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[11px] text-slate-400">Slot ID: {slot.id.slice(-6)}</span>
                {slot.status === 'available' && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-3">
            <Calendar size={22} />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No availability slots created yet</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
            Create available dates and times for online sessions or studio lessons so prospective students can discover and book you.
          </p>
          <Button size="sm" variant="primary" onClick={() => setShowAddModal(true)} className="mt-4">
            <Plus size={14} />
            Create Your First Slot
          </Button>
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Availability Slot</h3>
            <p className="text-xs text-slate-500 mb-4">
              Students will be able to book this slot directly from your public tutor profile.
            </p>

            <form onSubmit={handleAddSlot} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700">Date (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Time (24h)</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Duration (min)</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:border-primary focus:outline-none"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Teaching Format</label>
                <select
                  value={newFormat}
                  onChange={(e) => setNewFormat(e.target.value as TeachingFormat)}
                  className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:border-primary focus:outline-none"
                >
                  <option value="online">Online Video</option>
                  <option value="in-person-tutor">In-Person (Your Teaching Studio)</option>
                  <option value="in-person-student">In-Person (Travel to Student's Home)</option>
                </select>
              </div>

              {newFormat !== 'online' && (
                <div>
                  <label className="text-xs font-semibold text-slate-700">Location Notes / Address</label>
                  <input
                    type="text"
                    placeholder="e.g. South Extension Studio #4, New Delhi or Koramangala Hub"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-900 focus:border-primary focus:outline-none"
                  />
                </div>
              )}

              <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <Button size="sm" variant="ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Save Slot
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

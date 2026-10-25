import { getSupabaseClient } from '@/lib/supabaseClient'
import type { Booking, BookingStatus, UserRole } from '@/types'
import {
  saveBooking as saveLocalBooking,
  hasBookingConflict as hasLocalBookingConflict,
} from '@/lib/marketplaceStore'

export interface BookingServiceResult<T> {
  data?: T
  error?: string
  isMissingSchema?: boolean
}

interface RawDbBooking {
  id: string
  student_id: string
  student_name: string | null
  tutor_id: string
  subject: string
  type: string
  format: string
  date: string
  time: string
  duration_minutes: number
  price: number
  status: string
  location_details: string | null
  online_meeting_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

function mapDbToBooking(row: RawDbBooking): Booking {
  return {
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name || undefined,
    tutorId: row.tutor_id,
    type: row.type as Booking['type'],
    subject: row.subject,
    format: row.format as Booking['format'],
    date: row.date,
    time: row.time,
    durationMinutes: Number(row.duration_minutes),
    price: Number(row.price),
    status: row.status as BookingStatus,
    locationDetails: row.location_details || undefined,
    onlineMeetingUrl: row.online_meeting_url || undefined,
    notes: row.notes || undefined,
    createdAt: row.created_at,
  }
}

function mapBookingToDb(b: Booking): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    student_id: b.studentId,
    student_name: b.studentName || null,
    tutor_id: b.tutorId,
    subject: b.subject,
    type: b.type,
    format: b.format,
    date: b.date,
    time: b.time,
    duration_minutes: b.durationMinutes,
    price: b.price,
    status: b.status,
    location_details: b.locationDetails || null,
    online_meeting_url: b.onlineMeetingUrl || null,
    notes: b.notes || null,
  }

  // If ID is a valid UUID, include it; otherwise let Supabase default gen_random_uuid()
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(b.id)
  if (isUuid) {
    payload.id = b.id
  }

  return payload
}

/**
 * Fetches bookings for a student or tutor from Supabase.
 * Falls back to local storage cache if the bookings table has not been applied yet.
 */
export async function fetchUserBookings(
  userId: string,
  role: UserRole,
): Promise<{ bookings: Booking[]; isFromDatabase: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient()
    const query = supabase.from('bookings').select('*')

    if (role === 'student') {
      query.eq('student_id', userId)
    } else {
      query.eq('tutor_id', userId)
    }

    query.order('date', { ascending: true })

    const { data, error } = await query

    if (error) {
      const isMissing =
        error.code === 'PGRST205' ||
        error.code === '42P01' ||
        (error.message && error.message.toLowerCase().includes('schema cache'))

      return {
        bookings: [],
        isFromDatabase: false,
        error: isMissing
          ? 'Database table "public.bookings" is not found in Supabase. Please apply migration.'
          : error.message,
      }
    }

    const dbBookings = (data as RawDbBooking[]).map(mapDbToBooking)

    // Sync remote bookings into local storage cache
    dbBookings.forEach((b) => saveLocalBooking(b))

    return { bookings: dbBookings, isFromDatabase: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to query bookings.'
    return { bookings: [], isFromDatabase: false, error: msg }
  }
}

/**
 * Creates a new booking request in Supabase with status 'pending'.
 * Enforces conflict detection and reports true database status.
 */
export async function createBooking(booking: Booking): Promise<BookingServiceResult<Booking>> {
  // 1. Client-side conflict check against current cache
  if (hasLocalBookingConflict(booking.tutorId, booking.date, booking.time)) {
    return { error: 'That time slot is already requested or booked with this tutor.' }
  }

  const pendingBooking: Booking = {
    ...booking,
    status: 'pending',
  }

  try {
    const supabase = getSupabaseClient()
    const dbPayload = mapBookingToDb(pendingBooking)

    const { data, error } = await supabase
      .from('bookings')
      .insert(dbPayload)
      .select('*')
      .maybeSingle()

    if (error) {
      if (error.code === '23505') {
        return { error: 'Conflict: This time slot is already booked for this tutor.' }
      }
      return { error: error.message }
    }

    const savedBooking = data ? mapDbToBooking(data as RawDbBooking) : pendingBooking
    saveLocalBooking(savedBooking)
    return { data: savedBooking }
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Network failure: could not create booking in database.' }
  }
}

/**
 * Updates a booking's status in Supabase (tutor confirms/cancels, or student cancels).
 */
export async function updateBookingStatus(
  bookingId: string,
  newStatus: 'confirmed' | 'cancelled',
): Promise<BookingServiceResult<Booking>> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select('*')
      .maybeSingle()

    if (error) {
      return { error: error.message }
    }

    if (data) {
      const updated = mapDbToBooking(data as RawDbBooking)
      saveLocalBooking(updated)
      return { data: updated }
    }

    return { error: 'Booking not found or you are not authorized to update it.' }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network failure: could not update booking.'
    return { error: msg }
  }
}

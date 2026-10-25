-- ==============================================================================
-- Threadline: Supabase Database Migration - Bookings & Tutoring Requests
-- Migration ID: 20261025000000_create_bookings.sql
-- Description:
--   1. Creates public.bookings table for persistent student-tutor lesson requests.
--   2. Enforces valid booking types ('single', 'package', 'course', 'group')
--      and valid statuses ('pending', 'confirmed', 'completed', 'cancelled').
--   3. Adds a unique partial index to mathematically prevent double-booking
--      a tutor for the same date and time while status is 'pending' or 'confirmed'.
--   4. Enables Row Level Security (RLS) on public.bookings:
--      - Students can SELECT only bookings where student_id = auth.uid().
--      - Tutors can SELECT only bookings where tutor_id = auth.uid()::text.
--      - Students can INSERT bookings with student_id = auth.uid() and status = 'pending'.
--      - Students can UPDATE only their own bookings and only set status = 'cancelled'.
--      - Tutors can UPDATE only bookings assigned to them and only set status to 'confirmed' or 'cancelled'.
--   5. Installs BEFORE UPDATE trigger (protect_booking_fields) preventing mutations
--      to student_id, tutor_id, subject, price, date, time, or format.
-- ==============================================================================

-- 1. Create public.bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name TEXT,
  tutor_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'single' CHECK (type IN ('single', 'package', 'course', 'group')),
  format TEXT NOT NULL CHECK (format IN ('online', 'in-person-tutor', 'in-person-student', 'hybrid', 'group')),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60 CHECK (duration_minutes > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  location_details TEXT,
  online_meeting_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Documentation comments
COMMENT ON TABLE public.bookings IS 'Tutoring session booking requests and confirmed appointments.';
COMMENT ON COLUMN public.bookings.id IS 'Primary key UUID for the booking record.';
COMMENT ON COLUMN public.bookings.student_id IS 'UUID of the authenticated student who created the booking.';
COMMENT ON COLUMN public.bookings.tutor_id IS 'ID of the assigned tutor (UUID string for registered tutors or slug for seed tutors).';
COMMENT ON COLUMN public.bookings.status IS 'Current lifecycle state: pending, confirmed, completed, or cancelled.';

-- 2. Indexes for efficient lookup
CREATE INDEX IF NOT EXISTS idx_bookings_student ON public.bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tutor ON public.bookings(tutor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);

-- 3. Database Constraint: Prevent Double Booking for the same tutor & time slot
-- Mathematically prevents conflicting active bookings at the database level.
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_no_overlap
  ON public.bookings (tutor_id, date, time)
  WHERE (status IN ('pending', 'confirmed'));

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 5. Revoke write privileges from public and anon
REVOKE ALL ON public.bookings FROM PUBLIC, anon;

-- Grant standard permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;

-- RLS Policy: Students can view their own bookings
DROP POLICY IF EXISTS "Students can read own bookings" ON public.bookings;
CREATE POLICY "Students can read own bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

-- RLS Policy: Tutors can view bookings addressed to them
DROP POLICY IF EXISTS "Tutors can read assigned bookings" ON public.bookings;
CREATE POLICY "Tutors can read assigned bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = tutor_id);

-- RLS Policy: Students can create booking requests for themselves with status = 'pending'
DROP POLICY IF EXISTS "Students can create pending booking requests" ON public.bookings;
CREATE POLICY "Students can create pending booking requests"
  ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = student_id
    AND status = 'pending'
  );

-- RLS Policy: Students can cancel their own bookings
DROP POLICY IF EXISTS "Students can cancel own bookings" ON public.bookings;
CREATE POLICY "Students can cancel own bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (
    auth.uid() = student_id
    AND status = 'cancelled'
  );

-- RLS Policy: Tutors can accept or decline bookings assigned to them
DROP POLICY IF EXISTS "Tutors can update assigned booking status" ON public.bookings;
CREATE POLICY "Tutors can update assigned booking status"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = tutor_id)
  WITH CHECK (
    auth.uid()::text = tutor_id
    AND status IN ('confirmed', 'cancelled')
  );

-- 6. Trigger Function: Protect Critical Booking Fields Against Tampering
CREATE OR REPLACE FUNCTION public.protect_booking_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  -- id cannot be changed
  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Modifying booking id is not permitted.';
  END IF;

  -- student_id cannot be changed
  IF NEW.student_id IS DISTINCT FROM OLD.student_id THEN
    RAISE EXCEPTION 'Modifying booking student_id is not permitted.';
  END IF;

  -- tutor_id cannot be changed
  IF NEW.tutor_id IS DISTINCT FROM OLD.tutor_id THEN
    RAISE EXCEPTION 'Modifying booking tutor_id is not permitted.';
  END IF;

  -- price cannot be changed once agreed upon
  IF NEW.price IS DISTINCT FROM OLD.price THEN
    RAISE EXCEPTION 'Modifying booking price is not permitted.';
  END IF;

  -- date and time cannot be modified directly (requires re-booking)
  IF NEW.date IS DISTINCT FROM OLD.date OR NEW.time IS DISTINCT FROM OLD.time THEN
    RAISE EXCEPTION 'Modifying booking date or time is not permitted. Please cancel and re-book.';
  END IF;

  -- Ensure updated_at is always set
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_protect_booking_fields ON public.bookings;
CREATE TRIGGER tr_protect_booking_fields
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_booking_fields();

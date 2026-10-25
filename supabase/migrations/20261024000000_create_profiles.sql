-- ==============================================================================
-- Threadline: Supabase Database Migration - User Profiles & Role Security
-- Migration ID: 20261024000000_create_profiles.sql
-- Description:
--   1. Creates public.profiles linked to auth.users(id) with ON DELETE CASCADE.
--   2. Enforces verification_status with valid states ('not_applicable', 'pending', 'approved', 'rejected').
--   3. Enables Row Level Security (RLS) on public.profiles:
--      - Only owner can SELECT their own profile.
--      - Direct INSERT from clients is STRICTLY FORBIDDEN (no client insert policy).
--      - Only owner can UPDATE their own profile.
--      - Column privileges explicitly restrict client UPDATE to non-privileged fields.
--   4. Installs a BEFORE UPDATE trigger (protect_profile_fields) that prevents mutating
--      id, role, email, verification_status, or direct manipulation of onboarding_completed.
--   5. Creates dedicated onboarding RPC procedures (complete_student_onboarding,
--      complete_tutor_onboarding) that validate inputs before marking onboarding completed.
--   6. Installs an AFTER INSERT trigger on auth.users (SECURITY DEFINER with fixed search_path)
--      to automatically provision profiles from validated signup metadata.
--   7. Creates a public_tutor_profiles security-barrier view that safely exposes only
--      approved tutors without leaking private user fields.
-- ==============================================================================

-- 1. Create public.profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'tutor')),
  verification_status TEXT NOT NULL DEFAULT 'not_applicable' CHECK (verification_status IN ('not_applicable', 'pending', 'approved', 'rejected')),
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  avatar_url TEXT,
  headline TEXT,
  bio TEXT,
  price_per_hour NUMERIC(10, 2) CHECK (price_per_hour IS NULL OR price_per_hour >= 0),
  target_subjects TEXT[] DEFAULT '{}',
  level TEXT,
  learning_goals TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Documentation comments
COMMENT ON TABLE public.profiles IS 'User profiles and persisted role identities for Threadline students and tutors.';
COMMENT ON COLUMN public.profiles.id IS 'Primary key referencing the authenticated auth.users record.';
COMMENT ON COLUMN public.profiles.role IS 'User account role (student or tutor). Strictly protected against unauthorized mutation.';
COMMENT ON COLUMN public.profiles.verification_status IS 'Approval status for tutors. Students default to not_applicable. New tutors default to pending.';
COMMENT ON COLUMN public.profiles.onboarding_completed IS 'Flag indicating whether the student or tutor completed the onboarding flow.';

-- 2. Indexes for efficient lookup
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON public.profiles(verification_status);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Column Privileges & RLS Policies
-- Revoke default write privileges on public.profiles from anon and public
REVOKE ALL ON public.profiles FROM PUBLIC, anon;

-- Authenticated users can read and update via RLS policies
GRANT SELECT ON public.profiles TO authenticated;

-- Column privileges: authenticated users can only update non-sensitive profile columns.
-- Direct updates to id, role, email, verification_status, and onboarding_completed are denied at the privilege level.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (
  full_name,
  avatar_url,
  headline,
  bio,
  price_per_hour,
  target_subjects,
  level,
  learning_goals,
  updated_at
) ON public.profiles TO authenticated;

-- Authenticated users can read only their own profile row.
-- Prevents users from reading other users' private profile details (emails, private goals).
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Authenticated users can update only their own profile row.
-- Protected fields are enforced at both the column privilege and trigger levels.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- NOTE: Client-level INSERT policy is intentionally REMOVED.
-- Initial profile provisioning is exclusively handled by the handle_new_user trigger.
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- 5. Trigger Function: Protect Sensitive Profile Columns
-- Prevents unauthorized changes to id, role, email, verification_status, and direct onboarding_completed manipulation.
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  -- id cannot be changed
  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Modifying profile id is not permitted.';
  END IF;

  -- role cannot be changed
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Modifying profile role is not permitted.';
  END IF;

  -- email cannot be modified directly (must sync through identity provider)
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'Directly modifying profile email is not permitted.';
  END IF;

  -- verification_status cannot be self-modified by regular users
  IF NEW.verification_status IS DISTINCT FROM OLD.verification_status THEN
    RAISE EXCEPTION 'Modifying verification_status is not permitted.';
  END IF;

  -- onboarding_completed cannot be updated via direct client requests
  -- (must use the dedicated secure procedures complete_student_onboarding / complete_tutor_onboarding)
  IF NEW.onboarding_completed IS DISTINCT FROM OLD.onboarding_completed THEN
    IF current_user IN ('authenticated', 'anon') THEN
      RAISE EXCEPTION 'Modifying onboarding_completed directly is not permitted. Use the onboarding completion procedure.';
    END IF;
  END IF;

  -- Ensure updated_at is always refreshed to current timestamp
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_protect_profile_fields ON public.profiles;
CREATE TRIGGER tr_protect_profile_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_fields();

-- Clean up obsolete legacy trigger if present
DROP TRIGGER IF EXISTS tr_prevent_profile_role_change ON public.profiles;
DROP FUNCTION IF EXISTS public.prevent_profile_role_change();

-- 6. Dedicated Onboarding Completion Procedures
-- Completes student onboarding with input validation
CREATE OR REPLACE FUNCTION public.complete_student_onboarding(
  p_target_subjects TEXT[],
  p_level TEXT,
  p_learning_goals TEXT[]
)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID;
  v_updated public.profiles;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  -- Validate inputs
  IF p_target_subjects IS NULL OR array_length(p_target_subjects, 1) IS NULL OR array_length(p_target_subjects, 1) = 0 THEN
    RAISE EXCEPTION 'At least one target subject is required.';
  END IF;

  IF p_level IS NULL OR trim(p_level) = '' THEN
    RAISE EXCEPTION 'Education level is required.';
  END IF;

  IF p_learning_goals IS NULL OR array_length(p_learning_goals, 1) IS NULL OR array_length(p_learning_goals, 1) = 0 THEN
    RAISE EXCEPTION 'At least one learning goal is required.';
  END IF;

  UPDATE public.profiles
  SET
    onboarding_completed = true,
    target_subjects = p_target_subjects,
    level = trim(p_level),
    learning_goals = p_learning_goals,
    updated_at = now()
  WHERE id = v_uid AND role = 'student'
  RETURNING * INTO v_updated;

  IF v_updated.id IS NULL THEN
    RAISE EXCEPTION 'Student profile not found or role mismatch.';
  END IF;

  RETURN v_updated;
END;
$$;

-- Completes tutor onboarding with input validation
CREATE OR REPLACE FUNCTION public.complete_tutor_onboarding(
  p_target_subjects TEXT[],
  p_headline TEXT,
  p_bio TEXT,
  p_avatar_url TEXT,
  p_price_per_hour NUMERIC
)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid UUID;
  v_updated public.profiles;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Authentication required.';
  END IF;

  -- Validate inputs
  IF p_target_subjects IS NULL OR array_length(p_target_subjects, 1) IS NULL OR array_length(p_target_subjects, 1) = 0 THEN
    RAISE EXCEPTION 'At least one teaching subject is required.';
  END IF;

  IF p_bio IS NULL OR trim(p_bio) = '' THEN
    RAISE EXCEPTION 'Tutor biography is required.';
  END IF;

  IF p_price_per_hour IS NULL OR p_price_per_hour <= 0 THEN
    RAISE EXCEPTION 'Valid hourly rate greater than 0 is required.';
  END IF;

  UPDATE public.profiles
  SET
    onboarding_completed = true,
    target_subjects = p_target_subjects,
    headline = COALESCE(NULLIF(trim(p_headline), ''), array_to_string(p_target_subjects, ' & ') || ' tutor'),
    bio = trim(p_bio),
    avatar_url = p_avatar_url,
    price_per_hour = p_price_per_hour,
    updated_at = now()
  WHERE id = v_uid AND role = 'tutor'
  RETURNING * INTO v_updated;

  IF v_updated.id IS NULL THEN
    RAISE EXCEPTION 'Tutor profile not found or role mismatch.';
  END IF;

  RETURN v_updated;
END;
$$;

-- Restrict RPC execution permissions
REVOKE EXECUTE ON FUNCTION public.complete_student_onboarding(TEXT[], TEXT, TEXT[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.complete_student_onboarding(TEXT[], TEXT, TEXT[]) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.complete_tutor_onboarding(TEXT[], TEXT, TEXT, TEXT, NUMERIC) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.complete_tutor_onboarding(TEXT[], TEXT, TEXT, TEXT, NUMERIC) TO authenticated;

-- 7. Trigger Function: Handle New User Registration
-- When a user registers through Supabase Auth, this SECURITY DEFINER trigger
-- provisions their public.profiles row automatically using the metadata provided
-- at signup, sanitizing and defaulting the role to 'student' if an invalid role was supplied.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  assigned_role TEXT;
  user_full_name TEXT;
  user_avatar TEXT;
  initial_verification TEXT;
BEGIN
  -- Extract and validate the role from metadata. Default to 'student' if missing or invalid.
  assigned_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  IF assigned_role NOT IN ('student', 'tutor') THEN
    assigned_role := 'student';
  END IF;

  -- Students are not_applicable; new tutors are placed into pending verification
  IF assigned_role = 'tutor' THEN
    initial_verification := 'pending';
  ELSE
    initial_verification := 'not_applicable';
  END IF;

  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  user_avatar := NEW.raw_user_meta_data->>'avatar_url';

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    verification_status,
    avatar_url,
    onboarding_completed,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    assigned_role,
    initial_verification,
    user_avatar,
    false,
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Restrict execution permissions on privileged trigger
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 8. Safe Public Tutor View
-- Exposes only approved, verified tutors to public search without exposing private user emails or data.
-- security_barrier = true prevents planner side-channel optimizations.
-- Non-destructive: uses CREATE OR REPLACE VIEW and ALTER VIEW to preserve dependent objects.
CREATE OR REPLACE VIEW public.public_tutor_profiles AS
SELECT
  p.id,
  p.full_name,
  p.avatar_url,
  p.headline,
  p.bio,
  p.price_per_hour,
  p.target_subjects,
  p.level,
  p.verification_status,
  p.created_at
FROM public.profiles p
WHERE p.role = 'tutor'
  AND p.verification_status = 'approved'
  AND p.onboarding_completed = true;

-- Enforce security_barrier option non-destructively
ALTER VIEW public.public_tutor_profiles SET (security_barrier = true);

COMMENT ON VIEW public.public_tutor_profiles IS 'Public discovery view for verified, approved tutors. Sensitive fields like email are excluded.';

-- Ensure no write operations can be performed against the view
REVOKE ALL ON public.public_tutor_profiles FROM PUBLIC, anon, authenticated;
-- Allow authenticated and anonymous users to query public tutor profiles
GRANT SELECT ON public.public_tutor_profiles TO anon, authenticated;

-- ==============================================================================
-- Threadline: Supabase Database Migration - Admin Tutor Approval
-- Migration ID: 20261025000001_admin_tutor_approval.sql
-- Description:
--   1. Updates `protect_profile_fields()` so that `verification_status` modification
--      is strictly denied for regular client roles (`authenticated`, `anon`), matching
--      the guard on `onboarding_completed` and preserving the trigger for all callers.
--   2. Introduces a dedicated, privileged administrative RPC `admin_set_tutor_verification`
--      restricted exclusively to database administrators (`postgres`, `service_role`).
--      Regular users (`authenticated`, `anon`) have all execute permissions revoked.
-- ==============================================================================

-- 1. Update protect_profile_fields trigger function
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

  -- verification_status cannot be self-modified by regular client users
  IF NEW.verification_status IS DISTINCT FROM OLD.verification_status THEN
    IF current_user IN ('authenticated', 'anon') THEN
      RAISE EXCEPTION 'Modifying verification_status is not permitted.';
    END IF;
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

-- 2. Privileged Admin Procedure for Tutor Verification
CREATE OR REPLACE FUNCTION public.admin_set_tutor_verification(
  p_tutor_id UUID,
  p_status TEXT
)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_updated public.profiles;
BEGIN
  -- Restrict execution: only database superusers or service_role can execute
  IF current_user IN ('authenticated', 'anon') THEN
    RAISE EXCEPTION 'Access denied. Administrative privileges required.';
  END IF;

  IF p_status NOT IN ('pending', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid verification status: %. Must be pending, approved, or rejected.', p_status;
  END IF;

  UPDATE public.profiles
  SET
    verification_status = p_status,
    updated_at = now()
  WHERE id = p_tutor_id AND role = 'tutor'
  RETURNING * INTO v_updated;

  IF v_updated.id IS NULL THEN
    RAISE EXCEPTION 'Tutor profile with ID % not found or account role is not tutor.', p_tutor_id;
  END IF;

  RETURN v_updated;
END;
$$;

-- Revoke default public execution rights
REVOKE EXECUTE ON FUNCTION public.admin_set_tutor_verification(UUID, TEXT) FROM PUBLIC, anon, authenticated;
-- Grant exclusively to privileged database roles
GRANT EXECUTE ON FUNCTION public.admin_set_tutor_verification(UUID, TEXT) TO postgres, service_role;

COMMENT ON FUNCTION public.admin_set_tutor_verification(UUID, TEXT) IS 'Administrative function to approve or reject tutor profiles. Restricted to postgres and service_role.';

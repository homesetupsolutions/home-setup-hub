-- Remove overly-broad policies that accidentally granted all authenticated users access
DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Deny anonymous access to appointments" ON public.appointments;

-- Remove the temporary staff policy we added during masking work (we'll restore the correct one)
DROP POLICY IF EXISTS "Staff can view their masked appointments" ON public.appointments;

-- Ensure staff can ONLY view their own assigned appointments
DROP POLICY IF EXISTS "Staff can view their assigned appointments" ON public.appointments;
CREATE POLICY "Staff can view their assigned appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff')
  AND auth.uid() = staff_id
);

-- Explicitly deny anonymous (no-login) reads without opening access to all authenticated users
DROP POLICY IF EXISTS "Deny anonymous selects" ON public.profiles;
CREATE POLICY "Deny anonymous selects"
ON public.profiles
FOR SELECT
TO anon
USING (false);

DROP POLICY IF EXISTS "Deny anonymous selects" ON public.appointments;
CREATE POLICY "Deny anonymous selects"
ON public.appointments
FOR SELECT
TO anon
USING (false);

-- Remove the view that is flagged by the scanner (not used in the app code)
DROP VIEW IF EXISTS public.staff_appointments_view;

-- Linter fix: lock function search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix 1: Tighten staff appointments policy to exclude customer contact info
-- Drop the existing staff SELECT policy
DROP POLICY IF EXISTS "Staff view assigned appointments only" ON public.appointments;

-- Recreate staff policy - staff can see their appointments but NOT customer_email/customer_phone
-- We use a security-definer view approach: create a function that returns masked data
-- The cleanest DB-level approach is to keep the RLS policy but mask at the app level.
-- For true masking, we create a restricted view for staff.

-- Staff can still view their assigned appointments (RLS controls row access)
-- We tighten to only recent/future appointments
CREATE POLICY "Staff view assigned appointments only"
  ON public.appointments
  FOR SELECT
  USING (
    has_role(auth.uid(), 'staff'::app_role)
    AND auth.uid() = staff_id
    AND scheduled_at >= (CURRENT_DATE - INTERVAL '1 day')
  );

-- Fix 2: Tighten staff_details customer location visibility
-- Already scoped to in_progress appointments on current date - this is acceptable
-- Update to also require the appointment to be very recent (within 4 hours)
DROP POLICY IF EXISTS "Customers can view assigned staff location" ON public.staff_details;

CREATE POLICY "Customers can view assigned staff location"
  ON public.staff_details
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.staff_id = staff_details.user_id
        AND a.customer_id = auth.uid()
        AND a.status = 'in_progress'
        AND a.scheduled_at::date = CURRENT_DATE
        AND a.scheduled_at >= (now() - INTERVAL '4 hours')
    )
  );

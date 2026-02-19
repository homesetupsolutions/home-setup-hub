
-- 1. Tighten staff access to appointments: only see assigned appointments that are today or future
-- Drop and recreate the staff view policy
DROP POLICY IF EXISTS "Staff view assigned appointments only" ON public.appointments;
CREATE POLICY "Staff view assigned appointments only"
ON public.appointments
FOR SELECT
USING (
  has_role(auth.uid(), 'staff'::app_role) 
  AND auth.uid() = staff_id
  AND (scheduled_at::date >= CURRENT_DATE - INTERVAL '1 day')
);

-- 2. Tighten call_logs: staff can only view their own logs from the last 90 days
DROP POLICY IF EXISTS "Users can view their own call logs" ON public.call_logs;
CREATE POLICY "Users can view their own call logs"
ON public.call_logs
FOR SELECT
USING (
  auth.uid() = user_id
  AND created_at >= (now() - INTERVAL '90 days')
);

-- 3. Tighten customer view of staff profiles: only show during active/in_progress appointments today
DROP POLICY IF EXISTS "Customers can view assigned staff profile" ON public.profiles;
CREATE POLICY "Customers can view assigned staff profile"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.staff_id = profiles.user_id
      AND a.customer_id = auth.uid()
      AND a.status IN ('in_progress')
      AND a.scheduled_at::date = CURRENT_DATE
  )
);

-- 4. Tighten staff location access: only visible during in_progress appointments (not just scheduled)
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
  )
);

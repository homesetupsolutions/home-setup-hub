-- Improve appointments RLS: Staff can only view their currently assigned appointments (not past ones beyond 30 days)
DROP POLICY IF EXISTS "Staff can view their assigned appointments" ON public.appointments;
CREATE POLICY "Staff can view their assigned appointments" 
ON public.appointments FOR SELECT 
USING (
  has_role(auth.uid(), 'staff'::app_role) 
  AND auth.uid() = staff_id
  AND (
    scheduled_at >= now() - interval '7 days'
    OR status IN ('scheduled', 'in_progress')
  )
);

-- Improve call_logs RLS: Staff can only view their own call logs from the last 30 days
DROP POLICY IF EXISTS "Staff can view their own call logs" ON public.call_logs;
CREATE POLICY "Staff can view their own call logs" 
ON public.call_logs FOR SELECT 
USING (
  auth.uid() = user_id 
  AND created_at >= now() - interval '30 days'
);

-- Improve profiles RLS: Staff can only view customer profiles for upcoming/active appointments
DROP POLICY IF EXISTS "Staff can view customer profiles for their appointments" ON public.profiles;
CREATE POLICY "Staff can view customer profiles for their appointments" 
ON public.profiles FOR SELECT 
USING (
  has_role(auth.uid(), 'staff'::app_role) 
  AND EXISTS (
    SELECT 1 FROM appointments
    WHERE appointments.customer_id = profiles.user_id 
    AND appointments.staff_id = auth.uid()
    AND (
      appointments.scheduled_at >= now() - interval '1 day'
      OR appointments.status IN ('scheduled', 'in_progress')
    )
  )
);
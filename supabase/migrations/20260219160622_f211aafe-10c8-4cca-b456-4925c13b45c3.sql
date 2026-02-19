
-- Allow customers to view location data of staff assigned to their appointments
CREATE POLICY "Customers can view assigned staff location"
ON public.staff_details
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.appointments a
    WHERE a.staff_id = staff_details.user_id
      AND a.customer_id = auth.uid()
      AND a.status IN ('scheduled', 'in_progress')
      AND a.scheduled_at::date = CURRENT_DATE
  )
);

-- Allow customers to view assigned staff profiles (name)
CREATE POLICY "Customers can view assigned staff profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.appointments a
    WHERE a.staff_id = profiles.user_id
      AND a.customer_id = auth.uid()
      AND a.status IN ('scheduled', 'in_progress')
      AND a.scheduled_at::date = CURRENT_DATE
  )
);

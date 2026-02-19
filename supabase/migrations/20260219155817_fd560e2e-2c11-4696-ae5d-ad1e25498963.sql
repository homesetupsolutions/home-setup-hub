
-- Block anonymous access to profiles table
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Block anonymous access to appointments table
CREATE POLICY "Block anonymous access to appointments"
ON public.appointments
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Block anonymous access to notification_preferences table
CREATE POLICY "Block anonymous access to notification_preferences"
ON public.notification_preferences
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Block anonymous access to call_logs table
CREATE POLICY "Block anonymous access to call_logs"
ON public.call_logs
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Block anonymous access to staff_details table
CREATE POLICY "Block anonymous access to staff_details"
ON public.staff_details
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Block anonymous access to messages table
CREATE POLICY "Block anonymous access to messages"
ON public.messages
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Block anonymous access to timecards table
CREATE POLICY "Block anonymous access to timecards"
ON public.timecards
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Block anonymous access to admin_audit_log table
CREATE POLICY "Block anonymous access to admin_audit_log"
ON public.admin_audit_log
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Block anonymous access to user_roles table
CREATE POLICY "Block anonymous access to user_roles"
ON public.user_roles
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Block anonymous access to work_photos table
CREATE POLICY "Block anonymous access to work_photos"
ON public.work_photos
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

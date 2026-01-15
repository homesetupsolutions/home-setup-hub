-- Drop all existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Staff can view customer profiles for their appointments" ON public.profiles;
DROP POLICY IF EXISTS "Customers can view own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Staff view assigned appointments only" ON public.appointments;
DROP POLICY IF EXISTS "Admins can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Staff view own call logs only" ON public.call_logs;
DROP POLICY IF EXISTS "Admins can view all call logs" ON public.call_logs;
DROP POLICY IF EXISTS "Staff view own details only" ON public.staff_details;
DROP POLICY IF EXISTS "Staff update own details only" ON public.staff_details;
DROP POLICY IF EXISTS "Admins view all staff details" ON public.staff_details;
DROP POLICY IF EXISTS "Admins can manage all staff details" ON public.staff_details;
DROP POLICY IF EXISTS "Users view own messages only" ON public.messages;
DROP POLICY IF EXISTS "Recipients can mark messages read" ON public.messages;
DROP POLICY IF EXISTS "Staff view own timecards only" ON public.timecards;
DROP POLICY IF EXISTS "Admins view all timecards" ON public.timecards;
DROP POLICY IF EXISTS "Staff view own photos only" ON public.work_photos;
DROP POLICY IF EXISTS "Admins view all photos" ON public.work_photos;
DROP POLICY IF EXISTS "Users view own role only" ON public.user_roles;
DROP POLICY IF EXISTS "Admins view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;

-- Fix: Profiles - ensure users can only access their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix: Notification preferences - ensure only owner can access
DROP POLICY IF EXISTS "Deny anonymous access to notification_preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can view own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can update own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can insert own notification preferences" ON public.notification_preferences;

CREATE POLICY "Users can view own notification preferences" 
ON public.notification_preferences FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences" 
ON public.notification_preferences FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences" 
ON public.notification_preferences FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Fix: Appointments - tighten staff access to only assigned appointments
DROP POLICY IF EXISTS "Deny anonymous access to appointments" ON public.appointments;
DROP POLICY IF EXISTS "Staff can view their assigned appointments" ON public.appointments;
DROP POLICY IF EXISTS "Staff can view all appointments" ON public.appointments;

-- Customers can view appointments where they are the customer (customer_id is uuid)
CREATE POLICY "Customers can view own appointments" 
ON public.appointments FOR SELECT 
USING (auth.uid() = customer_id);

-- Staff can ONLY view appointments assigned to them
CREATE POLICY "Staff view assigned appointments only" 
ON public.appointments FOR SELECT 
USING (
  has_role(auth.uid(), 'staff'::app_role) 
  AND auth.uid() = staff_id
);

-- Admins can view all appointments
CREATE POLICY "Admins can view all appointments" 
ON public.appointments FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix: Call logs - ensure staff can only see their own logs (user_id is uuid)
DROP POLICY IF EXISTS "Deny anonymous access to call_logs" ON public.call_logs;
DROP POLICY IF EXISTS "Staff can view their own call logs" ON public.call_logs;

CREATE POLICY "Staff view own call logs only" 
ON public.call_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all call logs" 
ON public.call_logs FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix: Staff details - ensure staff can only see their own details
DROP POLICY IF EXISTS "Deny anonymous access to staff_details" ON public.staff_details;
DROP POLICY IF EXISTS "Staff can view own details" ON public.staff_details;

CREATE POLICY "Staff view own details only" 
ON public.staff_details FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Staff update own details only" 
ON public.staff_details FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins view all staff details" 
ON public.staff_details FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all staff details" 
ON public.staff_details FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix: Messages - restrict to sender/recipient only
DROP POLICY IF EXISTS "Deny anonymous access to messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view messages they sent or received" ON public.messages;

CREATE POLICY "Users view own messages only" 
ON public.messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Recipients can mark messages read" 
ON public.messages FOR UPDATE 
USING (auth.uid() = recipient_id);

-- Fix: Timecards - staff_id is uuid, need to check against staff_details.user_id
DROP POLICY IF EXISTS "Deny anonymous access to timecards" ON public.timecards;
DROP POLICY IF EXISTS "Staff can view own timecards" ON public.timecards;

-- Staff can view timecards where staff_id matches a staff_details record they own
CREATE POLICY "Staff view own timecards only" 
ON public.timecards FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.staff_details sd 
    WHERE sd.id = timecards.staff_id 
    AND sd.user_id = auth.uid()
  )
);

CREATE POLICY "Admins view all timecards" 
ON public.timecards FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix: Work photos - staff_id is uuid, need to check against staff_details.user_id
DROP POLICY IF EXISTS "Deny anonymous access to work_photos" ON public.work_photos;
DROP POLICY IF EXISTS "Staff can view own photos" ON public.work_photos;

CREATE POLICY "Staff view own photos only" 
ON public.work_photos FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.staff_details sd 
    WHERE sd.id = work_photos.staff_id 
    AND sd.user_id = auth.uid()
  )
);

CREATE POLICY "Admins view all photos" 
ON public.work_photos FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix: User roles - only allow viewing own role
DROP POLICY IF EXISTS "Deny anonymous access to user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Users view own role only" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins view all roles" 
ON public.user_roles FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage user roles" 
ON public.user_roles FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));
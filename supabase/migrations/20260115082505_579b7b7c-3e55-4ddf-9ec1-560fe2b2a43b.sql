-- Add explicit deny policies for anonymous users on all sensitive tables
-- This ensures unauthenticated users have no access whatsoever

-- Profiles: Block anonymous access completely
CREATE POLICY "Deny anonymous access to profiles" 
ON public.profiles FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Appointments: Block anonymous access completely  
CREATE POLICY "Deny anonymous access to appointments" 
ON public.appointments FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Call logs: Block anonymous access completely
CREATE POLICY "Deny anonymous access to call_logs" 
ON public.call_logs FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Notification preferences: Block anonymous access completely
CREATE POLICY "Deny anonymous access to notification_preferences" 
ON public.notification_preferences FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Staff details: Block anonymous access completely
CREATE POLICY "Deny anonymous access to staff_details" 
ON public.staff_details FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Messages: Block anonymous access completely
CREATE POLICY "Deny anonymous access to messages" 
ON public.messages FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Timecards: Block anonymous access completely
CREATE POLICY "Deny anonymous access to timecards" 
ON public.timecards FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Work photos: Block anonymous access completely
CREATE POLICY "Deny anonymous access to work_photos" 
ON public.work_photos FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- User roles: Block anonymous access completely
CREATE POLICY "Deny anonymous access to user_roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() IS NOT NULL);
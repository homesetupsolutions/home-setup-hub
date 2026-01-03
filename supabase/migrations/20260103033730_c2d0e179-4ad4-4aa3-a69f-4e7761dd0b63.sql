-- Enable leaked password protection would be done in dashboard settings

-- Fix RLS: Add DELETE policies for admin management
CREATE POLICY "Admins can delete appointments" 
ON public.appointments 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete staff details" 
ON public.staff_details 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete user roles" 
ON public.user_roles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow users to delete their own messages
CREATE POLICY "Users can delete their own messages" 
ON public.messages 
FOR DELETE 
USING (auth.uid() = sender_id);

-- Restrict call_logs so staff can only see their own logs
DROP POLICY IF EXISTS "Admins can view all call logs" ON public.call_logs;

CREATE POLICY "Admins can view all call logs" 
ON public.call_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Staff can view their own call logs" 
ON public.call_logs 
FOR SELECT 
USING (auth.uid() = user_id);
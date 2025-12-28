-- Fix: Deny anonymous access to profiles table
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Fix: Deny anonymous access to appointments table  
CREATE POLICY "Deny anonymous access to appointments"
ON public.appointments
FOR SELECT
USING (auth.uid() IS NOT NULL);
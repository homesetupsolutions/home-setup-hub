-- Fix profiles RLS - drop restrictive policies and create permissive ones
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Deny anonymous selects" ON public.profiles;

-- Create permissive policy for users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Fix appointments RLS - drop restrictive policies and create permissive ones  
DROP POLICY IF EXISTS "Customers can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Deny anonymous selects" ON public.appointments;

-- Create permissive policy for customers to view their own appointments
CREATE POLICY "Customers can view their own appointments" 
ON public.appointments 
FOR SELECT 
TO authenticated
USING (auth.uid() = customer_id);
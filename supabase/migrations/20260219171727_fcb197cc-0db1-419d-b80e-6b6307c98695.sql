-- Remove public access to services
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;

-- Only authenticated users can view active services
CREATE POLICY "Authenticated users can view active services"
ON public.services FOR SELECT
TO authenticated
USING (is_active = true);
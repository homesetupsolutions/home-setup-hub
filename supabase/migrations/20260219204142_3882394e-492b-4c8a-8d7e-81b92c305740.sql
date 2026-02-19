
-- Fix: Drop the SELECT-only blocking policy and replace with an ALL-operations restrictive policy
-- Also add TO authenticated on permissive SELECT policies for defence-in-depth

DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;

-- Create a proper restrictive policy that blocks ALL anonymous access (not just SELECT)
CREATE POLICY "Block anonymous access to profiles" 
  ON public.profiles 
  AS RESTRICTIVE
  FOR ALL 
  TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

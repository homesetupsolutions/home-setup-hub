-- Make work-photos bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'work-photos';

-- Remove public access policy
DROP POLICY IF EXISTS "Anyone can view work photos" ON storage.objects;

-- Add staff-only view policy
CREATE POLICY "Staff can view all work photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'work-photos' 
  AND public.has_role(auth.uid(), 'staff')
);

-- Add admin view policy
CREATE POLICY "Admins can view all work photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'work-photos' 
  AND public.has_role(auth.uid(), 'admin')
);
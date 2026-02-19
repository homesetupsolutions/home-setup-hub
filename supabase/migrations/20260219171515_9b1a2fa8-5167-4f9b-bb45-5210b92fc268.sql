-- Drop old broken policies if they still exist
DROP POLICY IF EXISTS "Staff view own timecards only" ON public.timecards;
DROP POLICY IF EXISTS "Staff view own photos only" ON public.work_photos;

-- Restore full column SELECT for authenticated (admin/staff need hourly_rate via RLS)
GRANT SELECT ON public.staff_details TO authenticated;

-- Drop the customer SELECT policy on the base table; customers must use the view
DROP POLICY IF EXISTS "Assigned customers can view staff location row" ON public.staff_details;

-- Recreate view in SECURITY DEFINER (non-invoker) mode so it bypasses base-table RLS
-- and is the ONLY way customers can read assigned staff location.
DROP VIEW IF EXISTS public.assigned_staff_locations;
CREATE VIEW public.assigned_staff_locations
WITH (security_invoker = false) AS
SELECT
  sd.id,
  sd.user_id,
  sd.current_location,
  sd.location_updated_at
FROM public.staff_details sd
WHERE EXISTS (
  SELECT 1 FROM public.appointments a
  WHERE a.staff_id = sd.user_id
    AND a.customer_id = auth.uid()
    AND a.status = 'in_progress'
    AND a.scheduled_at::date = CURRENT_DATE
    AND a.scheduled_at >= now() - interval '4 hours'
);

GRANT SELECT ON public.assigned_staff_locations TO authenticated;

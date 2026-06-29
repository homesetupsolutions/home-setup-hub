
-- Create separate compensation table (admin-only)
CREATE TABLE IF NOT EXISTS public.staff_compensation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  hourly_rate numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_compensation TO authenticated;
GRANT ALL ON public.staff_compensation TO service_role;

ALTER TABLE public.staff_compensation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage staff compensation"
  ON public.staff_compensation
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Staff can view own compensation"
  ON public.staff_compensation
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Block anonymous access to staff_compensation"
  ON public.staff_compensation
  FOR ALL TO anon
  USING (false) WITH CHECK (false);

-- Move existing data
INSERT INTO public.staff_compensation (user_id, hourly_rate)
SELECT user_id, hourly_rate FROM public.staff_details WHERE hourly_rate IS NOT NULL
ON CONFLICT (user_id) DO UPDATE SET hourly_rate = EXCLUDED.hourly_rate;

-- Drop sensitive column from staff_details
ALTER TABLE public.staff_details DROP COLUMN IF EXISTS hourly_rate;

-- Switch view back to invoker (no more security-definer view linter)
DROP VIEW IF EXISTS public.assigned_staff_locations;
CREATE VIEW public.assigned_staff_locations
WITH (security_invoker = true) AS
SELECT
  sd.id,
  sd.user_id,
  sd.current_location,
  sd.location_updated_at
FROM public.staff_details sd;

GRANT SELECT ON public.assigned_staff_locations TO authenticated;

-- Re-add customer SELECT policy on staff_details (now safe — no hourly_rate to leak)
CREATE POLICY "Customers can view assigned staff location"
  ON public.staff_details
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE a.staff_id = staff_details.user_id
        AND a.customer_id = auth.uid()
        AND a.status = 'in_progress'
        AND a.scheduled_at::date = CURRENT_DATE
        AND a.scheduled_at >= now() - interval '4 hours'
    )
  );

-- Trigger for updated_at on staff_compensation
CREATE TRIGGER set_staff_compensation_updated_at
  BEFORE UPDATE ON public.staff_compensation
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

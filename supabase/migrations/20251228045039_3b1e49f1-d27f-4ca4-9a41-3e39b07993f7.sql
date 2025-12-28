-- Create a masked view for staff that hides sensitive customer contact info
CREATE OR REPLACE VIEW public.staff_appointments_view AS
SELECT 
  id,
  customer_id,
  staff_id,
  -- Mask customer name (show first name only)
  CASE 
    WHEN customer_name IS NOT NULL THEN split_part(customer_name, ' ', 1)
    ELSE NULL 
  END AS customer_name,
  -- Hide email completely for staff
  NULL::text AS customer_email,
  -- Mask phone (show last 4 digits only)
  CASE 
    WHEN customer_phone IS NOT NULL THEN '***-***-' || RIGHT(REGEXP_REPLACE(customer_phone, '[^0-9]', '', 'g'), 4)
    ELSE NULL 
  END AS customer_phone,
  -- Mask address (show city/area only, hide street)
  CASE 
    WHEN address IS NOT NULL THEN 
      CASE 
        WHEN position(',' in address) > 0 THEN substring(address from position(',' in address) + 1)
        ELSE 'Address on file'
      END
    ELSE NULL 
  END AS address,
  service_name,
  service_price,
  scheduled_at,
  duration_minutes,
  status,
  notes,
  square_booking_id,
  created_at,
  updated_at
FROM public.appointments;

-- Enable RLS on the view
ALTER VIEW public.staff_appointments_view SET (security_invoker = on);

-- Grant staff access to the view
GRANT SELECT ON public.staff_appointments_view TO authenticated;

-- Create RLS policy for the view - staff can only see their assigned appointments
CREATE POLICY "Staff can view their masked appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  auth.uid() = staff_id 
  AND public.has_role(auth.uid(), 'staff')
);

-- Drop the old staff policy that allowed full access
DROP POLICY IF EXISTS "Staff can view their assigned appointments" ON public.appointments;
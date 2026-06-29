
-- 1. AI conversations: user-scoped policies
CREATE POLICY "Users can view own conversations" ON public.ai_conversations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON public.ai_conversations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON public.ai_conversations
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON public.ai_conversations
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 2. AI memories: user-scoped policies
CREATE POLICY "Users can view own memories" ON public.ai_memories
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own memories" ON public.ai_memories
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own memories" ON public.ai_memories
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own memories" ON public.ai_memories
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. Revoke EXECUTE on SECURITY DEFINER functions from API roles.
-- These are still callable internally by RLS policies and triggers (owner context).
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- 4. staff_details: drop overly-broad customer policy that leaked hourly_rate
DROP POLICY IF EXISTS "Customers can view assigned staff location" ON public.staff_details;

-- Safe view exposing only non-sensitive location columns to assigned customers
CREATE OR REPLACE VIEW public.assigned_staff_locations
WITH (security_invoker = true) AS
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

-- Allow customers to read the view; underlying RLS still applies via security_invoker.
-- Re-add a narrow SELECT policy on staff_details that the view can use, but only
-- when invoked through this safe path. We grant per-column access instead.
CREATE POLICY "Assigned customers can view staff location row"
  ON public.staff_details
  FOR SELECT
  TO authenticated
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

-- Column-level restriction: customers (authenticated) only get safe columns.
REVOKE SELECT ON public.staff_details FROM authenticated;
GRANT SELECT (id, user_id, current_location, location_updated_at, is_active, availability, square_team_member_id, created_at, updated_at) ON public.staff_details TO authenticated;
-- Admin and staff need hourly_rate; service_role keeps full access.
GRANT SELECT (hourly_rate) ON public.staff_details TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.staff_details TO authenticated;

GRANT SELECT ON public.assigned_staff_locations TO authenticated;

-- 5. user_roles: explicit RESTRICTIVE policy preventing self-insertion by non-admins
CREATE POLICY "Only admins may insert user roles"
  ON public.user_roles
  AS RESTRICTIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 6. work-photos storage: add UPDATE policy for staff on their own files
CREATE POLICY "Staff can update own work photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'work-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'work-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Fix: Make audit log insert policy more restrictive - only authenticated admins can insert
DROP POLICY IF EXISTS "Service role can insert audit logs" ON public.admin_audit_log;

CREATE POLICY "Authenticated admins can insert audit logs"
ON public.admin_audit_log FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND has_role(auth.uid(), 'admin'::app_role)
);
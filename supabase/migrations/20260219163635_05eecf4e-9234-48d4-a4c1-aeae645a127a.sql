
-- =============================================
-- CLEANUP: Remove duplicate RLS policies
-- =============================================

-- profiles duplicates
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- notification_preferences duplicates
DROP POLICY IF EXISTS "Users can insert own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can update own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can view own notification preferences" ON public.notification_preferences;

-- appointments duplicates
DROP POLICY IF EXISTS "Customers can view own appointments" ON public.appointments;

-- user_roles duplicates
DROP POLICY IF EXISTS "Admins view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users view own role only" ON public.user_roles;

-- staff_details duplicates
DROP POLICY IF EXISTS "Admins view all staff details" ON public.staff_details;
DROP POLICY IF EXISTS "Staff view own details only" ON public.staff_details;
DROP POLICY IF EXISTS "Staff update own details only" ON public.staff_details;

-- timecards duplicates
DROP POLICY IF EXISTS "Admins view all timecards" ON public.timecards;
DROP POLICY IF EXISTS "Staff view own timecards only" ON public.timecards;

-- work_photos duplicates
DROP POLICY IF EXISTS "Admins view all photos" ON public.work_photos;
DROP POLICY IF EXISTS "Staff view own photos only" ON public.work_photos;

-- call_logs duplicates
DROP POLICY IF EXISTS "Staff view own call logs only" ON public.call_logs;

-- =============================================
-- INDEXES: Performance optimization
-- =============================================

-- Appointments: fast lookup by date, customer, staff, status
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON public.appointments (scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON public.appointments (customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_staff_id ON public.appointments (staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments (status);

-- Profiles: fast lookup by user_id
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles (user_id);

-- User roles: fast lookup by user_id
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles (user_id);

-- Staff details: fast lookup by user_id
CREATE INDEX IF NOT EXISTS idx_staff_details_user_id ON public.staff_details (user_id);

-- Timecards: fast lookup by staff and date
CREATE INDEX IF NOT EXISTS idx_timecards_staff_id ON public.timecards (staff_id);
CREATE INDEX IF NOT EXISTS idx_timecards_clock_in ON public.timecards (clock_in);

-- Call logs: fast lookup by user and date
CREATE INDEX IF NOT EXISTS idx_call_logs_user_id ON public.call_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON public.call_logs (created_at);

-- Messages: fast lookup by sender/recipient
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages (recipient_id);

-- Work photos: fast lookup by staff and appointment
CREATE INDEX IF NOT EXISTS idx_work_photos_staff_id ON public.work_photos (staff_id);
CREATE INDEX IF NOT EXISTS idx_work_photos_appointment_id ON public.work_photos (appointment_id);

-- Services: ordered listing
CREATE INDEX IF NOT EXISTS idx_services_display_order ON public.services (display_order);

# Home Setup Solutions — SQL Reference

Copy and paste any of these into the SQL editor as needed.

---

## 1. TABLES

### Profiles
```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### User Roles
```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'customer');

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
```

### Services
```sql
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🔧',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price_cents INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
```

### Appointments
```sql
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID,
  staff_id UUID,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  service_name TEXT NOT NULL,
  service_price NUMERIC,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled',
  address TEXT,
  notes TEXT,
  square_booking_id TEXT,
  reminder_morning_sent BOOLEAN DEFAULT false,
  reminder_hour_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
```

### Staff Details
```sql
CREATE TABLE IF NOT EXISTS public.staff_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hourly_rate NUMERIC,
  is_active BOOLEAN NOT NULL DEFAULT true,
  availability JSONB DEFAULT '{}',
  current_location JSONB,
  location_updated_at TIMESTAMPTZ,
  square_team_member_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.staff_details ENABLE ROW LEVEL SECURITY;
```

### Timecards
```sql
CREATE TABLE IF NOT EXISTS public.timecards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL,
  clock_in TIMESTAMPTZ NOT NULL,
  clock_out TIMESTAMPTZ,
  break_minutes INTEGER DEFAULT 0,
  notes TEXT,
  square_timecard_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.timecards ENABLE ROW LEVEL SECURITY;
```

### Call Logs
```sql
CREATE TABLE IF NOT EXISTS public.call_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  direction TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'initiated',
  customer_id TEXT,
  customer_name TEXT,
  notes TEXT,
  duration_seconds INTEGER,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
```

### Messages
```sql
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id),
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
```

### Work Photos
```sql
CREATE TABLE IF NOT EXISTS public.work_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id),
  photo_url TEXT NOT NULL,
  description TEXT,
  onedrive_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.work_photos ENABLE ROW LEVEL SECURITY;
```

### Notification Preferences
```sql
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  sms_enabled BOOLEAN DEFAULT true,
  sms_reminders BOOLEAN DEFAULT true,
  sms_promotions BOOLEAN DEFAULT false,
  email_enabled BOOLEAN DEFAULT true,
  email_reminders BOOLEAN DEFAULT true,
  email_promotions BOOLEAN DEFAULT false,
  preferred_phone VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
```

### Admin Audit Log
```sql
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
```

---

## 2. FUNCTIONS

### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
```

### Auto-create profile on signup
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NULL)
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

### Check user role
```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;
```

### Get user role
```sql
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id LIMIT 1
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;
```

---

## 3. TRIGGERS

```sql
-- Auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_details_updated_at
  BEFORE UPDATE ON public.staff_details
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

---

## 4. RLS POLICIES

### Profiles
```sql
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Customers can view assigned staff profile" ON public.profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.staff_id = profiles.user_id
      AND a.customer_id = auth.uid()
      AND a.status IN ('scheduled', 'in_progress')
      AND a.scheduled_at::date = CURRENT_DATE
  ));
CREATE POLICY "Block anonymous access to profiles" ON public.profiles FOR SELECT USING (false);
```

### User Roles
```sql
CREATE POLICY "Users can view their own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete user roles" ON public.user_roles FOR DELETE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Block anonymous access to user_roles" ON public.user_roles FOR ALL USING (false) WITH CHECK (false);
```

### Services
```sql
CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE USING (has_role(auth.uid(), 'admin'));
```

### Appointments
```sql
CREATE POLICY "Admins can view all appointments" ON public.appointments FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert appointments" ON public.appointments FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update appointments" ON public.appointments FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete appointments" ON public.appointments FOR DELETE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Customers can view their own appointments" ON public.appointments FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Staff view assigned appointments only" ON public.appointments FOR SELECT USING (has_role(auth.uid(), 'staff') AND auth.uid() = staff_id);
CREATE POLICY "Staff can update their appointments" ON public.appointments FOR UPDATE USING (auth.uid() = staff_id);
CREATE POLICY "Block anonymous access to appointments" ON public.appointments FOR ALL USING (false) WITH CHECK (false);
```

### Staff Details
```sql
CREATE POLICY "Staff can view their own details" ON public.staff_details FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Staff can update their own details" ON public.staff_details FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all staff details" ON public.staff_details FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all staff details" ON public.staff_details FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert staff details" ON public.staff_details FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete staff details" ON public.staff_details FOR DELETE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Customers can view assigned staff location" ON public.staff_details FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.staff_id = staff_details.user_id
      AND a.customer_id = auth.uid()
      AND a.status IN ('scheduled', 'in_progress')
      AND a.scheduled_at::date = CURRENT_DATE
  ));
CREATE POLICY "Block anonymous access to staff_details" ON public.staff_details FOR ALL USING (false) WITH CHECK (false);
```

### Timecards
```sql
CREATE POLICY "Staff can insert their own timecards" ON public.timecards FOR INSERT WITH CHECK (auth.uid() = staff_id);
CREATE POLICY "Staff can update their own timecards" ON public.timecards FOR UPDATE USING (auth.uid() = staff_id);
CREATE POLICY "Staff can view their own timecards" ON public.timecards FOR SELECT USING (auth.uid() = staff_id);
CREATE POLICY "Admins can view all timecards" ON public.timecards FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Block anonymous access to timecards" ON public.timecards FOR ALL USING (false) WITH CHECK (false);
```

### Call Logs
```sql
CREATE POLICY "Authenticated users can create call logs" ON public.call_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own call logs" ON public.call_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all call logs" ON public.call_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Block anonymous access to call_logs" ON public.call_logs FOR ALL USING (false) WITH CHECK (false);
```

### Messages
```sql
CREATE POLICY "Users view own messages only" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can insert messages they send" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Recipients can update messages (mark as read)" ON public.messages FOR UPDATE USING (auth.uid() = recipient_id);
CREATE POLICY "Users can delete their own messages" ON public.messages FOR DELETE USING (auth.uid() = sender_id);
CREATE POLICY "Block anonymous access to messages" ON public.messages FOR ALL USING (false) WITH CHECK (false);
```

### Work Photos
```sql
CREATE POLICY "Staff can insert their own photos" ON public.work_photos FOR INSERT WITH CHECK (auth.uid() = staff_id);
CREATE POLICY "Staff can view their own photos" ON public.work_photos FOR SELECT USING (auth.uid() = staff_id);
CREATE POLICY "Staff can delete their own photos" ON public.work_photos FOR DELETE USING (auth.uid() = staff_id);
CREATE POLICY "Admins can view all photos" ON public.work_photos FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Block anonymous access to work_photos" ON public.work_photos FOR ALL USING (false) WITH CHECK (false);
```

### Notification Preferences
```sql
CREATE POLICY "Users can view their own notification preferences" ON public.notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notification preferences" ON public.notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notification preferences" ON public.notification_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all notification preferences" ON public.notification_preferences FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Block anonymous access to notification_preferences" ON public.notification_preferences FOR ALL USING (false) WITH CHECK (false);
```

### Admin Audit Log
```sql
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_log FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated admins can insert audit logs" ON public.admin_audit_log FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Block anonymous access to admin_audit_log" ON public.admin_audit_log FOR ALL USING (false) WITH CHECK (false);
```

---

## 5. INDEXES

```sql
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON public.appointments (scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON public.appointments (customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_staff_id ON public.appointments (staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments (status);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles (user_id);
CREATE INDEX IF NOT EXISTS idx_staff_details_user_id ON public.staff_details (user_id);
CREATE INDEX IF NOT EXISTS idx_timecards_staff_id ON public.timecards (staff_id);
CREATE INDEX IF NOT EXISTS idx_timecards_clock_in ON public.timecards (clock_in);
CREATE INDEX IF NOT EXISTS idx_call_logs_user_id ON public.call_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON public.call_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages (recipient_id);
CREATE INDEX IF NOT EXISTS idx_work_photos_staff_id ON public.work_photos (staff_id);
CREATE INDEX IF NOT EXISTS idx_work_photos_appointment_id ON public.work_photos (appointment_id);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON public.services (display_order);
```

---

## 6. SEED DATA (Services)

```sql
INSERT INTO public.services (id, name, description, icon, duration_minutes, price_cents, display_order) VALUES
  ('tv-mounting', 'TV Mounting', 'Professional wall mount installation for any TV size. Includes cable management.', '📺', 60, 9900, 1),
  ('network-setup', 'Network & WiFi Setup', 'Complete WiFi optimization, router setup, and coverage extension.', '📡', 90, 14900, 2),
  ('smart-home', 'Smart Home Setup', 'Voice assistant, smart lighting, and home automation configuration.', '🏠', 120, 14900, 3),
  ('security-camera', 'Security Camera Install', 'Indoor/outdoor camera installation with app setup and monitoring.', '📹', 90, 24900, 4),
  ('computer-setup', 'Computer Setup & Repair', 'Desktop/laptop setup, data transfer, software installation, and troubleshooting.', '💻', 60, 9900, 5),
  ('home-theater', 'Home Theater System', 'Full audio/video system installation with surround sound setup.', '🎬', 180, 39900, 6),
  ('general-handyman', 'General Handyman', 'Furniture assembly, small repairs, mounting, and general home tasks.', '🔧', 60, 7900, 7),
  ('cleaning', 'Home Cleaning', 'Professional deep cleaning service for homes and apartments.', '🧹', 120, 14900, 8)
ON CONFLICT (id) DO NOTHING;
```

---

## 7. STORAGE

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('work-photos', 'work-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Staff can upload work photos" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'work-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view work photos" ON storage.objects FOR SELECT
  USING (bucket_id = 'work-photos');

CREATE POLICY "Staff can delete own work photos" ON storage.objects FOR DELETE
  USING (bucket_id = 'work-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

*All SQL above is already running in your current backend. This file is for reference/portability.*

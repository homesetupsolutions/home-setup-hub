-- Create customer notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  sms_enabled BOOLEAN DEFAULT true,
  sms_reminders BOOLEAN DEFAULT true,
  sms_promotions BOOLEAN DEFAULT false,
  email_enabled BOOLEAN DEFAULT true,
  email_reminders BOOLEAN DEFAULT true,
  email_promotions BOOLEAN DEFAULT false,
  preferred_phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view and manage their own preferences
CREATE POLICY "Users can view their own notification preferences"
  ON public.notification_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences"
  ON public.notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences"
  ON public.notification_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin can view all preferences
CREATE POLICY "Admins can view all notification preferences"
  ON public.notification_preferences
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for work photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('work-photos', 'work-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for work photos
CREATE POLICY "Staff can upload work photos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'work-photos' 
    AND (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Anyone can view work photos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'work-photos');

CREATE POLICY "Staff can delete their own work photos"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'work-photos'
    AND (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'))
  );

-- Trigger for updated_at
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
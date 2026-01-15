-- Create services table for dynamic pricing
CREATE TABLE public.services (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  duration_minutes integer NOT NULL DEFAULT 60,
  price_cents integer NOT NULL DEFAULT 0,
  icon text DEFAULT '🔧',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Everyone can view active services (public booking page)
CREATE POLICY "Anyone can view active services"
ON public.services FOR SELECT
USING (is_active = true);

-- Admins can manage services
CREATE POLICY "Admins can insert services"
ON public.services FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update services"
ON public.services FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete services"
ON public.services FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial services with your current pricing
INSERT INTO public.services (id, name, description, duration_minutes, price_cents, icon, display_order) VALUES
('tv-mounting', 'TV Mounting', 'Professional wall mount installation for any TV size. Includes cable management.', 60, 9900, '📺', 1),
('network-setup', 'Network & WiFi Setup', 'Complete WiFi optimization, router setup, and coverage extension.', 90, 14900, '📡', 2),
('smart-home', 'Smart Home Setup', 'Voice assistant, smart lighting, and home automation configuration.', 120, 14900, '🏠', 3),
('security-camera', 'Security Camera Install', 'Indoor/outdoor camera installation with app setup and monitoring.', 90, 24900, '📹', 4),
('computer-setup', 'Computer Setup & Repair', 'Desktop/laptop setup, data transfer, software installation, and troubleshooting.', 60, 9900, '💻', 5),
('home-theater', 'Home Theater System', 'Full audio/video system installation with surround sound setup.', 180, 39900, '🎬', 6),
('general-handyman', 'General Handyman', 'Furniture assembly, small repairs, mounting, and general home tasks.', 60, 7900, '🔧', 7),
('cleaning', 'Home Cleaning', 'Professional deep cleaning service for homes and apartments.', 120, 14900, '🧹', 8);
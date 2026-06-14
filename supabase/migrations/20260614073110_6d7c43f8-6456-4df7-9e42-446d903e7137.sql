ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS region text NOT NULL DEFAULT 'vancouver';
UPDATE public.appointments SET region = 'calgary' WHERE created_at < now();

ALTER TABLE public.call_logs ADD COLUMN IF NOT EXISTS region text NOT NULL DEFAULT 'vancouver';
UPDATE public.call_logs SET region = 'calgary' WHERE created_at < now();

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS region text NOT NULL DEFAULT 'vancouver';
UPDATE public.profiles SET region = 'calgary' WHERE created_at < now();

ALTER TABLE public.ai_conversations ADD COLUMN IF NOT EXISTS region text NOT NULL DEFAULT 'vancouver';
UPDATE public.ai_conversations SET region = 'calgary' WHERE created_at < now();

ALTER TABLE public.ai_memories ADD COLUMN IF NOT EXISTS region text NOT NULL DEFAULT 'vancouver';
UPDATE public.ai_memories SET region = 'calgary' WHERE created_at < now();

ALTER TABLE public.ai_knowledge ADD COLUMN IF NOT EXISTS region text NOT NULL DEFAULT 'vancouver';
UPDATE public.ai_knowledge SET region = 'calgary' WHERE created_at < now();

CREATE INDEX IF NOT EXISTS idx_appointments_region ON public.appointments(region);
CREATE INDEX IF NOT EXISTS idx_call_logs_region ON public.call_logs(region);
CREATE INDEX IF NOT EXISTS idx_profiles_region ON public.profiles(region);
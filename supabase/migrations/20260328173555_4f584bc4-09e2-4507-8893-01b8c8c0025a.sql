
-- AI Conversations: persistent memory of all AI interactions
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  skill TEXT NOT NULL DEFAULT 'general_chat',
  title TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage their AI conversations"
  ON public.ai_conversations FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Block anonymous access to ai_conversations"
  ON public.ai_conversations FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

-- AI Knowledge Base: the "brain" - stored knowledge, notes, business docs
CREATE TABLE public.ai_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_knowledge ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage AI knowledge"
  ON public.ai_knowledge FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Block anonymous access to ai_knowledge"
  ON public.ai_knowledge FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

-- AI Memory: long-term facts the AI learns about the user/business
CREATE TABLE public.ai_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  memory TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'fact',
  importance INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage AI memories"
  ON public.ai_memories FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Block anonymous access to ai_memories"
  ON public.ai_memories FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

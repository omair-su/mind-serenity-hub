
-- gratitude_entries
CREATE TABLE public.gratitude_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  text TEXT NOT NULL,
  category TEXT,
  ai_reflection TEXT,
  voice_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.gratitude_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own gratitude" ON public.gratitude_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own gratitude" ON public.gratitude_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own gratitude" ON public.gratitude_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own gratitude" ON public.gratitude_entries FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_gratitude_user_created ON public.gratitude_entries(user_id, created_at DESC);
CREATE TRIGGER update_gratitude_updated_at BEFORE UPDATE ON public.gratitude_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ritual_completions
CREATE TABLE public.ritual_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  ritual_id TEXT NOT NULL,
  intention_word TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.ritual_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own rituals" ON public.ritual_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own rituals" ON public.ritual_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own rituals" ON public.ritual_completions FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_rituals_user_completed ON public.ritual_completions(user_id, completed_at DESC);

-- mood_entries
CREATE TABLE public.mood_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  emotion_primary TEXT NOT NULL,
  emotion_secondary TEXT,
  energy INTEGER,
  focus INTEGER,
  ai_insight TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own moods" ON public.mood_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own moods" ON public.mood_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own moods" ON public.mood_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own moods" ON public.mood_entries FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_mood_user_created ON public.mood_entries(user_id, created_at DESC);
CREATE TRIGGER update_mood_updated_at BEFORE UPDATE ON public.mood_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

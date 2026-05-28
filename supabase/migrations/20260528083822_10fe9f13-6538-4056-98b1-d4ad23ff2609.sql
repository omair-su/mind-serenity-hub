
-- Streak data persisted server-side
CREATE TABLE public.user_streaks (
  user_id UUID PRIMARY KEY,
  freezes_available INTEGER NOT NULL DEFAULT 1,
  last_grant_week TEXT NOT NULL DEFAULT '',
  used_freeze_dates TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_streaks TO authenticated;
GRANT ALL ON public.user_streaks TO service_role;

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read their own streak" ON public.user_streaks
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert their own streak" ON public.user_streaks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their own streak" ON public.user_streaks
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete their own streak" ON public.user_streaks
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_user_streaks_updated_at
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SOS trusted contacts persisted server-side
CREATE TABLE public.sos_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  relation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_sos_contacts_user ON public.sos_contacts(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sos_contacts TO authenticated;
GRANT ALL ON public.sos_contacts TO service_role;

ALTER TABLE public.sos_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own sos contacts" ON public.sos_contacts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sos contacts" ON public.sos_contacts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own sos contacts" ON public.sos_contacts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own sos contacts" ON public.sos_contacts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_sos_contacts_updated_at
  BEFORE UPDATE ON public.sos_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

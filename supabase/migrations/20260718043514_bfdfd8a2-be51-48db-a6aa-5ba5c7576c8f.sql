
ALTER TABLE public.user_streaks
  ADD COLUMN IF NOT EXISTS longest_streak integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.timer_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_minutes integer NOT NULL,
  session_type text NOT NULL DEFAULT 'custom',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.timer_sessions TO authenticated;
GRANT ALL ON public.timer_sessions TO service_role;

ALTER TABLE public.timer_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read their own timer sessions"
  ON public.timer_sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users insert their own timer sessions"
  ON public.timer_sessions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their own timer sessions"
  ON public.timer_sessions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users delete their own timer sessions"
  ON public.timer_sessions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS timer_sessions_user_created_idx
  ON public.timer_sessions(user_id, created_at DESC);

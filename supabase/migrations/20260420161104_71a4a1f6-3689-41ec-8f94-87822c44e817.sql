ALTER TABLE public.ritual_completions
ADD COLUMN IF NOT EXISTS day_state JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_ritual_completions_user_ritual
ON public.ritual_completions(user_id, ritual_id);
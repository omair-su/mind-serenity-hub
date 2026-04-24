-- Track AI coach message usage per user per day to enforce free-tier daily limits
CREATE TABLE IF NOT EXISTS public.coach_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  usage_date date NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::date,
  message_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, usage_date)
);

ALTER TABLE public.coach_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own coach usage"
  ON public.coach_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Inserts/updates are made by the edge function with the service role; no client write policy.

CREATE INDEX IF NOT EXISTS idx_coach_usage_user_date
  ON public.coach_usage (user_id, usage_date);

CREATE TRIGGER update_coach_usage_updated_at
  BEFORE UPDATE ON public.coach_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
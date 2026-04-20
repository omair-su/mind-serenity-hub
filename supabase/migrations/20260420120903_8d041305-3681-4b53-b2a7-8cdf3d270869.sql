-- Create storage bucket for narrated meditation audio
INSERT INTO storage.buckets (id, name, public)
VALUES ('meditation-audio', 'meditation-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for streaming (audio is non-sensitive content)
CREATE POLICY "Meditation audio is publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'meditation-audio');

-- Only service role can write (via edge function)
CREATE POLICY "Service role can upload meditation audio"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'meditation-audio' AND auth.role() = 'service_role');

-- Cache table: stores metadata for generated audio so we never regenerate
CREATE TABLE public.audio_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_key TEXT NOT NULL UNIQUE, -- e.g. "body-scan-relaxation", "day-1-intro"
  category TEXT NOT NULL, -- 'body_scan' | 'sleep_story' | 'daily_meditation' | 'sound_bath' | 'affirmation' | 'walking'
  title TEXT NOT NULL,
  description TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  voice_id TEXT NOT NULL,
  voice_name TEXT NOT NULL,
  storage_path TEXT NOT NULL, -- path in meditation-audio bucket
  public_url TEXT NOT NULL,
  ambient_bed TEXT, -- 'rain' | 'ocean' | 'forest' | 'fireplace' | null
  is_premium BOOLEAN NOT NULL DEFAULT false,
  script_hash TEXT NOT NULL, -- sha256 of script text — invalidate on script change
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audio_tracks_category ON public.audio_tracks(category);
CREATE INDEX idx_audio_tracks_track_key ON public.audio_tracks(track_key);

ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;

-- Anyone can read the catalog (audio URLs are public anyway)
CREATE POLICY "Anyone can view audio tracks"
ON public.audio_tracks FOR SELECT
USING (true);

-- Only service role can insert/update (via edge function)
CREATE POLICY "Service role can manage audio tracks"
ON public.audio_tracks FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Auto-update timestamp
CREATE TRIGGER update_audio_tracks_updated_at
BEFORE UPDATE ON public.audio_tracks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- User listening history (so we can power "Continue listening" + recommendations)
CREATE TABLE public.audio_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  track_key TEXT NOT NULL,
  played_seconds INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  liked BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audio_history_user ON public.audio_history(user_id, created_at DESC);

ALTER TABLE public.audio_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own history"
ON public.audio_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own history"
ON public.audio_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own history"
ON public.audio_history FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users delete own history"
ON public.audio_history FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_audio_history_updated_at
BEFORE UPDATE ON public.audio_history
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Onboarding goals — power personalized recommendations
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS goals JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS experience_level TEXT,
ADD COLUMN IF NOT EXISTS preferred_voice TEXT DEFAULT 'EXAVITQu4vr4xnSDxMaL',
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"daily_streak": true, "weekly_recap": true}'::jsonb;
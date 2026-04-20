
-- 1. Privatize the meditation-audio bucket
UPDATE storage.buckets SET public = false WHERE id = 'meditation-audio';

-- 2. Storage RLS — free tracks: any authenticated user; premium tracks: only premium users
DROP POLICY IF EXISTS "Authenticated can read free meditation audio" ON storage.objects;
DROP POLICY IF EXISTS "Premium users can read premium meditation audio" ON storage.objects;
DROP POLICY IF EXISTS "Service role manages meditation audio" ON storage.objects;

CREATE POLICY "Authenticated can read free meditation audio"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'meditation-audio'
  AND EXISTS (
    SELECT 1 FROM public.audio_tracks t
    WHERE t.storage_path = storage.objects.name
      AND t.is_premium = false
  )
);

CREATE POLICY "Premium users can read premium meditation audio"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'meditation-audio'
  AND EXISTS (
    SELECT 1 FROM public.audio_tracks t
    WHERE t.storage_path = storage.objects.name
      AND t.is_premium = true
  )
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.is_premium = true
  )
);

CREATE POLICY "Service role manages meditation audio"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'meditation-audio')
WITH CHECK (bucket_id = 'meditation-audio');

-- 3. Allow users to update their own ritual completions
CREATE POLICY "Users update own rituals"
ON public.ritual_completions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- 1) Video bucket: replace permissive SELECT with premium-aware policy
DROP POLICY IF EXISTS "Authenticated can read video bucket" ON storage.objects;

CREATE POLICY "Authenticated can read free video bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'video'
  AND name !~ '^library-(0[5-9]|1[0-6])-'
);

CREATE POLICY "Premium users can read premium video bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'video'
  AND name ~ '^library-(0[5-9]|1[0-6])-'
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.is_premium = true
  )
);

-- 2) audio_tracks: revoke storage_path column access from client roles
REVOKE SELECT (storage_path) ON public.audio_tracks FROM authenticated;
REVOKE SELECT (storage_path) ON public.audio_tracks FROM anon;

-- 3) avatars bucket: require auth for reads (no more anonymous enumeration)
DROP POLICY IF EXISTS "Public read individual avatar objects" ON storage.objects;

CREATE POLICY "Authenticated users can read avatar objects"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars');

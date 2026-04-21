-- 1) Restrict audio_tracks SELECT to authenticated users only.
--    The previous public policy exposed storage_path and other internal
--    fields to anonymous visitors. The catalog is still read by signed-in
--    users (and by edge functions via service role).
DROP POLICY IF EXISTS "Anyone can view audio tracks" ON public.audio_tracks;

CREATE POLICY "Authenticated users can view audio tracks"
  ON public.audio_tracks
  FOR SELECT
  TO authenticated
  USING (true);

-- 2) Avatars bucket: keep public READ on individual files (so <img src> works
--    from any client), but block anonymous LISTING of the bucket. We do this
--    by restricting SELECT on storage.objects to `authenticated` only — public
--    file URLs continue to work because they hit the storage CDN, not RLS.
DROP POLICY IF EXISTS "Avatars are publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

CREATE POLICY "Authenticated users can list avatars"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'avatars');
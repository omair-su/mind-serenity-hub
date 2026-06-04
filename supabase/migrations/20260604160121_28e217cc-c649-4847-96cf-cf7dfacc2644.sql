DROP POLICY IF EXISTS "Authenticated users can read avatar objects" ON storage.objects;

CREATE POLICY "Users can list their own avatar objects"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);
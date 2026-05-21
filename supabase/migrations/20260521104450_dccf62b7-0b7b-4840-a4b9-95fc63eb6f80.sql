CREATE POLICY "Authenticated can read video bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'video');

CREATE POLICY "Service role manages video bucket"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'video')
WITH CHECK (bucket_id = 'video');
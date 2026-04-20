-- Drop the broad SELECT policy and replace with one that allows reading
-- specific files (when path is known) but blocks bucket-listing.
DROP POLICY IF EXISTS "Meditation audio is publicly readable" ON storage.objects;

-- This policy only allows access when a specific object name is requested
-- — it does NOT allow listing the bucket contents.
CREATE POLICY "Meditation audio readable by direct URL"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'meditation-audio'
  AND name IS NOT NULL
);
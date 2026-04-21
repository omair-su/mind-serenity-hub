-- Public buckets serve files directly via CDN — no SELECT policy needed
-- for displaying images. Removing the SELECT policy prevents bucket listing
-- while individual avatar URLs continue to work for <img src=...>.
DROP POLICY IF EXISTS "Authenticated users can list avatars" ON storage.objects;
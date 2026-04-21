-- Drop the overly permissive storage policy that lets anyone read any meditation-audio file
-- (the policy condition `name IS NOT NULL` is always true and bypasses the premium gate).
DROP POLICY IF EXISTS "Meditation audio readable by direct URL" ON storage.objects;
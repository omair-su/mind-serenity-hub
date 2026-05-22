
-- 1. Attach is_premium escalation guard
DROP TRIGGER IF EXISTS prevent_premium_self_escalation_trg ON public.profiles;
CREATE TRIGGER prevent_premium_self_escalation_trg
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_premium_self_escalation();

-- 2. Friendships: prevent inviter from changing friend_user_id after creation
DROP POLICY IF EXISTS "Inviter can update own friendships" ON public.friendships;
CREATE POLICY "Inviter can update own friendships"
ON public.friendships
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND friend_user_id IS NOT DISTINCT FROM (
    SELECT f.friend_user_id FROM public.friendships f WHERE f.id = friendships.id
  )
  AND invited_email IS NOT DISTINCT FROM (
    SELECT f.invited_email FROM public.friendships f WHERE f.id = friendships.id
  )
);

-- 3. Avatars: explicit public SELECT policy
DROP POLICY IF EXISTS "Public read access for avatars" ON storage.objects;
CREATE POLICY "Public read access for avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- 4. coach_usage: explicit deny for client writes (service role bypasses RLS)
DROP POLICY IF EXISTS "Deny client inserts on coach_usage" ON public.coach_usage;
CREATE POLICY "Deny client inserts on coach_usage"
ON public.coach_usage
FOR INSERT
TO authenticated
WITH CHECK (false);

DROP POLICY IF EXISTS "Deny client updates on coach_usage" ON public.coach_usage;
CREATE POLICY "Deny client updates on coach_usage"
ON public.coach_usage
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "Deny client deletes on coach_usage" ON public.coach_usage;
CREATE POLICY "Deny client deletes on coach_usage"
ON public.coach_usage
FOR DELETE
TO authenticated
USING (false);

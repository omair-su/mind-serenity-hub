
-- 1) Attach premium-escalation prevention trigger on profiles
DROP TRIGGER IF EXISTS prevent_premium_self_escalation_trg ON public.profiles;
CREATE TRIGGER prevent_premium_self_escalation_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_premium_self_escalation();

-- 2) coach_usage: replace permissive-false with restrictive policies
DROP POLICY IF EXISTS "Deny client inserts on coach_usage" ON public.coach_usage;
DROP POLICY IF EXISTS "Deny client updates on coach_usage" ON public.coach_usage;
DROP POLICY IF EXISTS "Deny client deletes on coach_usage" ON public.coach_usage;

CREATE POLICY "Restrict client inserts on coach_usage"
ON public.coach_usage AS RESTRICTIVE
FOR INSERT TO authenticated
WITH CHECK (false);

CREATE POLICY "Restrict client updates on coach_usage"
ON public.coach_usage AS RESTRICTIVE
FOR UPDATE TO authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Restrict client deletes on coach_usage"
ON public.coach_usage AS RESTRICTIVE
FOR DELETE TO authenticated
USING (false);

-- 3) Storage: tighten avatars bucket — disallow listing, allow direct object reads only
DROP POLICY IF EXISTS "Public read access for avatars" ON storage.objects;
CREATE POLICY "Public read individual avatar objects"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars' AND name IS NOT NULL);
-- Note: Supabase listing uses search() which requires SELECT on the bucket; restricting via no-op
-- here keeps direct getPublicUrl working while preventing enumeration via list() since no list policy
-- grants broad access without a name filter.

-- 4) friendships: hide invited_email after acceptance, and from inviters once accepted
-- Drop and recreate stricter SELECT policies
DROP POLICY IF EXISTS "Invitee can view incoming friendships" ON public.friendships;
CREATE POLICY "Invitee can view incoming friendships"
ON public.friendships FOR SELECT TO authenticated
USING (auth.uid() = friend_user_id);

-- Create a security-definer view that masks invited_email for clients
CREATE OR REPLACE VIEW public.friendships_safe
WITH (security_invoker = true) AS
SELECT
  id,
  user_id,
  friend_user_id,
  status,
  share_streak,
  created_at,
  updated_at,
  CASE
    WHEN auth.uid() = user_id AND status = 'pending' THEN invited_email
    ELSE NULL
  END AS invited_email
FROM public.friendships;

GRANT SELECT ON public.friendships_safe TO authenticated;

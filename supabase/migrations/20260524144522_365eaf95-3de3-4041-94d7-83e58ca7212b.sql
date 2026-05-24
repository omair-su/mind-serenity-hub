-- 1) Tighten profile UPDATE policy to forbid changing is_premium at RLS layer
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND is_premium = (SELECT p.is_premium FROM public.profiles p WHERE p.user_id = auth.uid())
);

-- 2) Hide invited_email column from clients on the raw friendships table.
-- Clients must read via public.friendships_safe view which masks it appropriately.
REVOKE SELECT (invited_email) ON public.friendships FROM authenticated;
REVOKE SELECT (invited_email) ON public.friendships FROM anon;

-- 3) Hide storage_path from clients on audio_tracks.
REVOKE SELECT (storage_path) ON public.audio_tracks FROM authenticated;
REVOKE SELECT (storage_path) ON public.audio_tracks FROM anon;

-- 4) Restrict premium sync to live environment only.
CREATE OR REPLACE FUNCTION public.sync_premium_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  target_user uuid;
begin
  target_user := coalesce(NEW.user_id, OLD.user_id);
  update public.profiles
    set is_premium = public.has_active_subscription(target_user, 'live'),
        updated_at = now()
    where user_id = target_user;
  return NEW;
end;
$function$;
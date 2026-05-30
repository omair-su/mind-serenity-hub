-- Referral acceptance: lets a newly-signed-up user create an accepted friendship
-- row with the inviter, bypassing the inviter-only RLS insert policy.
CREATE OR REPLACE FUNCTION public.accept_referral(_inviter uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
  invitee uuid := auth.uid();
BEGIN
  IF invitee IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF _inviter IS NULL OR _inviter = invitee THEN
    RETURN NULL;
  END IF;

  -- Idempotent: skip if a friendship already exists either direction
  IF EXISTS (
    SELECT 1 FROM public.friendships
    WHERE (user_id = _inviter AND friend_user_id = invitee)
       OR (user_id = invitee   AND friend_user_id = _inviter)
  ) THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.friendships (user_id, friend_user_id, status, share_streak)
  VALUES (_inviter, invitee, 'accepted', true)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.accept_referral(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.accept_referral(uuid) TO authenticated;
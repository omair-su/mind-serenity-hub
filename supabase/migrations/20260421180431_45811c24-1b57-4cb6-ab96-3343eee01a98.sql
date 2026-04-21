-- Replace the profile UPDATE policy with a version that prevents users
-- from changing their own is_premium flag. The flag is managed exclusively
-- by the payments webhook + sync_premium_status trigger, which run as
-- service role and bypass RLS.

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile (no premium escalation)"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND is_premium = (
      SELECT p.is_premium FROM public.profiles p WHERE p.user_id = auth.uid()
    )
  );

-- Service role retains full management ability via existing service-role
-- bypass; no extra policy needed because service_role bypasses RLS.
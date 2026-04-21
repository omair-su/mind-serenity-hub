-- Harden profiles INSERT policy: restrict to authenticated users and prevent premium escalation at insert time
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND is_premium = false
);
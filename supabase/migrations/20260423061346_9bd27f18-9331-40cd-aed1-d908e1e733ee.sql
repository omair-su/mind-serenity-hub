-- Add explicit DELETE policy for profiles, scoped to the owner only
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
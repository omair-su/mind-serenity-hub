-- Harden profiles.is_premium against client-driven escalation.
-- The previous self-referential RLS subquery had a TOCTOU race; replace it with a
-- BEFORE UPDATE trigger that forces is_premium back to its prior value whenever
-- the update is performed by a non-service role (i.e. authenticated end users).
-- The service role (used by sync_premium_status / payments-webhook) bypasses RLS
-- and the trigger explicitly allows it.

CREATE OR REPLACE FUNCTION public.prevent_premium_self_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow privileged roles (service role, postgres) to change is_premium freely.
  IF current_setting('request.jwt.claim.role', true) = 'service_role'
     OR current_user IN ('postgres', 'supabase_admin', 'service_role') THEN
    RETURN NEW;
  END IF;

  -- For all other callers, force is_premium to remain unchanged regardless of input.
  NEW.is_premium := OLD.is_premium;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_premium_self_escalation_trg ON public.profiles;
CREATE TRIGGER prevent_premium_self_escalation_trg
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_premium_self_escalation();

-- Now that the trigger guarantees is_premium cannot be escalated by users,
-- simplify the RLS policy to a plain ownership check (no fragile subquery).
DROP POLICY IF EXISTS "Users can update own profile (no premium escalation)" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
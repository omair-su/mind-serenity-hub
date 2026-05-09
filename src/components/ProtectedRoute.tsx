// Guards routes that require an authenticated session.
// Unauthenticated visitors are redirected to /sign-in with a redirect param.
// Authenticated users who have not completed onboarding are routed to /onboarding
// (except when they're already on /onboarding itself).
import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getProfile, saveProfile } from "@/lib/userStore";

interface ProtectedRouteProps {
  children: ReactNode;
  /** When true, allows authenticated users through even if onboarding is incomplete. */
  allowIncompleteOnboarding?: boolean;
}

type Status = "loading" | "unauthed" | "needs-onboarding" | "authed";

export default function ProtectedRoute({ children, allowIncompleteOnboarding = false }: ProtectedRouteProps) {
  const location = useLocation();
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;

      if (!session) {
        setStatus("unauthed");
        return;
      }

      // Check onboarding completion: prefer cloud truth, fall back to local.
      let complete = !!getProfile().onboardingComplete;
      try {
        const { data } = await supabase
          .from("profiles")
          .select("onboarding_answers, display_name, goals, experience_level")
          .eq("user_id", session.user.id)
          .maybeSingle();
        const cloudComplete = !!(data?.onboarding_answers && Object.keys(data.onboarding_answers as object).length > 0);
        if (cloudComplete) {
          complete = true;
          // Mirror to local so other parts of the app stop nagging.
          const local = getProfile();
          if (!local.onboardingComplete) {
            saveProfile({ ...local, onboardingComplete: true });
          }
        }
      } catch {
        /* network — keep local value */
      }

      if (cancelled) return;
      setStatus(complete || allowIncompleteOnboarding ? "authed" : "needs-onboarding");
    };

    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, [allowIncompleteOnboarding, location.pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground font-body">Loading…</div>
      </div>
    );
  }

  if (status === "unauthed") {
    const redirectTarget = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/sign-in?redirect=${redirectTarget}`} replace />;
  }

  if (status === "needs-onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

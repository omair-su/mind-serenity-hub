// Guards routes that require an authenticated session.
// Unauthenticated visitors are redirected to /sign-in with a redirect param.
// Authenticated users who have not completed onboarding are routed to /onboarding
// (except when they're already on /onboarding itself).
import { useEffect, useRef, useState, type ReactNode } from "react";
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
  const checkedUserId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Resolve onboarding status for a known session. Safe to call outside of
    // onAuthStateChange (no auth-lock deadlock).
    const resolveOnboarding = async (userId: string) => {
      let complete = !!getProfile().onboardingComplete;
      try {
        const { data } = await supabase
          .from("profiles")
          .select("onboarding_answers")
          .eq("user_id", userId)
          .maybeSingle();
        const cloudComplete = !!(data?.onboarding_answers && Object.keys(data.onboarding_answers as object).length > 0);
        if (cloudComplete) {
          complete = true;
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

    // 1) Subscribe FIRST so we don't miss INITIAL_SESSION.
    //    IMPORTANT: never `await` Supabase calls inside this callback — it deadlocks
    //    the gotrue auth lock and freezes the app on the loading screen. Defer
    //    any DB work to a microtask via setTimeout(0).
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (!session) {
        checkedUserId.current = null;
        setStatus("unauthed");
        return;
      }
      // Avoid redundant profile fetches when the same user fires multiple events
      // (TOKEN_REFRESHED, USER_UPDATED, etc.) on the same route.
      if (checkedUserId.current === session.user.id) return;
      checkedUserId.current = session.user.id;
      setTimeout(() => {
        if (!cancelled) resolveOnboarding(session.user.id);
      }, 0);
    });

    // 2) Then read the current session for the initial render.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (!session) {
        setStatus("unauthed");
        return;
      }
      if (checkedUserId.current === session.user.id) return;
      checkedUserId.current = session.user.id;
      resolveOnboarding(session.user.id);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
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

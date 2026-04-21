// Guards routes that require an authenticated session.
// Unauthenticated visitors are redirected to /sign-in with a redirect param
// so they land back on the requested page after signing in.
import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [status, setStatus] = useState<"loading" | "authed" | "unauthed">("loading");

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      setStatus(session ? "authed" : "unauthed");
    };

    check();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setStatus(session ? "authed" : "unauthed");
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

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

  return <>{children}</>;
}

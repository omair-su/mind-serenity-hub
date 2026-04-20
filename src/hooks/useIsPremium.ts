// Reads the current user's premium status from `profiles.is_premium`.
// Returns false for signed-out users. Cached in-memory per session.
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useIsPremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          if (!cancelled) { setIsPremium(false); setLoading(false); }
          return;
        }
        const { data } = await supabase
          .from("profiles")
          .select("is_premium")
          .eq("user_id", user.id)
          .maybeSingle();
        if (!cancelled) {
          setIsPremium(!!data?.is_premium);
          setLoading(false);
        }
      } catch {
        if (!cancelled) { setIsPremium(false); setLoading(false); }
      }
    };

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  return { isPremium, loading };
}

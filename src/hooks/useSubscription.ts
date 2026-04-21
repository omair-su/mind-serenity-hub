// Reads the user's latest subscription / lifetime purchase row from cloud.
// Filters by environment derived from the Paddle client token prefix
// (test_ → sandbox preview, live_ → live published app).
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;
const ENV: "sandbox" | "live" = clientToken?.startsWith("test_") ? "sandbox" : "live";

export interface SubscriptionInfo {
  kind: "subscription" | "lifetime" | "none";
  status?: string;
  productId?: string;
  priceId?: string;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  environment?: string;
}

export function useSubscription() {
  const [data, setData] = useState<SubscriptionInfo>({ kind: "none" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          if (!cancelled) { setData({ kind: "none" }); setLoading(false); }
          return;
        }

        // Lifetime takes precedence
        const { data: lifetime } = await supabase
          .from("lifetime_purchases")
          .select("product_id, price_id, environment, purchased_at")
          .eq("user_id", user.id)
          .eq("environment", ENV)
          .order("purchased_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (lifetime) {
          if (!cancelled) {
            setData({
              kind: "lifetime",
              productId: lifetime.product_id,
              priceId: lifetime.price_id,
              environment: lifetime.environment,
            });
            setLoading(false);
          }
          return;
        }

        const { data: sub } = await supabase
          .from("subscriptions")
          .select("status, product_id, price_id, current_period_end, cancel_at_period_end, environment")
          .eq("user_id", user.id)
          .eq("environment", ENV)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!cancelled) {
          if (sub) {
            setData({
              kind: "subscription",
              status: sub.status,
              productId: sub.product_id,
              priceId: sub.price_id,
              currentPeriodEnd: sub.current_period_end,
              cancelAtPeriodEnd: !!sub.cancel_at_period_end,
              environment: sub.environment,
            });
          } else {
            setData({ kind: "none" });
          }
          setLoading(false);
        }
      } catch {
        if (!cancelled) { setData({ kind: "none" }); setLoading(false); }
      }
    };

    load();
    const { data: authSub } = supabase.auth.onAuthStateChange(() => load());
    return () => { cancelled = true; authSub.subscription.unsubscribe(); };
  }, []);

  return { ...data, loading };
}

export function planLabel(productId?: string): string {
  if (!productId) return "Willow Plus";
  const map: Record<string, string> = {
    starter_plan: "Willow Plus — Monthly",
    pro_plan: "Willow Plus — Yearly",
    lifetime_plan: "Willow Plus — Lifetime",
    monthly_plan: "Willow Plus — Monthly",
    yearly_plan: "Willow Plus — Yearly",
  };
  return map[productId] ?? "Willow Plus";
}

import { useState } from "react";
import { initializePaddle, getPaddlePriceId } from "@/lib/paddle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { logger } from "@/lib/logger";

export interface CheckoutOptions {
  priceId: string;
  successPath?: string;
  /** Optional Paddle discount code (e.g. "COMEBACK50"). */
  discountCode?: string;
}

/** Distinguish between resolvable user errors (bad price ID / not signed in)
 *  and infra errors (Paddle CDN down, network). One generic toast hides
 *  which one to fix, so we route each cause to its own message. */
function describeCheckoutError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  if (/price/i.test(msg) && /(not found|resolve|external)/i.test(msg)) {
    return "This plan is temporarily unavailable. Please try a different plan or contact support.";
  }
  if (/network|fetch|failed to fetch|offline/i.test(msg)) {
    return "Network issue reaching checkout. Check your connection and try again.";
  }
  if (/paddle/i.test(msg) && /(init|load|script)/i.test(msg)) {
    return "Checkout failed to load. Please refresh the page and try again.";
  }
  return "Could not open checkout. Please try again in a moment.";
}

export function usePaddleCheckout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const openCheckout = async ({ priceId, successPath = "/app", discountCode }: CheckoutOptions) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.info("Please sign in to continue");
        navigate("/sign-in?redirect=/pricing");
        return;
      }

      await initializePaddle();
      const paddlePriceId = await getPaddlePriceId(priceId);

      window.Paddle.Checkout.open({
        items: [{ priceId: paddlePriceId, quantity: 1 }],
        customer: user.email ? { email: user.email } : undefined,
        customData: { userId: user.id },
        ...(discountCode ? { discountCode } : {}),
        settings: {
          displayMode: "overlay",
          variant: "one-page",
          successUrl: `${window.location.origin}${successPath}?checkout=success`,
          allowLogout: false,
        },
      });
    } catch (e) {
      logger.error("Paddle checkout failed", { priceId, error: e });
      toast.error(describeCheckoutError(e));
    } finally {
      setLoading(false);
    }
  };

  return { openCheckout, loading };
}

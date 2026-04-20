import { useState } from "react";
import { initializePaddle, getPaddlePriceId } from "@/lib/paddle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface CheckoutOptions {
  priceId: string;
  successPath?: string;
}

export function usePaddleCheckout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const openCheckout = async ({ priceId, successPath = "/app" }: CheckoutOptions) => {
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
        settings: {
          displayMode: "overlay",
          variant: "one-page",
          successUrl: `${window.location.origin}${successPath}?checkout=success`,
          allowLogout: false,
        },
      });
    } catch (e) {
      console.error("Checkout error:", e);
      toast.error("Could not open checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { openCheckout, loading };
}

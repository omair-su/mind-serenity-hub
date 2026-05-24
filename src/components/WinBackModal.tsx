// Win-back flow: when a user's subscription is canceled, surface a single
// modal offering 50% off for 3 months via the COMEBACK50 discount code.
// Dismissible — won't reappear for 30 days.
import { useEffect, useState } from "react";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";

const DISMISS_KEY = "wv-winback-dismissed-at";
const COOLDOWN_DAYS = 30;
const WINBACK_CODE = "COMEBACK50";

export default function WinBackModal() {
  const sub = useSubscription();
  const { openCheckout, loading } = usePaddleCheckout();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sub.loading) return;
    if (sub.kind !== "subscription" || sub.status !== "canceled") return;

    const dismissed = Number(localStorage.getItem(DISMISS_KEY) || "0");
    const daysSince = (Date.now() - dismissed) / (24 * 60 * 60 * 1000);
    if (dismissed === 0 || daysSince >= COOLDOWN_DAYS) {
      const t = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(t);
    }
  }, [sub.loading, sub.kind, sub.status]);

  if (!open) return null;

  const onClose = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setOpen(false);
  };

  const onClaim = async () => {
    await openCheckout({ priceId: "willow_plus_monthly", discountCode: WINBACK_CODE });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 sm:p-8"
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <Heart className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">We miss you.</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Come back to Willow Plus and get <span className="font-semibold text-foreground">50% off for 3 months</span> — your streaks, journals,
          and gardens are exactly where you left them.
        </p>
        <div className="mt-4 rounded-xl bg-muted/60 border border-border p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Your code</p>
          <p className="font-mono font-bold text-lg tracking-wider">{WINBACK_CODE}</p>
        </div>
        <Button onClick={onClaim} disabled={loading} className="w-full mt-5">
          {loading ? "Opening checkout…" : "Reactivate with 50% off"}
        </Button>
        <button onClick={onClose} className="w-full text-xs text-muted-foreground mt-3 hover:text-foreground">
          Maybe later
        </button>
      </div>
    </div>
  );
}

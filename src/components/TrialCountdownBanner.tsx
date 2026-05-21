// Free-trial countdown banner. Shows the days remaining when the user's
// subscription is in `trialing` status. Dismissible per session.
import { useEffect, useMemo, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";

const DISMISS_KEY = "wv-trial-banner-dismissed";

export default function TrialCountdownBanner() {
  const sub = useSubscription();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  const daysLeft = useMemo(() => {
    if (sub.status !== "trialing" || !sub.currentPeriodEnd) return null;
    const ms = new Date(sub.currentPeriodEnd).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
  }, [sub.status, sub.currentPeriodEnd]);

  if (sub.loading || dismissed || daysLeft === null) return null;

  const onDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="w-full bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground px-4 py-2.5 flex items-center justify-center gap-3 text-sm relative">
      <Sparkles className="w-4 h-4 flex-shrink-0" />
      <p className="font-medium">
        {daysLeft === 0
          ? "Your free trial ends today — "
          : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left in your free trial — `}
        <Link to="/pricing" className="underline underline-offset-2 font-semibold">
          manage plan
        </Link>
      </p>
      <button
        aria-label="Dismiss"
        onClick={onDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/80 hover:text-primary-foreground"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

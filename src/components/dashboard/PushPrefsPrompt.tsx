// Soft, non-intrusive prompt asking the user to enable daily reminders.
// Appears on day 2+ of usage (gives them breathing room on day 1).
// Skipped if push isn't supported, already enabled, or previously dismissed.
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isPushSupported, subscribeToPush } from "@/lib/webPush";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";

const DISMISS_KEY = "wv-push-prompt-dismissed-v1";
const FIRST_VISIT_KEY = "wv-first-visit-at";

export default function PushPrefsPrompt() {
  const { profile, notifPrefs, updateNotifPrefs } = useProfile();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!profile.userId) return;
    if (!isPushSupported()) return;
    if (notifPrefs.browser_push) return;
    if (Notification.permission === "denied") return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    // Stamp first visit so we can wait until day 2.
    const stamped = localStorage.getItem(FIRST_VISIT_KEY);
    if (!stamped) {
      localStorage.setItem(FIRST_VISIT_KEY, new Date().toISOString());
      return;
    }
    const ageMs = Date.now() - new Date(stamped).getTime();
    if (ageMs < 18 * 60 * 60 * 1000) return; // wait ~18h after first visit

    const t = window.setTimeout(() => setShow(true), 1500);
    return () => window.clearTimeout(t);
  }, [profile.userId, notifPrefs.browser_push]);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  };

  const enable = async () => {
    setBusy(true);
    try {
      const ok = await subscribeToPush();
      if (ok) {
        await updateNotifPrefs({ browser_push: true, daily_streak: true });
        toast({ title: "Reminders on", description: "We'll send a gentle nudge each morning." });
        setShow(false);
      } else {
        toast({ title: "Couldn't enable reminders", description: "You can try again from Profile.", variant: "destructive" });
        dismiss();
      }
    } catch {
      dismiss();
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative overflow-hidden rounded-3xl border border-[hsl(var(--gold))]/30 bg-gradient-to-br from-[hsl(var(--forest))]/6 via-[hsl(var(--cream))] to-[hsl(var(--gold))]/6 shadow-[var(--shadow-card-val)]"
        >
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[hsl(var(--gold))]/12 blur-[60px]" />
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[hsl(var(--cream-dark))]/50 hover:bg-[hsl(var(--cream-dark))] flex items-center justify-center text-[hsl(var(--charcoal-soft))] z-10"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center flex-shrink-0 shadow-[var(--shadow-gold-val)]">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-body font-bold tracking-[0.22em] uppercase text-[hsl(var(--gold-dark))] mb-1">
                — A Gentle Reminder —
              </p>
              <h3 className="font-display text-lg font-bold text-[hsl(var(--forest-deep))] leading-snug">
                Want a soft nudge each morning?
              </h3>
              <p className="font-body text-sm text-[hsl(var(--charcoal-soft))] mt-1 leading-relaxed">
                One quiet notification. No spam. Cancel anytime in Profile.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={dismiss}
                className="flex-1 sm:flex-initial rounded-xl border-[hsl(var(--sage))] text-[hsl(var(--forest))] font-body"
              >
                Not now
              </Button>
              <Button
                onClick={enable}
                disabled={busy}
                className="flex-1 sm:flex-initial rounded-xl bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white font-body font-semibold shadow-[var(--shadow-gold-val)]"
              >
                {busy ? "Enabling…" : "Yes, please"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

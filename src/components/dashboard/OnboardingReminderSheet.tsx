// Shown ONCE after a user finishes onboarding. Asks them to lock in a daily
// reminder time and (optionally) enable browser push so we can actually nudge.
// This is the single highest-impact retention lever — users who set a reminder
// in the first session are ~2x more likely to be active on day 7.
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Sunrise, Sun, Sunset, Moon, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { isPushSupported, subscribeToPush } from "@/lib/webPush";
import { toast } from "@/hooks/use-toast";

const DONE_KEY = "wv-reminder-sheet-done-v1";
const ONBOARDING_DONE_KEY = "wv-onboarding-complete-at";

const TIME_PRESETS = [
  { value: "07:00", label: "Morning",   sub: "7:00 AM",  Icon: Sunrise },
  { value: "12:30", label: "Midday",    sub: "12:30 PM", Icon: Sun },
  { value: "19:00", label: "Evening",   sub: "7:00 PM",  Icon: Sunset },
  { value: "21:30", label: "Wind down", sub: "9:30 PM",  Icon: Moon },
];

function defaultTimeFor(preferredTime?: string) {
  switch (preferredTime) {
    case "morning":   return "07:00";
    case "afternoon": return "12:30";
    case "evening":   return "19:00";
    default:          return "07:00";
  }
}

export default function OnboardingReminderSheet() {
  const { profile, notifPrefs, update, updateNotifPrefs } = useProfile();
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string>("07:00");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!profile.userId) return;
    if (localStorage.getItem(DONE_KEY)) return;
    if (!localStorage.getItem(ONBOARDING_DONE_KEY)) return;
    setPicked(defaultTimeFor(profile.preferredTime));
    const t = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(t);
  }, [profile.userId, profile.preferredTime]);

  const finish = () => {
    try { localStorage.setItem(DONE_KEY, new Date().toISOString()); } catch {}
    setOpen(false);
  };

  const skip = () => finish();

  const confirm = async () => {
    setBusy(true);
    try {
      update({ reminderTime: picked });
      let pushEnabled = notifPrefs.browser_push;
      if (isPushSupported() && !pushEnabled && Notification.permission !== "denied") {
        pushEnabled = await subscribeToPush();
      }
      await updateNotifPrefs({
        daily_streak: true,
        browser_push: pushEnabled || notifPrefs.browser_push,
      });
      toast({
        title: pushEnabled ? "Reminder locked in ✨" : "Reminder time saved",
        description: pushEnabled
          ? `We'll send a quiet nudge at ${picked}.`
          : "Enable notifications anytime in Profile to get the nudge.",
      });
    } catch (err) {
      console.warn("[reminder-sheet] save failed", err);
    } finally {
      setBusy(false);
      finish();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[hsl(var(--forest-deep))]/60 backdrop-blur-sm"
          onClick={skip}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-md overflow-hidden rounded-t-3xl sm:rounded-3xl border border-[hsl(var(--gold))]/30 bg-gradient-to-br from-[hsl(var(--cream))] via-[hsl(var(--cream))] to-[hsl(var(--gold))]/8 shadow-[var(--shadow-card-val)]"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[hsl(var(--gold))]/15 blur-[80px]" />
            <button
              onClick={skip}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[hsl(var(--cream-dark))]/60 hover:bg-[hsl(var(--cream-dark))] flex items-center justify-center text-[hsl(var(--charcoal-soft))] z-10"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center shadow-[var(--shadow-gold-val)] flex-shrink-0">
                  <Bell className="w-5 h-5 text-cream" />
                </div>
                <div>
                  <p className="text-[10px] font-body font-bold tracking-[0.22em] uppercase text-[hsl(var(--gold-dark))]">
                    — Last step —
                  </p>
                  <h2 className="font-display text-xl font-bold text-[hsl(var(--forest-deep))] leading-tight">
                    Set your daily ritual time
                  </h2>
                </div>
              </div>

              <p className="font-body text-sm text-[hsl(var(--charcoal-soft))] leading-relaxed mb-5">
                One quiet nudge a day. Practitioners who pick a time are 2× more likely to keep their streak past week one.
              </p>

              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {TIME_PRESETS.map((t) => {
                  const isActive = picked === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setPicked(t.value)}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl border-2 text-left transition-all ${
                        isActive
                          ? "border-[hsl(var(--forest))] bg-[hsl(var(--forest))]/8 shadow-sm"
                          : "border-[hsl(var(--sage))]/40 bg-cream/60 hover:border-[hsl(var(--sage))]"
                      }`}
                    >
                      <t.Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[hsl(var(--forest))]" : "text-[hsl(var(--gold-dark))]"}`} />
                      <div className="min-w-0">
                        <p className="font-body font-semibold text-[hsl(var(--forest-deep))] text-sm leading-tight">{t.label}</p>
                        <p className="text-[11px] font-body text-[hsl(var(--charcoal-soft))] tabular-nums">{t.sub}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <label className="block mb-5">
                <span className="text-[11px] font-body uppercase tracking-wider text-[hsl(var(--charcoal-soft))]">
                  Or pick exact time
                </span>
                <input
                  type="time"
                  value={picked}
                  onChange={(e) => setPicked(e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border-2 border-[hsl(var(--sage))]/40 bg-cream/60 px-3 font-body text-[hsl(var(--forest-deep))] focus:outline-none focus:border-[hsl(var(--forest))]"
                />
              </label>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={skip}
                  className="flex-1 rounded-xl border-[hsl(var(--sage))] text-[hsl(var(--forest))] font-body"
                  disabled={busy}
                >
                  Not now
                </Button>
                <Button
                  onClick={confirm}
                  disabled={busy}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-cream font-body font-semibold shadow-[var(--shadow-gold-val)]"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  {busy ? "Saving…" : "Lock it in"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

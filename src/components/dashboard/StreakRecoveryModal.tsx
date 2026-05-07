// Streak Recovery Modal — when the user missed yesterday but has freeze tokens,
// offer a one-tap rescue. Pure client side: reads from streakFreeze + DayState.
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Snowflake, Flame, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAvailableFreezes, useFreeze } from "@/lib/streakFreeze";
import { getCurrentStreak, getDayState, getCompletedDays } from "@/lib/userStore";
import { toast } from "@/hooks/use-toast";

const SHOWN_PREFIX = "wv-streak-rescue-shown-";
const DECLINED_PREFIX = "wv-streak-rescue-declined-";

function ymd(d: Date) {
  return d.toISOString().split("T")[0];
}

function findMissedDay(): string | null {
  // Check yesterday: was anything completed?
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const ystr = ymd(yesterday);

  for (let d = 1; d <= 30; d++) {
    const s = getDayState(d);
    if (s?.completedAt && s.completedAt.startsWith(ystr) && s.checklist?.every(Boolean)) {
      return null; // Practiced yesterday — no rescue needed
    }
  }

  // Did they have an active streak ending the day before yesterday?
  const dayBefore = new Date();
  dayBefore.setDate(dayBefore.getDate() - 2);
  const dbstr = ymd(dayBefore);
  for (let d = 1; d <= 30; d++) {
    const s = getDayState(d);
    if (s?.completedAt && s.completedAt.startsWith(dbstr) && s.checklist?.every(Boolean)) {
      return ystr; // Missed yesterday with prior streak
    }
  }
  return null;
}

export default function StreakRecoveryModal() {
  const [open, setOpen] = useState(false);
  const [missedDate, setMissedDate] = useState<string | null>(null);
  const [available, setAvailable] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Run detection on every app launch (mounted once globally in AppLayout).
    // Guard: only if user has any prior completed day (so brand-new users aren't nagged).
    if (getCompletedDays().length === 0) return;

    const missed = findMissedDay();
    if (!missed) return;

    // Per-launch dedupe (sessionStorage) + per-missed-day dismissal (localStorage).
    if (sessionStorage.getItem(SHOWN_PREFIX + missed)) return;
    if (localStorage.getItem(DECLINED_PREFIX + missed)) return;

    const tokens = getAvailableFreezes();
    if (tokens <= 0) return;

    setMissedDate(missed);
    setAvailable(tokens);
    sessionStorage.setItem(SHOWN_PREFIX + missed, "1");
    // Small delay so the modal doesn't fight the page-mount animation.
    const t = window.setTimeout(() => setOpen(true), 250);
    return () => window.clearTimeout(t);
  }, []);

  const decline = () => {
    if (missedDate) localStorage.setItem(DECLINED_PREFIX + missedDate, "1");
    setOpen(false);
  };

  const rescue = () => {
    if (!missedDate) return;
    setBusy(true);
    const ok = useFreeze(missedDate);
    if (ok) {
      const newStreak = getCurrentStreak();
      toast({
        title: "Streak protected ❄️",
        description: `Your ${newStreak}-day streak is safe. Keep going.`,
      });
    } else {
      toast({ title: "No freeze tokens left", variant: "destructive" });
    }
    setOpen(false);
    setBusy(false);
  };

  if (!missedDate) return null;
  const niceDate = new Date(missedDate).toLocaleDateString(undefined, { weekday: "long" });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[hsl(var(--forest-deep))]/60 backdrop-blur-sm"
          onClick={decline}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[hsl(var(--gold))]/30 bg-gradient-to-br from-[hsl(var(--cream))] via-white to-[hsl(var(--gold))]/5 shadow-[var(--shadow-card-val)]"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[hsl(var(--gold))]/15 blur-[80px]" />
            <button
              onClick={decline}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[hsl(var(--cream-dark))]/60 hover:bg-[hsl(var(--cream-dark))] flex items-center justify-center text-[hsl(var(--charcoal-soft))] z-10"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative p-7 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] shadow-[var(--shadow-gold-val)] mb-4">
                <Snowflake className="w-7 h-7 text-white" />
              </div>
              <p className="text-[10px] font-body font-bold tracking-[0.22em] uppercase text-[hsl(var(--gold-dark))] mb-2">
                — Streak Rescue —
              </p>
              <h2 className="font-display text-2xl font-bold text-[hsl(var(--forest-deep))] leading-tight">
                You missed {niceDate}
              </h2>
              <p className="font-body text-sm text-[hsl(var(--charcoal-soft))] mt-3 leading-relaxed">
                Use one of your freeze tokens to protect your streak. Life happens — your practice continues.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--forest))]/8 border border-[hsl(var(--forest))]/15">
                <Flame className="w-4 h-4 text-[hsl(var(--gold-dark))]" />
                <span className="text-sm font-body font-medium text-[hsl(var(--forest-deep))]">
                  {available} freeze token{available === 1 ? "" : "s"} available
                </span>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={decline}
                  className="flex-1 rounded-xl border-[hsl(var(--sage))] text-[hsl(var(--forest))] font-body"
                >
                  Not today
                </Button>
                <Button
                  onClick={rescue}
                  disabled={busy}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white font-body font-semibold shadow-[var(--shadow-gold-val)]"
                >
                  Protect streak
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

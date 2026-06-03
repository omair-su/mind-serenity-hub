// Luxe 7-day program progress ring with petal markers + completion celebration.
// - Reads program progress live (custom event + cross-tab storage updates)
// - Fires a confetti-style burst on completion (and on page refresh if a day
//   was completed since last view)
// - Respects prefers-reduced-motion
// - Announces progress + next-day text via an aria-live region
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { VAGUS_NERVE_RESET } from "@/data/programs/vagusNerveReset";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const STORAGE_KEY = `willow:program:${VAGUS_NERVE_RESET.id}:progress`;
const LAST_SEEN_KEY = `willow:program:${VAGUS_NERVE_RESET.id}:lastCelebrated`;

function readCompleted(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

function readLastSeen(): number {
  const v = Number(localStorage.getItem(LAST_SEEN_KEY) || 0);
  return Number.isFinite(v) ? v : 0;
}

export default function ProgramProgressRing() {
  const total = VAGUS_NERVE_RESET.days.length;
  const reducedMotion = useReducedMotion();
  const [completed, setCompleted] = useState<number[]>(() => readCompleted());
  const [celebrate, setCelebrate] = useState<{ day: number } | null>(null);
  const prevDoneRef = useRef<number>(completed.length);
  const ringControls = useAnimationControls();

  // Refresh-time confetti: if there are completed days we haven't celebrated yet
  // (e.g. user refreshed after finishing), trigger the celebration once.
  useEffect(() => {
    const lastSeen = readLastSeen();
    const current = readCompleted();
    if (current.length > lastSeen) {
      const newestDay = Math.max(...current);
      setCelebrate({ day: newestDay });
    }
    // Persist current count so we don't re-celebrate next mount.
    try { localStorage.setItem(LAST_SEEN_KEY, String(current.length)); } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for completion events + cross-tab storage updates
  useEffect(() => {
    const refresh = () => setCompleted(readCompleted());
    const onComplete = (e: Event) => {
      const detail = (e as CustomEvent).detail as { programId?: string; day?: number } | undefined;
      if (!detail || detail.programId !== VAGUS_NERVE_RESET.id) return;
      refresh();
      if (typeof detail.day === "number") {
        setCelebrate({ day: detail.day });
        try { localStorage.setItem(LAST_SEEN_KEY, String(readCompleted().length)); } catch {}
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh();
    };
    window.addEventListener("wv-program-day-complete", onComplete as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("wv-program-day-complete", onComplete as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const done = completed.length;
  const pct = Math.round((done / total) * 100);
  const nextDay = Math.min(total, done + 1);
  const isComplete = done >= total;

  // Detect same-tab increases (covers updates not caught by storage event)
  useEffect(() => {
    if (done > prevDoneRef.current && !reducedMotion) {
      ringControls.start({
        scale: [1, 1.08, 1],
        transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
      });
    }
    prevDoneRef.current = done;
  }, [done, ringControls, reducedMotion]);

  // Auto-dismiss celebration
  useEffect(() => {
    if (!celebrate) return;
    const t = window.setTimeout(() => setCelebrate(null), reducedMotion ? 3500 : 2800);
    return () => window.clearTimeout(t);
  }, [celebrate, reducedMotion]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const cx = 70;
  const cy = 70;

  // Aria-live announcement
  const announcement = useMemo(() => {
    if (celebrate) {
      return isComplete
        ? `Day ${celebrate.day} complete. You finished the 7-day Vagus Nerve Reset.`
        : `Day ${celebrate.day} complete. Up next, Day ${nextDay} of 7.`;
    }
    if (done === 0) return `Vagus Nerve Reset not yet started. Day 1 of 7 awaits.`;
    if (isComplete) return `Vagus Nerve Reset complete — all 7 days finished.`;
    return `${done} of ${total} days complete. Continue with Day ${nextDay}.`;
  }, [celebrate, done, isComplete, nextDay, total]);

  // Animation configs, stripped down when reduced motion is on
  const burstDuration = reducedMotion ? 0 : 1.6;

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[hsl(var(--gold)/0.25)] bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--forest-mid))] text-cream shadow-[var(--shadow-elevated-val)] p-6 sm:p-7">
      {/* Polite live region — single source of truth for screen-reader updates */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>

      <span aria-hidden className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[hsl(var(--gold)/0.2)] blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -bottom-20 -left-16 w-60 h-60 rounded-full bg-[hsl(var(--sage)/0.15)] blur-3xl" />

      {/* Celebration overlay */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            key="celebrate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.2 : 0.4 }}
            className="pointer-events-none absolute inset-0 z-10"
            aria-hidden
          >
            {!reducedMotion && (
              <>
                {/* radiant gold burst */}
                <motion.span
                  className="absolute left-[80px] top-[80px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--gold)/0.55)] blur-2xl"
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 3.2, opacity: [0, 0.9, 0] }}
                  transition={{ duration: burstDuration, ease: "easeOut" }}
                  style={{ width: 120, height: 120 }}
                />
                {/* ring shockwave */}
                <motion.span
                  className="absolute left-[80px] top-[80px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[hsl(var(--gold-light)/0.9)]"
                  initial={{ width: 60, height: 60, opacity: 0.9 }}
                  animate={{ width: 220, height: 220, opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
                {/* confetti — gold sparkles fanning outward */}
                {Array.from({ length: 18 }).map((_, i) => {
                  const angle = (i / 18) * Math.PI * 2;
                  const distance = 90 + (i % 3) * 14;
                  const dx = Math.cos(angle) * distance;
                  const dy = Math.sin(angle) * distance;
                  const palette = [
                    "hsl(var(--gold-light))",
                    "hsl(var(--gold))",
                    "hsl(var(--cream))",
                  ];
                  return (
                    <motion.span
                      key={i}
                      className="absolute left-[80px] top-[80px] w-1.5 h-1.5 rounded-full drop-shadow-[0_0_6px_hsl(var(--gold)/0.9)]"
                      style={{ background: palette[i % palette.length] }}
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
                      animate={{
                        x: dx,
                        y: dy,
                        opacity: [0, 1, 0],
                        scale: [0.6, 1.2, 0.4],
                        rotate: i * 20,
                      }}
                      transition={{ duration: 1.4, ease: "easeOut", delay: 0.03 * i }}
                    />
                  );
                })}
              </>
            )}
            {/* completion toast — always shown, even when reduced motion is on */}
            <motion.div
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.95 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: reducedMotion ? 0.2 : 0.45, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))] text-[10px] font-bold tracking-[0.18em] uppercase shadow-[var(--shadow-gold-val)]"
            >
              <Sparkles className="w-3 h-3" /> Day {celebrate.day} complete
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-start gap-5">
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85, rotate: -90 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-[140px] h-[140px] flex-shrink-0"
        >
          <motion.div animate={ringControls} className="w-full h-full">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140" role="img" aria-label={`Program progress: ${done} of ${total} days`}>
              <defs>
                <linearGradient id="vagus-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--gold))" />
                  <stop offset="100%" stopColor="hsl(var(--gold-light))" />
                </linearGradient>
              </defs>
              <circle cx={cx} cy={cy} r={radius} fill="none" stroke="hsl(var(--cream)/0.12)" strokeWidth="8" />
              <motion.circle
                cx={cx} cy={cy} r={radius}
                fill="none"
                stroke="url(#vagus-ring-grad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={false}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: reducedMotion ? 0 : 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="drop-shadow-[0_0_10px_hsl(var(--gold)/0.5)]"
              />
              {/* 7 petal markers around the ring */}
              {Array.from({ length: total }).map((_, i) => {
                const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
                const px = cx + Math.cos(angle) * radius;
                const py = cy + Math.sin(angle) * radius;
                const isDone = completed.includes(i + 1);
                const justCompleted = !reducedMotion && celebrate?.day === i + 1;
                return (
                  <motion.circle
                    key={i}
                    cx={px}
                    cy={py}
                    initial={false}
                    animate={
                      justCompleted
                        ? { r: [2.5, 8, 4], opacity: [0.6, 1, 1] }
                        : { r: isDone ? 4 : 2.5, opacity: 1 }
                    }
                    transition={{ duration: reducedMotion ? 0 : 0.9, ease: "easeOut" }}
                    fill={isDone ? "hsl(var(--gold-light))" : "hsl(var(--cream)/0.5)"}
                    className={isDone ? "drop-shadow-[0_0_4px_hsl(var(--gold)/0.7)]" : ""}
                  />
                );
              })}
            </svg>
          </motion.div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={done}
              initial={reducedMotion ? { opacity: 0 } : { scale: 0.6, opacity: 0 }}
              animate={reducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
              transition={{ duration: reducedMotion ? 0.15 : 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-display text-[40px] leading-none text-cream font-bold tabular-nums"
            >
              {done}
            </motion.span>
            <span className="text-[10px] tracking-[0.28em] uppercase text-cream/60 mt-1">of {total} days</span>
          </div>
        </motion.div>

        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--gold-light))]" />
            <span className="text-[10px] font-bold tracking-[0.32em] uppercase text-[hsl(var(--gold-light))]">
              Signature Program
            </span>
          </div>
          <h3 className="font-display text-[22px] sm:text-2xl text-cream leading-tight mt-2">
            Vagus Nerve Reset
          </h3>
          <AnimatePresence mode="wait">
            <motion.p
              key={`copy-${done}`}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: reducedMotion ? 0.15 : 0.4 }}
              className="text-xs sm:text-sm font-body italic text-cream/70 mt-2 leading-relaxed"
            >
              {done === 0
                ? "Begin your 7-day nervous system reset."
                : isComplete
                  ? "Program complete — beautifully done."
                  : `${total - done} ${total - done === 1 ? "day" : "days"} remaining on your journey.`}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`cta-${done}`}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: reducedMotion ? 0.15 : 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                to={`/app/programs/${VAGUS_NERVE_RESET.id}/day/${nextDay}`}
                aria-label={isComplete
                  ? "Revisit the Vagus Nerve Reset program"
                  : done === 0
                    ? "Begin Day 1 of the Vagus Nerve Reset"
                    : `Continue with Day ${nextDay} of the Vagus Nerve Reset`}
                className="group mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))] font-body font-bold text-xs hover:brightness-110 transition-all shadow-[var(--shadow-gold-val)]"
              >
                {isComplete ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                {isComplete ? "Revisit Program" : done === 0 ? "Begin Day 1" : `Continue · Day ${nextDay}`}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

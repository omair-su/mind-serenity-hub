// Luxe 7-day program progress ring with petal markers + completion celebration.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { VAGUS_NERVE_RESET } from "@/data/programs/vagusNerveReset";

const STORAGE_KEY = `willow:program:${VAGUS_NERVE_RESET.id}:progress`;

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

export default function ProgramProgressRing() {
  const total = VAGUS_NERVE_RESET.days.length;
  const [completed, setCompleted] = useState<number[]>(() => readCompleted());
  const [celebrate, setCelebrate] = useState<{ day: number } | null>(null);
  const prevDoneRef = useRef<number>(completed.length);
  const ringControls = useAnimationControls();

  // Listen for completion events + cross-tab storage updates
  useEffect(() => {
    const refresh = () => setCompleted(readCompleted());
    const onComplete = (e: Event) => {
      const detail = (e as CustomEvent).detail as { programId?: string; day?: number } | undefined;
      if (!detail || detail.programId !== VAGUS_NERVE_RESET.id) return;
      refresh();
      if (typeof detail.day === "number") setCelebrate({ day: detail.day });
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

  // Detect increases (covers same-tab updates not caught by storage event)
  useEffect(() => {
    if (done > prevDoneRef.current) {
      ringControls.start({
        scale: [1, 1.08, 1],
        transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
      });
    }
    prevDoneRef.current = done;
  }, [done, ringControls]);

  // Auto-dismiss celebration
  useEffect(() => {
    if (!celebrate) return;
    const t = window.setTimeout(() => setCelebrate(null), 2800);
    return () => window.clearTimeout(t);
  }, [celebrate]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const cx = 70;
  const cy = 70;
  const isComplete = done >= total;

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[hsl(var(--gold)/0.25)] bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--forest-mid))] text-cream shadow-[var(--shadow-elevated-val)] p-6 sm:p-7">
      <span className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[hsl(var(--gold)/0.2)] blur-3xl" />
      <span className="pointer-events-none absolute -bottom-20 -left-16 w-60 h-60 rounded-full bg-[hsl(var(--sage)/0.15)] blur-3xl" />

      {/* Celebration overlay */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            key="celebrate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute inset-0 z-10"
            aria-hidden
          >
            {/* radiant gold burst */}
            <motion.span
              className="absolute left-[80px] top-[80px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--gold)/0.55)] blur-2xl"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 3.2, opacity: [0, 0.9, 0] }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              style={{ width: 120, height: 120 }}
            />
            {/* ring shockwave */}
            <motion.span
              className="absolute left-[80px] top-[80px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[hsl(var(--gold-light)/0.9)]"
              initial={{ width: 60, height: 60, opacity: 0.9 }}
              animate={{ width: 220, height: 220, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            {/* gold sparkles */}
            {Array.from({ length: 14 }).map((_, i) => {
              const angle = (i / 14) * Math.PI * 2;
              const dx = Math.cos(angle) * 90;
              const dy = Math.sin(angle) * 90;
              return (
                <motion.span
                  key={i}
                  className="absolute left-[80px] top-[80px] w-1.5 h-1.5 rounded-full bg-[hsl(var(--gold-light))] drop-shadow-[0_0_6px_hsl(var(--gold)/0.9)]"
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
                  animate={{ x: dx, y: dy, opacity: [0, 1, 0], scale: [0.6, 1.2, 0.4] }}
                  transition={{ duration: 1.4, ease: "easeOut", delay: 0.05 * i }}
                />
              );
            })}
            {/* completion toast */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))] text-[10px] font-bold tracking-[0.18em] uppercase shadow-[var(--shadow-gold-val)]"
            >
              <Sparkles className="w-3 h-3" /> Day {celebrate.day} complete
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-start gap-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-[140px] h-[140px] flex-shrink-0"
        >
          <motion.div animate={ringControls} className="w-full h-full">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
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
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="drop-shadow-[0_0_10px_hsl(var(--gold)/0.5)]"
              />
              {/* 7 petal markers around the ring */}
              {Array.from({ length: total }).map((_, i) => {
                const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
                const px = cx + Math.cos(angle) * radius;
                const py = cy + Math.sin(angle) * radius;
                const isDone = completed.includes(i + 1);
                const justCompleted = celebrate?.day === i + 1;
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
                    transition={{ duration: 0.9, ease: "easeOut" }}
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
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
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
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                to={`/app/program/${VAGUS_NERVE_RESET.id}/day/${nextDay}`}
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

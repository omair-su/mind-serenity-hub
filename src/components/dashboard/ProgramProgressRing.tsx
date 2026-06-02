// Luxe 7-day program progress ring with petal markers around the perimeter.
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { VAGUS_NERVE_RESET } from "@/data/programs/vagusNerveReset";

const STORAGE_KEY = `willow:program:${VAGUS_NERVE_RESET.id}:progress`;

function getProgramCompleted(): number[] {
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
  const completed = getProgramCompleted();
  const total = VAGUS_NERVE_RESET.days.length;
  const done = completed.length;
  const pct = Math.round((done / total) * 100);
  const nextDay = Math.min(total, done + 1);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  const cx = 70;
  const cy = 70;

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[hsl(var(--gold)/0.25)] bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--forest-mid))] text-cream shadow-[var(--shadow-elevated-val)] p-6 sm:p-7">
      <span className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[hsl(var(--gold)/0.2)] blur-3xl" />
      <span className="pointer-events-none absolute -bottom-20 -left-16 w-60 h-60 rounded-full bg-[hsl(var(--sage)/0.15)] blur-3xl" />

      <div className="relative flex items-start gap-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-[140px] h-[140px] flex-shrink-0"
        >
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
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="drop-shadow-[0_0_10px_hsl(var(--gold)/0.5)]"
            />
            {/* 7 petal markers around the ring */}
            {Array.from({ length: total }).map((_, i) => {
              const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
              const px = cx + Math.cos(angle) * radius;
              const py = cy + Math.sin(angle) * radius;
              const isDone = completed.includes(i + 1);
              return (
                <circle
                  key={i}
                  cx={px}
                  cy={py}
                  r={isDone ? 4 : 2.5}
                  fill={isDone ? "hsl(var(--gold-light))" : "hsl(var(--cream)/0.5)"}
                  className={isDone ? "drop-shadow-[0_0_4px_hsl(var(--gold)/0.7)]" : ""}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-[40px] leading-none text-cream font-bold tabular-nums">{done}</span>
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
          <p className="text-xs sm:text-sm font-body italic text-cream/70 mt-2 leading-relaxed">
            {done === 0
              ? "Begin your 7-day nervous system reset."
              : done >= total
                ? "Program complete — beautifully done."
                : `${total - done} ${total - done === 1 ? "day" : "days"} remaining on your journey.`}
          </p>

          <Link
            to={`/app/program/${VAGUS_NERVE_RESET.id}/day/${nextDay}`}
            className="group mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))] font-body font-bold text-xs hover:brightness-110 transition-all shadow-[var(--shadow-gold-val)]"
          >
            {done >= total ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            {done >= total ? "Revisit Program" : done === 0 ? "Begin Day 1" : `Continue · Day ${nextDay}`}
          </Link>
        </div>
      </div>
    </div>
  );
}

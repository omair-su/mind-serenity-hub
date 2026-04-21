// Mindful Streak Garden — leaves fill as the week's streak grows; harvest leaves stack below.
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { getLevel } from "@/components/StreakCelebration";

interface Props {
  streak: number;
}

const Leaf = ({ filled, delay }: { filled: boolean; delay: number }) => (
  <motion.svg
    initial={{ scale: 0.6, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    viewBox="0 0 32 32"
    className="w-7 h-7 sm:w-8 sm:h-8"
    aria-hidden
  >
    <defs>
      <linearGradient id={`leaf-fill-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--sage-dark))" />
        <stop offset="100%" stopColor="hsl(var(--forest))" />
      </linearGradient>
    </defs>
    <path
      d="M16 4 C 8 8, 4 16, 6 26 C 16 24, 24 18, 26 8 C 22 6, 19 5, 16 4 Z"
      fill={filled ? `url(#leaf-fill-${delay})` : "transparent"}
      stroke={filled ? "hsl(var(--forest))" : "hsl(var(--sage))"}
      strokeWidth={filled ? 0 : 1.4}
    />
    {filled && (
      <path
        d="M16 6 C 14 14, 12 20, 8 24"
        stroke="hsl(var(--gold-light))"
        strokeWidth={0.8}
        fill="none"
        opacity={0.6}
      />
    )}
  </motion.svg>
);

const HarvestLeaf = ({ delay }: { delay: number }) => (
  <motion.svg
    initial={{ scale: 0.6, opacity: 0, y: -8 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewBox="0 0 32 32"
    className="w-5 h-5"
    aria-hidden
  >
    <path
      d="M16 4 C 8 8, 4 16, 6 26 C 16 24, 24 18, 26 8 C 22 6, 19 5, 16 4 Z"
      fill="hsl(var(--gold))"
      stroke="hsl(var(--gold-dark))"
      strokeWidth={0.8}
      opacity={0.85}
    />
  </motion.svg>
);

export default function StreakGarden({ streak }: Props) {
  const level = getLevel(streak);
  const thisWeek = Math.min(7, streak % 7 === 0 && streak > 0 ? 7 : streak % 7);
  const harvestedWeeks = Math.floor(streak / 7);
  const nextMilestone = streak < 7 ? 7 : streak < 14 ? 14 : streak < 21 ? 21 : 30;
  const toNext = Math.max(0, nextMilestone - streak);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--cream-dark))] bg-gradient-to-br from-[hsl(var(--cream))] via-card to-[hsl(var(--sage-light))]/40 p-5 sm:p-6 shadow-[var(--shadow-soft-val)]">
      <div className="absolute -top-12 -right-8 w-44 h-44 rounded-full bg-[hsl(var(--sage))]/15 blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3 mb-4 relative">
        <div>
          <p className="text-[10px] font-body font-bold text-[hsl(var(--forest))]/80 uppercase tracking-[0.22em]">
            Streak Garden
          </p>
          <h3 className="font-display text-xl font-bold text-foreground mt-1">
            {level.emoji} {level.name}
          </h3>
          <p className="text-xs font-body text-muted-foreground mt-0.5">
            {streak} day{streak === 1 ? "" : "s"} of practice
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--gold))]/15 border border-[hsl(var(--gold))]/30">
          <Flame className="w-3.5 h-3.5 text-[hsl(var(--gold-dark))]" />
          <span className="text-[11px] font-body font-bold text-[hsl(var(--gold-dark))]">{streak}d</span>
        </div>
      </div>

      {/* This week's leaves */}
      <div className="relative">
        <div className="flex items-end justify-between gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <Leaf key={i} filled={i < thisWeek} delay={0.05 + i * 0.06} />
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span
              key={i}
              className={`text-[9px] font-body w-7 sm:w-8 text-center ${
                i < thisWeek ? "text-[hsl(var(--forest))] font-semibold" : "text-muted-foreground"
              }`}
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Harvest stack */}
      {harvestedWeeks > 0 && (
        <div className="mt-4 pt-4 border-t border-[hsl(var(--cream-dark))]/60 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-[hsl(var(--gold-dark))]">
              Harvested weeks
            </span>
            <span className="text-[10px] font-body text-muted-foreground">{harvestedWeeks} × 7-day</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: Math.min(harvestedWeeks, 12) }).map((_, i) => (
              <HarvestLeaf key={i} delay={0.5 + i * 0.04} />
            ))}
            {harvestedWeeks > 12 && (
              <span className="text-[10px] font-body text-muted-foreground self-center ml-1">
                +{harvestedWeeks - 12}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Next milestone */}
      {toNext > 0 && (
        <p className="mt-4 text-[11px] font-body text-muted-foreground italic">
          {toNext} more day{toNext === 1 ? "" : "s"} until your next milestone.
        </p>
      )}
    </div>
  );
}

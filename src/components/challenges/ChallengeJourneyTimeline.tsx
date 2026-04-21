// Vertical journey timeline — Day 1 → final, with completed nodes filled in forest
// and the "you are here" gold dot pulsing on the next pending day.
import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import type { Challenge } from "@/data/challenges";

interface Props {
  challenge: Challenge;
  completedDays: number[];
  onSelect: (day: number) => void;
}

export default function ChallengeJourneyTimeline({ challenge, completedDays, onSelect }: Props) {
  const nextDay = challenge.days.find(d => !completedDays.includes(d.day))?.day ?? challenge.duration;

  return (
    <div className="relative">
      {/* Vertical rail */}
      <span className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-[hsl(var(--forest))]/30 via-[hsl(var(--sage))]/40 to-[hsl(var(--gold))]/30" />

      <ol className="space-y-2">
        {challenge.days.map((day, i) => {
          const done = completedDays.includes(day.day);
          const isCurrent = day.day === nextDay && !done;
          return (
            <motion.li
              key={day.day}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.4 }}
            >
              <button
                onClick={() => onSelect(day.day)}
                disabled={done}
                className={`group w-full text-left flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  done
                    ? "bg-[hsl(var(--sage-light))]/50 border-[hsl(var(--sage))]/40"
                    : isCurrent
                    ? "bg-card border-[hsl(var(--gold))]/55 shadow-[var(--shadow-soft-val)] ring-1 ring-[hsl(var(--gold))]/25"
                    : "bg-card border-[hsl(var(--cream-dark))] hover:border-[hsl(var(--sage-dark))]/40 hover:bg-[hsl(var(--sage-light))]/30"
                }`}
              >
                <span className="relative flex-shrink-0">
                  <span
                    className={`flex w-10 h-10 rounded-full items-center justify-center font-display text-sm font-bold relative z-10 ${
                      done
                        ? "bg-[hsl(var(--forest))] text-white"
                        : isCurrent
                        ? "bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))] shadow-[var(--shadow-gold-val)]"
                        : "bg-white text-muted-foreground border border-[hsl(var(--cream-dark))]"
                    }`}
                  >
                    {done ? <Check className="w-4 h-4" /> : day.day}
                  </span>
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full bg-[hsl(var(--gold))]/40 animate-ping" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className={`font-display text-sm font-semibold truncate ${
                      done ? "text-[hsl(var(--forest))]" : "text-foreground"
                    }`}>
                      {day.title}
                    </p>
                    <span className="text-[10px] font-body text-muted-foreground inline-flex items-center gap-0.5 flex-shrink-0">
                      <Clock className="w-2.5 h-2.5" /> {day.duration}m
                    </span>
                  </div>
                  <p className="text-xs font-body text-muted-foreground truncate mt-0.5">{day.description}</p>
                </div>
              </button>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

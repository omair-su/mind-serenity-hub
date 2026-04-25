// Interactive before/after mood ritual — luxury cream + gold styling.
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Minus, ArrowDownRight } from "lucide-react";

interface MoodDeltaChartProps {
  moodBefore: number;
  moodAfter: number;
  onChangeBefore?: (v: number) => void;
  onChangeAfter?: (v: number) => void;
}

const MOOD_EMOJIS = ["😞", "😟", "😕", "😐", "🙂", "😊", "😄", "😁", "🥰", "✨"];

function MoodRow({
  label,
  value,
  onChange,
  accent,
}: {
  label: string;
  value: number;
  onChange?: (v: number) => void;
  accent: "muted" | "gold";
}) {
  const interactive = !!onChange;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-body font-bold tracking-[0.2em] uppercase text-[hsl(var(--charcoal-soft))]">
          {label}
        </p>
        <p
          className={`text-xs font-display font-bold tabular-nums ${
            accent === "gold" ? "text-[hsl(var(--gold-dark))]" : "text-[hsl(var(--charcoal))]"
          }`}
        >
          {value} / 10
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {MOOD_EMOJIS.map((emoji, i) => {
          const v = i + 1;
          const active = v === value;
          return (
            <button
              key={v}
              type="button"
              disabled={!interactive}
              onClick={() => onChange?.(v)}
              aria-label={`${label} ${v}`}
              className={`relative w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-base md:text-lg transition-all
                ${
                  active
                    ? accent === "gold"
                      ? "bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] shadow-[var(--shadow-gold-val)] scale-110 ring-2 ring-[hsl(var(--gold))]/40"
                      : "bg-[hsl(var(--cream-dark))] ring-2 ring-[hsl(var(--charcoal))]/30 scale-110"
                    : "bg-[hsl(var(--cream))]/70 hover:bg-[hsl(var(--cream-dark))] hover:scale-105 opacity-70 hover:opacity-100"
                }
                ${interactive ? "cursor-pointer" : "cursor-default"}`}
            >
              <span className="leading-none">{emoji}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function MoodDeltaChart({
  moodBefore,
  moodAfter,
  onChangeBefore,
  onChangeAfter,
}: MoodDeltaChartProps) {
  const delta = moodAfter - moodBefore;
  const improved = delta > 0;
  const same = delta === 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[hsl(var(--cream))]/70 border border-[hsl(var(--gold))]/25 p-6 md:p-8 shadow-soft">
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[hsl(var(--gold))]/12 blur-2xl pointer-events-none" />

      {improved && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 1] }}
          transition={{ duration: 2 }}
          className="absolute top-3 right-3 text-[hsl(var(--gold-dark))]"
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-body font-bold tracking-[0.25em] uppercase text-[hsl(var(--gold-dark))]">
              Mood Ritual
            </p>
            <h3 className="font-display text-xl font-semibold text-[hsl(var(--charcoal))] mt-1">
              How did this practice land?
            </h3>
            <p className="text-xs font-body text-[hsl(var(--charcoal-soft))] mt-1">
              Tap how you felt — before and after today's session.
            </p>
          </div>

          <motion.div
            key={`${moodBefore}-${moodAfter}`}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border ${
              improved
                ? "bg-[hsl(var(--gold))]/10 border-[hsl(var(--gold))]/40 text-[hsl(var(--gold-dark))]"
                : same
                ? "bg-[hsl(var(--cream-dark))]/60 border-[hsl(var(--border))] text-[hsl(var(--charcoal-soft))]"
                : "bg-[hsl(var(--cream-dark))]/60 border-[hsl(var(--border))] text-[hsl(var(--charcoal-soft))]"
            }`}
          >
            {improved && <ArrowUpRight className="w-5 h-5" />}
            {same && <Minus className="w-5 h-5" />}
            {!improved && !same && <ArrowDownRight className="w-5 h-5" />}
            <span className="text-xs font-display font-bold tabular-nums">
              {delta > 0 ? `+${delta}` : delta}
            </span>
          </motion.div>
        </div>

        <div className="space-y-5">
          <MoodRow label="Before" value={moodBefore} onChange={onChangeBefore} accent="muted" />
          <MoodRow label="After" value={moodAfter} onChange={onChangeAfter} accent="gold" />
        </div>

        {/* Arc visualization */}
        <svg viewBox="0 0 200 60" className="w-full h-12 mt-5">
          <motion.path
            key={`${moodBefore}-${moodAfter}-arc`}
            d={`M 20 50 Q 100 ${50 - delta * 4} 180 50`}
            fill="none"
            stroke="hsl(var(--gold))"
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <circle cx={20} cy={50} r={3} fill="hsl(var(--charcoal-soft))" />
          <motion.circle
            cx={180}
            cy={50}
            r={4}
            fill="hsl(var(--gold))"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          />
        </svg>

        <p className="text-xs font-body text-center text-[hsl(var(--charcoal-soft))] mt-2 italic">
          {improved
            ? "Your nervous system is settling. Beautiful work."
            : same
            ? "You showed up. That's the practice."
            : "Honest noticing is also the practice."}
        </p>
      </div>
    </div>
  );
}

// Animated before/after mood arc with sparkle on improvement.
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Minus, ArrowDownRight } from "lucide-react";

interface MoodDeltaChartProps {
  moodBefore: number;
  moodAfter: number;
}

const MOOD_EMOJIS = ["😞", "😟", "😕", "😐", "🙂", "😊", "😄", "😁", "🥰", "✨"];

export default function MoodDeltaChart({ moodBefore, moodAfter }: MoodDeltaChartProps) {
  const delta = moodAfter - moodBefore;
  const improved = delta > 0;
  const same = delta === 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--cream))]/60 via-card to-[hsl(var(--gold))]/8 border border-[hsl(var(--gold))]/20 p-6 shadow-soft">
      {improved && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 1] }}
          transition={{ duration: 2 }}
          className="absolute top-2 right-2 text-[hsl(var(--gold))]"
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
      )}

      <p className="text-[10px] font-body font-bold tracking-[0.2em] uppercase text-[hsl(var(--gold))] mb-3">Mood Shift</p>

      <div className="flex items-center justify-around gap-3 mb-4">
        <div className="text-center flex-1">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl mb-1"
          >
            {MOOD_EMOJIS[moodBefore - 1]}
          </motion.div>
          <p className="text-[10px] font-body uppercase tracking-wider text-muted-foreground">Before</p>
          <p className="font-display text-xl font-bold text-foreground">{moodBefore}</p>
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className={`flex flex-col items-center gap-1 px-3 ${
            improved ? "text-emerald-600" : same ? "text-muted-foreground" : "text-rose-500"
          }`}
        >
          {improved && <ArrowUpRight className="w-6 h-6" />}
          {same && <Minus className="w-6 h-6" />}
          {!improved && !same && <ArrowDownRight className="w-6 h-6" />}
          <span className="text-xs font-display font-bold tabular-nums">
            {delta > 0 ? `+${delta}` : delta}
          </span>
        </motion.div>

        <div className="text-center flex-1">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl mb-1"
          >
            {MOOD_EMOJIS[moodAfter - 1]}
          </motion.div>
          <p className="text-[10px] font-body uppercase tracking-wider text-muted-foreground">After</p>
          <p className="font-display text-xl font-bold text-[hsl(var(--gold))]">{moodAfter}</p>
        </div>
      </div>

      {/* Arc visualization */}
      <svg viewBox="0 0 200 60" className="w-full h-12">
        <motion.path
          d={`M 20 50 Q 100 ${50 - delta * 4} 180 50`}
          fill="none"
          stroke="hsl(var(--gold))"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        />
        <circle cx={20} cy={50} r={3} fill="hsl(var(--muted-foreground))" />
        <motion.circle
          cx={180}
          cy={50}
          r={4}
          fill="hsl(var(--gold))"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.4, type: "spring" }}
        />
      </svg>

      <p className="text-xs font-body text-center text-muted-foreground mt-2 italic">
        {improved
          ? "✨ Your nervous system is settling. Beautiful work."
          : same
          ? "You showed up. That's the practice."
          : "Honest noticing is also the practice."}
      </p>
    </div>
  );
}

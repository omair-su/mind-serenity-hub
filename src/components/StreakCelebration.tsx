import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, Star, Crown, Sparkles } from "lucide-react";

interface StreakCelebrationProps {
  streak: number;
  show: boolean;
  onClose: () => void;
}

const milestones = [
  { days: 3, title: "Getting Started!", emoji: "🌱", level: "Seedling", color: "hsl(var(--sage))" },
  { days: 7, title: "One Week Strong!", emoji: "🔥", level: "Sprout", color: "hsl(var(--forest))" },
  { days: 14, title: "Two Weeks!", emoji: "💪", level: "Sapling", color: "hsl(var(--primary))" },
  { days: 21, title: "Habit Formed!", emoji: "🌳", level: "Tree", color: "hsl(var(--gold))" },
  { days: 30, title: "One Month!", emoji: "👑", level: "Forest", color: "hsl(var(--gold-dark))" },
];

function getMilestone(streak: number) {
  return milestones.filter(m => m.days <= streak).pop();
}

export function getLevel(streak: number): { name: string; emoji: string; next: number; progress: number } {
  if (streak >= 30) return { name: "Forest", emoji: "🌲", next: 30, progress: 100 };
  if (streak >= 21) return { name: "Tree", emoji: "🌳", next: 30, progress: (streak / 30) * 100 };
  if (streak >= 14) return { name: "Sapling", emoji: "🌿", next: 21, progress: (streak / 21) * 100 };
  if (streak >= 7) return { name: "Sprout", emoji: "🌱", next: 14, progress: (streak / 14) * 100 };
  if (streak >= 3) return { name: "Seedling", emoji: "🫘", next: 7, progress: (streak / 7) * 100 };
  return { name: "Seed", emoji: "🫘", next: 3, progress: (streak / 3) * 100 };
}

export function StreakBadge({ streak, size = "md" }: { streak: number; size?: "sm" | "md" | "lg" }) {
  const level = getLevel(streak);
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-12 h-12 text-sm", lg: "w-16 h-16 text-base" };
  const iconSizes = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };

  return (
    <motion.div
      className={`relative ${sizes[size]} rounded-full bg-gradient-to-br from-[hsl(var(--gold))]/20 to-[hsl(var(--gold-dark))]/10 flex items-center justify-center border border-[hsl(var(--gold))]/30`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Flame className={`${iconSizes[size]} text-[hsl(var(--gold))]`} />
      {streak > 0 && (
        <motion.span
          key={streak}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-1 -right-1 bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))] rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold font-body"
        >
          {streak}
        </motion.span>
      )}
    </motion.div>
  );
}

export function StreakProgress({ streak }: { streak: number }) {
  const level = getLevel(streak);
  const nextMilestone = milestones.find(m => m.days > streak);

  return (
    <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-[var(--shadow-soft-val)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <StreakBadge streak={streak} size="md" />
          <div>
            <p className="font-display text-sm font-bold text-foreground">{level.emoji} {level.name}</p>
            <p className="text-[11px] font-body text-muted-foreground">{streak} day streak</p>
          </div>
        </div>
        {nextMilestone && (
          <div className="text-right">
            <p className="text-[10px] font-body text-muted-foreground">Next milestone</p>
            <p className="text-xs font-body font-semibold text-[hsl(var(--gold))]">
              {nextMilestone.emoji} {nextMilestone.days - streak} days
            </p>
          </div>
        )}
      </div>

      {/* Level progress bar */}
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(level.progress, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] rounded-full"
        />
      </div>

      {/* Milestone dots */}
      <div className="flex justify-between mt-2">
        {milestones.map(m => (
          <div key={m.days} className="flex flex-col items-center">
            <div className={`w-2 h-2 rounded-full ${streak >= m.days ? "bg-[hsl(var(--gold))]" : "bg-secondary"}`} />
            <span className="text-[8px] font-body text-muted-foreground mt-1">{m.days}d</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StreakCelebration({ streak, show, onClose }: StreakCelebrationProps) {
  const milestone = getMilestone(streak);
  if (!milestone) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative w-[300px] p-8 text-center"
            onClick={e => e.stopPropagation()}
          >
            {/* Particle burst */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 30 * Math.PI) / 180) * 120,
                  y: Math.sin((i * 30 * Math.PI) / 180) * 120,
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 1, delay: 0.3 + i * 0.05, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                style={{ background: i % 2 === 0 ? "hsl(var(--gold))" : "hsl(var(--sage))" }}
              />
            ))}

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
              className="text-6xl mb-4"
            >
              {milestone.emoji}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/15"
            >
              <div className="flex items-center justify-center gap-1 text-[hsl(var(--gold))] mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-body font-bold uppercase tracking-widest">Milestone</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-1">{milestone.title}</h3>
              <p className="text-white/60 text-sm font-body mb-3">
                {streak} days of consistent practice
              </p>
              <p className="text-[hsl(var(--gold))] text-sm font-body font-semibold">
                Level: {milestone.level}
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={onClose}
              className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-body font-bold text-sm hover:brightness-110 transition-all"
            >
              Continue
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

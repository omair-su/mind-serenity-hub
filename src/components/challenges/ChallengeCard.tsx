// Premium challenge card with halo emoji, day-dot row, difficulty badge,
// social proof, and trophy ribbon when complete.
import { motion } from "framer-motion";
import { Clock, Play, ArrowRight, Trophy, Users } from "lucide-react";
import type { Challenge } from "@/data/challenges";

interface Props {
  challenge: Challenge;
  completedDays: number[];
  pct: number;
  onOpen: () => void;
  // pseudo-stable social proof number derived from id length
  socialCount?: number;
}

const difficultyFor = (duration: number): "Beginner" | "Deepening" | "Advanced" => {
  if (duration <= 5) return "Beginner";
  if (duration <= 7) return "Deepening";
  return "Advanced";
};

const difficultyTone = (d: string) =>
  d === "Beginner"
    ? "bg-[hsl(var(--sage-light))] text-[hsl(var(--forest))] border-[hsl(var(--sage))]/40"
    : d === "Deepening"
    ? "bg-[hsl(var(--gold))]/15 text-[hsl(var(--gold-dark))] border-[hsl(var(--gold))]/40"
    : "bg-[hsl(var(--forest))]/10 text-[hsl(var(--forest-deep))] border-[hsl(var(--forest))]/30";

export default function ChallengeCard({ challenge, completedDays, pct, onOpen, socialCount }: Props) {
  const completed = pct >= 100;
  const started = pct > 0 && !completed;
  const difficulty = difficultyFor(challenge.duration);
  const social = socialCount ?? 100 + (challenge.id.length * 137) % 1800;

  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={onOpen}
      className={`group relative text-left w-full overflow-hidden rounded-3xl border ${
        completed ? "border-[hsl(var(--gold))]/55" : "border-[hsl(var(--cream-dark))] hover:border-[hsl(var(--sage-dark))]/45"
      } bg-gradient-to-br ${challenge.color} shadow-[var(--shadow-soft-val)] hover:shadow-[var(--shadow-card-val)] transition-shadow`}
    >
      {/* Left gold rule on hover */}
      <span className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full bg-[hsl(var(--gold))] opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Trophy ribbon corner-fold */}
      {completed && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute top-2 right-[-30px] rotate-45 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] text-[9px] font-body font-bold uppercase tracking-wider px-8 py-1 shadow">
            Complete
          </div>
          <Trophy className="absolute top-2.5 right-2.5 w-4 h-4 text-[hsl(var(--gold-dark))]" />
        </div>
      )}

      <div className="relative p-5 sm:p-6">
        {/* Halo + emoji */}
        <div className="relative inline-flex items-center justify-center mb-3">
          <span className="absolute inset-0 -m-3 rounded-full bg-[hsl(var(--gold))]/12 blur-xl" />
          <span className="relative text-4xl drop-shadow-sm">{challenge.icon}</span>
        </div>

        <h3 className="font-display text-lg font-bold text-foreground leading-snug">
          {challenge.name}
        </h3>
        <p className="text-xs font-body text-muted-foreground mt-1 leading-relaxed line-clamp-2">
          {challenge.description}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-body text-foreground/70 px-2 py-0.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/50">
            <Clock className="w-3 h-3" /> {challenge.duration} days
          </span>
          <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full border ${difficultyTone(difficulty)}`}>
            {difficulty}
          </span>
          <span className="text-[10px] font-body text-muted-foreground px-2 py-0.5 rounded-full bg-white/40 border border-white/40">
            {challenge.category}
          </span>
        </div>

        {/* Day dot row */}
        <div className="flex items-center gap-1 mt-4" aria-label={`${completedDays.length} of ${challenge.duration} days complete`}>
          {Array.from({ length: challenge.duration }).map((_, i) => {
            const done = completedDays.includes(i + 1);
            return (
              <span
                key={i}
                className={`h-1.5 flex-1 max-w-[14px] rounded-full transition-all ${
                  done ? "bg-[hsl(var(--forest))]" : "bg-white/60 border border-white/70"
                }`}
              />
            );
          })}
        </div>

        {/* Footer: social proof + CTA */}
        <div className="flex items-center justify-between mt-4">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-body text-muted-foreground">
            <Users className="w-3 h-3" />
            {social.toLocaleString()} practising
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-body font-semibold text-[hsl(var(--forest))] group-hover:gap-2 transition-all">
            <Play className="w-3 h-3" />
            {completed ? "Revisit" : started ? "Continue" : "Begin"}
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}

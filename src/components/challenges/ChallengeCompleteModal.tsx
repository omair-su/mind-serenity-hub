// Full-screen celebration when a challenge is fully complete.
// Animated trophy fill + day-by-day reflection highlight reel.
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, X } from "lucide-react";
import type { Challenge, ChallengeProgress } from "@/data/challenges";

interface Props {
  show: boolean;
  challenge: Challenge | null;
  progress: ChallengeProgress | null;
  onClose: () => void;
}

export default function ChallengeCompleteModal({ show, challenge, progress, onClose }: Props) {
  if (!challenge || !progress) return null;
  const reflections = challenge.days
    .map(d => ({ day: d.day, title: d.title, note: progress.notes[d.day] }))
    .filter(r => r.note && r.note.trim().length > 0);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[hsl(var(--forest-deep))]/85 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-[hsl(var(--cream))] via-card to-[hsl(var(--gold-light))]/30 border border-[hsl(var(--gold))]/40 p-6 sm:p-8 shadow-[var(--shadow-elevated-val)] max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Particle burst */}
            {[...Array(14)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 25.7 * Math.PI) / 180) * 140,
                  y: Math.sin((i * 25.7 * Math.PI) / 180) * 140,
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 1.4, delay: 0.25 + i * 0.04, ease: "easeOut" }}
                className="absolute top-20 left-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
                style={{ background: i % 2 === 0 ? "hsl(var(--gold))" : "hsl(var(--sage-dark))" }}
              />
            ))}

            {/* Animated trophy */}
            <div className="relative mx-auto w-24 h-24 mb-4">
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 180, delay: 0.15 }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center shadow-[var(--shadow-gold-val)]"
              >
                <Trophy className="w-12 h-12 text-white drop-shadow" />
              </motion.div>
              <motion.span
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-2 rounded-full bg-[hsl(var(--gold))]/30 blur-xl pointer-events-none"
              />
            </div>

            <div className="text-center">
              <span className="inline-flex items-center gap-1 text-[hsl(var(--gold-dark))] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[10px] font-body font-bold uppercase tracking-[0.25em]">Challenge complete</span>
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <h3 className="font-display text-2xl font-bold text-foreground mt-1">{challenge.name}</h3>
              <p className="text-sm font-body text-muted-foreground mt-1">
                {challenge.duration} days of practice — beautifully done.
              </p>
            </div>

            {reflections.length > 0 && (
              <div className="mt-6 space-y-2 max-h-56 overflow-y-auto pr-1">
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.22em] text-[hsl(var(--forest))] mb-1">
                  Your reflections
                </p>
                {reflections.map((r, i) => (
                  <motion.div
                    key={r.day}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="rounded-xl bg-white/70 border border-[hsl(var(--cream-dark))] p-3"
                  >
                    <p className="text-[10px] font-body font-bold text-[hsl(var(--forest))] uppercase tracking-wider">
                      Day {r.day} · {r.title}
                    </p>
                    <p className="text-xs font-body text-foreground/80 italic mt-1 leading-relaxed">
                      "{r.note}"
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            <button
              onClick={onClose}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white font-body font-bold text-sm hover:brightness-110 transition-all shadow-[var(--shadow-gold-val)]"
            >
              Continue your practice
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

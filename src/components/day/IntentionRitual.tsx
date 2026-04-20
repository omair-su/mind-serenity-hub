// 3-step pre-session ritual: intention word → mood-before → three settling breaths.
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import HeartCoherenceRing from "./HeartCoherenceRing";

interface IntentionRitualProps {
  open: boolean;
  initialIntention?: string;
  initialMoodBefore?: number;
  onClose: () => void;
  onComplete: (data: { intention: string; moodBefore: number }) => void;
}

const MOOD_EMOJIS = ["😞", "😟", "😕", "😐", "🙂", "😊", "😄", "😁", "🥰", "✨"];

export default function IntentionRitual({
  open, initialIntention = "", initialMoodBefore = 5, onClose, onComplete,
}: IntentionRitualProps) {
  const [step, setStep] = useState(0);
  const [intention, setIntention] = useState(initialIntention);
  const [mood, setMood] = useState<number[]>([initialMoodBefore]);
  const [breathCount, setBreathCount] = useState(0);
  const [breathPhase, setBreathPhase] = useState<"in" | "out">("in");

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(0);
      setIntention(initialIntention);
      setMood([initialMoodBefore]);
      setBreathCount(0);
      setBreathPhase("in");
    }
  }, [open, initialIntention, initialMoodBefore]);

  // Three settling breaths
  useEffect(() => {
    if (!open || step !== 2 || breathCount >= 3) return;
    const t1 = setTimeout(() => setBreathPhase("out"), 4000);
    const t2 = setTimeout(() => {
      setBreathPhase("in");
      setBreathCount((c) => c + 1);
    }, 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [open, step, breathCount]);

  // Auto-finish after 3 breaths
  useEffect(() => {
    if (breathCount >= 3 && step === 2) {
      const t = setTimeout(() => {
        onComplete({ intention: intention.trim() || "presence", moodBefore: mood[0] });
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [breathCount, step, intention, mood, onComplete]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[hsl(var(--charcoal))]/85 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.94, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.94, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 26 }}
          className="relative w-full max-w-md rounded-3xl overflow-hidden bg-card border border-[hsl(var(--gold))]/25 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/20 text-white/70 hover:bg-black/40"
            aria-label="Skip ritual"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Step indicator */}
          <div className="flex items-center gap-1.5 px-6 pt-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 rounded-full transition-all ${
                  i <= step ? "bg-[hsl(var(--gold))]" : "bg-border"
                }`}
              />
            ))}
          </div>

          <div className="p-6 pt-5 min-h-[360px] flex flex-col">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col"
                >
                  <Sparkles className="w-6 h-6 text-[hsl(var(--gold))] mb-3" />
                  <p className="text-[10px] font-body font-bold tracking-[0.2em] uppercase text-[hsl(var(--gold))] mb-2">Step 1 of 3</p>
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-2">Set an intention</h3>
                  <p className="font-body text-sm text-muted-foreground mb-5 leading-relaxed">
                    One word. What do you want to invite into this practice?
                  </p>
                  <Input
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    placeholder="calm · patience · release · presence"
                    autoFocus
                    maxLength={30}
                    className="font-display text-lg text-center h-14 border-[hsl(var(--gold))]/30 focus-visible:ring-[hsl(var(--gold))]/40"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                    {["calm", "presence", "release", "courage", "kindness", "rest"].map((w) => (
                      <button
                        key={w}
                        onClick={() => setIntention(w)}
                        className="px-3 py-1 rounded-full text-[11px] font-body bg-secondary hover:bg-[hsl(var(--gold))]/20 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="mt-auto pt-5 w-full py-3.5 rounded-xl bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-body font-bold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    Next
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col"
                >
                  <Sparkles className="w-6 h-6 text-[hsl(var(--gold))] mb-3" />
                  <p className="text-[10px] font-body font-bold tracking-[0.2em] uppercase text-[hsl(var(--gold))] mb-2">Step 2 of 3</p>
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-2">How do you feel right now?</h3>
                  <p className="font-body text-sm text-muted-foreground mb-6 leading-relaxed">
                    No judgment — just an honest snapshot of this moment.
                  </p>

                  <div className="text-center mb-4">
                    <motion.div
                      key={mood[0]}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-7xl"
                    >
                      {MOOD_EMOJIS[mood[0] - 1]}
                    </motion.div>
                  </div>

                  <Slider value={mood} onValueChange={setMood} min={1} max={10} step={1} className="mb-2" />
                  <div className="flex justify-between text-[11px] font-body text-muted-foreground mb-6">
                    <span>1 — Heavy</span>
                    <span className="font-display font-bold text-[hsl(var(--gold))] text-base">{mood[0]}</span>
                    <span>10 — Radiant</span>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="mt-auto w-full py-3.5 rounded-xl bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-body font-bold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    Next
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 flex flex-col items-center text-center"
                >
                  <p className="text-[10px] font-body font-bold tracking-[0.2em] uppercase text-[hsl(var(--gold))] mb-3">Step 3 of 3</p>
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-1">Three settling breaths</h3>
                  <p className="font-body text-sm text-muted-foreground mb-6">Follow the orb. Let your body arrive.</p>

                  <HeartCoherenceRing size={200} bpm={7.5}>
                    <motion.div
                      animate={{
                        scale: breathPhase === "in" ? 1.1 : 0.85,
                        opacity: breathPhase === "in" ? 1 : 0.7,
                      }}
                      transition={{ duration: 4, ease: "easeInOut" }}
                      className="w-28 h-28 rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] shadow-[0_0_40px_hsl(var(--gold)/0.6)]"
                    />
                  </HeartCoherenceRing>

                  <p className="mt-5 text-sm font-display font-medium text-foreground tracking-widest uppercase">
                    {breathCount >= 3 ? "Beginning…" : breathPhase === "in" ? "Breathe in" : "Breathe out"}
                  </p>
                  <p className="text-[11px] font-body text-muted-foreground mt-1">
                    {Math.min(breathCount + 1, 3)} of 3
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

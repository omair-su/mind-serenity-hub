import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Wind, Eye, Heart, MessageCircle, Sparkles } from "lucide-react";
import { logSOSEvent } from "@/lib/sosStore";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuggestChat?: () => void;
}

type StepId = "reassure" | "ground" | "breathe" | "checkin" | "followup";

const STEPS: StepId[] = ["reassure", "ground", "breathe", "checkin", "followup"];

export default function PanicAttackProtocol({ open, onClose, onSuggestChat }: Props) {
  const [step, setStep] = useState(0);
  const [panicBefore, setPanicBefore] = useState<number | null>(null);
  const [panicAfter, setPanicAfter] = useState<number | null>(null);
  const [grounding, setGrounding] = useState<string[]>(["", "", "", "", ""]);
  const [boxPhase, setBoxPhase] = useState<"in" | "hold1" | "out" | "hold2">("in");
  const [boxCount, setBoxCount] = useState(4);
  const startedAt = useRef(Date.now());

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(0);
      setPanicBefore(null);
      setPanicAfter(null);
      setGrounding(["", "", "", "", ""]);
      startedAt.current = Date.now();
    }
  }, [open]);

  // Box-breathing 4-4-4-4 timer (only on breathe step)
  useEffect(() => {
    if (!open || STEPS[step] !== "breathe") return;
    const phases: Array<"in" | "hold1" | "out" | "hold2"> = ["in", "hold1", "out", "hold2"];
    let phaseIdx = 0;
    let count = 4;
    setBoxPhase(phases[0]); setBoxCount(4);
    const id = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        phaseIdx = (phaseIdx + 1) % 4;
        setBoxPhase(phases[phaseIdx]);
        count = 4;
      }
      setBoxCount(count);
    }, 1000);
    return () => clearInterval(id);
  }, [open, step]);

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const finish = () => {
    logSOSEvent({
      toolId: "panic-attack-protocol",
      toolTitle: "Panic Attack Protocol",
      category: "panic",
      startedAt: startedAt.current,
      durationSec: Math.floor((Date.now() - startedAt.current) / 1000),
      panicBefore: panicBefore ?? undefined,
      panicAfter: panicAfter ?? undefined,
    });
    onClose();
  };

  if (!open) return null;

  const current = STEPS[step];

  return (
    <AnimatePresence>
      <motion.div
        key="panic-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        // Calming blue full-screen takeover
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, hsl(210 60% 22%) 0%, hsl(205 55% 30%) 50%, hsl(200 50% 38%) 100%)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-3 rounded-full bg-white/10 backdrop-blur-xl text-white/90 hover:bg-white/20 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full max-w-xl text-white">
          {/* Step pill */}
          <div className="flex justify-center gap-1.5 mb-8">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={`h-1 rounded-full transition-all ${i === step ? "w-10 bg-white" : i < step ? "w-6 bg-white/60" : "w-6 bg-white/20"}`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {current === "reassure" && (
              <motion.div key="reassure" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-8">
                <Heart className="w-14 h-14 mx-auto text-white/90" />
                <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">You're safe.<br />This will pass.</h2>
                <p className="font-body text-lg text-white/80 max-w-md mx-auto leading-relaxed">
                  What you're feeling is real, but it is not dangerous. Your body is having a stress response. We'll move through this together, one step at a time.
                </p>
                <div className="pt-2">
                  <p className="text-sm font-body text-white/70 mb-3">Right now, how intense is the panic? (1–10)</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <button
                        key={n}
                        onClick={() => setPanicBefore(n)}
                        className={`w-10 h-10 rounded-full font-body font-bold transition ${panicBefore === n ? "bg-white text-[hsl(210_60%_22%)] scale-110" : "bg-white/15 hover:bg-white/25"}`}
                      >{n}</button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={next}
                  disabled={panicBefore === null}
                  className="mx-auto flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[hsl(210_60%_22%)] font-body font-bold disabled:opacity-40 hover:scale-105 transition"
                >
                  I'm ready to begin <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {current === "ground" && (
              <motion.div key="ground" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="text-center space-y-3">
                  <Eye className="w-12 h-12 mx-auto text-white/90" />
                  <h2 className="font-display text-3xl md:text-4xl font-bold">Name 5 things you can see</h2>
                  <p className="text-white/75 font-body">Look around. Type whatever you notice — a wall, a cup, your hand. This brings you back to the present.</p>
                </div>
                <div className="space-y-3">
                  {grounding.map((v, i) => (
                    <input
                      key={i}
                      value={v}
                      onChange={(e) => {
                        const arr = [...grounding]; arr[i] = e.target.value; setGrounding(arr);
                      }}
                      placeholder={`${i + 1}. I see…`}
                      className="w-full px-5 py-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white placeholder-white/50 font-body focus:outline-none focus:bg-white/20 focus:border-white/40"
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-[hsl(210_60%_22%)] font-body font-bold hover:scale-[1.02] transition"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {current === "breathe" && (
              <motion.div key="breathe" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-8">
                <Wind className="w-12 h-12 mx-auto text-white/90" />
                <h2 className="font-display text-3xl md:text-4xl font-bold">Box Breathing</h2>
                <p className="text-white/75 font-body max-w-sm mx-auto">Follow the circle. Breathe in 4 · hold 4 · out 4 · hold 4.</p>

                <div className="relative w-64 h-64 mx-auto">
                  <motion.div
                    animate={{
                      scale: boxPhase === "in" ? 1.15 : boxPhase === "out" ? 0.85 : boxPhase === "hold1" ? 1.15 : 0.85,
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md border border-white/30"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="font-display text-2xl font-bold capitalize">
                      {boxPhase === "in" ? "Breathe in" : boxPhase === "out" ? "Breathe out" : "Hold"}
                    </p>
                    <p className="font-display text-6xl font-bold mt-2">{boxCount}</p>
                  </div>
                </div>

                <button
                  onClick={next}
                  className="mx-auto flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[hsl(210_60%_22%)] font-body font-bold hover:scale-105 transition"
                >
                  I feel calmer <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {current === "checkin" && (
              <motion.div key="checkin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-8">
                <Heart className="w-12 h-12 mx-auto text-white/90" />
                <h2 className="font-display text-3xl md:text-4xl font-bold">How do you feel now? (1–10)</h2>
                <p className="text-white/75 font-body">No right answer. Just notice.</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button
                      key={n}
                      onClick={() => setPanicAfter(n)}
                      className={`w-12 h-12 rounded-full font-body font-bold transition ${panicAfter === n ? "bg-white text-[hsl(210_60%_22%)] scale-110" : "bg-white/15 hover:bg-white/25"}`}
                    >{n}</button>
                  ))}
                </div>
                {panicAfter !== null && panicBefore !== null && (
                  <div className="px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 max-w-sm mx-auto">
                    <p className="font-body text-sm text-white/90">
                      {panicAfter < panicBefore
                        ? `You moved from ${panicBefore} → ${panicAfter}. That's real progress. Be proud.`
                        : panicAfter === panicBefore
                        ? "Still intense — that's okay. Some waves take longer. Want to try another round?"
                        : "It's okay if it's still loud. Let's try one more grounding round, or talk to your companion."}
                    </p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-body font-bold border border-white/20"
                  >
                    Repeat breathing
                  </button>
                  <button
                    onClick={next}
                    disabled={panicAfter === null}
                    className="px-8 py-3 rounded-full bg-white text-[hsl(210_60%_22%)] font-body font-bold disabled:opacity-40 hover:scale-105 transition"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {current === "followup" && (
              <motion.div key="followup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-6">
                <Sparkles className="w-12 h-12 mx-auto text-white/90" />
                <h2 className="font-display text-3xl md:text-4xl font-bold">You did it.</h2>
                <p className="text-white/85 font-body max-w-md mx-auto leading-relaxed">
                  You moved through it. That took courage. Here are gentle next steps — pick what feels right, or just rest.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
                  <button
                    onClick={() => { onSuggestChat?.(); finish(); }}
                    className="px-5 py-4 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-left"
                  >
                    <MessageCircle className="w-5 h-5 mb-2" />
                    <p className="font-body font-bold">Talk to companion</p>
                    <p className="text-xs text-white/70 mt-0.5">Process what just happened</p>
                  </button>
                  <button
                    onClick={finish}
                    className="px-5 py-4 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-left"
                  >
                    <Heart className="w-5 h-5 mb-2" />
                    <p className="font-body font-bold">Rest now</p>
                    <p className="text-xs text-white/70 mt-0.5">Close gently and breathe</p>
                  </button>
                </div>
                <button
                  onClick={finish}
                  className="text-white/70 hover:text-white font-body text-sm underline-offset-4 hover:underline mt-4"
                >
                  Exit
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

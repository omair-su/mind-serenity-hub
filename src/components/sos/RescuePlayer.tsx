import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Pause, Play, Heart, Star } from "lucide-react";
import type { RescueTechnique } from "@/data/rescueTechniques";
import { logSOSEvent, isFavorite, toggleFavorite } from "@/lib/sosStore";

interface Props {
  technique: RescueTechnique | null;
  onClose: () => void;
}

export default function RescuePlayer({ technique, onClose }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [secs, setSecs] = useState(0);
  const [running, setRunning] = useState(true);
  const [fav, setFav] = useState(false);
  const startedAt = useRef(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!technique) return;
    setStepIdx(0);
    setSecs(0);
    setRunning(true);
    setFav(isFavorite(technique.id));
    startedAt.current = Date.now();
  }, [technique]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSecs(s => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  if (!technique) return null;

  const isLast = stepIdx >= technique.steps.length - 1;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const finish = (helpful?: boolean) => {
    logSOSEvent({
      toolId: technique.id,
      toolTitle: technique.title,
      category: technique.category,
      startedAt: startedAt.current,
      durationSec: Math.floor((Date.now() - startedAt.current) / 1000),
      helpful,
    });
    onClose();
  };

  const onFav = () => {
    const next = toggleFavorite(technique.id);
    setFav(next.includes(technique.id));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
      >
        <div className="w-full max-w-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{technique.emoji}</span>
              <div>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">{technique.title}</h2>
                <p className="text-xs font-body text-muted-foreground">{fmt(secs)} · {technique.duration}min technique</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onFav} className={`p-2.5 rounded-full border transition ${fav ? "bg-gold/15 border-gold/40 text-gold-dark" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}>
                <Star className={`w-4 h-4 ${fav ? "fill-current" : ""}`} />
              </button>
              <button onClick={onClose} className="p-2.5 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border p-8 md:p-10 shadow-soft min-h-[280px] flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-body font-bold uppercase tracking-widest">Step {stepIdx + 1} / {technique.steps.length}</span>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            <motion.p
              key={stepIdx}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="font-display text-xl md:text-2xl text-foreground leading-relaxed"
            >
              {technique.steps[stepIdx]}
            </motion.p>
          </div>

          <div className="flex items-center justify-between mt-6 gap-3">
            <button
              onClick={() => setRunning(r => !r)}
              className="w-14 h-14 rounded-full bg-card border border-border text-foreground hover:bg-secondary/30 flex items-center justify-center"
              aria-label={running ? "Pause" : "Play"}
            >
              {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button
              onClick={() => isLast ? null : setStepIdx(s => s + 1)}
              className={`flex-1 px-6 py-4 rounded-2xl font-body font-bold text-cream flex items-center justify-center gap-2 transition shadow-lg ${
                isLast ? "bg-muted text-muted-foreground cursor-default" : "bg-[hsl(var(--forest))] hover:bg-[hsl(var(--forest-deep))]"
              }`}
              disabled={isLast}
            >
              {isLast ? "How was it?" : "Next step"}
              {!isLast && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>

          {isLast && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-5 rounded-2xl bg-card border border-border">
              <p className="text-sm font-body text-foreground text-center mb-3">Did this help?</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => finish(true)} className="px-5 py-2.5 rounded-full bg-[hsl(var(--forest))] text-cream font-body font-bold text-sm hover:bg-[hsl(var(--forest-deep))] transition flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Yes, helped
                </button>
                <button onClick={() => finish(false)} className="px-5 py-2.5 rounded-full bg-card border border-border text-foreground font-body text-sm hover:bg-secondary/40 transition">
                  Not really
                </button>
                <button onClick={() => finish(undefined)} className="px-5 py-2.5 rounded-full bg-card border border-border text-muted-foreground font-body text-sm hover:bg-secondary/40 transition">
                  Skip
                </button>
              </div>
            </motion.div>
          )}

          {/* progress dots */}
          <div className="flex justify-center gap-2 mt-6">
            {technique.steps.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === stepIdx ? "w-8 bg-[hsl(var(--gold))]" : i < stepIdx ? "w-4 bg-[hsl(var(--forest))]/40" : "w-4 bg-border"}`} />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

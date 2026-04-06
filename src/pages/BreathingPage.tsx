import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { Wind, Play, Pause, RotateCcw } from "lucide-react";

interface BreathExercise {
  id: string;
  name: string;
  desc: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  icon: string;
  benefit: string;
  gradient: string;
}

const exercises: BreathExercise[] = [
  { id: "box", name: "Box Breathing", desc: "Military stress reduction technique", inhale: 4, hold1: 4, exhale: 4, hold2: 4, icon: "🔲", benefit: "Reduces anxiety, improves focus", gradient: "from-sky-500/12 via-blue-500/8 to-indigo-500/5" },
  { id: "478", name: "4-7-8 Breath", desc: "Dr. Weil's natural tranquilizer", inhale: 4, hold1: 7, exhale: 8, hold2: 0, icon: "🌙", benefit: "Instant calm, better sleep", gradient: "from-indigo-500/12 via-violet-500/8 to-purple-500/5" },
  { id: "coherent", name: "Coherent Breathing", desc: "Optimal heart rate variability", inhale: 5, hold1: 0, exhale: 5, hold2: 0, icon: "💓", benefit: "Balances nervous system", gradient: "from-rose-500/12 via-pink-500/8 to-red-500/5" },
  { id: "energizing", name: "Energizing Breath", desc: "Quick wake-up technique", inhale: 2, hold1: 0, exhale: 2, hold2: 0, icon: "⚡", benefit: "Increases alertness, boosts energy", gradient: "from-amber-500/12 via-yellow-500/8 to-orange-500/5" },
  { id: "extended", name: "Extended Exhale", desc: "Activate parasympathetic response", inhale: 4, hold1: 0, exhale: 8, hold2: 0, icon: "🌊", benefit: "Deep relaxation, slows heart rate", gradient: "from-cyan-500/12 via-teal-500/8 to-emerald-500/5" },
  { id: "counting", name: "Breath Counting", desc: "Focus training meditation", inhale: 4, hold1: 0, exhale: 4, hold2: 2, icon: "🔢", benefit: "Strengthens concentration", gradient: "from-emerald-500/12 via-green-500/8 to-lime-500/5" },
];

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2' | 'idle';
const phaseLabels: Record<Phase, string> = {
  inhale: "Breathe In",
  hold1: "Hold",
  exhale: "Breathe Out",
  hold2: "Hold",
  idle: "Ready",
};

export default function BreathingPage() {
  const [selected, setSelected] = useState<BreathExercise | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [counter, setCounter] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [running, setRunning] = useState(false);
  const [targetCycles, setTargetCycles] = useState(6);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getPhaseTime = (ex: BreathExercise, p: Phase): number => {
    switch (p) {
      case 'inhale': return ex.inhale;
      case 'hold1': return ex.hold1;
      case 'exhale': return ex.exhale;
      case 'hold2': return ex.hold2;
      default: return 0;
    }
  };

  const nextPhase = (current: Phase): Phase => {
    const order: Phase[] = ['inhale', 'hold1', 'exhale', 'hold2'];
    const idx = order.indexOf(current);
    if (!selected) return 'idle';
    for (let i = 1; i <= 4; i++) {
      const next = order[(idx + i) % 4];
      if (getPhaseTime(selected, next) > 0) {
        if (next === 'inhale' && current !== 'idle') setCycles(c => c + 1);
        return next;
      }
    }
    return 'inhale';
  };

  useEffect(() => {
    if (!running || !selected) return;
    intervalRef.current = setInterval(() => {
      setCounter(c => {
        const phaseTime = getPhaseTime(selected, phase);
        if (c >= phaseTime - 1) {
          setPhase(p => nextPhase(p));
          return 0;
        }
        return c + 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase, selected]);

  useEffect(() => {
    if (cycles >= targetCycles && running) {
      setRunning(false);
      setPhase('idle');
    }
  }, [cycles, targetCycles]);

  const start = (ex: BreathExercise) => {
    setSelected(ex);
    setPhase('inhale');
    setCounter(0);
    setCycles(0);
    setRunning(true);
  };

  const reset = () => {
    setRunning(false);
    setPhase('idle');
    setCounter(0);
    setCycles(0);
  };

  const getScale = (): number => {
    if (!selected || phase === 'idle') return 0.6;
    const phaseTime = getPhaseTime(selected, phase);
    const progress = counter / Math.max(phaseTime, 1);
    if (phase === 'inhale') return 0.6 + progress * 0.4;
    if (phase === 'exhale') return 1 - progress * 0.4;
    return phase === 'hold1' ? 1 : 0.6;
  };

  const phaseColor = phase === 'inhale' ? 'text-emerald-600' : phase === 'exhale' ? 'text-blue-500' : 'text-amber-500';

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500/20 to-cyan-500/15 flex items-center justify-center">
            <Wind className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Breathing Exercises</h1>
            <p className="text-sm font-body text-muted-foreground">Guided breathing techniques for any moment.</p>
          </div>
        </div>

        {selected && running && (
          <div className="bg-gradient-to-br from-primary/5 via-card to-sage/10 rounded-2xl border border-primary/15 p-8 shadow-elevated">
            <div className="text-center">
              <p className="text-sm font-body text-muted-foreground mb-2">{selected.name}</p>

              <div className="flex items-center justify-center my-8">
                <div className="relative w-52 h-52 flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/15 to-sage/20 border-2 border-primary/20 transition-transform duration-1000 ease-in-out"
                    style={{ transform: `scale(${getScale()})` }}
                  />
                  <div
                    className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/8 to-transparent transition-transform duration-1000 ease-in-out"
                    style={{ transform: `scale(${getScale() * 0.9})` }}
                  />
                  <div className="relative z-10 text-center">
                    <p className={`font-display text-2xl font-bold ${phaseColor}`}>{phaseLabels[phase]}</p>
                    <p className="font-display text-5xl font-bold text-primary mt-1">
                      {getPhaseTime(selected, phase) - counter}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm font-body text-muted-foreground">Cycle {Math.min(cycles + 1, targetCycles)} of {targetCycles}</p>

              <div className="flex items-center justify-center gap-3 mt-4">
                <button onClick={() => setRunning(!running)}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-soft hover:shadow-card transition-all">
                  {running ? <Pause className="w-5 h-5 text-primary-foreground" /> : <Play className="w-5 h-5 text-primary-foreground" />}
                </button>
                <button onClick={reset} className="w-14 h-14 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-all">
                  <RotateCcw className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>
          </div>
        )}

        {selected && !running && cycles >= targetCycles && (
          <div className="bg-gradient-to-br from-primary/10 via-sage/15 to-gold/10 rounded-2xl p-8 text-center border border-primary/15 shadow-soft">
            <p className="text-4xl mb-3">✨</p>
            <p className="font-display text-xl font-semibold text-foreground">Exercise Complete!</p>
            <p className="text-sm font-body text-muted-foreground mt-1">{targetCycles} cycles of {selected.name}</p>
            <button onClick={reset} className="mt-4 px-6 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl text-sm font-body font-semibold shadow-gold hover:shadow-lg transition-all">Try Another</button>
          </div>
        )}

        {(!selected || !running) && cycles < targetCycles && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exercises.map(ex => (
              <button key={ex.id} onClick={() => start(ex)}
                className={`text-left bg-gradient-to-br ${ex.gradient} rounded-2xl border border-border/50 p-5 hover:shadow-card hover:-translate-y-1 transition-all duration-300 group`}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">{ex.icon}</span>
                  <div>
                    <p className="font-display text-base font-semibold text-foreground">{ex.name}</p>
                    <p className="text-xs font-body text-muted-foreground">{ex.desc}</p>
                    <p className="text-xs font-body text-primary font-medium mt-1.5">{ex.benefit}</p>
                    <div className="flex gap-2 mt-2 text-[10px] font-body text-muted-foreground">
                      <span className="px-1.5 py-0.5 rounded-md bg-card/60">In: {ex.inhale}s</span>
                      {ex.hold1 > 0 && <span className="px-1.5 py-0.5 rounded-md bg-card/60">Hold: {ex.hold1}s</span>}
                      <span className="px-1.5 py-0.5 rounded-md bg-card/60">Out: {ex.exhale}s</span>
                      {ex.hold2 > 0 && <span className="px-1.5 py-0.5 rounded-md bg-card/60">Hold: {ex.hold2}s</span>}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

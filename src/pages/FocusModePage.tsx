import { useState, useEffect, useRef, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import { Brain, Play, Pause, RotateCcw, Clock, Target, Coffee, Zap, Check, Settings } from "lucide-react";
import focusmodeHero from "@/assets/focusmode-hero.jpg";

type Phase = "idle" | "focus" | "break" | "longBreak" | "done";

const PRESETS = [
  { id: "classic", name: "Classic Pomodoro", icon: "🍅", focusMin: 25, breakMin: 5, longBreakMin: 15, rounds: 4 },
  { id: "deep", name: "Deep Work", icon: "🧠", focusMin: 50, breakMin: 10, longBreakMin: 20, rounds: 3 },
  { id: "sprint", name: "Quick Sprint", icon: "⚡", focusMin: 15, breakMin: 3, longBreakMin: 10, rounds: 6 },
  { id: "flow", name: "Flow State", icon: "🌊", focusMin: 45, breakMin: 8, longBreakMin: 20, rounds: 3 },
  { id: "meditation", name: "Mindful Work", icon: "🧘", focusMin: 20, breakMin: 5, longBreakMin: 15, rounds: 4 },
];

const BREAK_ACTIVITIES = [
  { icon: "🧘", title: "Mini Meditation", desc: "Close your eyes. Follow 10 deep breaths. Let each exhale be longer than the inhale." },
  { icon: "🚶", title: "Mindful Walk", desc: "Take a short walk. Feel each step. Notice 3 things you can see, 2 you can hear, 1 you can touch." },
  { icon: "👁️", title: "Eye Rest", desc: "Look at something 20 feet away for 20 seconds. Blink slowly. Let your eyes soften." },
  { icon: "💧", title: "Hydrate & Stretch", desc: "Drink a glass of water. Stretch your neck, shoulders, and wrists. Roll your ankles." },
  { icon: "🌬️", title: "Box Breathing", desc: "Inhale 4 counts, hold 4, exhale 4, hold 4. Repeat until the break ends." },
  { icon: "🙏", title: "Gratitude Pause", desc: "Think of 3 things going well in your work today. Let the feeling of progress fill you." },
];

export default function FocusModePage() {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [breakActivity, setBreakActivity] = useState(BREAK_ACTIVITIES[0]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startFocusRound = useCallback(() => {
    setPhase("focus");
    setSecondsLeft(preset.focusMin * 60);
    setRunning(true);
  }, [preset]);

  const startBreak = useCallback((newCompletedRounds: number) => {
    const isLong = newCompletedRounds > 0 && newCompletedRounds % preset.rounds === 0;
    setPhase(isLong ? "longBreak" : "break");
    setSecondsLeft((isLong ? preset.longBreakMin : preset.breakMin) * 60);
    setBreakActivity(BREAK_ACTIVITIES[Math.floor(Math.random() * BREAK_ACTIVITIES.length)]);
    setRunning(true);
  }, [preset]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (phase === "focus") {
            setCompletedRounds(r => {
              const next = r + 1;
              startBreak(next);
              return next;
            });
            setTotalFocusSeconds(t => t + 1);
          } else {
            setCurrentRound(r => {
              const next = r + 1;
              if (next > preset.rounds) {
                setPhase("done");
                setRunning(false);
              } else {
                startFocusRound();
              }
              return next;
            });
          }
          return 0;
        }
        if (phase === "focus") setTotalFocusSeconds(t => t + 1);
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase, preset, startBreak, startFocusRound]);

  const togglePause = () => setRunning(!running);

  const reset = () => {
    setPhase("idle");
    setRunning(false);
    setSecondsLeft(0);
    setCurrentRound(1);
    setCompletedRounds(0);
    setTotalFocusSeconds(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const totalDuration = phase === "focus" ? preset.focusMin * 60
    : phase === "break" ? preset.breakMin * 60
    : phase === "longBreak" ? preset.longBreakMin * 60 : 1;
  const progress = ((totalDuration - secondsLeft) / totalDuration) * 100;

  const phaseColors = {
    idle: "text-muted-foreground",
    focus: "text-primary",
    break: "text-emerald-500",
    longBreak: "text-amber-500",
    done: "text-gold",
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden h-[200px]">
          <img src={focusmodeHero} alt="Deep focus workspace" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-white">Focus Mode</h1>
                <p className="text-sm text-white/80">Deep work sessions with mindful breaks</p>
              </div>
            </div>
          </div>
        </div>

        {phase === "idle" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p)}
                  className={`text-left p-4 rounded-2xl border transition-all ${
                    preset.id === p.id
                      ? "bg-primary/5 border-primary/30 shadow-soft"
                      : "bg-card border-border hover:bg-secondary/50"
                  }`}
                >
                  <span className="text-2xl">{p.icon}</span>
                  <p className="font-display text-sm font-semibold text-foreground mt-2">{p.name}</p>
                  <p className="text-[10px] font-body text-muted-foreground mt-0.5">
                    {p.focusMin}m focus · {p.breakMin}m break · {p.rounds} rounds
                  </p>
                </button>
              ))}
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border text-center shadow-soft">
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{preset.name}</h3>
              <div className="flex items-center justify-center gap-6 mb-6">
                <div>
                  <p className="font-display text-3xl font-bold text-primary">{preset.focusMin}</p>
                  <p className="text-xs font-body text-muted-foreground">min focus</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="font-display text-3xl font-bold text-emerald-500">{preset.breakMin}</p>
                  <p className="text-xs font-body text-muted-foreground">min break</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="font-display text-3xl font-bold text-foreground">{preset.rounds}</p>
                  <p className="text-xs font-body text-muted-foreground">rounds</p>
                </div>
              </div>
              <button
                onClick={startFocusRound}
                className="inline-flex items-center gap-2 px-8 py-3.5 btn-gold rounded-xl text-sm font-body font-semibold shadow-gold"
              >
                <Play className="w-5 h-5" /> Start Focus Session
              </button>
            </div>
          </>
        )}

        {(phase === "focus" || phase === "break" || phase === "longBreak") && (
          <div className="bg-card rounded-2xl p-6 sm:p-10 border border-border shadow-soft text-center">
            <span className={`text-xs font-body font-bold uppercase tracking-widest ${phaseColors[phase]}`}>
              {phase === "focus" ? "Focus Time" : phase === "longBreak" ? "Long Break" : "Short Break"}
            </span>
            <p className="text-xs font-body text-muted-foreground mt-1">
              Round {currentRound} of {preset.rounds}
            </p>

            <div className="relative w-48 h-48 mx-auto my-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke={phase === "focus" ? "hsl(var(--primary))" : phase === "longBreak" ? "#f59e0b" : "#10b981"}
                  strokeWidth="6" strokeDasharray={`${progress * 3.14} 314`} strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-display text-4xl font-bold ${phaseColors[phase]}`}>
                  {formatTime(secondsLeft)}
                </span>
              </div>
            </div>

            {(phase === "break" || phase === "longBreak") && (
              <div className="bg-secondary/30 rounded-xl p-4 mb-6 max-w-md mx-auto">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <span className="text-xl">{breakActivity.icon}</span>
                  <span className="font-display text-sm font-semibold text-foreground">{breakActivity.title}</span>
                </div>
                <p className="text-sm font-body text-muted-foreground">{breakActivity.desc}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button onClick={togglePause}
                className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-xl text-sm font-body font-medium hover:bg-primary/20"
              >
                {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {running ? "Pause" : "Resume"}
              </button>
              <button onClick={reset}
                className="flex items-center gap-2 px-4 py-3 bg-secondary rounded-xl text-sm font-body text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 mt-4">
              {Array.from({ length: preset.rounds }).map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i < completedRounds ? "bg-primary" : "bg-secondary"}`} />
              ))}
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="bg-card rounded-2xl p-8 border border-border shadow-soft text-center">
            <span className="text-5xl">🎉</span>
            <h2 className="font-display text-2xl font-bold text-foreground mt-4">Session Complete!</h2>
            <p className="text-sm font-body text-muted-foreground mt-2">Excellent focus work. Your mind thanks you.</p>

            <div className="grid grid-cols-3 gap-4 mt-6 max-w-sm mx-auto">
              <div>
                <p className="font-display text-2xl font-bold text-primary">{completedRounds}</p>
                <p className="text-xs font-body text-muted-foreground">Rounds</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">{Math.round(totalFocusSeconds / 60)}</p>
                <p className="text-xs font-body text-muted-foreground">Focus Min</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-gold">100%</p>
                <p className="text-xs font-body text-muted-foreground">Completed</p>
              </div>
            </div>

            <button onClick={reset}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 btn-gold rounded-xl text-sm font-body font-semibold"
            >
              <RotateCcw className="w-4 h-4" /> New Session
            </button>
          </div>
        )}

        {phase === "idle" && (
          <div className="bg-secondary/30 rounded-2xl p-6 border border-border">
            <h3 className="font-display text-base font-semibold text-foreground mb-3">Why Focus Mode Works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Target, title: "Single-tasking", desc: "Focus on one task at a time. Multitasking reduces productivity by up to 40%." },
                { icon: Coffee, title: "Strategic breaks", desc: "Regular breaks prevent burnout and maintain cognitive performance throughout the day." },
                { icon: Brain, title: "Mindful transitions", desc: "Use break activities to reset your mind, not scroll social media." },
                { icon: Zap, title: "Flow state", desc: "Extended focus periods help you enter flow — the state of effortless high performance." },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3 p-3">
                  <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-body font-medium text-foreground">{item.title}</p>
                    <p className="text-xs font-body text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

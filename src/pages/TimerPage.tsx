import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { Timer, Play, Pause, RotateCcw, Plus, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { saveTimerSession } from "@/lib/userStore";

const presets = [
  { label: "5 min", minutes: 5 },
  { label: "10 min", minutes: 10 },
  { label: "15 min", minutes: 15 },
  { label: "20 min", minutes: 20 },
  { label: "25 min", minutes: 25 },
  { label: "30 min", minutes: 30 },
];

const backgrounds = [
  { label: "Silence", id: "silence", icon: "🔇" },
  { label: "Rain", id: "rain", icon: "🌧️" },
  { label: "Ocean", id: "ocean", icon: "🌊" },
  { label: "Forest", id: "forest", icon: "🌲" },
  { label: "Fire", id: "fire", icon: "🔥" },
  { label: "White Noise", id: "white-noise", icon: "📻" },
];

export default function TimerPage() {
  const [minutes, setMinutes] = useState(15);
  const [seconds, setSeconds] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [bg, setBg] = useState("silence");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds(s => s - 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (running && seconds <= 0) {
        setRunning(false);
        setCompleted(true);
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 60000);
        saveTimerSession({ date: new Date().toISOString(), duration: elapsed, type: 'custom' });
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, seconds]);

  const start = () => {
    setSeconds(minutes * 60);
    setRunning(true);
    setCompleted(false);
    startTimeRef.current = Date.now();
  };

  const toggle = () => setRunning(r => !r);
  const reset = () => { setRunning(false); setSeconds(minutes * 60); setCompleted(false); };
  const extend = () => setSeconds(s => s + 5 * 60);

  const fmt = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  const progress = 1 - seconds / (minutes * 60);

  return (
    <AppLayout>
      <div className="space-y-8 max-w-xl mx-auto animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold/25 to-amber-500/15 flex items-center justify-center">
            <Timer className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Meditation Timer</h1>
            <p className="text-sm font-body text-muted-foreground">Build your own practice session.</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/5 via-card to-gold/5 rounded-2xl border border-border/50 p-8 shadow-soft text-center">
          <div className="relative w-56 h-56 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="url(#timerGradient)" strokeWidth="6"
                strokeDasharray={`${progress * 327} 327`} strokeLinecap="round" className="transition-all duration-1000 drop-shadow-[0_0_8px_hsl(var(--gold)/0.3)]" />
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--gold))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-5xl font-bold text-foreground">{fmt}</span>
              <span className={`text-xs font-body mt-1 px-2 py-0.5 rounded-full ${
                running ? "bg-primary/10 text-primary" : completed ? "bg-gold/15 text-gold" : "text-muted-foreground"
              }`}>
                {running ? "In Progress" : completed ? "Complete!" : "Ready"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            {!running && !completed && (
              <button onClick={start} className="px-8 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl text-base font-body font-semibold flex items-center gap-2 shadow-gold hover:shadow-lg transition-all">
                <Play className="w-5 h-5" /> Start
              </button>
            )}
            {running && (
              <>
                <button onClick={toggle} className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-soft">
                  <Pause className="w-6 h-6 text-primary-foreground" />
                </button>
                <button onClick={extend} className="px-4 py-3 bg-secondary/80 rounded-xl text-sm font-body flex items-center gap-1.5 hover:bg-secondary transition-all">
                  <Plus className="w-4 h-4" /> 5 min
                </button>
                <button onClick={reset} className="w-14 h-14 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-all">
                  <RotateCcw className="w-5 h-5 text-foreground" />
                </button>
              </>
            )}
            {!running && !completed && seconds !== minutes * 60 && (
              <button onClick={toggle} className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl text-sm font-body text-primary-foreground flex items-center gap-2 shadow-soft">
                <Play className="w-4 h-4" /> Resume
              </button>
            )}
            {completed && (
              <button onClick={reset} className="px-8 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl text-base font-body font-semibold shadow-gold hover:shadow-lg transition-all">
                New Session
              </button>
            )}
          </div>
        </div>

        {!running && (
          <div className="bg-gradient-to-br from-[hsl(var(--forest))]/5 to-[hsl(var(--sage))]/5 rounded-2xl border border-border/50 p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Duration</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {presets.map(p => (
                <button key={p.minutes} onClick={() => { setMinutes(p.minutes); setSeconds(p.minutes * 60); }}
                  className={`px-4 py-2 rounded-xl text-sm font-body font-medium transition-all ${
                    minutes === p.minutes ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm" : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                  }`}>{p.label}</button>
              ))}
            </div>
            <div>
              <label className="text-xs font-body text-muted-foreground">Custom: {minutes} minutes</label>
              <Slider value={[minutes]} onValueChange={v => { setMinutes(v[0]); setSeconds(v[0] * 60); }} min={1} max={60} step={1} className="mt-2" />
            </div>
          </div>
        )}

        {!running && (
          <div className="bg-gradient-to-br from-[hsl(var(--forest-deep))]/5 to-[hsl(var(--forest))]/5 rounded-2xl border border-border/50 p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" /> Background Sound
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {backgrounds.map(b => (
                <button key={b.id} onClick={() => setBg(b.id)}
                  className={`py-2.5 rounded-xl text-sm font-body font-medium transition-all flex items-center justify-center gap-1.5 ${
                    bg === b.id ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm" : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                  }`}>
                  <span className="text-sm">{b.icon}</span> {b.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

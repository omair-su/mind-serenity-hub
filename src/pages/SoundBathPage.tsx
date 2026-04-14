import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { FREQUENCY_PRESETS, startBinaural, stopBinaural, setBinauralVolume, isBinauralPlaying } from "@/lib/binauralBeats";
import { Headphones, Play, Square, Clock, Volume2, VolumeX, Info } from "lucide-react";
import soundbathHero from "@/assets/soundbath-hero.jpg";
export default function SoundBathPage() {
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.3);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerDuration, setTimerDuration] = useState(15);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    return () => {
      stopBinaural();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const preset = FREQUENCY_PRESETS.find(p => p.id === activePreset);

  const startSession = (presetId: string) => {
    const p = FREQUENCY_PRESETS.find(f => f.id === presetId);
    if (!p) return;
    stopBinaural();
    if (intervalRef.current) clearInterval(intervalRef.current);

    setActivePreset(presetId);
    startBinaural(p, volume);
    setPlaying(true);
    setElapsed(0);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsed(secs);
      if (secs >= timerDuration * 60) {
        stopSession();
      }
    }, 1000);
  };

  const stopSession = () => {
    stopBinaural();
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    if (playing) setBinauralVolume(val);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = timerDuration > 0 ? (elapsed / (timerDuration * 60)) * 100 : 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden h-[200px]">
          <img src={soundbathHero} alt="Sound bath healing" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-violet-950/90 via-violet-950/50 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-white">Sound Bath & Healing Frequencies</h1>
                <p className="text-sm text-white/80">Binaural beats & frequency therapy for deep healing</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-r from-violet-100/50 via-purple-50/30 to-indigo-50/20 dark:from-violet-900/20 dark:via-purple-900/10 dark:to-indigo-900/5 rounded-2xl p-4 border border-violet-500/15 shadow-soft">
          <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-bl from-violet-200/30 to-transparent" />
          <div className="flex items-start gap-3 relative z-10">
            <Info className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-body text-muted-foreground">
              <span className="font-semibold text-foreground">Use headphones for best results.</span> Binaural beats require stereo separation — each ear receives a slightly different frequency, and your brain processes the difference as a rhythmic beat that entrains your brainwaves.
            </p>
          </div>
        </div>

        {playing && preset && (
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-100/60 via-purple-50/40 to-indigo-50/30 dark:from-violet-900/30 dark:via-purple-900/20 dark:to-indigo-900/10 rounded-2xl border border-violet-500/15 p-6 shadow-elevated">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-bl from-violet-200/30 to-transparent" />
            <div className="absolute bottom-0 left-0 w-40 h-20 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-tr-full" />
            <div className="relative z-10">
              <div className="text-center mb-6">
                <span className="text-5xl">{preset.icon}</span>
                <h2 className="font-display text-xl font-bold text-foreground mt-2">{preset.name}</h2>
                <p className="text-sm font-body text-muted-foreground">{preset.description}</p>
              </div>

              <div className="relative w-40 h-40 mx-auto mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                    strokeDasharray={`${progress * 3.14} 314`} strokeLinecap="round"
                    className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-2xl font-bold text-foreground">{formatTime(elapsed)}</span>
                  <span className="text-[10px] font-body text-muted-foreground">of {timerDuration} min</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4 max-w-xs mx-auto">
                <VolumeX className="w-4 h-4 text-muted-foreground" />
                <input
                  type="range" min="0" max="0.8" step="0.01" value={volume}
                  onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                  className="flex-1 accent-primary h-1.5"
                />
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              </div>

              <div className="flex justify-center gap-3">
                <button onClick={stopSession} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-destructive/15 to-rose-500/10 text-destructive rounded-xl text-sm font-body font-medium hover:from-destructive/25 hover:to-rose-500/20 transition-all">
                  <Square className="w-4 h-4" /> Stop Session
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                {preset.benefits.map(b => (
                  <div key={b} className="flex items-center gap-2 text-xs font-body text-muted-foreground bg-card/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!playing && (
          <>
            <div className="flex items-center gap-3 bg-gradient-to-r from-violet-100/30 via-purple-50/20 to-indigo-50/10 dark:from-violet-900/15 dark:via-purple-900/10 dark:to-indigo-900/5 rounded-xl p-3 border border-violet-500/10">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-body text-foreground">Session duration:</span>
              <div className="flex gap-1.5">
                {[5, 10, 15, 20, 30, 45, 60].map(d => (
                  <button
                    key={d}
                    onClick={() => setTimerDuration(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-body transition-all ${
                      timerDuration === d ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-soft" : "bg-card/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d}m
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FREQUENCY_PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => startSession(p.id)}
                  className={`group text-left rounded-2xl border border-border/50 p-5 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-br ${p.color} relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-card/20 to-transparent rounded-bl-full" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <span className="text-3xl group-hover:scale-110 transition-transform">{p.icon}</span>
                      <span className="text-[10px] font-body text-muted-foreground bg-card/60 backdrop-blur-sm px-2 py-1 rounded-full">{p.category}</span>
                    </div>
                    <h3 className="font-display text-base font-semibold text-foreground mt-3">{p.name}</h3>
                    <p className="text-xs font-body text-muted-foreground mt-1">{p.description}</p>
                    <p className="text-[10px] font-body text-muted-foreground mt-1">
                      {p.baseFreq} Hz base · {p.beatFreq} Hz beat
                    </p>
                    <div className="flex items-center gap-1.5 mt-3 text-primary text-xs font-body font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-3 h-3" /> Start Session
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-violet-100/40 via-purple-50/20 to-indigo-50/15 dark:from-violet-900/15 dark:via-purple-900/10 dark:to-indigo-900/5 rounded-2xl p-6 border border-violet-500/10 shadow-soft">
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-tl from-purple-200/20 to-transparent" />
              <h3 className="font-display text-base font-semibold text-foreground mb-3">Understanding Brainwave Frequencies</h3>
              <div className="space-y-3">
                {[
                  { range: "Delta (0.5-4 Hz)", desc: "Deep sleep, healing, regeneration", color: "bg-indigo-500" },
                  { range: "Theta (4-8 Hz)", desc: "Deep meditation, creativity, REM sleep", color: "bg-violet-500" },
                  { range: "Alpha (8-13 Hz)", desc: "Relaxed focus, calm alertness, flow", color: "bg-emerald-500" },
                  { range: "Beta (13-30 Hz)", desc: "Active thinking, concentration, problem-solving", color: "bg-amber-500" },
                  { range: "Gamma (30-100 Hz)", desc: "Peak performance, insight, higher consciousness", color: "bg-rose-500" },
                ].map(freq => (
                  <div key={freq.range} className="flex items-center gap-3 p-2 rounded-lg hover:bg-card/40 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${freq.color} flex-shrink-0 shadow-sm`} />
                    <div>
                      <span className="text-sm font-body font-medium text-foreground">{freq.range}</span>
                      <span className="text-xs font-body text-muted-foreground ml-2">{freq.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}

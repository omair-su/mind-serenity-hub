import { useState, useEffect, useRef, useCallback } from "react";
import AppLayout from "@/components/AppLayout";
import { Brain, Play, Pause, RotateCcw, Clock, Target, Coffee, Zap, Check, Settings, Sparkles, Volume2, Music, TrendingUp, Award, BookOpen, Heart, AlertCircle, ChevronRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import focusmodeHero from "@/assets/focusmode-hero.jpg";
import { startBinaural, stopBinaural, FREQUENCY_PRESETS, FrequencyPreset } from "@/lib/binauralBeats";

type Phase = "idle" | "focus" | "break" | "longBreak" | "done";

// Premium Focus Profiles with science-backed parameters
const PREMIUM_PROFILES = [
  { 
    id: "classic", 
    name: "Classic Pomodoro", 
    icon: "🍅", 
    focusMin: 25, 
    breakMin: 5, 
    longBreakMin: 15, 
    rounds: 4,
    description: "The proven 25-minute focus technique",
    science: "Balances deep work with cognitive recovery",
    bestFor: "General productivity, learning new skills"
  },
  { 
    id: "deep", 
    name: "Deep Work", 
    icon: "🧠", 
    focusMin: 50, 
    breakMin: 10, 
    longBreakMin: 20, 
    rounds: 3,
    description: "Extended focus for complex tasks",
    science: "Allows full immersion in flow state",
    bestFor: "Programming, writing, creative projects"
  },
  { 
    id: "sprint", 
    name: "Quick Sprint", 
    icon: "⚡", 
    focusMin: 15, 
    breakMin: 3, 
    longBreakMin: 10, 
    rounds: 6,
    description: "High-intensity short bursts",
    science: "Maximizes attention for quick wins",
    bestFor: "Emails, meetings, administrative tasks"
  },
  { 
    id: "flow", 
    name: "Flow State", 
    icon: "🌊", 
    focusMin: 45, 
    breakMin: 8, 
    longBreakMin: 20, 
    rounds: 3,
    description: "Optimal for entering deep flow",
    science: "Neurologically timed for peak performance",
    bestFor: "Artistic work, complex problem-solving"
  },
  { 
    id: "meditation", 
    name: "Mindful Work", 
    icon: "🧘", 
    focusMin: 20, 
    breakMin: 5, 
    longBreakMin: 15, 
    rounds: 4,
    description: "Meditation-integrated focus sessions",
    science: "Combines mindfulness with productivity",
    bestFor: "Stress reduction, sustainable productivity"
  },
];

const BREAK_ACTIVITIES = [
  { icon: "🧘", title: "Mini Meditation", desc: "Close your eyes. Follow 10 deep breaths. Let each exhale be longer than the inhale." },
  { icon: "🚶", title: "Mindful Walk", desc: "Take a short walk. Feel each step. Notice 3 things you can see, 2 you can hear, 1 you can touch." },
  { icon: "👁️", title: "Eye Rest", desc: "Look at something 20 feet away for 20 seconds. Blink slowly. Let your eyes soften." },
  { icon: "💧", title: "Hydrate & Stretch", desc: "Drink a glass of water. Stretch your neck, shoulders, and wrists. Roll your ankles." },
  { icon: "🌬️", title: "Box Breathing", desc: "Inhale 4 counts, hold 4, exhale 4, hold 4. Repeat until the break ends." },
  { icon: "🙏", title: "Gratitude Pause", desc: "Think of 3 things going well in your work today. Let the feeling of progress fill you." },
];

// Premium Science-Backed Content
const FOCUS_SCIENCE = [
  {
    title: "Single-Tasking Advantage",
    icon: Target,
    stat: "40%",
    description: "Multitasking reduces productivity by up to 40% and increases error rates significantly.",
    detail: "Your brain cannot truly multitask. When you switch tasks, your prefrontal cortex needs 15-25 minutes to refocus fully."
  },
  {
    title: "Strategic Break Recovery",
    icon: Coffee,
    stat: "23%",
    description: "Regular breaks improve cognitive performance and prevent decision fatigue throughout the day.",
    detail: "The Pomodoro Technique leverages the brain's natural ultradian rhythms (90-120 minute cycles) for optimal recovery."
  },
  {
    title: "Flow State Neuroscience",
    icon: Zap,
    stat: "5x",
    description: "Flow state increases productivity by up to 5x and enhances creative problem-solving.",
    detail: "During flow, your brain enters a state of optimal challenge where default-mode network activity decreases."
  },
  {
    title: "Attention Restoration",
    icon: Brain,
    stat: "15min",
    description: "Just 15 minutes of mindful break activity restores attention capacity for the next focus session.",
    detail: "Attention Restoration Theory (ART) shows that natural environments and mindful activities reset mental fatigue."
  },
];

const PREMIUM_FEATURES = [
  {
    icon: Music,
    title: "Binaural Beats",
    description: "Scientifically-tuned audio frequencies to enhance focus and reduce anxiety during work sessions."
  },
  {
    icon: TrendingUp,
    title: "Focus Analytics",
    description: "Track your focus patterns, identify peak productivity hours, and optimize your schedule."
  },
  {
    icon: Award,
    title: "Achievement Tracking",
    description: "Earn badges, maintain streaks, and celebrate milestones in your focus journey."
  },
  {
    icon: BookOpen,
    title: "Expert Guidance",
    description: "Learn from neuroscience research and productivity experts on maximizing your focus potential."
  },
];

export default function FocusModePage() {
  const [preset, setPreset] = useState(PREMIUM_PROFILES[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);
  const [breakActivity, setBreakActivity] = useState(BREAK_ACTIVITIES[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyPreset | null>(FREQUENCY_PRESETS[3]); // Beta waves for focus
  const [binauralVolume, setBinauralVolume] = useState(0.3);
  const [useBinaural, setUseBinaural] = useState(false);
  const [focusIntensity, setFocusIntensity] = useState(50);
  const [activeTab, setActiveTab] = useState<"timer" | "science" | "features">("timer");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startFocusRound = useCallback(() => {
    setPhase("focus");
    setSecondsLeft(preset.focusMin * 60);
    setRunning(true);
    if (useBinaural && selectedFrequency) {
      startBinaural(selectedFrequency, binauralVolume);
    }
  }, [preset, useBinaural, selectedFrequency, binauralVolume]);

  const startBreak = useCallback((newCompletedRounds: number) => {
    const isLong = newCompletedRounds > 0 && newCompletedRounds % preset.rounds === 0;
    setPhase(isLong ? "longBreak" : "break");
    setSecondsLeft((isLong ? preset.longBreakMin : preset.breakMin) * 60);
    setBreakActivity(BREAK_ACTIVITIES[Math.floor(Math.random() * BREAK_ACTIVITIES.length)]);
    setRunning(true);
    stopBinaural();
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
                stopBinaural();
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
    stopBinaural();
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
      <div className="space-y-8 animate-fade-in">
        {/* ── Premium Hero Banner ── */}
        <div className="relative rounded-2xl overflow-hidden h-[240px]">
          <img src={focusmodeHero} alt="Deep focus workspace" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/40 to-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30">
                  <Brain className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-white">Focus Mode</h1>
                  <p className="text-sm text-white/80 mt-1">Science-backed deep work sessions with mindful recovery</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-body text-white/60">Premium Feature</p>
                <p className="text-lg font-display font-bold text-gold">$97/year</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs Navigation ── */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50 border border-border/50 rounded-xl p-1">
            <TabsTrigger value="timer" className="font-body font-medium">Timer</TabsTrigger>
            <TabsTrigger value="science" className="font-body font-medium">Science</TabsTrigger>
            <TabsTrigger value="features" className="font-body font-medium">Features</TabsTrigger>
          </TabsList>

          {/* ── Timer Tab ── */}
          <TabsContent value="timer" className="space-y-6">
            {phase === "idle" && (
              <>
                {/* Premium Profile Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {PREMIUM_PROFILES.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setPreset(p)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 ${
                        preset.id === p.id
                          ? "bg-gradient-to-br from-primary/15 to-primary/5 border-primary/40 shadow-lg ring-2 ring-primary/20"
                          : "bg-card border-border hover:bg-secondary/50 hover:border-primary/30"
                      }`}
                    >
                      <span className="text-2xl block mb-2">{p.icon}</span>
                      <p className="font-display text-sm font-semibold text-foreground">{p.name}</p>
                      <p className="text-[10px] font-body text-muted-foreground mt-1">{p.description}</p>
                      <p className="text-[9px] text-primary/70 mt-2 italic">{p.science}</p>
                    </button>
                  ))}
                </div>

                {/* Session Configuration Card */}
                <div className="bg-gradient-to-br from-primary/5 via-card to-sage/5 rounded-2xl p-6 border border-border/50 shadow-soft">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground">{preset.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{preset.bestFor}</p>
                    </div>
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Settings className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-secondary/50 rounded-xl p-3 text-center">
                      <p className="font-display text-2xl font-bold text-primary">{preset.focusMin}</p>
                      <p className="text-xs font-body text-muted-foreground mt-1">Focus</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-3 text-center">
                      <p className="font-display text-2xl font-bold text-emerald-500">{preset.breakMin}</p>
                      <p className="text-xs font-body text-muted-foreground mt-1">Break</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-3 text-center">
                      <p className="font-display text-2xl font-bold text-amber-500">{preset.longBreakMin}</p>
                      <p className="text-xs font-body text-muted-foreground mt-1">Long</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-3 text-center">
                      <p className="font-display text-2xl font-bold text-foreground">{preset.rounds}</p>
                      <p className="text-xs font-body text-muted-foreground mt-1">Rounds</p>
                    </div>
                  </div>

                  {/* Advanced Settings */}
                  {showSettings && (
                    <div className="bg-secondary/30 rounded-xl p-4 mb-6 space-y-4 border border-border/50">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-body font-medium text-foreground flex items-center gap-2">
                            <Music className="w-4 h-4 text-primary" />
                            Binaural Beats
                          </label>
                          <input
                            type="checkbox"
                            checked={useBinaural}
                            onChange={(e) => setUseBinaural(e.target.checked)}
                            className="w-4 h-4 rounded"
                          />
                        </div>
                        {useBinaural && selectedFrequency && (
                          <div className="space-y-3 mt-3 p-3 bg-card rounded-lg border border-border/50">
                            <p className="text-xs text-muted-foreground">Selected: <span className="text-primary font-semibold">{selectedFrequency.name}</span></p>
                            <div className="flex items-center gap-2">
                              <Volume2 className="w-4 h-4 text-muted-foreground" />
                              <Slider
                                value={[binauralVolume]}
                                onValueChange={([v]) => setBinauralVolume(v)}
                                min={0}
                                max={1}
                                step={0.1}
                                className="flex-1"
                              />
                              <span className="text-xs text-muted-foreground w-8">{Math.round(binauralVolume * 100)}%</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-body font-medium text-foreground block mb-2">Focus Intensity</label>
                        <Slider
                          value={[focusIntensity]}
                          onValueChange={([v]) => setFocusIntensity(v)}
                          min={0}
                          max={100}
                          step={10}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          {focusIntensity < 33 ? "Light" : focusIntensity < 66 ? "Moderate" : "Intense"} focus level
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={startFocusRound}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 btn-gold rounded-xl text-sm font-body font-semibold shadow-gold hover:shadow-lg transition-all"
                  >
                    <Play className="w-5 h-5" /> Start Focus Session
                  </button>
                </div>
              </>
            )}

            {/* Active Session Display */}
            {(phase === "focus" || phase === "break" || phase === "longBreak") && (
              <div className="bg-gradient-to-br from-card via-secondary/20 to-card rounded-2xl p-8 sm:p-12 border border-border/50 shadow-elevated text-center">
                <span className={`text-xs font-body font-bold uppercase tracking-widest ${phaseColors[phase]}`}>
                  {phase === "focus" ? "🎯 Focus Time" : phase === "longBreak" ? "🌟 Long Break" : "☕ Short Break"}
                </span>
                <p className="text-xs font-body text-muted-foreground mt-2">
                  Round {currentRound} of {preset.rounds}
                </p>

                <div className="relative w-56 h-56 mx-auto my-10">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
                    <circle cx="60" cy="60" r="50" fill="none"
                      stroke={phase === "focus" ? "hsl(var(--primary))" : phase === "longBreak" ? "#f59e0b" : "#10b981"}
                      strokeWidth="6" strokeDasharray={`${progress * 3.14} 314`} strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`font-display text-5xl font-bold ${phaseColors[phase]}`}>
                      {formatTime(secondsLeft)}
                    </span>
                    <span className="text-xs text-muted-foreground mt-2">remaining</span>
                  </div>
                </div>

                {/* Break Activity Suggestion */}
                {(phase === "break" || phase === "longBreak") && (
                  <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-xl p-5 mb-8 max-w-md mx-auto border border-emerald-500/20">
                    <div className="flex items-center gap-3 justify-center mb-3">
                      <span className="text-2xl">{breakActivity.icon}</span>
                      <span className="font-display text-base font-semibold text-foreground">{breakActivity.title}</span>
                    </div>
                    <p className="text-sm font-body text-muted-foreground">{breakActivity.desc}</p>
                  </div>
                )}

                <div className="flex items-center justify-center gap-3 mb-6">
                  <button onClick={togglePause}
                    className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-xl text-sm font-body font-medium hover:bg-primary/20 transition-colors"
                  >
                    {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {running ? "Pause" : "Resume"}
                  </button>
                  <button onClick={reset}
                    className="flex items-center gap-2 px-4 py-3 bg-secondary rounded-xl text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2">
                  {Array.from({ length: preset.rounds }).map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i < completedRounds ? "bg-primary scale-125" : "bg-secondary"}`} />
                  ))}
                </div>
              </div>
            )}

            {/* Completion Screen */}
            {phase === "done" && (
              <div className="bg-gradient-to-br from-gold/10 via-card to-amber-500/5 rounded-2xl p-8 border border-gold/20 shadow-elevated text-center">
                <span className="text-6xl block mb-4">🎉</span>
                <h2 className="font-display text-3xl font-bold text-foreground mb-2">Session Complete!</h2>
                <p className="text-sm font-body text-muted-foreground mb-8">Excellent focus work. Your mind thanks you.</p>

                <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-8">
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <p className="font-display text-2xl font-bold text-primary">{completedRounds}</p>
                    <p className="text-xs font-body text-muted-foreground mt-1">Rounds</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <p className="font-display text-2xl font-bold text-foreground">{Math.round(totalFocusSeconds / 60)}</p>
                    <p className="text-xs font-body text-muted-foreground mt-1">Minutes</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <p className="font-display text-2xl font-bold text-gold">100%</p>
                    <p className="text-xs font-body text-muted-foreground mt-1">Completed</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <p className="font-display text-2xl font-bold text-emerald-500">+25</p>
                    <p className="text-xs font-body text-muted-foreground mt-1">XP</p>
                  </div>
                </div>

                <button onClick={reset}
                  className="inline-flex items-center gap-2 px-8 py-3 btn-gold rounded-xl text-sm font-body font-semibold shadow-gold hover:shadow-lg transition-all"
                >
                  <RotateCcw className="w-4 h-4" /> New Session
                </button>
              </div>
            )}
          </TabsContent>

          {/* ── Science Tab ── */}
          <TabsContent value="science" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FOCUS_SCIENCE.map((item, idx) => (
                <Card key={idx} className="bg-gradient-to-br from-primary/5 via-card to-sage/5 border-border/50 p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-3xl font-display font-bold text-primary">{item.stat}</p>
                      <p className="text-xs text-muted-foreground mt-1">Improvement</p>
                    </div>
                  </div>
                  <h4 className="font-display font-semibold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <p className="text-xs text-primary/80 italic border-l-2 border-primary/30 pl-3">{item.detail}</p>
                </Card>
              ))}
            </div>

            {/* Educational Content */}
            <Card className="bg-secondary/30 border-border/50 p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                The Neuroscience of Focus
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Prefrontal Cortex Activation:</span> Deep focus activates your prefrontal cortex, the brain region responsible for executive function, decision-making, and sustained attention. This region requires approximately 15-25 minutes to fully engage after task-switching.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Default Mode Network:</span> During focused work, your brain's default mode network (responsible for mind-wandering) decreases activity. This is why focused sessions feel "effortless" once you enter flow state.
                </p>
                <p>
                  <span className="font-semibold text-foreground">Dopamine & Motivation:</span> Completing focus rounds triggers dopamine release, reinforcing the behavior and making future sessions easier to start. This is why celebrating small wins matters.
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* ── Features Tab ── */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PREMIUM_FEATURES.map((feature, idx) => (
                <Card key={idx} className="bg-gradient-to-br from-secondary/30 via-card to-secondary/10 border-border/50 p-6 hover:shadow-lg transition-all group cursor-pointer">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors ml-auto" />
                  </div>
                  <h4 className="font-display font-semibold text-foreground mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>

            {/* Premium Soundscape Integration */}
            <Card className="bg-gradient-to-br from-violet-500/10 via-card to-purple-500/5 border-border/50 p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Music className="w-5 h-5 text-violet-500" />
                Binaural Beats & Frequencies
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FREQUENCY_PRESETS.slice(0, 6).map((freq) => (
                  <button
                    key={freq.id}
                    onClick={() => setSelectedFrequency(freq)}
                    className={`p-3 rounded-lg text-center transition-all text-xs font-body ${
                      selectedFrequency?.id === freq.id
                        ? "bg-primary/20 border border-primary/50 text-foreground"
                        : "bg-secondary/50 border border-border/50 text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <div className="text-lg mb-1">{freq.icon}</div>
                    <div className="font-medium">{freq.name.split(" ")[0]}</div>
                    <div className="text-[10px] opacity-70">{freq.beatFreq}Hz</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Select a frequency to enhance your focus. Binaural beats are scientifically-tuned audio frequencies that may help synchronize brain waves with your desired mental state.
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ── Premium Tips Section ── */}
        {phase === "idle" && (
          <div className="bg-gradient-to-br from-emerald-500/5 via-card to-teal-500/5 rounded-2xl p-6 border border-border/50">
            <h3 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Pro Tips for Maximum Focus
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: "🌍", title: "Eliminate Distractions", desc: "Put your phone in another room. Close unnecessary browser tabs. Notify people you're in deep work mode." },
                { icon: "💧", title: "Hydration Matters", desc: "Dehydration reduces cognitive performance. Keep water nearby and take sips during breaks." },
                { icon: "🌞", title: "Natural Light", desc: "Position yourself near natural light. It boosts alertness and regulates circadian rhythms." },
                { icon: "🎵", title: "Consistent Environment", desc: "Use the same location for focus sessions. Your brain learns to enter focus mode in familiar spaces." },
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border/50">
                  <span className="text-xl flex-shrink-0">{tip.icon}</span>
                  <div>
                    <p className="text-sm font-body font-medium text-foreground">{tip.title}</p>
                    <p className="text-xs font-body text-muted-foreground mt-0.5">{tip.desc}</p>
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

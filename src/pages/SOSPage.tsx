import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { 
  Zap, Play, Pause, Clock, AlertTriangle, Shield, Wind, Heart, 
  Moon, Briefcase, Activity, Sparkles, ChevronRight, X, Volume2, 
  Ear, Eye, Fingerprint, Info, Award, Star
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { startBinaural, stopBinaural, FREQUENCY_PRESETS } from "@/lib/binauralBeats";

const sosSessions = [
  { 
    id: "instant-calm", 
    title: "Instant Calm", 
    duration: 3, 
    icon: <Wind className="w-6 h-6 text-emerald-500" />, 
    emoji: "🌬️",
    desc: "Ultra-quick anxiety reset using 4-7-8 breathing.", 
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    luxuryColor: "emerald",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
    steps: [
      "Close your eyes. Place one hand on your chest, one on your belly.",
      "Inhale through your nose for 4 counts... 1... 2... 3... 4.",
      "Hold your breath for 7 counts... 1... 2... 3... 4... 5... 6... 7.",
      "Exhale completely through your mouth for 8 counts... 1... 2... 3... 4... 5... 6... 7... 8.",
      "Repeat 3 more times. Feel your heartbeat slow. Feel your shoulders drop.",
      "You are safe. You are okay. This moment will pass."
    ]
  },
  { 
    id: "panic-protocol", 
    title: "Panic Protocol", 
    duration: 5, 
    icon: <Shield className="w-6 h-6 text-rose-500" />, 
    emoji: "🛡️",
    desc: "5-4-3-2-1 grounding for acute anxiety.", 
    gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    luxuryColor: "rose",
    image: "https://images.unsplash.com/photo-1499209974431-9ddd3e2f01f3?auto=format&fit=crop&q=80&w=800",
    steps: [
      "You are safe right now. This feeling is temporary. Let's ground you.",
      "Name 5 things you can SEE. Look around slowly. A wall. A light. Your hand.",
      "Name 4 things you can TOUCH. Feel the fabric, the chair, your skin.",
      "Name 3 things you can HEAR. Traffic. A fan. Your breathing.",
      "Name 2 things you can SMELL. Anything nearby.",
      "Name 1 thing you can TASTE. Even just your mouth.",
      "Take 3 slow breaths. You are here. You are present. You are okay."
    ]
  },
  { 
    id: "overwhelm", 
    title: "Overwhelm Relief", 
    duration: 7, 
    icon: <Activity className="w-6 h-6 text-blue-500" />, 
    emoji: "🌊",
    desc: "When everything feels like too much.", 
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
    luxuryColor: "blue",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    steps: [
      "Stop. Whatever you were doing — pause it.",
      "Take 5 deep breaths. In through nose... out through mouth.",
      "Scan your body from head to toe. Notice where you feel tight.",
      "Breathe into that tightness. Imagine warmth dissolving it.",
      "Remind yourself: you don't have to solve everything right now.",
      "Choose ONE thing. Just one. That's enough for now.",
      "You're doing better than you think. Take it one breath at a time."
    ]
  },
  { 
    id: "insomnia", 
    title: "Insomnia Reset", 
    duration: 10, 
    icon: <Moon className="w-6 h-6 text-indigo-500" />, 
    emoji: "🌙",
    desc: "Can't sleep? This will help.", 
    gradient: "from-indigo-500/20 via-purple-500/10 to-transparent",
    luxuryColor: "indigo",
    image: "https://images.unsplash.com/photo-1511295742364-917e703b5ca0?auto=format&fit=crop&q=80&w=800",
    steps: [
      "Lie on your back. Close your eyes. Don't try to sleep — just rest.",
      "Starting at your toes, deliberately relax each body part.",
      "Toes... soften. Feet... release. Ankles... let go.",
      "Calves... melt. Knees... relax. Thighs... heavy.",
      "Continue upward: hips, belly, chest, hands, arms, shoulders, neck, face.",
      "Each body part sinks deeper into the bed.",
      "Now count backwards from 300 by 3s: 300... 297... 294...",
      "If you lose count, start over. Don't worry. Just count."
    ]
  },
  { 
    id: "pre-meeting", 
    title: "Executive Calm", 
    duration: 5, 
    icon: <Briefcase className="w-6 h-6 text-amber-600" />, 
    emoji: "💼",
    desc: "High-performance focus before important events.", 
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    luxuryColor: "amber",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    steps: [
      "Sit upright. Feet flat on floor. Hands on thighs.",
      "Take 3 deep breaths to center yourself.",
      "Visualize the meeting going well. See yourself calm, confident, clear.",
      "Repeat silently: 'I am prepared. I am capable. I am enough.'",
      "Relax your jaw, drop your shoulders, soften your forehead.",
      "You've got this. Go in with calm confidence."
    ]
  },
  { 
    id: "grief", 
    title: "Compassion Hold", 
    duration: 10, 
    icon: <Heart className="w-6 h-6 text-purple-500" />, 
    emoji: "💜",
    desc: "Hold difficult emotions with deep compassion.", 
    gradient: "from-purple-500/20 via-violet-500/10 to-transparent",
    luxuryColor: "purple",
    image: "https://images.unsplash.com/photo-1516589174184-c685266e430c?auto=format&fit=crop&q=80&w=800",
    steps: [
      "Find a quiet space. This is your time to feel whatever comes.",
      "Place both hands on your heart. Feel its rhythm.",
      "Say gently: 'It's okay to feel this. I don't need to be strong right now.'",
      "If tears come, let them. They are not weakness — they are release.",
      "Breathe in compassion for yourself. Breathe out whatever you need to release.",
      "Remember: grief is love with nowhere to go. It means you loved deeply.",
      "When ready, take one deep breath. You survived this moment. You will survive the next."
    ]
  }
];

export default function SOSPage() {
  const [active, setActive] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [timerSecs, setTimerSecs] = useState(0);
  const [running, setRunning] = useState(false);
  const [binauralActive, setBinauralActive] = useState(false);
  const [binauralVolume, setBinauralVolume] = useState(0.2);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeSession = sosSessions.find(s => s.id === active);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setTimerSecs(s => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  useEffect(() => {
    if (active && binauralActive) {
      startBinaural(FREQUENCY_PRESETS[1], binauralVolume); // Theta for deep calm
    } else {
      stopBinaural();
    }
    return () => stopBinaural();
  }, [active, binauralActive, binauralVolume]);

  const startSession = (id: string) => { 
    setActive(id); 
    setStepIndex(0); 
    setTimerSecs(0); 
    setRunning(true); 
    setBinauralActive(true);
  };

  const nextStep = () => {
    if (activeSession && stepIndex < activeSession.steps.length - 1) setStepIndex(s => s + 1);
    else { 
      setRunning(false); 
      setActive(null); 
      setBinauralActive(false);
    }
  };

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <AppLayout>
      <motion.div className="max-w-4xl mx-auto space-y-10 pb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        
        {/* ─── PREMIUM HEADER ─── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-2xl -ml-10 -mb-10" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Star className="w-4 h-4 text-gold fill-gold" />
                <span className="text-xs font-body font-bold tracking-widest uppercase text-gold">Premium SOS Relief</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">Instant Serenity</h1>
              <p className="text-lg font-body text-slate-300 mt-2 max-w-lg">Emergency protocols designed for high-performance individuals to regain composure in seconds.</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeSession && (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-2xl"
            >
              {/* Session Hero Image */}
              <div className="h-64 relative">
                <img src={activeSession.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <button 
                  onClick={() => { setActive(null); setRunning(false); }}
                  className="absolute top-6 right-6 p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-6 left-8">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20`}>
                      {activeSession.icon}
                    </div>
                    <div>
                      <h2 className="font-display text-3xl font-bold text-foreground">{activeSession.title}</h2>
                      <p className="text-sm font-body text-muted-foreground">{fmtTime(timerSecs)} elapsed · {activeSession.duration}m protocol</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12">
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="min-h-[160px] flex flex-col justify-center"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-body font-bold uppercase tracking-tighter">Step {stepIndex + 1} of {activeSession.steps.length}</span>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                  <p className="font-display text-2xl md:text-3xl text-foreground leading-relaxed font-medium italic">
                    "{activeSession.steps[stepIndex]}"
                  </p>
                </motion.div>

                {/* Premium Controls */}
                <div className="mt-12 space-y-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setRunning(!running)} 
                        className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all"
                      >
                        {running ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                      </button>
                      <button 
                        onClick={nextStep} 
                        className="px-10 py-4 bg-gradient-to-r from-gold to-gold-dark text-white rounded-2xl text-base font-body font-bold shadow-gold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                      >
                        {stepIndex < activeSession.steps.length - 1 ? "Continue Protocol" : "I Am Restored"}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-6 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${binauralActive ? 'bg-rose-500/20 text-rose-600' : 'bg-slate-200 text-slate-400'}`}>
                          <Ear className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-body font-bold uppercase tracking-widest text-muted-foreground">Binaural Calm</p>
                          <button 
                            onClick={() => setBinauralActive(!binauralActive)}
                            className={`text-xs font-body font-bold ${binauralActive ? 'text-rose-600' : 'text-slate-500'}`}
                          >
                            {binauralActive ? 'Active' : 'Disabled'}
                          </button>
                        </div>
                      </div>
                      {binauralActive && (
                        <div className="w-32">
                          <Slider value={[binauralVolume]} onValueChange={(v) => setBinauralVolume(v[0])} min={0} max={1} step={0.1} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Dots */}
                  <div className="flex justify-center gap-2">
                    {activeSession.steps.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          i === stepIndex ? "w-8 bg-gold" : i < stepIndex ? "w-4 bg-primary/40" : "w-4 bg-secondary"
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!active && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-foreground">Select Your Relief Kit</h2>
              <div className="flex items-center gap-2 text-xs font-body font-bold text-gold uppercase tracking-widest">
                <Award className="w-4 h-4" />
                Luxury Collection
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sosSessions.map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => startSession(s.id)}
                  className="group relative overflow-hidden rounded-3xl bg-card border border-border/50 text-left hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="h-48 overflow-hidden">
                    <img src={s.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-60`} />
                  </div>
                  <div className="p-6 relative">
                    <div className="absolute -top-10 right-6 w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                      {s.icon}
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">{s.title}</h3>
                    <p className="text-sm font-body text-muted-foreground mt-2 line-clamp-2">{s.desc}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <span className="flex items-center gap-1.5 text-xs font-body font-bold text-primary">
                        <Clock className="w-3.5 h-3.5" /> {s.duration} MIN
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-body font-bold text-gold">
                        <Sparkles className="w-3.5 h-3.5" /> PREMIUM
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* ─── CRISIS SUPPORT ─── */}
        <div className="relative overflow-hidden rounded-3xl bg-rose-50 border border-rose-100 p-8 dark:bg-rose-950/20 dark:border-rose-900/30">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20 flex-shrink-0">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold text-rose-900 dark:text-rose-100">Immediate Crisis Support</h3>
              <p className="text-sm font-body text-rose-700 dark:text-rose-300 mt-1">
                If you are in immediate danger or experiencing a medical emergency, please contact professional services immediately.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="px-4 py-2 rounded-xl bg-white/50 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-800 text-xs font-body font-bold text-rose-900 dark:text-rose-100">
                  US: 988 (Suicide & Crisis)
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/50 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-800 text-xs font-body font-bold text-rose-900 dark:text-rose-100">
                  Text HOME to 741741
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── LUXURY FOOTER ─── */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-border" />
            <Fingerprint className="w-5 h-5 text-muted-foreground" />
            <div className="h-px w-12 bg-border" />
          </div>
          <p className="text-xs font-body text-muted-foreground uppercase tracking-[0.2em]">Mind Serenity Hub · Elite Wellness Protocol</p>
        </div>

      </motion.div>
    </AppLayout>
  );
}

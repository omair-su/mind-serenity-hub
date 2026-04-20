import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { 
  Zap, Play, Pause, Clock, AlertTriangle, Shield, Wind, Heart, 
  Moon, Briefcase, Activity, Sparkles, ChevronRight, X, Volume2, 
  Ear, Eye, Fingerprint, Info, Award, Star, Flame, Users, Gem, CheckCircle2
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { startBinaural, stopBinaural, FREQUENCY_PRESETS } from "@/lib/binauralBeats";
import BreathingOrb from "@/components/bodyscan/BreathingOrb";
import AICompanionChat from "@/components/sos/AICompanionChat";
import EmergencyContacts from "@/components/sos/EmergencyContacts";
import { extraSOSSessions } from "@/data/extraSOS";

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
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
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
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&q=80&w=1200",
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
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
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
    image: "https://images.unsplash.com/photo-1532978879514-6cae1cb02ddb?auto=format&fit=crop&q=80&w=1600",
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
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&q=80&w=1600",
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
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&q=80&w=1200&h=800",
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

// Map extra sessions to full session shape with icons + luxuryColor
const extraIconMap: Record<string, { icon: JSX.Element; luxuryColor: string }> = {
  "anger-defuse": { icon: <Flame className="w-6 h-6 text-red-500" />, luxuryColor: "red" },
  "social-anxiety": { icon: <Users className="w-6 h-6 text-cyan-500" />, luxuryColor: "cyan" },
  "pain-acceptance": { icon: <Gem className="w-6 h-6 text-violet-500" />, luxuryColor: "violet" },
};

const allSessions = [
  ...sosSessions,
  ...extraSOSSessions.map((s) => ({
    ...s,
    icon: extraIconMap[s.id]?.icon ?? <Sparkles className="w-6 h-6 text-primary" />,
    luxuryColor: extraIconMap[s.id]?.luxuryColor ?? "primary",
  })),
];

export default function SOSPage() {
  const [active, setActive] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [timerSecs, setTimerSecs] = useState(0);
  const [running, setRunning] = useState(false);
  const [binauralActive, setBinauralActive] = useState(false);
  const [binauralVolume, setBinauralVolume] = useState(0.2);
  const [completed, setCompleted] = useState<{ id: string; title: string } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeSession = allSessions.find(s => s.id === active);

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
    setBinauralActive(false); // opt-in only — user must explicitly enable
    setCompleted(null);
  };

  const closeSession = () => {
    setActive(null);
    setRunning(false);
    setBinauralActive(false);
    stopBinaural(); // hard-stop any audio immediately
  };

  const nextStep = () => {
    if (activeSession && stepIndex < activeSession.steps.length - 1) {
      setStepIndex(s => s + 1);
    } else if (activeSession) {
      setCompleted({ id: activeSession.id, title: activeSession.title });
      closeSession();
    }
  };

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // Map luxuryColor → tailwind gradient class for breathing orb
  const orbColorMap: Record<string, string> = {
    emerald: "from-emerald-400 to-teal-500",
    rose: "from-rose-400 to-pink-500",
    blue: "from-blue-400 to-indigo-500",
    indigo: "from-indigo-400 to-purple-500",
    amber: "from-amber-400 to-orange-500",
    purple: "from-purple-400 to-violet-500",
    red: "from-red-400 to-orange-500",
    cyan: "from-cyan-400 to-blue-500",
    violet: "from-violet-400 to-purple-500",
  };


  return (
    <AppLayout>
      <motion.div className="max-w-4xl mx-auto space-y-10 pb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        
        {/* ─── REFINED PREMIUM HEADER ─── */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 md:p-10 text-white shadow-2xl border border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-[80px] -ml-10 -mb-10" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-gold via-gold-dark to-amber-700 flex items-center justify-center shadow-2xl shadow-gold/20 border border-white/10">
              <Zap className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                <span className="text-[10px] font-body font-bold tracking-[0.3em] uppercase text-gold/80">Elite SOS Protocol</span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight tracking-tight">Instant Serenity</h1>
              <p className="text-base md:text-lg font-body text-slate-400 mt-2 max-w-lg leading-relaxed">Emergency protocols designed for high-performance individuals to regain composure in seconds.</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeSession && (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-card border border-border/40 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)]"
            >
              {/* Session Hero Image with Premium Framing */}
              <div className="h-72 md:h-80 relative overflow-hidden">
                <img src={activeSession.image} alt="" className="w-full h-full object-cover scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2.5rem]" />
                
                <button 
                  onClick={closeSession}
                  className="absolute top-6 right-6 p-2.5 rounded-full bg-black/30 backdrop-blur-xl text-white border border-white/10 hover:bg-black/50 transition-all z-20"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="absolute bottom-8 left-10 z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
                      {activeSession.icon}
                    </div>
                    <div>
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">{activeSession.title}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-sm font-body font-medium text-muted-foreground/80">{fmtTime(timerSecs)} elapsed · {activeSession.duration}m protocol</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 md:p-16">
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="min-h-[180px] flex flex-col justify-center"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-body font-bold uppercase tracking-[0.2em] border border-primary/10">Step {stepIndex + 1} of {activeSession.steps.length}</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-border/60 to-transparent" />
                  </div>
                  <p className="font-display text-2xl md:text-4xl text-foreground leading-[1.4] font-medium italic tracking-tight">
                    "{activeSession.steps[stepIndex]}"
                  </p>

                  {/* Animated breathing orb synced with the step */}
                  <BreathingOrb
                    isActive={running}
                    color={orbColorMap[(activeSession as any).luxuryColor] ?? "from-primary/60 to-gold/60"}
                  />
                </motion.div>

                {/* Premium Controls */}
                <div className="mt-14 space-y-10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-5">
                      <button 
                        onClick={() => setRunning(!running)} 
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all border border-white/10"
                      >
                        {running ? <Pause className="w-7 h-7 md:w-8 md:h-8" /> : <Play className="w-7 h-7 md:w-8 md:h-8 ml-1.5" />}
                      </button>
                      <button 
                        onClick={nextStep} 
                        className="px-10 md:px-14 py-4 md:py-5 bg-gradient-to-r from-gold via-gold-dark to-amber-700 text-white rounded-[1.25rem] text-base md:text-lg font-body font-bold shadow-[0_20px_40px_-12px_rgba(212,175,55,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(212,175,55,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 border border-white/10"
                      >
                        {stepIndex < activeSession.steps.length - 1 ? "Continue Protocol" : "I Am Restored"}
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                    </div>

                    <div className="flex items-center gap-6 p-5 rounded-[1.5rem] bg-secondary/20 border border-border/40 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl transition-colors ${binauralActive ? 'bg-rose-500/20 text-rose-600 shadow-inner' : 'bg-slate-200/50 text-slate-400'}`}>
                          <Ear className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-body font-bold uppercase tracking-[0.2em] text-muted-foreground/70">Binaural Calm</p>
                          <button 
                            onClick={() => setBinauralActive(!binauralActive)}
                            className={`text-xs font-body font-bold transition-colors ${binauralActive ? 'text-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                            {binauralActive ? 'Active' : 'Disabled'}
                          </button>
                        </div>
                      </div>
                      {binauralActive && (
                        <div className="w-32 md:w-40">
                          <Slider value={[binauralVolume]} onValueChange={(v) => setBinauralVolume(v[0])} min={0} max={1} step={0.1} className="cursor-pointer" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Dots */}
                  <div className="flex justify-center gap-3">
                    {activeSession.steps.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-700 ${
                          i === stepIndex ? "w-12 bg-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]" : i < stepIndex ? "w-6 bg-primary/30" : "w-6 bg-secondary/60"
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── POST-SESSION COMPANION CHECK-IN ─── */}
        <AnimatePresence>
          {completed && !active && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-3 px-2">
                <div className="p-2 rounded-xl bg-emerald-500/15">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground tracking-tight">Protocol complete</h3>
                  <p className="text-xs font-body text-muted-foreground">Take a moment to land. Your companion is here.</p>
                </div>
                <button
                  onClick={() => setCompleted(null)}
                  className="ml-auto text-xs font-body text-muted-foreground hover:text-foreground"
                >
                  Dismiss
                </button>
              </div>
              <AICompanionChat protocolTitle={completed.title} />
            </motion.div>
          )}
        </AnimatePresence>

        {!active && (
          <div className="space-y-10">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">Select Your Relief Kit</h2>
              <div className="flex items-center gap-2.5 text-[10px] font-body font-bold text-gold uppercase tracking-[0.3em] bg-gold/5 px-4 py-2 rounded-full border border-gold/10">
                <Award className="w-3.5 h-3.5" />
                Luxury Collection
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {allSessions.map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => startSession(s.id)}
                  className="group relative overflow-hidden rounded-[2rem] bg-card border border-border/40 text-left hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="h-52 overflow-hidden relative">
                    <img src={s.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-40 group-hover:opacity-20 transition-opacity`} />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-t-[2rem]" />
                  </div>
                  <div className="p-7 relative">
                    <div className="absolute -top-10 right-8 w-16 h-16 rounded-2xl bg-card shadow-2xl flex items-center justify-center group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 border border-border/50">
                      {s.icon}
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight">{s.title}</h3>
                    <p className="text-sm font-body text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">{s.desc}</p>
                    <div className="flex items-center gap-5 mt-5">
                      <span className="flex items-center gap-2 text-[10px] font-body font-bold text-primary tracking-widest uppercase">
                        <Clock className="w-3.5 h-3.5" /> {s.duration} MIN
                      </span>
                      <span className="flex items-center gap-2 text-[10px] font-body font-bold text-gold tracking-widest uppercase">
                        <Sparkles className="w-3.5 h-3.5" /> PREMIUM
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* ─── REGION-AWARE EMERGENCY CONTACTS ─── */}
        <EmergencyContacts />

        {/* ─── LUXURY FOOTER ─── */}
        <div className="text-center space-y-5 pt-10">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
            <Fingerprint className="w-6 h-6 text-muted-foreground/40" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
          </div>
          <p className="text-[10px] font-body text-muted-foreground/60 uppercase tracking-[0.4em] font-bold">Mind Serenity Hub · Elite Wellness Protocol</p>
        </div>

      </motion.div>
    </AppLayout>
  );
}

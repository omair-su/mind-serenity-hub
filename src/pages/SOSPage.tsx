import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Zap, Play, Pause, Clock, AlertTriangle } from "lucide-react";

const sosSessions = [
  { id: "instant-calm", title: "Instant Calm", duration: 3, icon: "🌬️", desc: "Ultra-quick anxiety reset using 4-7-8 breathing.", gradient: "from-[hsl(var(--sage))]/12 via-[hsl(var(--forest))]/8 to-[hsl(var(--sage-light))]/5",
    steps: [
      "Close your eyes. Place one hand on your chest, one on your belly.",
      "Inhale through your nose for 4 counts... 1... 2... 3... 4.",
      "Hold your breath for 7 counts... 1... 2... 3... 4... 5... 6... 7.",
      "Exhale completely through your mouth for 8 counts... 1... 2... 3... 4... 5... 6... 7... 8.",
      "Repeat 3 more times. Feel your heartbeat slow. Feel your shoulders drop.",
      "You are safe. You are okay. This moment will pass."
    ]},
  { id: "panic-protocol", title: "Panic Attack Protocol", duration: 5, icon: "🛡️", desc: "5-4-3-2-1 grounding for acute anxiety.", gradient: "from-[hsl(var(--gold))]/12 via-[hsl(var(--gold-light))]/8 to-[hsl(var(--cream))]/5",
    steps: [
      "You are safe right now. This feeling is temporary. Let's ground you.",
      "Name 5 things you can SEE. Look around slowly. A wall. A light. Your hand.",
      "Name 4 things you can TOUCH. Feel the fabric, the chair, your skin.",
      "Name 3 things you can HEAR. Traffic. A fan. Your breathing.",
      "Name 2 things you can SMELL. Anything nearby.",
      "Name 1 thing you can TASTE. Even just your mouth.",
      "Take 3 slow breaths. You are here. You are present. You are okay."
    ]},
  { id: "overwhelm", title: "Overwhelm Relief", duration: 7, icon: "🌊", desc: "When everything feels like too much.", gradient: "from-[hsl(var(--forest))]/12 via-[hsl(var(--sage))]/8 to-[hsl(var(--forest-mid))]/5",
    steps: [
      "Stop. Whatever you were doing — pause it.",
      "Take 5 deep breaths. In through nose... out through mouth.",
      "Scan your body from head to toe. Notice where you feel tight.",
      "Breathe into that tightness. Imagine warmth dissolving it.",
      "Remind yourself: you don't have to solve everything right now.",
      "Choose ONE thing. Just one. That's enough for now.",
      "You're doing better than you think. Take it one breath at a time."
    ]},
  { id: "anger", title: "Anger Management", duration: 8, icon: "🔥", desc: "Cool down heated emotions safely.", gradient: "from-[hsl(var(--gold-dark))]/12 via-[hsl(var(--gold))]/8 to-[hsl(var(--gold-light))]/5",
    steps: [
      "Acknowledge: 'I feel angry. That's a valid emotion.'",
      "Step away from the situation if possible. Give yourself space.",
      "Take 10 slow breaths. Count each exhale.",
      "Clench your fists tight for 5 seconds... then release completely.",
      "Repeat with shoulders. Tense... hold... release.",
      "Ask yourself: 'Will this matter in 5 years? 5 months? 5 days?'",
      "When ready, choose your response instead of reacting. You have that power."
    ]},
  { id: "insomnia", title: "Insomnia Reset", duration: 10, icon: "🌙", desc: "Can't sleep? This will help.", gradient: "from-[hsl(var(--forest-deep))]/12 via-[hsl(var(--forest))]/8 to-[hsl(var(--forest-mid))]/5",
    steps: [
      "Lie on your back. Close your eyes. Don't try to sleep — just rest.",
      "Starting at your toes, deliberately relax each body part.",
      "Toes... soften. Feet... release. Ankles... let go.",
      "Calves... melt. Knees... relax. Thighs... heavy.",
      "Continue upward: hips, belly, chest, hands, arms, shoulders, neck, face.",
      "Each body part sinks deeper into the bed.",
      "Now count backwards from 300 by 3s: 300... 297... 294...",
      "If you lose count, start over. Don't worry. Just count."
    ]},
  { id: "pre-meeting", title: "Pre-Meeting Calm", duration: 5, icon: "💼", desc: "Before any important event.", gradient: "from-[hsl(var(--sage-dark))]/12 via-[hsl(var(--sage))]/8 to-[hsl(var(--sage-light))]/5",
    steps: [
      "Sit upright. Feet flat on floor. Hands on thighs.",
      "Take 3 deep breaths to center yourself.",
      "Visualize the meeting going well. See yourself calm, confident, clear.",
      "Repeat silently: 'I am prepared. I am capable. I am enough.'",
      "Relax your jaw, drop your shoulders, soften your forehead.",
      "You've got this. Go in with calm confidence."
    ]},
  { id: "grief", title: "Grief Support", duration: 10, icon: "💜", desc: "Hold difficult emotions with compassion.", gradient: "from-[hsl(var(--forest-deep))]/12 via-[hsl(var(--forest-mid))]/8 to-[hsl(var(--sage))]/5",
    steps: [
      "Find a quiet space. This is your time to feel whatever comes.",
      "Place both hands on your heart. Feel its rhythm.",
      "Say gently: 'It's okay to feel this. I don't need to be strong right now.'",
      "If tears come, let them. They are not weakness — they are release.",
      "Breathe in compassion for yourself. Breathe out whatever you need to release.",
      "Remember: grief is love with nowhere to go. It means you loved deeply.",
      "When ready, take one deep breath. You survived this moment. You will survive the next."
    ]},
  { id: "energy", title: "Quick Energy", duration: 5, icon: "⚡", desc: "Revitalize when you're dragging.", gradient: "from-[hsl(var(--gold))]/12 via-[hsl(var(--gold-dark))]/8 to-[hsl(var(--gold-light))]/5",
    steps: [
      "Stand up if possible. Shake your hands vigorously for 10 seconds.",
      "Roll your shoulders backward 5 times, forward 5 times.",
      "Take 5 sharp breaths — quick inhale through nose, sharp exhale through mouth.",
      "Reach arms overhead. Stretch tall. Hold 5 seconds.",
      "Rub your palms together quickly until warm. Place over closed eyes.",
      "You're recharged. Go."
    ]},
];

export default function SOSPage() {
  const [active, setActive] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [timerSecs, setTimerSecs] = useState(0);
  const [running, setRunning] = useState(false);
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

  const startSession = (id: string) => { setActive(id); setStepIndex(0); setTimerSecs(0); setRunning(true); };
  const nextStep = () => {
    if (activeSession && stepIndex < activeSession.steps.length - 1) setStepIndex(s => s + 1);
    else { setRunning(false); setActive(null); }
  };
  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <AppLayout>
      <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[hsl(var(--gold))]/20 to-[hsl(var(--gold-light))]/15 flex items-center justify-center">
            <Zap className="w-5 h-5 text-[hsl(var(--gold))]" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Quick Relief</h1>
            <p className="text-sm font-body text-muted-foreground">Emergency meditation techniques for when you need calm NOW.</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeSession && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-primary/5 via-card to-[hsl(var(--gold))]/5 rounded-2xl border-2 border-primary/20 p-8 shadow-elevated"
            >
              <div className="text-center mb-6">
                <span className="text-5xl">{activeSession.icon}</span>
                <h2 className="font-display text-2xl font-bold text-foreground mt-3">{activeSession.title}</h2>
                <p className="text-sm font-body text-muted-foreground mt-1">{fmtTime(timerSecs)} elapsed</p>
              </div>
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-primary/5 to-[hsl(var(--sage))]/10 rounded-xl p-6 mb-6 border border-primary/10"
              >
                <p className="text-xs font-body font-semibold text-primary uppercase tracking-wider mb-2">
                  Step {stepIndex + 1} of {activeSession.steps.length}
                </p>
                <p className="font-body text-lg text-foreground leading-relaxed">{activeSession.steps[stepIndex]}</p>
              </motion.div>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setRunning(!running)} className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-[var(--shadow-soft-val)]">
                  {running ? <Pause className="w-5 h-5 text-primary-foreground" /> : <Play className="w-5 h-5 text-primary-foreground" />}
                </button>
                <button onClick={nextStep} className="px-6 py-3 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white rounded-xl text-sm font-body font-semibold shadow-[var(--shadow-gold-val)] hover:shadow-lg transition-all">
                  {stepIndex < activeSession.steps.length - 1 ? "Next Step" : "I Feel Better"}
                </button>
                <button onClick={() => { setActive(null); setRunning(false); }} className="px-4 py-3 bg-secondary rounded-xl text-sm font-body text-muted-foreground hover:bg-secondary/80 transition-all">End</button>
              </div>
              <div className="flex justify-center gap-1.5 mt-5">
                {activeSession.steps.map((_, i) => (
                  <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i <= stepIndex ? "bg-primary scale-110" : "bg-secondary"}`} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!active && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sosSessions.map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => startSession(s.id)}
                className={`text-left bg-gradient-to-br ${s.gradient} rounded-2xl border border-border/50 p-5 hover:shadow-[var(--shadow-card-val)] hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">{s.icon}</span>
                  <div>
                    <p className="font-display text-base font-semibold text-foreground">{s.title}</p>
                    <p className="text-xs font-body text-muted-foreground mt-0.5">{s.desc}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-body text-muted-foreground mt-2 px-2 py-0.5 rounded-md bg-card/60">
                      <Clock className="w-3 h-3" /> {s.duration} minutes
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        <div className="bg-gradient-to-r from-[hsl(var(--gold))]/8 to-[hsl(var(--gold-light))]/5 rounded-2xl p-5 border border-[hsl(var(--gold))]/15">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-body font-medium text-foreground">In crisis? These practices help, but aren't emergency care.</p>
              <p className="text-xs font-body text-muted-foreground mt-1">
                Call <strong>988</strong> (US) for mental health support · <strong>911</strong> for emergencies ·
                Text <strong>HOME</strong> to <strong>741741</strong> for Crisis Text Line
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

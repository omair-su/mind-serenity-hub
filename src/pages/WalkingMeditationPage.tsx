import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Footprints, Play, Pause, RotateCcw, TreePine, Mountain, Waves, Sun, MapPin, Clock, Flame, Heart } from "lucide-react";
import walkingHero from "@/assets/walking-hero.jpg";

const environments = [
  { id: "forest", label: "Forest Path", icon: TreePine, desc: "Walk among ancient trees. Feel bark and moss underfoot. Let the canopy shelter your thoughts." },
  { id: "mountain", label: "Mountain Trail", icon: Mountain, desc: "Ascend with steady breath. Each step brings you closer to clarity." },
  { id: "beach", label: "Ocean Shore", icon: Waves, desc: "Feel sand between your toes. Let waves synchronize with your breath." },
  { id: "garden", label: "Zen Garden", icon: Sun, desc: "Walk the raked patterns. Each step is deliberate, unhurried, complete." },
];

const techniques = [
  {
    id: "mindful",
    title: "Mindful Walking",
    duration: 10,
    fullDescription: "This foundational practice trains complete attention to the physical act of walking. Used in Vipassana retreats worldwide, it develops moment-to-moment awareness that transfers to all of daily life.",
    steps: [
      "Stand still. Feel the weight of your body through your feet. Notice which parts of your feet touch the ground.",
      "Begin walking slowly. As you lift your left foot, notice the intention to move before the movement begins.",
      "Feel the heel leave the ground first, then the ball, then the toes. Your foot swings through the air — notice the lightness.",
      "Place the heel down first. Feel the weight transfer smoothly from heel to toe.",
      "As one foot lands, the other begins to lift. Feel this continuous dance of balance.",
      "When your mind wanders — simply note 'thinking' and return to the feeling of your feet.",
      "Gradually slow down even further. Can you feel the muscles in your ankles, calves, and thighs working in harmony?",
      "For the final minutes, walk at your natural pace, carrying this deep awareness with you.",
    ],
  },
  {
    id: "gratitude",
    title: "Gratitude Walk",
    duration: 15,
    fullDescription: "Combining gratitude practice with walking multiplies the benefits of both. Research by Dr. Robert Emmons shows gratitude walkers report 23% less stress and better sleep quality.",
    steps: [
      "Begin walking and notice the ground beneath you. With each step, silently say 'thank you'.",
      "Look around. Find something beautiful — a colour, a shape, a shadow. Feel genuine appreciation.",
      "Think of a person who has helped you. Picture their face. Send them silent gratitude.",
      "Notice the air filling your lungs. Appreciate this breath — connecting you to every living being.",
      "Feel the miracle of movement — thousands of nerve signals, muscles contracting, all happening without effort.",
      "Recall a difficult time that taught you something valuable. Thank that difficulty for its hidden gift.",
      "For the final minutes, walk with simple awareness: 'I am alive. I am here. This is enough.'",
    ],
  },
  {
    id: "body-aware",
    title: "Body Awareness Walk",
    duration: 12,
    fullDescription: "A progressive body-scanning technique applied to walking. Originally developed in somatic therapy, this practice reveals unconscious tension and teaches the body to release it through movement.",
    steps: [
      "Begin walking. Bring all attention to your feet — the pressure, the temperature, the texture of the ground.",
      "Move awareness up to your ankles and calves. Notice the muscles contracting and releasing with each step.",
      "Scan your knees. Are they locked or soft? Let them absorb each step like natural shock absorbers.",
      "Feel your hips — the ball-and-socket joints. Notice the subtle rotation with each stride.",
      "Bring attention to your core — the deep muscles that stabilize you. Feel them engaging rhythmically.",
      "Notice your spine — from tailbone to skull. Let it find its natural, comfortable alignment.",
      "Scan your shoulders. Are they creeping up? Let them drop and roll gently back.",
      "Finally, notice your whole body as one integrated system — every part working in harmony.",
    ],
  },
  {
    id: "breath-sync",
    title: "Breath-Synced Walk",
    duration: 10,
    fullDescription: "This practice links your breath cycle to your steps, creating a moving pranayama. Used by Tibetan monks, it naturally calms the vagus nerve and shifts the nervous system into parasympathetic mode.",
    steps: [
      "Begin walking comfortably. Notice your natural breathing rhythm without changing it.",
      "Count how many steps you take during a natural inhale. Then count your exhale steps.",
      "Gradually shift to a pattern: inhale for 4 steps. Let the breath flow in smoothly.",
      "Exhale for 6 steps. A longer exhale activates your calming nervous system.",
      "If 4-6 feels uncomfortable, try 3-4 or 2-3. The key is a longer exhale.",
      "After several minutes, add a brief hold: inhale 4 steps, hold 2 steps, exhale 6 steps.",
      "Notice how your body relaxes. Shoulders drop. Jaw unclenches. Steps become lighter.",
      "Release the counting and let breath and steps find their own natural rhythm together.",
    ],
  },
];

export default function WalkingMeditationPage() {
  const [selectedEnv, setSelectedEnv] = useState(environments[0]);
  const [selectedTech, setSelectedTech] = useState<typeof techniques[0] | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [sessions, setSessions] = useState<number>(() => {
    try { return JSON.parse(localStorage.getItem("wv-walking-sessions") || "0"); } catch { return 0; }
  });

  useEffect(() => {
    if (!isActive || !selectedTech) return;
    intervalRef.current = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        if (next >= selectedTech.duration * 60) {
          setIsActive(false);
          const newCount = sessions + 1;
          setSessions(newCount);
          localStorage.setItem("wv-walking-sessions", JSON.stringify(newCount));
        }
        return next;
      });
      setStepCount(prev => prev + (Math.random() > 0.3 ? 1 : 0));
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive, selectedTech, sessions]);

  useEffect(() => {
    if (!isActive || !selectedTech) return;
    const i = setInterval(() => {
      setCurrentStepIdx(prev => (prev + 1) % selectedTech.steps.length);
    }, 20000);
    return () => clearInterval(i);
  }, [isActive, selectedTech]);

  const reset = () => { setIsActive(false); setElapsed(0); setStepCount(0); setCurrentStepIdx(0); };
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const progressPct = selectedTech ? (elapsed / (selectedTech.duration * 60)) * 100 : 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden h-[220px]">
          <img src={walkingHero} alt="Walking meditation in nature" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(145,25%,12%)]/95 via-[hsl(145,20%,15%)]/40 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-white/15 backdrop-blur-sm">
                <Footprints className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-body font-semibold uppercase tracking-wider text-white/70">Mindful Movement</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-1">Walking Meditation</h1>
            <p className="text-sm font-body text-white/70">Transform every step into a meditation. Move with intention, breathe with purpose.</p>
          </div>
        </div>

        {/* Stats — muted card style */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Sessions", value: sessions, icon: MapPin },
            { label: "Steps Today", value: stepCount, icon: Footprints },
            { label: "Minutes", value: Math.floor(elapsed / 60), icon: Clock },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-card border border-border p-3 text-center shadow-soft">
              <s.icon className="w-4 h-4 mx-auto mb-1 text-primary/70" />
              <div className="text-lg font-display font-bold text-foreground">{s.value}</div>
              <div className="text-[9px] font-body uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Environment Selector */}
        <div>
          <h3 className="font-display font-bold text-sm text-foreground mb-3 flex items-center gap-2">
            <TreePine className="w-4 h-4 text-primary/70" /> Choose Your Path
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {environments.map(env => (
              <button
                key={env.id}
                onClick={() => setSelectedEnv(env)}
                className={`rounded-xl bg-card border p-3.5 text-left transition-all ${
                  selectedEnv.id === env.id
                    ? "border-primary/30 bg-primary/5 shadow-soft"
                    : "border-border hover:border-primary/20"
                }`}
              >
                <env.icon className="w-5 h-5 mb-1.5 text-primary/70" />
                <p className="text-xs font-display font-bold text-foreground">{env.label}</p>
                <p className="text-[10px] font-body text-muted-foreground leading-tight mt-0.5">{env.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Active Session */}
        {selectedTech && isActive && (
          <div className="rounded-2xl bg-card border border-primary/20 p-5 relative overflow-hidden shadow-soft">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/5 blur-2xl" />
            <div className="relative z-10 space-y-4">
              <div className="text-center">
                <p className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-2">Current Guidance</p>
                <p className="text-sm font-body font-medium text-foreground leading-relaxed">{selectedTech.steps[currentStepIdx]}</p>
              </div>
              <div className="text-center">
                <span className="text-3xl font-display font-bold text-foreground">{formatTime(elapsed)}</span>
                <span className="text-sm font-body text-muted-foreground ml-2">/ {selectedTech.duration}:00</span>
              </div>
              <Progress value={progressPct} className="h-2" />
              <div className="flex items-center justify-center gap-4">
                <Button size="sm" variant="outline" onClick={() => setIsActive(false)}>
                  <Pause className="w-5 h-5" />
                </Button>
                <Button size="sm" variant="outline" onClick={reset}>
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex justify-center gap-4 text-xs font-body text-muted-foreground">
                <span className="flex items-center gap-1"><Footprints className="w-3 h-3" /> {stepCount} steps</span>
                <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> ~{Math.round(stepCount * 0.04)} cal</span>
              </div>
            </div>
          </div>
        )}

        {/* Technique Cards */}
        <div>
          <h3 className="font-display font-bold text-sm text-foreground mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary/60" /> Walking Techniques
          </h3>
          <div className="space-y-3">
            {techniques.map(tech => (
              <button
                key={tech.id}
                onClick={() => { setSelectedTech(tech); reset(); }}
                className={`w-full rounded-xl bg-card border p-4 text-left transition-all hover:shadow-soft ${
                  selectedTech?.id === tech.id ? "border-primary/30 bg-primary/5" : "border-border hover:border-primary/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-display font-bold text-sm text-foreground">{tech.title}</h4>
                  <span className="text-xs font-body bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">{tech.duration} min</span>
                </div>
                <p className="text-xs font-body text-muted-foreground leading-relaxed">{tech.fullDescription}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        {selectedTech && !isActive && (
          <Button onClick={() => { reset(); setIsActive(true); }} className="w-full h-14 btn-gold text-lg font-display font-bold shadow-gold">
            <Play className="w-5 h-5 mr-2" /> Begin {selectedTech.title}
          </Button>
        )}

        {/* Completion */}
        {selectedTech && !isActive && elapsed > 0 && elapsed >= selectedTech.duration * 60 && (
          <div className="rounded-2xl bg-card border border-primary/20 p-6 text-center shadow-soft">
            <div className="text-4xl mb-2">🚶‍♂️✨</div>
            <h3 className="font-display text-xl font-bold text-foreground mb-1">Walk Complete!</h3>
            <p className="text-sm font-body text-muted-foreground">{stepCount} mindful steps · {selectedTech.duration} minutes of presence</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

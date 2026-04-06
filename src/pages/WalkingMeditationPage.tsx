import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Footprints, Play, Pause, RotateCcw, TreePine, Mountain, Waves, Sun, MapPin, Clock, Flame, Heart } from "lucide-react";

const environments = [
  { id: "forest", label: "Forest Path", icon: TreePine, gradient: "from-emerald-600 via-green-600 to-teal-700", desc: "Walk among ancient trees, feel bark and moss underfoot." },
  { id: "mountain", label: "Mountain Trail", icon: Mountain, gradient: "from-slate-600 via-blue-700 to-indigo-800", desc: "Ascend with steady breath, the summit within." },
  { id: "beach", label: "Ocean Shore", icon: Waves, gradient: "from-cyan-500 via-blue-500 to-indigo-600", desc: "Feel sand between your toes, waves syncing with breath." },
  { id: "garden", label: "Zen Garden", icon: Sun, gradient: "from-amber-500 via-orange-500 to-rose-600", desc: "Walk the raked patterns, each step a meditation." },
];

const techniques = [
  { id: "mindful", title: "Mindful Walking", duration: 10, steps: ["Notice each foot lifting", "Feel the heel touch ground", "Roll through to the toe", "Observe the shift in weight", "Synchronize breath with steps"], gradient: "from-violet-500 to-purple-600" },
  { id: "gratitude", title: "Gratitude Walk", duration: 15, steps: ["With each step, name one thing you're grateful for", "Feel the earth supporting you", "Notice colors around you", "Appreciate the ability to move", "End with three deep breaths"], gradient: "from-rose-500 to-pink-600" },
  { id: "body-aware", title: "Body Awareness Walk", duration: 12, steps: ["Scan from feet upward as you walk", "Notice hip movement and rotation", "Feel arms swinging naturally", "Observe head and neck position", "Integrate full-body awareness"], gradient: "from-cyan-500 to-teal-600" },
  { id: "breath-sync", title: "Breath-Synced Walk", duration: 10, steps: ["Inhale for 4 steps", "Hold for 2 steps", "Exhale for 6 steps", "Rest for 2 steps", "Repeat with natural rhythm"], gradient: "from-amber-500 to-orange-600" },
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
      // Simulate step counting
      setStepCount(prev => prev + (Math.random() > 0.3 ? 1 : 0));
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive, selectedTech, sessions]);

  // Rotate cue
  useEffect(() => {
    if (!isActive || !selectedTech) return;
    const i = setInterval(() => {
      setCurrentStepIdx(prev => (prev + 1) % selectedTech.steps.length);
    }, 15000);
    return () => clearInterval(i);
  }, [isActive, selectedTech]);

  const reset = () => { setIsActive(false); setElapsed(0); setStepCount(0); setCurrentStepIdx(0); };
  const formatTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;
  const progressPct = selectedTech ? (elapsed / (selectedTech.duration * 60)) * 100 : 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Hero */}
        <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${selectedEnv.gradient} p-6 text-white`}>
          <div className="absolute inset-0">
            <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-4 left-8 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm"><Footprints className="w-5 h-5" /></div>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Mindful Movement</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Walking Meditation</h1>
            <p className="text-sm text-white/80">Transform every step into a meditation. Move with intention, breathe with purpose.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Sessions", value: sessions, icon: MapPin, gradient: "from-violet-500 to-purple-600" },
            { label: "Steps Today", value: stepCount, icon: Footprints, gradient: "from-emerald-500 to-green-600" },
            { label: "Minutes", value: Math.floor(elapsed / 60), icon: Clock, gradient: "from-amber-500 to-orange-600" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl bg-gradient-to-br ${s.gradient} p-3 text-white text-center`}>
              <s.icon className="w-4 h-4 mx-auto mb-1 opacity-80" />
              <div className="text-lg font-bold">{s.value}</div>
              <div className="text-[9px] uppercase tracking-wider opacity-70">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Environment Selector */}
        <div>
          <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
            <TreePine className="w-4 h-4 text-emerald-600" /> Choose Your Path
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {environments.map(env => (
              <button
                key={env.id}
                onClick={() => setSelectedEnv(env)}
                className={`rounded-xl bg-gradient-to-br ${env.gradient} p-3.5 text-white text-left transition-all ${
                  selectedEnv.id === env.id ? "ring-2 ring-white/50 scale-[1.03] shadow-lg" : "opacity-80 hover:opacity-100"
                }`}
              >
                <env.icon className="w-5 h-5 mb-1.5 opacity-80" />
                <p className="text-xs font-bold">{env.label}</p>
                <p className="text-[10px] text-white/70 leading-tight mt-0.5">{env.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Active Session */}
        {selectedTech && isActive && (
          <div className={`rounded-2xl bg-gradient-to-br ${selectedTech.gradient} p-5 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
            <div className="relative z-10 space-y-4">
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-white/60 mb-1">Current Cue</p>
                <p className="text-lg font-bold leading-snug">{selectedTech.steps[currentStepIdx]}</p>
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold font-mono">{formatTime(elapsed)}</span>
                <span className="text-sm text-white/60 ml-2">/ {selectedTech.duration}:00</span>
              </div>
              <Progress value={progressPct} className="h-2 bg-white/20" />
              <div className="flex items-center justify-center gap-4">
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={() => setIsActive(false)}>
                  <Pause className="w-5 h-5" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={reset}>
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex justify-center gap-4 text-xs text-white/60">
                <span className="flex items-center gap-1"><Footprints className="w-3 h-3" /> {stepCount} steps</span>
                <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> ~{Math.round(stepCount * 0.04)} cal</span>
              </div>
            </div>
          </div>
        )}

        {/* Technique Cards */}
        <div>
          <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" /> Walking Techniques
          </h3>
          <div className="space-y-3">
            {techniques.map(tech => (
              <button
                key={tech.id}
                onClick={() => { setSelectedTech(tech); reset(); }}
                className={`w-full rounded-xl bg-gradient-to-r ${tech.gradient} p-4 text-white text-left relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl ${
                  selectedTech?.id === tech.id ? "ring-2 ring-white/40" : ""
                }`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 blur-xl" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm">{tech.title}</h4>
                    <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full">{tech.duration} min</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tech.steps.slice(0, 3).map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10">{s}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        {selectedTech && !isActive && (
          <Button onClick={() => { reset(); setIsActive(true); }} className={`w-full h-14 bg-gradient-to-r ${selectedTech.gradient} text-white text-lg font-bold shadow-xl hover:shadow-2xl`}>
            <Play className="w-5 h-5 mr-2" /> Begin {selectedTech.title}
          </Button>
        )}

        {/* Completion */}
        {selectedTech && !isActive && elapsed > 0 && elapsed >= selectedTech.duration * 60 && (
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-6 text-white text-center">
            <div className="text-4xl mb-2">🚶‍♂️✨</div>
            <h3 className="text-xl font-bold mb-1">Walk Complete!</h3>
            <p className="text-sm text-white/80">{stepCount} mindful steps · {selectedTech.duration} minutes of presence</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

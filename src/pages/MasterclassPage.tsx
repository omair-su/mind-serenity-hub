import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Lock, Star, Clock, Award, BookOpen, Brain, Heart, Sparkles, ChevronRight, Users, Zap } from "lucide-react";

interface Masterclass {
  id: string;
  title: string;
  instructor: string;
  role: string;
  duration: string;
  lessons: number;
  gradient: string;
  icon: React.ElementType;
  topics: string[];
  level: string;
  rating: number;
  students: string;
  unlocked: boolean;
}

const masterclasses: Masterclass[] = [
  {
    id: "neuroscience", title: "Neuroscience of Meditation", instructor: "Dr. Sarah Chen",
    role: "Neuroscientist, Stanford", duration: "4h 30m", lessons: 12,
    gradient: "from-violet-600 via-purple-600 to-indigo-700", icon: Brain,
    topics: ["Default Mode Network", "Neuroplasticity", "Gamma Waves", "Amygdala Regulation"],
    level: "Intermediate", rating: 4.9, students: "12.4K", unlocked: true,
  },
  {
    id: "breathwork", title: "Advanced Breathwork Mastery", instructor: "James Nestor",
    role: "Author & Researcher", duration: "3h 15m", lessons: 10,
    gradient: "from-cyan-600 via-teal-600 to-emerald-700", icon: Zap,
    topics: ["Box Breathing", "Wim Hof Method", "Pranayama", "Tummo"],
    level: "Advanced", rating: 4.8, students: "8.7K", unlocked: true,
  },
  {
    id: "compassion", title: "The Art of Self-Compassion", instructor: "Dr. Kristin Neff",
    role: "Psychologist, UT Austin", duration: "3h 45m", lessons: 9,
    gradient: "from-rose-600 via-pink-600 to-fuchsia-700", icon: Heart,
    topics: ["Inner Critic Work", "Loving-Kindness", "Emotional Resilience", "Metta Practice"],
    level: "All Levels", rating: 4.9, students: "15.2K", unlocked: true,
  },
  {
    id: "sleep", title: "Sleep Science & Deep Rest", instructor: "Dr. Matthew Walker",
    role: "Sleep Scientist, Berkeley", duration: "5h 00m", lessons: 14,
    gradient: "from-indigo-600 via-blue-700 to-slate-800", icon: Star,
    topics: ["Sleep Architecture", "Yoga Nidra", "NSDR", "Circadian Rhythm"],
    level: "Beginner", rating: 4.9, students: "22.1K", unlocked: false,
  },
  {
    id: "flow", title: "Flow States & Peak Performance", instructor: "Steven Kotler",
    role: "Flow Researcher", duration: "4h 00m", lessons: 11,
    gradient: "from-amber-500 via-orange-600 to-red-600", icon: Sparkles,
    topics: ["Flow Triggers", "Transient Hypofrontality", "Deep Work", "Challenge-Skill Balance"],
    level: "Intermediate", rating: 4.7, students: "9.3K", unlocked: false,
  },
  {
    id: "wisdom", title: "Ancient Wisdom, Modern Mind", instructor: "Sharon Salzberg",
    role: "Meditation Teacher, 50+ yrs", duration: "6h 15m", lessons: 16,
    gradient: "from-emerald-600 via-green-700 to-teal-800", icon: BookOpen,
    topics: ["Buddhist Psychology", "Mindfulness Roots", "Vipassana", "Zen Koan Practice"],
    level: "All Levels", rating: 5.0, students: "18.5K", unlocked: false,
  },
];

export default function MasterclassPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [progress] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem("wv-masterclass-progress") || "{}"); } catch { return {}; }
  });

  const activeMC = masterclasses.find(m => m.id === selected);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-violet-900 to-indigo-900 p-6 text-white">
          <div className="absolute inset-0">
            <div className="absolute top-4 right-8 w-40 h-40 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="absolute bottom-4 left-8 w-32 h-32 rounded-full bg-amber-500/15 blur-2xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Premium Series</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Masterclass Hub</h1>
            <p className="text-sm text-white/70">Deep-dive courses taught by world-renowned experts in meditation, neuroscience & well-being.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Courses", value: masterclasses.length, icon: BookOpen, gradient: "from-violet-500 to-purple-600" },
            { label: "Hours", value: "26+", icon: Clock, gradient: "from-amber-500 to-orange-600" },
            { label: "Experts", value: masterclasses.length, icon: Users, gradient: "from-emerald-500 to-green-600" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl bg-gradient-to-br ${s.gradient} p-3 text-white text-center`}>
              <s.icon className="w-4 h-4 mx-auto mb-1 opacity-80" />
              <div className="text-lg font-bold">{s.value}</div>
              <div className="text-[9px] uppercase tracking-wider opacity-70">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Detail View */}
        {activeMC && (
          <div className={`rounded-2xl bg-gradient-to-br ${activeMC.gradient} p-5 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <button onClick={() => setSelected(null)} className="text-xs text-white/60 hover:text-white mb-3 block">← Back</button>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <activeMC.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-lg leading-tight">{activeMC.title}</h2>
                  <p className="text-xs text-white/70">{activeMC.instructor} · {activeMC.role}</p>
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="px-2 py-1 rounded-full bg-white/15">{activeMC.lessons} lessons</span>
                <span className="px-2 py-1 rounded-full bg-white/15">{activeMC.duration}</span>
                <span className="px-2 py-1 rounded-full bg-white/15">⭐ {activeMC.rating}</span>
              </div>
              <div>
                <p className="text-xs text-white/70 uppercase tracking-wider mb-2">Topics covered</p>
                <div className="flex flex-wrap gap-2">
                  {activeMC.topics.map(t => (
                    <span key={t} className="text-xs px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">{t}</span>
                  ))}
                </div>
              </div>
              {progress[activeMC.id] && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{progress[activeMC.id]}%</span>
                  </div>
                  <Progress value={progress[activeMC.id]} className="h-2 bg-white/20" />
                </div>
              )}
              <Button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/20 text-white">
                {activeMC.unlocked ? <><Play className="w-4 h-4 mr-2" /> Start Learning</> : <><Lock className="w-4 h-4 mr-2" /> Unlock Course</>}
              </Button>
            </div>
          </div>
        )}

        {/* Course Cards */}
        {!activeMC && (
          <div className="space-y-3">
            {masterclasses.map(mc => (
              <button
                key={mc.id}
                onClick={() => setSelected(mc.id)}
                className={`w-full rounded-xl bg-gradient-to-r ${mc.gradient} p-4 text-white text-left relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 blur-xl" />
                <div className="relative z-10 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                    <mc.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{mc.title}</h3>
                    <p className="text-[11px] text-white/70">{mc.instructor} · {mc.duration}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-white/60">
                      <span>⭐ {mc.rating}</span>
                      <span>·</span>
                      <span>{mc.students} students</span>
                      <span>·</span>
                      <span>{mc.level}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!mc.unlocked && <Lock className="w-3.5 h-3.5 text-white/50" />}
                    <ChevronRight className="w-4 h-4 text-white/50" />
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

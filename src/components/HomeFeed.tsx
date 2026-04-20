import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Sun, Moon, Cloud, Wind, Heart, Brain, Headphones, BookOpen, Leaf,
  Sparkles, ArrowRight, Music, Zap, Play, Coffee, Wand2
} from "lucide-react";
import { getProfile, getCurrentStreak, getCompletedDays, getNextDay, getMoods } from "@/lib/userStore";
import { supabase } from "@/integrations/supabase/client";

interface AIRec {
  label: string;
  reason: string;
  path: string;
  emoji: string;
  category: string;
}

type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

function getTimeOfDay(): TimeOfDay {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

const timeConfig: Record<TimeOfDay, {
  greeting: string; icon: typeof Sun; gradient: string;
  quickActions: { label: string; desc: string; path: string; icon: typeof Sun; emoji: string }[];
}> = {
  morning: {
    greeting: "Rise & shine",
    icon: Sun,
    gradient: "from-[hsl(var(--gold))]/15 via-[hsl(var(--gold-light))]/10 to-[hsl(var(--cream))]/5",
    quickActions: [
      { label: "Morning Breathwork", desc: "Energize your day", path: "/app/breathing", icon: Wind, emoji: "🌅" },
      { label: "Daily Intention", desc: "Set your focus", path: "/app/gratitude", icon: Sparkles, emoji: "✨" },
      { label: "Focus Session", desc: "Peak clarity", path: "/app/focus", icon: Brain, emoji: "🧠" },
      { label: "Walking Meditation", desc: "Mindful movement", path: "/app/walking", icon: Coffee, emoji: "🚶" },
    ],
  },
  afternoon: {
    greeting: "Stay centered",
    icon: Cloud,
    gradient: "from-[hsl(var(--sage))]/12 via-[hsl(var(--forest))]/8 to-[hsl(var(--cream))]/5",
    quickActions: [
      { label: "Stress Relief", desc: "Quick calm", path: "/app/sos", icon: Heart, emoji: "💆" },
      { label: "Focus Mode", desc: "Deep work reset", path: "/app/focus", icon: Brain, emoji: "⚡" },
      { label: "Body Scan", desc: "Release tension", path: "/app/body-scan", icon: Leaf, emoji: "🧘" },
      { label: "Sound Bath", desc: "Frequency healing", path: "/app/sound-bath", icon: Music, emoji: "🔔" },
    ],
  },
  evening: {
    greeting: "Wind down gently",
    icon: Moon,
    gradient: "from-[hsl(var(--forest-deep))]/12 via-[hsl(var(--forest))]/8 to-[hsl(var(--sage))]/5",
    quickActions: [
      { label: "Sleep Meditation", desc: "Drift off peacefully", path: "/app/sleep", icon: Moon, emoji: "🌙" },
      { label: "Gratitude Journal", desc: "Reflect on today", path: "/app/gratitude", icon: Heart, emoji: "🙏" },
      { label: "Sleep Stories", desc: "Calming narratives", path: "/app/sleep-stories", icon: BookOpen, emoji: "📖" },
      { label: "Soundscapes", desc: "Nature ambience", path: "/app/soundscape-builder", icon: Headphones, emoji: "🎧" },
    ],
  },
  night: {
    greeting: "Time for rest",
    icon: Moon,
    gradient: "from-[hsl(var(--forest-deep))]/15 via-[hsl(var(--charcoal))]/10 to-[hsl(var(--forest))]/5",
    quickActions: [
      { label: "Sleep Stories", desc: "Drift away", path: "/app/sleep-stories", icon: BookOpen, emoji: "📖" },
      { label: "Deep Sleep", desc: "Guided relaxation", path: "/app/sleep", icon: Moon, emoji: "💤" },
      { label: "Sound Bath", desc: "Healing tones", path: "/app/sound-bath", icon: Music, emoji: "🔔" },
      { label: "Soundscapes", desc: "White noise", path: "/app/soundscape-builder", icon: Headphones, emoji: "🌊" },
    ],
  },
};

export default function HomeFeed() {
  const tod = getTimeOfDay();
  const config = timeConfig[tod];
  const profile = getProfile();
  const streak = getCurrentStreak();
  const completed = getCompletedDays();
  const nextDay = getNextDay();
  const moods = getMoods();
  const TimeIcon = config.icon;

  // AI personalized recommendations from edge function
  const [aiRecs, setAiRecs] = useState<AIRec[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `wv-ai-recs-${tod}-${completed.length}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        setAiRecs(JSON.parse(cached));
        return;
      } catch {}
    }

    setAiLoading(true);
    const recentMood = moods.length > 0 ? moods[moods.length - 1].after : undefined;
    supabase.functions
      .invoke("personalize-feed", {
        body: {
          goals: profile.goals ?? [],
          experience: profile.experience,
          completedDays: completed.length,
          recentMood,
          timeOfDay: tod,
          recentTracks: [],
        },
      })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data?.recommendations) {
          setAiRecs([]);
        } else {
          setAiRecs(data.recommendations);
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(data.recommendations));
          } catch {}
        }
      })
      .catch(() => setAiRecs([]))
      .finally(() => !cancelled && setAiLoading(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tod, completed.length]);

  // Smart recommendations based on user data
  const recommendations: { label: string; reason: string; path: string; emoji: string }[] = [];

  if (completed.length === 0) {
    recommendations.push({ label: "Start Your Journey", reason: "Begin Day 1 of mindfulness", path: `/day/${nextDay}`, emoji: "🚀" });
  } else if (completed.length < 30) {
    recommendations.push({ label: `Continue Day ${nextDay}`, reason: `${30 - completed.length} sessions left`, path: `/day/${nextDay}`, emoji: "📚" });
  }

  if (moods.length > 3) {
    const avgMood = moods.slice(-5).reduce((a, m) => a + m.after, 0) / Math.min(moods.length, 5);
    if (avgMood < 6) {
      recommendations.push({ label: "Mood Booster", reason: "Based on recent mood trends", path: "/app/sos", emoji: "💛" });
    }
  }

  if (streak >= 3 && streak < 7) {
    recommendations.push({ label: "Keep Your Streak!", reason: `${7 - streak} days to Week Warrior`, path: `/day/${nextDay}`, emoji: "🔥" });
  }

  if (profile.goals?.includes("sleep")) {
    recommendations.push({ label: "Sleep Better Tonight", reason: "Matched to your goals", path: "/app/sleep", emoji: "😴" });
  }

  if (profile.goals?.includes("focus")) {
    recommendations.push({ label: "Sharpen Focus", reason: "Matched to your goals", path: "/app/focus", emoji: "🎯" });
  }

  return (
    <div className="space-y-5">
      {/* Time-aware greeting banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.gradient} border border-border/40 p-5`}
      >
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-[hsl(var(--gold))]/5 blur-xl" />
        <div className="flex items-center gap-2 mb-1">
          <TimeIcon className="w-5 h-5 text-[hsl(var(--gold))]" />
          <span className="text-xs font-body font-semibold text-[hsl(var(--gold))] uppercase tracking-wider">{config.greeting}</span>
        </div>
        <p className="text-sm font-body text-muted-foreground">
          {tod === "morning" && "Start your day with intention and clarity."}
          {tod === "afternoon" && "Take a mindful pause to recharge."}
          {tod === "evening" && "Transition into a peaceful evening."}
          {tod === "night" && "Let go of the day and prepare for deep rest."}
        </p>
      </motion.div>

      {/* Quick actions grid */}
      <div>
        <h3 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[hsl(var(--gold))]" />
          Recommended for {tod === "night" ? "tonight" : `this ${tod}`}
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {config.quickActions.map((action, i) => (
            <motion.div
              key={action.path + action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <Link
                to={action.path}
                className="group flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border/40 hover:border-[hsl(var(--gold))]/20 hover:shadow-[var(--shadow-soft-val)] transition-all duration-300"
              >
                <span className="text-xl">{action.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs font-semibold text-foreground truncate">{action.label}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{action.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI-driven recommendations (smart, local heuristics) */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Personalized for you
          </h3>
          <div className="space-y-2">
            {recommendations.slice(0, 3).map((rec, i) => (
              <motion.div
                key={rec.path + rec.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Link
                  to={rec.path}
                  className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-border/30 hover:border-primary/20 transition-all"
                >
                  <span className="text-lg">{rec.emoji}</span>
                  <div className="flex-1">
                    <p className="font-body text-sm font-semibold text-foreground">{rec.label}</p>
                    <p className="font-body text-[11px] text-muted-foreground">{rec.reason}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* AI-powered: "Because you..." section */}
      {(aiLoading || aiRecs.length > 0) && (
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-[hsl(var(--gold))]" />
            Hand-picked by your AI coach
          </h3>
          {aiLoading && aiRecs.length === 0 ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-secondary/40 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {aiRecs.map((rec, i) => (
                <motion.div
                  key={rec.path + rec.label + i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <Link
                    to={rec.path}
                    className="group flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-[hsl(var(--gold))]/8 via-card to-transparent border border-[hsl(var(--gold))]/20 hover:border-[hsl(var(--gold))]/40 hover:shadow-[var(--shadow-soft-val)] transition-all"
                  >
                    <span className="text-xl">{rec.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-semibold text-foreground truncate">{rec.label}</p>
                      <p className="font-body text-[11px] text-muted-foreground italic">{rec.reason}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[hsl(var(--gold))] group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

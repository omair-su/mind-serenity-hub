import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import {
  BookOpen, Wind, Moon, Brain, Heart, Flame, Trophy, Target,
  Music, Headphones, Zap, Clock, MessageCircle, Leaf, Sparkles,
  Download, HelpCircle, Award, BarChart3, Compass, Palette,
  AlertTriangle, BookHeart, Sunrise
} from "lucide-react";

const categories = [
  {
    title: "Mindfulness",
    accent: "from-[hsl(var(--forest))]/15 to-[hsl(var(--sage-light))]/30",
    items: [
      { label: "Library", desc: "All 30 sessions", icon: BookOpen, path: "/app/library" },
      { label: "Journal", desc: "Reflection diary", icon: BookHeart, path: "/app/journal" },
      { label: "Mood Tracker", desc: "Track your moods", icon: Heart, path: "/app/mood" },
      { label: "Gratitude", desc: "Gratitude garden", icon: Sunrise, path: "/app/gratitude" },
      { label: "Affirmations", desc: "Daily mantras", icon: Sparkles, path: "/app/affirmations" },
    ],
  },
  {
    title: "Movement & Body",
    accent: "from-[hsl(var(--sage-dark))]/15 to-[hsl(var(--sage-light))]/30",
    items: [
      { label: "Body Scan", desc: "Full-body awareness", icon: Target, path: "/app/body-scan" },
      { label: "Walking", desc: "Mindful walking", icon: Leaf, path: "/app/walking" },
      { label: "Breathing", desc: "Breath exercises", icon: Wind, path: "/app/breathing" },
    ],
  },
  {
    title: "Sleep & Relaxation",
    accent: "from-[hsl(var(--forest-deep))]/15 to-[hsl(var(--forest-mid))]/20",
    items: [
      { label: "Sleep", desc: "Sleep meditations", icon: Moon, path: "/app/sleep" },
      { label: "Sleep Stories", desc: "Narrated tales", icon: BookOpen, path: "/app/sleep-stories" },
      { label: "Sound Bath", desc: "Healing sounds", icon: Music, path: "/app/sound-bath" },
      { label: "Soundscapes", desc: "Build your mix", icon: Palette, path: "/app/soundscape-builder" },
      { label: "Focus Mode", desc: "Deep work", icon: Zap, path: "/app/focus" },
    ],
  },
  {
    title: "Growth",
    accent: "from-[hsl(var(--gold))]/15 to-[hsl(var(--gold-light))]/25",
    items: [
      { label: "Challenges", desc: "Weekly goals", icon: Flame, path: "/app/challenges" },
      { label: "Rituals", desc: "Daily routines", icon: Compass, path: "/app/rituals" },
      { label: "AI Coach", desc: "Personal guide", icon: MessageCircle, path: "/app/coach" },
      { label: "Achievements", desc: "Your badges", icon: Trophy, path: "/app/achievements" },
      { label: "Analytics", desc: "Your progress", icon: BarChart3, path: "/app/analytics" },
      { label: "AI Insights", desc: "Smart picks", icon: Brain, path: "/app/ai-recommendations" },
    ],
  },
  {
    title: "Tools",
    accent: "from-[hsl(var(--charcoal-soft))]/12 to-[hsl(var(--cream-dark))]/30",
    items: [
      { label: "Timer", desc: "Custom timer", icon: Clock, path: "/app/timer" },
      { label: "SOS Relief", desc: "Quick calm", icon: AlertTriangle, path: "/app/sos" },
      { label: "Downloads", desc: "Offline access", icon: Download, path: "/app/offline-downloads" },
      { label: "Resources", desc: "Learn more", icon: HelpCircle, path: "/app/resources" },
      { label: "Certificate", desc: "Your proof", icon: Award, path: "/app/certificate" },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function ExplorePage() {
  return (
    <AppLayout>
      <motion.div
        className="space-y-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Editorial hero */}
        <motion.div variants={sectionVariants} className="relative overflow-hidden rounded-3xl border border-[hsl(var(--gold))]/20 bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--forest-mid))] px-6 py-10 sm:px-10 sm:py-14">
          <div className="absolute inset-0 opacity-25 pointer-events-none" style={{
            background: "radial-gradient(circle at 80% 20%, hsl(var(--gold) / 0.4) 0%, transparent 50%), radial-gradient(circle at 10% 90%, hsl(var(--sage) / 0.3) 0%, transparent 50%)"
          }} />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(var(--gold))]/15 border border-[hsl(var(--gold))]/30 text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-[hsl(var(--gold-light))]">
              <Compass className="w-3 h-3" /> The Library
            </span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold text-[hsl(var(--cream))] leading-[1.05]">
              Explore your<br/>practice
            </h1>
            <p className="mt-3 font-body text-sm sm:text-base text-[hsl(var(--cream))]/75 max-w-md leading-relaxed">
              Every tool, ritual, and meditation — curated into a calm, considered space.
            </p>
          </div>
        </motion.div>

        {categories.map((cat) => (
          <motion.section key={cat.title} variants={sectionVariants}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-[hsl(var(--gold))]/40 to-transparent" />
              <h2 className="font-display text-[11px] font-bold text-[hsl(var(--forest))] uppercase tracking-[0.25em]">
                {cat.title}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-[hsl(var(--gold))]/40 to-transparent" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {cat.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative overflow-hidden flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${cat.accent} border border-[hsl(var(--gold))]/15 hover:border-[hsl(var(--gold))]/40 hover:shadow-[var(--shadow-card-val)] hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-[hsl(var(--gold))]/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                  <div className="relative w-12 h-12 rounded-2xl bg-[hsl(var(--cream))]/80 backdrop-blur-sm border border-[hsl(var(--gold))]/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <item.icon className="w-5 h-5 text-[hsl(var(--forest))]" />
                  </div>
                  <span className="relative font-display text-xs font-semibold text-[hsl(var(--charcoal))] text-center leading-tight">
                    {item.label}
                  </span>
                  <span className="relative text-[10px] font-body text-[hsl(var(--charcoal-soft))] text-center leading-tight">
                    {item.desc}
                  </span>
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </motion.div>
    </AppLayout>
  );
}

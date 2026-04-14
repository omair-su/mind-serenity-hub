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
    items: [
      { label: "Body Scan", desc: "Full-body awareness", icon: Target, path: "/app/body-scan" },
      { label: "Walking", desc: "Mindful walking", icon: Leaf, path: "/app/walking" },
      { label: "Breathing", desc: "Breath exercises", icon: Wind, path: "/app/breathing" },
    ],
  },
  {
    title: "Sleep & Relaxation",
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ExplorePage() {
  return (
    <AppLayout>
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={sectionVariants}>
          <h1 className="font-display text-2xl font-bold text-foreground">Explore</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            All your wellness tools in one place
          </p>
        </motion.div>

        {categories.map((cat) => (
          <motion.section key={cat.title} variants={sectionVariants}>
            <h2 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-[0.15em] mb-3">
              {cat.title}
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              {cat.items.map((item, i) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card border border-border/40 hover:border-primary/30 hover:shadow-[var(--shadow-card-val)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-[hsl(var(--sage))]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-display text-xs font-semibold text-foreground text-center leading-tight">
                    {item.label}
                  </span>
                  <span className="text-[9px] font-body text-muted-foreground text-center leading-tight">
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

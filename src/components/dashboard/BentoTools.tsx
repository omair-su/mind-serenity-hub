// Bento-style tool grid: one rotating featured tile + standard tiles.
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart, Music, Flame, BookOpen, MessageCircle, Zap, Leaf, Clock, ArrowRight, ChevronRight,
} from "lucide-react";

const allTools = [
  { label: "AI Coach", desc: "A personalised conversation with your guide", icon: MessageCircle, path: "/app/coach" },
  { label: "Body Scan", desc: "Release tension from head to toe", icon: Heart, path: "/app/body-scan" },
  { label: "Sound Bath", desc: "Layered binaural soundscapes", icon: Music, path: "/app/sound-bath" },
  { label: "Challenges", desc: "Multi-day themed journeys", icon: Flame, path: "/app/challenges" },
  { label: "Journal", desc: "Capture today in your own words", icon: BookOpen, path: "/app/journal" },
  { label: "Focus", desc: "Deep work flow sessions", icon: Zap, path: "/app/focus" },
  { label: "Gratitude", desc: "Cultivate a thankful mind", icon: Leaf, path: "/app/gratitude" },
  { label: "Timer", desc: "Silent meditation timer", icon: Clock, path: "/app/timer" },
];

// Daily rotation: index based on day-of-year so it changes once per day
const featuredIndex = () => {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const day = Math.floor((new Date().getTime() - start.getTime()) / 86400000);
  return day % allTools.length;
};

export default function BentoTools() {
  const idx = featuredIndex();
  const featured = allTools[idx];
  const rest = allTools.filter((_, i) => i !== idx);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-display text-base sm:text-lg font-bold text-foreground tracking-tight">
          Your Toolkit
        </h3>
        <Link to="/app/explore" className="flex items-center gap-1 text-xs font-body text-[hsl(var(--forest))] hover:underline">
          See all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {/* Featured (spans 2 cols on mobile, 2 on desktop) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="col-span-3 sm:col-span-2 row-span-2"
        >
          <Link
            to={featured.path}
            className="group relative flex flex-col h-full p-5 rounded-2xl bg-gradient-to-br from-[hsl(var(--forest))] to-[hsl(var(--forest-deep))] text-white border border-[hsl(var(--forest-deep))] shadow-[var(--shadow-card-val)] hover:shadow-[var(--shadow-elevated-val)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-[hsl(var(--gold))]/15 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 rounded-tl-full bg-[hsl(var(--gold))]/8" />
            <span className="relative text-[9px] font-body font-bold uppercase tracking-[0.22em] text-[hsl(var(--gold-light))]">
              Featured today
            </span>
            <div className="relative w-12 h-12 rounded-2xl bg-white/12 backdrop-blur-sm flex items-center justify-center mt-3">
              <featured.icon className="w-6 h-6 text-[hsl(var(--gold-light))]" />
            </div>
            <p className="relative font-display text-xl font-bold mt-3">{featured.label}</p>
            <p className="relative text-xs font-body text-white/70 mt-1.5 leading-relaxed flex-1">
              {featured.desc}
            </p>
            <div className="relative inline-flex items-center gap-1.5 mt-4 text-xs font-body font-semibold text-[hsl(var(--gold-light))] group-hover:gap-2.5 transition-all">
              Open <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </motion.div>

        {/* Standard tiles */}
        {rest.map((tool, i) => (
          <motion.div
            key={tool.path}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 + i * 0.04, duration: 0.4 }}
          >
            <Link
              to={tool.path}
              className="group flex flex-col items-center justify-center gap-1.5 p-3 h-full rounded-2xl bg-card border border-[hsl(var(--cream-dark))] hover:border-[hsl(var(--gold))]/40 hover:shadow-[var(--shadow-card-val)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--sage-light))] to-[hsl(var(--cream))] flex items-center justify-center group-hover:scale-105 transition-transform">
                <tool.icon className="w-5 h-5 text-[hsl(var(--forest))]" />
              </div>
              <span className="font-display text-[10px] sm:text-[11px] font-semibold text-foreground text-center leading-tight">
                {tool.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

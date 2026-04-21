// Premium wellness ring with breathing dash animation and 4-axis radar reveal on tap.
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Brain, Heart, Moon, Sparkles, ChevronDown } from "lucide-react";
import type { WellnessBreakdown } from "@/lib/wellnessScore";

interface Props {
  wellness: WellnessBreakdown;
  level: { label: string; description: string };
}

const tierColor = (label: string) => {
  if (label === "Flourishing") return "text-[hsl(var(--gold-dark))]";
  if (label === "Growing") return "text-[hsl(var(--forest))]";
  if (label === "Developing") return "text-[hsl(var(--gold))]";
  if (label === "Awakening") return "text-[hsl(var(--sage-dark))]";
  return "text-muted-foreground";
};

export default function WellnessRing({ wellness, level }: Props) {
  const [expanded, setExpanded] = useState(false);
  const pct = wellness.total;
  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (pct / 100) * circumference;

  const axes = [
    { key: "Mind", value: wellness.engagement, Icon: Brain },
    { key: "Body", value: wellness.depth, Icon: Sparkles },
    { key: "Sleep", value: wellness.consistency, Icon: Moon },
    { key: "Heart", value: wellness.mood, Icon: Heart },
  ];

  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-3xl border border-[hsl(var(--cream-dark))] bg-card shadow-[var(--shadow-soft-val)]"
    >
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[hsl(var(--gold))]/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-[hsl(var(--sage))]/15 blur-3xl pointer-events-none" />

      <button
        onClick={() => setExpanded(e => !e)}
        className="relative w-full text-left p-5 sm:p-6 flex items-center gap-5"
        aria-expanded={expanded}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0"
        >
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="wv-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--forest))" />
                <stop offset="55%" stopColor="hsl(var(--sage-dark))" />
                <stop offset="100%" stopColor="hsl(var(--gold))" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
            <motion.circle
              cx="60" cy="60" r="50" fill="none"
              stroke="url(#wv-ring-gradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ delay: 0.4, duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="drop-shadow-[0_0_8px_hsl(var(--gold)/0.35)]"
            />
            {/* Subtle "breath" pulse */}
            <motion.circle
              cx="60" cy="60" r="50" fill="none"
              stroke="hsl(var(--gold))"
              strokeWidth="1"
              strokeDasharray="2 6"
              opacity={0.25}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "60px 60px" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-none">{pct}</span>
            <span className="text-[8px] font-body font-bold text-muted-foreground uppercase tracking-[0.2em] mt-0.5">
              Wellness
            </span>
          </div>
        </motion.div>

        <div className="flex-1 min-w-0">
          <p className={`font-display text-lg font-bold ${tierColor(level.label)} leading-tight`}>
            {level.label}
          </p>
          <p className="text-xs sm:text-sm font-body text-muted-foreground mt-1 leading-relaxed">
            {level.description}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-body text-[hsl(var(--forest))]/70">
            <span>{expanded ? "Hide breakdown" : "Tap for breakdown"}</span>
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.span>
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative overflow-hidden border-t border-[hsl(var(--cream-dark))]"
          >
            <div className="grid grid-cols-2 gap-3 p-5">
              {axes.map((a, i) => (
                <motion.div
                  key={a.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.06 }}
                  className="rounded-2xl bg-[hsl(var(--sage-light))]/40 p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <a.Icon className="w-3.5 h-3.5 text-[hsl(var(--forest))]" />
                      <span className="text-[10px] font-body font-bold text-[hsl(var(--forest))] uppercase tracking-wider">
                        {a.key}
                      </span>
                    </div>
                    <span className="font-display text-sm font-bold text-foreground">{a.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/60 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${a.value}%` }}
                      transition={{ delay: 0.15 + i * 0.06, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--forest))] via-[hsl(var(--sage-dark))] to-[hsl(var(--gold))]"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

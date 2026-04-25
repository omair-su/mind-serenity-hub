// Three editorial ritual cards (morning / midday / evening) — current period auto-highlighted.
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, CloudSun, Moon, ArrowRight } from "lucide-react";

const rituals = [
  {
    key: "morning",
    label: "Morning",
    title: "Set the Tone",
    copy: "A grounding intention to begin the day with clarity.",
    Icon: Sun,
    to: "/day/1",
    bg: "bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--gold-light))]/30",
    accent: "text-[hsl(var(--gold-dark))]",
    hours: [4, 11],
  },
  {
    key: "midday",
    label: "Midday",
    title: "Reset & Breathe",
    copy: "A 3-minute pause to release tension and refocus.",
    Icon: CloudSun,
    to: "/app/breathing",
    bg: "bg-gradient-to-br from-[hsl(var(--sage-light))] to-[hsl(var(--sage))]/40",
    accent: "text-[hsl(var(--forest))]",
    hours: [11, 17],
  },
  {
    key: "evening",
    label: "Evening",
    title: "Soft Landing",
    copy: "A gentle wind-down ritual to invite restful sleep.",
    Icon: Moon,
    to: "/app/sleep",
    bg: "bg-gradient-to-br from-[hsl(var(--forest-deep))] to-[hsl(var(--forest))]/80 text-white",
    accent: "text-[hsl(var(--gold-light))]",
    hours: [17, 28],
  },
];

function getActiveKey() {
  const h = new Date().getHours();
  return rituals.find(r => h >= r.hours[0] && h < r.hours[1])?.key ?? "evening";
}

export default function RitualTriptych() {
  const active = getActiveKey();

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-display text-base sm:text-lg font-bold text-foreground tracking-tight">
          Today's Triptych
        </h3>
        <span className="text-[10px] font-body uppercase tracking-[0.2em] text-muted-foreground">
          Three sacred pauses
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {rituals.map((r, i) => {
          const isActive = r.key === active;
          const isDark = r.key === "evening";
          return (
            <motion.div
              key={r.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                to={r.to}
                className={`group relative flex flex-col h-full p-5 rounded-2xl border ${r.bg} ${
                  isActive
                    ? "border-[hsl(var(--gold))] shadow-[var(--shadow-gold-val)] ring-1 ring-[hsl(var(--gold))]/40"
                    : "border-[hsl(var(--cream-dark))] hover:border-[hsl(var(--sage-dark))]/50"
                } transition-all duration-300 hover:-translate-y-0.5 overflow-hidden`}
              >
                {isActive && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))] text-[9px] font-body font-bold uppercase tracking-wider">
                    Now
                  </span>
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  isDark ? "bg-white/10" : "bg-white/70"
                }`}>
                  <r.Icon className={`w-5 h-5 ${r.accent}`} />
                </div>
                <p className={`text-[10px] font-body font-bold uppercase tracking-[0.2em] mb-1 ${
                  isDark ? "text-white/60" : "text-muted-foreground"
                }`}>
                  {r.label}
                </p>
                <p className={`font-display text-base font-bold leading-snug ${
                  isDark ? "text-white" : "text-foreground"
                }`}>
                  {r.title}
                </p>
                <p className={`text-xs font-body mt-1.5 leading-relaxed flex-1 ${
                  isDark ? "text-white/65" : "text-muted-foreground"
                }`}>
                  {r.copy}
                </p>
                <div className={`flex items-center gap-1 mt-3 text-[11px] font-body font-semibold ${r.accent} group-hover:gap-2 transition-all`}>
                  Begin <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

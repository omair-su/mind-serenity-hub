// Cinematic dashboard hero with time-of-day adaptive overlay,
// floating gold particles, parallax drift, and rotating affirmations.
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Play, ArrowRight, Flame, Check, Sun, Leaf, Moon, CloudSun } from "lucide-react";
import dashboardHero from "@/assets/dashboard-hero-premium.jpg";
import { getAffirmationsForToday, type Affirmation } from "@/data/affirmations";

interface HeroCinemaProps {
  greeting: string;
  nextDay: number;
  completedCount: number;
  streak: number;
  todayPracticed: boolean;
  onQuickSession: () => void;
  weatherLabel?: string;
}

function getTimeMeta() {
  const h = new Date().getHours();
  if (h < 6) return { Icon: Moon, overlay: "from-[hsl(220_40%_8%)]/95 via-[hsl(220_30%_15%)]/55 to-transparent", label: "Pre-dawn" };
  if (h < 12) return { Icon: Sun, overlay: "from-[hsl(var(--forest-deep))]/85 via-[hsl(var(--forest))]/30 to-[hsl(var(--gold))]/10", label: "Morning" };
  if (h < 17) return { Icon: Leaf, overlay: "from-[hsl(var(--forest-deep))]/80 via-[hsl(var(--sage-dark))]/30 to-transparent", label: "Afternoon" };
  if (h < 20) return { Icon: CloudSun, overlay: "from-[hsl(var(--forest-deep))]/90 via-[hsl(var(--gold-dark))]/25 to-[hsl(var(--gold))]/15", label: "Dusk" };
  return { Icon: Moon, overlay: "from-[hsl(220_40%_6%)]/95 via-[hsl(var(--forest-deep))]/60 to-transparent", label: "Evening" };
}

export default function HeroCinema({
  greeting, nextDay, completedCount, streak, todayPracticed, onQuickSession, weatherLabel,
}: HeroCinemaProps) {
  const meta = getTimeMeta();
  const affirmations = getAffirmationsForToday(3);
  const [idx, setIdx] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % affirmations.length), 6500);
    return () => clearInterval(t);
  }, [affirmations.length]);

  useEffect(() => {
    const onScroll = () => setScrollY(Math.min(40, window.scrollY * 0.08));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const current: Affirmation = affirmations[idx];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative overflow-hidden rounded-3xl shadow-[var(--shadow-elevated-val)] border border-white/5"
    >
      {/* Parallax image */}
      <motion.img
        src={dashboardHero}
        alt="Zen meditation garden at golden hour"
        className="w-full h-72 sm:h-80 object-cover"
        width={1920}
        height={800}
        style={{ transform: `translateY(${scrollY}px) scale(1.05)` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${meta.overlay}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,hsl(var(--gold))/0.18,transparent_55%)]" />

      {/* Floating gold particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[hsl(var(--gold))]/70 animate-particle"
            style={{
              left: `${(i * 11 + 8) % 95}%`,
              bottom: `${(i * 7) % 50}px`,
              ["--dur" as string]: `${5 + (i % 4)}s`,
              ["--delay" as string]: `${i * 0.7}s`,
              ["--dx" as string]: `${(i % 2 ? 1 : -1) * (10 + i * 2)}px`,
              ["--rot" as string]: `${i * 22}deg`,
            }}
          />
        ))}
      </div>

      {/* Affirmation card top-right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute top-4 right-4 max-w-[210px] sm:max-w-[280px]"
      >
        <div className="backdrop-blur-md bg-white/10 rounded-xl px-3.5 py-3 border border-white/15 shadow-lg">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-1 h-1 rounded-full bg-[hsl(var(--gold))]" />
            <span className="text-[8px] font-body font-bold text-white/70 uppercase tracking-[0.2em]">
              Affirmation
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-display text-[11px] sm:text-xs text-white/95 italic leading-relaxed">
                "{current.text}"
              </p>
              {current.author && (
                <p className="text-[9px] font-body text-[hsl(var(--gold-light))]/80 mt-1">— {current.author}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Bottom content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {streak > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(var(--gold))]/95 text-[10px] sm:text-xs font-body font-bold text-[hsl(var(--charcoal))] shadow-[var(--shadow-gold-val)]"
            >
              <Flame className="w-3.5 h-3.5" /> {streak} Day Streak
            </motion.span>
          )}
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-body font-medium ${
              todayPracticed
                ? "bg-[hsl(var(--forest))]/90 text-white"
                : "backdrop-blur-sm bg-white/15 text-white/85"
            }`}
          >
            {todayPracticed ? (
              <><Check className="w-3 h-3" /> Done today</>
            ) : (
              <><meta.Icon className="w-3 h-3" /> {meta.label}</>
            )}
          </motion.span>
          {weatherLabel && (
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-body backdrop-blur-sm bg-white/15 text-white/85"
            >
              {weatherLabel}
            </motion.span>
          )}
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight tracking-tight"
        >
          {greeting}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-body text-xs sm:text-sm text-white/65 mt-1.5"
        >
          Day {nextDay} of 30 · {30 - completedCount} sessions remaining
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-2.5 mt-5"
        >
          <Link
            to={`/app/day/${nextDay}`}
            className="group relative inline-flex items-center gap-2.5 w-fit px-6 py-3 rounded-xl bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-light))] text-[hsl(var(--charcoal))] font-body font-bold text-sm shadow-[var(--shadow-gold-val)] hover:brightness-110 transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <Play className="w-4 h-4 relative" />
            <span className="relative">{todayPracticed ? "Review Practice" : `Begin Day ${nextDay}`}</span>
            <ArrowRight className="w-4 h-4 relative" />
          </Link>
          <button
            onClick={onQuickSession}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl backdrop-blur-md bg-white/12 border border-white/20 text-white font-body font-semibold text-sm hover:bg-white/20 transition-all"
          >
            <Play className="w-4 h-4" /> Quick Session
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

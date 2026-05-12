// Cinematic dashboard hero with time-of-day adaptive overlay,
// floating gold particles, parallax drift, and rotating affirmations.
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Play, ArrowRight, Flame, Check, Sun, Leaf, Moon } from "lucide-react";
import heroMorning from "@/assets/dashboard-hero-morning.jpg";
import heroAfternoon from "@/assets/dashboard-hero-afternoon.jpg";
import heroEvening from "@/assets/dashboard-hero-evening.jpg";
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
  if (h < 5)  return { Icon: Moon, image: heroEvening,   overlay: "from-[hsl(220_45%_6%)]/85 via-[hsl(220_30%_12%)]/40 to-transparent", label: "Late Night" };
  if (h < 12) return { Icon: Sun,  image: heroMorning,   overlay: "from-[hsl(var(--forest-deep))]/70 via-[hsl(var(--forest))]/15 to-transparent", label: "Morning" };
  if (h < 17) return { Icon: Leaf, image: heroAfternoon, overlay: "from-[hsl(var(--forest-deep))]/65 via-[hsl(var(--sage-dark))]/15 to-transparent", label: "Afternoon" };
  if (h < 20) return { Icon: Sun,  image: heroEvening,   overlay: "from-[hsl(220_45%_8%)]/80 via-[hsl(var(--gold-dark))]/20 to-transparent", label: "Dusk" };
  return         { Icon: Moon, image: heroEvening,   overlay: "from-[hsl(220_45%_5%)]/88 via-[hsl(var(--forest-deep))]/45 to-transparent", label: "Evening" };
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
      {/* Time-of-day adaptive hero */}
      <motion.img
        key={meta.image}
        src={meta.image}
        alt="Calm meditation landscape"
        className="w-full h-72 sm:h-[22rem] object-cover"
        width={1920}
        height={800}
        style={{ transform: `translateY(${scrollY}px) scale(1.05)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${meta.overlay}`} />

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
            to={`/day/${nextDay}`}
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

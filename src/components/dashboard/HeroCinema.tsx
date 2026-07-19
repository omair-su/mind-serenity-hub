// Cinematic dashboard hero — luxurious time-adaptive imagery, gold corner
// filigree, embedded "live now" glass badge, and a marble-style stat strip.
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Play, ArrowRight, Flame, Check, Sun, Leaf, Moon, Sparkles } from "lucide-react";
import heroMorning from "@/assets/dashboard-hero-morning.jpg";
import heroAfternoon from "@/assets/dashboard-hero-afternoon.jpg";
import heroEvening from "@/assets/dashboard-hero-evening.jpg";
import { useLivePresence } from "@/hooks/useLivePresence";

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
  if (h < 5)  return { Icon: Moon, image: heroEvening,   overlay: "from-[hsl(220_45%_5%)]/92 via-[hsl(220_30%_10%)]/55 to-[hsl(220_30%_10%)]/20", label: "Late Night" };
  if (h < 12) return { Icon: Sun,  image: heroMorning,   overlay: "from-[hsl(var(--forest-deep))]/85 via-[hsl(var(--forest))]/35 to-[hsl(var(--forest))]/10", label: "Morning" };
  if (h < 17) return { Icon: Leaf, image: heroAfternoon, overlay: "from-[hsl(var(--forest-deep))]/80 via-[hsl(var(--sage-dark))]/30 to-[hsl(var(--forest))]/10", label: "Afternoon" };
  if (h < 20) return { Icon: Sun,  image: heroEvening,   overlay: "from-[hsl(220_45%_8%)]/88 via-[hsl(var(--gold-dark))]/30 to-[hsl(var(--gold-dark))]/10", label: "Dusk" };
  return         { Icon: Moon, image: heroEvening,   overlay: "from-[hsl(220_45%_4%)]/92 via-[hsl(var(--forest-deep))]/55 to-[hsl(var(--forest-deep))]/15", label: "Evening" };
}

const SOFT_BASELINE = 3214;

export default function HeroCinema({
  greeting, nextDay, completedCount, streak, todayPracticed, onQuickSession, weatherLabel,
}: HeroCinemaProps) {
  const meta = getTimeMeta();
  const [scrollY, setScrollY] = useState(0);
  const liveCount = useLivePresence(SOFT_BASELINE);

  useEffect(() => {
    const onScroll = () => setScrollY(Math.min(40, window.scrollY * 0.08));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative overflow-hidden rounded-[28px] shadow-[var(--shadow-elevated-val)] ring-1 ring-[hsl(var(--gold)/0.18)]"
    >
      {/* Adaptive backdrop */}
      <motion.img
        key={meta.image}
        src={meta.image}
        alt="Calm meditation landscape"
        className="w-full h-[26rem] sm:h-[30rem] md:h-[34rem] object-cover"
        width={1920}
        height={1100}
        style={{ transform: `translateY(${scrollY}px) scale(1.08)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1 }}
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${meta.overlay}`} />
      {/* Top-down vignette for legibility of top chips */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/35 to-transparent pointer-events-none" />
      {/* Subtle film-grain wash */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay [background-image:radial-gradient(circle_at_30%_20%,white,transparent_60%),radial-gradient(circle_at_80%_70%,white,transparent_55%)]" />

      {/* Gold corner filigree */}
      <span aria-hidden className="pointer-events-none absolute top-5 left-5 w-12 h-12 border-l-2 border-t-2 border-[hsl(var(--gold)/0.55)] rounded-tl-2xl" />
      <span aria-hidden className="pointer-events-none absolute top-5 right-5 w-12 h-12 border-r-2 border-t-2 border-[hsl(var(--gold)/0.55)] rounded-tr-2xl" />
      <span aria-hidden className="pointer-events-none absolute bottom-5 left-5 w-12 h-12 border-l-2 border-b-2 border-[hsl(var(--gold)/0.55)] rounded-bl-2xl" />
      <span aria-hidden className="pointer-events-none absolute bottom-5 right-5 w-12 h-12 border-r-2 border-b-2 border-[hsl(var(--gold)/0.55)] rounded-br-2xl" />

      {/* TOP RIGHT — live presence glass badge */}
      <div className="absolute top-6 right-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream/10 border border-cream/20 backdrop-blur-xl"
          aria-live="polite"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--gold-light))] opacity-70 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--gold-light))]" />
          </span>
          <span className="text-[11px] font-body text-cream/90">
            <span className="font-display font-semibold tabular-nums text-cream">
              {liveCount.toLocaleString()}
            </span>{" "}
            <span className="text-cream/65 hidden sm:inline">practising now</span>
            <span className="text-cream/65 sm:hidden">now</span>
          </span>
        </motion.div>
      </div>

      {/* Bottom content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-12">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex items-center gap-2.5 mb-4"
        >
          <span className="h-px w-10 bg-[hsl(var(--gold)/0.65)]" />
          <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--gold-light))]" />
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.32em] uppercase text-[hsl(var(--gold-light))]">
            Willow Vibes · {meta.label}
          </span>
        </motion.div>

        {/* Status chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
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
                ? "bg-[hsl(var(--forest))]/90 text-cream"
                : "backdrop-blur-md bg-cream/12 text-cream/85 border border-cream/15"
            }`}
          >
            {todayPracticed ? (
              <><Check className="w-3 h-3" /> Done today</>
            ) : (
              <><meta.Icon className="w-3 h-3" /> Ready when you are</>
            )}
          </motion.span>
          {weatherLabel && (
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-body backdrop-blur-md bg-cream/12 text-cream/85 border border-cream/15"
            >
              {weatherLabel}
            </motion.span>
          )}
        </div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display text-4xl sm:text-5xl md:text-[60px] font-bold text-cream leading-[1.05] tracking-tight max-w-2xl"
          style={{ textShadow: "0 2px 30px rgba(0,0,0,0.45)" }}
        >
          {greeting}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-body italic text-sm sm:text-base text-cream/80 mt-3 max-w-lg"
        >
          Day {nextDay} of 30 · {30 - completedCount} sessions remaining on your journey home.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-3 mt-7"
        >
          <Link
            to={`/day/${nextDay}`}
            className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-light))] text-[hsl(var(--charcoal))] font-body font-bold text-sm shadow-[var(--shadow-gold-val)] hover:brightness-110 transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            <Play className="w-4 h-4 relative" />
            <span className="relative">{todayPracticed ? "Review Practice" : `Begin Day ${nextDay}`}</span>
            <ArrowRight className="w-4 h-4 relative group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <button
            onClick={onQuickSession}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full backdrop-blur-md bg-cream/10 border border-cream/25 text-cream font-body font-semibold text-sm hover:bg-cream/15 transition-all"
          >
            <Play className="w-4 h-4" /> Quick Session
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

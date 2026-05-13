import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Play, Shield, Sparkles, Wind, Moon, Music2, Brain, LineChart, Flower2,
  Headphones, Pause, Heart,
} from "lucide-react";
import { LogoIcon } from "@/components/WillowLogo";

const NAVY = "#0E2A47";
const CTA_GRADIENT = "linear-gradient(90deg, #5B7FE0 0%, #8267D6 100%)";

interface PremiumHeroProps {
  onWatchDemo?: () => void;
}

/**
 * Premium cinematic landing hero — calm meditation aesthetic.
 * Layered animated background + animated device mockup cycling through feature screens.
 * Self-contained: does not change any other UI on the page.
 */
export default function PremiumHero({ onWatchDemo }: PremiumHeroProps) {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden min-h-[100svh] flex items-center"
      style={{ background: "radial-gradient(120% 80% at 80% 0%, #1b3a6b 0%, #0e2a47 38%, #081a30 70%, #050f1f 100%)" }}
    >
      {/* === Cinematic background layers === */}
      <CinematicBackground />

      {/* === Hero content === */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 pt-28 md:pt-32 pb-16 md:pb-20">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
          {/* LEFT — copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left"
          >
            {/* Eyebrow chip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 border border-white/15 bg-white/[0.06] backdrop-blur-md"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-[#E9D9FF] animate-ping opacity-60" />
                <span className="relative w-2 h-2 rounded-full bg-[#E9D9FF]" />
              </span>
              <span className="font-calm-body text-[11px] tracking-[0.18em] uppercase text-white/85">
                Premium Mindfulness · 2026
              </span>
            </motion.div>

            {/* Logo lockup on mobile */}
            <div className="flex lg:hidden justify-center mb-5">
              <LogoIcon size={64} animated />
            </div>

            {/* Headline */}
            <h1 className="font-calm-display text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-semibold leading-[1.02] tracking-[-0.025em] text-white">
              Quiet the noise.
              <br />
              <span className="italic font-medium bg-gradient-to-r from-[#E9D9FF] via-[#C8B6F0] to-[#9FB8FF] bg-clip-text text-transparent">
                Return to yourself.
              </span>
            </h1>

            {/* Subhead */}
            <p className="font-calm-body text-base sm:text-lg md:text-xl mt-6 max-w-xl mx-auto lg:mx-0 leading-relaxed text-white/80">
              A cinematic 30-day journey of guided meditation, breathwork, sleep stories,
              and ambient sound — designed for stressed, busy minds.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mt-9 justify-center lg:justify-start">
              <Link to="/sign-in?redirect=/app" className="block">
                <button
                  className="group relative w-full sm:w-auto px-9 py-4 rounded-full font-calm-body font-semibold text-base text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
                  style={{ background: CTA_GRADIENT, boxShadow: "0 18px 48px -14px rgba(91,127,224,0.7)" }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Start Free Trial
                  </span>
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(90deg, #6E92F0 0%, #9279E6 100%)" }} />
                </button>
              </Link>
              <button
                onClick={onWatchDemo}
                className="w-full sm:w-auto px-8 py-4 rounded-full font-calm-body font-semibold text-base text-white border border-white/20 bg-white/[0.06] backdrop-blur-md hover:bg-white/[0.12] transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Demo
              </button>
            </div>

            {/* Trust microcopy */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 mt-6 text-xs font-calm-body text-white/70">
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-[#E9D9FF]" /> 7-day free trial</span>
              <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-[#E9D9FF]" /> Cancel anytime</span>
              <span className="hidden sm:flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#E9D9FF]" /> Built for busy minds</span>
            </div>

            {/* Floating feature chips */}
            <div className="flex flex-wrap gap-2 mt-7 justify-center lg:justify-start">
              {[
                { icon: Brain, label: "30-Day Journey" },
                { icon: Wind, label: "Breathwork" },
                { icon: Moon, label: "Sleep Stories" },
                { icon: Music2, label: "Soundscapes" },
                { icon: Sparkles, label: "AI Coach" },
                { icon: Flower2, label: "Daily Calm" },
              ].map(({ icon: I, label }, i) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.06, duration: 0.5 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-calm-body text-white/85 border border-white/10 bg-white/[0.05] backdrop-blur-sm"
                >
                  <I className="w-3 h-3 text-[#C8B6F0]" />
                  {label}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — animated device demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:justify-end"
            id="hero-demo"
          >
            <DeviceMockup />
          </motion.div>
        </div>
      </div>

      {/* Soft bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
    </section>
  );
}

/* ============================================================
   Cinematic background — slow, soothing, layered
   ============================================================ */
function CinematicBackground() {
  return (
    <>
      {/* Aurora orbs (breathing glow) */}
      <motion.div
        aria-hidden
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(130,103,214,0.45) 0%, rgba(130,103,214,0) 60%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.55, 0.8, 0.55] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-[10%] -right-[15%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(91,127,224,0.42) 0%, rgba(91,127,224,0) 60%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(159,184,255,0.32) 0%, rgba(159,184,255,0) 60%)",
          filter: "blur(50px)",
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Slow drifting mist layer */}
      <motion.div
        aria-hidden
        className="absolute inset-0 opacity-[0.18] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 40%), radial-gradient(ellipse at 70% 60%, rgba(233,217,255,0.5) 0%, rgba(255,255,255,0) 45%)",
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
              filter: "blur(0.5px)",
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 12 + (i % 6),
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Subtle grain / vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* Gentle horizon glow */}
      <motion.div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-[40%]"
        style={{
          background:
            "linear-gradient(to top, rgba(130,103,214,0.18) 0%, transparent 100%)",
        }}
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

/* ============================================================
   Device mockup — phone with rotating feature screens
   ============================================================ */
const SCREENS = [
  { key: "meditate", label: "Guided Meditation" },
  { key: "breathe", label: "Breathwork" },
  { key: "sleep", label: "Sleep Stories" },
  { key: "sounds", label: "Soundscapes" },
  { key: "progress", label: "Your Journey" },
] as const;

function DeviceMockup() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SCREENS.length), 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative">
      {/* Halo glow behind device */}
      <motion.div
        aria-hidden
        className="absolute -inset-10 rounded-[60px] -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(130,103,214,0.55) 0%, rgba(91,127,224,0.25) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ opacity: [0.65, 0.95, 0.65], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating accent dots */}
      <motion.div
        className="absolute -top-6 -left-8 w-12 h-12 rounded-full bg-gradient-to-br from-[#E9D9FF] to-[#8267D6] opacity-80"
        style={{ filter: "blur(2px)" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-6 -right-6 w-9 h-9 rounded-full bg-gradient-to-br from-[#9FB8FF] to-[#5B7FE0] opacity-80"
        style={{ filter: "blur(2px)" }}
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Phone frame */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-[260px] sm:w-[290px] md:w-[310px] aspect-[9/19.5] rounded-[44px] p-[10px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)]"
        style={{
          background:
            "linear-gradient(160deg, #2a2a3a 0%, #0e0e16 50%, #2a2a3a 100%)",
        }}
      >
        {/* Inner bezel */}
        <div className="relative w-full h-full rounded-[36px] overflow-hidden bg-[#0E2A47]">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-30" />

          {/* Status bar */}
          <div className="absolute top-2 left-0 right-0 px-6 flex justify-between items-center text-[9px] text-white/85 font-calm-body z-20">
            <span>9:41</span>
            <span>● ●●</span>
          </div>

          {/* Screens */}
          <AnimatePresence mode="wait">
            <motion.div
              key={SCREENS[index].key}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <ScreenContent screen={SCREENS[index].key} />
            </motion.div>
          </AnimatePresence>

          {/* Bottom screen indicator dots */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
            {SCREENS.map((s, i) => (
              <span
                key={s.key}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === index ? "w-5 bg-white/90" : "w-1 bg-white/35"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating label badge */}
      <motion.div
        key={`label-${SCREENS[index].key}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute -left-4 sm:-left-10 top-12 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md shadow-[0_12px_30px_-10px_rgba(0,0,0,0.4)] hidden sm:flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-gradient-to-br from-[#8267D6] to-[#5B7FE0]" />
        <span className="font-calm-body text-[11px] font-semibold" style={{ color: NAVY }}>
          {SCREENS[index].label}
        </span>
      </motion.div>
    </div>
  );
}

/* === Per-screen mock content (no images, fully animated) === */
function ScreenContent({ screen }: { screen: typeof SCREENS[number]["key"] }) {
  if (screen === "meditate") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-white"
        style={{ background: "radial-gradient(circle at 50% 30%, #2d4a78 0%, #0e2a47 70%)" }}>
        <div className="text-[10px] tracking-[0.25em] uppercase text-white/60 font-calm-body mb-2 mt-6">Day 7 · Stillness</div>
        <div className="text-base font-calm-display font-semibold mb-6">Morning Calm</div>
        {/* Breathing orb */}
        <motion.div
          className="relative w-32 h-32 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(233,217,255,0.9) 0%, rgba(130,103,214,0.4) 60%, transparent 80%)" }}
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-4 rounded-full border border-white/30" />
          <div className="absolute inset-0 flex items-center justify-center text-[11px] text-white/90 font-calm-body">Breathe</div>
        </motion.div>
        <div className="mt-6 text-[10px] text-white/50 font-calm-body">10:32 / 15:00</div>
        <div className="mt-2 w-40 h-1 rounded-full bg-white/15 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#E9D9FF] to-[#8267D6]"
            initial={{ width: "20%" }}
            animate={{ width: "70%" }}
            transition={{ duration: 4, ease: "easeInOut" }}
          />
        </div>
        <div className="mt-5 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
          <Pause className="w-5 h-5" style={{ color: NAVY }} />
        </div>
      </div>
    );
  }

  if (screen === "breathe") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-white"
        style={{ background: "radial-gradient(circle at 50% 50%, #1a3d5c 0%, #081a30 80%)" }}>
        <div className="text-[10px] tracking-[0.25em] uppercase text-white/60 font-calm-body mb-2 mt-6">Box Breathing</div>
        <div className="text-base font-calm-display font-semibold mb-6">4 · 4 · 4 · 4</div>
        <motion.div
          className="relative w-36 h-36"
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-3xl border-2 border-[#9FB8FF]/40" />
          <motion.div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#E9D9FF]"
            style={{ boxShadow: "0 0 16px rgba(233,217,255,0.9)" }}
          />
        </motion.div>
        <motion.div
          className="mt-6 text-sm text-white/85 font-calm-display italic"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          Inhale slowly…
        </motion.div>
        <div className="mt-4 flex items-center gap-1.5 text-[10px] text-white/50 font-calm-body">
          <Wind className="w-3 h-3" /> Cycle 4 of 8
        </div>
      </div>
    );
  }

  if (screen === "sleep") {
    return (
      <div className="absolute inset-0 flex flex-col p-5 text-white"
        style={{ background: "linear-gradient(180deg, #1b1740 0%, #0a0820 100%)" }}>
        <div className="mt-7 text-[10px] tracking-[0.25em] uppercase text-white/60 font-calm-body">Sleep Stories</div>
        <div className="text-lg font-calm-display font-semibold mt-1">Tonight's calm</div>
        {/* Featured card */}
        <div className="mt-4 rounded-2xl p-4 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #2a2270 0%, #4a3a8a 100%)" }}>
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[#E9D9FF]/20 blur-2xl" />
          <Moon className="w-5 h-5 text-[#E9D9FF] mb-2" />
          <div className="font-calm-display font-semibold text-sm">The Quiet Forest</div>
          <div className="text-[10px] text-white/60 font-calm-body mt-0.5">42 min · Narration + ambience</div>
        </div>
        <div className="mt-3 space-y-2">
          {[
            { t: "Drift", s: "28 min" },
            { t: "Cabin Rain", s: "1h 12m" },
            { t: "Starfield", s: "55 min" },
          ].map((it) => (
            <div key={it.t} className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5B7FE0]/40 to-[#8267D6]/40 flex items-center justify-center">
                <Moon className="w-3.5 h-3.5 text-white/80" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-calm-body font-semibold">{it.t}</div>
                <div className="text-[9px] text-white/50">{it.s}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Stars */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-white/80"
            style={{ left: `${10 + i * 11}%`, top: `${15 + (i % 3) * 5}%` }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>
    );
  }

  if (screen === "sounds") {
    return (
      <div className="absolute inset-0 flex flex-col p-5 text-white"
        style={{ background: "linear-gradient(160deg, #0e3a3a 0%, #0e2a47 100%)" }}>
        <div className="mt-7 text-[10px] tracking-[0.25em] uppercase text-white/60 font-calm-body">Soundscapes</div>
        <div className="text-lg font-calm-display font-semibold mt-1">Forest at dawn</div>

        {/* Equalizer bars */}
        <div className="mt-6 flex items-end justify-center gap-1.5 h-24">
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.span
              key={i}
              className="w-2 rounded-full bg-gradient-to-t from-[#5B7FE0] to-[#E9D9FF]"
              animate={{ height: [8, 30 + (i * 3) % 50, 8] }}
              transition={{
                duration: 1.4 + (i % 5) * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.08,
              }}
            />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {[
            { i: Music2, l: "Rain" },
            { i: Wind, l: "Wind" },
            { i: Headphones, l: "Waves" },
          ].map(({ i: I, l }) => (
            <div key={l} className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/5">
              <I className="w-4 h-4 text-[#E9D9FF]" />
              <span className="text-[9px] font-calm-body text-white/70">{l}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto mb-8 flex items-center justify-between text-[10px] text-white/60 font-calm-body">
          <span>Layered mix</span>
          <span>∞ loop</span>
        </div>
      </div>
    );
  }

  // progress
  return (
    <div className="absolute inset-0 flex flex-col p-5 text-white"
      style={{ background: "linear-gradient(160deg, #14305a 0%, #0e2a47 100%)" }}>
      <div className="mt-7 text-[10px] tracking-[0.25em] uppercase text-white/60 font-calm-body">Your Journey</div>
      <div className="text-lg font-calm-display font-semibold mt-1">Day 12 of 30</div>

      {/* Progress ring */}
      <div className="mt-4 flex items-center gap-3">
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
            <motion.circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke="url(#g1)" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="100" initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 60 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#E9D9FF" />
                <stop offset="100%" stopColor="#5B7FE0" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[11px] font-calm-display font-bold">40%</div>
        </div>
        <div>
          <div className="text-[11px] font-calm-body text-white/85">7-day streak 🔥</div>
          <div className="text-[9px] text-white/50">142 minutes this week</div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="mt-5">
        <div className="text-[10px] text-white/60 font-calm-body mb-2">This week</div>
        <div className="flex items-end gap-1.5 h-16">
          {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
              className="flex-1 rounded-md bg-gradient-to-t from-[#5B7FE0]/70 to-[#E9D9FF]/90"
            />
          ))}
        </div>
        <div className="flex justify-between text-[8px] text-white/40 mt-1.5">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-white/5">
          <LineChart className="w-3.5 h-3.5 text-[#E9D9FF] mb-1" />
          <div className="text-sm font-calm-display font-bold">−42%</div>
          <div className="text-[9px] text-white/50 font-calm-body">Stress level</div>
        </div>
        <div className="p-2.5 rounded-xl bg-white/5">
          <Heart className="w-3.5 h-3.5 text-[#E9D9FF] mb-1" />
          <div className="text-sm font-calm-display font-bold">+28%</div>
          <div className="text-[9px] text-white/50 font-calm-body">Calm score</div>
        </div>
      </div>
    </div>
  );
}

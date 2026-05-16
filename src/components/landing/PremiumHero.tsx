import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Sparkles, Wind, Moon, Music2, Brain, Flower2, Heart } from "lucide-react";
import { LogoIcon } from "@/components/WillowLogo";

// Heavy 3D scene loaded only on client, only when not reduced-motion
const Hero3DScene = lazy(() => import("./Hero3DScene"));

const CTA_GRADIENT = "linear-gradient(90deg, #1a3c2a 0%, #c9a84c 100%)";

/**
 * Premium cinematic landing hero — calming meditation aesthetic.
 * Full-bleed 3D iridescent breathing orb + particle field (R3F + drei).
 * Reduced-motion users get the original layered gradient background only.
 */
export default function PremiumHero() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [enable3D, setEnable3D] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    // Mount WebGL on next frame so LCP text paints first, but without a long delay
    const raf = window.requestAnimationFrame(() => setEnable3D(true));
    return () => {
      mq.removeEventListener("change", onChange);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden min-h-[100svh] flex items-center"
      style={{ background: "radial-gradient(120% 80% at 80% 0%, #1a3c2a 0%, #0e2418 38%, #07140d 70%, #06120c 100%)" }}
    >
      {/* === 3D scene (absolutely positioned, full-bleed) === */}
      {!reducedMotion && enable3D && (
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <Hero3DScene />
          </Suspense>
        </div>
      )}

      {/* === Static cinematic background layers (always on, soft fallback) === */}
      <CinematicBackground />

      {/* Vignette + bottom fade so text stays readable on top of 3D */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 25% 50%, rgba(5,15,31,0.55) 0%, rgba(5,15,31,0.15) 45%, transparent 70%)",
        }}
      />

      {/* === Hero content === */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 pt-28 md:pt-32 pb-20 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-center lg:text-left"
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

          <div className="flex lg:hidden justify-center mb-5">
            <LogoIcon size={64} animated />
          </div>

          {/* Headline */}
          <h1 className="font-calm-display text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-semibold leading-[1.02] tracking-[-0.025em] text-white">
            Quiet the noise.
            <br />
            <span className="italic font-medium bg-gradient-to-r from-[#E9D9FF] via-[#C8B6F0] to-[#9FB8FF] bg-clip-text text-transparent">
              Return to yourself.
            </span>
          </h1>

          <p className="font-calm-body text-base sm:text-lg md:text-xl mt-6 max-w-xl mx-auto lg:mx-0 leading-relaxed text-white/80">
            A cinematic 30-day journey of guided meditation, breathwork, sleep stories,
            and ambient sound — designed for stressed, busy minds.
          </p>

          {/* CTA — single, focused */}
          <div className="flex flex-col sm:flex-row gap-3 mt-9 justify-center lg:justify-start">
            <Link to="/sign-in?redirect=/app" className="block">
              <button
                className="group relative w-full sm:w-auto px-10 py-4 rounded-full font-calm-body font-semibold text-base text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
                style={{ background: CTA_GRADIENT, boxShadow: "0 18px 48px -14px rgba(91,127,224,0.7)" }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Start Free Trial
                </span>
              </button>
            </Link>
            <Link to="/pricing" className="block">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full font-calm-body font-semibold text-base text-white border border-white/20 bg-white/[0.06] backdrop-blur-md hover:bg-white/[0.12] transition-colors">
                See Plans
              </button>
            </Link>
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
      </div>

      {/* Soft bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60 text-[10px] tracking-[0.3em] uppercase font-calm-body flex flex-col items-center gap-2"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        Scroll
        <span className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
      </motion.div>
    </section>
  );
}

/* ============================================================
   Background fallback — soft aurora glow (always on, behind 3D)
   ============================================================ */
function CinematicBackground() {
  return (
    <>
      <motion.div
        aria-hidden
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full z-0"
        style={{
          background: "radial-gradient(circle, rgba(130,103,214,0.35) 0%, rgba(130,103,214,0) 60%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-[10%] -right-[15%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full z-0"
        style={{
          background: "radial-gradient(circle, rgba(91,127,224,0.32) 0%, rgba(91,127,224,0) 60%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full z-0"
        style={{
          background: "radial-gradient(circle, rgba(159,184,255,0.25) 0%, rgba(159,184,255,0) 60%)",
          filter: "blur(50px)",
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, Sparkles, Brain, Moon, Wind, Headphones, Flower2, ArrowRight, Check, Star, Heart, BookOpen, MessageCircle, Activity, Music2, Timer, Sun, LineChart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LogoIcon } from "@/components/WillowLogo";
import { supabase } from "@/integrations/supabase/client";
import { usePageSEO } from "@/hooks/usePageSEO";
const SageOrb3D = lazy(() => import("@/components/landing/SageOrb3D"));

// Lazy below-the-fold sections
const FAQSection = lazy(() => import("@/components/FAQSection"));
import {
  OutcomesBand,
  DayWithWillow,
  WhyWillow,
  CraftedBy,
  MemberVoicesTrio,
} from "@/components/landing/LandingExtras";
import {
  TrustStrip,
  ProblemBand,
  ProductProof,
  ScienceBand,
  MemberPortraits,
  RiskReversal,
} from "@/components/landing/FunnelBands";
import StickyMobileCTA from "@/components/landing/StickyMobileCTA";

/**
 * Willow Vibes — premium, minimal, editorial landing.
 * Palette: Sage & Cream. Type: Cormorant Garamond (display) + Karla (body).
 * Structure: stacked full-width sections, generous whitespace, no clutter.
 */

// Local design tokens (sage + cream luxury palette)
const CREAM = "#f5f0e8";
const CREAM_DEEP = "#ede5d7";
const SAGE_PALE = "#dce5d4";
const SAGE = "#a8c0a0";
const SAGE_DEEP = "#7d9b76";
const FOREST = "#3a4d36";
const INK = "#1f231d";
const MUTED = "#6b7268";
const GOLD = "#c9a84c";

const fontStyles = `
  .ff-display { font-family: 'Cormorant Garamond', Georgia, serif; letter-spacing: -0.015em; }
  .ff-body { font-family: 'Karla', system-ui, sans-serif; }
  .ff-eyebrow { font-family: 'Karla', system-ui, sans-serif; letter-spacing: 0.32em; text-transform: uppercase; }
`;

const HERO_IMG =
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1800&q=80";
const RITUAL_IMG =
  "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1400&q=80";
const FOREST_IMG =
  "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80";

export default function LandingPage() {
  usePageSEO({
    title: "Willow Vibes — Meditation, Sleep & Breathwork for Modern Minds",
    description: "A calmer nervous system in 10 minutes a day. Guided meditation, sleep stories, breathwork, and an AI wellness coach. Start your 7-day free trial.",
    canonical: "https://willowvibes.com/",
  });
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Always redirect already-authenticated visitors straight to the app.
    // This covers PWA standalone, Capacitor/Android wrappers, and regular browser
    // re-visits — so returning users don't have to sign in again on every launch.
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session) {
        navigate("/app", { replace: true });
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (session) navigate("/app", { replace: true });
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const nav = [
    { label: "Philosophy", id: "philosophy" },
    { label: "Practice", id: "practice" },
    { label: "Plans", id: "plans" },
    { label: "FAQ", id: "faq" },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: CREAM, color: INK }}>
      <style dangerouslySetInnerHTML={{ __html: fontStyles }} />

      {/* ─── Navigation ─────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "backdrop-blur-xl border-b" : ""
        }`}
        style={{
          background: scrolled ? "rgba(245,240,232,0.85)" : "transparent",
          borderColor: scrolled ? "rgba(125,155,118,0.18)" : "transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-5 flex items-center justify-between">
          <button onClick={() => scrollTo("top")} className="flex items-center gap-2.5 ff-display text-2xl">
            <LogoIcon size={32} />
            <span style={{ color: INK }}>Willow</span>
            <span className="italic" style={{ color: SAGE_DEEP }}>Vibes</span>
          </button>

          <div className="hidden md:flex items-center gap-10">
            {nav.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="ff-body text-[13px] font-medium transition-opacity hover:opacity-60"
                style={{ color: INK }}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/sign-in"
              className="ff-body text-[13px] font-medium px-4 py-2 transition-opacity hover:opacity-60"
              style={{ color: INK }}
            >
              Sign In
            </Link>
            <Link to="/sign-in?redirect=/app">
              <button
                className="ff-body text-[13px] font-semibold px-5 py-2.5 rounded-full transition-transform hover:scale-[1.03]"
                style={{ background: FOREST, color: CREAM }}
              >
                Begin Free
              </button>
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{ color: INK }}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden px-5 pb-6 pt-2 border-t"
              style={{ background: CREAM, borderColor: "rgba(125,155,118,0.18)" }}
            >
              {nav.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="block w-full text-left py-3 ff-body text-[15px]"
                  style={{ color: INK }}
                >
                  {l.label}
                </button>
              ))}
              <div className="pt-3 grid grid-cols-2 gap-2">
                <Link to="/sign-in">
                  <button
                    className="w-full py-3 rounded-full ff-body text-sm font-medium border"
                    style={{ borderColor: SAGE, color: INK }}
                  >
                    Sign In
                  </button>
                </Link>
                <Link to="/sign-in?redirect=/app">
                  <button
                    className="w-full py-3 rounded-full ff-body text-sm font-semibold"
                    style={{ background: FOREST, color: CREAM }}
                  >
                    Begin Free
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── Hero ───────────────────────────────────────────────────── */}
      <section id="top" className="relative w-full overflow-hidden" style={{ background: CREAM }}>
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[38rem]"
          style={{
            background:
              "radial-gradient(circle at 18% 18%, rgba(168,192,160,0.22) 0%, rgba(168,192,160,0) 42%), radial-gradient(circle at 82% 22%, rgba(201,168,76,0.16) 0%, rgba(201,168,76,0) 36%), linear-gradient(180deg, rgba(237,229,215,0.92) 0%, rgba(245,240,232,0) 100%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-5 md:px-10 pt-28 md:pt-44 pb-16 md:pb-32">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-20 items-center">
            {/* Orb — appears ABOVE text on mobile, right column on desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative order-1 lg:order-2 mx-auto w-[68%] sm:w-[55%] lg:w-full"
            >
              <div
                aria-hidden
                className="absolute -inset-[10%] rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(168,192,160,0.36) 0%, rgba(201,168,76,0.18) 38%, rgba(245,240,232,0) 72%)",
                }}
              />
              <div
                className="relative aspect-square w-full rounded-full overflow-hidden"
                style={{
                  background:
                    "radial-gradient(circle at 50% 45%, rgba(168,192,160,0.45) 0%, rgba(245,240,232,0) 65%)",
                }}
              >
                <Suspense fallback={<div className="absolute inset-0" />}>
                  <SageOrb3D />
                </Suspense>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, transparent 58%, rgba(245,240,232,0.85) 100%)",
                  }}
                />
              </div>
              {/* Gold orbit hairlines */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-[-6%] rounded-full"
                style={{ border: "1px solid rgba(201,168,76,0.22)", transform: "rotate(12deg)" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-[-14%] rounded-full"
                style={{ border: "1px solid rgba(201,168,76,0.14)", transform: "rotate(-18deg)" }}
              />
              <div
                className="hidden lg:flex absolute -left-2 bottom-6 max-w-[220px] p-5 rounded-sm backdrop-blur-md"
                style={{ background: "rgba(245,240,232,0.92)", border: `1px solid ${SAGE_PALE}` }}
              >
                <div>
                  <p className="ff-display italic text-[20px] leading-tight" style={{ color: FOREST }}>
                    "Stillness, finally on my schedule."
                  </p>
                  <p className="ff-eyebrow text-[9px] mt-2" style={{ color: MUTED }}>
                    Elena R. · Member
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Text column */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 lg:order-1 text-center lg:text-left"
            >
              <p className="ff-eyebrow text-[10px] mb-5" style={{ color: SAGE_DEEP }}>
                Premium Mindfulness · Est. 2026
              </p>
              <div className="flex justify-center lg:justify-start mb-6">
                <div
                  className="inline-flex items-center gap-3 rounded-full px-4 py-2"
                  style={{
                    background: "rgba(245,240,232,0.72)",
                    border: "1px solid rgba(125,155,118,0.22)",
                    boxShadow: "0 12px 36px -24px rgba(58,77,54,0.28)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <LogoIcon size={34} animated />
                  <div className="text-left leading-none">
                    <p className="ff-display text-[1.25rem]" style={{ color: INK }}>
                      Willow <span className="italic" style={{ color: SAGE_DEEP }}>Vibes</span>
                    </p>
                    <p className="ff-eyebrow text-[8px] mt-1" style={{ color: MUTED }}>
                      Luxury calm for modern lives
                    </p>
                  </div>
                </div>
              </div>
              <h1
                className="ff-display font-light leading-[0.98] tracking-tight"
                style={{ color: INK, fontSize: "clamp(2.5rem, 7.5vw, 6.5rem)" }}
              >
                Quiet the noise.
                <br />
                <span className="italic" style={{ color: FOREST }}>
                  Return to yourself.
                </span>
              </h1>
              <p
                className="ff-body mt-6 max-w-lg mx-auto lg:mx-0 text-[16px] md:text-[17px] leading-[1.65]"
                style={{ color: MUTED }}
              >
                A considered practice of guided meditation, breathwork, sleep stories
                and ambient sound — composed for the modern mind.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mt-8">
                <Link to="/sign-in?redirect=/app">
                  <button
                    className="ff-body group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[14px] font-semibold transition-transform hover:scale-[1.03]"
                    style={{ background: FOREST, color: CREAM }}
                  >
                    Begin 7-Day Trial
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </Link>
                <button
                  onClick={() => scrollTo("plans")}
                  className="ff-body px-6 py-3.5 rounded-full text-[14px] font-medium transition-colors border"
                  style={{ borderColor: "rgba(125,155,118,0.4)", color: INK }}
                >
                  View Plans
                </button>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3 mt-7 ff-body text-[12px]" style={{ color: MUTED }}>
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" style={{ color: SAGE_DEEP }} /> 7 days complimentary
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" style={{ color: SAGE_DEEP }} /> Cancel anytime
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" style={{ color: SAGE_DEEP }} /> 4.9 / 5 · 10k+ practicing
                </span>
              </div>
              <div className="mt-7 flex flex-wrap justify-center lg:justify-start gap-2.5">
                {[
                  "Breathwork Studio",
                  "Sleep Stories",
                  "SOS Rescue",
                  "Private AI Coach",
                ].map((item) => (
                  <span
                    key={item}
                    className="ff-body text-[12px] px-3 py-1.5 rounded-full"
                    style={{
                      color: FOREST,
                      background: "rgba(220,229,212,0.65)",
                      border: "1px solid rgba(125,155,118,0.22)",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ─── Luxury "As Featured In" trust band ───────────────────── */}
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-5 py-7 border-t border-b"
            style={{ borderColor: "rgba(125,155,118,0.25)" }}
          >
            <p className="ff-eyebrow text-[9px]" style={{ color: SAGE_DEEP }}>As Featured In</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2" style={{ color: INK, opacity: 0.55 }}>
              <span className="ff-display italic text-[20px]">Vogue</span>
              <span className="ff-eyebrow text-[12px]" style={{ letterSpacing: "0.3em" }}>FORBES</span>
              <span className="ff-display italic text-[20px]">Goop</span>
              <span className="ff-eyebrow text-[12px]" style={{ letterSpacing: "0.3em" }}>WIRED</span>
              <span className="ff-display italic text-[20px]">Architectural Digest</span>
            </div>
            <p className="ff-eyebrow text-[9px]" style={{ color: GOLD }}>★ 4.9 / 5</p>
          </div>
        </div>
      </section>

      {/* ─── Philosophy / About ─────────────────────────────────────── */}
      <section id="philosophy" className="w-full" style={{ background: CREAM }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10 py-24 md:py-36 text-center">
          <p className="ff-eyebrow text-[10px] mb-6" style={{ color: SAGE_DEEP }}>
            Philosophy
          </p>
          <h2
            className="ff-display font-light leading-[1.05]"
            style={{ color: INK, fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
          >
            Less to do.{" "}
            <span className="italic" style={{ color: SAGE_DEEP }}>
              More to feel.
            </span>
          </h2>
          <p
            className="ff-body mt-7 max-w-2xl mx-auto text-[17px] leading-[1.75]"
            style={{ color: MUTED }}
          >
            Willow Vibes is a slow, intentional studio for the inner life — drawing
            from contemplative science, sound design, and the quiet wisdom of nature.
            No streaks to maintain. No noise to escape. Only return.
          </p>
        </div>
      </section>

      {/* ─── Practice — editorial four pillars ──────────────────────── */}
      <section id="practice" className="w-full" style={{ background: CREAM_DEEP }}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-32">
          <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16 mb-16">
            <div>
              <p className="ff-eyebrow text-[10px] mb-5" style={{ color: SAGE_DEEP }}>
                The Practice
              </p>
              <h2
                className="ff-display font-light leading-[1.05]"
                style={{ color: INK, fontSize: "clamp(2rem, 4.2vw, 3.5rem)" }}
              >
                Four pillars,{" "}
                <span className="italic" style={{ color: SAGE_DEEP }}>
                  one quiet ritual.
                </span>
              </h2>
            </div>
            <p className="ff-body text-[16px] leading-[1.75] md:pt-10" style={{ color: MUTED }}>
              Everything in Willow Vibes is composed around four enduring pillars —
              chosen because, together, they cover the architecture of a calm,
              attentive life. Nothing more. Nothing fashionable.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "rgba(125,155,118,0.25)" }}>
            {[
              { icon: Brain, title: "Meditation", body: "Guided practices for clarity, focus and equanimity. Short forms for busy mornings; longer arcs for deep weeks." },
              { icon: Wind, title: "Breathwork", body: "Coherence, box, and physiological-sigh practices to settle the nervous system in three minutes." },
              { icon: Moon, title: "Sleep", body: "Slow stories, soundscapes, and wind-down rituals designed by sleep researchers." },
              { icon: Flower2, title: "Reflection", body: "Mood, gratitude, and journaling — held lightly, never gamified." },
            ].map(({ icon: I, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-8 md:p-10"
                style={{ background: CREAM_DEEP }}
              >
                <I className="w-5 h-5 mb-6" style={{ color: SAGE_DEEP }} />
                <h3 className="ff-display text-[26px] leading-tight mb-3" style={{ color: INK }}>
                  {title}
                </h3>
                <p className="ff-body text-[14px] leading-[1.7]" style={{ color: MUTED }}>
                  {body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Outcomes / numbers (new) ───────────────────────────────── */}
      <OutcomesBand />

      {/* ─── A Day With Willow (new) ────────────────────────────────── */}
      <DayWithWillow />


      {/* ─── Inside the App — feature cards ─────────────────────────── */}
      <section id="features" className="w-full" style={{ background: CREAM }}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="ff-eyebrow text-[10px] mb-5" style={{ color: SAGE_DEEP }}>
              Inside Willow
            </p>
            <h2
              className="ff-display font-light leading-[1.05]"
              style={{ color: INK, fontSize: "clamp(2rem, 4.5vw, 3.6rem)" }}
            >
              A complete sanctuary,{" "}
              <span className="italic" style={{ color: SAGE_DEEP }}>
                in your pocket.
              </span>
            </h2>
            <p className="ff-body mt-5 text-[16px] leading-[1.75]" style={{ color: MUTED }}>
              Twelve crafted tools, working as one. Each one designed by therapists,
              sound engineers, and contemplative teachers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Brain, title: "30-Day Journey", body: "A guided arc from anxious to anchored — one short session a day.", tag: "Signature" },
              { icon: MessageCircle, title: "AI Coach", body: "A private, voice-enabled companion that listens, reflects, and guides.", tag: "Intelligent" },
              { icon: Moon, title: "Sleep Stories", body: "Slow, cinematic narratives composed to carry you into deep rest.", tag: "Nightly" },
              { icon: Wind, title: "Breathwork Studio", body: "Box, coherence, 4-7-8, and physiological sigh — paced visually.", tag: "Nervous System" },
              { icon: Music2, title: "Sound Bed Designer", body: "Layer rain, ocean, forest, binaurals and solfeggio into your own mix.", tag: "Custom" },
              { icon: Activity, title: "Body Scan", body: "Interactive zone-by-zone release — tension found, tension freed.", tag: "Somatic" },
              { icon: Heart, title: "Mood & Gratitude", body: "Track the shape of your inner weather. Held lightly, never gamified.", tag: "Reflective" },
              { icon: BookOpen, title: "Living Journal", body: "Voice or text. AI gently reflects patterns back when you want them.", tag: "Private" },
              { icon: Timer, title: "Signature Timer", body: "Open meditation with chimes, intervals, and ambient beds.", tag: "Flexible" },
              { icon: Sun, title: "Morning Rituals", body: "Intention-setting, affirmations, and a daily wisdom drop.", tag: "Daily" },
              { icon: LineChart, title: "Advanced Analytics", body: "See how practice changes mood, sleep quality, and resilience.", tag: "Insightful" },
              { icon: Sparkles, title: "SOS Rescue", body: "One-tap panic protocol, grounding tools, and trusted contacts.", tag: "Emergency" },
            ].map(({ icon: I, title, body, tag }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
                className="group relative p-7 rounded-sm border transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: CREAM_DEEP,
                  borderColor: "rgba(125,155,118,0.18)",
                  boxShadow: "0 1px 0 rgba(58,77,54,0.04)",
                }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: SAGE_PALE }}
                  >
                    <I className="w-5 h-5" style={{ color: FOREST }} />
                  </div>
                  <span
                    className="ff-eyebrow text-[9px] px-2 py-1"
                    style={{ color: SAGE_DEEP }}
                  >
                    {tag}
                  </span>
                </div>
                <h3 className="ff-display text-[22px] leading-tight mb-2" style={{ color: INK }}>
                  {title}
                </h3>
                <p className="ff-body text-[13.5px] leading-[1.65]" style={{ color: MUTED }}>
                  {body}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link to="/sign-in?redirect=/app">
              <button
                className="ff-body inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[14px] font-semibold transition-transform hover:scale-[1.03]"
                style={{ background: FOREST, color: CREAM }}
              >
                Step inside Willow <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>



      {/* ─── Why Willow (new) ───────────────────────────────────────── */}
      <WhyWillow />

      {/* ─── Crafted By (new) ───────────────────────────────────────── */}
      <CraftedBy />

      {/* ─── Cinematic image band ───────────────────────────────────── */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[420px] md:h-[560px]">
          <img
            src={FOREST_IMG}
            alt="Sun through forest"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(58,77,54,0.55) 0%, rgba(58,77,54,0.15) 60%, rgba(58,77,54,0.5) 100%)",
            }}
          />
          <div className="relative h-full flex items-center">
            <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="ff-display font-light leading-[1.08]"
                style={{ color: CREAM, fontSize: "clamp(2rem, 5vw, 4rem)" }}
              >
                "The forest does not hurry,{" "}
                <span className="italic">yet everything is accomplished."</span>
              </motion.h2>
              <p className="ff-eyebrow text-[10px] mt-6" style={{ color: CREAM }}>
                — Lao Tzu, adapted
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonial single quote ───────────────────────────────── */}
      <section className="w-full" style={{ background: CREAM }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 py-24 md:py-32 text-center">
          <p className="ff-eyebrow text-[10px] mb-8" style={{ color: SAGE_DEEP }}>
            Member Voices
          </p>
          <p
            className="ff-display italic font-light leading-[1.25]"
            style={{ color: INK, fontSize: "clamp(1.6rem, 3.4vw, 2.6rem)" }}
          >
            "I've tried every meditation app. Willow is the only one that doesn't
            feel like another thing to manage. It feels like an old friend."
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center ff-body text-[12px] font-semibold"
              style={{ background: SAGE_PALE, color: FOREST }}
            >
              SJ
            </div>
            <div className="text-left">
              <p className="ff-body text-[13px] font-semibold" style={{ color: INK }}>
                Sarah Jenkins
              </p>
              <p className="ff-eyebrow text-[9px]" style={{ color: MUTED }}>
                Marketing Director
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Member Voices trio (new) ───────────────────────────────── */}
      <MemberVoicesTrio />

      {/* ─── Plans / Pricing ────────────────────────────────────────── */}
      <section id="plans" className="w-full" style={{ background: CREAM_DEEP }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-24 md:py-32">
          <div className="text-center mb-16">
            <p className="ff-eyebrow text-[10px] mb-5" style={{ color: SAGE_DEEP }}>
              Plans
            </p>
            <h3
              className="ff-display font-light leading-[1.05]"
              style={{ color: INK, fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
            >
              Begin freely.{" "}
              <span className="italic" style={{ color: SAGE_DEEP }}>
                Stay if it serves you.
              </span>
            </h3>
            <p className="ff-body mt-5 max-w-xl mx-auto text-[15px]" style={{ color: MUTED }}>
              Every plan opens with seven complimentary days of Willow Plus. No card today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px rounded-sm overflow-hidden" style={{ background: "rgba(125,155,118,0.3)" }}>
            {/* Monthly */}
            <PlanCard
              eyebrow="Monthly"
              tag="Flexible"
              price="$14.99"
              period="/ month"
              note="No commitment. Cancel anytime."
              features={[
                "Full 30-day program",
                "Premium narration voices",
                "AI Coach + Daily Insight",
                "Sleep stories & soundscapes",
              ]}
              ctaLabel="Begin Trial"
              ctaTo="/pricing"
              variant="quiet"
            />

            {/* Yearly featured */}
            <PlanCard
              eyebrow="Yearly · Best Value"
              tag="Save 58%"
              price="$79.99"
              period="/ year"
              note="Just $6.67 / month, billed annually."
              features={[
                "Everything in Monthly",
                "Sound Bed Designer + binaurals",
                "Advanced analytics & reports",
                "Priority new releases",
              ]}
              ctaLabel="Begin Trial"
              ctaTo="/pricing"
              variant="featured"
            />

            {/* Lifetime */}
            <PlanCard
              eyebrow="Lifetime · Founders"
              tag="Limited"
              price="$149"
              period="one time"
              note="All future content forever. Limited to 1,000."
              features={[
                "Everything, forever",
                "All future seasons & AI upgrades",
                "Founder badge",
                "No subscription, ever",
              ]}
              ctaLabel="Claim Lifetime"
              ctaTo="/pricing"
              variant="quiet"
            />
          </div>

          <p className="text-center ff-body text-[12px] mt-8" style={{ color: MUTED }}>
            <Shield className="inline w-3.5 h-3.5 mr-1.5" style={{ color: SAGE_DEEP }} />
            30-day money-back guarantee · Secure payments by Paddle
          </p>
        </div>
      </section>

      {/* ─── FAQ ────────────────────────────────────────────────────── */}
      <section id="faq" className="w-full" style={{ background: CREAM }}>
        <Suspense fallback={null}>
          <FAQSection />
        </Suspense>
      </section>

      {/* ─── Final CTA ──────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden">
        <div className="relative">
          <img
            src={RITUAL_IMG}
            alt="Sage ritual"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(245,240,232,0.95) 0%, rgba(245,240,232,0.85) 60%, rgba(245,240,232,0.98) 100%)",
            }}
          />
          <div className="relative max-w-3xl mx-auto px-5 md:px-10 py-24 md:py-36 text-center">
            <Sparkles className="w-5 h-5 mx-auto mb-6" style={{ color: SAGE_DEEP }} />
            <h2
              className="ff-display font-light leading-[1.05]"
              style={{ color: INK, fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)" }}
            >
              The mind you want{" "}
              <span className="italic" style={{ color: SAGE_DEEP }}>
                begins today.
              </span>
            </h2>
            <p className="ff-body mt-6 max-w-lg mx-auto text-[16px] leading-[1.7]" style={{ color: MUTED }}>
              Seven free days of Willow Plus. No card today. Cancel with one tap.
            </p>
            <Link to="/sign-in?redirect=/app" className="inline-block mt-9">
              <button
                className="ff-body inline-flex items-center gap-2 px-9 py-4 rounded-full text-[14px] font-semibold transition-transform hover:scale-[1.03]"
                style={{ background: FOREST, color: CREAM }}
              >
                Begin Free Trial <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer className="w-full" style={{ background: INK, color: CREAM }}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-20">
          <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <LogoIcon size={32} />
                <span className="ff-display text-2xl">
                  Willow <span className="italic" style={{ color: SAGE }}>Vibes</span>
                </span>
              </div>
              <p className="ff-body text-[13px] leading-[1.7] max-w-xs" style={{ color: "rgba(245,240,232,0.6)" }}>
                A considered studio for meditation, breathwork, and sleep — composed for the modern mind.
              </p>
            </div>
            {[
              { title: "Practice", links: [["Plans", "/pricing"], ["About", "/about"], ["Science", "/science"]] },
              { title: "Company", links: [["Help", "/help"], ["Contact", "mailto:support@willowvibes.com"]] },
              { title: "Legal", links: [["Terms", "/legal/terms"], ["Privacy", "/legal/privacy"], ["Refunds", "/legal/refund"]] },
            ].map((col) => (
              <div key={col.title}>
                <p className="ff-eyebrow text-[10px] mb-4" style={{ color: "rgba(245,240,232,0.5)" }}>
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link to={href} className="ff-body text-[13px] transition-opacity hover:opacity-100" style={{ color: "rgba(245,240,232,0.75)" }}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-3 ff-body text-[11px]"
            style={{ borderColor: "rgba(245,240,232,0.12)", color: "rgba(245,240,232,0.5)" }}>
            <p>© 2026 Willow Vibes™ · Cultivated with care.</p>
            <p>Secure payments by Paddle · Merchant of Record</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Plan card ────────────────────────────────────────────────────── */
function PlanCard({
  eyebrow, tag, price, period, note, features, ctaLabel, ctaTo, variant,
}: {
  eyebrow: string; tag: string; price: string; period: string; note: string;
  features: string[]; ctaLabel: string; ctaTo: string; variant: "featured" | "quiet";
}) {
  const isFeatured = variant === "featured";
  const bg = isFeatured ? FOREST : CREAM_DEEP;
  const text = isFeatured ? CREAM : INK;
  const sub = isFeatured ? "rgba(245,240,232,0.7)" : MUTED;
  const accent = isFeatured ? SAGE : SAGE_DEEP;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="p-8 md:p-10 flex flex-col"
      style={{ background: bg, color: text }}
    >
      <div className="flex items-center justify-between mb-8">
        <p className="ff-eyebrow text-[10px]" style={{ color: accent }}>
          {eyebrow}
        </p>
        <span
          className="ff-body text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: isFeatured ? "rgba(245,240,232,0.15)" : "rgba(125,155,118,0.18)",
            color: isFeatured ? CREAM : FOREST,
          }}
        >
          {tag}
        </span>
      </div>

      <div className="mb-2 flex items-baseline gap-2">
        <span className="ff-display font-light" style={{ fontSize: "clamp(3rem, 5vw, 4rem)", lineHeight: 1 }}>
          {price}
        </span>
        <span className="ff-body text-[13px]" style={{ color: sub }}>
          {period}
        </span>
      </div>
      <p className="ff-body text-[12px] mb-8" style={{ color: sub }}>
        {note}
      </p>

      <ul className="space-y-3 mb-10 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 ff-body text-[13.5px] leading-[1.55]">
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accent }} />
            <span style={{ color: text }}>{f}</span>
          </li>
        ))}
      </ul>

      <Link to={ctaTo} className="mt-auto">
        <button
          className="w-full ff-body text-[13px] font-semibold py-3.5 rounded-full transition-transform hover:scale-[1.02]"
          style={{
            background: isFeatured ? CREAM : FOREST,
            color: isFeatured ? FOREST : CREAM,
          }}
        >
          {ctaLabel}
        </button>
      </Link>
    </motion.div>
  );
}

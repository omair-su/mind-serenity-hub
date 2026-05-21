import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Shield, Star, Clock, Users, CheckCircle, Sparkles, Brain, HeartPulse, Moon, Wind, Headphones, LineChart, Smile, BookOpen, Flower2, Footprints, Focus, Music2, Trophy, Timer, Award, Library, ScrollText, Activity, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { LogoIcon } from "@/components/WillowLogo";
import PremiumHero from "@/components/landing/PremiumHero";

// Below-the-fold sections are lazy-loaded so they don't bloat the initial JS bundle
const AboutSection = lazy(() => import("@/components/AboutSection"));
const ScienceSection = lazy(() => import("@/components/ScienceSection"));
const CurriculumSection = lazy(() => import("@/components/CurriculumSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));

// Hero is preloaded directly from index.html (stable /public URL), so no JS-side preload needed.

// Calm-style design tokens (inline for this page so we don't disturb the global system)
// Deep navy text, soft pastel surfaces, blue→violet gradient CTAs, airy white sections.
const NAVY = "#0E2A47";
const NAVY_SOFT = "#234063";
const SLATE = "#5B6B82";
const CTA_GRADIENT = "linear-gradient(90deg, #5B7FE0 0%, #8267D6 100%)";

// Royalty-free natural imagery from Unsplash (no copyright issues, no extra credit cost)
const PHOTOS = {
  woman_reading: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80", // woman reading by window
  ocean_arms: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80", // person on cliff
  road_sunset: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80", // peaceful road
  forest_mist: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80", // forest sun
  ocean_wave: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1600&q=80", // ocean wave (pricing footer)
  pebbles_zen: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80",
  sunrise_field: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
  flowers: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80",
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  

  useEffect(() => {
    // Throttle scroll work via rAF and only read window.scrollY (no layout-forcing reads)
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 50);
        setShowStickyCTA(y > window.innerHeight * 0.9);
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Use IntersectionObserver instead of getBoundingClientRect on every scroll
    // (which forced a layout/reflow per scroll event for 7 sections).
    const sectionIds = ["home", "about", "science", "curriculum", "testimonials", "pricing", "faq"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top that is intersecting the 100px line
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-100px 0px -50% 0px", threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "About", id: "about" },
    { label: "Science", id: "science" },
    { label: "Curriculum", id: "curriculum" },
    { label: "Testimonials", id: "testimonials" },
    { label: "Pricing", id: "pricing" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ color: NAVY }}>
      {/* Calm-style display font — uses already-preloaded Plus Jakarta Sans to avoid render-blocking @import that delayed LCP. */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .font-calm-display { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, Segoe UI, sans-serif; letter-spacing: -0.01em; }
          .font-calm-body { font-family: 'Inter', system-ui, sans-serif; }
        `,
      }} />

      {/* Navigation — white when scrolled, transparent over hero */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button onClick={() => scrollToSection("home")} className="flex items-center gap-2 font-calm-display text-2xl font-semibold">
            <LogoIcon size={36} animated />
            <span style={{ color: scrolled ? NAVY : "#fff" }}>Willow</span>
            <span style={{ color: scrolled ? "#8267D6" : "#E9D9FF" }} className="italic">Vibes</span>
          </button>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-calm-body font-medium transition-colors"
                style={{
                  color: scrolled
                    ? (activeSection === link.id ? NAVY : SLATE)
                    : (activeSection === link.id ? "#fff" : "rgba(255,255,255,0.85)"),
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="hidden md:flex gap-3">
            <Link to="/sign-in" className="px-5 py-2 text-sm font-calm-body font-medium transition-colors"
              style={{ color: scrolled ? NAVY : "#fff" }}>
              Log In
            </Link>
            <Link to="/pricing">
              <button
                className="px-6 py-2.5 rounded-full font-calm-body font-semibold text-sm text-white transition-transform hover:scale-[1.03]"
                style={{ background: scrolled ? CTA_GRADIENT : "#fff", color: scrolled ? "#fff" : NAVY, boxShadow: scrolled ? "0 8px 24px -8px rgba(91,127,224,0.5)" : "0 4px 16px rgba(0,0,0,0.08)" }}
              >
                Begin Your Journey
              </button>
            </Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen
              ? <X className="w-6 h-6" style={{ color: scrolled ? NAVY : "#fff" }} />
              : <Menu className="w-6 h-6" style={{ color: scrolled ? NAVY : "#fff" }} />}
          </button>
        </div>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-white border-t border-slate-100 p-4">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollToSection(link.id)} className="block w-full text-left px-4 py-2 font-calm-body font-medium" style={{ color: NAVY }}>
                  {link.label}
                </button>
              ))}
              <div className="pt-4 space-y-2 border-t border-slate-100">
                <Link to="/sign-in" className="block w-full">
                  <button className="w-full py-3 rounded-full border border-slate-200 font-calm-body font-medium" style={{ color: NAVY }}>Log In</button>
                </Link>
                <Link to="/pricing" className="block w-full">
                  <button className="w-full py-3 rounded-full font-calm-body font-semibold text-white" style={{ background: CTA_GRADIENT }}>Begin Your Journey</button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Sticky scroll CTA */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-[68px] left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex items-center justify-center gap-3 sm:gap-6">
              <div className="hidden sm:flex items-center gap-2 text-xs font-calm-body" style={{ color: SLATE }}>
                <Sparkles className="w-3.5 h-3.5" style={{ color: "#8267D6" }} />
                <span>Founders Lifetime · $199 (was $599)</span>
              </div>
              <Link to="/pricing">
                <button className="rounded-full font-calm-body font-semibold text-white text-xs px-5 py-2 transition-transform hover:scale-[1.04]" style={{ background: CTA_GRADIENT }}>
                  Claim Your Spot →
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero — premium cinematic */}
      <PremiumHero />

      {/* Features overview — placed high so visitors see breadth immediately */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10 md:mb-14">
            <p className="text-[10px] md:text-xs font-calm-body tracking-[0.35em] uppercase mb-3" style={{ color: "#8267D6" }}>Everything in Willow Vibes</p>
            <h2 className="font-calm-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.1] tracking-[-0.02em]" style={{ color: NAVY }}>
              One quiet app. <span className="italic" style={{ color: NAVY_SOFT }}>Every tool you need.</span>
            </h2>
            <p className="font-calm-body text-base mt-4 max-w-2xl mx-auto" style={{ color: SLATE }}>
              Twenty-plus premium practices — from AI coaching and SOS relief to sleep stories, soundscapes, and a gratitude garden — all woven into a single, beautifully calm experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: Brain, label: "AI Coach" },
              { icon: AlertCircle, label: "SOS Relief" },
              { icon: Moon, label: "Sleep Stories" },
              { icon: Wind, label: "Breathing" },
              { icon: Headphones, label: "Audio Library" },
              { icon: LineChart, label: "Progress Tracking" },
              { icon: Smile, label: "Mood Tracker" },
              { icon: Sparkles, label: "Daily Affirmations" },
              { icon: Activity, label: "Advanced Analytics" },
              { icon: Library, label: "30-Day Library" },
              { icon: BookOpen, label: "Journal" },
              { icon: Flower2, label: "Gratitude Garden" },
              { icon: HeartPulse, label: "Body Scan" },
              { icon: Footprints, label: "Walking Meditation" },
              { icon: Focus, label: "Focus Mode" },
              { icon: Music2, label: "Soundscapes" },
              { icon: Trophy, label: "Challenges" },
              { icon: Star, label: "Rituals" },
              { icon: Award, label: "Achievements" },
              { icon: Timer, label: "Session Timer" },
              { icon: ScrollText, label: "Resources" },
              { icon: CheckCircle, label: "Certificate" },
            ].map(({ icon: I, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.025, 0.4) }}
                className="group flex items-center gap-3 p-3 md:p-4 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-[#F7F4FF] hover:border-[#C8B6F0] hover:shadow-[0_10px_30px_-12px_rgba(130,103,214,0.35)] transition-all"
              >
                <span
                  className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(130,103,214,0.12), rgba(91,127,224,0.12))" }}
                >
                  <I className="w-4 h-4 md:w-5 md:h-5" style={{ color: "#8267D6" }} />
                </span>
                <span className="font-calm-body text-xs md:text-sm font-semibold leading-tight" style={{ color: NAVY }}>
                  {label}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 max-w-4xl mx-auto">
            {[
              { icon: Shield, label: "30-Day Guarantee" },
              { icon: Clock, label: "Lifetime Access" },
              { icon: Users, label: "10,000+ Practicing" },
              { icon: Star, label: "4.9 / 5 Reviews" },
            ].map(({ icon: I, label }) => (
              <div key={label} className="flex items-center justify-center gap-2 font-calm-body text-xs sm:text-sm" style={{ color: SLATE }}>
                <I className="w-4 h-4" style={{ color: "#8267D6" }} />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <AboutSection />
        <ScienceSection />
        <CurriculumSection />
        <TestimonialsSection />
      </Suspense>

      {/* Pricing — Calm-style soft pastel sky */}
      <section id="pricing" className="py-24 md:py-32 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #F7F9FC 0%, #E8EDF6 60%, #DCE3F0 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-14">
            <p className="text-[10px] md:text-xs font-calm-body tracking-[0.35em] uppercase mb-4" style={{ color: "#8267D6" }}>Investment in Self</p>
            <h3 className="font-calm-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-5 leading-[1.1] tracking-[-0.02em]" style={{ color: NAVY }}>
              Choose your <span className="italic">path forward.</span>
            </h3>
            <p className="font-calm-body max-w-xl mx-auto leading-relaxed" style={{ color: SLATE }}>
              Every plan begins with a 7-day complimentary trial of Willow Plus. No card today. Cancel anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {/* Free */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="calm-card p-8 flex flex-col">
              <h4 className="font-calm-display text-xl font-semibold" style={{ color: NAVY }}>Discover</h4>
              <p className="font-calm-body text-sm mt-1" style={{ color: SLATE }}>A taste of the journey</p>
              <div className="my-6">
                <span className="font-calm-display text-5xl font-semibold" style={{ color: NAVY }}>$0</span>
                <span className="font-calm-body ml-2" style={{ color: SLATE }}>forever</span>
              </div>
              <ul className="space-y-3 flex-1">
                {["Days 1–7 of the 30-Day Program", "Basic narration voices", "Mood tracker & gratitude", "SOS protocols (3 free)"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-calm-body" style={{ color: NAVY_SOFT }}>
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#5B7FE0" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/sign-in" className="mt-7">
                <button className="w-full py-3.5 rounded-full border border-slate-200 font-calm-body font-semibold hover:bg-slate-50 transition-colors" style={{ color: NAVY }}>
                  Begin Free
                </button>
              </Link>
            </motion.div>

            {/* Plus Yearly — featured */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="calm-card calm-card-lg relative p-8 flex flex-col md:scale-105 md:-translate-y-2 text-white border-0"
              style={{ background: CTA_GRADIENT, boxShadow: "0 30px 70px -20px rgba(91,127,224,0.55)" }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white text-[10px] font-calm-body font-bold uppercase tracking-[0.25em] shadow-md" style={{ color: "#8267D6" }}>
                ✦ Most Chosen
              </div>
              <h4 className="font-calm-display text-xl font-semibold">Willow Plus · Yearly</h4>
              <p className="font-calm-body text-sm mt-1 text-white/85">Best value — save 58%</p>
              <div className="mt-6">
                <span className="font-calm-display text-5xl font-semibold">$79.99</span>
                <span className="font-calm-body ml-2 text-white/80">/year</span>
              </div>
              <p className="font-calm-body text-xs text-white/85 mb-5">Just $6.67/month, billed annually</p>
              <ul className="space-y-3 flex-1">
                {["All 30 days of the program", "Premium ElevenLabs voices", "AI Daily Insight & AI Coach", "Sound Bed Designer + binaurals", "Sleep stories, sound baths", "Advanced analytics & reports"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-calm-body text-white">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-white" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className="mt-7">
                <button className="w-full py-3.5 rounded-full bg-white font-calm-body font-bold transition-transform hover:scale-[1.02]" style={{ color: "#5B7FE0" }}>
                  Begin 7-Day Trial
                </button>
              </Link>
              <p className="font-calm-body text-[10px] text-white/75 mt-3 text-center">Then $79.99/year. Cancel anytime.</p>
            </motion.div>

            {/* Plus Monthly */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }} className="calm-card p-8 flex flex-col">
              <h4 className="font-calm-display text-xl font-semibold" style={{ color: NAVY }}>Willow Plus · Monthly</h4>
              <p className="font-calm-body text-sm mt-1" style={{ color: SLATE }}>Flexible, no commitment</p>
              <div className="my-6">
                <span className="font-calm-display text-5xl font-semibold" style={{ color: NAVY }}>$14.99</span>
                <span className="font-calm-body ml-2" style={{ color: SLATE }}>/month</span>
              </div>
              <ul className="space-y-3 flex-1">
                {["All 30 days of the program", "Premium ElevenLabs voices", "AI Daily Insight & AI Coach", "Sound Bed Designer", "Sleep stories, sound baths", "Cancel anytime"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-calm-body" style={{ color: NAVY_SOFT }}>
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#5B7FE0" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className="mt-7">
                <button className="w-full py-3.5 rounded-full font-calm-body font-bold text-white transition-transform hover:scale-[1.02]" style={{ background: NAVY }}>
                  Begin 7-Day Trial
                </button>
              </Link>
              <p className="font-calm-body text-[10px] mt-3 text-center" style={{ color: SLATE }}>Then $14.99/month. Cancel anytime.</p>
            </motion.div>
          </div>

          {/* Lifetime — Founders banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="calm-card calm-card-lg mt-14 overflow-hidden relative p-8 sm:p-12"
          >
            <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4" style={{ background: "rgba(130,103,214,0.12)", color: "#8267D6" }}>
                  <Sparkles className="w-3 h-3" />
                  <span className="text-[10px] font-calm-body font-bold uppercase tracking-[0.25em]">Founders Lifetime — Limited to 1,000</span>
                </div>
                <h3 className="font-calm-display text-3xl sm:text-4xl font-semibold mb-3 tracking-[-0.02em]" style={{ color: NAVY }}>
                  Pay once. <span className="italic" style={{ color: "#8267D6" }}>Practice forever.</span>
                </h3>
                <p className="font-calm-body text-sm sm:text-base max-w-xl leading-relaxed" style={{ color: SLATE }}>
                  Every feature of Willow Plus — including all future content, AI upgrades, and seasonal collections — for a single payment. Reserved for our first thousand founders.
                </p>
              </div>
              <div className="md:text-right">
                <div className="mb-4">
                  <span className="font-calm-display text-5xl sm:text-6xl font-semibold" style={{ color: NAVY }}>$199</span>
                  <span className="font-calm-body text-sm ml-2 line-through" style={{ color: SLATE }}>$599</span>
                </div>
                <Link to="/pricing">
                  <button className="w-full md:w-auto px-8 py-4 rounded-full font-calm-body font-bold text-white transition-transform hover:scale-[1.03]" style={{ background: CTA_GRADIENT, boxShadow: "0 12px 32px -8px rgba(91,127,224,0.5)" }}>
                    Claim Lifetime Access →
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Suspense fallback={null}>
        <FAQSection />
      </Suspense>

      {/* Final CTA — Calm-style ocean banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[420px] md:h-[520px]">
          <img
            src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=800&q=60"
            srcSet="https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=600&q=60 600w, https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=900&q=60 900w, https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1400&q=65 1400w"
            sizes="100vw"
            alt="Calm ocean wave at dusk"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-4xl mx-auto px-4 md:px-6 text-center w-full">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <p className="text-[10px] md:text-xs font-calm-body tracking-[0.35em] uppercase mb-4" style={{ color: "#8267D6" }}>Your Practice Begins</p>
                <h2 className="font-calm-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-[1.1] tracking-[-0.02em]" style={{ color: NAVY }}>
                  The mind you want <span className="italic">starts today.</span>
                </h2>
                <p className="font-calm-body text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed" style={{ color: NAVY_SOFT }}>
                  Join thousands cultivating presence, calm, and clarity with Willow Plus. Seven free days. No card today.
                </p>
                <Link to="/sign-in?redirect=/app">
                  <button className="px-10 py-4 rounded-full font-calm-body font-semibold text-base text-white transition-transform hover:scale-[1.03]" style={{ background: CTA_GRADIENT, boxShadow: "0 16px 44px -10px rgba(91,127,224,0.55)" }}>
                    Begin Your Free Trial
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer — Calm-style deep navy */}
      <footer className="py-14 md:py-20" style={{ background: NAVY, color: "#fff" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <LogoIcon size={44} className="rounded-2xl shadow-lg shadow-black/40" />
                <h3 className="font-calm-display text-2xl font-semibold text-white">
                  Willow <span className="italic" style={{ color: "#E9D9FF" }}>Vibes</span>
                </h3>
              </div>
              <p className="font-calm-body text-white/65 text-sm mb-4 leading-relaxed">
                Meditation rooted in science. Designed for the rhythm of real life.
              </p>
              <a href="mailto:support@willowvibes.com" className="font-calm-body text-sm hover:underline" style={{ color: "#E9D9FF" }}>
                support@willowvibes.com
              </a>
            </div>
            <div>
              <h4 className="font-calm-body font-semibold mb-4 text-xs tracking-[0.2em] uppercase text-white/70">Practice</h4>
              <ul className="space-y-2.5 text-sm text-white/70 font-calm-body">
                <li><button onClick={() => scrollToSection("curriculum")} className="hover:text-white transition-colors text-left">Curriculum</button></li>
                <li><button onClick={() => scrollToSection("science")} className="hover:text-white transition-colors text-left">Science</button></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-calm-body font-semibold mb-4 text-xs tracking-[0.2em] uppercase text-white/70">Company</h4>
              <ul className="space-y-2.5 text-sm text-white/70 font-calm-body">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><a href="mailto:support@willowvibes.com" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-calm-body font-semibold mb-4 text-xs tracking-[0.2em] uppercase text-white/70">Legal</h4>
              <ul className="space-y-2.5 text-sm text-white/70 font-calm-body">
                <li><Link to="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/legal/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row gap-3 justify-between items-center text-xs text-white/50 font-calm-body tracking-[0.1em]">
            <p>© 2026 Willow Vibes™ · Cultivated with care.</p>
            <p>Secure payments by Paddle · Merchant of Record</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

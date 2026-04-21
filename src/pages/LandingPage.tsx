import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Shield, Star, Clock, Users, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImg from "@/assets/premium-hero.jpg";
import AboutSection from "@/components/AboutSection";
import ScienceSection from "@/components/ScienceSection";
import CurriculumSection from "@/components/CurriculumSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      // Sticky CTA appears after first viewport
      setShowStickyCTA(window.scrollY > window.innerHeight * 0.9);
      const sections = ["home", "about", "science", "curriculum", "testimonials", "pricing", "faq"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    <div className="min-h-screen bg-[hsl(var(--cream))]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[hsl(var(--cream))]/95 backdrop-blur-xl shadow-[var(--shadow-soft-val)] border-b border-[hsl(var(--cream-dark))]" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button onClick={() => scrollToSection("home")} className="flex items-center gap-2 font-display text-2xl font-bold">
            <span className={scrolled ? "text-[hsl(var(--forest))]" : "text-white"}>Willow</span>
            <span className="text-[hsl(var(--gold-dark))]">Vibes</span>
          </button>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-sm font-body font-medium transition-colors ${
                  scrolled
                    ? activeSection === link.id
                      ? "text-[hsl(var(--forest))]"
                      : "text-[hsl(var(--charcoal-soft))] hover:text-[hsl(var(--forest))]"
                    : activeSection === link.id
                      ? "text-[hsl(var(--gold-light))]"
                      : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="hidden md:flex gap-3">
            <Link to="/sign-in">
              <Button
                variant="outline"
                className={`rounded-full font-body ${
                  scrolled
                    ? "border-[hsl(var(--sage))] text-[hsl(var(--forest))] hover:bg-[hsl(var(--sage-light))]"
                    : "border-white/30 text-white bg-transparent hover:bg-white/10"
                }`}
              >
                Log In
              </Button>
            </Link>
            <Link to="/pricing">
              <Button className="rounded-full font-body font-semibold bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white shadow-[var(--shadow-gold-val)] hover:scale-[1.03] transition-transform">
                Begin Your Journey
              </Button>
            </Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className={`w-6 h-6 ${scrolled ? "text-[hsl(var(--forest))]" : "text-white"}`} /> : <Menu className={`w-6 h-6 ${scrolled ? "text-[hsl(var(--forest))]" : "text-white"}`} />}
          </button>
        </div>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-[hsl(var(--cream))] border-t border-[hsl(var(--cream-dark))] p-4">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollToSection(link.id)} className="block w-full text-left px-4 py-2 text-[hsl(var(--charcoal-soft))] hover:text-[hsl(var(--forest))] font-body font-medium">
                  {link.label}
                </button>
              ))}
              <div className="pt-4 space-y-2 border-t border-[hsl(var(--cream-dark))]">
                <Link to="/sign-in" className="block w-full">
                  <Button variant="outline" className="w-full rounded-full border-[hsl(var(--sage))] text-[hsl(var(--forest))]">Log In</Button>
                </Link>
                <Link to="/pricing" className="block w-full">
                  <Button className="w-full rounded-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white">Begin Your Journey</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Sticky scroll CTA — appears after hero */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-[68px] left-0 right-0 z-40 bg-gradient-to-r from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--forest-deep))] border-b border-[hsl(var(--gold))]/30 shadow-[var(--shadow-card-val)]"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex items-center justify-center gap-3 sm:gap-6">
              <div className="hidden sm:flex items-center gap-2 text-[hsl(var(--gold-light))] text-xs font-body tracking-[0.15em] uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Founders Lifetime · $199 (was $599)</span>
              </div>
              <Link to="/pricing">
                <Button size="sm" className="rounded-full font-body font-semibold bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white text-xs px-5 py-1.5 hover:scale-[1.04] transition-transform">
                  Claim Your Spot →
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero — Cinematic Full-Bleed */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Woman meditating at sunrise overlooking mountains" className="absolute inset-0 w-full h-full object-cover scale-105" width={1920} height={1080} />
        {/* Forest-toned cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--forest-deep))]/70 via-[hsl(var(--forest-deep))]/40 to-[hsl(var(--forest-deep))]/85" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(var(--forest-deep))]/30 via-transparent to-[hsl(var(--gold))]/15" />

        {/* Floating gold particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[hsl(var(--gold-light))]/60 animate-particle"
              style={{
                left: `${10 + i * 11}%`,
                bottom: "0px",
                ["--dur" as any]: `${5 + i * 0.8}s`,
                ["--delay" as any]: `${i * 0.6}s`,
                ["--dx" as any]: `${(i % 2 === 0 ? 1 : -1) * (15 + i * 2)}px`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-[hsl(var(--gold))]/30 text-white/90 text-xs font-body tracking-[0.15em] uppercase mb-8">
              <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--gold-light))]" />
              <span>7-Day Free Trial · No Card Today</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
              Find your calm.
              <br />
              <span className="italic font-light bg-gradient-to-r from-[hsl(var(--gold-light))] via-[hsl(var(--gold))] to-[hsl(var(--gold-light))] bg-clip-text text-transparent">
                Master your mind.
              </span>
            </h1>

            <div className="w-16 h-px mx-auto mb-6 bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent" />

            <p className="font-body text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              A 30-day, science-backed meditation journey for stressed, busy minds.
              No fluff. Just proven techniques, premium narration, and an AI coach that adapts to you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/sign-in?redirect=/app">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] hover:scale-[1.03] transition-transform text-white px-10 py-7 text-base rounded-full font-body font-semibold tracking-wide shadow-[0_20px_60px_-10px_hsl(30_54%_45%/0.6)]"
                >
                  Begin Your 7-Day Journey
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-7 text-base rounded-full border-white/30 text-white bg-white/5 hover:bg-white/15 backdrop-blur-md font-body"
                onClick={() => scrollToSection("curriculum")}
              >
                Explore the Practice
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-white/65 text-xs font-body tracking-wider">
              <Shield className="w-3.5 h-3.5 text-[hsl(var(--gold-light))]" />
              <span>30-day guarantee · Cancel anytime · No card today</span>
            </div>
          </motion.div>
        </div>

        {/* Editorial Trust Strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-[hsl(var(--forest-deep))]/60 backdrop-blur-xl border-t border-[hsl(var(--gold))]/20">
          <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-white/75 text-xs font-body tracking-wider">
            <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-[hsl(var(--gold-light))]" /> 30-Day Guarantee</div>
            <div className="hidden sm:block w-px h-3 bg-white/20" />
            <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-[hsl(var(--gold-light))]" /> Lifetime Access</div>
            <div className="hidden sm:block w-px h-3 bg-white/20" />
            <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-[hsl(var(--gold-light))]" /> 10,000+ Practicing</div>
            <div className="hidden sm:block w-px h-3 bg-white/20" />
            <div className="flex items-center gap-2"><Star className="w-3.5 h-3.5 text-[hsl(var(--gold))] fill-[hsl(var(--gold))]" /> 4.9 / 5 Reviews</div>
          </div>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-20 left-1/2 -translate-x-1/2 hidden md:block">
          <button onClick={() => scrollToSection("about")} className="text-white/40 hover:text-white/80 transition-colors">
            <ChevronDown className="w-6 h-6" />
          </button>
        </motion.div>
      </section>

      <AboutSection />
      <ScienceSection />
      <CurriculumSection />
      <TestimonialsSection />

      {/* Pricing — Forest gradient, gold accents */}
      <section id="pricing" className="py-24 md:py-32 bg-gradient-to-b from-[hsl(var(--forest-deep))] via-[hsl(var(--forest-mid))] to-[hsl(var(--forest-deep))] relative overflow-hidden">
        {/* Ambient gold glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-[hsl(var(--gold))]/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[hsl(var(--sage))]/8 blur-[100px]" />

        <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }} className="text-center mb-16">
            <p className="text-[10px] md:text-xs font-body tracking-[0.3em] uppercase text-[hsl(var(--gold-light))] mb-5">— Investment in Self —</p>
            <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.1]">
              Choose your{" "}
              <span className="italic font-light bg-gradient-to-r from-[hsl(var(--gold-light))] to-[hsl(var(--gold))] bg-clip-text text-transparent">
                path forward.
              </span>
            </h3>
            <div className="w-12 h-px mx-auto mb-5 bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent" />
            <p className="font-body text-white/70 max-w-xl mx-auto leading-relaxed">
              Every plan begins with a 7-day complimentary trial of Willow Plus. No card today. Cancel anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {/* Free */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-md p-8 flex flex-col">
              <h4 className="font-display text-xl font-bold text-white">Discover</h4>
              <p className="font-body text-sm text-white/60 mt-1">A taste of the journey</p>
              <div className="my-6">
                <span className="font-display text-5xl font-bold text-white">$0</span>
                <span className="font-body text-white/60 ml-2">forever</span>
              </div>
              <ul className="space-y-3 flex-1">
                {["Days 1–7 of the 30-Day Program", "Basic narration voices", "Mood tracker & gratitude", "SOS protocols (3 free)"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/85 font-body">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--sage))] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/sign-in" className="mt-7">
                <Button variant="outline" className="w-full rounded-xl border-white/20 text-white bg-transparent hover:bg-white/10 font-body">
                  Begin Free
                </Button>
              </Link>
            </motion.div>

            {/* Plus Yearly — featured */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="relative rounded-3xl bg-gradient-to-br from-[hsl(var(--forest))]/40 via-[hsl(var(--forest-mid))]/30 to-[hsl(var(--gold))]/10 border-2 border-[hsl(var(--gold))] p-8 flex flex-col shadow-[0_30px_70px_-20px_hsl(30_54%_45%/0.5)] md:scale-105 md:-translate-y-2"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white text-[10px] font-body font-bold uppercase tracking-[0.2em] shadow-lg">
                ✦ Most Chosen
              </div>
              <h4 className="font-display text-xl font-bold text-white">Willow Plus · Yearly</h4>
              <p className="font-body text-sm text-[hsl(var(--gold-light))] mt-1">Best value — save 50%</p>
              <div className="mt-6">
                <span className="font-display text-5xl font-bold text-white">$59.99</span>
                <span className="font-body text-white/70 ml-2">/year</span>
              </div>
              <p className="font-body text-xs text-[hsl(var(--gold-light))] mb-5">Just $4.99/month, billed annually</p>
              <ul className="space-y-3 flex-1">
                {["All 30 days of the program", "Premium ElevenLabs voices", "AI Daily Insight & AI Coach", "Sound Bed Designer + binaurals", "Sleep stories, sound baths", "Advanced analytics & reports"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white font-body">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className="mt-7">
                <Button className="w-full rounded-xl bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white font-body font-bold py-6 shadow-[var(--shadow-gold-val)] hover:scale-[1.02] transition-transform">
                  Begin 7-Day Trial
                </Button>
              </Link>
              <p className="font-body text-[10px] text-white/55 mt-3 text-center tracking-wider">Then $59.99/year. Cancel anytime.</p>
            </motion.div>

            {/* Plus Monthly */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }} className="rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-md p-8 flex flex-col">
              <h4 className="font-display text-xl font-bold text-white">Willow Plus · Monthly</h4>
              <p className="font-body text-sm text-white/60 mt-1">Flexible, no commitment</p>
              <div className="my-6">
                <span className="font-display text-5xl font-bold text-white">$9.99</span>
                <span className="font-body text-white/60 ml-2">/month</span>
              </div>
              <ul className="space-y-3 flex-1">
                {["All 30 days of the program", "Premium ElevenLabs voices", "AI Daily Insight & AI Coach", "Sound Bed Designer", "Sleep stories, sound baths", "Cancel anytime"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/85 font-body">
                    <CheckCircle className="w-4 h-4 text-[hsl(var(--sage))] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className="mt-7">
                <Button className="w-full rounded-xl bg-[hsl(var(--cream))] text-[hsl(var(--forest-deep))] hover:bg-white font-body font-bold py-6">
                  Begin 7-Day Trial
                </Button>
              </Link>
              <p className="font-body text-[10px] text-white/55 mt-3 text-center tracking-wider">Then $9.99/month. Cancel anytime.</p>
            </motion.div>
          </div>

          {/* Lifetime — Founders banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 rounded-3xl overflow-hidden relative bg-gradient-to-r from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--forest-deep))] border border-[hsl(var(--gold))]/40 p-8 sm:p-12"
          >
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[hsl(var(--gold))]/15 blur-[100px]" />
            <div className="absolute -bottom-8 -left-8 w-64 h-64 rounded-full bg-[hsl(var(--sage))]/10 blur-[80px]" />
            <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--gold))]/15 border border-[hsl(var(--gold))]/40 mb-4">
                  <Sparkles className="w-3 h-3 text-[hsl(var(--gold-light))]" />
                  <span className="text-[10px] font-body font-bold text-[hsl(var(--gold-light))] uppercase tracking-[0.25em]">Founders Lifetime — Limited to 1,000</span>
                </div>
                <h3 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
                  Pay once.{" "}
                  <span className="italic font-light text-[hsl(var(--gold-light))]">Practice forever.</span>
                </h3>
                <p className="font-body text-sm sm:text-base text-white/70 max-w-xl leading-relaxed">
                  Every feature of Willow Plus — including all future content, AI upgrades, and seasonal collections — for a single payment. Reserved for our first thousand founders.
                </p>
              </div>
              <div className="md:text-right">
                <div className="mb-4">
                  <span className="font-display text-5xl sm:text-6xl font-bold text-white">$199</span>
                  <span className="font-body text-sm text-white/55 ml-2 line-through">$599</span>
                </div>
                <Link to="/pricing">
                  <Button className="w-full md:w-auto px-8 py-6 rounded-xl bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white font-body font-bold shadow-[var(--shadow-gold-val)] hover:scale-[1.03] transition-transform">
                    Claim Lifetime Access →
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <FAQSection />

      {/* Final CTA — Forest with editorial pull-quote */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--forest-mid))] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(var(--gold))]/8 blur-[120px]" />
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}>
            <p className="text-[10px] md:text-xs font-body tracking-[0.3em] uppercase text-[hsl(var(--gold-light))] mb-5">— Your Practice Begins —</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1]">
              The mind you want{" "}
              <span className="italic font-light text-[hsl(var(--gold-light))]">starts today.</span>
            </h2>
            <div className="w-12 h-px mx-auto mb-6 bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent" />
            <p className="font-body text-lg text-white/75 mb-10 max-w-xl mx-auto leading-relaxed font-light">
              Join thousands cultivating presence, calm, and clarity with Willow Plus.
              Seven free days. No card today.
            </p>
            <Link to="/sign-in?redirect=/app">
              <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white px-10 py-7 text-base rounded-full font-body font-semibold tracking-wide shadow-[0_20px_60px_-10px_hsl(30_54%_45%/0.6)] hover:scale-[1.03] transition-transform">
                Begin Your Free Trial
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(var(--forest-deep))] text-white py-14 md:py-20 border-t border-[hsl(var(--gold))]/20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <h3 className="font-display text-xl font-bold mb-4">
                Willow <span className="text-[hsl(var(--gold-light))]">Vibes</span>
              </h3>
              <p className="font-body text-white/60 text-sm mb-4 leading-relaxed">
                Meditation rooted in science. Designed for the rhythm of real life.
              </p>
              <a href="mailto:support@willowvibes.com" className="font-body text-[hsl(var(--gold-light))] hover:text-[hsl(var(--gold))] text-sm transition-colors">
                support@willowvibes.com
              </a>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4 text-sm tracking-wider uppercase text-[hsl(var(--gold-light))]">Practice</h4>
              <ul className="space-y-2.5 text-sm text-white/65 font-body">
                <li><button onClick={() => scrollToSection("curriculum")} className="hover:text-white transition-colors text-left">Curriculum</button></li>
                <li><button onClick={() => scrollToSection("science")} className="hover:text-white transition-colors text-left">Science</button></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4 text-sm tracking-wider uppercase text-[hsl(var(--gold-light))]">Company</h4>
              <ul className="space-y-2.5 text-sm text-white/65 font-body">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><a href="mailto:support@willowvibes.com" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4 text-sm tracking-wider uppercase text-[hsl(var(--gold-light))]">Legal</h4>
              <ul className="space-y-2.5 text-sm text-white/65 font-body">
                <li><Link to="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/legal/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row gap-3 justify-between items-center text-xs text-white/55 font-body tracking-wider">
            <p>© 2026 Willow Vibes™ · Cultivated with care.</p>
            <p>Secure payments by Paddle · Merchant of Record</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

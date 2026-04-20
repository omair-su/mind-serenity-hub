import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown, Shield, Star, Clock, Users, CheckCircle, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImg from "@/assets/premium-hero.jpg";
import lifestyleImg from "@/assets/premium-lifestyle.jpg";
import AboutSection from "@/components/AboutSection";
import ScienceSection from "@/components/ScienceSection";
import CurriculumSection from "@/components/CurriculumSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
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

  const valueStack = [
    { label: "30 Guided Meditation Sessions", value: "$120" },
    { label: "AI-Powered Personal Coach", value: "$80" },
    { label: "Soundscape Builder + Sound Bath", value: "$40" },
    { label: "Body Scan & Walking Meditation", value: "$35" },
    { label: "Focus Mode & Gratitude Garden", value: "$30" },
    { label: "Sleep Stories & SOS Relief", value: "$25" },
    { label: "Progress Tracking & Analytics", value: "$20" },
    { label: "Lifetime Updates — Forever", value: "Priceless" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <button onClick={() => scrollToSection("home")} className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Willow Vibes™
          </button>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => scrollToSection(link.id)} className={`text-sm font-medium transition-colors ${scrolled ? (activeSection === link.id ? "text-emerald-600" : "text-slate-600 hover:text-emerald-600") : (activeSection === link.id ? "text-emerald-300" : "text-white/80 hover:text-white")}`}>
                {link.label}
              </button>
            ))}
          </div>
          <div className="hidden md:flex gap-3">
            <Link to="/sign-in">
              <Button variant="outline" className={`rounded-full ${scrolled ? "" : "border-white/30 text-white hover:bg-white/10"}`}>Log In</Button>
            </Link>
            <Link to="/pricing">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full">Start Free Trial</Button>
            </Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className={`w-6 h-6 ${scrolled ? "text-slate-900" : "text-white"}`} /> : <Menu className={`w-6 h-6 ${scrolled ? "text-slate-900" : "text-white"}`} />}
          </button>
        </div>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-white border-t border-slate-200 p-4">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollToSection(link.id)} className="block w-full text-left px-4 py-2 text-slate-600 hover:text-emerald-600 font-medium">{link.label}</button>
              ))}
              <div className="pt-4 space-y-2 border-t border-slate-200">
                <Link to="/sign-in" className="block w-full"><Button variant="outline" className="w-full rounded-full">Log In</Button></Link>
                <Link to="/pricing" className="block w-full"><Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full">Start Free Trial</Button></Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero — Full-Bleed Image */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Woman meditating at sunrise in a luxurious room overlooking mountains" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm mb-8">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Limited Time — Save 67%</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
              Master Your Mind<br />
              <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">in 30 Days</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              The science-backed meditation system that actually works for stressed, busy people. No spiritual fluff. Just proven techniques from neuroscience research.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/app">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-10 py-7 text-lg rounded-full shadow-2xl shadow-emerald-500/30">
                  Start Now — $97
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-7 text-lg rounded-full border-white/30 text-white hover:bg-white/10 backdrop-blur-sm" onClick={() => scrollToSection("curriculum")}>
                See What's Inside
              </Button>
            </div>

            <div className="flex items-center gap-2 justify-center text-white/60 text-sm">
              <span className="line-through">$297</span>
              <span className="text-white font-bold text-lg">$97</span>
              <span>one-time payment · lifetime access</span>
            </div>
          </motion.div>
        </div>

        {/* Trust Strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-white/70 text-sm">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /> 30-Day Guarantee</div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-400" /> Lifetime Access</div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" /> 10,000+ Students</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9/5 Rating</div>
          </div>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-20 left-1/2 -translate-x-1/2">
          <button onClick={() => scrollToSection("about")} className="text-white/40 hover:text-white/70 transition-colors">
            <ChevronDown className="w-6 h-6" />
          </button>
        </motion.div>
      </section>

      <AboutSection />
      <ScienceSection />
      <CurriculumSection />
      <TestimonialsSection />

      {/* Pricing Section — 3 tiers + Lifetime banner */}
      <section id="pricing" className="py-24 md:py-32 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
            <h2 className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-emerald-400 mb-4">Pricing</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find your calm.<br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Choose your path.</span>
            </h3>
            <p className="text-white/70 max-w-xl mx-auto">Every plan starts with a 7-day free trial of Plus. Cancel anytime.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {/* Free */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl bg-white/5 border border-white/10 p-7 flex flex-col">
              <h4 className="text-xl font-bold text-white">Free</h4>
              <p className="text-sm text-white/60 mt-1">Start your journey</p>
              <div className="my-5"><span className="text-5xl font-bold text-white">$0</span><span className="text-white/60 ml-2">forever</span></div>
              <ul className="space-y-2.5 flex-1">
                {["Days 1–7 of the 30-Day Program","Basic narration voices","Mood tracker & gratitude","SOS protocols (3 free)"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/85"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <Link to="/sign-in" className="mt-6"><Button variant="outline" className="w-full rounded-xl border-white/20 text-white hover:bg-white/10">Start free</Button></Link>
            </motion.div>

            {/* Plus Yearly — featured */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="relative rounded-3xl bg-gradient-to-br from-emerald-600/30 via-teal-600/20 to-amber-500/10 border-2 border-amber-400 p-7 flex flex-col shadow-[0_25px_60px_-15px_rgba(245,158,11,0.4)] md:scale-105 md:-translate-y-2">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">★ Most Popular</div>
              <h4 className="text-xl font-bold text-white">Plus Yearly</h4>
              <p className="text-sm text-amber-300 mt-1">Best value — save 50%</p>
              <div className="mt-5"><span className="text-5xl font-bold text-white">$59.99</span><span className="text-white/70 ml-2">/year</span></div>
              <p className="text-xs text-amber-300 mb-4">Just $4.99/month, billed yearly</p>
              <ul className="space-y-2.5 flex-1">
                {["All 30 days of the program","Premium ElevenLabs voices","AI Daily Insight & AI Coach","Sound Bed Designer + binaurals","Sleep stories, sound baths","Advanced analytics & PDF reports"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white"><CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <Link to="/pricing" className="mt-6"><Button className="w-full rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white font-bold py-6 shadow-lg">Start 7-day free trial</Button></Link>
              <p className="text-[10px] text-white/60 mt-2 text-center">Then $59.99/year. Cancel anytime.</p>
            </motion.div>

            {/* Plus Monthly */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="rounded-3xl bg-white/5 border border-white/10 p-7 flex flex-col">
              <h4 className="text-xl font-bold text-white">Plus Monthly</h4>
              <p className="text-sm text-white/60 mt-1">Flexible, no commitment</p>
              <div className="my-5"><span className="text-5xl font-bold text-white">$9.99</span><span className="text-white/60 ml-2">/month</span></div>
              <ul className="space-y-2.5 flex-1">
                {["All 30 days of the program","Premium ElevenLabs voices","AI Daily Insight & AI Coach","Sound Bed Designer","Sleep stories, sound baths","Cancel anytime"].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/85"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <Link to="/pricing" className="mt-6"><Button className="w-full rounded-xl bg-white text-slate-900 hover:bg-white/90 font-bold py-6">Start 7-day free trial</Button></Link>
              <p className="text-[10px] text-white/60 mt-2 text-center">Then $9.99/month. Cancel anytime.</p>
            </motion.div>
          </div>

          {/* Lifetime banner */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="mt-10 rounded-3xl overflow-hidden relative bg-gradient-to-r from-slate-800 via-emerald-900/40 to-slate-800 border border-amber-400/40 p-6 sm:p-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 mb-3">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Founders Lifetime — Limited</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Pay once. Use forever.</h3>
                <p className="text-sm sm:text-base text-white/70 max-w-xl leading-relaxed">
                  Get every feature of Willow Plus — including all future content and AI upgrades — for a single payment. Available to the first 1,000 founders only.
                </p>
              </div>
              <div className="md:text-right">
                <div className="mb-3">
                  <span className="text-4xl sm:text-5xl font-bold text-white">$199</span>
                  <span className="text-sm text-white/60 ml-2 line-through">$599</span>
                </div>
                <Link to="/pricing"><Button className="w-full md:w-auto px-8 py-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white font-bold shadow-lg">Claim Lifetime Access</Button></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <FAQSection />

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Find your calm. Start today.</h2>
            <p className="text-lg text-emerald-50 mb-8 max-w-xl mx-auto">
              Join thousands transforming their minds with Willow Plus. 7-day free trial. Cancel anytime.
            </p>
            <Link to="/pricing">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 px-10 py-7 text-lg rounded-full font-semibold shadow-xl">
                Start Your Free Trial
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Willow Vibes™</h3>
              <p className="text-slate-400 text-sm mb-3">Meditation backed by science. Designed for real life.</p>
              <a href="mailto:support@willowvibes.com" className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">support@willowvibes.com</a>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => scrollToSection("curriculum")} className="hover:text-white transition-colors text-left">Curriculum</button></li>
                <li><button onClick={() => scrollToSection("science")} className="hover:text-white transition-colors text-left">Science</button></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><a href="mailto:support@willowvibes.com" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/legal/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row gap-3 justify-between items-center text-sm text-slate-400">
            <p>&copy; 2026 Willow Vibes™. All rights reserved.</p>
            <p className="text-xs">Secure payments by Paddle · Merchant of Record</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

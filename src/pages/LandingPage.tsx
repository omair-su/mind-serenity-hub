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
            <Link to="/app">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full">Get Access — $97</Button>
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
                <Link to="/app" className="block w-full"><Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full">Get Access — $97</Button></Link>
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32 bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-emerald-400 mb-4">One-Time Investment</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need.<br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">One Price. Forever.</span>
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Value Stack */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h4 className="text-lg font-semibold text-white mb-6">What's included:</h4>
              <div className="space-y-3">
                {valueStack.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-white/80 text-sm">{item.label}</span>
                    </div>
                    <span className="text-white/40 text-sm line-through">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-emerald-500/30">
                <span className="text-white font-semibold">Total Value</span>
                <span className="text-white/60 line-through text-lg">$350+</span>
              </div>
            </motion.div>

            {/* Pricing Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
                  Save 67%
                </div>

                <div className="text-center mb-8">
                  <div className="text-white/50 text-lg line-through mb-1">$297</div>
                  <div className="text-6xl md:text-7xl font-bold text-white mb-2">
                    $97
                  </div>
                  <div className="text-emerald-300 font-medium">One-time payment · Lifetime access</div>
                </div>

                <Link to="/app" className="block mb-6">
                  <Button size="lg" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-7 text-lg rounded-xl shadow-2xl shadow-emerald-500/20 font-semibold">
                    <Zap className="w-5 h-5 mr-2" />
                    Get Instant Access
                  </Button>
                </Link>

                <div className="flex flex-col items-center gap-3 text-white/50 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <span>No subscriptions. No hidden fees. Ever.</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Lifestyle Image */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-16">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src={lifestyleImg} alt="Premium meditation lifestyle setup" className="w-full aspect-[3/1] object-cover" width={1200} height={800} loading="lazy" />
            </div>
          </motion.div>
        </div>
      </section>

      <FAQSection />

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Your Mind Is Worth $97</h2>
            <p className="text-lg text-emerald-50 mb-8 max-w-xl mx-auto">
              Join 10,000+ people who stopped scrolling and started transforming. 30-day guarantee.
            </p>
            <Link to="/app">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 px-10 py-7 text-lg rounded-full font-semibold shadow-xl">
                Start Your 30-Day Journey — $97
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
              <p className="text-slate-400 text-sm">Meditation backed by science. Designed for real life.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => scrollToSection("curriculum")} className="hover:text-white transition-colors text-left">Curriculum</button></li>
                <li><button onClick={() => scrollToSection("science")} className="hover:text-white transition-colors text-left">Science</button></li>
                <li><button onClick={() => scrollToSection("pricing")} className="hover:text-white transition-colors text-left">Pricing</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2026 Willow Vibes™. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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

      // Update active section based on scroll position
      const sections = ["home", "about", "science", "curriculum", "testimonials", "faq"];
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
    { label: "About", id: "about", isExternal: true },
    { label: "Science", id: "science" },
    { label: "Curriculum", id: "curriculum" },
    { label: "Testimonials", id: "testimonials" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home")}
            className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
          >
            Willow Vibes™
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isExternal ? (
                <Link
                  key={link.id}
                  to="/about"
                  className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === link.id
                      ? "text-emerald-600"
                      : "text-slate-600 hover:text-emerald-600"
                  }`}
                >
                  {link.label}
                </button>
              )
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex gap-4">
            <Link to="/sign-in">
              <Button variant="outline" className="rounded-full">
                Log In
              </Button>
            </Link>
            <Link to="/app">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full">
                Try for Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-slate-900" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t border-slate-200 p-4"
          >
            <div className="space-y-4">
              {navLinks.map((link) => (
                link.isExternal ? (
                  <Link
                    key={link.id}
                    to="/about"
                    className="block w-full text-left px-4 py-2 text-slate-600 hover:text-emerald-600 font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="block w-full text-left px-4 py-2 text-slate-600 hover:text-emerald-600 font-medium"
                  >
                    {link.label}
                  </button>
                )
              ))}
              <div className="pt-4 space-y-2 border-t border-slate-200">
                <Link to="/sign-in" className="block w-full">
                  <Button variant="outline" className="w-full rounded-full">
                    Log In
                  </Button>
                </Link>
                <Link to="/app" className="block w-full">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full">
                    Try for Free
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-24 md:pt-32 pb-20 md:pb-28 bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Meditation for<br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Real People
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Transform your relationship with stress in 30 days. No spiritual fluff. Just science-backed practices that work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/app">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 text-lg rounded-full"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg rounded-full"
                onClick={() => scrollToSection("science")}
              >
                Learn More
              </Button>
            </div>
            <p className="text-sm text-slate-500 mt-6">
              30-day money-back guarantee • No credit card required
            </p>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 md:mt-24"
          >
            <div className="bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 rounded-3xl aspect-video flex items-center justify-center shadow-2xl">
              <div className="text-center">
                <div className="text-8xl mb-4">🧘‍♀️</div>
                <p className="text-slate-600 font-medium">Your meditation journey starts here</p>
              </div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={() => scrollToSection("about")}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Science Section */}
      <ScienceSection />

      {/* Curriculum Section */}
      <CurriculumSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Willow Vibes™</h3>
              <p className="text-slate-400 text-sm">
                Meditation backed by science. Designed for real life.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => scrollToSection("curriculum")} className="hover:text-white transition-colors text-left">Curriculum</button></li>
                <li><button onClick={() => scrollToSection("science")} className="hover:text-white transition-colors text-left">Science</button></li>
                <li><button onClick={() => scrollToSection("testimonials")} className="hover:text-white transition-colors text-left">Testimonials</button></li>
                <li><button onClick={() => scrollToSection("faq")} className="hover:text-white transition-colors text-left">FAQ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
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

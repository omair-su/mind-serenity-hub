import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Brain, Heart, Sparkles, Users, ArrowRight, Star, BookOpen, Shield } from "lucide-react";
import WillowLogo from "@/components/WillowLogo";
import founderImg from "@/assets/about-meditation.jpg";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Stats Data ── */
const stats = [
  { value: "10,000+", label: "Students Transformed" },
  { value: "30+", label: "Research Citations" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "89%", label: "Complete the Program" },
];

/* ── Mission Pillars ── */
const missionPillars = [
  {
    icon: Brain,
    badge: "Evidence-Based",
    title: "Science Over Spiritual Fluff",
    text: "Every practice backed by peer-reviewed research. No pseudoscience. No claims we can't prove. Just neuroscience applied to real life.",
  },
  {
    icon: Heart,
    badge: "Accessible Pricing",
    title: "One-Time Payment, Forever Access",
    text: "We don't believe in meditation subscriptions. Pay once, access forever. No monthly fees. No upsells. No premium tiers holding back basic features.",
  },
  {
    icon: Shield,
    badge: "Real Talk",
    title: "Honesty Over Marketing",
    text: "We won't promise you'll levitate or achieve enlightenment. We will promise you'll handle stress better, sleep more deeply, and feel more grounded. That's it. That's enough.",
  },
];

/* ── Values ── */
const values = [
  {
    icon: Sparkles,
    title: "Effectiveness Over Tradition",
    text: "If a technique works, we teach it. If it doesn't, we skip it. We're not attached to ancient traditions if modern neuroscience found something better.",
  },
  {
    icon: Star,
    title: "Progress Over Perfection",
    text: "Miss a day? That's life. Fell asleep during meditation? Your body needed rest. We celebrate showing up, not being perfect.",
  },
  {
    icon: BookOpen,
    title: "Science Over Belief",
    text: "You don't have to believe in chakras or energy fields. You just have to trust that slowing your breath calms your nervous system. Because it does.",
  },
  {
    icon: Users,
    title: "Accessibility Over Exclusivity",
    text: "Meditation isn't for special people who have their lives together. It's for stressed, busy, overwhelmed humans trying to feel okay. That's everyone.",
  },
];

export default function AboutPage() {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-background font-body">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-[0_1px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[72px] px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <WillowLogo variant="horizontal" size="sm" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="font-body text-sm font-medium text-primary transition-colors">About</Link>
            <Link to="/sign-in" className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Log In</Link>
            <Link
              to="/app"
              className="px-6 py-2.5 text-sm font-body font-semibold rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all"
            >
              Try for Free
            </Link>
          </div>
          <Link to="/app" className="md:hidden px-5 py-2 text-sm font-body font-semibold rounded-full bg-primary text-primary-foreground">
            Start Free
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-[72px]">
        <div className="bg-gradient-to-b from-secondary to-background py-20 md:py-24">
          <div className="max-w-[900px] mx-auto px-6 text-center fade-up">
            <p className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-primary/70 mb-6">
              About Willow Vibes™
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-[52px] text-foreground leading-tight mb-8">
              Meditation for Real People{" "}
              <span className="block mt-1">with Real Stress</span>
            </h1>
            <p className="text-lg md:text-xl text-charcoal-soft leading-relaxed max-w-[700px] mx-auto font-body">
              We're not here to help you achieve enlightenment or empty your mind.
              We're here to give you tools that actually work when life feels overwhelming.
            </p>
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="bg-card py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center fade-up">
            {/* Image */}
            <div className="w-full lg:w-[42%] flex-shrink-0">
              <div className="relative">
                {/* Decorative offset border */}
                <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl border-2 border-primary/30 z-0" />
                <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.18)] z-10">
                  <img
                    src={founderImg}
                    alt="Meditation practice — Willow Vibes founder"
                    className="w-full h-auto object-cover"
                    width={680}
                    height={1000}
                  />
                  {/* Subtle bottom gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  {/* Caption badge */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-body font-semibold text-foreground tracking-wide">
                        Where it all began
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="w-full lg:w-[58%]">
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8 leading-tight">
                Built by Someone Who Couldn't Meditate
              </h2>
              <div className="space-y-5 text-base md:text-[17px] text-card-foreground/80 leading-[2] font-body">
                <p className="font-medium text-card-foreground">Willow Vibes started from frustration.</p>
                <p>
                  I tried everything: Apps that told me to "just breathe." Books that promised
                  enlightenment in 10 minutes. Courses that felt more like spiritual homework than help.
                </p>
                <p>
                  Nothing worked. My mind still raced. I still couldn't sleep. Stress still won.
                </p>
                <p>
                  So I built what I needed: a meditation program that doesn't require you to be calm
                  already. One that works <em>with</em> racing thoughts, not against them. One backed by
                  actual neuroscience, not just good vibes.
                </p>
                <p className="font-medium text-card-foreground">
                  30 days. Real practices. Real results. No spiritual pressure. No judgment. Just tools that work.
                </p>
                <p className="font-medium text-card-foreground">That's Willow Vibes™.</p>
              </div>
              <p className="mt-8 text-lg italic text-primary font-display tracking-wide">
                — Michael, Founder
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Mission ── */}
      <section className="py-20 md:py-24" style={{ background: "hsl(30 40% 94%)" }}>
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-16 fade-up">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Our Mission: Democratize Mental Wellness
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 fade-up">
            {missionPillars.map((p) => (
              <div
                key={p.title}
                className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-soft border border-border/50 hover:shadow-card transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <p.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="inline-block text-[10px] font-body font-bold tracking-widest uppercase text-primary/70 bg-primary/8 px-3 py-1 rounded-full mb-4">
                  {p.badge}
                </span>
                <h3 className="font-display text-xl text-foreground mb-3">{p.title}</h3>
                <p className="text-[15px] text-card-foreground/70 leading-relaxed font-body">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="bg-card py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-16 fade-up">
            <h2 className="font-display text-3xl md:text-4xl text-foreground">
              What We Stand For
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 fade-up">
            {values.map((v) => (
              <div
                key={v.title}
                className="group rounded-2xl border border-border/60 p-8 hover:shadow-card hover:border-primary/20 transition-all duration-300 bg-background/50"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-accent/30 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-3">{v.title}</h3>
                <p className="text-[15px] text-card-foreground/70 leading-[1.9] font-body">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── By The Numbers ── */}
      <section className="bg-gradient-to-br from-primary via-primary to-forest-deep py-16 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6 fade-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-2">
                  {s.value}
                </p>
                <p className="text-sm md:text-base font-body text-primary-foreground/80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-card py-20 md:py-24">
        <div className="max-w-[700px] mx-auto px-6 text-center fade-up">
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-5">
            Ready to Start?
          </h2>
          <p className="text-lg text-card-foreground/70 font-body mb-10 leading-relaxed">
            Join 10,000+ people who transformed their relationship with stress.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-body font-semibold text-base transition-all duration-300 hover:opacity-90 hover:scale-[1.02] shadow-gold"
            style={{ background: "linear-gradient(135deg, hsl(30 54% 65%), hsl(43 86% 38%))" , color: "#fff" }}
          >
            Begin Your 30-Day Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-6 text-sm text-muted-foreground font-body">
            30-day money-back guarantee · Instant access
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 py-10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <WillowLogo variant="horizontal" size="xs" />
          <p className="text-xs text-muted-foreground font-body">
            © 2025 Willow Vibes™. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

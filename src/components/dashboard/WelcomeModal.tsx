// First-run welcome modal. Shown once per user on first dashboard visit.
// Walks them through a tiny 3-step intro, then pins them to Day 1.
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Leaf, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";

const STORAGE_KEY = "wv-welcome-shown-v1";
const easing = [0.25, 0.1, 0.25, 1] as const;

export default function WelcomeModal() {
  const { profile } = useProfile();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Only show once per device, and only after profile loads with a userId.
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen && profile.userId) {
      const t = window.setTimeout(() => setOpen(true), 600);
      return () => window.clearTimeout(t);
    }
  }, [profile.userId]);

  const close = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const firstName = (profile.name || "friend").split(" ")[0];

  const steps = [
    {
      eyebrow: "— Welcome Home —",
      title: `Hello, ${firstName}.`,
      titleAccent: "Your practice begins.",
      body: "Willow is a 30-day journey designed to settle the mind, soften the body, and bring you back to yourself. One small ritual at a time.",
      cta: "Show me how",
    },
    {
      eyebrow: "— A Gentle Rhythm —",
      title: "Just 10 minutes",
      titleAccent: "a day.",
      body: "Each day you'll find a guided session, a tiny reflection, and a quiet pause. No streaks to fear — we even give you weekly freezes if life happens.",
      cta: "I'm ready",
    },
    {
      eyebrow: "— Your First Step —",
      title: "Let's begin with",
      titleAccent: "Day 1.",
      body: "Find a comfortable seat. Soft light. A glass of water nearby. When you're ready, we'll meet you there.",
      cta: "Begin Day 1",
    },
  ];

  const current = steps[step];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-[hsl(var(--forest-deep))]/85 backdrop-blur-md"
            onClick={close}
            aria-label="Close welcome"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.5, ease: easing }}
            className="relative w-full max-w-lg rounded-3xl bg-[hsl(var(--cream))] border border-[hsl(var(--gold))]/30 shadow-[0_30px_80px_-20px_hsl(139_40%_10%/0.5)] overflow-hidden"
          >
            {/* Ambient glows */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[hsl(var(--gold))]/15 blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-12 w-56 h-56 rounded-full bg-[hsl(var(--sage))]/20 blur-[80px] pointer-events-none" />

            {/* Drifting leaves */}
            <span className="absolute top-6 right-10 text-[hsl(var(--sage-dark))]/30 animate-drift-2 text-xl pointer-events-none">🍃</span>
            <span className="absolute bottom-10 right-16 text-[hsl(var(--gold))]/40 animate-drift text-lg pointer-events-none">✦</span>

            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[hsl(var(--cream-dark))]/60 hover:bg-[hsl(var(--cream-dark))] flex items-center justify-center text-[hsl(var(--charcoal-soft))]"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative p-8 sm:p-10">
              {/* Logo mark */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(var(--forest))] to-[hsl(var(--forest-deep))] flex items-center justify-center shadow-[var(--shadow-soft-val)]">
                  <Leaf className="w-7 h-7 text-[hsl(var(--gold-light))]" />
                </div>
              </div>

              {/* Step content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: easing }}
                  className="text-center"
                >
                  <p className="text-[10px] font-body tracking-[0.3em] uppercase text-[hsl(var(--gold-dark))] mb-4">
                    {current.eyebrow}
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-[hsl(var(--forest-deep))] leading-[1.1] mb-3">
                    {current.title}
                    <br />
                    <span className="italic font-light text-[hsl(var(--gold-dark))]">
                      {current.titleAccent}
                    </span>
                  </h2>
                  <div className="w-10 h-px mx-auto mb-5 bg-gradient-to-r from-transparent via-[hsl(var(--gold))] to-transparent" />
                  <p className="font-body text-[hsl(var(--charcoal-soft))] leading-relaxed text-base mb-8 max-w-sm mx-auto">
                    {current.body}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Step dots */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-400 ${
                      i === step
                        ? "w-8 bg-[hsl(var(--gold))]"
                        : i < step
                          ? "w-1.5 bg-[hsl(var(--gold))]/60"
                          : "w-1.5 bg-[hsl(var(--cream-dark))]"
                    }`}
                  />
                ))}
              </div>

              {/* CTA */}
              {step < steps.length - 1 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="w-full rounded-xl bg-gradient-to-r from-[hsl(var(--forest))] to-[hsl(var(--forest-deep))] text-white font-body font-semibold py-6 hover:scale-[1.02] transition-transform"
                >
                  {current.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Link to="/app/day/1" onClick={close} className="block">
                  <Button className="w-full rounded-xl bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white font-body font-semibold py-6 shadow-[var(--shadow-gold-val)] hover:scale-[1.02] transition-transform">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {current.cta}
                  </Button>
                </Link>
              )}

              <button
                onClick={close}
                className="w-full text-center mt-3 text-xs font-body text-[hsl(var(--charcoal-soft))] hover:text-[hsl(var(--forest))] tracking-wider"
              >
                I'll explore on my own
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

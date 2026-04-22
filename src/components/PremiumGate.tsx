// PremiumGate — wrap premium-only page content. Free users see a luxurious
// preview teaser + upgrade CTA instead of the actual feature. Premium users
// (or users with an active Paddle subscription) see children unchanged.
//
// Usage:
//   <PremiumGate
//     feature="Sleep Stories"
//     description="Drift away with cinematic narrated tales..."
//     icon={Moon}
//     gradient="from-indigo-500/20 to-violet-500/15"
//     previewItems={["Lavender Fields of Provence", "The Enchanted Library", ...]}
//   >
//     <ActualPageContent />
//   </PremiumGate>

import { Loader2, Crown, Sparkles, Check, Lock, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { useIsPremium } from "@/hooks/useIsPremium";

interface PremiumGateProps {
  feature: string;
  description: string;
  icon: LucideIcon;
  gradient?: string; // tailwind gradient classes for the icon backdrop
  previewItems?: string[]; // bullet list of what's inside
  perks?: string[]; // override default perks list
  children: React.ReactNode;
}

const DEFAULT_PERKS = [
  "Unlock the entire premium library",
  "AI Coach with Claude Sonnet 4.5",
  "Advanced analytics & insights",
  "Premium voices & narration",
  "Offline downloads & priority support",
];

export default function PremiumGate({
  feature,
  description,
  icon: Icon,
  gradient = "from-gold/20 to-amber-500/10",
  previewItems = [],
  perks = DEFAULT_PERKS,
  children,
}: PremiumGateProps) {
  const { isPremium, loading } = useIsPremium();

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (isPremium) return <>{children}</>;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Hero teaser */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--charcoal))] shadow-2xl"
        >
          {/* Decorative glows */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gold/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[hsl(var(--sage))]/30 blur-3xl" />

          <div className="relative p-8 sm:p-12 text-center">
            {/* Plus chip */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 mb-5">
              <Sparkles className="w-3 h-3 text-gold" />
              <span className="text-[10px] font-body font-bold text-gold uppercase tracking-widest">
                Willow Plus
              </span>
            </div>

            {/* Big icon */}
            <div className={`mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 border border-white/15 shadow-xl backdrop-blur-sm`}>
              <Icon className="w-12 h-12 text-white" />
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
              {feature}
            </h1>
            <p className="text-base sm:text-lg font-body text-white/80 max-w-xl mx-auto leading-relaxed">
              {description}
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-center">
              <Link
                to="/pricing"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-gold via-gold-dark to-amber-700 text-white font-body font-bold text-sm shadow-[0_15px_30px_-8px_rgba(212,175,55,0.5)] hover:-translate-y-0.5 transition-all"
              >
                <Crown className="w-4 h-4" />
                Unlock Willow Plus
              </Link>
              <Link
                to="/app"
                className="text-sm font-body text-white/70 hover:text-white px-4 py-3 transition-colors"
              >
                Maybe later
              </Link>
            </div>
            <p className="mt-4 text-[11px] font-body text-white/50">
              7-day free trial · Cancel anytime
            </p>
          </div>
        </motion.div>

        {/* Two-column preview + perks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* What's inside */}
          {previewItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-gold" />
                <h3 className="font-display text-lg font-bold text-foreground">
                  What's inside
                </h3>
              </div>
              <ul className="space-y-3">
                {previewItems.slice(0, 6).map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm font-body text-foreground/90"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold/20 to-amber-500/10 flex items-center justify-center flex-shrink-0 border border-gold/20">
                      <Sparkles className="w-3.5 h-3.5 text-gold" />
                    </div>
                    <span className="pt-1">{item}</span>
                  </li>
                ))}
              </ul>
              {/* Bottom blur fade to suggest "more" */}
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none" />
            </motion.div>
          )}

          {/* Plus perks */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-card via-card to-gold/5 p-6 ${
              previewItems.length === 0 ? "md:col-span-2" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-4 h-4 text-gold" />
              <h3 className="font-display text-lg font-bold text-foreground">
                Willow Plus includes
              </h3>
            </div>
            <ul className="space-y-2.5">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-start gap-2.5 text-sm font-body text-foreground"
                >
                  <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Final upgrade strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl border border-border/60 bg-card p-6 text-center"
        >
          <p className="text-sm font-body text-muted-foreground mb-3">
            Join thousands transforming their daily wellbeing.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-body font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            See plans & pricing
            <Crown className="w-4 h-4 text-gold" />
          </Link>
        </motion.div>
      </div>
    </AppLayout>
  );
}

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Crown, Sparkles, ArrowLeft, Infinity as InfinityIcon, Loader2 } from "lucide-react";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { usePageSEO } from "@/hooks/usePageSEO";

const FREE_FEATURES = [
  "Days 1–7 of the 30-Day Program",
  "Basic narration voices (Sarah, Matilda)",
  "Mood tracker & gratitude journal",
  "SOS protocols (3 free)",
  "Limited library access",
];

const PLUS_FEATURES = [
  "All 30 days of the flagship program",
  "Premium ElevenLabs voices (Aria, George)",
  "AI Daily Insight & AI Coach (Claude)",
  "Full Sound Bed Designer + binaural beats",
  "Sleep stories, sound baths, body scans",
  "Advanced analytics & PDF reports",
  "All SOS protocols & Crisis Concierge",
  "Offline downloads",
  "New content every week",
];

export default function PricingPage() {
  const { openCheckout, loading } = usePaddleCheckout();
  usePageSEO({
    title: "Willow Vibes Pricing — Plus Monthly, Yearly & Lifetime Access",
    description:
      "Try Willow Plus free for 7 days. $9.99/month, $59.99/year, or $199 lifetime. Cancel anytime. 14-day money-back guarantee. Payments by Paddle.",
    canonical: "https://www.willowvibes.com/pricing",
  });
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-[hsl(var(--forest-deep))]/10">
      {/* Launch banner */}
      <div className="bg-gradient-to-r from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--gold-dark))] text-white text-center py-3 px-4">
        <p className="text-xs sm:text-sm font-body font-semibold tracking-wide">
          ✨ Launch Offer — Lifetime access just <span className="text-[hsl(var(--gold))] font-bold">$199</span> for the first 1,000 founders
        </p>
      </div>

      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 text-center pt-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 mb-4">
            <Sparkles className="w-3 h-3 text-gold" />
            <span className="text-[10px] font-body font-bold text-gold uppercase tracking-widest">Willow Plus</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
            Find your calm.<br />Choose your path.
          </h1>
          <p className="text-base sm:text-lg font-body text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Every plan starts with a 7-day free trial of Plus. Cancel anytime. No hidden fees.
          </p>
        </motion.div>
      </section>

      {/* Pricing cards */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {/* FREE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-card border border-border p-6 sm:p-8 flex flex-col"
          >
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-foreground">Free</h3>
              <p className="text-sm font-body text-muted-foreground mt-1">Start your journey</p>
              <div className="mt-5 mb-6">
                <span className="font-display text-5xl font-bold text-foreground">$0</span>
                <span className="text-sm font-body text-muted-foreground ml-2">forever</span>
              </div>
              <ul className="space-y-2.5">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-body text-foreground">
                    <Check className="w-4 h-4 text-[hsl(var(--sage))] flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/sign-in"
              className="mt-6 block text-center w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-body font-semibold text-sm hover:bg-secondary/80 transition-colors"
            >
              Start free
            </Link>
          </motion.div>

          {/* PLUS YEARLY (most popular) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-3xl bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--charcoal))] border-2 border-gold p-6 sm:p-8 flex flex-col shadow-[0_25px_60px_-15px_rgba(212,175,55,0.4)] md:scale-105 md:-translate-y-2"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-gold to-gold-dark text-white text-[10px] font-body font-bold uppercase tracking-widest shadow-lg">
              ★ Most Popular
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-gold" />
                <h3 className="font-display text-xl font-bold text-white">Plus Yearly</h3>
              </div>
              <p className="text-sm font-body text-white/70 mt-1">Best value — save 50%</p>
              <div className="mt-5 mb-1">
                <span className="font-display text-5xl font-bold text-white">$59.99</span>
                <span className="text-sm font-body text-white/70 ml-2">/year</span>
              </div>
              <p className="text-xs font-body text-gold mb-5">Just $4.99/month, billed yearly</p>
              <ul className="space-y-2.5">
                {PLUS_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-body text-white">
                    <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => openCheckout({ priceId: "willow_plus_yearly" })}
              disabled={loading}
              className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-gold via-gold-dark to-amber-700 text-white font-body font-bold text-sm shadow-[0_15px_30px_-8px_rgba(212,175,55,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Start 7-day free trial
            </button>
            <p className="text-[10px] font-body text-center text-white/60 mt-2">
              Then $59.99/year. Cancel anytime.
            </p>
          </motion.div>

          {/* PLUS MONTHLY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl bg-card border border-border p-6 sm:p-8 flex flex-col"
          >
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-foreground">Plus Monthly</h3>
              <p className="text-sm font-body text-muted-foreground mt-1">Flexible, no commitment</p>
              <div className="mt-5 mb-6">
                <span className="font-display text-5xl font-bold text-foreground">$9.99</span>
                <span className="text-sm font-body text-muted-foreground ml-2">/month</span>
              </div>
              <ul className="space-y-2.5">
                {PLUS_FEATURES.slice(0, 6).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-body text-foreground">
                    <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
                <li className="text-xs font-body text-muted-foreground italic pl-6">…and everything in Plus</li>
              </ul>
            </div>
            <button
              onClick={() => openCheckout({ priceId: "willow_plus_monthly" })}
              disabled={loading}
              className="mt-6 w-full py-3 rounded-xl bg-foreground text-background font-body font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Start 7-day free trial
            </button>
            <p className="text-[10px] font-body text-center text-muted-foreground mt-2">
              Then $9.99/month. Cancel anytime.
            </p>
          </motion.div>
        </div>

        {/* Lifetime banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 rounded-3xl overflow-hidden relative bg-gradient-to-r from-[hsl(var(--charcoal))] via-[hsl(var(--forest-deep))] to-[hsl(var(--charcoal))] border border-gold/40 p-6 sm:p-10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 mb-3">
                <InfinityIcon className="w-3 h-3 text-gold" />
                <span className="text-[10px] font-body font-bold text-gold uppercase tracking-widest">Founders Lifetime — Limited</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                Pay once. Use forever.
              </h3>
              <p className="text-sm sm:text-base font-body text-white/70 max-w-xl leading-relaxed">
                Get every feature of Willow Plus — including all future content and AI upgrades — for a single payment. Available to the first 1,000 founders only.
              </p>
            </div>
            <div className="md:text-right">
              <div className="mb-3">
                <span className="font-display text-4xl sm:text-5xl font-bold text-white">$199</span>
                <span className="text-sm font-body text-white/60 ml-2 line-through">$599</span>
              </div>
              <button
                onClick={() => openCheckout({ priceId: "willow_lifetime_onetime" })}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold via-gold-dark to-amber-700 text-white font-body font-bold text-sm shadow-[0_15px_30px_-8px_rgba(212,175,55,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Claim Lifetime Access
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust + policies */}
      <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
        <p className="text-xs font-body text-muted-foreground mb-4">
          Secure payments processed by Paddle. 14-day money-back guarantee.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-body text-muted-foreground">
          <Link to="/legal/terms" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">Terms of Service</Link>
          <Link to="/legal/privacy" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">Privacy Policy</Link>
          <Link to="/legal/refund" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">Refund Policy</Link>
        </div>
      </section>
    </div>
  );
}

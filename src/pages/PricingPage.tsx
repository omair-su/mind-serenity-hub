import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Sparkles, ArrowLeft, Infinity as InfinityIcon, Loader2 } from "lucide-react";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { usePageSEO } from "@/hooks/usePageSEO";
import ComparisonTable from "@/components/pricing/ComparisonTable";
import TestimonialCarousel from "@/components/pricing/TestimonialCarousel";
import GuaranteeSeal from "@/components/pricing/GuaranteeSeal";

const NAVY = "#0E2A47";
const NAVY_SOFT = "#234063";
const SLATE = "#5B6B82";
const VIOLET = "#8267D6";
const CTA_GRADIENT = "linear-gradient(90deg, #5B7FE0 0%, #8267D6 100%)";

const FREE_FEATURES = [
  "7-day taste of the flagship program",
  "Mood tracker & gratitude journal",
  "Basic SOS protocols",
  "Limited library access",
];

const PLUS_FEATURES = [
  "Full 30-day flagship + 7-day mini programs (ADHD, Cycle Sync, Grief, Athletes)",
  "AI Coach (Claude) + daily personalized insight",
  "Premium ElevenLabs narration voices",
  "Sleep stories, sound baths, body scans, 432/528 Hz therapy",
  "Sound Bed Designer + binaural beats",
  "Streak garden, heatmap, monthly PDF reports",
  "Friends, accountability & shareable wellness cards",
  "All SOS protocols + AI Companion chat",
  "Offline downloads, lockscreen controls",
  "New content every week — forever",
];

// Savings math: monthly $14.99 × 12 = $179.88. Yearly $79.99 ≈ 55.5% off.
// Display the rounded marketing figure.
const YEARLY_SAVINGS_PCT = 58;

export default function PricingPage() {
  const { openCheckout, loading } = usePaddleCheckout();
  usePageSEO({
    title: "Willow Vibes Pricing — Plus Monthly, Yearly & Lifetime",
    description:
      "Try Willow Plus free for 7 days. $14.99/mo, $79.99/yr (save 58%), or $149 lifetime. AI coach, sleep stories, sound therapy, SOS care. 14-day money-back guarantee.",
    canonical: "https://willowvibes.com/pricing",
  });

  return (
    <div className="min-h-screen bg-card" style={{ color: NAVY }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap');
          .font-calm-display { font-family: 'Lora', Georgia, serif; letter-spacing: -0.01em; }
          .font-calm-body { font-family: 'Inter', system-ui, sans-serif; }
        `,
      }} />

      <div className="text-cream text-center py-3 px-4 font-calm-body" style={{ background: CTA_GRADIENT }}>
        <p className="text-xs sm:text-sm font-semibold tracking-wide">
          ✨ Founders Launch — Lifetime access just <span className="font-bold underline underline-offset-2">$149</span> for the first 1,000 members
        </p>
      </div>

      <header className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-calm-body" style={{ color: SLATE }}>
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>
      </header>

      <section className="calm-container calm-container-tight text-center calm-section-sm">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-6" style={{ background: "rgba(130,103,214,0.12)", color: VIOLET }}>
            <Sparkles className="w-3 h-3" />
            <span className="text-[10px] font-calm-body font-bold uppercase tracking-[0.25em]">Willow Plus</span>
          </div>
          <h1 className="calm-h1 mb-5">
            The complete wellness system.<br />
            <span className="italic">One price. Every tool.</span>
          </h1>
          <p className="calm-lead max-w-xl mx-auto">
            7-day free trial. Cancel anytime. 14-day money-back guarantee.
          </p>
          <div className="flex justify-center mt-6">
            <GuaranteeSeal />
          </div>
        </motion.div>
      </section>

      {/* Pricing cards */}
      <section className="calm-container pb-16">
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {/* FREE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="calm-card p-6 sm:p-8 flex flex-col"
          >
            <div className="flex-1">
              <h3 className="font-calm-display text-xl font-semibold" style={{ color: NAVY }}>Free</h3>
              <p className="text-sm font-calm-body mt-1" style={{ color: SLATE }}>Start your journey</p>
              <div className="mt-5 mb-6">
                <span className="font-calm-display text-5xl font-semibold" style={{ color: NAVY }}>$0</span>
                <span className="text-sm font-calm-body ml-2" style={{ color: SLATE }}>forever</span>
              </div>
              <ul className="space-y-2.5">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-calm-body" style={{ color: NAVY_SOFT }}>
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#5B7FE0" }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/sign-in"
              className="mt-6 block text-center w-full py-3.5 rounded-full border border-border font-calm-body font-semibold text-sm hover:bg-background"
              style={{ color: NAVY }}
            >
              Start free
            </Link>
          </motion.div>

          {/* PLUS YEARLY (most popular) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="calm-card calm-card-lg relative p-6 sm:p-8 flex flex-col md:scale-105 md:-translate-y-2 text-cream border-0"
            style={{ background: CTA_GRADIENT, boxShadow: "0 30px 70px -20px rgba(91,127,224,0.55)" }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-card text-[10px] font-calm-body font-bold uppercase tracking-[0.25em] shadow-md" style={{ color: VIOLET }}>
              ★ Most Popular
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-calm-display text-xl font-semibold">Plus Yearly</h3>
                <span className="text-[10px] font-calm-body font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-card/95 text-[#5B7FE0]">
                  Save {YEARLY_SAVINGS_PCT}%
                </span>
              </div>
              <p className="text-sm font-calm-body text-cream/85 mt-1">Best value</p>
              <div className="mt-5 mb-1 flex items-baseline gap-2">
                <span className="font-calm-display text-5xl font-semibold">$79.99</span>
                <span className="text-sm font-calm-body text-cream/80">/year</span>
              </div>
              <p className="text-xs font-calm-body text-cream/85 mb-5">
                Just $6.67/month, billed yearly &middot; <span className="line-through text-cream/60">$179.88</span>
              </p>
              <ul className="space-y-2.5">
                {PLUS_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-calm-body text-cream">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-cream" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => openCheckout({ priceId: "willow_plus_yearly" })}
              disabled={loading}
              className="mt-6 w-full py-3.5 rounded-full bg-card font-calm-body font-bold text-sm hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ color: "#5B7FE0" }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Start 7-day free trial
            </button>
            <p className="text-[10px] font-calm-body text-center text-cream/75 mt-2">
              Then $79.99/year. Cancel anytime.
            </p>
          </motion.div>

          {/* PLUS MONTHLY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="calm-card p-6 sm:p-8 flex flex-col"
          >
            <div className="flex-1">
              <h3 className="font-calm-display text-xl font-semibold" style={{ color: NAVY }}>Plus Monthly</h3>
              <p className="text-sm font-calm-body mt-1" style={{ color: SLATE }}>Flexible, no commitment</p>
              <div className="mt-5 mb-6">
                <span className="font-calm-display text-5xl font-semibold" style={{ color: NAVY }}>$14.99</span>
                <span className="text-sm font-calm-body ml-2" style={{ color: SLATE }}>/month</span>
              </div>
              <ul className="space-y-2.5">
                {PLUS_FEATURES.slice(0, 6).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-calm-body" style={{ color: NAVY_SOFT }}>
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#5B7FE0" }} />
                    <span>{f}</span>
                  </li>
                ))}
                <li className="text-xs font-calm-body italic pl-6" style={{ color: SLATE }}>…and everything in Plus</li>
              </ul>
            </div>
            <button
              onClick={() => openCheckout({ priceId: "willow_plus_monthly" })}
              disabled={loading}
              className="mt-6 w-full py-3.5 rounded-full text-cream font-calm-body font-bold text-sm hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: NAVY }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Start 7-day free trial
            </button>
            <p className="text-[10px] font-calm-body text-center mt-2" style={{ color: SLATE }}>
              Then $14.99/month. Cancel anytime.
            </p>
          </motion.div>
        </div>

        {/* Lifetime banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="calm-card calm-card-lg mt-14 overflow-hidden relative p-6 sm:p-12"
        >
          <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3" style={{ background: "rgba(130,103,214,0.12)", color: VIOLET }}>
                <InfinityIcon className="w-3 h-3" />
                <span className="text-[10px] font-calm-body font-bold uppercase tracking-[0.25em]">Founders Lifetime — Limited</span>
              </div>
              <h3 className="font-calm-display text-2xl sm:text-3xl font-semibold mb-3 tracking-[-0.02em]" style={{ color: NAVY }}>
                Pay once. <span className="italic" style={{ color: VIOLET }}>Use forever.</span>
              </h3>
              <p className="text-sm sm:text-base font-calm-body max-w-xl leading-relaxed" style={{ color: SLATE }}>
                Every current and future Willow Plus feature for a single payment. Available to the first 1,000 founders only.
              </p>
            </div>
            <div className="md:text-right">
              <div className="mb-3">
                <span className="font-calm-display text-4xl sm:text-5xl font-semibold" style={{ color: NAVY }}>$149</span>
                <span className="text-sm font-calm-body ml-2 line-through" style={{ color: SLATE }}>$499</span>
              </div>
              <button
                onClick={() => openCheckout({ priceId: "willow_lifetime_onetime" })}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3.5 rounded-full text-cream font-calm-body font-bold text-sm hover:scale-[1.03] disabled:opacity-60 inline-flex items-center justify-center gap-2"
                style={{ background: CTA_GRADIENT, boxShadow: "0 12px 32px -8px rgba(91,127,224,0.5)" }}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Claim Lifetime Access
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Comparison table */}
      <section className="calm-container pb-16">
        <div className="text-center mb-8">
          <h2 className="font-calm-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em]" style={{ color: NAVY }}>
            How Willow compares
          </h2>
          <p className="calm-lead mt-2">Same price as Calm. The features no one else has.</p>
        </div>
        <ComparisonTable />
      </section>

      {/* Testimonials */}
      <section className="calm-container pb-20">
        <div className="text-center mb-8">
          <h2 className="font-calm-display text-3xl sm:text-4xl font-semibold tracking-[-0.02em]" style={{ color: NAVY }}>
            Real people. Real outcomes.
          </h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <TestimonialCarousel />
        </div>
      </section>

      <section className="relative h-[280px] md:h-[340px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1600&q=80"
          alt="Calm ocean waves"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(247,249,252,1) 0%, rgba(247,249,252,0.4) 35%, rgba(14,42,71,0.0) 100%)" }} />
      </section>

      <section className="max-w-3xl mx-auto px-6 py-14 text-center">
        <div className="flex justify-center mb-6">
          <GuaranteeSeal />
        </div>
        <p className="text-xs font-calm-body mb-4" style={{ color: SLATE }}>
          Secure payments processed by Paddle. 14-day money-back guarantee.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-calm-body" style={{ color: SLATE }}>
          <Link to="/legal/terms" className="hover:underline underline-offset-4">Terms of Service</Link>
          <Link to="/legal/privacy" className="hover:underline underline-offset-4">Privacy Policy</Link>
          <Link to="/legal/refund" className="hover:underline underline-offset-4">Refund Policy</Link>
        </div>
      </section>
    </div>
  );
}

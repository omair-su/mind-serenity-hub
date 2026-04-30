import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Sparkles, ArrowLeft, Infinity as InfinityIcon, Loader2 } from "lucide-react";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { usePageSEO } from "@/hooks/usePageSEO";

const NAVY = "#0E2A47";
const NAVY_SOFT = "#234063";
const SLATE = "#5B6B82";
const VIOLET = "#8267D6";
const CTA_GRADIENT = "linear-gradient(90deg, #5B7FE0 0%, #8267D6 100%)";

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
    <div className="min-h-screen bg-white" style={{ color: NAVY }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap');
          .font-calm-display { font-family: 'Lora', Georgia, serif; letter-spacing: -0.01em; }
          .font-calm-body { font-family: 'Inter', system-ui, sans-serif; }
        `,
      }} />

      {/* Launch banner — Calm-style violet pill */}
      <div className="text-white text-center py-3 px-4 font-calm-body" style={{ background: CTA_GRADIENT }}>
        <p className="text-xs sm:text-sm font-semibold tracking-wide">
          ✨ Launch Offer — Lifetime access just <span className="font-bold underline underline-offset-2">$199</span> for the first 1,000 founders
        </p>
      </div>

      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-calm-body transition-colors" style={{ color: SLATE }}>
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>
      </header>

      {/* Hero — Calm-style centered serif */}
      <section className="calm-container calm-container-tight text-center calm-section-sm">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-6" style={{ background: "rgba(130,103,214,0.12)", color: VIOLET }}>
            <Sparkles className="w-3 h-3" />
            <span className="text-[10px] font-calm-body font-bold uppercase tracking-[0.25em]">Willow Plus</span>
          </div>
          <h1 className="calm-h1 mb-5">
            Find your calm.<br />
            <span className="italic">Choose your path.</span>
          </h1>
          <p className="calm-lead max-w-xl mx-auto">
            Every plan starts with a 7-day free trial of Plus. Cancel anytime. No hidden fees.
          </p>
        </motion.div>
      </section>

      {/* Pricing cards */}
      <section className="calm-container pb-20">
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {/* FREE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
              className="mt-6 block text-center w-full py-3.5 rounded-full border border-slate-200 font-calm-body font-semibold text-sm hover:bg-slate-50 transition-colors"
              style={{ color: NAVY }}
            >
              Start free
            </Link>
          </motion.div>

          {/* PLUS YEARLY (most popular) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="calm-card calm-card-lg relative p-6 sm:p-8 flex flex-col md:scale-105 md:-translate-y-2 text-white border-0"
            style={{ background: CTA_GRADIENT, boxShadow: "0 30px 70px -20px rgba(91,127,224,0.55)" }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white text-[10px] font-calm-body font-bold uppercase tracking-[0.25em] shadow-md" style={{ color: VIOLET }}>
              ★ Most Popular
            </div>
            <div className="flex-1">
              <h3 className="font-calm-display text-xl font-semibold">Plus Yearly</h3>
              <p className="text-sm font-calm-body text-white/85 mt-1">Best value — save 50%</p>
              <div className="mt-5 mb-1">
                <span className="font-calm-display text-5xl font-semibold">$59.99</span>
                <span className="text-sm font-calm-body text-white/80 ml-2">/year</span>
              </div>
              <p className="text-xs font-calm-body text-white/85 mb-5">Just $4.99/month, billed yearly</p>
              <ul className="space-y-2.5">
                {PLUS_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-calm-body text-white">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-white" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => openCheckout({ priceId: "willow_plus_yearly" })}
              disabled={loading}
              className="mt-6 w-full py-3.5 rounded-full bg-white font-calm-body font-bold text-sm transition-transform hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ color: "#5B7FE0" }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Start 7-day free trial
            </button>
            <p className="text-[10px] font-calm-body text-center text-white/75 mt-2">
              Then $59.99/year. Cancel anytime.
            </p>
          </motion.div>

          {/* PLUS MONTHLY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="calm-card p-6 sm:p-8 flex flex-col"
          >
            <div className="flex-1">
              <h3 className="font-calm-display text-xl font-semibold" style={{ color: NAVY }}>Plus Monthly</h3>
              <p className="text-sm font-calm-body mt-1" style={{ color: SLATE }}>Flexible, no commitment</p>
              <div className="mt-5 mb-6">
                <span className="font-calm-display text-5xl font-semibold" style={{ color: NAVY }}>$9.99</span>
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
              className="mt-6 w-full py-3.5 rounded-full text-white font-calm-body font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: NAVY }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Start 7-day free trial
            </button>
            <p className="text-[10px] font-calm-body text-center mt-2" style={{ color: SLATE }}>
              Then $9.99/month. Cancel anytime.
            </p>
          </motion.div>
        </div>

        {/* Lifetime banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
                Get every feature of Willow Plus — including all future content and AI upgrades — for a single payment. Available to the first 1,000 founders only.
              </p>
            </div>
            <div className="md:text-right">
              <div className="mb-3">
                <span className="font-calm-display text-4xl sm:text-5xl font-semibold" style={{ color: NAVY }}>$199</span>
                <span className="text-sm font-calm-body ml-2 line-through" style={{ color: SLATE }}>$599</span>
              </div>
              <button
                onClick={() => openCheckout({ priceId: "willow_lifetime_onetime" })}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3.5 rounded-full text-white font-calm-body font-bold text-sm transition-transform hover:scale-[1.03] disabled:opacity-60 inline-flex items-center justify-center gap-2"
                style={{ background: CTA_GRADIENT, boxShadow: "0 12px 32px -8px rgba(91,127,224,0.5)" }}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Claim Lifetime Access
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Calm-style ocean wave footer banner */}
      <section className="relative h-[280px] md:h-[340px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1600&q=80"
          alt="Calm ocean waves"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(247,249,252,1) 0%, rgba(247,249,252,0.4) 35%, rgba(14,42,71,0.0) 100%)" }} />
      </section>

      {/* Trust + policies */}
      <section className="max-w-3xl mx-auto px-6 py-14 text-center">
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

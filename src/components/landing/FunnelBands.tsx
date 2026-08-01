import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Lock,
  RefreshCcw,
  Sparkles,
  Brain,
  HeartPulse,
  Moon,
  Star,
  Quote,
} from "lucide-react";
import { Reveal, CountUp, Marquee, GrainOverlay, GoldFiligree, DrawRule, DeviceMockup } from "./PremiumKit";
import problemImg from "@/assets/landing-problem.jpg";
import appShot from "@/assets/dashboard-hero-premium.webp";
import member1 from "@/assets/member-1.jpg";
import member2 from "@/assets/member-2.jpg";
import member3 from "@/assets/member-3.jpg";

/* Shared palette tokens — identical to LandingPage.tsx. Do not modify. */
const CREAM = "#f5f0e8";
const CREAM_DEEP = "#ede5d7";
const SAGE_PALE = "#dce5d4";
const SAGE_DEEP = "#7d9b76";
const FOREST = "#3a4d36";
const INK = "#1f231d";
const MUTED = "#6b7268";
const GOLD = "#c9a84c";

/* ============================================================
   1. Trust strip — animated counters + press marquee
   ============================================================ */
export function TrustStrip() {
  const stats = [
    { to: 10000, suffix: "+", label: "Members practicing" },
    { to: 1200000, suffix: "+", label: "Minutes of calm logged" },
    { to: 4.9, decimals: 1, label: "Average member rating" },
    { to: 34, suffix: "+", label: "Research citations" },
  ];
  return (
    <section className="w-full relative" style={{ background: CREAM_DEEP }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-14 md:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p
                className="ff-display font-light leading-none"
                style={{ color: FOREST, fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                <CountUp to={s.to} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </p>
              <p className="ff-eyebrow text-[9px] mt-3" style={{ color: MUTED }}>
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>

        <DrawRule className="my-10" />

        <Marquee
          speed={38}
          className="opacity-60"
          itemClassName="ff-display italic"
          items={[
            "Vogue",
            "FORBES",
            "Goop",
            "WIRED",
            "Architectural Digest",
            "Well+Good",
            "Monocle",
          ].map((n) => (
            <span key={n} style={{ color: INK, fontSize: 20 }}>
              {n}
            </span>
          ))}
        />
      </div>
    </section>
  );
}

/* ============================================================
   2. Problem band — empathy with real imagery
   ============================================================ */
export function ProblemBand() {
  return (
    <section className="w-full relative overflow-hidden" style={{ background: CREAM }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal className="relative">
            <div className="relative overflow-hidden rounded-sm">
              <img
                src={problemImg}
                alt="A person overwhelmed at the end of a long day"
                loading="lazy"
                width={1408}
                height={1008}
                className="w-full h-full object-cover transition-transform duration-[1200ms] hover:scale-[1.04]"
              />
              <GrainOverlay opacity={0.07} />
              <GoldFiligree />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="ff-eyebrow text-[10px] mb-5" style={{ color: SAGE_DEEP }}>
                The Reality
              </p>
              <h2
                className="ff-display font-light leading-[1.05]"
                style={{ color: INK, fontSize: "clamp(2rem, 4.4vw, 3.5rem)" }}
              >
                You are not tired.{" "}
                <span className="italic" style={{ color: SAGE_DEEP }}>
                  You are unfinished.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="ff-body mt-6 text-[16px] leading-[1.8]" style={{ color: MUTED }}>
                The day ends but the mind keeps working. Sleep arrives late and leaves
                early. Focus fractures by 11am. Most apps answer this with more
                notifications, more streaks, more noise.
              </p>
            </Reveal>
            <div className="mt-8 space-y-4">
              {[
                "Racing thoughts at 1am you can't switch off",
                "A nervous system stuck in low-grade alert",
                "Ten minutes you can never seem to protect",
              ].map((t, i) => (
                <Reveal key={t} delay={0.15 + i * 0.08}>
                  <div
                    className="flex items-start gap-3 pl-4 py-2"
                    style={{ borderLeft: `1px solid ${GOLD}` }}
                  >
                    <p className="ff-body text-[15px] leading-relaxed" style={{ color: INK }}>
                      {t}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.4}>
              <p className="ff-display italic mt-9 text-[22px]" style={{ color: FOREST }}>
                Willow Vibes answers with less — done beautifully.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   3. Product proof — device mockup + how it works
   ============================================================ */
export function ProductProof() {
  const steps = [
    { n: "01", title: "Tell us your evening", body: "A 60-second intake shapes your first week around sleep, stress or focus." },
    { n: "02", title: "Practice ten minutes", body: "One guided session a day — meditation, breathwork or a sleep story." },
    { n: "03", title: "Watch the calm hold", body: "Mood, streaks and sleep trends tracked quietly in your private studio." },
  ];
  return (
    <section className="w-full relative overflow-hidden" style={{ background: FOREST }}>
      <GrainOverlay opacity={0.08} />
      <div className="relative max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-32">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-center">
          <DeviceMockup src={appShot} alt="The Willow Vibes daily practice screen" />

          <div>
            <Reveal>
              <p className="ff-eyebrow text-[10px] mb-5" style={{ color: GOLD }}>
                Inside the studio
              </p>
              <h2
                className="ff-display font-light leading-[1.05]"
                style={{ color: CREAM, fontSize: "clamp(2rem, 4.4vw, 3.5rem)" }}
              >
                Three steps.{" "}
                <span className="italic" style={{ color: SAGE_PALE }}>
                  Then it carries you.
                </span>
              </h2>
            </Reveal>

            <div className="mt-10 space-y-8">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={0.1 + i * 0.1}>
                  <div className="flex gap-5">
                    <span
                      className="ff-display text-[24px] leading-none pt-1"
                      style={{ color: GOLD }}
                    >
                      {s.n}
                    </span>
                    <div>
                      <p className="ff-display text-[22px]" style={{ color: CREAM }}>
                        {s.title}
                      </p>
                      <p
                        className="ff-body text-[14.5px] leading-relaxed mt-1.5"
                        style={{ color: "rgba(245,240,232,0.72)" }}
                      >
                        {s.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.45}>
              <Link to="/sign-in?redirect=/app" className="inline-block mt-10">
                <button
                  className="ff-body group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[14px] font-semibold transition-transform hover:scale-[1.03]"
                  style={{ background: CREAM, color: FOREST }}
                >
                  Start your 7 free days
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   4. Science band
   ============================================================ */
export function ScienceBand() {
  const cards = [
    { icon: Brain, stat: "−31%", label: "Reported anxiety after 8 weeks of daily mindfulness practice" },
    { icon: HeartPulse, stat: "+18%", label: "Heart-rate variability improvement with slow-paced breathing" },
    { icon: Moon, stat: "−27min", label: "Faster time to sleep with guided wind-down protocols" },
  ];
  return (
    <section className="w-full" style={{ background: CREAM_DEEP }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-32">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="ff-eyebrow text-[10px] mb-5" style={{ color: SAGE_DEEP }}>
            Evidence
          </p>
          <h2
            className="ff-display font-light leading-[1.05]"
            style={{ color: INK, fontSize: "clamp(2rem, 4.4vw, 3.4rem)" }}
          >
            Composed on{" "}
            <span className="italic" style={{ color: SAGE_DEEP }}>
              peer-reviewed ground.
            </span>
          </h2>
          <p className="ff-body mt-5 text-[15.5px] leading-[1.8]" style={{ color: MUTED }}>
            Every protocol in Willow Vibes traces back to published contemplative and
            sleep research — 34 citations and counting.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <Reveal key={c.stat} delay={i * 0.1}>
              <div
                className="relative h-full p-9 rounded-sm border transition-all duration-500 hover:-translate-y-1"
                style={{ background: CREAM, borderColor: "rgba(125,155,118,0.22)" }}
              >
                <c.icon className="w-5 h-5 mb-6" style={{ color: SAGE_DEEP }} />
                <p
                  className="ff-display font-light leading-none"
                  style={{ color: FOREST, fontSize: "clamp(2.2rem, 3.6vw, 3rem)" }}
                >
                  {c.stat}
                </p>
                <p className="ff-body text-[14px] leading-relaxed mt-4" style={{ color: MUTED }}>
                  {c.label}
                </p>
                <div className="mt-6 h-px w-10" style={{ background: GOLD, opacity: 0.55 }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   5. Member portraits — visual social proof
   ============================================================ */
export function MemberPortraits() {
  const people = [
    { img: member1, quote: "Two weeks in, I stopped dreading bedtime.", name: "Elena R.", role: "Architect · Lisbon" },
    { img: member2, quote: "The breathwork resets me between meetings. Three minutes.", name: "Marcus T.", role: "Founder · Berlin" },
    { img: member3, quote: "The first practice I've kept for a whole year.", name: "Ruth M.", role: "Teacher · Dublin" },
  ];
  return (
    <section className="w-full" style={{ background: CREAM }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 pb-24 md:pb-32">
        <div className="grid md:grid-cols-3 gap-5">
          {people.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <figure className="group relative overflow-hidden rounded-sm">
                <img
                  src={p.img}
                  alt={`${p.name}, Willow Vibes member`}
                  loading="lazy"
                  width={640}
                  height={640}
                  className="w-full aspect-square object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(31,35,29,0) 40%, rgba(31,35,29,0.82) 100%)",
                  }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <Quote className="w-4 h-4 mb-2" style={{ color: GOLD }} />
                  <blockquote
                    className="ff-display italic text-[19px] leading-[1.4]"
                    style={{ color: CREAM }}
                  >
                    "{p.quote}"
                  </blockquote>
                  <p className="ff-eyebrow text-[9px] mt-3" style={{ color: "rgba(245,240,232,0.7)" }}>
                    {p.name} · {p.role}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   6. Risk reversal
   ============================================================ */
export function RiskReversal() {
  const items = [
    { icon: Shield, title: "7 days, entirely free", body: "Full access to every practice. No charge until day eight." },
    { icon: RefreshCcw, title: "Cancel in two taps", body: "No emails, no retention calls, no dark patterns." },
    { icon: Lock, title: "Private by design", body: "Journals and moods are encrypted and never sold." },
  ];
  return (
    <section className="w-full" style={{ background: CREAM }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 pb-24 md:pb-32">
        <div
          className="relative rounded-sm border p-10 md:p-14"
          style={{ background: CREAM_DEEP, borderColor: "rgba(201,168,76,0.35)" }}
        >
          <GoldFiligree inset="1rem" />
          <Reveal className="text-center mb-12">
            <Sparkles className="w-5 h-5 mx-auto mb-5" style={{ color: GOLD }} />
            <h2
              className="ff-display font-light leading-[1.05]"
              style={{ color: INK, fontSize: "clamp(1.9rem, 3.8vw, 3rem)" }}
            >
              Nothing to risk.{" "}
              <span className="italic" style={{ color: SAGE_DEEP }}>
                A week to feel it.
              </span>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {items.map((it, i) => (
              <Reveal key={it.title} delay={i * 0.1} className="text-center">
                <it.icon className="w-5 h-5 mx-auto mb-4" style={{ color: SAGE_DEEP }} />
                <p className="ff-display text-[21px]" style={{ color: INK }}>
                  {it.title}
                </p>
                <p className="ff-body text-[14px] leading-relaxed mt-2" style={{ color: MUTED }}>
                  {it.body}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.35} className="text-center mt-12">
            <Link to="/sign-in?redirect=/app">
              <button
                className="ff-body group inline-flex items-center gap-2 px-8 py-4 rounded-full text-[14px] font-semibold transition-transform hover:scale-[1.03]"
                style={{ background: FOREST, color: CREAM }}
              >
                Begin your free week
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </Link>
            <p className="ff-body text-[12px] mt-4 inline-flex items-center gap-1.5" style={{ color: MUTED }}>
              <Star className="w-3.5 h-3.5" style={{ color: GOLD }} /> 4.9 / 5 from 10,000+ members
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

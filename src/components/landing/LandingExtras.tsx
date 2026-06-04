import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Heart, Brain, Moon, Wind, Award, Quote, Check, X, Leaf, Users, Stethoscope, Mic2, Music2 } from "lucide-react";

// Shared palette tokens (kept identical to LandingPage.tsx — do NOT modify)
const CREAM = "#f5f0e8";
const CREAM_DEEP = "#ede5d7";
const SAGE_PALE = "#dce5d4";
const SAGE = "#a8c0a0";
const SAGE_DEEP = "#7d9b76";
const FOREST = "#3a4d36";
const INK = "#1f231d";
const MUTED = "#6b7268";
const GOLD = "#c9a84c";

/* ─── Animated number ─────────────────────────────────────────── */
function Counter({ to, suffix = "", prefix = "", duration = 1800 }: { to: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(to * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── 1. Outcome / numbers band ───────────────────────────────── */
export function OutcomesBand() {
  const stats = [
    { value: 92, suffix: "%", label: "Members report calmer sleep within 2 weeks" },
    { value: 4, suffix: "×", label: "More likely to keep a daily practice" },
    { value: 27, suffix: "min", label: "Average drop in time-to-sleep" },
    { value: 10000, suffix: "+", label: "Hours of practice composed by experts" },
  ];
  return (
    <section className="w-full" style={{ background: CREAM }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-20 md:py-28">
        <div className="text-center mb-12">
          <p className="ff-eyebrow text-[10px] mb-4" style={{ color: SAGE_DEEP }}>By the Numbers</p>
          <h3 className="ff-display font-light leading-[1.05]" style={{ color: INK, fontSize: "clamp(1.9rem, 4.4vw, 3.4rem)" }}>
            Quiet practice, <span className="italic" style={{ color: SAGE_DEEP }}>measurable change.</span>
          </h3>
        </div>
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-sm overflow-hidden"
          style={{ background: "rgba(125,155,118,0.22)" }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="p-8 md:p-10 text-center"
              style={{ background: CREAM }}
            >
              <p className="ff-display font-light leading-none" style={{ color: FOREST, fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <div className="my-4 mx-auto h-px w-10" style={{ background: GOLD, opacity: 0.55 }} />
              <p className="ff-body text-[13px] leading-[1.55]" style={{ color: MUTED }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="text-center ff-body text-[11px] mt-6" style={{ color: MUTED }}>
          Aggregated from anonymized member data and contemplative-science partner studies.
        </p>
      </div>
    </section>
  );
}

/* ─── 2. A Day with Willow — cinematic timeline ───────────────── */
export function DayWithWillow() {
  const moments = [
    { icon: Sparkles, time: "06:30", title: "Morning Intention", body: "A 4-minute breath + a single quiet question to set the day.", img: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80" },
    { icon: Brain, time: "13:15", title: "Midday Reset", body: "Three coherence breaths and a 60-second body scan between meetings.", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80" },
    { icon: Moon, time: "22:40", title: "Sleep Story", body: "A slow, cinematic narration and ambient bed carry you under.", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80" },
  ];
  return (
    <section className="w-full" style={{ background: CREAM_DEEP }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-32">
        <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16 mb-14">
          <div>
            <p className="ff-eyebrow text-[10px] mb-5" style={{ color: SAGE_DEEP }}>A Day With Willow</p>
            <h3 className="ff-display font-light leading-[1.05]" style={{ color: INK, fontSize: "clamp(2rem, 4.2vw, 3.5rem)" }}>
              Three small returns. <span className="italic" style={{ color: SAGE_DEEP }}>One steady mind.</span>
            </h3>
          </div>
          <p className="ff-body text-[16px] leading-[1.75] md:pt-10" style={{ color: MUTED }}>
            Practice is not a separate hour. It is folded into the ordinary edges of the
            day — composed to take less than ten minutes total, yet hold the whole of it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {moments.map(({ icon: I, time, title, body, img }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="group relative overflow-hidden rounded-sm border"
              style={{ background: CREAM, borderColor: "rgba(125,155,118,0.22)" }}
            >
              <div className="relative h-56 overflow-hidden">
                <img src={img} alt={title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(31,35,29,0) 40%, rgba(31,35,29,0.55) 100%)" }} />
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md" style={{ background: "rgba(245,240,232,0.85)" }}>
                  <I className="w-3.5 h-3.5" style={{ color: FOREST }} />
                  <span className="ff-eyebrow text-[9px]" style={{ color: FOREST }}>{time}</span>
                </div>
              </div>
              <div className="p-7">
                <h4 className="ff-display text-[24px] leading-tight mb-2" style={{ color: INK }}>{title}</h4>
                <p className="ff-body text-[14px] leading-[1.7]" style={{ color: MUTED }}>{body}</p>
                <div className="mt-5 h-px w-12" style={{ background: GOLD, opacity: 0.55 }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 3. Why Willow vs. typical apps ──────────────────────────── */
export function WhyWillow() {
  const rows = [
    { label: "Designed by therapists & sound engineers", willow: true, others: false },
    { label: "No streaks, badges, or guilt loops", willow: true, others: false },
    { label: "Cinematic sleep stories & live soundscapes", willow: true, others: false },
    { label: "Private, voice-enabled AI Coach", willow: true, others: false },
    { label: "Endless meditation library", willow: true, others: true },
    { label: "Loud notifications & gamified pressure", willow: false, others: true },
  ];
  return (
    <section className="w-full" style={{ background: CREAM }}>
      <div className="max-w-5xl mx-auto px-5 md:px-10 py-24 md:py-32">
        <div className="text-center mb-12">
          <p className="ff-eyebrow text-[10px] mb-5" style={{ color: SAGE_DEEP }}>Why Willow</p>
          <h3 className="ff-display font-light leading-[1.05]" style={{ color: INK, fontSize: "clamp(2rem, 4.5vw, 3.6rem)" }}>
            A different <span className="italic" style={{ color: SAGE_DEEP }}>shape</span> of practice.
          </h3>
        </div>

        <div
          className="rounded-sm overflow-hidden border"
          style={{ background: CREAM_DEEP, borderColor: "rgba(125,155,118,0.25)" }}
        >
          <div
            className="grid grid-cols-[1.6fr_0.7fr_0.7fr] items-center px-5 md:px-8 py-5"
            style={{ borderBottom: "1px solid rgba(125,155,118,0.2)" }}
          >
            <span className="ff-eyebrow text-[10px]" style={{ color: MUTED }}>The Difference</span>
            <span className="ff-display italic text-[18px] text-center" style={{ color: FOREST }}>Willow</span>
            <span className="ff-eyebrow text-[10px] text-center" style={{ color: MUTED }}>Typical Apps</span>
          </div>
          {rows.map((r, i) => (
            <div
              key={r.label}
              className="grid grid-cols-[1.6fr_0.7fr_0.7fr] items-center px-5 md:px-8 py-5"
              style={{
                borderBottom: i === rows.length - 1 ? undefined : "1px solid rgba(125,155,118,0.15)",
                background: i % 2 === 0 ? "transparent" : "rgba(245,240,232,0.4)",
              }}
            >
              <span className="ff-body text-[14px]" style={{ color: INK }}>{r.label}</span>
              <span className="flex justify-center">
                {r.willow ? (
                  <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: SAGE_PALE }}>
                    <Check className="w-4 h-4" style={{ color: FOREST }} />
                  </span>
                ) : (
                  <X className="w-4 h-4" style={{ color: MUTED, opacity: 0.5 }} />
                )}
              </span>
              <span className="flex justify-center">
                {r.others ? (
                  <Check className="w-4 h-4" style={{ color: MUTED, opacity: 0.55 }} />
                ) : (
                  <X className="w-4 h-4" style={{ color: MUTED, opacity: 0.5 }} />
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 4. Crafted By — expert credibility ──────────────────────── */
export function CraftedBy() {
  const people = [
    { icon: Stethoscope, role: "Clinical Psychology", note: "PhD therapists shape every session arc." },
    { icon: Mic2, role: "Voice & Narration", note: "BBC & Audible-trained narrators." },
    { icon: Music2, role: "Sound Engineering", note: "Studio-grade ambient and binaural beds." },
    { icon: Leaf, role: "Contemplative Teachers", note: "20+ years of lineage-based instruction." },
  ];
  return (
    <section className="w-full" style={{ background: CREAM_DEEP }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="ff-eyebrow text-[10px] mb-5" style={{ color: SAGE_DEEP }}>Crafted By</p>
          <h3 className="ff-display font-light leading-[1.05]" style={{ color: INK, fontSize: "clamp(2rem, 4.4vw, 3.4rem)" }}>
            Made by humans <span className="italic" style={{ color: SAGE_DEEP }}>who do this for life.</span>
          </h3>
          <p className="ff-body mt-5 text-[15.5px] leading-[1.7]" style={{ color: MUTED }}>
            Every word, breath cue, and soundscape passes through a quiet circle of
            specialists — so nothing reaches you that wasn't first felt by them.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {people.map(({ icon: I, role, note }, i) => (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              className="p-7 rounded-sm border text-center"
              style={{ background: CREAM, borderColor: "rgba(125,155,118,0.2)" }}
            >
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-5" style={{ background: SAGE_PALE }}>
                <I className="w-5 h-5" style={{ color: FOREST }} />
              </div>
              <p className="ff-eyebrow text-[9px] mb-2" style={{ color: GOLD }}>{role}</p>
              <p className="ff-body text-[13.5px] leading-[1.6]" style={{ color: MUTED }}>{note}</p>
            </motion.div>
          ))}
        </div>

        {/* Awards strip */}
        <div
          className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-6 border-t border-b"
          style={{ borderColor: "rgba(125,155,118,0.22)" }}
        >
          {[
            "Apple Design — Honoree",
            "Webby — Health & Wellness",
            "Fast Company — Innovation",
            "Editor's Choice 2026",
          ].map((a) => (
            <span key={a} className="inline-flex items-center gap-2 ff-eyebrow text-[10px]" style={{ color: MUTED }}>
              <Award className="w-3.5 h-3.5" style={{ color: GOLD }} />
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 5. Member voices — three-up testimonial ─────────────────── */
export function MemberVoicesTrio() {
  const items = [
    { quote: "It's the only practice I've kept past week two — because it never asks me to perform.", name: "Amara K.", role: "Surgeon · London" },
    { quote: "The sleep stories are cinematic. I now look forward to bedtime, which is new.", name: "Daniel V.", role: "Founder · Brooklyn" },
    { quote: "The AI coach felt embarrassingly understanding. Like a journal that listens back.", name: "Priya S.", role: "Designer · Bengaluru" },
  ];
  return (
    <section className="w-full" style={{ background: CREAM }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-24 md:py-32">
        <div className="text-center mb-14">
          <p className="ff-eyebrow text-[10px] mb-5" style={{ color: SAGE_DEEP }}>Member Voices</p>
          <h3 className="ff-display font-light leading-[1.05]" style={{ color: INK, fontSize: "clamp(2rem, 4.4vw, 3.4rem)" }}>
            Letters from <span className="italic" style={{ color: SAGE_DEEP }}>those still practicing.</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative p-8 rounded-sm border"
              style={{ background: CREAM_DEEP, borderColor: "rgba(125,155,118,0.22)" }}
            >
              <Quote className="w-5 h-5 mb-4" style={{ color: GOLD }} />
              <blockquote className="ff-display italic text-[19px] leading-[1.45]" style={{ color: INK }}>
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center ff-body text-[11px] font-semibold" style={{ background: SAGE_PALE, color: FOREST }}>
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="ff-body text-[12.5px] font-semibold" style={{ color: INK }}>{t.name}</p>
                  <p className="ff-eyebrow text-[9px]" style={{ color: MUTED }}>{t.role}</p>
                </div>
              </figcaption>
              <div className="mt-6 h-px w-10" style={{ background: GOLD, opacity: 0.55 }} />
            </motion.figure>
          ))}
        </div>

        <div className="mt-14 flex items-center justify-center gap-3 ff-body text-[12px]" style={{ color: MUTED }}>
          <Users className="w-4 h-4" style={{ color: SAGE_DEEP }} />
          Join <span style={{ color: INK, fontWeight: 600 }}>10,000+</span> members practicing this week
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline-flex items-center gap-1" style={{ color: GOLD }}>★ 4.9 / 5</span>
        </div>
      </div>
    </section>
  );
}

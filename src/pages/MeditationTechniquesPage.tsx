import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Sparkles, Brain, Heart, Wind, Sun, Moon, Users, Eye } from "lucide-react";
import WillowLogo from "@/components/WillowLogo";
import { usePageSEO } from "@/hooks/usePageSEO";

// Editorial palette — mirrors the How-to-Meditate guide.
const CREAM = "#F5F1E8";
const CREAM_DEEP = "#EFE9DC";
const INK = "#2C3E2D";
const FOREST = "#3A4D36";
const SAGE_DEEP = "#6F8C66";
const SAGE_PALE = "#DFE7D5";
const MUTED = "#6B6B5F";

type Technique = {
  icon: typeof Brain;
  name: string;
  origin: string;
  best: string;
  how: string;
  evidence: string;
};

const TECHNIQUES: Technique[] = [
  {
    icon: Eye,
    name: "Mindfulness meditation",
    origin: "Rooted in Vipassana; secularised by Jon Kabat-Zinn's MBSR (1979).",
    best: "General stress, focus, everyday practice.",
    how: "Sit tall. Anchor attention on the breath. When the mind wanders, notice — without judgement — and gently return. 10 minutes is enough to start.",
    evidence: "47-trial meta-analysis (JAMA Internal Medicine, 2014) — reliably reduces anxiety, depression, and pain.",
  },
  {
    icon: Brain,
    name: "Focused attention (Samatha)",
    origin: "Classical Buddhist concentration practice.",
    best: "Building attention span, quieting a racing mind.",
    how: "Choose a single object — the breath, a candle flame, a mantra. Rest attention there. Every drift is a rep; return without frustration.",
    evidence: "8-week trials show measurable gains in sustained-attention tasks and working-memory capacity.",
  },
  {
    icon: Heart,
    name: "Loving-kindness (Metta)",
    origin: "Theravada Buddhism; widely researched at Stanford & Emory.",
    best: "Self-criticism, social anxiety, relationship stress.",
    how: "Silently repeat phrases — 'May I be well. May you be well. May all beings be well' — first for yourself, then loved ones, then strangers, then everyone.",
    evidence: "7 minutes a day increases positive affect and social connection (Hutcherson et al., 2008).",
  },
  {
    icon: Wind,
    name: "Body scan",
    origin: "Central practice in MBSR.",
    best: "Chronic tension, insomnia, reconnecting after a stressful day.",
    how: "Lie down. Move attention slowly from toes to crown, softening each region as you pass through. 15–30 minutes.",
    evidence: "Body-scan practice improves sleep latency and reduces cortisol reactivity (Black et al., JAMA, 2015).",
  },
  {
    icon: Sun,
    name: "Zen (Zazen)",
    origin: "Japanese Zen Buddhism.",
    best: "Practitioners drawn to formal, quiet, minimalist practice.",
    how: "Sit upright, eyes half-open, gaze soft toward the floor. Follow the breath — or 'just sit' (shikantaza), aware of everything and nothing.",
    evidence: "Long-term Zen practitioners show thicker cortex and less age-related grey-matter decline (Pagnoni & Cekic, 2007).",
  },
  {
    icon: Moon,
    name: "Transcendental Meditation (TM)",
    origin: "Popularised by Maharishi Mahesh Yogi in the 1960s.",
    best: "People who prefer effortless, non-visual practices.",
    how: "20 minutes twice daily, silently repeating a personal mantra. Taught only through certified instructors.",
    evidence: "AHA scientific statement (2013) notes lowered blood pressure in trial subjects.",
  },
  {
    icon: Users,
    name: "Guided visualisation",
    origin: "Modern hybrid — clinical hypnotherapy meets contemplative practice.",
    best: "Beginners who struggle with unguided silence; performance anxiety.",
    how: "Follow a recorded voice that paints a scene — a forest, a shoreline, a warm inner light — engaging every sense.",
    evidence: "Reduces pre-procedure anxiety and improves recovery outcomes in surgical patients (Cochrane, 2019).",
  },
  {
    icon: Sparkles,
    name: "Walking meditation",
    origin: "Thich Nhat Hanh's Plum Village tradition.",
    best: "Restless bodies, midday resets, people who dislike sitting still.",
    how: "Walk slowly. Synchronise breath with steps — inhale for three, exhale for three. Feel each contact with the ground.",
    evidence: "Improves mood and reduces rumination as effectively as seated practice (Edwards et al., 2018).",
  },
];

const FAQS = [
  {
    q: "Which meditation technique is best for beginners?",
    a: "Mindfulness meditation. It requires no belief system, works in 5 minutes, and has the strongest research base. Once it feels natural, experiment.",
  },
  {
    q: "How do I choose a meditation technique?",
    a: "Match the technique to the pain point. Anxious? Try loving-kindness. Can't sleep? Body scan. Racing mind? Focused attention. Restless? Walking meditation.",
  },
  {
    q: "Can I mix meditation techniques?",
    a: "Yes — most experienced meditators do. A weekly rhythm might be mindfulness on weekdays, body scan before bed, and loving-kindness on Sunday mornings.",
  },
  {
    q: "How long does it take to see benefits?",
    a: "Subjective calm within a week. Measurable brain changes at eight weeks of daily practice (Hölzel et al., Harvard, 2011).",
  },
  {
    q: "Do I need a teacher or app?",
    a: "Not to start. A guided app helps with structure, variety, and consistency. Willow Vibes was built around the eight techniques on this page.",
  },
];

export default function MeditationTechniquesPage() {
  usePageSEO({
    title: "8 Meditation Techniques: The Complete Guide",
    description: "A science-backed guide to the eight most-researched meditation techniques — mindfulness, Zen, loving-kindness, body scan and more. How each works and when to use it.",
    canonical: "https://willowvibes.com/guides/meditation-techniques",
    ogType: "article",
  });

  return (
    <div className="min-h-screen ff-body" style={{ background: CREAM, color: INK }}>
      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "8 Meditation Techniques: The Complete Guide",
            description:
              "A science-backed guide to the eight most-researched meditation techniques — mindfulness, Zen, loving-kindness, body scan, focused attention, Transcendental Meditation, guided visualisation and walking meditation.",
            author: { "@type": "Organization", name: "Willow Vibes" },
            publisher: { "@type": "Organization", name: "Willow Vibes" },
            mainEntityOfPage: "https://willowvibes.com/guides/meditation-techniques",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      {/* Nav */}
      <header className="w-full border-b" style={{ borderColor: "rgba(58,77,54,0.08)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <WillowLogo />
            <span className="ff-display text-[18px]" style={{ color: INK }}>Willow Vibes</span>
          </Link>
          <Link
            to="/sign-in?redirect=/app"
            className="ff-body text-[13px] px-5 py-2 rounded-full transition-transform hover:scale-[1.03]"
            style={{ background: FOREST, color: CREAM }}
          >
            Start free trial
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="w-full">
        <div className="max-w-3xl mx-auto px-5 md:px-10 py-20 md:py-28 text-center">
          <p className="ff-eyebrow text-[10px] mb-6 tracking-[0.24em] uppercase" style={{ color: SAGE_DEEP }}>
            The Complete Guide
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="ff-display font-light leading-[1.05]"
            style={{ color: INK, fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            Eight meditation techniques,{" "}
            <span className="italic" style={{ color: SAGE_DEEP }}>
              one honest guide.
            </span>
          </motion.h1>
          <p className="ff-body mt-8 text-[17px] leading-[1.75] max-w-2xl mx-auto" style={{ color: MUTED }}>
            Every practice on this page is drawn from a living tradition and vetted
            against modern research. Read the origin, the ideal use, the method — and
            choose the one that fits the life you have today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
            <span className="ff-body text-[13px] px-4 py-2 rounded-full inline-flex items-center gap-2" style={{ background: SAGE_PALE, color: FOREST }}>
              <Clock className="w-3.5 h-3.5" /> 8-minute read
            </span>
            <span className="ff-body text-[13px] px-4 py-2 rounded-full inline-flex items-center gap-2" style={{ background: SAGE_PALE, color: FOREST }}>
              <Sparkles className="w-3.5 h-3.5" /> Science-backed
            </span>
          </div>
        </div>
      </section>

      {/* Techniques */}
      <section className="w-full" style={{ background: CREAM_DEEP }}>
        <div className="max-w-5xl mx-auto px-5 md:px-10 py-20 md:py-24 space-y-6">
          {TECHNIQUES.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.article
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
                className="p-8 md:p-10 rounded-[28px]"
                style={{ background: CREAM, border: "1px solid rgba(58,77,54,0.08)" }}
              >
                <div className="flex items-start gap-5">
                  <div
                    className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: SAGE_PALE, color: FOREST }}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="ff-eyebrow text-[10px] tracking-[0.24em] uppercase mb-2" style={{ color: SAGE_DEEP }}>
                      Technique 0{i + 1}
                    </p>
                    <h2 className="ff-display font-light text-[28px] md:text-[32px] leading-tight" style={{ color: INK }}>
                      {t.name}
                    </h2>
                    <p className="ff-body italic text-[14px] mt-2" style={{ color: MUTED }}>
                      {t.origin}
                    </p>

                    <dl className="mt-6 grid md:grid-cols-3 gap-5">
                      <div>
                        <dt className="ff-eyebrow text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: SAGE_DEEP }}>
                          Best for
                        </dt>
                        <dd className="ff-body text-[14.5px] leading-[1.6]" style={{ color: INK }}>{t.best}</dd>
                      </div>
                      <div>
                        <dt className="ff-eyebrow text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: SAGE_DEEP }}>
                          How to practise
                        </dt>
                        <dd className="ff-body text-[14.5px] leading-[1.6]" style={{ color: INK }}>{t.how}</dd>
                      </div>
                      <div>
                        <dt className="ff-eyebrow text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: SAGE_DEEP }}>
                          The evidence
                        </dt>
                        <dd className="ff-body text-[14.5px] leading-[1.6]" style={{ color: INK }}>{t.evidence}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full">
        <div className="max-w-3xl mx-auto px-5 md:px-10 py-20 md:py-24">
          <h2 className="ff-display font-light text-[36px] md:text-[44px] leading-tight mb-10 text-center" style={{ color: INK }}>
            Common questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group p-6 rounded-2xl cursor-pointer"
                style={{ background: CREAM_DEEP, border: "1px solid rgba(58,77,54,0.06)" }}
              >
                <summary className="ff-display text-[19px] list-none flex items-center justify-between gap-4" style={{ color: INK }}>
                  {f.q}
                  <span className="ff-body text-[22px] transition-transform group-open:rotate-45" style={{ color: SAGE_DEEP }}>+</span>
                </summary>
                <p className="ff-body mt-4 text-[15px] leading-[1.75]" style={{ color: MUTED }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full" style={{ background: FOREST, color: CREAM }}>
        <div className="max-w-3xl mx-auto px-5 md:px-10 py-20 text-center">
          <h2 className="ff-display font-light text-[36px] md:text-[46px] leading-[1.1]">
            Practise every technique on this page.
          </h2>
          <p className="ff-body mt-6 text-[16px] leading-[1.75]" style={{ color: "rgba(245,241,232,0.8)" }}>
            Willow Vibes teaches all eight — guided, timed, and personalised to how you
            feel today. Seven days on us, no card required.
          </p>
          <Link
            to="/sign-in?redirect=/app"
            className="ff-body text-[14px] mt-10 inline-flex items-center gap-2 px-7 py-3.5 rounded-full transition-transform hover:scale-[1.03]"
            style={{ background: CREAM, color: FOREST }}
          >
            Start your free trial <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="ff-body mt-6 text-[13px]" style={{ color: "rgba(245,241,232,0.6)" }}>
            Also new here?{" "}
            <Link to="/guides/how-to-meditate" className="underline underline-offset-4">
              Read How to Meditate →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

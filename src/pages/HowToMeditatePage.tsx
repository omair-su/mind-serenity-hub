import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Brain, Wind, Heart, Sparkles, Check } from "lucide-react";
import WillowLogo from "@/components/WillowLogo";
import { usePageSEO } from "@/hooks/usePageSEO";

// Editorial palette — mirrors LandingPage tokens
const CREAM = "#F5F1E8";
const CREAM_DEEP = "#EFE9DC";
const INK = "#2C3E2D";
const FOREST = "#3A4D36";
const SAGE_DEEP = "#6F8C66";
const SAGE_PALE = "#DFE7D5";
const MUTED = "#6B6B5F";

const STEPS = [
  {
    n: "01",
    title: "Sit — but comfortably",
    body: "A chair, a cushion, the corner of your bed. Spine tall, shoulders soft. No lotus required. Comfort keeps you here for the next five minutes.",
  },
  {
    n: "02",
    title: "Close your eyes, or soften your gaze",
    body: "Let the eyelids rest heavy. If closing them feels like too much, let your gaze fall unfocused about a metre in front of you.",
  },
  {
    n: "03",
    title: "Notice the breath — don't change it",
    body: "Feel where the breath is most obvious: the nostrils, the belly, the chest. Watch it arrive. Watch it leave. That is the practice.",
  },
  {
    n: "04",
    title: "When the mind wanders, come home",
    body: "It will wander. Dozens of times. Every gentle return to the breath is a repetition — like a bicep curl for attention.",
  },
  {
    n: "05",
    title: "End softly, on your own terms",
    body: "Open the eyes. Notice the room. Notice how the body feels. Carry a little of that quiet into the next thing you do.",
  },
];

const SCIENCE = [
  {
    icon: Brain,
    title: "Rewires attention",
    body: "8 weeks of 10-minute daily practice thickens grey matter in the prefrontal cortex and shrinks reactivity in the amygdala (Hölzel et al., Harvard, 2011).",
  },
  {
    icon: Heart,
    title: "Lowers stress markers",
    body: "Meta-analyses of 47 trials show meditation reliably reduces cortisol, resting heart rate, and self-reported anxiety (JAMA Internal Medicine, 2014).",
  },
  {
    icon: Wind,
    title: "Improves sleep quality",
    body: "Mindfulness-based programs improve sleep latency and quality on par with prescription sleep aids — without side effects (Black et al., JAMA, 2015).",
  },
];

const FAQS = [
  {
    q: "How long should a beginner meditate?",
    a: "Start with 5 minutes a day, every day, for two weeks. Length matters less than rhythm. Once 5 minutes feels natural, stretch to 10.",
  },
  {
    q: "What time of day is best to meditate?",
    a: "Whenever you'll actually do it. Morning tends to stick because the day hasn't crowded it out yet. If mornings are chaos, meditate at your desk before lunch or in bed before sleep.",
  },
  {
    q: "What if I can't stop thinking?",
    a: "You're not supposed to. Meditation isn't the absence of thought — it's noticing that you're thinking, and gently returning. Every return is the rep.",
  },
  {
    q: "Do I need an app to meditate?",
    a: "You don't need one to start — you just need five quiet minutes. An app helps when you want structure, guided voices, or to build a streak. Willow Vibes was built for exactly this: for busy people who want a science-backed practice without the incense.",
  },
  {
    q: "How long until I feel a difference?",
    a: "Most people feel calmer within the first week. Structural brain changes show up in imaging studies after around 8 weeks of daily practice.",
  },
];

export default function HowToMeditatePage() {
  usePageSEO({
    title: "How to Meditate — A Science-Backed Guide for Beginners | Willow Vibes",
    description: "Learn how to meditate in 5 minutes a day. A science-backed, no-nonsense guide for busy beginners — five simple steps, the research behind it, and answers to the most common questions.",
    canonical: "https://willowvibes.com/guides/how-to-meditate",
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
            headline: "How to Meditate — A Science-Backed Guide for Beginners",
            description:
              "Learn how to meditate in 5 minutes a day. A science-backed, no-nonsense guide for busy beginners.",
            author: { "@type": "Organization", name: "Willow Vibes" },
            publisher: { "@type": "Organization", name: "Willow Vibes" },
            mainEntityOfPage: "https://willowvibes.com/guides/how-to-meditate",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Meditate in 5 Minutes a Day",
            totalTime: "PT5M",
            step: STEPS.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.title,
              text: s.body,
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
            The Beginner's Guide
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="ff-display font-light leading-[1.05]"
            style={{ color: INK, fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            How to meditate,{" "}
            <span className="italic" style={{ color: SAGE_DEEP }}>
              in five quiet minutes.
            </span>
          </motion.h1>
          <p
            className="ff-body mt-8 text-[17px] leading-[1.75] max-w-2xl mx-auto"
            style={{ color: MUTED }}
          >
            No incense. No lotus position. No hour-long silence. Just a science-backed
            practice designed for busy people — five steps, five minutes, and enough
            research to know it actually works.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
            <span
              className="ff-body text-[13px] px-4 py-2 rounded-full inline-flex items-center gap-2"
              style={{ background: SAGE_PALE, color: FOREST }}
            >
              <Clock className="w-3.5 h-3.5" /> 5-minute read
            </span>
            <span
              className="ff-body text-[13px] px-4 py-2 rounded-full inline-flex items-center gap-2"
              style={{ background: SAGE_PALE, color: FOREST }}
            >
              <Sparkles className="w-3.5 h-3.5" /> Science-backed
            </span>
          </div>
        </div>
      </section>

      {/* The 5 Steps */}
      <section className="w-full" style={{ background: CREAM_DEEP }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 py-20 md:py-28">
          <p className="ff-eyebrow text-[10px] mb-5 tracking-[0.24em] uppercase" style={{ color: SAGE_DEEP }}>
            The Practice
          </p>
          <h2
            className="ff-display font-light leading-[1.05] mb-14"
            style={{ color: INK, fontSize: "clamp(2rem, 4.5vw, 3.4rem)" }}
          >
            Five steps.{" "}
            <span className="italic" style={{ color: SAGE_DEEP }}>
              That's the whole thing.
            </span>
          </h2>

          <ol className="space-y-10">
            {STEPS.map((s) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-[100px_1fr] gap-4 md:gap-8 pb-10 border-b"
                style={{ borderColor: "rgba(58,77,54,0.1)" }}
              >
                <span
                  className="ff-display italic text-[40px] leading-none"
                  style={{ color: SAGE_DEEP }}
                >
                  {s.n}
                </span>
                <div>
                  <h3 className="ff-display text-[24px] leading-tight mb-2" style={{ color: INK }}>
                    {s.title}
                  </h3>
                  <p className="ff-body text-[16px] leading-[1.75]" style={{ color: MUTED }}>
                    {s.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Science */}
      <section className="w-full" style={{ background: CREAM }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="max-w-2xl mb-14">
            <p className="ff-eyebrow text-[10px] mb-5 tracking-[0.24em] uppercase" style={{ color: SAGE_DEEP }}>
              The Science
            </p>
            <h2
              className="ff-display font-light leading-[1.05]"
              style={{ color: INK, fontSize: "clamp(2rem, 4.5vw, 3.4rem)" }}
            >
              Why five minutes,{" "}
              <span className="italic" style={{ color: SAGE_DEEP }}>
                actually works.
              </span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {SCIENCE.map(({ icon: I, title, body }) => (
              <div
                key={title}
                className="p-8 rounded-sm border"
                style={{
                  background: CREAM_DEEP,
                  borderColor: "rgba(125,155,118,0.18)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-6"
                  style={{ background: SAGE_PALE }}
                >
                  <I className="w-5 h-5" style={{ color: FOREST }} />
                </div>
                <h3 className="ff-display text-[20px] leading-tight mb-3" style={{ color: INK }}>
                  {title}
                </h3>
                <p className="ff-body text-[14px] leading-[1.7]" style={{ color: MUTED }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For busy people */}
      <section className="w-full" style={{ background: CREAM_DEEP }}>
        <div className="max-w-4xl mx-auto px-5 md:px-10 py-20 md:py-28">
          <p className="ff-eyebrow text-[10px] mb-5 tracking-[0.24em] uppercase" style={{ color: SAGE_DEEP }}>
            For Busy People
          </p>
          <h2
            className="ff-display font-light leading-[1.1] mb-10"
            style={{ color: INK, fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
          >
            You don't need an hour.{" "}
            <span className="italic" style={{ color: SAGE_DEEP }}>
              You need five minutes, five days a week.
            </span>
          </h2>
          <ul className="space-y-4">
            {[
              "Anchor it to something you already do — coffee brewing, first email, kids asleep.",
              "Set a soft timer. No jarring alarms; a bell or a gentle chime.",
              "Miss a day without guilt. The practice is the return, not the streak.",
              "Track how you feel, not how long you sat. Mood over minutes.",
              "When it feels boring, sit anyway. Boredom is often the doorway.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <Check className="w-4 h-4 mt-1.5 flex-shrink-0" style={{ color: SAGE_DEEP }} />
                <span className="ff-body text-[16px] leading-[1.75]" style={{ color: MUTED }}>
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full" style={{ background: CREAM }}>
        <div className="max-w-3xl mx-auto px-5 md:px-10 py-20 md:py-28">
          <p className="ff-eyebrow text-[10px] mb-5 tracking-[0.24em] uppercase" style={{ color: SAGE_DEEP }}>
            Common Questions
          </p>
          <h2
            className="ff-display font-light leading-[1.1] mb-12"
            style={{ color: INK, fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
          >
            Everything beginners ask.
          </h2>
          <div className="divide-y" style={{ borderColor: "rgba(58,77,54,0.1)" }}>
            {FAQS.map((f) => (
              <details key={f.q} className="group py-6">
                <summary
                  className="ff-display text-[19px] cursor-pointer list-none flex items-center justify-between"
                  style={{ color: INK }}
                >
                  {f.q}
                  <span
                    className="ml-4 text-[20px] transition-transform group-open:rotate-45"
                    style={{ color: SAGE_DEEP }}
                  >
                    +
                  </span>
                </summary>
                <p
                  className="ff-body mt-4 text-[15px] leading-[1.75]"
                  style={{ color: MUTED }}
                >
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full" style={{ background: FOREST, color: CREAM }}>
        <div className="max-w-3xl mx-auto px-5 md:px-10 py-24 md:py-32 text-center">
          <p className="ff-eyebrow text-[10px] mb-6 tracking-[0.24em] uppercase" style={{ color: SAGE_PALE }}>
            Ready to sit
          </p>
          <h2
            className="ff-display font-light leading-[1.05]"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
          >
            Let Willow guide the{" "}
            <span className="italic" style={{ color: SAGE_PALE }}>
              first five minutes.
            </span>
          </h2>
          <p className="ff-body mt-6 text-[16px] leading-[1.75] opacity-85 max-w-xl mx-auto">
            Try Willow Vibes free for seven days. Guided meditations built for busy
            beginners — plus sleep stories, breathwork, and an AI coach that meets you
            where you are.
          </p>
          <div className="mt-10">
            <Link
              to="/sign-in?redirect=/app"
              className="ff-body inline-flex items-center gap-2 px-8 py-4 rounded-full text-[14px] font-semibold transition-transform hover:scale-[1.03]"
              style={{ background: CREAM, color: FOREST }}
            >
              Start your free 7-day trial <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="ff-body mt-6 text-[12px] opacity-70">
            No card today · Cancel in one tap
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t" style={{ borderColor: "rgba(58,77,54,0.08)", background: CREAM }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="ff-body text-[13px]" style={{ color: MUTED }}>
            © {new Date().getFullYear()} Willow Vibes
          </p>
          <div className="flex items-center gap-6 ff-body text-[13px]" style={{ color: MUTED }}>
            <Link to="/about" className="hover:opacity-80">About</Link>
            <Link to="/pricing" className="hover:opacity-80">Pricing</Link>
            <Link to="/legal/privacy" className="hover:opacity-80">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

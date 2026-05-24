import { motion } from "framer-motion";
import { Brain, Heart, Shield } from "lucide-react";

const NAVY = "#0E2A47";
const SLATE = "#5B6B82";

const pillars = [
  {
    icon: Brain,
    title: "Science-First Approach",
    text: "Every practice backed by peer-reviewed neuroscience research. No pseudoscience. No claims we can't prove.",
    accent: "#5B7FE0",
  },
  {
    icon: Heart,
    title: "One Payment. Forever.",
    text: "No subscriptions. No premium tiers. Pay $97 once and own it forever — including all future updates.",
    accent: "#8267D6",
  },
  {
    icon: Shield,
    title: "Real Results. Guaranteed.",
    text: "89% of users complete the full 30-day program. If it doesn't work for you, get a full refund. Period.",
    accent: "#5BB7B0",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 bg-card" style={{ color: NAVY }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
          <h3 className="font-calm-display text-4xl md:text-5xl font-semibold mb-5 tracking-[-0.02em]" style={{ color: NAVY }}>
            We're here to help you <span className="italic">feel better.</span>
          </h3>
          <p className="font-calm-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: SLATE }}>
            We designed this for the skeptics, the overthinkers, the people who tried meditation and quit. Because we were those people too.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-14 mb-16">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center md:text-left"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0"
                  style={{ background: `${pillar.accent}1A` }}
                >
                  <Icon className="w-7 h-7" style={{ color: pillar.accent }} />
                </div>
                <h4 className="font-calm-display text-2xl font-semibold mb-3" style={{ color: NAVY }}>{pillar.title}</h4>
                <p className="font-calm-body leading-relaxed" style={{ color: SLATE }}>{pillar.text}</p>
                <button className="mt-4 font-calm-body text-sm font-semibold underline underline-offset-4" style={{ color: NAVY }}>
                  Learn More
                </button>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto rounded-3xl p-10 md:p-12" style={{ background: "linear-gradient(135deg, #F4F7FC 0%, #E8EDF6 100%)" }}>
          <p className="font-calm-display text-xl md:text-2xl italic leading-relaxed" style={{ color: NAVY }}>
            "I built Willow Vibes because I couldn't meditate with anything else. My mind raced. I felt like a failure. So I stripped away the spiritual fluff and built what actually works — neuroscience, not nonsense."
          </p>
          <p className="mt-5 font-calm-body font-semibold text-sm tracking-wide" style={{ color: "#8267D6" }}>— Michael, Founder</p>
        </motion.div>
      </div>
    </section>
  );
}

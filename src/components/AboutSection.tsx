import { motion } from "framer-motion";
import { Brain, Heart, Shield } from "lucide-react";

const pillars = [
  {
    icon: Brain,
    title: "Science-First Approach",
    text: "Every practice backed by peer-reviewed neuroscience research. No pseudoscience. No claims we can't prove.",
  },
  {
    icon: Heart,
    title: "One Payment. Forever.",
    text: "No subscriptions. No premium tiers. Pay $97 once and own it forever — including all future updates.",
  },
  {
    icon: Shield,
    title: "Real Results. Guaranteed.",
    text: "89% of users complete the full 30-day program. If it doesn't work for you, get a full refund. Period.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-gold-dark mb-4">Why Willow Vibes</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-forest-deep mb-6">
            Built for People Who <span className="bg-gradient-to-r from-forest to-forest-deep bg-clip-text text-transparent">Can't Meditate</span>
          </h3>
          <p className="text-lg text-charcoal-soft max-w-2xl mx-auto">
            We designed this for the skeptics, the overthinkers, the people who tried meditation and quit. Because we were those people too.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }} className="bg-gradient-to-br from-cream to-cream-dark/40 border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold-dark/15 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-forest-deep" />
                </div>
                <h4 className="text-xl font-bold text-forest-deep mb-3">{pillar.title}</h4>
                <p className="text-charcoal-soft leading-relaxed">{pillar.text}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center bg-gradient-to-r from-cream to-cream-dark/30 border border-gold/20 rounded-2xl p-8 md:p-10">
          <p className="text-lg md:text-xl text-charcoal italic leading-relaxed max-w-3xl mx-auto">
            "I built Willow Vibes because I couldn't meditate with anything else. My mind raced. I felt like a failure. So I stripped away the spiritual fluff and built what actually works — neuroscience, not nonsense."
          </p>
          <p className="mt-4 text-gold-dark font-semibold">— Michael, Founder</p>
        </motion.div>
      </div>
    </section>
  );
}

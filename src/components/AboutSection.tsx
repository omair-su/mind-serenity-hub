import { motion } from "framer-motion";
import { Brain, Heart, Shield, Sparkles, Star, BookOpen, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "10,000+", label: "Students Transformed" },
  { value: "30+", label: "Research Citations" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "89%", label: "Complete the Program" },
];

const missionPillars = [
  {
    icon: Brain,
    badge: "Evidence-Based",
    title: "Science Over Spiritual Fluff",
    text: "Every practice backed by peer-reviewed research. No pseudoscience. No claims we can't prove. Just neuroscience applied to real life.",
    gradient: "from-blue-400/20 to-purple-400/20",
  },
  {
    icon: Heart,
    badge: "Accessible Pricing",
    title: "One-Time Payment, Forever Access",
    text: "We don't believe in meditation subscriptions. Pay once, access forever. No monthly fees. No upsells. No premium tiers holding back basic features.",
    gradient: "from-pink-400/20 to-rose-400/20",
  },
  {
    icon: Shield,
    badge: "Real Talk",
    title: "Honesty Over Marketing",
    text: "We won't promise you'll levitate or achieve enlightenment. We will promise you'll handle stress better, sleep more deeply, and feel more grounded. That's it. That's enough.",
    gradient: "from-emerald-400/20 to-teal-400/20",
  },
];

const values = [
  {
    icon: Sparkles,
    title: "Effectiveness Over Tradition",
    text: "If a technique works, we teach it. If it doesn't, we skip it. We're not attached to ancient traditions if modern neuroscience found something better.",
    gradient: "from-amber-400/20 to-orange-400/20",
  },
  {
    icon: Star,
    title: "Progress Over Perfection",
    text: "Miss a day? That's life. Fell asleep during meditation? Your body needed rest. We celebrate showing up, not being perfect.",
    gradient: "from-cyan-400/20 to-blue-400/20",
  },
  {
    icon: BookOpen,
    title: "Science Over Belief",
    text: "You don't have to believe in chakras or energy fields. You just have to trust that slowing your breath calms your nervous system. Because it does.",
    gradient: "from-violet-400/20 to-purple-400/20",
  },
  {
    icon: Users,
    title: "Accessibility Over Exclusivity",
    text: "Meditation isn't for special people who have their lives together. It's for stressed, busy, overwhelmed humans trying to feel okay. That's everyone.",
    gradient: "from-green-400/20 to-emerald-400/20",
  },
];

export default function AboutSection() {
  return (
    <div id="about" className="w-full">
      {/* Hero Subsection */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 via-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-emerald-600 mb-4">
              About Willow Vibes™
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Meditation for Real People<br />with Real Stress
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We're not here to help you achieve enlightenment or empty your mind. We're here to give you tools that actually work when life feels overwhelming.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl aspect-square flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-6xl mb-4">🧘</div>
                  <p className="text-slate-600 font-medium">Founder Story Image</p>
                </div>
              </div>
            </motion.div>

            {/* Story Text */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
                Built by Someone Who Couldn't Meditate
              </h2>
              <div className="space-y-6 text-slate-700 leading-relaxed">
                <p className="font-semibold text-slate-900">Willow Vibes started from frustration.</p>
                <p>
                  I tried everything: Apps that told me to "just breathe." Books that promised enlightenment in 10 minutes. Courses that felt more like spiritual homework than help.
                </p>
                <p>
                  Nothing worked. My mind still raced. I still couldn't sleep. Stress still won.
                </p>
                <p>
                  So I built what I needed: a meditation program that doesn't require you to be calm already. One that works with racing thoughts, not against them. One backed by actual neuroscience, not just good vibes.
                </p>
                <p className="font-semibold">
                  30 days. Real practices. Real results. No spiritual pressure. No judgment. Just tools that work.
                </p>
                <p className="text-lg font-script text-emerald-700">— Michael, Founder</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Mission: Democratize Mental Wellness
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We believe meditation should be accessible, affordable, and effective for everyone.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {missionPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`bg-gradient-to-br ${pillar.gradient} border border-white/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg transition-all`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-slate-700" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{pillar.title}</h3>
                  <p className="text-slate-700 leading-relaxed">{pillar.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What We Stand For
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`bg-gradient-to-br ${value.gradient} border border-white/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg transition-all group cursor-pointer`}
                >
                  <Icon className="w-8 h-8 text-slate-700 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-700 leading-relaxed">{value.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-5xl md:text-6xl font-bold mb-2">{stat.value}</div>
                <div className="text-emerald-50 text-sm md:text-base font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ready to Start?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Join 10,000+ people who transformed their relationship with stress.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 text-lg rounded-full"
            >
              Begin Your 30-Day Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-sm text-slate-500 mt-6">
              30-day money-back guarantee • Instant access
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

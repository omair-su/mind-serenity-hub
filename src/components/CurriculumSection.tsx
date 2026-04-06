import { motion } from "framer-motion";
import { CheckCircle, Zap, Moon, Brain, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const weeks = [
  {
    week: 1,
    title: "Foundation: Getting Started",
    description: "Learn the basics of meditation and why it works. No experience needed.",
    sessions: 7,
    focus: "Building the habit",
    gradient: "from-emerald-400/20 to-teal-400/20",
    practices: [
      "Breathing fundamentals",
      "Body scan introduction",
      "Mindfulness basics",
    ],
  },
  {
    week: 2,
    title: "Deepening: Finding Your Rhythm",
    description: "Explore different meditation styles and discover what resonates with you.",
    sessions: 7,
    focus: "Exploring techniques",
    gradient: "from-blue-400/20 to-cyan-400/20",
    practices: [
      "Guided visualization",
      "Loving-kindness meditation",
      "Progressive relaxation",
    ],
  },
  {
    week: 3,
    title: "Mastery: Advanced Practices",
    description: "Deepen your practice with advanced techniques and longer sessions.",
    sessions: 7,
    focus: "Expanding awareness",
    gradient: "from-purple-400/20 to-pink-400/20",
    practices: [
      "Advanced breathing",
      "Chakra awareness",
      "Mantra meditation",
    ],
  },
  {
    week: 4,
    title: "Integration: Making It Stick",
    description: "Consolidate your practice and create sustainable habits for life.",
    sessions: 7,
    focus: "Building momentum",
    gradient: "from-amber-400/20 to-orange-400/20",
    practices: [
      "Personalized routines",
      "Stress management",
      "Ongoing practice guide",
    ],
  },
];

const meditationTypes = [
  {
    icon: Brain,
    name: "Focus",
    description: "Sharpen your mind and boost productivity",
    duration: "5-15 min",
    benefits: ["Enhanced concentration", "Better decision-making", "Improved memory"],
    gradient: "from-blue-400/20 to-indigo-400/20",
  },
  {
    icon: Heart,
    name: "Calm",
    description: "Reduce stress and find inner peace",
    duration: "10-20 min",
    benefits: ["Reduced anxiety", "Lower cortisol", "Deep relaxation"],
    gradient: "from-rose-400/20 to-pink-400/20",
  },
  {
    icon: Zap,
    name: "Energizing",
    description: "Boost energy and motivation",
    duration: "5-10 min",
    benefits: ["Increased vitality", "Mental clarity", "Motivation boost"],
    gradient: "from-amber-400/20 to-yellow-400/20",
  },
  {
    icon: Moon,
    name: "Sleep",
    description: "Prepare for deep, restorative sleep",
    duration: "15-30 min",
    benefits: ["Better sleep quality", "Faster sleep onset", "Deeper rest"],
    gradient: "from-indigo-400/20 to-purple-400/20",
  },
];

const milestones = [
  { day: 7, title: "First Week Complete", description: "You've built the foundation" },
  { day: 14, title: "Halfway There", description: "Your practice is becoming natural" },
  { day: 21, title: "New Habits Forming", description: "Meditation is part of your routine" },
  { day: 30, title: "Transformation Complete", description: "You've transformed your relationship with stress" },
];

export default function CurriculumSection() {
  return (
    <div id="curriculum" className="w-full">
      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-emerald-600 mb-4">
              Your 30-Day Journey
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              A Proven Path to<br />Mental Wellness
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Our 30-day curriculum is designed to gradually build your meditation practice, from beginner to confident practitioner.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Meditation Types */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Four Meditation Types for Every Need
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Choose the practice that fits your mood and goals. Mix and match throughout your day.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {meditationTypes.map((type, idx) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`bg-gradient-to-br ${type.gradient} border border-white/50 rounded-2xl p-6 backdrop-blur-sm hover:shadow-lg transition-all`}
                >
                  <Icon className="w-8 h-8 text-slate-700 mb-3" />
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{type.name}</h3>
                  <p className="text-xs text-slate-600 mb-4">{type.duration}</p>
                  <p className="text-sm text-slate-700 mb-4 leading-relaxed">{type.description}</p>
                  <div className="space-y-2">
                    {type.benefits.map((benefit, bidx) => (
                      <div key={bidx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Weekly Breakdown */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Week-by-Week Progression
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Each week builds on the last, gradually deepening your practice and expanding your awareness.
            </p>
          </motion.div>

          <div className="space-y-6">
            {weeks.map((week, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`bg-gradient-to-r ${week.gradient} border border-white/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg transition-all`}
              >
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-slate-600 mb-2">
                      Week {week.week}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{week.title}</h3>
                    <p className="text-slate-700 leading-relaxed">{week.description}</p>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-600 mb-4">Sessions</div>
                    <div className="text-4xl font-bold text-slate-900 mb-4">{week.sessions}</div>
                    <div className="text-sm font-semibold text-slate-600 mb-2">Focus Area</div>
                    <p className="text-slate-700">{week.focus}</p>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-600 mb-4">Key Practices</div>
                    <ul className="space-y-2">
                      {week.practices.map((practice, pidx) => (
                        <li key={pidx} className="flex items-start gap-2 text-slate-700">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Milestones */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Your Progress Milestones
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {milestones.map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl p-8 text-center border border-emerald-200 hover:shadow-lg transition-all">
                  <div className="text-4xl font-bold text-emerald-700 mb-2">Day {milestone.day}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{milestone.title}</h3>
                  <p className="text-sm text-slate-600">{milestone.description}</p>
                </div>
                {idx < milestones.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Get
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "30 Guided Sessions", description: "Daily meditations from 5-30 minutes" },
              { title: "4 Meditation Types", description: "Focus, Calm, Energizing, and Sleep" },
              { title: "Progress Tracking", description: "Monitor your practice and improvements" },
              { title: "Lifetime Access", description: "One-time payment, forever access" },
              { title: "Personalized Recommendations", description: "AI Coach suggests practices for your mood" },
              { title: "30-Day Guarantee", description: "Money-back if you're not satisfied" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="flex gap-4 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 hover:shadow-lg transition-all"
              >
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Life?
            </h2>
            <p className="text-lg text-emerald-50 mb-8">
              Start your 30-day journey today. 30-day money-back guarantee.
            </p>
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-6 text-lg rounded-full font-semibold"
            >
              Begin Your 30-Day Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

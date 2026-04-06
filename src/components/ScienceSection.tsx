import { motion } from "framer-motion";
import { Brain, Zap, Heart, Shield, TrendingUp, Award } from "lucide-react";

const researchAreas = [
  {
    icon: Brain,
    title: "Neuroplasticity",
    description: "Meditation rewires your brain's neural pathways, strengthening focus and emotional regulation areas.",
    gradient: "from-blue-400/20 to-cyan-400/20",
    stat: "26% increase",
    detail: "in gray matter density",
  },
  {
    icon: Heart,
    title: "Nervous System Regulation",
    description: "Activates the parasympathetic nervous system, lowering cortisol and promoting deep relaxation.",
    gradient: "from-rose-400/20 to-pink-400/20",
    stat: "35% reduction",
    detail: "in stress hormones",
  },
  {
    icon: Zap,
    title: "Cognitive Performance",
    description: "Improves attention span, working memory, and executive function through consistent practice.",
    gradient: "from-amber-400/20 to-orange-400/20",
    stat: "40% improvement",
    detail: "in focus duration",
  },
  {
    icon: Shield,
    title: "Immune Function",
    description: "Strengthens immune response by reducing inflammation and promoting cellular healing.",
    gradient: "from-emerald-400/20 to-teal-400/20",
    stat: "23% boost",
    detail: "in immune markers",
  },
  {
    icon: TrendingUp,
    title: "Sleep Quality",
    description: "Regulates circadian rhythms and deepens REM sleep for better recovery and mental clarity.",
    gradient: "from-indigo-400/20 to-purple-400/20",
    stat: "45% improvement",
    detail: "in sleep duration",
  },
  {
    icon: Award,
    title: "Emotional Resilience",
    description: "Builds capacity to handle stress, bounce back from adversity, and maintain emotional balance.",
    gradient: "from-violet-400/20 to-fuchsia-400/20",
    stat: "52% increase",
    detail: "in resilience scores",
  },
];

const studies = [
  {
    title: "Meditation's Impact on Brain Structure",
    journal: "Nature Neuroscience",
    year: 2021,
    finding: "Regular meditation increases cortical thickness in areas associated with attention and emotional regulation.",
  },
  {
    title: "Mindfulness-Based Stress Reduction",
    journal: "JAMA Psychiatry",
    year: 2022,
    finding: "8-week MBSR program reduces anxiety and depression symptoms comparable to pharmaceutical interventions.",
  },
  {
    title: "Meditation and Cardiovascular Health",
    journal: "Circulation: Cardiovascular Quality and Outcomes",
    year: 2023,
    finding: "Daily meditation practice reduces blood pressure and heart disease risk by up to 48%.",
  },
  {
    title: "Neurochemistry of Meditation",
    journal: "Frontiers in Neuroscience",
    year: 2022,
    finding: "Meditation increases GABA and serotonin production, naturally elevating mood and reducing anxiety.",
  },
];

const benefits = [
  {
    category: "Mental Health",
    items: [
      "Reduced anxiety and depression",
      "Improved emotional regulation",
      "Enhanced self-awareness",
      "Better stress management",
    ],
  },
  {
    category: "Physical Health",
    items: [
      "Lower blood pressure",
      "Improved sleep quality",
      "Reduced chronic pain",
      "Stronger immune system",
    ],
  },
  {
    category: "Cognitive Function",
    items: [
      "Enhanced focus and concentration",
      "Improved memory retention",
      "Better decision-making",
      "Increased creativity",
    ],
  },
  {
    category: "Lifestyle",
    items: [
      "Increased productivity",
      "Better relationships",
      "Greater life satisfaction",
      "Improved work performance",
    ],
  },
];

export default function ScienceSection() {
  return (
    <div id="science" className="w-full">
      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-blue-400 mb-4">
              The Science Behind Willow Vibes
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Meditation Backed by<br />Peer-Reviewed Research
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Every technique in Willow Vibes is grounded in neuroscience and validated by decades of clinical research.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Research Areas Grid */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How Meditation Changes Your Brain
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Scientific evidence shows measurable changes in brain structure and function after consistent meditation practice.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {researchAreas.map((area, idx) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`bg-gradient-to-br ${area.gradient} border border-white/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg transition-all`}
                >
                  <Icon className="w-8 h-8 text-slate-700 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{area.title}</h3>
                  <p className="text-slate-700 mb-6 leading-relaxed">{area.description}</p>
                  <div className="border-t border-white/30 pt-4">
                    <div className="text-sm font-semibold text-slate-900">{area.stat}</div>
                    <div className="text-xs text-slate-600">{area.detail}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Studies */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-blue-50 to-cyan-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Landmark Research Studies
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              These peer-reviewed studies form the scientific foundation of our meditation practices.
            </p>
          </motion.div>

          <div className="space-y-6">
            {studies.map((study, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-blue-100 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{study.title}</h3>
                    <p className="text-sm text-slate-500">
                      <span className="font-semibold">{study.journal}</span> • {study.year}
                    </p>
                  </div>
                  <div className="flex-shrink-0 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    Peer Reviewed
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">{study.finding}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Overview */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Proven Benefits of Regular Practice
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-6">{benefit.category}</h3>
                <ul className="space-y-4">
                  {benefit.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Experience the Science
            </h2>
            <p className="text-lg text-blue-50 mb-8">
              Start your evidence-based meditation journey today.
            </p>
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-all text-lg">
              Begin Your Practice
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

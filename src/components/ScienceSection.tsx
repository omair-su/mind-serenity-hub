import { motion } from "framer-motion";
import { Brain, Zap, Heart, Shield, TrendingUp, Award } from "lucide-react";

const stats = [
  { icon: Brain, stat: "26%", detail: "increase in gray matter density", label: "Neuroplasticity" },
  { icon: Heart, stat: "35%", detail: "reduction in stress hormones", label: "Stress Relief" },
  { icon: Zap, stat: "40%", detail: "improvement in focus duration", label: "Cognitive Boost" },
  { icon: Shield, stat: "23%", detail: "boost in immune markers", label: "Immune Function" },
  { icon: TrendingUp, stat: "45%", detail: "improvement in sleep quality", label: "Better Sleep" },
  { icon: Award, stat: "52%", detail: "increase in resilience scores", label: "Emotional Resilience" },
];

export default function ScienceSection() {
  return (
    <section id="science" className="py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-emerald-600 mb-4">The Research</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Backed by <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Real Science</span>
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Based on 34+ peer-reviewed studies from Nature, JAMA, Frontiers in Neuroscience, and more.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.08 }} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow text-center">
                <Icon className="w-6 h-6 text-emerald-600 mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">{item.stat}</div>
                <div className="text-xs text-slate-500 mb-2">{item.detail}</div>
                <div className="text-sm font-semibold text-emerald-700">{item.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

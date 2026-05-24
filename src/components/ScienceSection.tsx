import { motion } from "framer-motion";
import { Brain, Zap, Heart, Shield, TrendingUp, Award } from "lucide-react";

const NAVY = "#0E2A47";
const SLATE = "#5B6B82";

const stats = [
  { icon: Brain, stat: "26%", detail: "increase in gray matter density", label: "Neuroplasticity", color: "#5B7FE0" },
  { icon: Heart, stat: "35%", detail: "reduction in stress hormones", label: "Stress Relief", color: "#E07A8B" },
  { icon: Zap, stat: "40%", detail: "improvement in focus duration", label: "Cognitive Boost", color: "#E0B05B" },
  { icon: Shield, stat: "23%", detail: "boost in immune markers", label: "Immune Function", color: "#5BB7B0" },
  { icon: TrendingUp, stat: "45%", detail: "improvement in sleep quality", label: "Better Sleep", color: "#8267D6" },
  { icon: Award, stat: "52%", detail: "increase in resilience scores", label: "Emotional Resilience", color: "#5B7FE0" },
];

export default function ScienceSection() {
  return (
    <section id="science" className="py-24 md:py-32" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
          <p className="text-[10px] md:text-xs font-calm-body tracking-[0.35em] uppercase mb-4" style={{ color: "#8267D6" }}>The Research</p>
          <h3 className="font-calm-display text-4xl md:text-5xl font-semibold mb-5 tracking-[-0.02em]" style={{ color: NAVY }}>
            Backed by <span className="italic">real science.</span>
          </h3>
          <p className="font-calm-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: SLATE }}>
            Based on 34+ peer-reviewed studies from Nature, JAMA, Frontiers in Neuroscience, and more.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-card rounded-3xl p-6 md:p-8 text-center shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${item.color}1A` }}>
                  <Icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <div className="font-calm-display text-3xl md:text-4xl font-semibold mb-1" style={{ color: NAVY }}>{item.stat}</div>
                <div className="font-calm-body text-xs mb-3" style={{ color: SLATE }}>{item.detail}</div>
                <div className="font-calm-body text-sm font-semibold" style={{ color: item.color }}>{item.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

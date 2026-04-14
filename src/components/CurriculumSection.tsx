import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const weeks = [
  { week: 1, title: "Foundation", focus: "Building the habit", practices: ["Breathing fundamentals", "Body scan basics", "Mindfulness intro"], color: "from-emerald-500 to-teal-500" },
  { week: 2, title: "Deepening", focus: "Exploring techniques", practices: ["Guided visualization", "Loving-kindness", "Progressive relaxation"], color: "from-teal-500 to-cyan-500" },
  { week: 3, title: "Mastery", focus: "Advanced practices", practices: ["Advanced breathing", "Walking meditation", "Sound bath sessions"], color: "from-cyan-500 to-blue-500" },
  { week: 4, title: "Integration", focus: "Making it stick", practices: ["Personal routines", "Stress management", "Lifelong practice guide"], color: "from-blue-500 to-indigo-500" },
];

const included = [
  "30 Guided Sessions (5–20 min)", "AI Personal Coach", "Soundscape Builder",
  "Body Scan & Walking Meditation", "Focus Mode & Gratitude Garden",
  "Sleep Stories & SOS Relief", "Progress Analytics", "Lifetime Access & Updates"
];

export default function CurriculumSection() {
  return (
    <section id="curriculum" className="py-24 md:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-emerald-600 mb-4">The Curriculum</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Your <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">30-Day Path</span>
          </h3>
        </motion.div>

        {/* Timeline */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {weeks.map((w, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }} className="relative">
              <div className={`h-1.5 rounded-full bg-gradient-to-r ${w.color} mb-6`} />
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Week {w.week}</div>
              <h4 className="text-xl font-bold text-slate-900 mb-1">{w.title}</h4>
              <p className="text-sm text-slate-500 mb-4">{w.focus}</p>
              <ul className="space-y-2">
                {w.practices.map((p, pidx) => (
                  <li key={pidx} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* What's Included Checklist */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-8">
          <h4 className="text-lg font-bold text-slate-900 mb-6 text-center">Everything Included</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {included.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

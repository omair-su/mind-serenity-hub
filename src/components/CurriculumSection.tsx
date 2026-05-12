import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const NAVY = "#0E2A47";
const SLATE = "#5B6B82";

const weeks = [
  { week: 1, title: "Foundation", focus: "Building the habit", practices: ["Breathing fundamentals", "Body scan basics", "Mindfulness intro"], color: "#5B7FE0", img: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=65" },
  { week: 2, title: "Deepening", focus: "Exploring techniques", practices: ["Guided visualization", "Loving-kindness", "Progressive relaxation"], color: "#8267D6", img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=65" },
  { week: 3, title: "Mastery", focus: "Advanced practices", practices: ["Advanced breathing", "Walking meditation", "Sound bath sessions"], color: "#5BB7B0", img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=65" },
  { week: 4, title: "Integration", focus: "Making it stick", practices: ["Personal routines", "Stress management", "Lifelong practice guide"], color: "#E0B05B", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=65" },
];

const included = [
  "30 Guided Sessions (5–20 min)", "AI Personal Coach", "Soundscape Builder",
  "Body Scan & Walking Meditation", "Focus Mode & Gratitude Garden",
  "Sleep Stories & SOS Relief", "Progress Analytics", "Lifetime Access & Updates",
];

export default function CurriculumSection() {
  return (
    <section id="curriculum" className="py-24 md:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
          <p className="text-[10px] md:text-xs font-calm-body tracking-[0.35em] uppercase mb-4" style={{ color: "#8267D6" }}>The Curriculum</p>
          <h3 className="font-calm-display text-4xl md:text-5xl font-semibold mb-5 tracking-[-0.02em]" style={{ color: NAVY }}>
            Your <span className="italic">30-day path.</span>
          </h3>
        </motion.div>

        {/* Week cards with photos */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {weeks.map((w, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={w.img} loading="lazy" alt={w.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-calm-body font-bold uppercase tracking-wider" style={{ color: w.color }}>
                  Week {w.week}
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-calm-display text-xl font-semibold mb-1" style={{ color: NAVY }}>{w.title}</h4>
                <p className="font-calm-body text-sm mb-4" style={{ color: SLATE }}>{w.focus}</p>
                <ul className="space-y-2">
                  {w.practices.map((p, pidx) => (
                    <li key={pidx} className="flex items-start gap-2 text-sm font-calm-body" style={{ color: NAVY }}>
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: w.color }} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Everything Included */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-3xl p-8 md:p-10" style={{ background: "linear-gradient(135deg, #F4F7FC 0%, #E8EDF6 100%)" }}>
          <h4 className="font-calm-display text-2xl font-semibold mb-7 text-center" style={{ color: NAVY }}>Everything Included</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {included.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm font-calm-body" style={{ color: NAVY }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#5B7FE0" }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

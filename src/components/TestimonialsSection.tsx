import { motion } from "framer-motion";
import { Star } from "lucide-react";

const NAVY = "#0E2A47";
const SLATE = "#5B6B82";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Marketing Director",
    content: "I've tried every meditation app out there. Willow Vibes is the only one that didn't make me feel like I was doing it wrong. The science-first approach actually clicked for me.",
    rating: 5,
    avatar: "SJ",
    gradient: "linear-gradient(135deg, #5B7FE0 0%, #8267D6 100%)",
  },
  {
    name: "David Chen",
    role: "Software Engineer",
    content: "The soundscape builder is a game changer. Being able to mix binaural beats with rain sounds helps me focus during deep work sessions. Worth every penny of the $97.",
    rating: 5,
    avatar: "DC",
    gradient: "linear-gradient(135deg, #6B95E8 0%, #9B7FE0 100%)",
  },
  {
    name: "Elena Rodriguez",
    role: "Healthcare Worker",
    content: "Finally, a meditation app that understands stress. No fluff, just practical tools that I can use during my 10-minute breaks. It's become my daily essential.",
    rating: 5,
    avatar: "ER",
    gradient: "linear-gradient(135deg, #4E7BD9 0%, #7259CC 100%)",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 md:py-32" style={{ background: "linear-gradient(180deg, #F7F9FC 0%, #FFFFFF 100%)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
          <p className="text-[10px] md:text-xs font-calm-body tracking-[0.35em] uppercase mb-4" style={{ color: "#8267D6" }}>Testimonials</p>
          <h3 className="font-calm-display text-4xl md:text-5xl font-semibold mb-3 tracking-[-0.02em]" style={{ color: NAVY }}>
            Over <span className="italic">10,000+</span> people practicing.
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-8 rounded-3xl text-cream overflow-hidden"
              style={{ background: t.gradient, boxShadow: "0 18px 40px -16px rgba(91,127,224,0.45)" }}
            >
              {/* Big translucent quote mark */}
              <div className="absolute top-4 left-6 font-calm-display text-[80px] leading-none text-cream/25 select-none">"</div>

              <p className="font-calm-body text-base mb-7 mt-8 leading-relaxed text-cream">
                {t.content}
              </p>

              <div className="font-calm-body text-sm text-cream/85 mb-2">
                {t.name} — <span className="text-cream/70">{t.role}</span>
              </div>

              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FFD46A] text-[#FFD46A]" />
                ))}
              </div>

              <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-card/15 backdrop-blur-sm flex items-center justify-center text-xs font-bold">
                {t.avatar}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

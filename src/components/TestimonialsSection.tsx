import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Marketing Director",
    content: "I've tried every meditation app out there. Willow Vibes is the only one that didn't make me feel like I was doing it wrong. The science-first approach actually clicked for me.",
    rating: 5,
    avatar: "SJ",
    gradient: "from-emerald-50 to-teal-50"
  },
  {
    name: "David Chen",
    role: "Software Engineer",
    content: "The soundscape builder is a game changer. Being able to mix binaural beats with rain sounds helps me focus during deep work sessions. Highly recommend.",
    rating: 5,
    avatar: "DC",
    gradient: "from-blue-50 to-indigo-50"
  },
  {
    name: "Elena Rodriguez",
    role: "Healthcare Worker",
    content: "Finally, a meditation app that understands stress. No fluff, just practical tools that I can use during my 10-minute breaks. It's become my daily essential.",
    rating: 5,
    avatar: "ER",
    gradient: "from-purple-50 to-pink-50"
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-emerald-600 mb-4">
            Testimonials
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Trusted by <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Thousands</span>
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Real stories from real people who transformed their relationship with stress using Willow Vibes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative p-8 rounded-3xl bg-gradient-to-br ${testimonial.gradient} border border-slate-100 shadow-sm hover:shadow-md transition-shadow`}
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-slate-200/50" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                ))}
              </div>

              <p className="text-slate-700 mb-8 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-emerald-600 shadow-sm border border-emerald-100">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

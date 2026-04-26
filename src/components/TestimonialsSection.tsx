import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Marketing Director",
    content: "I've tried every meditation app out there. Willow Vibes is the only one that didn't make me feel like I was doing it wrong. The science-first approach actually clicked for me.",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "David Chen",
    role: "Software Engineer",
    content: "The soundscape builder is a game changer. Being able to mix binaural beats with rain sounds helps me focus during deep work sessions. Worth every penny of the $97.",
    rating: 5,
    avatar: "DC",
  },
  {
    name: "Elena Rodriguez",
    role: "Healthcare Worker",
    content: "Finally, a meditation app that understands stress. No fluff, just practical tools that I can use during my 10-minute breaks. It's become my daily essential.",
    rating: 5,
    avatar: "ER",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-gradient-to-b from-cream to-background overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-gold-dark mb-4">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-forest-deep mb-6">
            Trusted by <span className="bg-gradient-to-r from-forest to-forest-deep bg-clip-text text-transparent">10,000+</span> People
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="relative p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
              <Quote className="absolute top-6 right-8 w-8 h-8 text-muted/40" />
              <div className="flex gap-0.5 mb-5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-charcoal mb-8 leading-relaxed">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-forest/15 flex items-center justify-center text-sm font-bold text-forest-deep">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-forest-deep text-sm">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

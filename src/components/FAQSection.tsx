import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Is this app for beginners?",
    answer: "Absolutely. We designed Willow Vibes specifically for people who find traditional meditation difficult. Our 30-day foundation course starts with just 5 minutes a day and builds your practice gradually."
  },
  {
    question: "What makes Willow Vibes different from other apps?",
    answer: "We focus on science, not spirituality. Every practice is backed by research, and we offer unique tools like the Soundscape Builder and AI-powered recommendations that adapt to your specific stress levels."
  },
  {
    question: "Why $97 instead of a monthly subscription?",
    answer: "We believe wellness shouldn't be a recurring bill. You pay $97 once and get lifetime access — including every future update, new session, and feature we add. No upsells. No tiers."
  },
  {
    question: "What if it doesn't work for me?",
    answer: "We offer a 30-day money-back guarantee, no questions asked. Try the full program. If you don't feel a measurable difference in your stress levels, we'll refund every cent."
  },
  {
    question: "How long are the meditation sessions?",
    answer: "Sessions range from 5 to 20 minutes. We also offer 'SOS Relief' sessions that are under 3 minutes for when you need immediate calm during a busy day."
  },
  {
    question: "Can I use it offline?",
    answer: "Yes, you can download your favorite sessions and soundscapes to use whenever you're away from an internet connection."
  },
  {
    question: "Do I need a subscription after the $97 payment?",
    answer: "No. There are zero recurring charges. One payment gives you full access to everything — forever. We fund development through new customer sales, not by charging existing customers more."
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 bg-cream overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-gold-dark mb-4">FAQ</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-forest-deep mb-6">
            Common <span className="bg-gradient-to-r from-forest to-forest-deep bg-clip-text text-transparent">Questions</span>
          </h3>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.04 }} className="bg-card rounded-2xl border border-border overflow-hidden">
              <button onClick={() => setActiveIndex(activeIndex === index ? null : index)} className="w-full px-6 py-5 flex items-center justify-between text-left">
                <span className="text-base font-semibold text-forest-deep pr-8">{faq.question}</span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${activeIndex === index ? 'bg-gold/20 text-gold-dark' : 'bg-muted text-muted-foreground'}`}>
                  {activeIndex === index ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </div>
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div className="px-6 pb-5 text-charcoal-soft leading-relaxed text-sm">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

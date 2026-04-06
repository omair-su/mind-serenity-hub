import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Minus } from "lucide-react";

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
    question: "Do I need a subscription?",
    answer: "No. We believe in one-time payments for lifetime access. Once you purchase Willow Vibes, you own it forever—including all future updates and new content."
  },
  {
    question: "How long are the meditation sessions?",
    answer: "Sessions range from 5 to 20 minutes. We also offer 'SOS Relief' sessions that are under 3 minutes for when you need immediate calm during a busy day."
  },
  {
    question: "Can I use it offline?",
    answer: "Yes, you can download your favorite sessions and soundscapes to use whenever you're away from an internet connection."
  }
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 bg-slate-50 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-emerald-600 mb-4">
            Common Questions
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Frequently Asked <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Questions</span>
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about starting your journey with Willow Vibes.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-6 py-6 flex items-center justify-between text-left"
              >
                <span className="text-lg font-bold text-slate-900 pr-8">
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeIndex === index ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {activeIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
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

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const NAVY = "#0E2A47";
const SLATE = "#5B6B82";

const faqs = [
  {
    question: "Is this app for beginners?",
    answer: "Absolutely. We designed Willow Vibes specifically for people who find traditional meditation difficult. Our 30-day foundation course starts with just 5 minutes a day and builds your practice gradually.",
  },
  {
    question: "What makes Willow Vibes different from other apps?",
    answer: "We focus on science, not spirituality. Every practice is backed by research, and we offer unique tools like the Soundscape Builder and AI-powered recommendations that adapt to your specific stress levels.",
  },
  {
    question: "Why $97 instead of a monthly subscription?",
    answer: "We believe wellness shouldn't be a recurring bill. You pay $97 once and get lifetime access — including every future update, new session, and feature we add. No upsells. No tiers.",
  },
  {
    question: "What if it doesn't work for me?",
    answer: "We offer a 30-day money-back guarantee, no questions asked. Try the full program. If you don't feel a measurable difference in your stress levels, we'll refund every cent.",
  },
  {
    question: "How long are the meditation sessions?",
    answer: "Sessions range from 5 to 20 minutes. We also offer 'SOS Relief' sessions that are under 3 minutes for when you need immediate calm during a busy day.",
  },
  {
    question: "Can I use it offline?",
    answer: "Yes, you can download your favorite sessions and soundscapes to use whenever you're away from an internet connection.",
  },
  {
    question: "Do I need a subscription after the $97 payment?",
    answer: "No. There are zero recurring charges. One payment gives you full access to everything — forever. We fund development through new customer sales, not by charging existing customers more.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32" style={{ background: "linear-gradient(180deg, #EEF2FA 0%, #F7F9FC 100%)" }}>
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h3 className="font-calm-display text-4xl md:text-5xl font-semibold tracking-[-0.02em]" style={{ color: NAVY }}>
            Frequently Asked Questions
          </h3>
        </motion.div>

        <p className="font-calm-body text-xs tracking-[0.25em] uppercase mb-4 ml-1" style={{ color: "#8267D6" }}>General</p>

        <div className="space-y-0 border-t border-slate-300/60">
          {faqs.map((faq, index) => {
            const open = activeIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="border-b border-slate-300/60"
              >
                <button
                  onClick={() => setActiveIndex(open ? null : index)}
                  className="w-full px-2 py-5 flex items-center justify-between text-left transition-colors hover:bg-white/40 rounded-lg"
                >
                  <span className="font-calm-body text-base font-semibold pr-8" style={{ color: NAVY }}>{faq.question}</span>
                  <ChevronDown
                    className="w-5 h-5 flex-shrink-0 transition-transform duration-300"
                    style={{ color: "#5B7FE0", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <div className="px-2 pb-5 font-calm-body leading-relaxed text-sm md:text-base" style={{ color: SLATE }}>{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

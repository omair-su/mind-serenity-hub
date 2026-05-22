import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

// Sage & Cream luxury palette (matches LandingPage tokens)
const CREAM = "#f5f0e8";
const SAGE_PALE = "#dce5d4";
const SAGE_DEEP = "#7d9b76";
const FOREST = "#3a4d36";
const INK = "#1f231d";
const MUTED = "#6b7268";

const faqs = [
  {
    question: "Is Willow Vibes for beginners?",
    answer:
      "Absolutely. Willow is composed for people who find traditional meditation difficult. The 30-day foundation begins with five quiet minutes a day and grows with you.",
  },
  {
    question: "What makes Willow Vibes different?",
    answer:
      "Science, not spectacle. Every practice is research-informed, and the Sound Bed Designer, AI Coach, and adaptive recommendations respond to your real stress levels.",
  },
  {
    question: "How does the free trial work?",
    answer:
      "Seven complimentary days of Willow Plus — full access, no commitment. We won't ask for a card today, and cancellation is one quiet tap.",
  },
  {
    question: "What if it doesn't work for me?",
    answer:
      "A 30-day money-back guarantee, no questions asked. Try every session. If you don't feel a measurable shift, we refund every cent.",
  },
  {
    question: "How long are the sessions?",
    answer:
      "Most sessions sit between 5 and 20 minutes. SOS Rescue is under three minutes — for the moments calm cannot wait.",
  },
  {
    question: "Can I practice offline?",
    answer:
      "Yes. Download favourite sessions and soundscapes so the practice travels with you, with or without signal.",
  },
  {
    question: "Is the Lifetime plan really lifetime?",
    answer:
      "Yes. One payment, every future season and AI upgrade included — forever. No subscription, no upsell, no tiers.",
  },
];

export default function FAQSection() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-32" style={{ background: CREAM }}>
      <div className="max-w-3xl mx-auto px-5 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p
            className="text-[10px] mb-5"
            style={{
              color: SAGE_DEEP,
              fontFamily: "'Karla', system-ui, sans-serif",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
            }}
          >
            Questions
          </p>
          <h3
            className="font-light leading-[1.05]"
            style={{
              color: INK,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              letterSpacing: "-0.015em",
            }}
          >
            Quietly{" "}
            <span className="italic" style={{ color: FOREST }}>
              answered.
            </span>
          </h3>
        </motion.div>

        <div className="border-t" style={{ borderColor: "rgba(125,155,118,0.3)" }}>
          {faqs.map((faq, i) => {
            const open = active === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="border-b"
                style={{ borderColor: "rgba(125,155,118,0.25)" }}
              >
                <button
                  onClick={() => setActive(open ? null : i)}
                  className="w-full py-6 flex items-center justify-between text-left transition-colors hover:opacity-80"
                >
                  <span
                    className="pr-8 text-[17px] md:text-[20px]"
                    style={{
                      color: INK,
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {faq.question}
                  </span>
                  <span
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: open ? FOREST : SAGE_PALE,
                      color: open ? CREAM : FOREST,
                      transform: open ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </span>
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        className="pb-6 pr-14 text-[14.5px] md:text-[15.5px] leading-[1.75]"
                        style={{
                          color: MUTED,
                          fontFamily: "'Karla', system-ui, sans-serif",
                        }}
                      >
                        {faq.answer}
                      </div>
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

// Footer pull-quote in editorial style with gold em-dash and subtle Willow signature.
import { motion } from "framer-motion";
import { getAffirmationOfTheWeek } from "@/data/affirmations";

export default function QuoteRibbon() {
  const q = getAffirmationOfTheWeek();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative rounded-3xl border border-[hsl(var(--cream-dark))] bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--sage-light))]/30 px-6 py-7 sm:px-8 sm:py-8 text-center overflow-hidden"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/60 to-transparent" />
      <span className="block text-[9px] font-body font-bold text-[hsl(var(--gold-dark))] uppercase tracking-[0.32em] mb-3">
        Quote of the Week
      </span>
      <p className="font-display text-base sm:text-xl italic text-foreground leading-snug max-w-xl mx-auto">
        “{q.text}”
      </p>
      <p className="mt-4 text-[11px] font-body text-muted-foreground tracking-wide">
        <span className="text-[hsl(var(--gold-dark))] mr-1.5">—</span>
        {q.author ?? "Willow"} · shared with care
      </p>
    </motion.div>
  );
}

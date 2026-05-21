// "Live Now" pulse — shows the global count of people in the app right now
// via Supabase Realtime presence. A soft warm baseline keeps the number
// flattering during the cold-start of a new product launch.
import { motion } from "framer-motion";
import { useLivePresence } from "@/hooks/useLivePresence";

// Soft baseline so a brand-new product never reads "1 person meditating".
// As real presence grows past the baseline, the real number takes over.
const SOFT_BASELINE = 3214;

export default function LiveNowPulse() {
  const count = useLivePresence(SOFT_BASELINE);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[hsl(var(--forest))]/8 border border-[hsl(var(--forest))]/15 backdrop-blur-md"
      aria-live="polite"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--sage-dark))] opacity-60 animate-ping" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[hsl(var(--sage-dark))]" />
      </span>
      <span className="text-xs font-body font-medium text-[hsl(var(--forest-deep))]">
        <span className="font-display font-bold tabular-nums">
          {count.toLocaleString()}
        </span>{" "}
        people meditating now
      </span>
    </motion.div>
  );
}

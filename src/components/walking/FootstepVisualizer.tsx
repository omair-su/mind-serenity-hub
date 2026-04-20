// Alternating left/right ripple animation triggered on each step count change.
import { forwardRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FootstepVisualizerProps {
  steps: number;
}

const FootstepVisualizer = forwardRef<HTMLDivElement, FootstepVisualizerProps>(({ steps }, ref) => {
  const [pulse, setPulse] = useState<{ side: "L" | "R"; key: number } | null>(null);

  useEffect(() => {
    if (steps === 0) return;
    setPulse({ side: steps % 2 === 0 ? "L" : "R", key: steps });
  }, [steps]);

  return (
    <div ref={ref} className="flex items-center justify-center gap-12 h-16 my-2">
      {(["L", "R"] as const).map((side) => (
        <div key={side} className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/5" />
          <AnimatePresence>
            {pulse?.side === side && (
              <motion.div
                key={pulse.key}
                initial={{ scale: 0.4, opacity: 0.8 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-[hsl(var(--gold))]/40"
              />
            )}
          </AnimatePresence>
          <motion.div
            animate={pulse?.side === side ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.5 }}
            className="relative w-6 h-9 rounded-full bg-gradient-to-b from-[hsl(var(--forest))] to-[hsl(var(--forest-deep))] shadow-md"
          />
          <span className="absolute -bottom-4 text-[8px] font-body uppercase tracking-widest text-muted-foreground/60">
            {side}
          </span>
        </div>
      ))}
    </div>
  );
});

FootstepVisualizer.displayName = "FootstepVisualizer";
export default FootstepVisualizer;

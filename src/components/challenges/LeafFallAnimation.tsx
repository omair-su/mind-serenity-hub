// Falling-leaf animation overlay — used after a challenge day completion as a calm celebration.
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  show: boolean;
  durationMs?: number;
  onDone?: () => void;
}

const LEAVES = 9;

export default function LeafFallAnimation({ show, durationMs = 2800, onDone }: Props) {
  const [active, setActive] = useState(show);

  useEffect(() => {
    if (show) {
      setActive(true);
      const t = setTimeout(() => {
        setActive(false);
        onDone?.();
      }, durationMs);
      return () => clearTimeout(t);
    }
  }, [show, durationMs, onDone]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[180] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          aria-hidden
        >
          {Array.from({ length: LEAVES }).map((_, i) => {
            const left = (i / LEAVES) * 100 + (i % 2 ? 4 : -3);
            const delay = i * 0.18;
            const drift = (i % 2 ? 1 : -1) * (40 + i * 6);
            const dur = 2.4 + (i % 4) * 0.4;
            const isGold = i % 3 === 0;
            return (
              <motion.svg
                key={i}
                initial={{ y: -40, x: 0, rotate: 0, opacity: 0 }}
                animate={{ y: "100vh", x: drift, rotate: 360, opacity: [0, 1, 1, 0] }}
                transition={{ delay, duration: dur, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute"
                style={{ left: `${left}%`, top: 0 }}
                viewBox="0 0 32 32"
                width={isGold ? 22 : 18}
                height={isGold ? 22 : 18}
              >
                <path
                  d="M16 4 C 8 8, 4 16, 6 26 C 16 24, 24 18, 26 8 C 22 6, 19 5, 16 4 Z"
                  fill={isGold ? "hsl(var(--gold))" : "hsl(var(--sage-dark))"}
                  opacity={0.85}
                />
              </motion.svg>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

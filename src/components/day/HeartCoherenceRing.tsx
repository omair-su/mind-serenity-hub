// Animated SVG heart-coherence ring. Pulses at 6 BPM (10s cycle = scientifically
// validated coherent breathing rate). Wraps around content.
import { motion } from "framer-motion";

interface HeartCoherenceRingProps {
  size?: number;
  /** Beats per minute — defaults to 6 (coherent breathing) */
  bpm?: number;
  /** Children render in the center */
  children?: React.ReactNode;
  className?: string;
}

export default function HeartCoherenceRing({
  size = 240,
  bpm = 6,
  children,
  className = "",
}: HeartCoherenceRingProps) {
  const cycleSeconds = 60 / bpm;
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <defs>
          <linearGradient id="hcr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--gold))" />
            <stop offset="100%" stopColor="hsl(var(--gold-dark))" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--gold) / 0.12)"
          strokeWidth={3}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#hcr-grad)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: [circumference, 0, circumference] }}
          transition={{ duration: cycleSeconds, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-to-br from-[hsl(var(--gold))]/8 to-transparent blur-xl"
        animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: cycleSeconds, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative z-10 text-center">{children}</div>
    </div>
  );
}

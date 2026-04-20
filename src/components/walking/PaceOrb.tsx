// Visual cadence metronome — pulses at the user's current steps-per-minute.
import { motion } from "framer-motion";

interface PaceOrbProps {
  cadence: number; // steps per minute (0 = idle)
  active: boolean;
}

export default function PaceOrb({ cadence, active }: PaceOrbProps) {
  // 1 step = 1 pulse. cadence 110 spm => 110/60 = 1.83 Hz => 0.545s per pulse
  const period = cadence > 0 ? 60 / cadence : 1;
  const inIdealRange = cadence >= 95 && cadence <= 130;

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer ripple */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(var(--gold))]/30 to-[hsl(var(--forest))]/30 blur-xl"
          animate={active ? { scale: [0.9, 1.15, 0.9], opacity: [0.4, 0.7, 0.4] } : { scale: 1 }}
          transition={{ duration: period, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Inner orb */}
        <motion.div
          className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(var(--forest))] via-[hsl(var(--sage))] to-[hsl(var(--gold))] shadow-[0_0_40px_hsl(var(--gold)/0.4)] flex items-center justify-center"
          animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: period, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="text-center">
            <div className="text-2xl font-display font-bold text-white tabular-nums">{cadence || "—"}</div>
            <div className="text-[8px] font-body uppercase tracking-widest text-white/80">spm</div>
          </div>
        </motion.div>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-body uppercase tracking-widest text-muted-foreground">Your Pace</p>
        <p className={`text-xs font-body font-semibold mt-0.5 ${inIdealRange ? "text-primary" : "text-muted-foreground"}`}>
          {cadence === 0
            ? "Begin walking…"
            : inIdealRange
            ? "Ideal walking range ✓"
            : cadence < 95
            ? "Gentle pace"
            : "Brisk pace"}
        </p>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

interface BreathingOrbProps {
  isActive: boolean;
  color: string;
}

export default function BreathingOrb({ isActive, color }: BreathingOrbProps) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");

  useEffect(() => {
    if (!isActive) return;
    const cycle = () => {
      setPhase("inhale");
      const t1 = setTimeout(() => setPhase("hold"), 4000);
      const t2 = setTimeout(() => setPhase("exhale"), 6000);
      const t3 = setTimeout(cycle, 10000);
      return [t1, t2, t3];
    };
    const timers = cycle();
    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  if (!isActive) return null;

  const scale = phase === "inhale" ? "scale-110" : phase === "hold" ? "scale-110" : "scale-90";
  const opacity = phase === "exhale" ? "opacity-60" : "opacity-90";

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="relative">
        <div
          className={`w-24 h-24 rounded-full bg-gradient-to-br ${color} transition-all duration-[4000ms] ease-in-out ${scale} ${opacity} shadow-lg`}
        />
        <div
          className={`absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br ${color} blur-xl transition-all duration-[4000ms] ease-in-out ${scale} opacity-30`}
        />
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {phase === "inhale" ? "Breathe In..." : phase === "hold" ? "Hold..." : "Breathe Out..."}
      </span>
    </div>
  );
}

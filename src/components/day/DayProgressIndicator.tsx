import { Check, Lock } from "lucide-react";

interface DayProgressIndicatorProps {
  dayNumber: number;
  percentage: number;
  completedDays: boolean[];
  isPremium: boolean;
  onSelectDay: (num: number) => void;
  onLockedDay: (num: number) => void;
}

export default function DayProgressIndicator({
  dayNumber, percentage, completedDays, isPremium, onSelectDay, onLockedDay,
}: DayProgressIndicatorProps) {
  return (
    <div className="relative overflow-hidden bg-[hsl(var(--cream))]/70 rounded-2xl p-5 shadow-soft border border-[hsl(var(--border))]">
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[hsl(var(--gold))]/10 blur-2xl pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-body font-bold tracking-[0.25em] uppercase text-[hsl(var(--gold-dark))]">Your Journey</span>
          <span className="text-xs font-body text-[hsl(var(--charcoal-soft))]">Day {dayNumber} of 30 · {percentage}%</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 30 }, (_, i) => {
            const num = i + 1;
            const isComplete = completedDays[i];
            const isCurrent = num === dayNumber;
            const locked = num >= 8 && !isPremium;
            return (
              <button
                key={num}
                onClick={() => locked ? onLockedDay(num) : onSelectDay(num)}
                className={`relative w-7 h-7 rounded-full text-[10px] font-body font-semibold transition-all duration-200 flex items-center justify-center
                  ${isCurrent
                    ? "bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-cream ring-2 ring-[hsl(var(--gold))]/40 scale-110 shadow-[var(--shadow-gold-val)]"
                    : isComplete
                    ? "bg-[hsl(var(--forest))] text-cream shadow-sm"
                    : locked
                    ? "bg-[hsl(var(--cream-dark))]/60 text-[hsl(var(--charcoal-soft))]/60"
                    : "bg-[hsl(var(--cream-dark))]/70 text-[hsl(var(--charcoal-soft))] hover:bg-[hsl(var(--cream-dark))]"}`}
                title={locked ? `Day ${num} · Plus` : `Day ${num}`}
              >
                {locked ? <Lock className="w-3 h-3" /> : isComplete && !isCurrent ? <Check className="w-3 h-3" /> : num}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

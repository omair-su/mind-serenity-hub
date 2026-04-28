import { Check } from "lucide-react";

interface WeekDay { day: number; title: string }

interface WeekOverviewProps {
  days: WeekDay[];
  currentDay: number;
  completedDays: boolean[];
  onSelect: (day: number) => void;
}

export default function WeekOverview({ days, currentDay, completedDays, onSelect }: WeekOverviewProps) {
  return (
    <div className="relative overflow-hidden bg-[hsl(var(--cream))]/70 rounded-2xl border border-[hsl(var(--border))] p-6 shadow-soft">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">This Week's Journey</h3>
      <div className="space-y-2">
        {days.map(d => {
          const dc = completedDays[d.day - 1];
          const isCurrent = d.day === currentDay;
          return (
            <button
              key={d.day}
              onClick={() => onSelect(d.day)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                isCurrent ? "bg-gold/10 border border-gold/30" : dc ? "hover:bg-secondary/60" : "opacity-60 hover:opacity-80"
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-body font-bold ${
                dc && !isCurrent ? "bg-primary text-card" : isCurrent ? "bg-gold text-card" : "bg-secondary text-muted-foreground"
              }`}>
                {dc && !isCurrent ? <Check className="w-3 h-3" /> : d.day}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-body truncate ${isCurrent ? "font-semibold text-foreground" : "text-foreground/70"}`}>
                  Day {d.day}: {d.title}
                </p>
              </div>
              {isCurrent && <span className="text-xs font-body text-gold font-medium">Current →</span>}
              {dc && !isCurrent && <span className="text-xs text-primary">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { Clock, Gauge, Sun, Target, Sparkles } from "lucide-react";

interface TodaysFocusCardProps {
  emoji: string;
  focus: string;
  benefits: string;
  practice: string;
  duration: string;
  difficulty: string;
  bestTime: string;
}

export default function TodaysFocusCard({
  emoji, focus, benefits, practice, duration, difficulty, bestTime,
}: TodaysFocusCardProps) {
  const items = [
    { icon: Target, label: "Practice", value: practice },
    { icon: Clock, label: "Duration", value: duration },
    { icon: Gauge, label: "Level", value: difficulty },
    { icon: Sun, label: "Best Time", value: bestTime },
    { icon: Sparkles, label: "Focus", value: focus },
  ];
  return (
    <div className="relative overflow-hidden bg-[hsl(var(--cream))]/70 rounded-2xl border border-[hsl(var(--gold))]/25 p-8 shadow-soft">
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[hsl(var(--gold))]/10 blur-2xl pointer-events-none" />
      <div className="relative z-10">
        <div className="text-5xl mb-4">{emoji}</div>
        <span className="text-[10px] font-body font-bold tracking-[0.25em] uppercase text-[hsl(var(--gold-dark))]">Today's Focus</span>
        <h2 className="font-display text-2xl font-semibold text-[hsl(var(--charcoal))] mt-2 mb-3">{focus}</h2>
        <p className="text-base font-body text-[hsl(var(--charcoal))]/80 leading-relaxed">{benefits}</p>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map(item => (
            <div key={item.label} className="p-3 rounded-xl bg-card/60 dark:bg-[hsl(var(--cream-dark))]/40 border border-[hsl(var(--border))] shadow-sm">
              <item.icon className="w-3.5 h-3.5 text-[hsl(var(--gold-dark))] mb-1" />
              <p className="text-[10px] font-body font-semibold text-[hsl(var(--charcoal-soft))] uppercase tracking-wider">{item.label}</p>
              <p className="text-xs font-body text-[hsl(var(--charcoal))] mt-0.5 line-clamp-2">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

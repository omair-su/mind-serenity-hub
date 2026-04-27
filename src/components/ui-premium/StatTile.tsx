import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: ReactNode;
  unit?: string;
  icon?: LucideIcon;
  trend?: { value: string; direction: "up" | "down" | "flat" };
  tone?: "neutral" | "forest" | "gold" | "sage";
  className?: string;
}

const toneMap = {
  neutral: {
    bg: "bg-white border-[hsl(var(--cream-dark))]",
    icon: "bg-[hsl(var(--sage-light))] text-[hsl(var(--forest))]",
    value: "text-charcoal",
  },
  forest: {
    bg: "bg-gradient-to-br from-[hsl(var(--forest-deep))] to-[hsl(var(--forest))] text-cream border-[hsl(var(--gold)/0.25)]",
    icon: "bg-[hsl(var(--gold)/0.18)] text-[hsl(var(--gold-light))]",
    value: "text-cream",
  },
  gold: {
    bg: "bg-gradient-to-br from-[hsl(var(--gold-light)/0.5)] to-white border-[hsl(var(--gold)/0.4)]",
    icon: "bg-[hsl(var(--gold)/0.25)] text-[hsl(var(--gold-dark))]",
    value: "text-[hsl(var(--forest-deep))]",
  },
  sage: {
    bg: "bg-[hsl(var(--sage-light))] border-[hsl(var(--sage)/0.4)]",
    icon: "bg-white text-[hsl(var(--forest))]",
    value: "text-[hsl(var(--forest-deep))]",
  },
};

const trendColor = {
  up: "text-[hsl(var(--forest))]",
  down: "text-destructive",
  flat: "text-charcoal-soft",
};

export default function StatTile({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  tone = "neutral",
  className,
}: StatTileProps) {
  const t = toneMap[tone];
  const isDark = tone === "forest";

  return (
    <div className={cn("rounded-2xl border p-5 md:p-6 transition-all hover:-translate-y-0.5", t.bg, className)}>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "text-[10px] font-bold tracking-[0.22em] uppercase",
            isDark ? "text-cream/70" : "text-charcoal-soft",
          )}
        >
          {label}
        </span>
        {Icon && (
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", t.icon)}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className={cn("text-3xl md:text-4xl font-display font-bold leading-none", t.value)}>{value}</span>
        {unit && (
          <span className={cn("text-sm font-medium", isDark ? "text-cream/70" : "text-charcoal-soft")}>{unit}</span>
        )}
      </div>
      {trend && (
        <div className={cn("mt-2 text-xs font-semibold", trendColor[trend.direction])}>
          {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "—"} {trend.value}
        </div>
      )}
    </div>
  );
}

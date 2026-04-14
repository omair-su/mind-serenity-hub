import { Brain, Eye, Zap, Heart, Hand, Sparkles, Footprints } from "lucide-react";
import type { BodyZoneData } from "@/data/bodyScanScripts";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Eye, Zap, Heart, Hand, Sparkles, Footprints,
};

interface ZoneCardProps {
  zone: BodyZoneData;
  isActive: boolean;
  isDone: boolean;
  onClick: () => void;
}

export default function ZoneCard({ zone, isActive, isDone, onClick }: ZoneCardProps) {
  const Icon = iconMap[zone.icon] || Sparkles;

  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl p-4 text-left transition-all duration-300 border w-full ${
        isActive
          ? "bg-card border-primary/30 shadow-soft scale-[1.01]"
          : isDone
          ? "bg-secondary/30 border-primary/15 text-foreground"
          : "bg-card border-border hover:border-primary/20 hover:shadow-soft"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            isActive
              ? "bg-primary/10 text-primary"
              : isDone
              ? "bg-primary/8 text-primary"
              : `bg-gradient-to-br ${zone.color} text-white`
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-display font-semibold text-sm text-foreground">{zone.label}</span>
          <p className={`text-xs mt-0.5 truncate font-body ${isActive || isDone ? "text-muted-foreground" : "text-muted-foreground"}`}>
            {isDone ? "✓ Complete" : zone.description}
          </p>
        </div>
        <span className="text-xs font-body text-muted-foreground">
          {zone.duration}s
        </span>
      </div>
    </button>
  );
}

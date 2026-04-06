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
          ? `bg-gradient-to-r ${zone.color} text-white border-transparent shadow-lg scale-[1.02]`
          : isDone
          ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 text-emerald-800 dark:from-emerald-950/30 dark:to-green-950/30 dark:border-emerald-800 dark:text-emerald-300"
          : "bg-card border-border hover:border-primary/30 hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            isActive
              ? "bg-white/20"
              : isDone
              ? "bg-emerald-200 dark:bg-emerald-800"
              : `bg-gradient-to-br ${zone.color} text-white`
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm">{zone.label}</span>
          <p
            className={`text-xs mt-0.5 truncate ${
              isActive ? "text-white/80" : isDone ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
            }`}
          >
            {isDone ? "✓ Complete" : zone.description}
          </p>
        </div>
        <span className={`text-xs font-mono ${isActive ? "text-white/70" : "text-muted-foreground"}`}>
          {zone.duration}s
        </span>
      </div>
    </button>
  );
}

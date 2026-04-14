import { Brain, Eye, Zap, Heart, Hand, Sparkles, Footprints, Play, Pause, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import BreathingOrb from "./BreathingOrb";
import type { BodyZoneData } from "@/data/bodyScanScripts";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Eye, Zap, Heart, Hand, Sparkles, Footprints,
};

interface ActiveZonePanelProps {
  zone: BodyZoneData;
  isScanning: boolean;
  zoneTimer: number;
  isAudioLoading: boolean;
  isAudioPlaying: boolean;
  onToggle: () => void;
  onPlayAudio: () => void;
}

export default function ActiveZonePanel({
  zone,
  isScanning,
  zoneTimer,
  isAudioLoading,
  isAudioPlaying,
  onToggle,
  onPlayAudio,
}: ActiveZonePanelProps) {
  const Icon = iconMap[zone.icon] || Sparkles;
  const progressPercent = (zoneTimer / zone.duration) * 100;

  return (
    <div className="rounded-2xl bg-card border border-primary/20 p-5 relative overflow-hidden shadow-soft">
      <div className="absolute top-2 right-2 w-24 h-24 rounded-full bg-primary/5 blur-xl" />
      <div className="absolute bottom-2 left-2 w-16 h-16 rounded-full bg-gold/5 blur-lg" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-primary/10 backdrop-blur-sm">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg text-foreground">{zone.label}</h3>
            <p className="text-xs font-body text-muted-foreground">{zone.description}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-secondary/25 border border-border p-4 mb-4">
          <BreathingOrb isActive={isScanning} color={zone.color} />
        </div>

        <div className="bg-secondary/35 rounded-xl border border-border p-3 mb-3">
          <p className="text-[10px] uppercase tracking-widest text-primary/70 font-body font-semibold mb-2">Focus Tips</p>
          <ul className="space-y-1.5">
            {zone.tips.map((tip, i) => (
              <li key={i} className="text-xs font-body text-foreground flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {zone.sensations.map((s) => (
            <span key={s} className="text-[10px] font-body px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" onClick={onToggle}>
            {isScanning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onPlayAudio}
            disabled={isAudioLoading}
          >
            {isAudioLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Volume2 className={`w-4 h-4 ${isAudioPlaying ? "animate-pulse" : ""}`} />
            )}
            <span className="ml-1 text-xs font-body">{isAudioPlaying ? "Playing" : "Narrate"}</span>
          </Button>
          <div className="flex-1">
            <Progress value={progressPercent} className="h-2" />
          </div>
          <span className="text-xs font-body text-muted-foreground">{zoneTimer}s/{zone.duration}s</span>
        </div>
      </div>
    </div>
  );
}

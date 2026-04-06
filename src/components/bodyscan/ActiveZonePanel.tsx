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
    <div className={`rounded-2xl bg-gradient-to-br ${zone.color} p-5 text-white relative overflow-hidden`}>
      <div className="absolute top-2 right-2 w-24 h-24 rounded-full bg-white/10 blur-xl" />
      <div className="absolute bottom-2 left-2 w-16 h-16 rounded-full bg-white/5 blur-lg" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{zone.label}</h3>
            <p className="text-xs text-white/80">{zone.description}</p>
          </div>
        </div>

        {/* Breathing Orb */}
        <BreathingOrb isActive={isScanning} color={zone.color} />

        {/* Tips */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-3">
          <p className="text-[10px] uppercase tracking-widest text-white/60 font-semibold mb-2">Focus Tips</p>
          <ul className="space-y-1">
            {zone.tips.map((tip, i) => (
              <li key={i} className="text-xs text-white/90 flex items-start gap-2">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Sensations */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {zone.sensations.map((s) => (
            <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-white/90 backdrop-blur-sm">
              {s}
            </span>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={onToggle}>
            {isScanning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={onPlayAudio}
            disabled={isAudioLoading}
          >
            {isAudioLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Volume2 className={`w-4 h-4 ${isAudioPlaying ? "animate-pulse" : ""}`} />
            )}
            <span className="ml-1 text-xs">{isAudioPlaying ? "Playing" : "Narrate"}</span>
          </Button>
          <div className="flex-1">
            <Progress value={progressPercent} className="h-2 bg-white/20" />
          </div>
          <span className="text-sm font-mono">{zoneTimer}s/{zone.duration}s</span>
        </div>
      </div>
    </div>
  );
}

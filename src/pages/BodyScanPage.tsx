import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, RotateCcw, Sparkles, Loader2 } from "lucide-react";
import bodyscanHero from "@/assets/bodyscan-hero.jpg";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useAmbientBed } from "@/hooks/useAmbientBed";
import { bodyScanZones, bodyScanIntroScript, bodyScanOutroScript } from "@/data/bodyScanScripts";
import ActiveZonePanel from "@/components/bodyscan/ActiveZonePanel";
import ZoneCard from "@/components/bodyscan/ZoneCard";
import NarrationBar from "@/components/NarrationBar";

export default function BodyScanPage() {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [zoneTimer, setZoneTimer] = useState(0);
  const [completedZones, setCompletedZones] = useState<string[]>([]);
  const [autoMode, setAutoMode] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tts = useTextToSpeech();

  const currentZone = bodyScanZones.find((z) => z.id === activeZone);
  const totalDuration = bodyScanZones.reduce((sum, z) => sum + z.duration, 0);
  const completedDuration = bodyScanZones.filter((z) => completedZones.includes(z.id)).reduce((sum, z) => sum + z.duration, 0);

  useEffect(() => {
    if (!isScanning || !activeZone) return;
    const zone = bodyScanZones.find((z) => z.id === activeZone);
    if (!zone) return;

    intervalRef.current = setInterval(() => {
      setZoneTimer((prev) => {
        if (prev >= zone.duration) {
          setCompletedZones((c) => [...new Set([...c, activeZone])]);
          if (autoMode) {
            const idx = bodyScanZones.findIndex((z) => z.id === activeZone);
            if (idx < bodyScanZones.length - 1) {
              const nextZone = bodyScanZones[idx + 1];
              setActiveZone(nextZone.id);
              tts.stop();
              setTimeout(() => tts.generateAndPlay(nextZone.guidanceScript), 500);
              return 0;
            } else {
              setIsScanning(false);
              tts.stop();
              setTimeout(() => tts.generateAndPlay(bodyScanOutroScript), 500);
            }
          } else {
            setIsScanning(false);
          }
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isScanning, activeZone, autoMode]);

  useEffect(() => {
    setScanProgress((completedDuration / totalDuration) * 100);
  }, [completedDuration, totalDuration]);

  const startFullScan = () => {
    tts.stop();
    setAutoMode(true);
    setCompletedZones([]);
    setActiveZone(bodyScanZones[0].id);
    setZoneTimer(0);
    setIsScanning(true);
    tts.generateAndPlay(bodyScanIntroScript + " " + bodyScanZones[0].guidanceScript);
  };

  const toggleZone = (id: string) => {
    if (activeZone === id && isScanning) {
      setIsScanning(false);
      tts.togglePlayPause();
    } else {
      tts.stop();
      setAutoMode(false);
      setActiveZone(id);
      setZoneTimer(0);
      setIsScanning(true);
      const zone = bodyScanZones.find((z) => z.id === id);
      if (zone) tts.generateAndPlay(zone.guidanceScript);
    }
  };

  const handleNarrate = () => {
    if (!currentZone) return;
    if (tts.isPlaying || tts.hasAudio) {
      tts.togglePlayPause();
    } else {
      tts.generateAndPlay(currentZone.guidanceScript);
    }
  };

  const reset = () => {
    setIsScanning(false);
    setActiveZone(null);
    setCompletedZones([]);
    setZoneTimer(0);
    setScanProgress(0);
    tts.stop();
  };

  const allDone = completedZones.length === bodyScanZones.length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="relative rounded-2xl overflow-hidden shadow-soft">
          <img src={bodyscanHero} alt="Body scan meditation in candlelit studio" className="w-full h-48 sm:h-56 object-cover" width={1280} height={576} />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(270,24%,12%)]/95 via-[hsl(280,20%,18%)]/55 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-white/75" />
              <span className="text-xs font-body font-semibold text-white/70 uppercase tracking-wider">Guided Audio Experience</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">Body Scan Meditation</h1>
            <p className="text-sm font-body text-white/70 mt-1">A fully narrated journey through 9 body zones with detailed guidance and premium calming visuals.</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-[10px] font-body px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80">🎙️ Voice Guided</span>
              <span className="text-[10px] font-body px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80">🫁 Breathing Sync</span>
              <span className="text-[10px] font-body px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80">⏱️ {Math.round(totalDuration / 60)} min total</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border p-4 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-body font-semibold text-foreground">
              {completedZones.length}/{bodyScanZones.length} zones complete
            </span>
            <span className="text-xs font-body text-muted-foreground">{Math.round(scanProgress)}%</span>
          </div>
          <Progress value={scanProgress} className="h-2" />
        </div>

        <div className="flex gap-3">
          <Button onClick={startFullScan} className="flex-1 btn-gold shadow-gold" disabled={tts.isLoading}>
            {tts.isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            Full Body Scan
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {tts.error && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm font-body text-destructive">
            ⚠️ {tts.error}
          </div>
        )}

        {(tts.isPlaying || tts.isLoading) && (
          <div className="rounded-xl bg-card border border-primary/20 p-3 flex items-center gap-3 shadow-soft">
            {tts.isLoading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Volume2 className="w-4 h-4 text-primary animate-pulse" />}
            <div className="flex-1">
              <p className="text-xs font-body font-semibold text-foreground">
                {tts.isLoading ? "Generating narration..." : "Playing guided narration"}
              </p>
              {tts.duration > 0 && (
                <p className="text-[10px] font-body text-muted-foreground">
                  {tts.formatTime(tts.currentTime)} / {tts.formatTime(tts.duration)}
                </p>
              )}
            </div>
            {tts.isPlaying && (
              <Button size="sm" variant="ghost" onClick={() => tts.togglePlayPause()} className="h-7 px-2">
                <Pause className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}

        {currentZone && (
          <ActiveZonePanel
            zone={currentZone}
            isScanning={isScanning}
            zoneTimer={zoneTimer}
            isAudioLoading={tts.isLoading}
            isAudioPlaying={tts.isPlaying}
            onToggle={() => toggleZone(currentZone.id)}
            onPlayAudio={handleNarrate}
          />
        )}

        <div className="grid grid-cols-1 gap-3">
          {bodyScanZones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              isActive={activeZone === zone.id}
              isDone={completedZones.includes(zone.id)}
              onClick={() => toggleZone(zone.id)}
            />
          ))}
        </div>

        {allDone && (
          <div className="rounded-2xl bg-card border border-primary/20 p-6 text-center shadow-soft">
            <div className="text-4xl mb-2">🧘✨</div>
            <h3 className="font-display text-xl font-bold text-foreground mb-1">Full Body Scan Complete</h3>
            <p className="text-sm font-body text-muted-foreground">You've released tension from every zone. Your body thanks you.</p>
            <Button onClick={() => tts.generateAndPlay(bodyScanOutroScript)} variant="outline" className="mt-3" disabled={tts.isLoading}>
              <Volume2 className="w-4 h-4 mr-2" /> Play Closing Narration
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

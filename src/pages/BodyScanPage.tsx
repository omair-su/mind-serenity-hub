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
import AmbientMusicPlayer from "@/components/AmbientMusicPlayer";
import { pickTrackByMood } from "@/lib/realAmbientTracks";
import PremiumGate from "@/components/PremiumGate";
import { ScanEye } from "lucide-react";

function BodyScanPageInner() {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [zoneTimer, setZoneTimer] = useState(0);
  const [completedZones, setCompletedZones] = useState<string[]>([]);
  const [autoMode, setAutoMode] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tts = useTextToSpeech();
  const ambient = useAmbientBed("silence", 30);

  const playZone = (id: string) => {
    const z = bodyScanZones.find((zz) => zz.id === id);
    if (!z) return;
    tts.generateAndPlay(z.guidanceScript, {
      trackKey: `body-scan-${id}`,
      category: "body_scan",
      title: z.label,
      description: z.description,
      voice: "sarah",
      isPremium: false,
    });
  };

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
              setTimeout(() => playZone(nextZone.id), 500);
              return 0;
            } else {
              setIsScanning(false);
              tts.stop();
              setTimeout(() => tts.generateAndPlay(bodyScanOutroScript, {
                trackKey: "body-scan-outro",
                category: "body_scan",
                title: "Closing Reflection",
                voice: "sarah",
              }), 500);
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
    tts.generateAndPlay(bodyScanIntroScript + " " + bodyScanZones[0].guidanceScript, {
      trackKey: `body-scan-full-intro-${bodyScanZones[0].id}`,
      category: "body_scan",
      title: "Full Body Scan",
      description: "Guided journey from crown to toes",
      voice: "sarah",
      isPremium: false,
    });
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
      playZone(id);
    }
  };

  const handleNarrate = () => {
    if (!currentZone) return;
    if (tts.isPlaying || tts.hasAudio) {
      tts.togglePlayPause();
    } else {
      playZone(currentZone.id);
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

        {/* Real ambient nature music underneath the body scan */}
        <AmbientMusicPlayer defaultTrack={pickTrackByMood("nature")} />

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

        {/* Premium narration bar fades in here once playback starts (rendered at end of file) */}

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
            <Button
              onClick={() => tts.generateAndPlay(bodyScanOutroScript, {
                trackKey: "body-scan-outro",
                category: "body_scan",
                title: "Closing Reflection",
                voice: "sarah",
              })}
              variant="outline"
              className="mt-3"
              disabled={tts.isLoading}
            >
              <Sparkles className="w-4 h-4 mr-2" /> Play Closing Narration
            </Button>
          </div>
        )}
      </div>

      {(tts.isPlaying || tts.isLoading || tts.hasAudio) && (
        <NarrationBar
          title={currentZone?.label ?? "Body Scan"}
          subtitle={currentZone ? `Zone ${bodyScanZones.findIndex(z => z.id === currentZone.id) + 1} of ${bodyScanZones.length}` : "Guided audio"}
          isLoading={tts.isLoading}
          isPlaying={tts.isPlaying}
          currentTime={tts.currentTime}
          duration={tts.duration}
          formatTime={tts.formatTime}
          onTogglePlay={tts.togglePlayPause}
          onClose={() => tts.stop()}
          bed={ambient.bed}
          bedVolume={ambient.volume}
          onBedChange={ambient.setBed}
          onBedVolumeChange={ambient.setVolume}
        />
      )}
    </AppLayout>
  );
}

export default function BodyScanPage() {
  return (
    <PremiumGate
      feature="Body Scan Meditation"
      description="A clinically-guided 8-zone somatic journey — release tension from crown to feet with neuroscience-backed scripts and premium ambient layering."
      icon={ScanEye}
      gradient="from-violet-500/30 to-purple-500/20"
      previewItems={[
        "Head & Crown — 4 min",
        "Shoulders & Neck — 5 min",
        "Chest & Heart — 6 min",
        "Belly & Core — 4 min",
        "Hands & Arms — 4 min",
        "Feet & Grounding — 5 min",
      ]}
    >
      <BodyScanPageInner />
    </PremiumGate>
  );
}

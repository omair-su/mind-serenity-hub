import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Sparkles, Volume2, Loader2 } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { bodyScanZones, bodyScanIntroScript, bodyScanOutroScript } from "@/data/bodyScanScripts";
import ActiveZonePanel from "@/components/bodyscan/ActiveZonePanel";
import ZoneCard from "@/components/bodyscan/ZoneCard";

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
  const completedDuration = bodyScanZones
    .filter((z) => completedZones.includes(z.id))
    .reduce((sum, z) => sum + z.duration, 0);

  // Timer logic
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

  // Progress
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
    // Play intro, then zone narration
    tts.generateAndPlay(
      bodyScanIntroScript + " " + bodyScanZones[0].guidanceScript
    );
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
    if (tts.isPlaying) {
      tts.togglePlayPause();
    } else if (tts.hasAudio) {
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
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute bottom-4 left-8 w-24 h-24 rounded-full bg-pink-300/30 blur-xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                Guided Audio Experience
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Body Scan Meditation</h1>
            <p className="text-sm text-white/80">
              A fully narrated journey through 9 body zones with breathing guidance, tips, and professional voice narration.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-[10px] px-2 py-1 rounded-full bg-white/15 backdrop-blur-sm">🎙️ Voice Guided</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-white/15 backdrop-blur-sm">🫁 Breathing Sync</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-white/15 backdrop-blur-sm">⏱️ {Math.round(totalDuration / 60)} min total</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-200/30 dark:border-violet-800/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">
              {completedZones.length}/{bodyScanZones.length} zones complete
            </span>
            <span className="text-xs text-muted-foreground">{Math.round(scanProgress)}%</span>
          </div>
          <Progress value={scanProgress} className="h-2" />
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button
            onClick={startFullScan}
            className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg"
            disabled={tts.isLoading}
          >
            {tts.isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Full Body Scan
          </Button>
          <Button onClick={reset} variant="outline" className="border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* TTS Error */}
        {tts.error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
            ⚠️ {tts.error}
          </div>
        )}

        {/* Audio Status */}
        {(tts.isPlaying || tts.isLoading) && (
          <div className="rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-200/20 dark:border-violet-700/20 p-3 flex items-center gap-3">
            {tts.isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
            ) : (
              <Volume2 className="w-4 h-4 text-violet-600 animate-pulse" />
            )}
            <div className="flex-1">
              <p className="text-xs font-semibold text-foreground">
                {tts.isLoading ? "Generating narration..." : "Playing guided narration"}
              </p>
              {tts.duration > 0 && (
                <p className="text-[10px] text-muted-foreground">
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

        {/* Active Zone Detail */}
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

        {/* Zone Grid */}
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

        {/* Completion */}
        {allDone && (
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-6 text-white text-center">
            <div className="text-4xl mb-2">🧘✨</div>
            <h3 className="text-xl font-bold mb-1">Full Body Scan Complete</h3>
            <p className="text-sm text-white/80">
              You've released tension from every zone. Your body thanks you.
            </p>
            <Button
              onClick={() => tts.generateAndPlay(bodyScanOutroScript)}
              variant="ghost"
              className="mt-3 text-white hover:bg-white/20"
              disabled={tts.isLoading}
            >
              <Volume2 className="w-4 h-4 mr-2" /> Play Closing Narration
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

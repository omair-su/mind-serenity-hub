import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Footprints, Play, RotateCcw, Heart, MapPin, Clock, Flame, Square, Crown, ChevronRight, Cloud, ChevronLeft,
} from "lucide-react";
import { walkingEnvironments, walkingTechniques, type WalkingTechnique } from "@/data/walkingTechniques";
import PaceOrb from "@/components/walking/PaceOrb";
import FootstepVisualizer from "@/components/walking/FootstepVisualizer";
import WalkEnvironmentCard from "@/components/walking/WalkEnvironmentCard";
import WalkReflection from "@/components/walking/WalkReflection";
import NarrationBar from "@/components/NarrationBar";
import PremiumLockModal from "@/components/PremiumLockModal";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useAmbientBed } from "@/hooks/useAmbientBed";
import { usePedometer } from "@/hooks/usePedometer";
import { useWeather } from "@/hooks/useWeather";
import { logRitualCompletion } from "@/lib/cloudSync";

export default function WalkingMeditationPage() {
  const [selectedEnv, setSelectedEnv] = useState(walkingEnvironments[0]);
  const [selectedTech, setSelectedTech] = useState<WalkingTechnique | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { weather } = useWeather();
  const tts = useTextToSpeech();
  const ambient = useAmbientBed("silence", 35);
  const pedometer = usePedometer({ active: isActive });

  const [sessions, setSessions] = useState<number>(() => {
    try { return JSON.parse(localStorage.getItem("wv-walking-sessions") || "0"); } catch { return 0; }
  });
  const [totalSteps, setTotalSteps] = useState<number>(() => {
    try { return JSON.parse(localStorage.getItem("wv-walking-total-steps") || "0"); } catch { return 0; }
  });
  const [totalMinutes, setTotalMinutes] = useState<number>(() => {
    try { return JSON.parse(localStorage.getItem("wv-walking-total-min") || "0"); } catch { return 0; }
  });

  // Parallax scroll
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Session timer
  useEffect(() => {
    if (!isActive || !selectedTech) return;
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= selectedTech.duration * 60) {
          finishSession();
        }
        return next;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, selectedTech]);

  // Auto-narrate current step. When narration ends, advance to next step.
  useEffect(() => {
    if (!isActive || !selectedTech) return;
    const text = selectedTech.steps[currentStepIdx];
    tts.generateAndPlay(text, {
      trackKey: `walking-${selectedTech.id}-step${currentStepIdx}`,
      category: "walking",
      title: `${selectedTech.title} · Step ${currentStepIdx + 1}`,
      voice: selectedTech.voice,
      ambientBed: null,
      isPremium: selectedTech.isPremium,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIdx, isActive, selectedTech]);

  // When narration finishes & still active, advance to next step
  useEffect(() => {
    if (!isActive || !selectedTech) return;
    if (!tts.isPlaying && tts.progress >= 99 && currentStepIdx < selectedTech.steps.length - 1) {
      const t = setTimeout(() => setCurrentStepIdx((i) => i + 1), 1500);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tts.isPlaying, tts.progress, isActive, selectedTech, currentStepIdx]);

  // Hard-stop everything on unmount
  useEffect(() => {
    return () => {
      tts.stop();
      ambient.stopBed();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishSession = () => {
    setIsActive(false);
    setCompleted(true);
    tts.stop();
    ambient.stopBed();
    if (intervalRef.current) clearInterval(intervalRef.current);

    const newSessions = sessions + 1;
    const newSteps = totalSteps + pedometer.steps;
    const newMin = totalMinutes + (selectedTech?.duration ?? 0);
    setSessions(newSessions);
    setTotalSteps(newSteps);
    setTotalMinutes(newMin);
    localStorage.setItem("wv-walking-sessions", JSON.stringify(newSessions));
    localStorage.setItem("wv-walking-total-steps", JSON.stringify(newSteps));
    localStorage.setItem("wv-walking-total-min", JSON.stringify(newMin));

    if (selectedTech) {
      logRitualCompletion(`walk-${selectedTech.id}`, selectedEnv.label).catch(() => {});
    }
  };

  const startSession = (tech: WalkingTechnique) => {
    if (tech.isPremium) {
      setShowPremium(true);
      return;
    }
    setSelectedTech(tech);
    setElapsed(0);
    setCurrentStepIdx(0);
    setCompleted(false);
    pedometer.reset();
    // Request motion permission (iOS) on user gesture
    if (pedometer.permissionState === "prompt") {
      pedometer.requestPermission();
    }
    setIsActive(true);
  };

  const stopSession = () => {
    setIsActive(false);
    tts.stop();
    ambient.stopBed();
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    stopSession();
    setElapsed(0);
    setCurrentStepIdx(0);
    setCompleted(false);
    pedometer.reset();
    setSelectedTech(null);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const progressPct = selectedTech ? (elapsed / (selectedTech.duration * 60)) * 100 : 0;
  const distanceKm = useMemo(() => (pedometer.steps * 0.0007).toFixed(2), [pedometer.steps]);

  // Streak ring
  const ringProgress = Math.min(sessions / 10, 1) * 100;
  const ringCircumference = 2 * Math.PI * 36;
  const ringOffset = ringCircumference - (ringProgress / 100) * ringCircumference;

  return (
    <AppLayout>
      <div className="space-y-6 pb-4">
        {/* Hero with parallax + mood-aware tint */}
        <div className="relative rounded-2xl overflow-hidden h-[260px]">
          <motion.img
            src={selectedEnv.imageUrl}
            alt={selectedEnv.label}
            className="absolute inset-0 w-full h-[120%] object-cover"
            style={{ y: scrollY * 0.3 }}
            key={selectedEnv.id}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${selectedEnv.tint}`} />
          {/* Floating gold orbs */}
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-8 right-12 w-20 h-20 rounded-full bg-[hsl(var(--gold))]/30 blur-2xl"
          />
          <motion.div
            animate={{ y: [0, 15, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-20 left-8 w-16 h-16 rounded-full bg-white/20 blur-xl"
          />

          {/* Weather widget */}
          {weather && (
            <div className="absolute top-3 right-3 px-2.5 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
              <span className="text-sm">{weather.emoji}</span>
              <span className="text-[10px] font-body font-semibold text-white tabular-nums">{weather.tempC}°C</span>
              <span className="text-[9px] font-body text-white/70 hidden sm:inline">{weather.description}</span>
            </div>
          )}

          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-white/15 backdrop-blur-sm">
                <Footprints className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-body font-semibold uppercase tracking-wider text-white/70">Mindful Movement</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-1">Walking Meditation</h1>
            <p className="text-sm font-body text-white/80">
              {weather?.isGoodForWalking
                ? `Perfect for an outdoor walk · ${weather.tempC}°C · ${weather.description.toLowerCase()}`
                : weather && !weather.isGoodForWalking
                ? `Indoor mode recommended · ${weather.description.toLowerCase()}`
                : "Transform every step into a meditation"}
            </p>
          </div>
        </div>

        {/* Stats with streak ring */}
        <div className="grid grid-cols-4 gap-2.5">
          <div className="rounded-xl bg-card border border-border p-3 text-center shadow-soft relative">
            <svg className="w-12 h-12 mx-auto -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" stroke="hsl(var(--border))" strokeWidth="4" fill="none" />
              <circle
                cx="40" cy="40" r="36"
                stroke="hsl(var(--gold))" strokeWidth="4" fill="none" strokeLinecap="round"
                strokeDasharray={ringCircumference} strokeDashoffset={ringOffset}
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-base font-display font-bold text-foreground leading-none">{sessions}</div>
              <div className="text-[7px] font-body uppercase tracking-wider text-muted-foreground mt-0.5">Walks</div>
            </div>
          </div>
          {[
            { label: "Steps", value: totalSteps.toLocaleString(), icon: Footprints },
            { label: "Minutes", value: totalMinutes, icon: Clock },
            { label: "Today", value: pedometer.steps, icon: MapPin },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-card border border-border p-3 text-center shadow-soft flex flex-col items-center justify-center">
              <s.icon className="w-3.5 h-3.5 mb-1 text-primary/70" />
              <div className="text-base font-display font-bold text-foreground tabular-nums">{s.value}</div>
              <div className="text-[8px] font-body uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {!isActive && !completed && (
          <>
            {/* Environments */}
            <div>
              <h3 className="font-display font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary/70" /> Choose Your Path
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {walkingEnvironments.map((env) => (
                  <WalkEnvironmentCard
                    key={env.id}
                    env={env}
                    active={selectedEnv.id === env.id}
                    onSelect={() => setSelectedEnv(env)}
                  />
                ))}
              </div>
              {/* Sound toggle for chosen env */}
              <div className="mt-3 flex items-center justify-between rounded-xl bg-card border border-border p-3">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs font-body text-muted-foreground">
                    Ambient · <span className="text-foreground font-semibold capitalize">{selectedEnv.ambientBed}</span>
                  </p>
                </div>
                {ambient.bed === "silence" ? (
                  <Button size="sm" variant="outline" onClick={() => ambient.setBed(selectedEnv.ambientBed)}>
                    <Play className="w-3.5 h-3.5 mr-1" /> Preview
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => ambient.stopBed()}>
                    <Square className="w-3.5 h-3.5 mr-1" /> Stop
                  </Button>
                )}
              </div>
            </div>

            {/* Techniques */}
            <div>
              <h3 className="font-display font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary/60" /> Walking Techniques
              </h3>
              <div className="space-y-3">
                {walkingTechniques.map((tech) => (
                  <button
                    key={tech.id}
                    onClick={() => startSession(tech)}
                    className="w-full rounded-xl bg-card border border-border p-4 text-left transition-all hover:shadow-soft hover:border-primary/30 group"
                  >
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <h4 className="font-display font-bold text-sm text-foreground truncate">{tech.title}</h4>
                        {tech.isPremium && (
                          <span className="flex items-center gap-0.5 text-[9px] font-body font-bold text-gold bg-gold/10 px-1.5 py-0.5 rounded-full border border-gold/30 flex-shrink-0">
                            <Crown className="w-2.5 h-2.5" /> PLUS
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-body bg-secondary px-2 py-0.5 rounded-full text-muted-foreground flex-shrink-0">
                        {tech.duration} min
                      </span>
                    </div>
                    <p className="text-xs font-body text-muted-foreground leading-relaxed">{tech.fullDescription}</p>
                    <div className="flex items-center justify-end mt-2 text-[10px] font-body text-primary/70 group-hover:text-primary">
                      Begin <ChevronRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Active Session */}
        {selectedTech && isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-card border border-primary/20 p-5 relative overflow-hidden shadow-soft"
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <button onClick={reset} className="flex items-center gap-1 text-xs font-body text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="w-3.5 h-3.5" /> Back
                </button>
                <p className="text-[10px] font-body uppercase tracking-widest text-muted-foreground">
                  Step {currentStepIdx + 1} / {selectedTech.steps.length}
                </p>
              </div>

              <PaceOrb cadence={pedometer.cadence} active={isActive} />
              <FootstepVisualizer steps={pedometer.steps} />

              <div className="text-center px-2">
                <p className="text-[10px] font-body uppercase tracking-widest text-muted-foreground mb-2">Current Guidance</p>
                <p className="text-sm font-body font-medium text-foreground leading-relaxed min-h-[3rem]">
                  {selectedTech.steps[currentStepIdx]}
                </p>
              </div>

              <div className="text-center">
                <span className="text-3xl font-display font-bold text-foreground tabular-nums">{formatTime(elapsed)}</span>
                <span className="text-sm font-body text-muted-foreground ml-2">/ {selectedTech.duration}:00</span>
              </div>
              <Progress value={progressPct} className="h-2" />

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-body">
                <div className="bg-secondary/40 rounded-lg py-1.5">
                  <Footprints className="w-3 h-3 mx-auto text-muted-foreground mb-0.5" />
                  <span className="text-foreground font-semibold tabular-nums">{pedometer.steps}</span>
                  <p className="text-[8px] uppercase tracking-wider text-muted-foreground">Steps</p>
                </div>
                <div className="bg-secondary/40 rounded-lg py-1.5">
                  <MapPin className="w-3 h-3 mx-auto text-muted-foreground mb-0.5" />
                  <span className="text-foreground font-semibold tabular-nums">{distanceKm}</span>
                  <p className="text-[8px] uppercase tracking-wider text-muted-foreground">km</p>
                </div>
                <div className="bg-secondary/40 rounded-lg py-1.5">
                  <Flame className="w-3 h-3 mx-auto text-muted-foreground mb-0.5" />
                  <span className="text-foreground font-semibold tabular-nums">{Math.round(pedometer.steps * 0.04)}</span>
                  <p className="text-[8px] uppercase tracking-wider text-muted-foreground">Cal</p>
                </div>
              </div>

              {!pedometer.isReal && (
                <p className="text-[10px] text-center font-body text-muted-foreground/70 italic">
                  Using estimated cadence · open on mobile for real step tracking
                </p>
              )}

              <div className="flex items-center justify-center gap-3">
                <Button size="sm" variant="outline" onClick={stopSession}>
                  <Square className="w-4 h-4 mr-1" /> Stop
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setElapsed(0); setCurrentStepIdx(0); pedometer.reset(); }}>
                  <RotateCcw className="w-4 h-4 mr-1" /> Restart
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Completion */}
        {completed && selectedTech && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-card to-gold/10 border border-gold/20 p-6 text-center shadow-soft">
              <div className="text-4xl mb-2">🚶‍♀️✨</div>
              <h3 className="font-display text-xl font-bold text-foreground mb-1">Walk Complete</h3>
              <p className="text-sm font-body text-muted-foreground">
                {pedometer.steps} mindful steps · {selectedTech.duration} minutes of presence
              </p>
              <p className="text-xs font-body text-primary/80 mt-2">≈ {distanceKm} km in the {selectedEnv.label.toLowerCase()}</p>
            </div>

            <WalkReflection
              techniqueTitle={selectedTech.title}
              steps={pedometer.steps}
              durationMin={selectedTech.duration}
            />

            <Button onClick={reset} className="w-full h-12 btn-gold font-display font-bold">
              Begin Another Walk
            </Button>
          </motion.div>
        )}

        {/* Begin button when technique selected but not yet active (legacy fallback — usually we go straight to active) */}
      </div>

      {/* Narration bar — shown only when narration is in flight or playing */}
      {isActive && selectedTech && (tts.isPlaying || tts.isLoading || tts.hasAudio) && (
        <NarrationBar
          title={selectedTech.title}
          subtitle={`Step ${currentStepIdx + 1} of ${selectedTech.steps.length}`}
          isLoading={tts.isLoading}
          isPlaying={tts.isPlaying}
          currentTime={tts.currentTime}
          duration={tts.duration}
          formatTime={tts.formatTime}
          onTogglePlay={tts.togglePlayPause}
          onClose={() => { tts.stop(); }}
          bed={ambient.bed}
          bedVolume={ambient.volume}
          onBedChange={ambient.setBed}
          onBedVolumeChange={ambient.setVolume}
        />
      )}

      <PremiumLockModal
        open={showPremium}
        onClose={() => setShowPremium(false)}
        feature="Forest Bathing (Shinrin-yoku)"
        description="Unlock the 20-minute Japanese forest immersion protocol — clinically proven to lower cortisol and boost immune function."
      />
    </AppLayout>
  );
}

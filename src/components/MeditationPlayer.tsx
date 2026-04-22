import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward, X, Volume2, VolumeX,
  ChevronDown, Sparkles, Check, RotateCcw, Loader2, Music
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { saveTimerSession } from "@/lib/userStore";
import {
  playNatureSound,
  stopNatureSound,
  setNatureVolume,
  NATURE_SOUNDS,
  type NatureSoundId,
} from "@/lib/natureSounds";
import {
  REAL_AMBIENT_TRACKS,
  pickTrackByMood,
  type AmbientTrack,
} from "@/lib/realAmbientTracks";

interface MeditationPlayerProps {
  title: string;
  subtitle?: string;
  duration: number; // in seconds
  onClose: () => void;
  onComplete?: () => void;
  backgroundImage?: string;
  accentColor?: string;
  /** Optional: which ambient music track to load by default */
  defaultTrack?: AmbientTrack;
}

const SILENCE: { id: "silence"; label: string; emoji: string } = {
  id: "silence",
  label: "Silence",
  emoji: "🔇",
};

const NATURE_OPTIONS: Array<{
  id: NatureSoundId | "silence";
  label: string;
  emoji: string;
}> = [
  SILENCE,
  ...NATURE_SOUNDS.slice(0, 8).map((s) => ({
    id: s.id as NatureSoundId,
    label: s.name,
    emoji: s.emoji,
  })),
];

const NATURE_HANDLE = "meditation-player";

export default function MeditationPlayer({
  title,
  subtitle,
  duration,
  onClose,
  onComplete,
  backgroundImage,
  accentColor = "hsl(var(--gold))",
  defaultTrack,
}: MeditationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showAmbient, setShowAmbient] = useState(false);
  const [ambientSound, setAmbientSound] = useState<NatureSoundId | "silence">("silence");
  const [ambientVolume, setAmbientVolume] = useState(50);
  const [musicVolume, setMusicVolume] = useState(60);
  const [musicTrack, setMusicTrack] = useState<AmbientTrack>(
    defaultTrack ?? pickTrackByMood("calm"),
  );
  const [showControls, setShowControls] = useState(true);
  const [showMusicPicker, setShowMusicPicker] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);

  // ── Music audio element (premium ambient track) ─────────────────────────
  useEffect(() => {
    const a = new Audio();
    a.loop = true;
    a.preload = "auto";
    a.crossOrigin = "anonymous";
    a.volume = musicVolume / 100;
    musicAudioRef.current = a;
    return () => {
      a.pause();
      a.removeAttribute("src");
      a.load();
      musicAudioRef.current = null;
      stopNatureSound(NATURE_HANDLE);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap music track
  useEffect(() => {
    const a = musicAudioRef.current;
    if (!a) return;
    const wasPlaying = isPlaying;
    a.src = musicTrack.url;
    a.load();
    if (wasPlaying) {
      void a.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicTrack]);

  useEffect(() => {
    if (musicAudioRef.current) musicAudioRef.current.volume = musicVolume / 100;
  }, [musicVolume]);

  // ── Tick timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= duration) {
          setIsPlaying(false);
          setCompleted(true);
          stopNatureSound(NATURE_HANDLE);
          musicAudioRef.current?.pause();
          saveTimerSession({
            date: new Date().toISOString(),
            duration: Math.round(duration / 60),
            type: "guided",
          });
          onComplete?.();
          return duration;
        }
        return prev + 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, duration, onComplete]);

  // ── Play / Pause: drives both music & nature bed ───────────────────────
  const toggle = useCallback(async () => {
    if (completed) return;
    const next = !isPlaying;

    if (next) {
      setAudioLoading(true);
      // Start music
      const a = musicAudioRef.current;
      if (a) {
        if (!a.src) {
          a.src = musicTrack.url;
          a.load();
        }
        try {
          await a.play();
        } catch {
          /* user gesture blocked; ignore — timer still runs */
        }
      }
      // Start nature bed
      if (ambientSound !== "silence") {
        await playNatureSound(ambientSound, ambientVolume / 100, NATURE_HANDLE);
      }
      setAudioLoading(false);
      setIsPlaying(true);
    } else {
      musicAudioRef.current?.pause();
      stopNatureSound(NATURE_HANDLE);
      setIsPlaying(false);
    }
  }, [completed, isPlaying, ambientSound, ambientVolume, musicTrack]);

  // Re-route nature bed when user changes ambient pick mid-session
  useEffect(() => {
    if (!isPlaying) {
      stopNatureSound(NATURE_HANDLE);
      return;
    }
    if (ambientSound === "silence") {
      stopNatureSound(NATURE_HANDLE);
    } else {
      void playNatureSound(ambientSound, ambientVolume / 100, NATURE_HANDLE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambientSound]);

  useEffect(() => {
    setNatureVolume(ambientVolume / 100, NATURE_HANDLE);
  }, [ambientVolume]);

  const skip = (secs: number) =>
    setElapsed((prev) => Math.max(0, Math.min(duration, prev + secs)));
  const restart = () => {
    setElapsed(0);
    setCompleted(false);
    setIsPlaying(false);
    musicAudioRef.current?.pause();
    if (musicAudioRef.current) musicAudioRef.current.currentTime = 0;
    stopNatureSound(NATURE_HANDLE);
  };
  const handleClose = () => {
    musicAudioRef.current?.pause();
    stopNatureSound(NATURE_HANDLE);
    onClose();
  };

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // Auto-hide controls after 4s of playing
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      return;
    }
    const t = setTimeout(() => setShowControls(false), 4000);
    return () => clearTimeout(t);
  }, [isPlaying, showControls]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[hsl(var(--charcoal))]"
      onClick={() => isPlaying && setShowControls((c) => !c)}
    >
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--charcoal))] via-[hsl(var(--charcoal))]/70 to-transparent" />

      {/* Breathing orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={
            isPlaying
              ? { scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }
              : { scale: 1, opacity: 0.2 }
          }
          transition={
            isPlaying ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : {}
          }
          className="w-64 h-64 rounded-full"
          style={{ background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)` }}
        />
      </div>

      {/* Top bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 p-4 safe-area-top flex items-center justify-between z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full backdrop-blur-md bg-white/10 flex items-center justify-center"
              aria-label="Close session"
            >
              <ChevronDown className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowMusicPicker((s) => !s);
                  setShowAmbient(false);
                }}
                className="w-10 h-10 rounded-full backdrop-blur-md bg-white/10 flex items-center justify-center"
                aria-label="Choose music"
              >
                <Music className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => {
                  setShowAmbient((s) => !s);
                  setShowMusicPicker(false);
                }}
                className="w-10 h-10 rounded-full backdrop-blur-md bg-white/10 flex items-center justify-center"
                aria-label="Background sounds"
              >
                <Volume2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music picker panel */}
      <AnimatePresence>
        {showMusicPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 right-4 w-72 max-h-[60vh] overflow-y-auto backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/10 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white/70 text-xs font-body font-semibold uppercase tracking-wider mb-3">
              Ambient Music
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {REAL_AMBIENT_TRACKS.slice(0, 12).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setMusicTrack(t)}
                  className={`flex flex-col items-start gap-1 p-2 rounded-xl text-left transition-all ${
                    musicTrack.id === t.id
                      ? "bg-white/20 ring-1 ring-white/30"
                      : "hover:bg-white/10"
                  }`}
                >
                  <span className="text-base">{t.emoji}</span>
                  <span className="text-[11px] text-white/90 font-body font-semibold leading-tight truncate w-full">
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <VolumeX className="w-3.5 h-3.5 text-white/50" />
              <Slider
                value={[musicVolume]}
                onValueChange={(v) => setMusicVolume(v[0])}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <Volume2 className="w-3.5 h-3.5 text-white/50" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient (nature) sound panel */}
      <AnimatePresence>
        {showAmbient && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 right-4 w-72 backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/10 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white/70 text-xs font-body font-semibold uppercase tracking-wider mb-3">
              Background Sound
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {NATURE_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setAmbientSound(s.id as NatureSoundId | "silence")}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    ambientSound === s.id
                      ? "bg-white/20 ring-1 ring-white/30"
                      : "hover:bg-white/10"
                  }`}
                >
                  <span className="text-lg">{s.emoji}</span>
                  <span className="text-[10px] text-white/70 font-body">{s.label}</span>
                </button>
              ))}
            </div>
            {ambientSound !== "silence" && (
              <div className="flex items-center gap-2">
                <VolumeX className="w-3.5 h-3.5 text-white/50" />
                <Slider
                  value={[ambientVolume]}
                  onValueChange={(v) => setAmbientVolume(v[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <Volume2 className="w-3.5 h-3.5 text-white/50" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <AnimatePresence>
          {showControls && !completed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-center mb-8"
            >
              <h2 className="font-display text-2xl font-bold text-white mb-1">{title}</h2>
              {subtitle && <p className="text-white/50 text-sm font-body">{subtitle}</p>}
              <p className="text-white/40 text-[11px] font-body mt-2">
                🎵 {musicTrack.name} · {musicTrack.credit}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion celebration */}
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center pointer-events-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_hsl(var(--gold)/0.4)]"
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-display text-3xl font-bold text-white mb-2"
              >
                Session Complete
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-white/50 font-body mb-2"
              >
                {fmt(duration)} of mindful practice
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-center gap-1 text-[hsl(var(--gold))]"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-body font-semibold">Beautiful work</span>
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex gap-3 mt-8"
              >
                <button
                  onClick={restart}
                  className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-body font-semibold text-sm flex items-center gap-2 hover:bg-white/20 transition-all"
                >
                  <RotateCcw className="w-4 h-4" /> Repeat
                </button>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-body font-bold text-sm hover:brightness-110 transition-all"
                >
                  Done
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <AnimatePresence>
        {showControls && !completed && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute bottom-0 left-0 right-0 p-6 safe-area-bottom z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <Slider
                value={[elapsed]}
                onValueChange={(v) => setElapsed(v[0])}
                min={0}
                max={duration}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-white/40 font-body">
                <span>{fmt(elapsed)}</span>
                <span>-{fmt(duration - elapsed)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8">
              <button
                onClick={() => skip(-15)}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
                aria-label="Back 15 seconds"
              >
                <SkipBack className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={toggle}
                disabled={audioLoading}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_hsl(var(--gold)/0.3)] transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, hsl(var(--gold-dark)))`,
                }}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {audioLoading ? (
                  <Loader2 className="w-7 h-7 text-[hsl(var(--charcoal))] animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-7 h-7 text-[hsl(var(--charcoal))]" />
                ) : (
                  <Play className="w-7 h-7 text-[hsl(var(--charcoal))] ml-1" />
                )}
              </button>
              <button
                onClick={() => skip(15)}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
                aria-label="Forward 15 seconds"
              >
                <SkipForward className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

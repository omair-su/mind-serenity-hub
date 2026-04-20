// Full-screen, distraction-free Practice Mode with auto-advancing narration paragraphs,
// floating breathing orb, vignette, and a single Stop control.
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play, SkipForward, Loader2 } from "lucide-react";
import { getDayHero, moodGradient } from "@/data/dayHeroImages";
import HeartCoherenceRing from "./HeartCoherenceRing";

interface PracticeModeProps {
  open: boolean;
  dayNumber: number;
  title: string;
  paragraphs: string[];
  /** TTS hook — passed in so we share one audio instance */
  tts: {
    isLoading: boolean;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    progress: number;
    formatTime: (s: number) => string;
    generateAndPlay: (text: string, opts?: any) => Promise<void>;
    togglePlayPause: () => void;
    stop: () => void;
    hasAudio: boolean;
  };
  /** Voice key for ElevenLabs */
  voice?: "sarah" | "george" | "matilda" | "charlie";
  isPremium?: boolean;
  onClose: () => void;
}

const PAUSE_RE = /^\s*\[Pause.*?(\d+)\s*seconds?.*?\]\s*$/i;
const SILENT_RE = /^\s*\[(\d+)\s*minutes?.*?\]\s*$/i;

function parseDuration(line: string): number | null {
  const m1 = line.match(PAUSE_RE);
  if (m1) return parseInt(m1[1], 10);
  const m2 = line.match(SILENT_RE);
  if (m2) return parseInt(m2[1], 10) * 60;
  return null;
}

export default function PracticeMode({
  open, dayNumber, title, paragraphs, tts, voice = "sarah", isPremium = false, onClose,
}: PracticeModeProps) {
  const hero = getDayHero(dayNumber);
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [pauseRemaining, setPauseRemaining] = useState(0);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = paragraphs[index] ?? "";
  const isPause = parseDuration(current) !== null;
  const total = paragraphs.length;

  // Reset on open
  useEffect(() => {
    if (open) {
      setIndex(0);
      setAutoPlay(true);
    } else {
      tts.stop();
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Esc to exit
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Drive playback for the current paragraph
  useEffect(() => {
    if (!open || !autoPlay) return;
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);

    const dur = parseDuration(current);
    if (dur !== null) {
      // Silent pause — wait then advance
      tts.stop();
      setPauseRemaining(dur);
      const start = Date.now();
      const tick = setInterval(() => {
        const elapsed = Math.floor((Date.now() - start) / 1000);
        setPauseRemaining(Math.max(0, dur - elapsed));
      }, 500);
      advanceTimerRef.current = setTimeout(() => {
        clearInterval(tick);
        if (index < total - 1) setIndex((i) => i + 1);
      }, dur * 1000);
      return () => { clearInterval(tick); if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current); };
    }

    // Narration paragraph — play via TTS, then advance when audio ends
    const play = async () => {
      await tts.generateAndPlay(current, {
        trackKey: `day-${dayNumber}-p${index}-${voice}`,
        category: "daily_meditation",
        title: `Day ${dayNumber} · ${title} · ${index + 1}/${total}`,
        voice,
        ambientBed: null,
        isPremium,
      });
    };
    play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, autoPlay, index, current]);

  // Auto-advance when narration finishes
  useEffect(() => {
    if (!open || !autoPlay) return;
    if (isPause) return;
    if (tts.duration > 0 && tts.progress >= 99 && !tts.isPlaying) {
      const t = setTimeout(() => {
        if (index < total - 1) setIndex((i) => i + 1);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [tts.progress, tts.isPlaying, tts.duration, autoPlay, open, isPause, index, total]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[120] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Hero image full-bleed */}
        <motion.img
          src={hero.image}
          alt=""
          initial={{ scale: 1 }}
          animate={{ scale: 1.15 }}
          transition={{ duration: 30, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${moodGradient(hero.moodTint)}`} />
        <div className="absolute inset-0 bg-black/55" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_black_100%)]" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-5 flex items-center justify-between z-10">
          <div className="text-[10px] font-body font-bold uppercase tracking-[0.25em] text-white/70">
            Day {dayNumber} · Step {index + 1}/{total}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 flex items-center justify-center"
            aria-label="Exit practice mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10">
          <HeartCoherenceRing size={260} bpm={6}>
            <motion.div
              animate={{
                scale: tts.isPlaying ? [1, 1.06, 1] : 1,
                opacity: tts.isPlaying ? [0.85, 1, 0.85] : 0.85,
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] shadow-[0_0_60px_hsl(var(--gold)/0.5)]"
            />
          </HeartCoherenceRing>

          <div className="mt-10 max-w-[640px] text-center min-h-[120px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
                className={`font-display text-xl md:text-2xl leading-[1.7] tracking-wide ${
                  isPause ? "text-white/60 italic" : "text-white"
                }`}
              >
                {isPause ? `pausing… ${pauseRemaining}s` : current}
              </motion.p>
            </AnimatePresence>
          </div>

          {tts.isLoading && !isPause && (
            <div className="mt-6 flex items-center gap-2 text-white/60">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="font-body text-xs">Preparing voice…</span>
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          {/* Progress dots */}
          <div className="flex justify-center gap-1 mb-4">
            {paragraphs.map((_, i) => (
              <span
                key={i}
                className={`h-0.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-[hsl(var(--gold))]" : i < index ? "w-3 bg-white/60" : "w-3 bg-white/20"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="w-11 h-11 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 flex items-center justify-center disabled:opacity-40"
              aria-label="Previous"
            >
              <SkipForward className="w-4 h-4 rotate-180" />
            </button>

            <button
              onClick={() => {
                if (isPause) {
                  setAutoPlay((a) => !a);
                } else {
                  setAutoPlay(true);
                  tts.togglePlayPause();
                }
              }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] shadow-[0_0_30px_hsl(var(--gold)/0.5)] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
              aria-label={tts.isPlaying ? "Pause" : "Play"}
            >
              {tts.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> :
                tts.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
              disabled={index === total - 1}
              className="w-11 h-11 rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 flex items-center justify-center disabled:opacity-40"
              aria-label="Next"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => { tts.stop(); onClose(); }}
              className="ml-4 px-4 h-11 rounded-full bg-rose-500/80 hover:bg-rose-500 text-white text-xs font-body font-bold uppercase tracking-wider"
            >
              Stop
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

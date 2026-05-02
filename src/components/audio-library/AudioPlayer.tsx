// Premium full-screen audio player with playlist queue support.
// - Plays a queue of MeditationSession items back-to-back
// - Skip forward/back navigates the queue
// - Close button reliably stops audio and dismisses the player
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, SkipBack, SkipForward, Download, ListMusic } from 'lucide-react';
import type { MeditationSession } from '@/data/audioLibrary';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState, useCallback } from 'react';

interface AudioPlayerProps {
  /** Ordered queue of sessions. When non-empty the player is visible. */
  queue: MeditationSession[];
  /** Index of the currently playing session within the queue. */
  index?: number;
  onIndexChange?: (i: number) => void;
  onClose: () => void;
}

export default function AudioPlayer({ queue, index = 0, onIndexChange, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showQueue, setShowQueue] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const session = queue[index] ?? null;

  // Reset progress + autoplay each time the active track changes
  useEffect(() => {
    if (session) {
      setIsPlaying(true);
      setProgress(0);
    }
  }, [session?.id]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const stopAudio = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      try {
        a.pause();
        a.currentTime = 0;
      } catch {}
    }
  }, []);

  const handleClose = useCallback(() => {
    stopAudio();
    setIsPlaying(false);
    setShowQueue(false);
    onClose();
  }, [onClose, stopAudio]);

  // ESC key closes the player
  useEffect(() => {
    if (!session) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [session, handleClose]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) a.pause();
    else void a.play();
    setIsPlaying(!isPlaying);
  };

  const goPrev = () => {
    if (index > 0) onIndexChange?.(index - 1);
    else if (audioRef.current) audioRef.current.currentTime = 0;
  };
  const goNext = () => {
    if (index < queue.length - 1) onIndexChange?.(index + 1);
    else handleClose();
  };

  if (!session) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="audio-player"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/98 backdrop-blur-xl"
      >
        {/* Top-right controls (above rings) */}
        <div className="absolute top-6 right-6 sm:top-12 sm:right-12 z-20 flex items-center gap-3">
          {queue.length > 1 && (
            <button
              type="button"
              onClick={() => setShowQueue((v) => !v)}
              aria-label="Toggle queue"
              className={cn(
                "w-12 h-12 rounded-full border flex items-center justify-center transition-all",
                showQueue
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:bg-secondary"
              )}
            >
              <ListMusic className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close player"
            className="w-12 h-12 rounded-full border border-border bg-background flex items-center justify-center hover:bg-primary hover:border-primary transition-all group"
          >
            <X className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" />
          </button>
        </div>

        {/* Geometric background rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border border-border rounded-full pointer-events-none opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-border rounded-full pointer-events-none opacity-20"></div>

        <div className="max-w-md w-full flex flex-col items-center relative z-10">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4 block font-bold">
              {queue.length > 1 ? `Track ${index + 1} of ${queue.length}` : 'Resonating'}
            </span>
            <motion.h2 className="font-display text-4xl sm:text-5xl italic text-foreground mb-4 tracking-tight leading-tight">
              {session.title}
            </motion.h2>
            <div className="w-8 h-px bg-primary mx-auto mt-6"></div>
          </div>

          {/* Visualizer */}
          <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
            <motion.div
              animate={{
                scale: isPlaying ? [1, 1.15, 1] : 1,
                opacity: isPlaying ? [0.4, 0.7, 0.4] : 0.4
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 border border-primary rounded-full"
            />
            <div className="w-48 h-48 rounded-full border border-border p-1">
              <img
                src={session.thumbnail}
                alt={session.title}
                className="w-full h-full object-cover rounded-full grayscale opacity-70"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="w-full space-y-8">
            <div className="space-y-3">
              <div className="h-0.5 w-full bg-border relative overflow-hidden">
                <motion.div
                  className="h-full bg-foreground"
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase text-muted-foreground/70">
                <span>Journey</span>
                <span>{session.duration}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-12">
              <button
                onClick={goPrev}
                aria-label="Previous track"
                className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                disabled={queue.length <= 1 && index === 0}
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="w-24 h-24 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xl"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>
              <button
                onClick={goNext}
                aria-label="Next track"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <span className="text-[8px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Temporal Velocity</span>
              <div className="flex gap-4">
                {[0.75, 1, 1.25].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setPlaybackRate(rate)}
                    className={cn(
                      "px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest border transition-all",
                      playbackRate === rate
                        ? "bg-foreground text-background border-foreground"
                        : "text-muted-foreground border-border hover:border-muted-foreground"
                    )}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <a
                href={session.audioUrl}
                download
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download for offline
              </a>
              <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground italic font-display">
                A composition by {session.author}
              </p>
            </div>
          </div>
        </div>

        {/* Queue side panel */}
        <AnimatePresence>
          {showQueue && queue.length > 1 && (
            <motion.aside
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 32 }}
              className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-card border-l border-border z-30 overflow-y-auto p-6 pt-24"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold mb-4">
                Up Next · {queue.length} tracks
              </p>
              <ul className="space-y-2">
                {queue.map((s, i) => (
                  <li key={`${s.id}-${i}`}>
                    <button
                      onClick={() => onIndexChange?.(i)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                        i === index
                          ? "bg-foreground/95 text-background"
                          : "bg-secondary/60 text-foreground hover:bg-secondary"
                      )}
                    >
                      <span className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
                        i === index ? "bg-background/20 text-background" : "bg-foreground/90 text-background"
                      )}>
                        {i + 1}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-body font-semibold truncate">{s.title}</span>
                        <span className={cn(
                          "block text-[11px] truncate",
                          i === index ? "text-background/70" : "text-muted-foreground"
                        )}>
                          {s.author} · {s.duration}
                        </span>
                      </span>
                      {i === index && isPlaying && (
                        <span className="w-2 h-2 rounded-full bg-background animate-pulse" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.aside>
          )}
        </AnimatePresence>

        <audio
          ref={audioRef}
          src={session.audioUrl}
          autoPlay
          onPlay={(e) => {
            e.currentTarget.playbackRate = playbackRate;
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            // Auto-advance through queue
            if (index < queue.length - 1) {
              onIndexChange?.(index + 1);
            } else {
              setIsPlaying(false);
            }
          }}
          onTimeUpdate={(e) => {
            const audio = e.currentTarget;
            if (audio.duration > 0) {
              setProgress((audio.currentTime / audio.duration) * 100);
            }
          }}
          className="hidden"
        />
      </motion.div>
    </AnimatePresence>
  );
}

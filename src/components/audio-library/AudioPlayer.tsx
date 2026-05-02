// Premium full-screen audio player. Preserves the original logic and structure
// of the uploaded reference; "ora-*" tokens are mapped to our Calm-inspired
// design tokens (background/foreground/border/muted/accent) so it inherits
// light/dark theme automatically.
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, SkipBack, SkipForward, Download } from 'lucide-react';
import type { MeditationSession } from '@/data/audioLibrary';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  session: MeditationSession | null;
  onClose: () => void;
}

export default function AudioPlayer({ session, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (session) {
      setIsPlaying(true);
      setProgress(0);
      setPlaybackRate(1);
    }
  }, [session]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  if (!session) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/98 backdrop-blur-xl"
      >
        <button
          onClick={onClose}
          aria-label="Close player"
          className="absolute top-6 right-6 sm:top-12 sm:right-12 w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:border-primary transition-all group"
        >
          <X className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" />
        </button>

        {/* Geometric background rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border border-border rounded-full pointer-events-none opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-border rounded-full pointer-events-none opacity-20"></div>

        <div className="max-w-md w-full flex flex-col items-center relative z-10">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4 block font-bold">Resonating</span>
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
              <button aria-label="Skip back" className="text-muted-foreground hover:text-foreground transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="w-24 h-24 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xl"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>
              <button aria-label="Skip forward" className="text-muted-foreground hover:text-foreground transition-colors">
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

        <audio
          ref={audioRef}
          src={session.audioUrl}
          autoPlay
          onPlay={(e) => {
            e.currentTarget.playbackRate = playbackRate;
          }}
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={(e) => {
            const audio = e.currentTarget;
            setProgress((audio.currentTime / audio.duration) * 100);
          }}
          className="hidden"
        />
      </motion.div>
    </AnimatePresence>
  );
}

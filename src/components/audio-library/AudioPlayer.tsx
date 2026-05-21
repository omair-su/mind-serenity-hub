// Premium full-screen audio player. Reads/writes the module-level
// globalPlayer singleton so audio survives route changes and integrates
// with the persistent <GlobalMiniPlayer />.
//
// Closing this view ("X") collapses to the mini-player instead of stopping
// playback. The chevron-down or the mini-player's expand button toggle
// between expanded/collapsed states.
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, SkipBack, SkipForward, ListMusic, Loader2, ChevronDown } from 'lucide-react';
import { type MeditationSession, sessionCategoryToNarration } from '@/data/audioLibrary';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { usePlayer } from '@/hooks/usePlayer';

interface AudioPlayerProps {
  queue: MeditationSession[];
  index?: number;
  onIndexChange?: (i: number) => void;
  onClose: () => void;
}

export default function AudioPlayer({ queue, index = 0, onIndexChange, onClose }: AudioPlayerProps) {
  const p = usePlayer();
  const session = queue[index] ?? null;

  // Sync queue's active session into the global player and ensure expanded.
  useEffect(() => {
    if (!session) return;
    const trackKey = `library-${session.id}`;
    // If a different track is loaded, swap; otherwise just re-expand.
    if (p.track?.trackKey !== trackKey) {
      void p.play({
        trackKey,
        title: session.title,
        subtitle: session.author,
        author: session.author,
        thumbnail: session.thumbnail,
        script: session.script,
        voice: session.voice,
        category: sessionCategoryToNarration(session.category),
        audioUrl: session.audioUrl,
        isPremium: true,
        resumable: session.category === "Sleep" || session.category === "Stories",
      }, { expanded: true });
    } else {
      p.setExpanded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  // ESC collapses to mini-player
  useEffect(() => {
    if (!session) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') collapse();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const collapse = () => {
    p.setExpanded(false);
    onClose();
  };

  const stopAndClose = () => {
    p.close();
    onClose();
  };

  const goPrev = () => { if (index > 0) onIndexChange?.(index - 1); };
  const goNext = () => {
    if (index < queue.length - 1) onIndexChange?.(index + 1);
    else stopAndClose();
  };

  if (!session) return null;

  const progress = p.duration > 0 ? (p.currentTime / p.duration) * 100 : 0;
  const showQueueBtn = queue.length > 1;

  return (
    <AnimatePresence>
      <motion.div
        key="audio-player"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/98 backdrop-blur-xl"
      >
        <div className="absolute top-6 right-6 sm:top-12 sm:right-12 z-20 flex items-center gap-3">
          <button
            type="button"
            onClick={collapse}
            aria-label="Collapse to mini-player"
            className="w-12 h-12 rounded-full border border-border bg-background flex items-center justify-center hover:bg-secondary transition-all"
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            type="button"
            onClick={stopAndClose}
            aria-label="Close player"
            className="w-12 h-12 rounded-full border border-border bg-background flex items-center justify-center hover:bg-primary hover:border-primary transition-all group"
          >
            <X className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" />
          </button>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border border-border rounded-full pointer-events-none opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-border rounded-full pointer-events-none opacity-20"></div>

        <div className="max-w-md w-full flex flex-col items-center relative z-10">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4 block font-bold">
              {showQueueBtn ? `Track ${index + 1} of ${queue.length}` : 'Resonating'}
            </span>
            <motion.h2 className="font-display text-4xl sm:text-5xl italic text-foreground mb-4 tracking-tight leading-tight">
              {session.title}
            </motion.h2>
            <div className="w-8 h-px bg-primary mx-auto mt-6"></div>
          </div>

          <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
            <motion.div
              animate={{
                scale: p.isPlaying ? [1, 1.15, 1] : 1,
                opacity: p.isPlaying ? [0.4, 0.7, 0.4] : 0.4
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 border border-primary rounded-full"
            />
            <div className="w-48 h-48 rounded-full border border-border p-1 relative">
              <img
                src={session.thumbnail}
                alt={session.title}
                className="w-full h-full object-cover rounded-full grayscale opacity-70"
                referrerPolicy="no-referrer"
              />
              {p.isLoading && (
                <div className="absolute inset-0 rounded-full bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 text-foreground animate-spin" />
                  <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-bold">
                    Composing voice
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full space-y-8">
            <div className="space-y-3">
              <div className="h-0.5 w-full bg-border relative overflow-hidden">
                <motion.div
                  className="h-full bg-foreground"
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase text-muted-foreground/70">
                <span>{p.formatTime(p.currentTime)}</span>
                <span>{p.duration > 0 ? p.formatTime(p.duration) : session.duration}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-12">
              <button
                onClick={goPrev}
                aria-label="Previous track"
                className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                disabled={index === 0}
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={p.togglePlayPause}
                disabled={p.isLoading}
                aria-label={p.isPlaying ? 'Pause' : 'Play'}
                className={cn(
                  "w-24 h-24 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xl disabled:opacity-60 disabled:scale-100"
                )}
              >
                {p.isLoading
                  ? <Loader2 className="w-8 h-8 animate-spin" />
                  : p.isPlaying
                    ? <Pause className="w-8 h-8 fill-current" />
                    : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>
              <button
                onClick={goNext}
                aria-label="Next track"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-3">
              <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground italic font-display">
                {session.script ? 'Narrated by' : 'A composition by'} {session.author}
              </p>
              {p.error && (
                <p className="text-center text-[10px] text-destructive font-body max-w-xs">
                  {p.error}
                </p>
              )}
              {showQueueBtn && (
                <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  <ListMusic className="w-3.5 h-3.5" />
                  {queue.length} track queue
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

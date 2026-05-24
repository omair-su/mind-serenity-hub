// Portal-mounted persistent mini-player. Survives route changes because the
// audio element lives in `src/lib/globalPlayer.ts`, not in any component.
//
// Hidden while the fullscreen AudioPlayer UI is `expanded`, so the two never
// stack visually.
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Pause, X, Loader2 } from "lucide-react";
import { usePlayer } from "@/hooks/usePlayer";

export default function GlobalMiniPlayer() {
  const p = usePlayer();
  if (typeof document === "undefined") return null;

  const visible = !!p.track && !p.expanded;
  const progress = p.duration > 0 ? (p.currentTime / p.duration) * 100 : 0;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          key="wv-mini-player"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="fixed bottom-20 lg:bottom-4 left-1/2 -translate-x-1/2 z-[90] w-[calc(100%-1.5rem)] max-w-md"
        >
          <div className="rounded-2xl bg-[hsl(var(--charcoal))]/95 backdrop-blur-2xl border border-[hsl(var(--gold))]/20 shadow-[0_-8px_40px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="h-0.5 bg-card/5">
              <motion.div
                className="h-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <div className="flex items-center gap-3 p-2.5">
              {p.track?.thumbnail && (
                <img
                  src={p.track.thumbnail}
                  alt=""
                  className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-semibold text-cream truncate leading-tight">
                  {p.track?.title}
                </p>
                {p.track?.subtitle && (
                  <p className="text-[10px] font-body text-cream/50 truncate">
                    {p.track.subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={p.togglePlayPause}
                disabled={p.isLoading}
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] shadow-[0_0_18px_hsl(var(--gold)/0.35)] hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
                aria-label={p.isPlaying ? "Pause" : "Play"}
              >
                {p.isLoading ? (
                  <Loader2 className="w-4 h-4 text-[hsl(var(--charcoal))] animate-spin" />
                ) : p.isPlaying ? (
                  <Pause className="w-4 h-4 text-[hsl(var(--charcoal))]" />
                ) : (
                  <Play className="w-4 h-4 text-[hsl(var(--charcoal))] ml-0.5" />
                )}
              </button>
              <button
                onClick={p.close}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-card/5 text-cream/60 hover:bg-card/10 transition-all"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

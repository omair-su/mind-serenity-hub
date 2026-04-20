// Premium fixed-bottom narration bar with ambient-bed mixer.
// Drop into any page after calling useTextToSpeech + useAmbientBed.
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Loader2, Volume2, VolumeX, X, Music2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { forwardRef, useState } from "react";
import { AMBIENT_BEDS, type AmbientBedId } from "@/hooks/useAmbientBed";

interface NarrationBarProps {
  title: string;
  subtitle?: string;
  isLoading: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  formatTime: (s: number) => string;
  onTogglePlay: () => void;
  onClose?: () => void;
  // Ambient bed
  bed: AmbientBedId;
  bedVolume: number;
  onBedChange: (id: AmbientBedId) => void;
  onBedVolumeChange: (v: number) => void;
}

const NarrationBar = forwardRef<HTMLDivElement, NarrationBarProps>(({
  title, subtitle, isLoading, isPlaying, currentTime, duration, formatTime,
  onTogglePlay, onClose, bed, bedVolume, onBedChange, onBedVolumeChange,
}, _ref) => {
  const [showMixer, setShowMixer] = useState(false);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const activeBed = AMBIENT_BEDS.find((b) => b.id === bed) ?? AMBIENT_BEDS[0];

  return (
    <>
      {/* Spacer so content isn't hidden behind the fixed bar */}
      <div className="h-28" aria-hidden />

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-40 lg:left-64"
      >
        {/* Mixer panel */}
        <AnimatePresence>
          {showMixer && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="mx-3 mb-2 rounded-2xl bg-[hsl(var(--charcoal))]/95 backdrop-blur-2xl border border-[hsl(var(--gold))]/20 shadow-[0_-8px_40px_rgba(0,0,0,0.4)] p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-[hsl(var(--gold))]">
                  Ambient Bed
                </p>
                <button
                  onClick={() => setShowMixer(false)}
                  className="text-white/40 hover:text-white"
                  aria-label="Close mixer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-1.5 mb-3">
                {AMBIENT_BEDS.map((b) => {
                  const active = bed === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => onBedChange(b.id)}
                      className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all ${
                        active
                          ? "bg-[hsl(var(--gold))]/15 ring-1 ring-[hsl(var(--gold))]/40"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <span className="text-base">{b.emoji}</span>
                      <span className="text-[9px] font-body text-white/70 leading-tight text-center">
                        {b.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {bed !== "silence" && (
                <div className="flex items-center gap-2 px-1">
                  <VolumeX className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                  <Slider
                    value={[bedVolume]}
                    onValueChange={(v) => onBedVolumeChange(v[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <Volume2 className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                  <span className="text-[10px] font-body text-white/50 w-8 text-right tabular-nums">
                    {bedVolume}%
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main bar */}
        <div className="mx-3 mb-3 rounded-2xl bg-[hsl(var(--charcoal))]/95 backdrop-blur-2xl border border-[hsl(var(--gold))]/15 shadow-[0_-8px_40px_rgba(0,0,0,0.4)] overflow-hidden">
          {/* Progress strip on top */}
          <div className="h-0.5 bg-white/5 relative overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>

          <div className="flex items-center gap-3 p-3">
            {/* Play / pause */}
            <button
              onClick={onTogglePlay}
              disabled={isLoading}
              className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] shadow-[0_0_20px_hsl(var(--gold)/0.3)] hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-[hsl(var(--charcoal))] animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 text-[hsl(var(--charcoal))]" />
              ) : (
                <Play className="w-5 h-5 text-[hsl(var(--charcoal))] ml-0.5" />
              )}
            </button>

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm font-semibold text-white truncate leading-tight">
                {title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-body text-white/40 tabular-nums">
                  {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : "—:—"}
                </span>
                {subtitle && (
                  <>
                    <span className="text-white/20">·</span>
                    <span className="text-[10px] font-body text-white/50 truncate">{subtitle}</span>
                  </>
                )}
                {bed !== "silence" && (
                  <>
                    <span className="text-white/20">·</span>
                    <span className="text-[10px] font-body text-[hsl(var(--gold))]/80 flex items-center gap-1">
                      {activeBed.emoji} {activeBed.label}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Mixer toggle */}
            <button
              onClick={() => setShowMixer((s) => !s)}
              className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${
                showMixer || bed !== "silence"
                  ? "bg-[hsl(var(--gold))]/15 text-[hsl(var(--gold))] ring-1 ring-[hsl(var(--gold))]/30"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
              aria-label="Toggle ambient mixer"
            >
              <Music2 className="w-4 h-4" />
            </button>

            {/* Close */}
            {onClose && (
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-white/5 text-white/60 hover:bg-white/10 transition-all"
                aria-label="Close player"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

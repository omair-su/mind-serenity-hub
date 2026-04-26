// Layered soundscape: ambient bed + binaural beats + singing-bowl interval cues.
// Master + per-layer volume. Hard-stops on unmount.
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music2, Volume2, VolumeX, Bell, Brain, ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { AMBIENT_BEDS, type AmbientBedId } from "@/hooks/useAmbientBed";
import { startSound, stopSound, setVolume as setSoundVolume } from "@/lib/soundEngine";
import {
  FREQUENCY_PRESETS, startBinaural, stopBinaural, setBinauralVolume, type FrequencyPreset,
} from "@/lib/binauralBeats";

interface SoundBedDesignerProps {
  defaultBed?: AmbientBedId;
}

const BOWL_INTERVALS = [
  { value: 0, label: "Off" },
  { value: 3, label: "Every 3 min" },
  { value: 5, label: "Every 5 min" },
  { value: 10, label: "Every 10 min" },
];

export default function SoundBedDesigner({ defaultBed = "silence" }: SoundBedDesignerProps) {
  const [open, setOpen] = useState(false);

  // Ambient
  const [bed, setBed] = useState<AmbientBedId>(defaultBed);
  const [bedVolume, setBedVolume] = useState(35);
  const bedActiveRef = useRef<string | null>(null);

  // Binaural
  const [binauralPreset, setBinauralPreset] = useState<FrequencyPreset | null>(null);
  const [binauralVolume, setBinauralVol] = useState(20);

  // Singing bowls
  const [bowlInterval, setBowlInterval] = useState(0);
  const bowlTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Master
  const [muted, setMuted] = useState(false);

  // Apply ambient bed
  useEffect(() => {
    if (bedActiveRef.current) {
      stopSound(bedActiveRef.current);
      bedActiveRef.current = null;
    }
    if (bed === "silence" || muted) return;
    startSound(bed, Math.max(0, Math.min(1, bedVolume / 100)));
    bedActiveRef.current = bed;
    return () => {
      if (bedActiveRef.current) {
        stopSound(bedActiveRef.current);
        bedActiveRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bed, muted]);

  useEffect(() => {
    if (bedActiveRef.current) {
      setSoundVolume(bedActiveRef.current, Math.max(0, Math.min(1, (muted ? 0 : bedVolume) / 100)));
    }
  }, [bedVolume, muted]);

  // Apply binaural
  useEffect(() => {
    if (!binauralPreset || muted) {
      stopBinaural();
      return;
    }
    startBinaural(binauralPreset, binauralVolume / 100);
    return () => stopBinaural();
  }, [binauralPreset, muted]);

  useEffect(() => {
    if (binauralPreset && !muted) {
      setBinauralVolume(binauralVolume / 100);
    }
  }, [binauralVolume, binauralPreset, muted]);

  // Singing bowls interval
  useEffect(() => {
    if (bowlTimerRef.current) {
      clearInterval(bowlTimerRef.current);
      bowlTimerRef.current = null;
    }
    if (bowlInterval > 0 && !muted) {
      bowlTimerRef.current = setInterval(() => {
        startSound("bowls", 0.4);
        setTimeout(() => stopSound("bowls"), 6000);
      }, bowlInterval * 60 * 1000);
    }
    return () => {
      if (bowlTimerRef.current) clearInterval(bowlTimerRef.current);
      stopSound("bowls");
    };
  }, [bowlInterval, muted]);

  // Cleanup all on unmount
  useEffect(() => {
    return () => {
      if (bedActiveRef.current) stopSound(bedActiveRef.current);
      stopBinaural();
      if (bowlTimerRef.current) clearInterval(bowlTimerRef.current);
      stopSound("bowls");
    };
  }, []);

  const anyActive = bed !== "silence" || binauralPreset !== null || bowlInterval > 0;

  const stopAll = () => {
    setBed("silence");
    setBinauralPreset(null);
    setBowlInterval(0);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--charcoal))] to-[hsl(var(--forest-deep))] border border-[hsl(var(--gold))]/20 shadow-soft">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 p-5 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[hsl(var(--gold))]/15 flex items-center justify-center">
            <Music2 className="w-5 h-5 text-[hsl(var(--gold))]" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">Sound Bed Designer</p>
            <p className="font-display text-base font-semibold text-white">
              {anyActive ? "Layered soundscape active" : "Build your soundscape"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {anyActive && (
            <button
              onClick={(e) => { e.stopPropagation(); stopAll(); }}
              className="text-[10px] font-body uppercase tracking-wider text-[hsl(var(--gold))]/80 hover:text-[hsl(var(--gold))] px-2 py-1"
            >
              Stop All
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 space-y-5">
              {/* ── Ambient bed ── */}
              <div>
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-[hsl(var(--gold))]/80 mb-2">Ambient Bed</p>
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {AMBIENT_BEDS.map((b) => {
                    const active = bed === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => setBed(b.id)}
                        className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all ${
                          active ? "bg-[hsl(var(--gold))]/15 ring-1 ring-[hsl(var(--gold))]/40" : "hover:bg-white/5"
                        }`}
                      >
                        <span className="text-base">{b.emoji}</span>
                        <span className="text-[9px] font-body text-white/70 leading-tight text-center">{b.label}</span>
                      </button>
                    );
                  })}
                </div>
                {bed !== "silence" && (
                  <div className="flex items-center gap-2 px-1">
                    <VolumeX className="w-3 h-3 text-white/40" />
                    <Slider value={[bedVolume]} onValueChange={(v) => setBedVolume(v[0])} min={0} max={100} step={1} className="flex-1" />
                    <Volume2 className="w-3 h-3 text-white/40" />
                    <span className="text-[10px] text-white/50 w-7 text-right tabular-nums">{bedVolume}</span>
                  </div>
                )}
              </div>

              {/* ── Binaural ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-[hsl(var(--gold))]/80 flex items-center gap-1.5">
                    <Brain className="w-3 h-3" /> Binaural Beats
                  </p>
                  {binauralPreset && (
                    <button onClick={() => setBinauralPreset(null)} className="text-[9px] font-body text-white/40 hover:text-white/70 uppercase tracking-wider">
                      Off
                    </button>
                  )}
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 mb-2">
                  {FREQUENCY_PRESETS.slice(0, 6).map((p) => {
                    const active = binauralPreset?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setBinauralPreset(p)}
                        className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl transition-all min-w-[78px] ${
                          active ? "bg-[hsl(var(--gold))]/15 ring-1 ring-[hsl(var(--gold))]/40" : "bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-sm">{p.icon}</span>
                        <span className="text-[10px] font-body text-white/80 mt-0.5">{p.beatFreq}Hz</span>
                        <span className="text-[8px] font-body text-white/50 uppercase tracking-wider">{p.category}</span>
                      </button>
                    );
                  })}
                </div>
                {binauralPreset && (
                  <div className="flex items-center gap-2 px-1">
                    <VolumeX className="w-3 h-3 text-white/40" />
                    <Slider value={[binauralVolume]} onValueChange={(v) => setBinauralVol(v[0])} min={0} max={60} step={1} className="flex-1" />
                    <Volume2 className="w-3 h-3 text-white/40" />
                    <span className="text-[10px] text-white/50 w-7 text-right tabular-nums">{binauralVolume}</span>
                  </div>
                )}
                <p className="text-[9px] font-body text-white/40 mt-1.5 italic">🎧 Headphones required for binaural effect</p>
              </div>

              {/* ── Singing bowls interval ── */}
              <div>
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-[hsl(var(--gold))]/80 mb-2 flex items-center gap-1.5">
                  <Bell className="w-3 h-3" /> Mindfulness Bell
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {BOWL_INTERVALS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setBowlInterval(opt.value)}
                      className={`p-2 rounded-lg text-[10px] font-body transition-all ${
                        bowlInterval === opt.value
                          ? "bg-[hsl(var(--gold))]/15 ring-1 ring-[hsl(var(--gold))]/40 text-white"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Master mute */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-[10px] font-body uppercase tracking-wider text-white/60">Master</span>
                <button
                  onClick={() => setMuted((m) => !m)}
                  className={`flex items-center gap-1.5 text-xs font-body px-3 py-1.5 rounded-lg transition-colors ${
                    muted ? "bg-destructive/20 text-destructive-foreground" : "bg-white/10 text-white/80"
                  }`}
                >
                  {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  {muted ? "Muted" : "Live"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

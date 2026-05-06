// Signature full-screen meditation timer dial.
// A wow-factor, immersive experience: forest-night gradient backdrop, large
// circular progress ring with a coherent 6-BPM breathing pulse at the center,
// ambient bed control, and a finish ritual that logs the session and offers a
// quick mood check-in (which writes through to the global Mood Tracker).
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Plus, X, Volume2, VolumeX, Check, Heart } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useAmbientBed, type AmbientBedId } from "@/hooks/useAmbientBed";
import { saveTimerSession } from "@/lib/userStore";
import { saveMoodEntry } from "@/lib/cloudSync";
import { toast } from "sonner";

interface SignatureTimerProps {
  open: boolean;
  onClose: () => void;
  initialMinutes?: number;
}

const BREATH_CYCLE_S = 10; // 6 BPM coherent breathing

export default function SignatureTimer({ open, onClose, initialMinutes = 15 }: SignatureTimerProps) {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showMoodPrompt, setShowMoodPrompt] = useState(false);
  const [moodScore, setMoodScore] = useState([7]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const { bed, setBed, volume, setVolume, stopBed, options } = useAmbientBed("silence", 35);

  // Reset when (re)opened with a new initial duration
  useEffect(() => {
    if (open) {
      setMinutes(initialMinutes);
      setSeconds(initialMinutes * 60);
      setRunning(false);
      setCompleted(false);
      setShowMoodPrompt(false);
    }
    // Always stop ambient bed when the overlay closes
    if (!open) stopBed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialMinutes]);

  // Tick
  useEffect(() => {
    if (!open) return;
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (running && seconds <= 0) {
        // Finish
        setRunning(false);
        setCompleted(true);
        stopBed();
        const elapsedMin = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000));
        try {
          saveTimerSession({ date: new Date().toISOString(), duration: elapsedMin, type: "signature" });
        } catch {}
        // Soft chime (if supported)
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.frequency.value = 528; // "love frequency"
          o.type = "sine";
          g.gain.setValueAtTime(0.0001, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.05);
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);
          o.connect(g).connect(ctx.destination);
          o.start();
          o.stop(ctx.currentTime + 3.6);
        } catch {}
        setShowMoodPrompt(true);
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [open, running, seconds, stopBed]);

  // Esc to close (only when not running, to prevent accidental exits)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !running) onClose();
      if (e.key === " " || e.code === "Space") { e.preventDefault(); toggle(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, running]);

  const start = useCallback(() => {
    setSeconds(minutes * 60);
    setRunning(true);
    setCompleted(false);
    startTimeRef.current = Date.now();
  }, [minutes]);

  const toggle = useCallback(() => {
    if (completed) return;
    if (seconds === minutes * 60 && !running) {
      start();
    } else {
      setRunning((r) => !r);
    }
  }, [completed, seconds, minutes, running, start]);

  const extend = () => setSeconds((s) => s + 5 * 60);

  const submitMood = async () => {
    const score = moodScore[0];
    const emotion = score >= 8 ? "calm" : score >= 6 ? "balanced" : score >= 4 ? "neutral" : "tense";
    try {
      await saveMoodEntry({
        emotion_primary: emotion,
        focus: score,
        energy: score,
        note: `After ${minutes}-min Signature Timer session`,
      });
      toast.success("Logged to your Mood Tracker", { description: "Beautiful session 🌿" });
    } catch {
      toast.success("Session complete");
    }
    onClose();
  };

  const skipMood = () => {
    toast.success("Beautiful session 🌿");
    onClose();
  };

  const fmt = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  const total = minutes * 60;
  const progress = 1 - seconds / total;
  const RADIUS = 140;
  const CIRC = 2 * Math.PI * RADIUS;

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="signature-timer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[100] overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at top, hsl(var(--forest)) 0%, hsl(var(--forest-deep)) 45%, hsl(var(--charcoal)) 100%)",
        }}
      >
        {/* Floating ambient orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.18), transparent 70%)" }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-[28rem] h-[28rem] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(var(--sage) / 0.22), transparent 70%)" }}
          animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Close (only visible when paused / pre-start / completed) */}
        {!running && (
          <button
            onClick={onClose}
            aria-label="Close timer"
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/8 backdrop-blur-md border border-white/15 flex items-center justify-center text-cream hover:bg-white/15 transition-all z-20"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Main stage */}
        <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] sm:text-xs font-body font-bold tracking-[0.4em] uppercase text-[hsl(var(--gold))] mb-6 sm:mb-10"
          >
            {completed ? "Session Complete" : running ? "In Practice" : "Signature Timer"}
          </motion.p>

          {/* Dial */}
          <div className="relative w-[20rem] h-[20rem] sm:w-[24rem] sm:h-[24rem] flex items-center justify-center">
            {/* Outer breathing aura */}
            {running && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, hsl(var(--gold) / 0.18) 0%, transparent 60%)",
                  filter: "blur(20px)",
                }}
                animate={{ scale: [0.92, 1.12, 0.92], opacity: [0.5, 0.95, 0.5] }}
                transition={{ duration: BREATH_CYCLE_S, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            {/* Progress ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 320 320">
              <defs>
                <linearGradient id="sig-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--gold-light))" />
                  <stop offset="55%" stopColor="hsl(var(--gold))" />
                  <stop offset="100%" stopColor="hsl(var(--gold-dark))" />
                </linearGradient>
                <filter id="sig-glow">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle cx="160" cy="160" r={RADIUS} fill="none" stroke="hsl(var(--cream) / 0.08)" strokeWidth="6" />
              <circle
                cx="160"
                cy="160"
                r={RADIUS}
                fill="none"
                stroke="url(#sig-ring)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - progress)}
                filter="url(#sig-glow)"
                style={{ transition: "stroke-dashoffset 0.95s linear" }}
              />
            </svg>

            {/* Centre stack */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={completed ? "done" : "tick"}
                className="font-display text-6xl sm:text-7xl font-bold text-cream tabular-nums tracking-tight"
                animate={running ? { opacity: [0.85, 1, 0.85] } : {}}
                transition={{ duration: BREATH_CYCLE_S, repeat: Infinity, ease: "easeInOut" }}
              >
                {fmt}
              </motion.span>
              <p className="mt-2 text-xs sm:text-sm font-body text-cream/65 tracking-wider">
                {completed
                  ? "🌿 Beautiful work"
                  : running
                  ? "Inhale 4 · Exhale 6"
                  : `${minutes}-minute session`}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-10 sm:mt-12 flex items-center justify-center gap-4">
            {!running && !completed && seconds === total && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={start}
                className="px-10 py-4 rounded-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-charcoal font-display font-bold text-base shadow-[0_10px_40px_-10px_hsl(var(--gold)/0.6)] flex items-center gap-2.5"
              >
                <Play className="w-5 h-5" /> Begin
              </motion.button>
            )}

            {(running || (!completed && seconds !== total)) && (
              <>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={toggle}
                  aria-label={running ? "Pause" : "Resume"}
                  className="w-16 h-16 rounded-full bg-[hsl(var(--gold))] text-charcoal flex items-center justify-center shadow-[0_8px_30px_-8px_hsl(var(--gold)/0.7)]"
                >
                  {running ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={extend}
                  className="px-4 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-cream font-body text-sm flex items-center gap-1.5 hover:bg-white/15 transition-all"
                >
                  <Plus className="w-4 h-4" /> 5 min
                </motion.button>
              </>
            )}

            {completed && !showMoodPrompt && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowMoodPrompt(true)}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-charcoal font-display font-bold text-base shadow-[0_10px_40px_-10px_hsl(var(--gold)/0.6)] flex items-center gap-2"
              >
                <Heart className="w-4 h-4" /> Log Mood
              </motion.button>
            )}
          </div>

          {/* Duration presets — only pre-start */}
          {!running && !completed && seconds === total && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-md"
            >
              {[5, 10, 15, 20, 30, 45].map((m) => (
                <button
                  key={m}
                  onClick={() => { setMinutes(m); setSeconds(m * 60); }}
                  className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-wider transition-all ${
                    minutes === m
                      ? "bg-[hsl(var(--gold))] text-charcoal"
                      : "bg-white/8 text-cream/75 hover:bg-white/15 border border-white/10"
                  }`}
                >
                  {m} min
                </button>
              ))}
            </motion.div>
          )}

          {/* Ambient bed — bottom dock */}
          {!completed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4"
            >
              <div className="rounded-2xl bg-white/6 backdrop-blur-xl border border-white/10 px-3 py-2.5 flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setBed("silence")}
                  aria-label="Silence"
                  className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    bed === "silence" ? "bg-[hsl(var(--gold))] text-charcoal" : "text-cream/70 hover:bg-white/10"
                  }`}
                >
                  {bed === "silence" ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {options.filter((o) => o.id !== "silence").slice(0, 8).map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setBed(o.id as AmbientBedId)}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-medium flex items-center gap-1.5 transition-all ${
                        bed === o.id
                          ? "bg-[hsl(var(--gold))] text-charcoal"
                          : "bg-white/5 text-cream/75 hover:bg-white/12 border border-white/10"
                      }`}
                    >
                      <span>{o.emoji}</span> <span className="hidden sm:inline">{o.label}</span>
                    </button>
                  ))}
                </div>
                {bed !== "silence" && (
                  <div className="shrink-0 w-24 sm:w-32 ml-1">
                    <Slider value={[volume]} onValueChange={(v) => setVolume(v[0])} min={0} max={100} step={1} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Finish-ritual mood sheet */}
        <AnimatePresence>
          {showMoodPrompt && completed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex items-end sm:items-center justify-center bg-charcoal/40 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ type: "spring", damping: 24 }}
                className="w-full max-w-md rounded-3xl bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--cream-dark))] p-7 shadow-2xl border border-[hsl(var(--gold)/0.3)]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Check className="w-4 h-4 text-[hsl(var(--forest))]" />
                  <p className="text-[10px] font-body font-bold tracking-[0.3em] uppercase text-[hsl(var(--forest))]">
                    {minutes} min · Logged
                  </p>
                </div>
                <h3 className="font-display text-2xl font-bold text-charcoal mb-1">How do you feel now?</h3>
                <p className="text-sm font-body text-charcoal-soft mb-6">A quick check-in feeds your Mood Tracker.</p>

                <div className="flex justify-between text-xs font-body text-charcoal-soft mb-2">
                  <span>Tense</span>
                  <span className="font-display text-2xl font-bold text-[hsl(var(--gold-dark))]">{moodScore[0]}</span>
                  <span>Calm</span>
                </div>
                <Slider value={moodScore} onValueChange={setMoodScore} min={1} max={10} step={1} />

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={skipMood}
                    className="flex-1 py-3 rounded-xl bg-white text-charcoal-soft font-body text-sm border border-[hsl(var(--cream-dark))] hover:bg-[hsl(var(--cream-dark)/0.5)] transition-all"
                  >
                    Skip
                  </button>
                  <button
                    onClick={submitMood}
                    className="flex-[1.4] py-3 rounded-xl bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white font-body font-semibold text-sm shadow-[var(--shadow-gold-val)] hover:-translate-y-0.5 transition-all"
                  >
                    Log & Finish
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

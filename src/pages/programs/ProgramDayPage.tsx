// Generic player page for a single day of any MiniProgram. Renders rich
// optional content blocks (safety, science card, steps, exercises, bonus,
// timer, reflection journal) when present — keeping the simple layout for
// programs that don't yet supply them.
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Play, Pause, Loader2, Square, Lock, Crown, AlertTriangle,
  Sparkles, Award, RotateCcw, Plus,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useIsPremium } from "@/hooks/useIsPremium";
import { useBrandedVideo } from "@/hooks/useBrandedVideo";
import { useDayTimer } from "@/hooks/useDayTimer";
import { getProgramById } from "@/data/programs";

const STORAGE_KEY = (programId: string) => `willow:program:${programId}:progress`;
const JOURNAL_KEY = (programId: string, day: number) =>
  `willow:program:${programId}:journal:${day}`;

function markComplete(programId: string, day: number) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(programId));
    const set = new Set<number>(raw ? JSON.parse(raw) : []);
    const wasNew = !set.has(day);
    set.add(day);
    localStorage.setItem(STORAGE_KEY(programId), JSON.stringify([...set]));
    if (wasNew && typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("wv-program-day-complete", {
          detail: { programId, day, total: [...set].length },
        }),
      );
    }
  } catch { /* ignore */ }
}

export default function ProgramDayPage() {
  const { programId = "", dayNum = "1" } = useParams<{ programId: string; dayNum: string }>();
  const navigate = useNavigate();
  const { isPremium } = useIsPremium();

  const program = useMemo(() => getProgramById(programId), [programId]);
  const dayNumber = parseInt(dayNum, 10) || 1;
  const day = program?.days.find((d) => d.day === dayNumber);

  const locked = !!program && dayNumber > program.freeDays && !isPremium;

  const tts = useTextToSpeech();
  const [completed, setCompleted] = useState(false);

  // Breathing timer (in minutes) — only when day declares timerMinutes
  const timer = useDayTimer(day?.timerMinutes ?? 5);

  // Journal entry persistence
  const [journal, setJournal] = useState("");
  useEffect(() => {
    if (!program || !day) return;
    try {
      setJournal(localStorage.getItem(JOURNAL_KEY(program.id, day.day)) ?? "");
    } catch { /* ignore */ }
  }, [program, day]);

  const saveJournal = (val: string) => {
    setJournal(val);
    if (!program || !day) return;
    try {
      localStorage.setItem(JOURNAL_KEY(program.id, day.day), val);
    } catch { /* ignore */ }
  };

  const bg = useBrandedVideo(
    day?.videoSlot ?? program?.heroVideoSlot ?? "vagus-hero",
    program?.videoBackdrop ?? "",
    day?.posterUrl ?? program?.posterUrl ?? "",
  );

  usePageSEO({
    title: day
      ? `${program?.title} · Day ${day.day}: ${day.title} | Willow Vibes`
      : "Program Day | Willow Vibes",
    description: day?.whyItWorks ?? "",
  });

  useEffect(() => {
    if (tts.duration > 0 && tts.progress >= 99 && !completed && program) {
      markComplete(program.id, dayNumber);
      setCompleted(true);
    }
  }, [tts.duration, tts.progress, completed, program, dayNumber]);

  if (!program || !day) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <p className="font-body text-muted-foreground mb-4">Program day not found.</p>
            <Link to={`/app/programs/${programId}`} className="text-gold underline">Back to program</Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handlePlay = () => {
    if (locked) {
      navigate("/pricing");
      return;
    }
    if (tts.hasAudio) {
      tts.togglePlayPause();
    } else {
      tts.generateAndPlay(day.practice, {
        trackKey: `${program.id}-day-${day.day}`,
        category: "daily_meditation",
        title: `${program.title} · Day ${day.day}: ${day.title}`,
        description: day.whyItWorks,
        voice: program.voice,
        isPremium: true,
      });
    }
  };

  const handleMarkComplete = () => {
    if (locked || !program) return;
    markComplete(program.id, dayNumber);
    setCompleted(true);
  };

  const nextDay = program.days.find((d) => d.day === day.day + 1);
  const isFinalDay = !nextDay;

  return (
    <AppLayout>
      <div className="min-h-screen bg-charcoal pb-32 lg:pb-12 text-cream">
        {/* Cinematic backdrop */}
        <div className="fixed inset-0 z-0">
          {!locked && (
            <video
              key={bg.videoUrl}
              src={bg.videoUrl}
              poster={bg.posterUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {locked && (
            <img
              src={bg.posterUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/75 via-charcoal/88 to-charcoal" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-6">
          <Link
            to={`/app/programs/${program.id}`}
            className="inline-flex items-center gap-2 text-sm font-body text-cream/70 hover:text-cream transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to program
          </Link>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mb-6">
            {program.days.map((d) => (
              <div
                key={d.day}
                className={`h-1.5 rounded-full transition-all ${
                  d.day === day.day
                    ? "w-8 bg-gold"
                    : d.day < day.day
                      ? "w-4 bg-gold/60"
                      : "w-4 bg-cream/20"
                }`}
              />
            ))}
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-gold">
                {program.title} · Day {day.day} of {program.days.length}
              </span>
              <span className="text-[10px] font-body font-bold uppercase tracking-[0.1em] text-gold border border-gold/40 px-2 py-0.5 rounded-full">
                Research-backed
              </span>
              {locked && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/90 text-charcoal text-[10px] font-bold">
                  <Crown className="w-3 h-3" /> PREMIUM
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight">
              {day.title}
            </h1>
            <p className="font-body text-sm md:text-base text-cream/70 mt-3">
              {day.duration} · {day.technique}
            </p>
          </motion.div>

          {/* Safety disclaimer */}
          {day.safetyNote && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="mt-6 p-4 rounded-2xl bg-gold/10 border-[1.5px] border-gold/50 flex gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <p className="font-body text-sm text-cream/90 leading-relaxed">
                {day.safetyNote}
              </p>
            </motion.div>
          )}

          {/* Science Card */}
          {day.scienceCard && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 p-6 rounded-3xl bg-cream/95 text-charcoal shadow-soft"
            >
              <div className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-gold mb-2">
                The Science
              </div>
              <h2 className="font-display text-xl md:text-2xl font-semibold tracking-tight">
                {day.scienceCard.title}
              </h2>
              <p className="font-body text-sm md:text-base mt-3 leading-[1.7] text-charcoal/85">
                {day.scienceCard.body}
              </p>
            </motion.div>
          )}

          {/* Why it works (fallback if no scienceCard) */}
          {!day.scienceCard && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 p-5 rounded-2xl bg-cream/5 backdrop-blur-md border border-cream/10"
            >
              <div className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-gold mb-2">
                Why it works
              </div>
              <p className="font-body text-sm md:text-base text-cream/85 leading-[1.7]">
                {day.whyItWorks}
              </p>
            </motion.div>
          )}

          {/* Breathing timer (visual) */}
          {!locked && day.timerMinutes && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 p-7 rounded-3xl bg-cream/5 backdrop-blur-md border border-cream/10 text-center"
            >
              <div className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-gold mb-4">
                Guided Timer
              </div>
              <div className="relative flex items-center justify-center mb-5">
                <motion.div
                  animate={
                    timer.running
                      ? { scale: [1, 1.18, 1.18, 1], opacity: [0.5, 0.8, 0.8, 0.5] }
                      : { scale: 1, opacity: 0.5 }
                  }
                  transition={{
                    duration: 12,
                    repeat: timer.running ? Infinity : 0,
                    ease: "easeInOut",
                    times: [0, 0.33, 0.5, 1],
                  }}
                  className="absolute w-40 h-40 rounded-full"
                  style={{ background: "radial-gradient(circle, hsl(var(--sage-light) / 0.6), hsl(var(--sage) / 0))" }}
                />
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-sage/40 to-forest/60 border border-cream/20 flex items-center justify-center backdrop-blur-md">
                  <span className="font-display text-3xl font-semibold text-cream tracking-tight">
                    {timer.display}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={timer.toggle}
                  className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-body font-bold text-xs tracking-wide hover:bg-forest transition"
                >
                  {timer.running ? "Pause" : "Start"}
                </button>
                <button
                  onClick={() => timer.reset(day.timerMinutes ?? 5)}
                  aria-label="Reset"
                  className="p-2.5 rounded-full bg-cream/10 border border-cream/10 text-cream/80 hover:bg-cream/20 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={timer.extend}
                  aria-label="Add 5 minutes"
                  className="p-2.5 rounded-full bg-cream/10 border border-cream/10 text-cream/80 hover:bg-cream/20 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="font-body text-xs text-cream/60 mt-4">
                Inhale as the circle expands. Exhale as it contracts.
              </p>
            </motion.div>
          )}

          {/* Step-by-step instructions */}
          {day.steps && day.steps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 p-6 rounded-3xl bg-cream/5 backdrop-blur-md border border-cream/10"
            >
              <div className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-gold mb-4">
                Step by step
              </div>
              <ol className="space-y-3">
                {day.steps.map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gold/15 border border-gold/40 text-gold font-display font-semibold text-sm flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="font-body text-sm md:text-base text-cream/90 leading-[1.7] pt-0.5">
                      {s}
                    </span>
                  </li>
                ))}
              </ol>
            </motion.div>
          )}

          {/* Exercise sequence (Day 4 / Day 6) */}
          {day.exercises && day.exercises.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 space-y-4"
            >
              <div className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-gold mb-1 px-1">
                The Sequence
              </div>
              {day.exercises.map((ex, i) => (
                <div
                  key={ex.title}
                  className="p-6 rounded-3xl bg-cream/5 backdrop-blur-md border border-cream/10"
                >
                  <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
                    <h3 className="font-display text-lg md:text-xl font-semibold text-cream tracking-tight">
                      {i + 1}. {ex.title}
                    </h3>
                    {ex.durationLabel && (
                      <span className="text-[10px] font-body font-bold uppercase tracking-[0.1em] text-cream/60">
                        {ex.durationLabel}
                      </span>
                    )}
                  </div>
                  <p className="font-body text-sm text-cream/85 leading-[1.7]">{ex.body}</p>
                  {ex.badge && (
                    <div className="mt-3 inline-block text-[10px] font-body font-bold uppercase tracking-[0.1em] text-gold border border-gold/40 px-2 py-1 rounded-full">
                      {ex.badge}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* Bonus technique */}
          {day.bonus && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-6 p-6 rounded-3xl border-[1.5px] border-gold/50 bg-gold/10 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-gold">
                  Bonus technique
                </span>
              </div>
              <h3 className="font-display text-lg md:text-xl font-semibold text-cream tracking-tight">
                {day.bonus.title}
              </h3>
              <p className="font-body text-sm text-cream/85 mt-2 leading-[1.7]">
                {day.bonus.body}
              </p>
            </motion.div>
          )}

          {/* Audio Player */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 p-6 rounded-3xl bg-cream/5 backdrop-blur-md border border-cream/10"
          >
            <div className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-gold mb-4 text-center">
              Guided Audio
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={handlePlay}
                disabled={tts.isLoading}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-body font-bold tracking-wide hover:bg-forest hover:scale-[1.02] active:scale-95 transition disabled:opacity-50"
              >
                {locked ? (
                  <Lock className="w-4 h-4" />
                ) : tts.isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : tts.isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                {locked
                  ? "Unlock with Premium"
                  : tts.isLoading
                    ? "Preparing..."
                    : tts.isPlaying
                      ? "Pause"
                      : tts.hasAudio
                        ? "Resume"
                        : "Begin Guided Practice"}
              </button>

              {tts.hasAudio && (
                <button
                  onClick={tts.stop}
                  aria-label="Stop"
                  className="p-3 rounded-full bg-cream/10 border border-cream/10 text-cream/80 hover:bg-cream/20 transition"
                >
                  <Square className="w-4 h-4" />
                </button>
              )}
            </div>

            {tts.duration > 0 && (
              <div className="mt-6 max-w-md mx-auto">
                <div className="w-full bg-cream/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gold h-full transition-all"
                    style={{ width: `${tts.progress}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Reflection journal */}
          {!locked && day.reflectionPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-6 p-6 rounded-3xl bg-cream/5 backdrop-blur-md border border-cream/10"
            >
              <div className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-gold mb-2">
                Reflection
              </div>
              <p className="font-display text-lg md:text-xl italic font-normal text-cream/90 mb-3 leading-snug">
                {day.reflectionPrompt}
              </p>
              <textarea
                value={journal}
                onChange={(e) => saveJournal(e.target.value)}
                placeholder="Write what you notice…"
                className="w-full min-h-[120px] rounded-2xl bg-cream/10 border border-cream/20 focus:border-sage-light focus:ring-2 focus:ring-sage-light/40 focus:outline-none px-4 py-3 font-body text-sm text-cream placeholder:text-cream/40 leading-relaxed resize-none transition"
              />
              <p className="font-body text-[11px] text-cream/50 mt-2">
                Saved automatically to this device.
              </p>
            </motion.div>
          )}

          {/* Mark complete (when audio not used) */}
          {!locked && !completed && (
            <div className="mt-6 text-center">
              <button
                onClick={handleMarkComplete}
                className="font-body text-xs text-cream/60 hover:text-cream underline underline-offset-4 transition"
              >
                Mark Day {day.day} as complete →
              </button>
            </div>
          )}

          {/* Completion */}
          {completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="mt-8 p-7 rounded-3xl bg-gradient-to-br from-gold/25 to-sage/20 border-[1.5px] border-gold/50 text-center"
            >
              {isFinalDay ? (
                <>
                  <Award className="w-10 h-10 text-gold mx-auto mb-3" />
                  <p className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-gold mb-1">
                    Certificate of Completion
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl font-semibold text-cream mt-1 tracking-tight">
                    You completed the 7-Day Vagus Nerve Reset
                  </h3>
                  <p className="font-body text-sm text-cream/80 mt-3 leading-relaxed max-w-md mx-auto">
                    Your nervous system has been measurably re-toned. Keep your favorite three techniques as your daily anchor.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    <Link
                      to="/app/certificate"
                      className="px-6 py-2.5 rounded-full bg-gold text-charcoal font-body font-bold text-sm tracking-wide hover:scale-[1.02] transition"
                    >
                      View Certificate
                    </Link>
                    <Link
                      to="/app/explore"
                      className="px-6 py-2.5 rounded-full border-[1.5px] border-cream/70 text-cream font-body font-semibold text-sm tracking-wide hover:bg-cream/10 transition"
                    >
                      Explore More Programs
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-display text-xl font-semibold text-cream mb-1">
                    Day {day.day} complete ✓
                  </p>
                  <p className="font-body text-sm text-cream/75 mb-4">
                    Beautiful work. Your vagal tone is building.
                  </p>
                  {nextDay && (
                    <Link
                      to={`/app/programs/${program.id}/day/${nextDay.day}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-body font-bold text-sm tracking-wide hover:bg-forest hover:scale-[1.02] transition"
                    >
                      Continue to Day {nextDay.day} →
                    </Link>
                  )}
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

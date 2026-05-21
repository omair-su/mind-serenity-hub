// Generic player page for a single day of any MiniProgram. Routed at
// /app/programs/:programId/day/:dayNum. Uses the existing useTextToSpeech +
// global mini-player infrastructure so audio survives navigation.
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, Loader2, Square, Lock, Crown } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useIsPremium } from "@/hooks/useIsPremium";
import { getProgramById } from "@/data/programs/vagusNerveReset";

const STORAGE_KEY = (programId: string) => `willow:program:${programId}:progress`;

function markComplete(programId: string, day: number) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(programId));
    const set = new Set<number>(raw ? JSON.parse(raw) : []);
    set.add(day);
    localStorage.setItem(STORAGE_KEY(programId), JSON.stringify([...set]));
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

  usePageSEO({
    title: day
      ? `${program?.title} · Day ${day.day}: ${day.title} | Willow Vibes`
      : "Program Day | Willow Vibes",
    description: day?.whyItWorks ?? "",
  });

  // Mark complete when audio finishes
  useEffect(() => {
    if (
      tts.duration > 0 &&
      tts.progress >= 99 &&
      !completed &&
      program
    ) {
      markComplete(program.id, dayNumber);
      setCompleted(true);
    }
  }, [tts.duration, tts.progress, completed, program, dayNumber]);

  // Stop audio on unmount cleanup is handled by global player; do NOT auto-stop
  // here so playback can continue while the user navigates back to the timeline.

  if (!program || !day) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <p className="font-body text-muted-foreground mb-4">Program day not found.</p>
            <Link to="/app/programs/vagus-nerve" className="text-gold underline">Back to program</Link>
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

  const nextDay = program.days.find((d) => d.day === day.day + 1);

  return (
    <AppLayout>
      <div className="min-h-screen bg-charcoal pb-24 lg:pb-12 text-cream">
        {/* Cinematic backdrop */}
        <div className="fixed inset-0 z-0">
          {!locked && (
            <video
              src={day.posterUrl ? program.videoBackdrop : program.videoBackdrop}
              poster={day.posterUrl ?? program.posterUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {locked && (
            <img
              src={day.posterUrl ?? program.posterUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/85 to-charcoal" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-6">
          <Link
            to="/app/programs/vagus-nerve"
            className="inline-flex items-center gap-2 text-sm font-body text-cream/70 hover:text-cream transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to program
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-body font-bold uppercase tracking-wider text-gold">
                {program.title} · Day {day.day} of {program.days.length}
              </span>
              {locked && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/90 text-charcoal text-[10px] font-bold">
                  <Crown className="w-3 h-3" /> PREMIUM
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight">
              {day.title}
            </h1>
            <p className="font-body text-sm md:text-base text-cream/70 mt-3">
              {day.duration} · {day.technique}
            </p>
          </motion.div>

          {/* Why it works */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 p-5 rounded-2xl bg-cream/5 backdrop-blur-md border border-cream/10"
          >
            <div className="text-[10px] font-body font-bold uppercase tracking-wider text-gold mb-2">
              Why it works
            </div>
            <p className="font-body text-sm md:text-base text-cream/85 leading-relaxed">
              {day.whyItWorks}
            </p>
          </motion.div>

          {/* Player */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 p-6 rounded-2xl bg-cream/5 backdrop-blur-md border border-cream/10"
          >
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={handlePlay}
                disabled={tts.isLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-gold to-gold-dark text-charcoal text-sm font-body font-bold shadow-gold hover:scale-105 active:scale-95 transition disabled:opacity-50"
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
                  : "Begin Practice"}
              </button>

              {tts.hasAudio && (
                <button
                  onClick={tts.stop}
                  aria-label="Stop"
                  className="p-3 rounded-2xl bg-cream/10 border border-cream/10 text-cream/80 hover:bg-cream/20 transition"
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

          {/* Completed + Next day */}
          {completed && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 rounded-2xl bg-gold/15 border border-gold/30 text-center"
            >
              <p className="font-display text-lg font-bold text-cream mb-2">
                Day {day.day} complete ✓
              </p>
              {nextDay ? (
                <Link
                  to={`/app/programs/${program.id}/day/${nextDay.day}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-charcoal font-body font-bold text-sm hover:scale-105 transition mt-2"
                >
                  Continue to Day {nextDay.day} →
                </Link>
              ) : (
                <p className="font-body text-sm text-cream/80 mt-2">
                  You've completed the entire {program.title}. Welcome to a more regulated life.
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

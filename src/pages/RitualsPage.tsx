import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import {
  morningRitual, eveningRitual, getDailyWisdom, getTodayIntention,
  saveIntention, markRitualComplete, getRitualStreak,
  type RitualStep,
} from "@/data/rituals";
import { RITUALS_META, getRitualSteps, type RitualMeta } from "@/data/extraRituals";
import RitualHeroCard from "@/components/rituals/RitualHeroCard";
import AmbientMusicPlayer from "@/components/AmbientMusicPlayer";
import PremiumLockModal from "@/components/PremiumLockModal";
import { logRitualCompletion } from "@/lib/cloudSync";
import { REAL_AMBIENT_TRACKS } from "@/lib/realAmbientTracks";
import { Sparkles, Clock, Check, Flame, Heart, BookOpen, ChevronLeft } from "lucide-react";

const PREMIUM_RITUALS: RitualMeta["id"][] = ["creative", "sunday"];

function StreakRing({ streak }: { streak: number }) {
  const max = 30;
  const pct = Math.min(streak / max, 1);
  const c = 2 * Math.PI * 28;
  return (
    <div className="relative w-20 h-20">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="28" stroke="hsl(var(--secondary))" strokeWidth="5" fill="none" />
        <circle
          cx="32" cy="32" r="28"
          stroke="hsl(var(--gold))" strokeWidth="5" fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - pct * c}
          style={{ transition: "stroke-dashoffset 1s ease-out", filter: "drop-shadow(0 0 6px hsl(var(--gold)/0.5))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Flame className="w-4 h-4 text-gold" />
        <span className="font-display text-lg font-bold text-foreground leading-none">{streak}</span>
      </div>
    </div>
  );
}

export default function RitualsPage() {
  const [activeId, setActiveId] = useState<RitualMeta["id"] | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [intentionWord, setIntentionWord] = useState("");
  const [gratitudeItems, setGratitudeItems] = useState(["", "", ""]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [premiumOpen, setPremiumOpen] = useState<string | null>(null);
  const wisdom = getDailyWisdom();
  const existingIntention = getTodayIntention();
  const ritualStreak = getRitualStreak();

  useEffect(() => {
    if (existingIntention) setIntentionWord(existingIntention.word);
  }, [existingIntention]);

  const activeMeta = activeId ? RITUALS_META.find((r) => r.id === activeId)! : null;
  const steps: RitualStep[] = activeId
    ? activeId === "morning" ? morningRitual
      : activeId === "evening" ? eveningRitual
      : getRitualSteps(activeId)
    : [];
  const currentStep = steps[stepIndex];

  const startRitual = (id: RitualMeta["id"]) => {
    if (PREMIUM_RITUALS.includes(id)) {
      setPremiumOpen(RITUALS_META.find((r) => r.id === id)!.name);
      return;
    }
    setActiveId(id); setStepIndex(0); setCompleted(new Set());
  };

  const completeStep = () => {
    setCompleted((prev) => new Set(prev).add(currentStep.id));
    if (stepIndex < steps.length - 1) setStepIndex((s) => s + 1);
  };

  const finishRitual = async () => {
    const today = new Date().toISOString().split("T")[0];
    saveIntention({
      date: today,
      word: intentionWord,
      morningGratitude: activeId === "morning" ? gratitudeItems.filter(Boolean) : existingIntention?.morningGratitude || [],
      eveningGratitude: activeId === "evening" ? gratitudeItems.filter(Boolean) : existingIntention?.eveningGratitude || [],
      reflection: "",
    });
    markRitualComplete();
    if (activeId) await logRitualCompletion(activeId, intentionWord);
    setActiveId(null); setStepIndex(0); setCompleted(new Set());
  };

  const allStepsDone = steps.length > 0 && steps.every((s) => completed.has(s.id));
  const intentionWords = ["Peace", "Courage", "Focus", "Joy", "Patience", "Strength", "Love", "Clarity", "Growth", "Grace", "Balance", "Trust"];

  return (
    <AppLayout>
      <PremiumLockModal
        open={!!premiumOpen}
        onClose={() => setPremiumOpen(null)}
        feature={`${premiumOpen} · Sunrise Series`}
        description="Unlock 7-day audio-led ritual programs by category — Confidence Week, Calm Week, Focus Week."
      />
      <motion.div className="space-y-6 pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {!activeId && (
          <>
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">Sacred Rituals</h1>
                <p className="text-xs font-body text-muted-foreground">Six ceremonies for mindful living</p>
              </div>
            </div>

            {/* Streak + intention card */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-card border border-border p-4 shadow-soft flex items-center gap-3">
                <StreakRing streak={ritualStreak} />
                <div>
                  <p className="font-display text-sm font-bold text-foreground">Ritual Streak</p>
                  <p className="text-[10px] font-body text-muted-foreground">{ritualStreak === 0 ? "Begin today" : "Days in a row"}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-gold/10 via-card to-primary/5 border border-gold/30 p-4 shadow-soft flex flex-col justify-center">
                <Heart className="w-4 h-4 text-gold mb-1" />
                <p className="font-display text-lg font-bold text-foreground">{existingIntention?.word || "—"}</p>
                <p className="text-[10px] font-body text-muted-foreground">Today's Intention</p>
              </div>
            </div>

            {/* Wisdom */}
            <div className="bg-gradient-to-br from-gold/5 via-card to-primary/5 rounded-2xl p-5 border border-border shadow-soft">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[10px] font-body font-bold text-gold uppercase tracking-widest">Today's Wisdom</p>
                  <p className="font-display text-base text-foreground mt-1 leading-relaxed italic">"{wisdom.quote}"</p>
                  <p className="text-xs font-body text-muted-foreground mt-1">— {wisdom.author}</p>
                </div>
              </div>
            </div>

            {/* Ritual cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {RITUALS_META.map((meta, i) => (
                <RitualHeroCard
                  key={meta.id}
                  meta={meta}
                  index={i}
                  locked={PREMIUM_RITUALS.includes(meta.id)}
                  onClick={() => startRitual(meta.id)}
                />
              ))}
            </div>
          </>
        )}

        <AnimatePresence mode="wait">
          {activeId && currentStep && activeMeta && (
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              {/* Hero */}
              <div className="relative rounded-2xl overflow-hidden h-40">
                <img src={activeMeta.heroImage} alt={activeMeta.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button onClick={() => setActiveId(null)} className="absolute top-3 left-3 p-2 rounded-full bg-black/40 backdrop-blur-md text-white">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <p className="text-[10px] font-body uppercase tracking-widest opacity-80">Step {stepIndex + 1} of {steps.length}</p>
                  <h2 className="font-display text-xl font-bold">{activeMeta.name}</h2>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-1.5">
                {steps.map((s, i) => (
                  <div key={s.id} className={`flex-1 h-1.5 rounded-full transition-colors ${
                    completed.has(s.id) ? "bg-gold" : i === stepIndex ? "bg-gold/40" : "bg-secondary"
                  }`} />
                ))}
              </div>

              {/* Ambient bed */}
              <AmbientMusicPlayer
                defaultTrack={REAL_AMBIENT_TRACKS.find((t) => t.id === activeMeta.ambientId) ?? REAL_AMBIENT_TRACKS[0]}
                allowSwitch={false}
              />

              {/* Step card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
                <div className="text-center mb-4">
                  <span className="text-4xl">{currentStep.icon}</span>
                  <h2 className="font-display text-xl font-bold text-foreground mt-2">{currentStep.title}</h2>
                  <p className="text-xs font-body text-muted-foreground">{currentStep.description}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-body text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" /> {currentStep.duration} min
                  </span>
                </div>

                <div className="bg-secondary/30 rounded-xl p-5 mb-5">
                  <p className="font-body text-base text-foreground leading-[1.9] text-center">{currentStep.instruction}</p>
                </div>

                {currentStep.id === "intention" && (
                  <div className="mb-5">
                    <p className="text-xs font-body font-medium text-foreground mb-3 text-center">Choose your word for today:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {intentionWords.map((w) => (
                        <button
                          key={w}
                          onClick={() => setIntentionWord(w)}
                          className={`px-3 py-1.5 rounded-full text-xs font-body transition-colors ${
                            intentionWord === w ? "bg-gold text-white" : "bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(currentStep.id === "gratitude" || currentStep.id === "gratitude-eve") && (
                  <div className="mb-5 space-y-2">
                    {gratitudeItems.map((item, i) => (
                      <input
                        key={i}
                        value={item}
                        onChange={(e) => {
                          const next = [...gratitudeItems];
                          next[i] = e.target.value;
                          setGratitudeItems(next);
                        }}
                        placeholder={`Gratitude ${i + 1}...`}
                        className="w-full bg-secondary/30 rounded-xl px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:outline-none"
                      />
                    ))}
                  </div>
                )}

                <div className="flex justify-center gap-3">
                  {stepIndex > 0 && (
                    <button onClick={() => setStepIndex((s) => s - 1)} className="px-4 py-2.5 bg-secondary rounded-xl text-xs font-body">
                      ← Back
                    </button>
                  )}
                  {!allStepsDone ? (
                    <button onClick={completeStep} className="px-6 py-2.5 btn-gold rounded-xl text-sm font-body font-semibold flex items-center gap-2">
                      {stepIndex < steps.length - 1 ? "Next Step" : "Complete"} <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={finishRitual} className="px-6 py-2.5 btn-gold rounded-xl text-sm font-body font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Finish Ritual
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppLayout>
  );
}

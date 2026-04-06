import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import {
  morningRitual, eveningRitual, getDailyWisdom, getTodayIntention,
  saveIntention, markRitualComplete, getRitualStreak
} from "@/data/rituals";
import { Sun, Moon, Sparkles, Clock, Check, ChevronRight, Flame, Heart, BookOpen } from "lucide-react";

type RitualType = "morning" | "evening" | null;

export default function RitualsPage() {
  const [activeRitual, setActiveRitual] = useState<RitualType>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [intentionWord, setIntentionWord] = useState("");
  const [gratitudeItems, setGratitudeItems] = useState(["", "", ""]);
  const [reflection, setReflection] = useState("");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const wisdom = getDailyWisdom();
  const existingIntention = getTodayIntention();
  const ritualStreak = getRitualStreak();

  useEffect(() => {
    if (existingIntention) {
      setIntentionWord(existingIntention.word);
    }
  }, []);

  const steps = activeRitual === "morning" ? morningRitual : activeRitual === "evening" ? eveningRitual : [];
  const currentStep = steps[stepIndex];

  const completeStep = () => {
    setCompleted(prev => new Set(prev).add(currentStep.id));
    if (stepIndex < steps.length - 1) {
      setStepIndex(s => s + 1);
    }
  };

  const finishRitual = () => {
    const today = new Date().toISOString().split("T")[0];
    saveIntention({
      date: today,
      word: intentionWord,
      morningGratitude: activeRitual === "morning" ? gratitudeItems.filter(Boolean) : existingIntention?.morningGratitude || [],
      eveningGratitude: activeRitual === "evening" ? gratitudeItems.filter(Boolean) : existingIntention?.eveningGratitude || [],
      reflection,
    });
    markRitualComplete();
    setActiveRitual(null);
    setStepIndex(0);
    setCompleted(new Set());
  };

  const allStepsDone = steps.length > 0 && steps.every(s => completed.has(s.id));

  const intentionWords = ["Peace", "Courage", "Focus", "Joy", "Patience", "Strength", "Love", "Clarity", "Growth", "Grace", "Balance", "Trust"];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Daily Rituals</h1>
            <p className="text-sm font-body text-muted-foreground">Morning & evening practices for mindful living</p>
          </div>
        </div>

        {!activeRitual && (
          <>
            <div className="bg-gradient-to-br from-gold/5 via-card to-primary/5 rounded-2xl p-6 border border-border shadow-soft">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-gold" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-body font-bold text-gold uppercase tracking-widest">Today's Wisdom</p>
                  <p className="font-display text-lg text-foreground mt-1 leading-relaxed italic">"{wisdom.quote}"</p>
                  <p className="text-xs font-body text-muted-foreground mt-1">— {wisdom.author}</p>
                  <p className="text-sm font-body text-foreground/80 mt-3 bg-secondary/30 rounded-lg p-3">{wisdom.reflection}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-2xl p-4 border border-border shadow-soft text-center">
                <Flame className="w-6 h-6 text-gold mx-auto mb-1" />
                <p className="font-display text-2xl font-bold text-foreground">{ritualStreak}</p>
                <p className="text-[10px] font-body text-muted-foreground">Day Ritual Streak</p>
              </div>
              <div className="bg-card rounded-2xl p-4 border border-border shadow-soft text-center">
                <Heart className="w-6 h-6 text-primary mx-auto mb-1" />
                <p className="font-display text-2xl font-bold text-foreground">{existingIntention?.word || "—"}</p>
                <p className="text-[10px] font-body text-muted-foreground">Today's Intention</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => { setActiveRitual("morning"); setStepIndex(0); setCompleted(new Set()); }}
                className="group text-left bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all"
              >
                <Sun className="w-8 h-8 text-amber-500 mb-3" />
                <h3 className="font-display text-lg font-semibold text-foreground">Morning Ritual</h3>
                <p className="text-xs font-body text-muted-foreground mt-1">Start your day with intention and gratitude</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-body text-muted-foreground">~15 minutes · 6 steps</span>
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-amber-600 text-xs font-body font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Begin <ChevronRight className="w-3 h-3" />
                </div>
              </button>

              <button
                onClick={() => { setActiveRitual("evening"); setStepIndex(0); setCompleted(new Set()); }}
                className="group text-left bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 border border-indigo-500/20 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all"
              >
                <Moon className="w-8 h-8 text-indigo-500 mb-3" />
                <h3 className="font-display text-lg font-semibold text-foreground">Evening Ritual</h3>
                <p className="text-xs font-body text-muted-foreground mt-1">Release the day and prepare for restful sleep</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-body text-muted-foreground">~18 minutes · 6 steps</span>
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-indigo-600 text-xs font-body font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Begin <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            </div>

            {existingIntention && (existingIntention.morningGratitude.length > 0 || existingIntention.eveningGratitude.length > 0) && (
              <div className="bg-card rounded-2xl p-5 border border-border">
                <h3 className="font-display text-base font-semibold text-foreground mb-3">Today's Gratitude</h3>
                <div className="space-y-1.5">
                  {[...existingIntention.morningGratitude, ...existingIntention.eveningGratitude].filter(Boolean).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-body text-foreground">
                      <span className="text-gold">✦</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeRitual && currentStep && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => { setActiveRitual(null); setStepIndex(0); }}
                className="text-sm font-body text-muted-foreground hover:text-foreground"
              >
                ← Back
              </button>
              <span className="text-xs font-body text-muted-foreground">
                Step {stepIndex + 1} of {steps.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-2">
              {steps.map((s, i) => (
                <div key={s.id} className={`flex-1 h-1.5 rounded-full transition-colors ${
                  completed.has(s.id) ? "bg-primary" : i === stepIndex ? "bg-primary/40" : "bg-secondary"
                }`} />
              ))}
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-soft">
              <div className="text-center mb-6">
                <span className="text-4xl">{currentStep.icon}</span>
                <h2 className="font-display text-xl font-bold text-foreground mt-2">{currentStep.title}</h2>
                <p className="text-sm font-body text-muted-foreground">{currentStep.description}</p>
                <span className="inline-flex items-center gap-1 text-xs font-body text-muted-foreground mt-1">
                  <Clock className="w-3 h-3" /> {currentStep.duration} minutes
                </span>
              </div>

              <div className="bg-secondary/30 rounded-xl p-6 mb-6">
                <p className="font-body text-base text-foreground leading-[2] text-center">{currentStep.instruction}</p>
              </div>

              {currentStep.id === "intention" && (
                <div className="mb-6">
                  <p className="text-sm font-body font-medium text-foreground mb-3 text-center">Choose your word for today:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {intentionWords.map(w => (
                      <button
                        key={w}
                        onClick={() => setIntentionWord(w)}
                        className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${
                          intentionWord === w ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(currentStep.id === "gratitude" || currentStep.id === "gratitude-eve") && (
                <div className="mb-6 space-y-2">
                  {gratitudeItems.map((item, i) => (
                    <input
                      key={i}
                      value={item}
                      onChange={e => {
                        const next = [...gratitudeItems];
                        next[i] = e.target.value;
                        setGratitudeItems(next);
                      }}
                      placeholder={`Gratitude ${i + 1}...`}
                      className="w-full bg-secondary/30 rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:outline-none"
                    />
                  ))}
                </div>
              )}

              <div className="flex justify-center gap-3">
                {stepIndex > 0 && (
                  <button onClick={() => setStepIndex(s => s - 1)} className="px-4 py-2.5 bg-secondary rounded-xl text-sm font-body">
                    ← Back
                  </button>
                )}
                {!allStepsDone ? (
                  <button onClick={completeStep} className="px-6 py-2.5 btn-gold rounded-xl text-sm font-body font-semibold flex items-center gap-2">
                    {completed.has(currentStep.id) ? "Done" : stepIndex < steps.length - 1 ? "Next Step" : "Complete"} <Check className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={finishRitual} className="px-6 py-2.5 btn-gold rounded-xl text-sm font-body font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Finish Ritual
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

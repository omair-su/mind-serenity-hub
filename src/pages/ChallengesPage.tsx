import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { challenges, getChallengeProgress, saveChallengeDay } from "@/data/challenges";
import { Trophy, Clock, ArrowLeft, Check, Play, ChevronRight, Star, Target } from "lucide-react";

export default function ChallengesPage() {
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [progress, setProgress] = useState(getChallengeProgress());

  const challenge = challenges.find(c => c.id === activeChallenge);

  const completeDay = (challengeId: string, dayNum: number) => {
    saveChallengeDay(challengeId, dayNum, note || undefined);
    setProgress(getChallengeProgress());
    setNote("");
    setActiveDay(null);
  };

  const getProgressPercent = (challengeId: string) => {
    const p = progress[challengeId];
    const c = challenges.find(ch => ch.id === challengeId);
    if (!p || !c) return 0;
    return Math.round((p.completedDays.length / c.duration) * 100);
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Mindfulness Challenges</h1>
            <p className="text-sm font-body text-muted-foreground">Themed multi-day challenges to deepen your practice</p>
          </div>
        </div>

        {!challenge && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {challenges.map(c => {
              const pct = getProgressPercent(c.id);
              const started = pct > 0;
              const completed = pct >= 100;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveChallenge(c.id)}
                  className={`group text-left rounded-2xl border border-border p-5 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-br ${c.color} relative overflow-hidden`}
                >
                  {completed && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-gold" />
                    </div>
                  )}
                  <span className="text-3xl">{c.icon}</span>
                  <h3 className="font-display text-base font-semibold text-foreground mt-2">{c.name}</h3>
                  <p className="text-xs font-body text-muted-foreground mt-1 leading-relaxed">{c.description}</p>

                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[10px] font-body text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {c.duration} days
                    </span>
                    <span className="text-[10px] font-body text-muted-foreground px-2 py-0.5 rounded-full bg-background/50">
                      {c.category}
                    </span>
                  </div>

                  {started && (
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] font-body text-muted-foreground mb-1">
                        <span>{pct}% complete</span>
                        <span>{progress[c.id]?.completedDays.length}/{c.duration} days</span>
                      </div>
                      <div className="w-full bg-background/30 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 mt-3 text-primary text-xs font-body font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-3 h-3" /> {started ? "Continue" : "Start Challenge"} <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {challenge && !activeDay && (
          <div className="space-y-4">
            <button
              onClick={() => setActiveChallenge(null)}
              className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" /> All Challenges
            </button>

            <div className={`bg-gradient-to-br ${challenge.color} rounded-2xl p-6 border border-border`}>
              <div className="flex items-start gap-4">
                <span className="text-4xl">{challenge.icon}</span>
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">{challenge.name}</h2>
                  <p className="text-sm font-body text-muted-foreground mt-1">{challenge.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {challenge.benefits.map(b => (
                      <span key={b} className="text-[10px] font-body px-2 py-1 rounded-full bg-background/50 text-muted-foreground">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {challenge.days.map(day => {
                const done = progress[challenge.id]?.completedDays.includes(day.day);
                return (
                  <button
                    key={day.day}
                    onClick={() => !done && setActiveDay(day.day)}
                    className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      done
                        ? "bg-primary/5 border-primary/20"
                        : "bg-card border-border hover:bg-secondary/50 hover:shadow-soft"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      done ? "bg-primary/20" : "bg-secondary"
                    }`}>
                      {done ? <Check className="w-5 h-5 text-primary" /> : <span className="font-display text-sm font-bold text-muted-foreground">{day.day}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-semibold text-foreground">{day.title}</p>
                      <p className="text-xs font-body text-muted-foreground truncate">{day.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-body text-muted-foreground">{day.duration} min</span>
                      {!done && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {challenge && activeDay && (
          <div className="space-y-4">
            <button
              onClick={() => setActiveDay(null)}
              className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" /> Back to {challenge.name}
            </button>

            {(() => {
              const day = challenge.days.find(d => d.day === activeDay);
              if (!day) return null;
              return (
                <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-soft">
                  <div className="text-center mb-6">
                    <span className="text-[10px] font-body font-bold text-primary uppercase tracking-widest">
                      Day {day.day} of {challenge.duration}
                    </span>
                    <h2 className="font-display text-2xl font-bold text-foreground mt-1">{day.title}</h2>
                    <p className="text-sm font-body text-muted-foreground mt-1">{day.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-body text-muted-foreground mt-2">
                      <Clock className="w-3 h-3" /> {day.duration} minutes
                    </span>
                  </div>

                  <div className="bg-secondary/30 rounded-xl p-6 mb-6">
                    <h3 className="text-sm font-body font-semibold text-foreground mb-2">Today's Practice</h3>
                    <p className="font-body text-base text-foreground leading-[2]">{day.practice}</p>
                  </div>

                  <div className="mb-6">
                    <label className="text-sm font-body font-medium text-foreground block mb-2">
                      Reflection (optional)
                    </label>
                    <textarea
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="How did this practice feel? What did you notice?"
                      className="w-full bg-secondary/30 rounded-xl p-4 text-sm font-body text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:outline-none resize-none"
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={() => completeDay(challenge.id, activeDay)}
                    className="w-full flex items-center justify-center gap-2 py-3 btn-gold rounded-xl text-sm font-body font-semibold"
                  >
                    <Check className="w-4 h-4" /> Complete Day {activeDay}
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

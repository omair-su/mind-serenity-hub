import { useParams, Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { weeks } from "@/data/courseData";
import { getCompletedDays, getAllDayStates, getTotalMinutes } from "@/lib/userStore";
import { Check, ArrowRight, Trophy } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const weekCoachNotes = [
  "You built the foundation. Most people never even start. You did more than start — you showed up seven times. That's real commitment. Your brain is already beginning to change. The prefrontal cortex is strengthening with each session. Keep going.",
  "You're past the beginner phase. Your brain is literally changing — forming new neural pathways for awareness and calm. The practices feel less foreign now, right? That's neuroplasticity in action. You're doing remarkable work.",
  "This is where most people quit programs. But you're here. That says everything about your dedication. This week's heart practices might have felt uncomfortable — compassion often does at first. But you stayed with it. That's courage.",
  "You completed the journey. 30 days of showing up for yourself. Look at who you were on Day 1 and who you are now. The changes might feel subtle, but they're profound. Your nervous system is calmer. Your mind is clearer. You did something most people only talk about.",
];

export default function WeekReviewPage() {
  const { weekNum } = useParams();
  const weekNumber = parseInt(weekNum || "1");
  const weekData = weeks.find(w => w.week === weekNumber);
  const completed = getCompletedDays();
  const allStates = getAllDayStates();
  const totalMins = getTotalMinutes();
  const [insights, setInsights] = useState("");
  const [favorite, setFavorite] = useState("");
  const [challenge, setChallenge] = useState("");
  const [change, setChange] = useState("");

  if (!weekData) return <AppLayout><p className="font-body text-muted-foreground">Week not found.</p></AppLayout>;

  const weekCompleted = weekData.days.filter(d => completed.includes(d.day)).length;
  const weekMins = weekData.days.reduce((sum, d) => {
    const s = allStates[d.day];
    return sum + (s?.checklist?.every(Boolean) ? (s.duration || 15) : 0);
  }, 0);

  return (
    <AppLayout>
      <div className="space-y-8 max-w-2xl mx-auto">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-2xl p-8 text-center border border-primary/10">
          <Trophy className="w-10 h-10 text-gold mx-auto mb-3" />
          <h1 className="font-display text-3xl font-bold text-foreground">Week {weekNumber} Complete!</h1>
          <p className="font-body text-muted-foreground mt-2">{weekData.title}</p>
          <p className="text-sm font-body text-primary mt-1">{weekCompleted} of {weekData.days.length} days completed</p>
        </div>

        {/* Days list */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">This Week's Practices</h2>
          <div className="space-y-2">
            {weekData.days.map(d => {
              const done = completed.includes(d.day);
              return (
                <Link key={d.day} to={`/day/${d.day}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-bold ${
                    done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}>
                    {done ? <Check className="w-4 h-4" /> : d.day}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-body font-medium text-foreground">Day {d.day}: {d.title}</p>
                    <p className="text-xs font-body text-muted-foreground">{d.duration}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl p-4 border border-border text-center">
            <p className="font-display text-2xl font-bold text-foreground">{weekCompleted}/{weekData.days.length}</p>
            <p className="text-xs font-body text-muted-foreground">Days Done</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border text-center">
            <p className="font-display text-2xl font-bold text-foreground">{weekMins}</p>
            <p className="text-xs font-body text-muted-foreground">Minutes</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border text-center">
            <p className="font-display text-2xl font-bold text-primary">{Math.round((weekCompleted / weekData.days.length) * 100)}%</p>
            <p className="text-xs font-body text-muted-foreground">Complete</p>
          </div>
        </div>

        {/* Coach note */}
        <div className="bg-card rounded-2xl border-l-4 border-primary p-6">
          <p className="text-xs font-body font-semibold text-primary uppercase tracking-wider mb-2">Coach's Weekly Note</p>
          <p className="font-body text-foreground/85 leading-[2] text-sm">{weekCoachNotes[weekNumber - 1]}</p>
          <p className="text-xs font-body text-primary mt-3">— Your Willow Vibes Coach 💚</p>
        </div>

        {/* Reflections */}
        <div className="bg-secondary/30 rounded-2xl p-6 border border-border space-y-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Weekly Reflection</h2>
          {[
            { label: "What was your biggest insight this week?", value: insights, onChange: setInsights },
            { label: "Which practice resonated most? Why?", value: favorite, onChange: setFavorite },
            { label: "What challenged you?", value: challenge, onChange: setChallenge },
            { label: "How do you feel different than 7 days ago?", value: change, onChange: setChange },
          ].map(prompt => (
            <div key={prompt.label}>
              <label className="text-sm font-body font-medium text-foreground mb-2 block">{prompt.label}</label>
              <Textarea value={prompt.value} onChange={e => prompt.onChange(e.target.value)} className="font-body" placeholder="Share your thoughts..." />
            </div>
          ))}
        </div>

        {/* Nav */}
        <div className="flex justify-between">
          {weekNumber > 1 && (
            <Link to={`/app/review/${weekNumber - 1}`} className="px-4 py-2.5 bg-secondary rounded-xl text-sm font-body">← Week {weekNumber - 1}</Link>
          )}
          <div />
          {weekNumber < 4 ? (
            <Link to={`/app/review/${weekNumber + 1}`} className="px-4 py-2.5 btn-gold rounded-xl text-sm font-body font-semibold flex items-center gap-1.5">
              Week {weekNumber + 1} <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link to="/app/achievements" className="px-4 py-2.5 btn-gold rounded-xl text-sm font-body font-semibold flex items-center gap-1.5">
              View Achievements <Trophy className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

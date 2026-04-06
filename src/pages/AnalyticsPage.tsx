import AppLayout from "@/components/AppLayout";
import { getCompletedDays, getTotalMinutes, getCurrentStreak, getLongestStreak, getAllDayStates } from "@/lib/userStore";
import { weeks } from "@/data/courseData";
import { BarChart3, Target, Clock, Flame, TrendingUp, Calendar } from "lucide-react";

const statStyles = [
  { gradient: "from-emerald-500/12 to-teal-500/5", iconBg: "bg-gradient-to-br from-primary/20 to-sage/25", iconColor: "text-primary" },
  { gradient: "from-amber-500/12 to-yellow-500/5", iconBg: "bg-gradient-to-br from-gold/20 to-amber-500/15", iconColor: "text-gold" },
  { gradient: "from-rose-500/12 to-red-500/5", iconBg: "bg-gradient-to-br from-rose-500/20 to-red-500/15", iconColor: "text-destructive" },
  { gradient: "from-violet-500/12 to-purple-500/5", iconBg: "bg-gradient-to-br from-violet-500/20 to-purple-500/15", iconColor: "text-primary" },
];

export default function AnalyticsPage() {
  const completed = getCompletedDays();
  const totalMins = getTotalMinutes();
  const streak = getCurrentStreak();
  const longest = getLongestStreak();
  const allStates = getAllDayStates();
  const percentage = Math.round((completed.length / 30) * 100);

  const weekStats = weeks.map(w => {
    const weekCompleted = w.days.filter(d => completed.includes(d.day)).length;
    return { week: w.week, title: w.title, completed: weekCompleted, total: w.days.length };
  });

  const weekBarColors = [
    "from-emerald-500 to-teal-500",
    "from-blue-500 to-indigo-500",
    "from-amber-500 to-orange-500",
    "from-violet-500 to-purple-500",
  ];

  const ratingData = Object.entries(allStates)
    .filter(([, s]) => s.calmRating)
    .map(([d, s]) => ({ day: parseInt(d), rating: s.calmRating }))
    .sort((a, b) => a.day - b.day);

  const avgRating = ratingData.length > 0 ? (ratingData.reduce((s, r) => s + r.rating, 0) / ratingData.length).toFixed(1) : "—";

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-500/15 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Progress Analytics</h1>
            <p className="text-sm font-body text-muted-foreground">Your meditation journey at a glance</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Days Completed", value: `${completed.length}/30`, sub: `${percentage}% complete`, icon: Target },
            { label: "Total Minutes", value: totalMins.toString(), sub: `${(totalMins / 60).toFixed(1)} hours`, icon: Clock },
            { label: "Current Streak", value: streak.toString(), sub: `Best: ${longest} days`, icon: Flame },
            { label: "Avg Calm Rating", value: avgRating, sub: "out of 10", icon: TrendingUp },
          ].map((card, i) => (
            <div key={card.label} className={`relative overflow-hidden bg-gradient-to-br ${statStyles[i].gradient} rounded-2xl p-5 border border-border/50 shadow-soft`}>
              <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-gradient-to-bl from-card/30 to-transparent" />
              <div className={`w-10 h-10 rounded-xl ${statStyles[i].iconBg} flex items-center justify-center mb-3`}>
                <card.icon className={`w-5 h-5 ${statStyles[i].iconColor}`} />
              </div>
              <p className="font-display text-3xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs font-body font-medium text-foreground/80 mt-1">{card.label}</p>
              <p className="text-[11px] font-body text-muted-foreground">{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-sage/8 rounded-2xl p-6 border border-border/50 shadow-soft">
          <h2 className="font-display text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Completion by Week
          </h2>
          <div className="space-y-5">
            {weekStats.map((w, i) => (
              <div key={w.week}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-body font-medium text-foreground">Week {w.week}: {w.title}</span>
                  <span className="text-sm font-body text-muted-foreground">{w.completed}/{w.total}</span>
                </div>
                <div className="h-3 bg-secondary/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${weekBarColors[i]} rounded-full transition-all duration-1000`}
                    style={{ width: `${(w.completed / w.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {ratingData.length > 0 && (
          <div className="bg-gradient-to-br from-gold/5 to-amber-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold" /> Calm Rating Trend
            </h2>
            <div className="flex items-end gap-1 h-32">
              {ratingData.map(r => (
                <div key={r.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-gold to-gold-light rounded-t-md transition-all duration-500"
                    style={{ height: `${r.rating * 10}%` }}
                    title={`Day ${r.day}: ${r.rating}/10`}
                  />
                  <span className="text-[9px] font-body text-muted-foreground">{r.day}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-violet-500/5 to-indigo-500/5 rounded-2xl p-6 border border-border/50 shadow-soft">
          <h2 className="font-display text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> 30-Day Overview
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-center text-xs font-body text-muted-foreground font-medium py-1">{d}</div>
            ))}
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const isComplete = completed.includes(day);
              return (
                <div
                  key={day}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-body font-medium transition-all ${
                    isComplete ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm" : "bg-secondary/50 text-muted-foreground"
                  }`}
                  title={`Day ${day}${isComplete ? ' ✓' : ''}`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-sage/8 rounded-2xl p-6 border border-border/50 shadow-soft">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Insights</h2>
          <div className="space-y-3">
            {completed.length > 0 && (
              <InsightCard text={`You've meditated for ${totalMins} minutes — that's ${(totalMins / 60).toFixed(1)} hours of mindfulness practice!`} gradient="from-emerald-500/8 to-teal-500/5" />
            )}
            {streak >= 3 && (
              <InsightCard text={`${streak}-day streak! Consistency is the key to neuroplasticity. Your brain is literally rewiring.`} gradient="from-amber-500/8 to-orange-500/5" />
            )}
            {ratingData.length >= 5 && (
              <InsightCard text={`Your average calm rating is ${avgRating}/10. Keep practicing — most users see significant improvement by Week 3.`} gradient="from-violet-500/8 to-purple-500/5" />
            )}
            {completed.length === 0 && (
              <InsightCard text="Start your first meditation to begin tracking your progress. Every journey begins with a single breath." gradient="from-primary/8 to-sage/10" />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function InsightCard({ text, gradient }: { text: string; gradient: string }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r ${gradient} border border-border/30`}>
      <span className="text-lg">💡</span>
      <p className="text-sm font-body text-foreground leading-relaxed">{text}</p>
    </div>
  );
}

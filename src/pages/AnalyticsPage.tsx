import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { getCompletedDays, getTotalMinutes, getCurrentStreak, getLongestStreak, getAllDayStates } from "@/lib/userStore";
import { weeks } from "@/data/courseData";
import { BarChart3, Target, Clock, Flame, TrendingUp, Calendar, Sparkles } from "lucide-react";

const statStyles = [
  { gradient: "from-[hsl(var(--forest))]/12 via-[hsl(var(--sage-light))]/30 to-[hsl(var(--cream))]", iconBg: "bg-gradient-to-br from-[hsl(var(--forest))] to-[hsl(var(--forest-mid))]", iconColor: "text-[hsl(var(--cream))]" },
  { gradient: "from-[hsl(var(--gold))]/15 via-[hsl(var(--gold-light))]/20 to-[hsl(var(--cream))]", iconBg: "bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))]", iconColor: "text-[hsl(var(--cream))]" },
  { gradient: "from-[hsl(var(--forest-mid))]/15 via-[hsl(var(--sage))]/15 to-[hsl(var(--cream))]", iconBg: "bg-gradient-to-br from-[hsl(var(--forest-deep))] to-[hsl(var(--forest))]", iconColor: "text-[hsl(var(--cream))]" },
  { gradient: "from-[hsl(var(--sage))]/20 via-[hsl(var(--sage-light))]/30 to-[hsl(var(--cream))]", iconBg: "bg-gradient-to-br from-[hsl(var(--sage-dark))] to-[hsl(var(--forest-mid))]", iconColor: "text-[hsl(var(--cream))]" },
];

const weekBarColors = [
  "from-[hsl(var(--forest))] to-[hsl(var(--sage-dark))]",
  "from-[hsl(var(--sage-dark))] to-[hsl(var(--forest-mid))]",
  "from-[hsl(var(--gold-dark))] to-[hsl(var(--gold))]",
  "from-[hsl(var(--forest-deep))] to-[hsl(var(--forest))]",
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

  const ratingData = Object.entries(allStates)
    .filter(([, s]) => s.calmRating)
    .map(([d, s]) => ({ day: parseInt(d), rating: s.calmRating }))
    .sort((a, b) => a.day - b.day);

  const avgRating = ratingData.length > 0 ? (ratingData.reduce((s, r) => s + r.rating, 0) / ratingData.length).toFixed(1) : "—";

  return (
    <AppLayout>
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Editorial header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative overflow-hidden rounded-3xl border border-[hsl(var(--gold))]/20 bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--forest-mid))] px-6 py-10 sm:px-10"
        >
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
            background: "radial-gradient(circle at 70% 30%, hsl(var(--gold) / 0.4) 0%, transparent 50%)"
          }} />
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(var(--gold))]/15 border border-[hsl(var(--gold))]/30 text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-[hsl(var(--gold-light))]">
                <BarChart3 className="w-3 h-3" /> Your Journey
              </span>
              <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-[hsl(var(--cream))] leading-[1.05]">
                The shape of<br/>your practice
              </h1>
              <p className="mt-3 font-body text-sm text-[hsl(var(--cream))]/75 max-w-md">
                Quiet metrics from a deliberate life.
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-6xl sm:text-7xl font-bold text-[hsl(var(--gold-light))] leading-none">{percentage}<span className="text-3xl">%</span></p>
              <p className="text-[11px] font-body uppercase tracking-[0.2em] text-[hsl(var(--cream))]/60 mt-1">course complete</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Days Completed", value: `${completed.length}/30`, sub: `${percentage}% complete`, icon: Target },
            { label: "Total Minutes", value: totalMins.toString(), sub: `${(totalMins / 60).toFixed(1)} hours`, icon: Clock },
            { label: "Current Streak", value: streak.toString(), sub: `Best: ${longest} days`, icon: Flame },
            { label: "Avg Calm Rating", value: avgRating, sub: "out of 10", icon: TrendingUp },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className={`relative overflow-hidden bg-gradient-to-br ${statStyles[i].gradient} rounded-2xl p-5 border border-[hsl(var(--gold))]/15 shadow-[var(--shadow-soft-val)]`}
            >
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[hsl(var(--gold))]/8 blur-2xl" />
              <div className={`relative w-11 h-11 rounded-2xl ${statStyles[i].iconBg} flex items-center justify-center mb-4 shadow-md`}>
                <card.icon className={`w-5 h-5 ${statStyles[i].iconColor}`} />
              </div>
              <p className="relative font-display text-3xl font-bold text-[hsl(var(--charcoal))]">{card.value}</p>
              <p className="relative text-xs font-body font-semibold text-[hsl(var(--forest))] mt-1 uppercase tracking-wider">{card.label}</p>
              <p className="relative text-[11px] font-body text-[hsl(var(--charcoal-soft))] mt-0.5">{card.sub}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--sage-light))]/40 rounded-2xl p-6 border border-[hsl(var(--gold))]/15 shadow-[var(--shadow-soft-val)]"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-gradient-to-b from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] rounded-full" />
            <h2 className="font-display text-xl font-semibold text-[hsl(var(--forest-deep))]">Completion by Week</h2>
          </div>
          <div className="space-y-5">
            {weekStats.map((w, i) => (
              <div key={w.week}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-display font-semibold text-[hsl(var(--charcoal))]">Week {w.week} · {w.title}</span>
                  <span className="text-xs font-body text-[hsl(var(--charcoal-soft))] tabular-nums">{w.completed}/{w.total}</span>
                </div>
                <div className="h-3 bg-[hsl(var(--sage-light))]/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(w.completed / w.total) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                    className={`h-full bg-gradient-to-r ${weekBarColors[i]} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {ratingData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-gradient-to-br from-[hsl(var(--gold))]/8 via-[hsl(var(--cream))] to-[hsl(var(--gold-light))]/15 rounded-2xl p-6 border border-[hsl(var(--gold))]/20 shadow-[var(--shadow-soft-val)]"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-gradient-to-b from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] rounded-full" />
              <h2 className="font-display text-xl font-semibold text-[hsl(var(--forest-deep))] flex items-center gap-2">
                Calm Rating Trend
                <Sparkles className="w-4 h-4 text-[hsl(var(--gold))]" />
              </h2>
            </div>
            <div className="flex items-end gap-1 h-32">
              {ratingData.map((r, i) => (
                <motion.div
                  key={r.day}
                  initial={{ height: 0 }}
                  animate={{ height: `${r.rating * 10}%` }}
                  transition={{ delay: 0.6 + i * 0.02, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-gradient-to-t from-[hsl(var(--gold-dark))] via-[hsl(var(--gold))] to-[hsl(var(--gold-light))] rounded-t-md min-h-[4px]"
                    style={{ height: '100%' }}
                    title={`Day ${r.day}: ${r.rating}/10`}
                  />
                  <span className="text-[9px] font-body text-[hsl(var(--charcoal-soft))]">{r.day}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-gradient-to-br from-[hsl(var(--forest))]/8 via-[hsl(var(--cream))] to-[hsl(var(--sage-light))]/30 rounded-2xl p-6 border border-[hsl(var(--gold))]/15 shadow-[var(--shadow-soft-val)]"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-gradient-to-b from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] rounded-full" />
            <h2 className="font-display text-xl font-semibold text-[hsl(var(--forest-deep))] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[hsl(var(--forest))]" /> 30-Day Overview
            </h2>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-center text-[10px] font-display font-bold text-[hsl(var(--forest))] uppercase tracking-wider py-1">{d}</div>
            ))}
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const isComplete = completed.includes(day);
              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.015 }}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-body font-semibold transition-all ${
                    isComplete
                      ? "bg-gradient-to-br from-[hsl(var(--forest))] to-[hsl(var(--forest-mid))] text-[hsl(var(--cream))] shadow-md ring-1 ring-[hsl(var(--gold))]/30"
                      : "bg-[hsl(var(--sage-light))]/40 text-[hsl(var(--charcoal-soft))] border border-[hsl(var(--sage))]/20"
                  }`}
                  title={`Day ${day}${isComplete ? ' ✓' : ''}`}
                >
                  {day}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-gradient-to-br from-[hsl(var(--cream))] to-[hsl(var(--sage-light))]/30 rounded-2xl p-6 border border-[hsl(var(--gold))]/15 shadow-[var(--shadow-soft-val)]"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] rounded-full" />
            <h2 className="font-display text-xl font-semibold text-[hsl(var(--forest-deep))]">Insights</h2>
          </div>
          <div className="space-y-3">
            {completed.length > 0 && (
              <InsightCard text={`You've meditated for ${totalMins} minutes — that's ${(totalMins / 60).toFixed(1)} hours of mindfulness practice.`} />
            )}
            {streak >= 3 && (
              <InsightCard text={`${streak}-day streak. Consistency is the key to neuroplasticity — your brain is literally rewiring.`} />
            )}
            {ratingData.length >= 5 && (
              <InsightCard text={`Your average calm rating is ${avgRating}/10. Most practitioners see significant improvement by Week 3.`} />
            )}
            {completed.length === 0 && (
              <InsightCard text="Start your first meditation to begin tracking your progress. Every journey begins with a single breath." />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}

function InsightCard({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-[hsl(var(--gold))]/8 via-[hsl(var(--cream))] to-[hsl(var(--sage-light))]/30 border border-[hsl(var(--gold))]/20">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center flex-shrink-0 shadow-sm">
        <Sparkles className="w-4 h-4 text-[hsl(var(--cream))]" />
      </div>
      <p className="text-sm font-body text-[hsl(var(--charcoal))] leading-relaxed pt-1">{text}</p>
    </div>
  );
}

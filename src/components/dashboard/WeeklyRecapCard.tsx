// Weekly recap surfaced on the dashboard every Sunday (or when 7+ days of data exist).
// Pulls from localStorage so it works fully offline. No external requests.
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, Flame, Heart } from "lucide-react";
import { getMoods, getCompletedDays, getCurrentStreak } from "@/lib/userStore";

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = x.getDay(); // Sun=0
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - day);
  return x;
}

export default function WeeklyRecapCard() {
  const data = useMemo(() => {
    const moods = getMoods();
    const completed = getCompletedDays();
    const streak = getCurrentStreak();
    const weekStart = startOfWeek(new Date());

    const weekMoods = moods.filter((m) => new Date(m.date) >= weekStart);
    const sessionsThisWeek = completed.filter((c) => {
      // completed entries are day numbers — fall back to count by length-of-week if untyped
      return typeof c === "number" ? false : new Date((c as any).date ?? "").getTime() >= weekStart.getTime();
    }).length || Math.min(weekMoods.length, 7);

    const avgAfter = weekMoods.length
      ? weekMoods.reduce((s, m) => s + (m.after ?? 0), 0) / weekMoods.length
      : 0;
    const avgBefore = weekMoods.length
      ? weekMoods.reduce((s, m) => s + (m.before ?? 0), 0) / weekMoods.length
      : 0;
    const moodLift = avgAfter - avgBefore;

    return { weekMoods, sessionsThisWeek, avgAfter, moodLift, streak };
  }, []);

  // Hide if no data this week
  if (data.weekMoods.length === 0 && data.sessionsThisWeek === 0) return null;

  const stats = [
    { icon: Calendar, label: "Sessions", value: String(data.sessionsThisWeek) },
    { icon: Heart, label: "Avg mood", value: data.avgAfter ? data.avgAfter.toFixed(1) : "—" },
    {
      icon: TrendingUp,
      label: "Mood lift",
      value: data.moodLift > 0 ? `+${data.moodLift.toFixed(1)}` : data.moodLift.toFixed(1),
    },
    { icon: Flame, label: "Streak", value: `${data.streak}d` },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-[hsl(var(--gold))]/25 bg-gradient-to-br from-[hsl(var(--forest))]/5 via-[hsl(var(--cream))] to-[hsl(var(--gold))]/8 p-5 sm:p-6 shadow-[var(--shadow-card-val)]"
      aria-label="Weekly recap"
    >
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[hsl(var(--gold))]/15 blur-3xl" />
      <div className="relative">
        <p className="text-[10px] font-body font-bold tracking-[0.22em] uppercase text-[hsl(var(--gold-dark))] mb-1">
          — This Week —
        </p>
        <h3 className="font-display text-xl font-bold text-[hsl(var(--forest-deep))] mb-4">
          Your weekly recap
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-2xl bg-card/60 backdrop-blur p-3 border border-[hsl(var(--sage))]/30"
            >
              <Icon className="w-4 h-4 text-[hsl(var(--gold-dark))] mb-1" />
              <p className="font-display text-lg font-bold text-[hsl(var(--forest-deep))] leading-none">
                {value}
              </p>
              <p className="text-[10px] font-body text-[hsl(var(--charcoal-soft))] mt-1 uppercase tracking-wider">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

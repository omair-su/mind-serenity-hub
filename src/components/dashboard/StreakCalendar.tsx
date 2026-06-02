// 14-day streak calendar — a quiet, elegant row of dots showing the last
// two weeks of practice. Today is highlighted in gold.
import { motion } from "framer-motion";
import { getAllDayStates } from "@/lib/userStore";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function getPracticedDateSet(): Set<string> {
  const states = getAllDayStates();
  const set = new Set<string>();
  Object.values(states).forEach((s) => {
    if (s?.completedAt && s.checklist?.every(Boolean)) {
      set.add(s.completedAt.slice(0, 10));
    }
  });
  return set;
}

export default function StreakCalendar() {
  const practiced = getPracticedDateSet();
  let frozen = new Set<string>();
  try {
    frozen = new Set<string>(JSON.parse(localStorage.getItem("wv-streak-freeze-used") || "[]"));
  } catch {}

  const days: { date: Date; iso: string; done: boolean; isFrozen: boolean; isToday: boolean }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({
      date: d,
      iso,
      done: practiced.has(iso),
      isFrozen: frozen.has(iso),
      isToday: i === 0,
    });
  }

  const doneCount = days.filter((d) => d.done).length;

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[hsl(var(--cream-dark))] bg-card p-6 sm:p-7">
      <span className="pointer-events-none absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[hsl(var(--gold)/0.08)] blur-3xl" />

      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[hsl(var(--gold-dark))]">
            Last 14 Days
          </p>
          <h3 className="font-display text-xl text-charcoal mt-1.5">Practice Calendar</h3>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold text-[hsl(var(--forest))] tabular-nums leading-none">
            {doneCount}
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal-soft mt-1">sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => {
          const dayOfWeek = d.date.getDay();
          return (
            <motion.div
              key={d.iso}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.02 * i, duration: 0.3 }}
              className="flex flex-col items-center gap-1.5"
              title={`${d.iso}${d.done ? " — practised" : d.isFrozen ? " — freeze used" : ""}`}
            >
              <span className="text-[9px] font-body tracking-wider uppercase text-charcoal-soft/60">
                {DAY_LABELS[dayOfWeek]}
              </span>
              <span
                className={`relative w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-body font-semibold transition-all
                  ${
                    d.done
                      ? "bg-gradient-to-br from-[hsl(var(--forest))] to-[hsl(var(--sage-dark))] text-cream shadow-[0_2px_8px_hsl(var(--forest)/0.25)]"
                      : d.isFrozen
                        ? "bg-[hsl(var(--gold)/0.15)] text-[hsl(var(--gold-dark))] border border-[hsl(var(--gold)/0.4)]"
                        : "bg-[hsl(var(--sage-light))]/50 text-charcoal-soft/50"
                  }
                  ${d.isToday ? "ring-2 ring-[hsl(var(--gold))] ring-offset-2 ring-offset-card" : ""}
                `}
              >
                {d.date.getDate()}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-[hsl(var(--cream-dark))]">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-body text-charcoal-soft">
          <span className="w-2.5 h-2.5 rounded-md bg-gradient-to-br from-[hsl(var(--forest))] to-[hsl(var(--sage-dark))]" />
          Practised
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-body text-charcoal-soft">
          <span className="w-2.5 h-2.5 rounded-md bg-[hsl(var(--gold)/0.15)] border border-[hsl(var(--gold)/0.4)]" />
          Freeze
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-body text-charcoal-soft">
          <span className="w-2.5 h-2.5 rounded-md ring-2 ring-[hsl(var(--gold))] bg-card" />
          Today
        </span>
      </div>
    </div>
  );
}

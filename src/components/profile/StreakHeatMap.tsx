// 365-day streak heat-map (GitHub-style) for the profile page.
// Reads completion dates from local DayState records (`completedAt` ISO).
// Mobile-friendly: scrolls horizontally if the grid overflows.
import { useMemo } from "react";
import { motion } from "framer-motion";
import { getAllDayStates } from "@/lib/userStore";

const LEVELS = [
  { min: 0, cls: "bg-[hsl(var(--forest))]/8" },
  { min: 1, cls: "bg-[hsl(var(--sage))]/45" },
  { min: 2, cls: "bg-[hsl(var(--sage-dark))]/75" },
  { min: 3, cls: "bg-[hsl(var(--forest))]" },
  { min: 4, cls: "bg-[hsl(var(--forest-deep))]" },
];

function levelFor(count: number): string {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (count >= LEVELS[i].min) return LEVELS[i].cls;
  }
  return LEVELS[0].cls;
}

function buildLast365Dates(): string[] {
  const out: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export default function StreakHeatMap() {
  const { dateCounts, totalActive } = useMemo(() => {
    const states = getAllDayStates();
    const counts: Record<string, number> = {};
    Object.values(states).forEach((s) => {
      if (s?.completedAt && s.checklist?.every(Boolean)) {
        const day = s.completedAt.slice(0, 10);
        counts[day] = (counts[day] || 0) + 1;
      }
    });
    return {
      dateCounts: counts,
      totalActive: Object.keys(counts).length,
    };
  }, []);

  const dates = useMemo(() => buildLast365Dates(), []);
  // Pad so the grid always starts on Sunday (column 0 = Sunday).
  const firstDate = new Date(dates[0]);
  const padCount = firstDate.getDay(); // 0..6
  const cellsWithPad: (string | null)[] = [
    ...Array(padCount).fill(null),
    ...dates,
  ];

  // Group into 7-row columns (week columns)
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cellsWithPad.length; i += 7) {
    weeks.push(cellsWithPad.slice(i, i + 7));
  }

  const monthLabels: { col: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, col) => {
    const firstReal = week.find((d) => d !== null) as string | undefined;
    if (!firstReal) return;
    const m = new Date(firstReal).getMonth();
    if (m !== lastMonth) {
      monthLabels.push({
        col,
        label: new Date(firstReal).toLocaleString(undefined, { month: "short" }),
      });
      lastMonth = m;
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-border bg-card p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            Your year of practice
          </h3>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            {totalActive} active {totalActive === 1 ? "day" : "days"} in the
            last 365.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-body text-muted-foreground">
          Less
          {LEVELS.map((l, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-sm ${l.cls} border border-border/40`}
              aria-hidden
            />
          ))}
          More
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div
          className="inline-grid gap-[3px]"
          style={{
            gridTemplateColumns: `repeat(${weeks.length}, 12px)`,
            gridTemplateRows: "repeat(7, 12px)",
            gridAutoFlow: "column",
          }}
        >
          {weeks.flatMap((week, col) =>
            week.map((date, row) => {
              if (!date)
                return (
                  <div
                    key={`pad-${col}-${row}`}
                    className="w-3 h-3"
                    aria-hidden
                  />
                );
              const count = dateCounts[date] || 0;
              return (
                <div
                  key={date}
                  className={`w-3 h-3 rounded-sm border border-border/30 ${levelFor(count)}`}
                  title={`${date} — ${count} ${count === 1 ? "session" : "sessions"}`}
                />
              );
            }),
          )}
        </div>

        <div
          className="inline-grid mt-1 text-[9px] font-body text-muted-foreground/70"
          style={{ gridTemplateColumns: `repeat(${weeks.length}, 12px)`, gap: "3px" }}
        >
          {weeks.map((_, col) => {
            const m = monthLabels.find((x) => x.col === col);
            return (
              <div key={col} className="h-3">
                {m ? (
                  <span className="whitespace-nowrap" style={{ marginLeft: 0 }}>
                    {m.label}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// Today's Daily Drop card — surfaces the day's auto-selected 5-min session
// on the dashboard with a play CTA. The drop rotates daily and is identical
// for every user on a given calendar day (good for shared rituals + push).
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Sparkles, Clock } from "lucide-react";
import { getTodaysDrop } from "@/data/dailyDrops";

export default function DailyDropCard() {
  const drop = getTodaysDrop();
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="relative overflow-hidden rounded-3xl border border-[hsl(var(--gold))]/25 bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--forest-mid))] p-6 sm:p-7 text-[hsl(var(--cream))]"
    >
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, hsl(var(--gold) / 0.55) 0%, transparent 55%), radial-gradient(circle at 90% 90%, hsl(var(--sage) / 0.35) 0%, transparent 50%)",
        }}
      />
      <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(var(--gold))]/15 border border-[hsl(var(--gold))]/35 text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-[hsl(var(--gold-light))]">
            <Sparkles className="w-3 h-3" /> Daily Drop · {drop.category}
          </div>
          <p className="font-body text-xs text-[hsl(var(--cream))]/70 mt-3">
            {todayLabel}
          </p>
          <h3 className="font-display text-2xl sm:text-3xl font-bold mt-1 leading-tight">
            {drop.title}
          </h3>
          <p className="font-body text-sm text-[hsl(var(--cream))]/85 mt-2 max-w-md">
            {drop.teaser}
          </p>
          <div className="inline-flex items-center gap-1.5 mt-4 px-3 py-1 rounded-full bg-[hsl(var(--cream))]/10 text-[11px] font-body text-[hsl(var(--cream))]/85">
            <Clock className="w-3 h-3" /> {drop.duration}
          </div>
        </div>

        <Link
          to={drop.href}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-body font-bold text-sm shadow-soft hover:scale-105 active:scale-95 transition-transform whitespace-nowrap"
        >
          <Play className="w-4 h-4 fill-current" /> Play today's drop
        </Link>
      </div>
    </motion.div>
  );
}

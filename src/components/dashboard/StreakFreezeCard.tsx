// Compact card showing how many "streak freeze" tokens the user has banked.
// 1 token granted per ISO week, up to 3. Keeps streaks intact when life happens.
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Snowflake, Sparkles } from "lucide-react";
import { ensureWeeklyGrant, getAvailableFreezes, consumePendingGrantToast } from "@/lib/streakFreeze";
import { toast } from "@/hooks/use-toast";

export default function StreakFreezeCard() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    ensureWeeklyGrant();
    setCount(getAvailableFreezes());
    if (consumePendingGrantToast()) {
      toast({
        title: "+1 Streak Freeze",
        description: "A fresh weekly freeze has been added to your inventory.",
      });
    }
  }, []);

  if (count <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative overflow-hidden rounded-2xl border border-[hsl(var(--sage))]/40 bg-gradient-to-br from-[hsl(var(--sage-light))] via-[hsl(var(--cream))] to-[hsl(var(--sage-light))] p-4 shadow-[var(--shadow-soft-val)]"
    >
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[hsl(var(--sage))]/15 blur-[40px]" />
      <div className="relative flex items-center gap-3">
        <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[hsl(var(--sage-dark))] to-[hsl(var(--forest))] flex items-center justify-center flex-shrink-0">
          <Snowflake className="w-5 h-5 text-[hsl(var(--cream))]" />
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[hsl(var(--gold))] text-[10px] font-display font-bold text-white flex items-center justify-center shadow-sm">
            {count}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-body font-bold tracking-[0.2em] uppercase text-[hsl(var(--forest))] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[hsl(var(--gold-dark))]" />
            Streak Freeze
          </p>
          <p className="font-display text-sm font-semibold text-[hsl(var(--forest-deep))] mt-0.5">
            {count === 1 ? "1 freeze banked" : `${count} freezes banked`}
          </p>
          <p className="text-[11px] font-body text-[hsl(var(--charcoal-soft))] leading-snug mt-0.5">
            We protect your streak when life gets in the way. One new freeze each week.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

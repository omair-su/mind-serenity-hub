// Personalized daily framing card. Calls daily-day-framing edge function.
// Caches per (user, day, calendar-day) so it doesn't regenerate on every visit.
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AIDailyInsightProps {
  dayNumber: number;
  practice: string;
  focus: string;
}

function todayKey(dayNumber: number) {
  return `wv-day-frame-${dayNumber}-${new Date().toISOString().split("T")[0]}`;
}

export default function AIDailyInsight({ dayNumber, practice, focus }: AIDailyInsightProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsight = async (force = false) => {
    const cacheKey = todayKey(dayNumber);
    if (!force) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) { setInsight(cached); return; }
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: invokeError } = await supabase.functions.invoke("daily-day-framing", {
        body: { dayNumber, practice, focus },
      });
      if (invokeError) throw new Error(invokeError.message);
      const text = (data?.framing as string | undefined)?.trim();
      if (!text) throw new Error("Empty framing");
      setInsight(text);
      localStorage.setItem(cacheKey, text);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Insight unavailable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsight(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayNumber]);

  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--charcoal))] p-6 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.4)] border border-[hsl(var(--gold))]/25"
    >
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[hsl(var(--gold))]/15 blur-3xl pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--gold))]/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[hsl(var(--gold))]" />
            </div>
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
              Today, for you
            </p>
          </div>
          <button
            onClick={() => fetchInsight(true)}
            disabled={loading}
            className="text-white/40 hover:text-white/80 transition-colors p-1"
            aria-label="Refresh insight"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {loading && !insight && (
          <div className="flex items-center gap-2 text-white/60 py-3">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="font-body text-sm">Reading the rhythm of your week…</span>
          </div>
        )}

        {insight && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-display text-base md:text-lg text-white/95 leading-relaxed italic"
          >
            "{insight}"
          </motion.p>
        )}

        {error && !insight && (
          <p className="font-body text-sm text-white/60">
            Today's reflection is quiet. Trust your intuition — it knows.
          </p>
        )}
      </div>
    </motion.div>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { CloudMoodEntry } from "@/lib/cloudSync";

interface MoodInsightsCardProps {
  entries: CloudMoodEntry[];
}

interface Insight {
  pattern: string;
  triggers: string;
  helping: string;
}

export default function MoodInsightsCard({ entries }: MoodInsightsCardProps) {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (entries.length < 3) return;
    let cancelled = false;
    setLoading(true);
    supabase.functions
      .invoke("ai-mood-insights", { body: { entries: entries.slice(0, 14) } })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error(error);
        if (data?.pattern) setInsight(data);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [entries.length]);

  if (entries.length < 3) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-card to-gold/5 border border-border/50 p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-gold/10"><Brain className="w-4 h-4 text-gold" /></div>
          <h3 className="font-display text-base font-bold text-foreground">AI Mood Insights</h3>
        </div>
        <p className="text-xs font-body text-muted-foreground">Log at least 3 check-ins to unlock personalized weekly insights from your AI coach.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-primary/5 via-card to-gold/5 border border-gold/30 p-5 shadow-soft"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-xl bg-gold/10"><Brain className="w-4 h-4 text-gold" /></div>
        <h3 className="font-display text-base font-bold text-foreground">AI Mood Insights</h3>
        <span className="text-[9px] font-body font-bold text-gold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gold/10">Live</span>
      </div>
      {loading || !insight ? (
        <div className="flex items-center gap-2 text-xs font-body text-muted-foreground py-3">
          <Loader2 className="w-3 h-3 animate-spin" /> Analyzing your last 14 check-ins...
        </div>
      ) : (
        <div className="space-y-3">
          {([
            { label: "Your week pattern", text: insight.pattern, icon: "📊" },
            { label: "Likely triggers", text: insight.triggers, icon: "⚠️" },
            { label: "What's helping", text: insight.helping, icon: "💚" },
          ]).map((item) => (
            <div key={item.label} className="p-3 rounded-xl bg-card/60 border border-border/40">
              <div className="flex items-center gap-1.5 mb-1">
                <span>{item.icon}</span>
                <p className="text-[10px] font-body font-bold text-primary/80 uppercase tracking-wider">{item.label}</p>
              </div>
              <p className="text-sm font-body text-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

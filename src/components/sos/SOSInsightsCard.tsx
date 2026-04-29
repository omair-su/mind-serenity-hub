import { useEffect, useState } from "react";
import { Activity, TrendingDown, Calendar, Sparkles } from "lucide-react";
import { getInsights, getSOSEvents, type SOSInsights } from "@/lib/sosStore";

export default function SOSInsightsCard() {
  const [insights, setInsights] = useState<SOSInsights | null>(null);
  const [recent, setRecent] = useState<number>(0);

  useEffect(() => {
    setInsights(getInsights());
    setRecent(getSOSEvents().length);
  }, []);

  if (!insights || insights.totalUses === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-[hsl(var(--sage))]/15">
            <Activity className="w-4 h-4 text-[hsl(var(--forest))]" />
          </div>
          <h3 className="font-display text-base font-bold text-foreground">Your SOS Patterns</h3>
        </div>
        <p className="text-xs font-body text-muted-foreground">
          Use any tool above and we'll start spotting patterns — what helps you most, when you tend to need support, and gentle suggestions.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-[hsl(var(--cream))]/30 p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-[hsl(var(--sage))]/15">
          <Activity className="w-4 h-4 text-[hsl(var(--forest))]" />
        </div>
        <h3 className="font-display text-base font-bold text-foreground">Your SOS Patterns</h3>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <p className="font-display text-2xl font-bold text-foreground">{insights.totalUses}</p>
          <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">Total uses</p>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <p className="font-display text-2xl font-bold text-foreground">{insights.last7d}</p>
          <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">Last 7 days</p>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <p className="font-display text-2xl font-bold text-foreground">{insights.avgRelief !== null ? `−${insights.avgRelief}` : "—"}</p>
          <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">Avg relief</p>
        </div>
      </div>

      {insights.topToolTitle && (
        <div className="p-3 rounded-xl bg-[hsl(var(--gold))]/8 border border-[hsl(var(--gold))]/20 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-[hsl(var(--gold-dark))] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-body font-bold text-foreground">Most helpful: {insights.topToolTitle}</p>
            {insights.triggerDay && (
              <p className="text-xs font-body text-muted-foreground mt-0.5">
                You reach for SOS most on <span className="font-semibold">{insights.triggerDay}s</span> — consider scheduling a {insights.triggerDay} morning meditation.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

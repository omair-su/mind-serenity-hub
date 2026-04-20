import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import type { CloudMoodEntry } from "@/lib/cloudSync";

interface MoodTrendChartProps {
  entries: CloudMoodEntry[];
}

const EMOTION_SCORE: Record<string, number> = {
  Joy: 9, Trust: 8, Calm: 8, Anticipation: 7,
  Surprise: 6, Sadness: 4, Anxious: 3, Anger: 2,
};

export default function MoodTrendChart({ entries }: MoodTrendChartProps) {
  // Group by date, take last 30 days
  const today = new Date();
  const data: { date: string; mood: number; energy: number; focus: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    const dayEntries = entries.filter((e) => e.created_at.startsWith(ds));
    if (dayEntries.length === 0) {
      data.push({ date: ds.slice(5), mood: 0, energy: 0, focus: 0 });
    } else {
      const avg = (key: keyof typeof dayEntries[0]) =>
        dayEntries.reduce((s, e) => s + (Number(e[key]) || 0), 0) / dayEntries.length;
      const avgMood = dayEntries.reduce((s, e) => s + (EMOTION_SCORE[e.emotion_primary] ?? 5), 0) / dayEntries.length;
      data.push({
        date: ds.slice(5),
        mood: Number(avgMood.toFixed(1)),
        energy: Number(avg("energy").toFixed(1)),
        focus: Number(avg("focus").toFixed(1)),
      });
    }
  }

  return (
    <div className="rounded-2xl bg-card border border-border/50 p-5 shadow-soft">
      <h3 className="font-display text-base font-bold text-foreground mb-1">30-Day Trend</h3>
      <p className="text-xs font-body text-muted-foreground mb-4">Mood, energy & focus over the past month</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--gold))" stopOpacity={0.6} />
                <stop offset="100%" stopColor="hsl(var(--gold))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={5} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
            />
            <Area type="monotone" dataKey="mood" stroke="hsl(var(--gold))" strokeWidth={2.5} fill="url(#moodGrad)" />
            <Line type="monotone" dataKey="energy" stroke="hsl(var(--primary))" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="focus" stroke="hsl(160, 40%, 50%)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-4 mt-3 text-[10px] font-body">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gold" />Mood</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" />Energy</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(160, 40%, 50%)" }} />Focus</span>
      </div>
    </div>
  );
}

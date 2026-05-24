import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Sparkles } from "lucide-react";
import MoodWheel, { EMOTION_WHEEL } from "@/components/mood/MoodWheel";
import MoodTrendChart from "@/components/mood/MoodTrendChart";
import MoodInsightsCard from "@/components/mood/MoodInsightsCard";
import PremiumLockModal from "@/components/PremiumLockModal";
import { PageHero, LuxeCard, EmptyState } from "@/components/ui-premium";
import { fetchMoodEntries, saveMoodEntry, type CloudMoodEntry } from "@/lib/cloudSync";

const HERO = "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&q=80&w=1600";

export default function MoodTrackerPage() {
  const [entries, setEntries] = useState<CloudMoodEntry[]>([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [primary, setPrimary] = useState<string | null>(null);
  const [secondary, setSecondary] = useState<string | null>(null);
  const [energy, setEnergy] = useState([5]);
  const [focus, setFocus] = useState([5]);
  const [note, setNote] = useState("");
  const [premiumOpen, setPremiumOpen] = useState(false);

  useEffect(() => {
    fetchMoodEntries().then(setEntries);
  }, []);

  const submitMood = async () => {
    if (!primary) return;
    const saved = await saveMoodEntry({
      emotion_primary: primary,
      emotion_secondary: secondary ?? undefined,
      energy: energy[0],
      focus: focus[0],
      note: note.trim() || undefined,
    });
    if (saved) setEntries([saved as CloudMoodEntry, ...entries]);
    setShowCheckIn(false);
    setPrimary(null); setSecondary(null); setEnergy([5]); setFocus([5]); setNote("");
  };

  const recentAvg = entries.slice(0, 7).length;

  return (
    <AppLayout>
      <PremiumLockModal
        open={premiumOpen}
        onClose={() => setPremiumOpen(false)}
        feature="Emotional Health Report"
        description="Monthly PDF report with charts, AI narrative, and personalized recommendations from your coach."
      />
      <motion.div className="space-y-6 pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Hero */}
        <PageHero
          eyebrow="Emotional Intelligence"
          title="Mood Tracker"
          description={`${entries.length} check-ins logged · ${recentAvg} this week. Tune in to the weather of your heart.`}
          image={HERO}
          height="sm"
          overlay="forest"
          cta={
            <button
              onClick={() => setShowCheckIn(true)}
              className="px-7 py-3 btn-gold-primary rounded-xl text-sm inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              New Check-In
            </button>
          }
        />

        {/* Check-in form */}
        {showCheckIn && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border-2 border-gold/25 p-5 shadow-elevated space-y-5"
          >
            <h2 className="font-display text-lg font-bold text-foreground">How do you feel right now?</h2>

            <MoodWheel primary={primary} secondary={secondary} onPrimary={setPrimary} onSecondary={setSecondary} />

            <div>
              <p className="text-xs font-body font-semibold text-foreground/80 mb-2 uppercase tracking-wider">Energy: {energy[0]}/10</p>
              <Slider value={energy} onValueChange={setEnergy} min={1} max={10} />
            </div>
            <div>
              <p className="text-xs font-body font-semibold text-foreground/80 mb-2 uppercase tracking-wider">Focus: {focus[0]}/10</p>
              <Slider value={focus} onValueChange={setFocus} min={1} max={10} />
            </div>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything on your mind?" className="font-body text-sm" />

            <div className="flex gap-2">
              <button
                onClick={submitMood}
                disabled={!primary}
                className="flex-1 py-3 bg-gradient-to-r from-gold to-gold-dark text-cream rounded-xl text-sm font-body font-semibold disabled:opacity-50"
              >
                Save Check-In
              </button>
              <button onClick={() => setShowCheckIn(false)} className="px-4 py-3 bg-secondary rounded-xl text-sm font-body text-muted-foreground">
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* AI Insights */}
        <MoodInsightsCard entries={entries} />

        {/* Trend chart */}
        <MoodTrendChart entries={entries} />

        {/* Premium hook */}
        <button
          onClick={() => setPremiumOpen(true)}
          className="w-full text-left rounded-2xl p-5 bg-gradient-to-br from-[hsl(var(--gold-light)/0.4)] via-cream to-[hsl(var(--cream))] border border-[hsl(var(--gold)/0.4)] flex items-center gap-3 hover:shadow-[var(--shadow-gold-val)] hover:-translate-y-0.5 transition-all"
        >
          <div className="p-3 rounded-xl bg-[hsl(var(--gold)/0.2)]">
            <Lock className="w-4 h-4 text-[hsl(var(--gold-dark))]" />
          </div>
          <div className="flex-1">
            <p className="font-display text-sm font-bold text-charcoal">Monthly Emotional Health Report</p>
            <p className="text-xs font-body text-charcoal-soft mt-0.5">
              PDF with charts, AI narrative & recommendations
            </p>
          </div>
          <span className="text-[10px] font-body font-bold text-[hsl(var(--gold-dark))] uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[hsl(var(--gold)/0.15)]">
            Plus
          </span>
        </button>

        {/* Recent */}
        {entries.length > 0 ? (
          <LuxeCard variant="default" padded>
            <h3 className="font-display text-lg font-bold text-charcoal mb-4">Recent Check-Ins</h3>
            <div className="space-y-2">
              {entries.slice(0, 6).map((m) => {
                const slice = EMOTION_WHEEL.find((s) => s.primary === m.emotion_primary);
                const dayMatch = m.note?.match(/^Day (\d+)/);
                const dayNum = dayMatch ? parseInt(dayMatch[1]) : null;
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--sage-light)/0.5)] hover:bg-[hsl(var(--sage-light))] transition-colors"
                  >
                    <span className="text-2xl">{slice?.emoji ?? "💭"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-body font-semibold text-charcoal capitalize">
                          {m.emotion_primary}
                          {m.emotion_secondary ? ` · ${m.emotion_secondary}` : ""}
                        </p>
                        {dayNum && (
                          <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[hsl(var(--gold)/0.2)] text-[hsl(var(--gold-dark))]">
                            Day {dayNum}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-body text-charcoal-soft mt-0.5">
                        {new Date(m.created_at).toLocaleDateString()} · ⚡{m.energy ?? "—"} · 🎯{m.focus ?? "—"}
                      </p>
                    </div>
                    {m.note && !dayNum && (
                      <p className="text-[10px] font-body text-charcoal-soft max-w-[120px] truncate italic">
                        "{m.note}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </LuxeCard>
        ) : (
          <EmptyState
            title="Your first check-in awaits"
            description="Tap 'New Check-In' above to log how you're feeling. Each entry adds to your emotional weather pattern."
          />
        )}
      </motion.div>
    </AppLayout>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Lock } from "lucide-react";
import MoodWheel, { EMOTION_WHEEL } from "@/components/mood/MoodWheel";
import MoodTrendChart from "@/components/mood/MoodTrendChart";
import MoodInsightsCard from "@/components/mood/MoodInsightsCard";
import PremiumLockModal from "@/components/PremiumLockModal";
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
        <div className="relative rounded-3xl overflow-hidden h-44 shadow-elevated">
          <img src={HERO} alt="Aurora dawn" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md"><Heart className="w-4 h-4" /></div>
              <span className="text-[10px] font-body font-bold uppercase tracking-widest text-white/80">Emotional Intelligence</span>
            </div>
            <h1 className="font-display text-2xl font-bold drop-shadow-lg">Mood Tracker</h1>
            <p className="text-xs font-body text-white/80 mt-0.5">{entries.length} check-ins · {recentAvg} this week</p>
          </div>
          <button
            onClick={() => setShowCheckIn(true)}
            className="absolute top-4 right-4 px-4 py-2 bg-gold text-white rounded-xl text-xs font-body font-bold shadow-lg hover:bg-gold-dark"
          >
            + Check In
          </button>
        </div>

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
                className="flex-1 py-3 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl text-sm font-body font-semibold disabled:opacity-50"
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
          className="w-full text-left rounded-2xl p-4 bg-gradient-to-br from-gold/10 via-card to-primary/5 border border-gold/30 flex items-center gap-3 hover:shadow-soft transition-all"
        >
          <div className="p-2.5 rounded-xl bg-gold/15"><Lock className="w-4 h-4 text-gold" /></div>
          <div className="flex-1">
            <p className="font-display text-sm font-bold text-foreground">Monthly Emotional Health Report</p>
            <p className="text-[10px] font-body text-muted-foreground">PDF with charts, AI narrative & recommendations</p>
          </div>
          <span className="text-[10px] font-body font-bold text-gold uppercase tracking-widest">Plus</span>
        </button>

        {/* Recent */}
        {entries.length > 0 && (
          <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
            <h3 className="font-display text-base font-bold text-foreground mb-3">Recent Check-Ins</h3>
            <div className="space-y-2">
              {entries.slice(0, 6).map((m) => {
                const slice = EMOTION_WHEEL.find((s) => s.primary === m.emotion_primary);
                return (
                  <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                    <span className="text-2xl">{slice?.emoji ?? "💭"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-semibold text-foreground capitalize">
                        {m.emotion_primary}{m.emotion_secondary ? ` · ${m.emotion_secondary}` : ""}
                      </p>
                      <p className="text-[10px] font-body text-muted-foreground">
                        {new Date(m.created_at).toLocaleDateString()} · ⚡{m.energy ?? "—"} · 🎯{m.focus ?? "—"}
                      </p>
                    </div>
                    {m.note && <p className="text-[10px] font-body text-muted-foreground max-w-[120px] truncate italic">"{m.note}"</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}

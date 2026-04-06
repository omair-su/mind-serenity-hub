import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { getMoods, saveMood, MoodEntry } from "@/lib/userStore";
import { Calendar, Heart } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

const moodEmojis = [
  { emoji: "😰", label: "Very Stressed", value: 1 },
  { emoji: "😟", label: "Stressed", value: 2 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "🙂", label: "Calm", value: 4 },
  { emoji: "😌", label: "Very Calm", value: 5 },
];

const statGradients = [
  "from-violet-500/12 to-purple-500/5",
  "from-emerald-500/12 to-teal-500/5",
  "from-amber-500/12 to-gold/5",
];

export default function MoodTrackerPage() {
  const [moods] = useState<MoodEntry[]>(getMoods());
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [before, setBefore] = useState(3);
  const [after, setAfter] = useState(3);
  const [energy, setEnergy] = useState([5]);
  const [focus, setFocus] = useState([5]);
  const [note, setNote] = useState("");

  const submitMood = () => {
    saveMood({
      date: new Date().toISOString(),
      dayNum: 0,
      before,
      after,
      energy: energy[0],
      focus: focus[0],
      note,
    });
    setShowCheckIn(false);
    setBefore(3);
    setAfter(3);
    setNote("");
    window.location.reload();
  };

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), 1).getDay();

  const moodsByDate: Record<string, MoodEntry> = {};
  moods.forEach(m => {
    const dateKey = m.date.split('T')[0];
    moodsByDate[dateKey] = m;
  });

  const avgMood = moods.length > 0 ? (moods.reduce((s, m) => s + m.after, 0) / moods.length).toFixed(1) : "—";
  const avgImprovement = moods.length > 0 ? (moods.reduce((s, m) => s + (m.after - m.before), 0) / moods.length).toFixed(1) : "—";

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/15 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Mood Tracker</h1>
              <p className="text-sm font-body text-muted-foreground">{moods.length} check-ins recorded</p>
            </div>
          </div>
          <button onClick={() => setShowCheckIn(true)} className="px-5 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl text-sm font-body font-semibold shadow-gold hover:shadow-lg transition-all">
            + Check In
          </button>
        </div>

        {showCheckIn && (
          <div className="bg-gradient-to-br from-gold/5 via-card to-rose-500/5 rounded-2xl border-2 border-gold/25 p-6 shadow-elevated">
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">How do you feel?</h2>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-body font-medium text-foreground mb-3">Before meditation</p>
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {moodEmojis.map(m => (
                    <button key={m.value} onClick={() => setBefore(m.value)}
                      className={`p-2 sm:p-3 rounded-xl text-center transition-all min-w-0 ${
                        before === m.value ? "bg-gradient-to-br from-primary/15 to-sage/20 ring-2 ring-primary scale-105 shadow-sm" : "bg-secondary/60 hover:bg-secondary"
                      }`}>
                      <span className="text-xl sm:text-2xl">{m.emoji}</span>
                      <p className="text-[9px] sm:text-[10px] font-body text-muted-foreground mt-1 truncate">{m.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-body font-medium text-foreground mb-3">After meditation</p>
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {moodEmojis.map(m => (
                    <button key={m.value} onClick={() => setAfter(m.value)}
                      className={`p-2 sm:p-3 rounded-xl text-center transition-all min-w-0 ${
                        after === m.value ? "bg-gradient-to-br from-primary/15 to-sage/20 ring-2 ring-primary scale-105 shadow-sm" : "bg-secondary/60 hover:bg-secondary"
                      }`}>
                      <span className="text-xl sm:text-2xl">{m.emoji}</span>
                      <p className="text-[9px] sm:text-[10px] font-body text-muted-foreground mt-1 truncate">{m.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-body font-medium text-foreground mb-2">Energy Level: {energy[0]}/10</p>
                <Slider value={energy} onValueChange={setEnergy} min={1} max={10} />
              </div>

              <div>
                <p className="text-sm font-body font-medium text-foreground mb-2">Focus Level: {focus[0]}/10</p>
                <Slider value={focus} onValueChange={setFocus} min={1} max={10} />
              </div>

              <div>
                <p className="text-sm font-body font-medium text-foreground mb-2">Notes (optional)</p>
                <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="How are you feeling today?" className="font-body" />
              </div>

              <div className="flex gap-3">
                <button onClick={submitMood} className="flex-1 py-3 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl text-sm font-body font-semibold shadow-gold hover:shadow-lg transition-all">Save Check-In</button>
                <button onClick={() => setShowCheckIn(false)} className="px-4 py-3 bg-secondary rounded-xl text-sm font-body text-muted-foreground hover:bg-secondary/80 transition-all">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Avg Mood (After)", value: avgMood, icon: "😌" },
            { label: "Avg Improvement", value: `+${avgImprovement}`, icon: "📈" },
            { label: "Total Check-Ins", value: moods.length.toString(), icon: "📊" },
          ].map((stat, i) => (
            <div key={stat.label} className={`relative overflow-hidden bg-gradient-to-br ${statGradients[i]} rounded-2xl p-5 border border-border/50 shadow-soft text-center`}>
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-bl from-card/20 to-transparent" />
              <span className="text-2xl">{stat.icon}</span>
              <p className="font-display text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              <p className="text-xs font-body text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-2xl border border-border/50 p-6 shadow-soft">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-center text-xs font-body text-muted-foreground font-medium py-1">{d}</div>
            ))}
            {Array.from({ length: firstDayOfWeek }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
              const mood = moodsByDate[dateStr];
              return (
                <div key={day} className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                  mood ? "bg-gradient-to-br from-primary/15 to-sage/20 shadow-sm" : day === now.getDate() ? "bg-gradient-to-br from-gold/15 to-amber-500/10 ring-1 ring-gold/30" : "bg-secondary/40"
                }`} title={mood ? `Mood: ${mood.after}/5` : ''}>
                  {mood ? moodEmojis.find(m => m.value === mood.after)?.emoji || day : day}
                </div>
              );
            })}
          </div>
        </div>

        {moods.length > 0 && (
          <div className="bg-gradient-to-br from-rose-500/5 to-pink-500/5 rounded-2xl border border-border/50 p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Recent Check-Ins</h2>
            <div className="space-y-3">
              {moods.slice(-5).reverse().map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/30 hover:shadow-sm transition-all">
                  <span className="text-2xl">{moodEmojis.find(e => e.value === m.after)?.emoji || "😐"}</span>
                  <div className="flex-1">
                    <p className="text-sm font-body text-foreground">
                      {moodEmojis.find(e => e.value === m.before)?.label} → {moodEmojis.find(e => e.value === m.after)?.label}
                    </p>
                    <p className="text-xs font-body text-muted-foreground">{new Date(m.date).toLocaleDateString()}</p>
                  </div>
                  {m.note && <p className="text-xs font-body text-muted-foreground max-w-[200px] truncate">{m.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

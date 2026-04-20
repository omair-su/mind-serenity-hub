import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flower2, Sparkles, Sun, Star, Plus, BookOpen, Leaf, Heart } from "lucide-react";
import LivingGarden from "@/components/gratitude/LivingGarden";
import AICoachReflection from "@/components/gratitude/AICoachReflection";
import GratitudeLetter from "@/components/gratitude/GratitudeLetter";
import AmbientMusicPlayer from "@/components/AmbientMusicPlayer";
import { fetchGratitudeEntries, saveGratitudeEntry, type CloudGratitudeEntry } from "@/lib/cloudSync";
import { pickTrackByMood } from "@/lib/realAmbientTracks";
import { supabase } from "@/integrations/supabase/client";

const HERO_IMAGE = "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=1600";

const categories = [
  { id: "people", label: "People", emoji: "👥" },
  { id: "health", label: "Health", emoji: "💪" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "moments", label: "Moments", emoji: "✨" },
  { id: "growth", label: "Growth", emoji: "📈" },
  { id: "comfort", label: "Comfort", emoji: "🏠" },
];

const guidedPrompts = [
  { prompt: "Name one person who made your day better today — and what they did.", category: "people" },
  { prompt: "What is one physical ability you used today that you usually take for granted?", category: "health" },
  { prompt: "Describe a moment of natural beauty you noticed today — even something small.", category: "nature" },
  { prompt: "What small moment today brought you unexpected joy or comfort?", category: "moments" },
  { prompt: "What challenge or struggle has taught you something valuable recently?", category: "growth" },
];

export default function GratitudePage() {
  const [entries, setEntries] = useState<CloudGratitudeEntry[]>([]);
  const [text, setText] = useState("");
  const [promptIdx] = useState(Math.floor(Math.random() * guidedPrompts.length));
  const [showInput, setShowInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [reflection, setReflection] = useState<string | null>(null);
  const [reflectLoading, setReflectLoading] = useState(false);
  const [showAmbient, setShowAmbient] = useState(false);

  const currentPrompt = guidedPrompts[promptIdx];

  useEffect(() => {
    fetchGratitudeEntries().then(setEntries);
  }, []);

  const todayKey = new Date().toISOString().split("T")[0];
  const todayCount = entries.filter((e) => e.created_at.startsWith(todayKey)).length;

  const streak = (() => {
    let s = 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      if (entries.some((e) => e.created_at.startsWith(ds))) s++;
      else if (i > 0) break;
    }
    return s;
  })();

  const reflectWithAI = async () => {
    if (!text.trim()) return;
    setReflectLoading(true); setReflection(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-gratitude-reflect", {
        body: { text: text.trim(), category: selectedCategory ?? currentPrompt.category },
      });
      if (error) throw error;
      setReflection(data?.reflection ?? null);
    } catch (e) { console.error(e); }
    finally { setReflectLoading(false); }
  };

  const addEntry = async () => {
    if (!text.trim()) return;
    const cat = selectedCategory ?? currentPrompt.category;
    const saved = await saveGratitudeEntry({
      text: text.trim(),
      category: cat,
      ai_reflection: reflection ?? undefined,
    });
    if (saved) setEntries([saved as CloudGratitudeEntry, ...entries]);
    else setEntries([{ id: Date.now().toString(), text: text.trim(), category: cat, ai_reflection: reflection, voice_url: null, created_at: new Date().toISOString() }, ...entries]);
    setText(""); setShowInput(false); setSelectedCategory(null); setReflection(null);
  };

  return (
    <AppLayout>
      <motion.div className="space-y-6 pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Hero with real image */}
        <div className="relative rounded-3xl overflow-hidden h-56 shadow-elevated">
          <img src={HERO_IMAGE} alt="Sunlit garden" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute top-4 right-6 w-24 h-24 rounded-full bg-gold/40 blur-2xl" />
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md"><Flower2 className="w-4 h-4" /></div>
              <span className="text-[10px] font-body font-bold uppercase tracking-widest text-white/80">Daily Practice</span>
            </div>
            <h1 className="font-display text-3xl font-bold drop-shadow-lg">Gratitude Garden</h1>
            <p className="text-xs font-body text-white/80 mt-1">Plant a seed each day. Watch your inner garden bloom.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Seeds", value: entries.length, icon: Leaf },
            { label: "Today", value: todayCount, icon: Sun },
            { label: "Streak", value: `${streak}d`, icon: Star },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card border border-border p-4 text-center shadow-soft">
              <s.icon className="w-5 h-5 mx-auto mb-1 text-primary/70" />
              <div className="text-xl font-display font-bold text-foreground">{s.value}</div>
              <div className="text-[10px] font-body uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Living Garden visualization */}
        <LivingGarden count={entries.length} />

        {/* Guided Prompt */}
        <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gold/10 flex-shrink-0"><Sparkles className="w-4 h-4 text-gold" /></div>
            <div className="flex-1">
              <p className="text-[10px] font-body text-gold font-bold uppercase tracking-widest mb-1">Today's Prompt</p>
              <p className="text-sm font-body font-medium text-foreground leading-relaxed">{currentPrompt.prompt}</p>
            </div>
          </div>
        </div>

        {/* Ambient toggle */}
        <button
          onClick={() => setShowAmbient((s) => !s)}
          className="w-full text-xs font-body text-muted-foreground hover:text-foreground py-1"
        >
          {showAmbient ? "Hide" : "🎵 Add"} ambient sounds while writing
        </button>
        {showAmbient && <AmbientMusicPlayer defaultTrack={pickTrackByMood("nature")} />}

        {/* Categories */}
        {showInput && (
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-body px-3 py-1.5 rounded-full border transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        {showInput ? (
          <div className="rounded-2xl bg-card border border-border p-5 space-y-3 shadow-soft">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="I'm grateful for..."
              className="min-h-[100px] border-border focus:ring-primary/30 font-body"
            />
            <AICoachReflection reflection={reflection} loading={reflectLoading} />
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={reflectWithAI}
                disabled={!text.trim() || reflectLoading}
                variant="outline"
                className="font-body text-xs flex-1"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-gold" /> Reflect with AI
              </Button>
              <Button onClick={addEntry} disabled={!text.trim()} className="flex-1 btn-gold text-sm font-body">
                <Flower2 className="w-4 h-4 mr-2" /> Plant Seed
              </Button>
              <Button variant="ghost" onClick={() => { setShowInput(false); setReflection(null); }} className="font-body text-xs">Cancel</Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setShowInput(true)} className="w-full btn-gold shadow-gold h-12 font-body">
            <Plus className="w-5 h-5 mr-2" /> Add Gratitude
          </Button>
        )}

        {/* Weekly AI Letter */}
        <GratitudeLetter entries={entries} />

        {/* Recent */}
        {entries.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary/60" /> Recent Gratitude
            </h3>
            {entries.slice(0, 8).map((entry) => (
              <div key={entry.id} className="rounded-xl bg-card border border-border p-4 shadow-soft">
                <p className="text-sm font-body text-foreground leading-relaxed">{entry.text}</p>
                {entry.ai_reflection && (
                  <p className="text-xs font-body text-gold/90 mt-2 italic border-l-2 border-gold/40 pl-2">
                    ✦ {entry.ai_reflection}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-[10px] font-body text-muted-foreground">{new Date(entry.created_at).toLocaleDateString()}</p>
                  {entry.category && (
                    <span className="text-[10px] font-body px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      {categories.find((c) => c.id === entry.category)?.emoji} {entry.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-start gap-2 p-3 rounded-xl bg-secondary/30 border border-border/50">
          <BookOpen className="w-4 h-4 text-primary/60 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] font-body text-muted-foreground leading-relaxed">
            Research shows 21 days of gratitude journaling rewires your brain's negativity bias. Keep planting.
          </p>
        </div>
      </motion.div>
    </AppLayout>
  );
}

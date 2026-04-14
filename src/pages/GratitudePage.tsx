import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flower2, Sparkles, Sun, Heart, TreePine, Leaf, Star, Plus, BookOpen } from "lucide-react";

interface GratitudeEntry {
  id: string;
  text: string;
  date: string;
  emoji: string;
  category: string;
}

const gardenEmojis = ["🌸", "🌻", "🌺", "🌷", "🌹", "💐", "🌼", "🌿", "🍀", "🌱", "🌳", "🌲", "🪻", "🪷", "🌾", "🍃"];

const categories = [
  { id: "people", label: "People", emoji: "👥" },
  { id: "health", label: "Health", emoji: "💪" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "moments", label: "Moments", emoji: "✨" },
  { id: "growth", label: "Growth", emoji: "📈" },
  { id: "comfort", label: "Comfort", emoji: "🏠" },
];

const guidedPrompts = [
  { prompt: "Name one person who made your day better today — and what they did.", category: "people", science: "Expressing gratitude for specific people strengthens social bonds and releases oxytocin, the bonding hormone." },
  { prompt: "What is one physical ability you used today that you usually take for granted?", category: "health", science: "Health gratitude is linked to better sleep quality and reduced inflammatory biomarkers (Jackowska et al., 2016)." },
  { prompt: "Describe a moment of natural beauty you noticed today — even something small.", category: "nature", science: "Nature-focused gratitude activates the parasympathetic nervous system and reduces cortisol within minutes." },
  { prompt: "What small moment today brought you unexpected joy or comfort?", category: "moments", science: "Savouring micro-moments of positivity rewires the brain's negativity bias over time (Rick Hanson, Hardwiring Happiness)." },
  { prompt: "What challenge or struggle has taught you something valuable recently?", category: "growth", science: "Gratitude for difficulties — 'benefit finding' — is one of the strongest predictors of post-traumatic growth." },
  { prompt: "What everyday comfort do you have that billions of people in the world do not?", category: "comfort", science: "Perspective-taking gratitude reduces materialism and increases life satisfaction by up to 25% (Emmons & McCullough, 2003)." },
  { prompt: "Who in your life do you rarely thank, but probably should?", category: "people", science: "Writing an unsent gratitude letter produces measurable increases in happiness lasting up to 3 months." },
  { prompt: "What skill or knowledge do you have today that you didn't have a year ago?", category: "growth", science: "Progress awareness — recognising growth — is the single most motivating force in creative work (Amabile & Kramer)." },
];

function getEntries(): GratitudeEntry[] {
  try {
    const raw = localStorage.getItem("wv-gratitude");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveEntries(entries: GratitudeEntry[]) {
  localStorage.setItem("wv-gratitude", JSON.stringify(entries));
}

export default function GratitudePage() {
  const [entries, setEntries] = useState<GratitudeEntry[]>(getEntries());
  const [text, setText] = useState("");
  const [promptIdx, setPromptIdx] = useState(Math.floor(Math.random() * guidedPrompts.length));
  const [showInput, setShowInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const currentPrompt = guidedPrompts[promptIdx];
  const todayEntries = entries.filter(e => e.date === new Date().toISOString().split("T")[0]);

  const streak = (() => {
    let s = 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      if (entries.some(e => e.date === ds)) s++; else if (i > 0) break;
    }
    return s;
  })();

  const addEntry = () => {
    if (!text.trim()) return;
    const entry: GratitudeEntry = {
      id: Date.now().toString(),
      text: text.trim(),
      date: new Date().toISOString().split("T")[0],
      emoji: gardenEmojis[entries.length % gardenEmojis.length],
      category: selectedCategory || currentPrompt.category,
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    saveEntries(updated);
    setText("");
    setShowInput(false);
    setSelectedCategory(null);
    setPromptIdx(Math.floor(Math.random() * guidedPrompts.length));
  };

  const gardenItems = entries.slice(0, 48);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[hsl(145,25%,28%)] via-[hsl(150,20%,35%)] to-[hsl(160,18%,30%)] p-6 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-6 right-10 w-28 h-28 rounded-full bg-[hsl(36,50%,60%)]/30 blur-2xl" />
            <div className="absolute bottom-4 left-6 w-20 h-20 rounded-full bg-[hsl(145,30%,50%)]/30 blur-xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-white/15 backdrop-blur-sm"><Flower2 className="w-5 h-5" /></div>
              <span className="text-xs font-body font-semibold uppercase tracking-wider text-white/70">Daily Practice</span>
            </div>
            <h1 className="font-display text-2xl font-bold mb-1">Gratitude Garden</h1>
            <p className="text-sm font-body text-white/70">Plant a seed of gratitude each day. Research shows 21 days of gratitude journaling rewires your brain for positivity.</p>
          </div>
        </div>

        {/* Stats — muted card style */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Seeds", value: entries.length, icon: Leaf },
            { label: "Today", value: todayEntries.length, icon: Sun },
            { label: "Streak", value: `${streak}d`, icon: Star },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-card border border-border p-4 text-center shadow-soft">
              <s.icon className="w-5 h-5 mx-auto mb-1 text-primary/70" />
              <div className="text-xl font-display font-bold text-foreground">{s.value}</div>
              <div className="text-[10px] font-body uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Guided Prompt Card */}
        <div className="rounded-xl bg-card border border-border p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gold/10 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-gold" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-body text-gold font-semibold uppercase tracking-wider mb-1">Today's Guided Prompt</p>
              <p className="text-sm font-body font-medium text-foreground leading-relaxed">{currentPrompt.prompt}</p>
              <div className="mt-3 p-3 rounded-lg bg-secondary/40 border border-border">
                <div className="flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-3 h-3 text-primary/60" />
                  <span className="text-[10px] font-body font-semibold text-primary/70 uppercase tracking-wider">Why This Works</span>
                </div>
                <p className="text-xs font-body text-muted-foreground leading-relaxed">{currentPrompt.science}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Selector */}
        {showInput && (
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
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
          <div className="rounded-xl bg-card border border-border p-5 space-y-3 shadow-soft">
            <Textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="I'm grateful for..."
              className="min-h-[100px] border-border focus:ring-primary/30 font-body"
            />
            <div className="flex gap-2">
              <Button onClick={addEntry} className="flex-1 btn-gold text-sm font-body">
                <Flower2 className="w-4 h-4 mr-2" /> Plant Seed
              </Button>
              <Button variant="outline" onClick={() => setShowInput(false)} className="font-body">Cancel</Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setShowInput(true)} className="w-full btn-gold shadow-gold h-12 font-body">
            <Plus className="w-5 h-5 mr-2" /> Add Gratitude
          </Button>
        )}

        {/* Garden Visualization */}
        <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
          <h3 className="font-display font-bold text-sm text-foreground mb-3 flex items-center gap-2">
            <TreePine className="w-4 h-4 text-primary/70" /> Your Garden ({gardenItems.length} flowers)
          </h3>
          {gardenItems.length === 0 ? (
            <p className="text-center text-sm font-body text-muted-foreground py-8">Plant your first seed of gratitude to start growing your garden 🌱</p>
          ) : (
            <div className="grid grid-cols-8 gap-1.5">
              {gardenItems.map((item) => (
                <div
                  key={item.id}
                  className="aspect-square rounded-lg bg-secondary/40 flex items-center justify-center text-lg hover:scale-125 transition-transform cursor-default"
                  title={item.text}
                >
                  {item.emoji}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Entries */}
        {entries.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary/60" /> Recent Gratitude
            </h3>
            {entries.slice(0, 10).map(entry => (
              <div key={entry.id} className="rounded-xl bg-card border border-border p-4 shadow-soft">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{entry.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-body text-foreground leading-relaxed">{entry.text}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <p className="text-[10px] font-body text-muted-foreground">{entry.date}</p>
                      {entry.category && (
                        <span className="text-[10px] font-body px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {categories.find(c => c.id === entry.category)?.emoji} {entry.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

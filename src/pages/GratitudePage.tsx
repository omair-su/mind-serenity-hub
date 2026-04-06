import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flower2, Sparkles, Sun, Heart, TreePine, Leaf, Star, Plus } from "lucide-react";

interface GratitudeEntry {
  id: string;
  text: string;
  date: string;
  emoji: string;
}

const gardenEmojis = ["🌸", "🌻", "🌺", "🌷", "🌹", "💐", "🌼", "🌿", "🍀", "🌱", "🌳", "🌲", "🪻", "🪷", "🌾", "🍃"];
const prompts = [
  "What made you smile today?",
  "Who are you grateful for right now?",
  "What small moment brought you joy?",
  "What ability or skill are you thankful for?",
  "What challenge taught you something valuable?",
  "What comfort do you often take for granted?",
  "What beauty did you notice in nature today?",
  "What relationship enriches your life?",
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
  const [prompt, setPrompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);
  const [showInput, setShowInput] = useState(false);

  const todayEntries = entries.filter(e => e.date === new Date().toISOString().split("T")[0]);
  const streak = (() => {
    let s = 0;
    const today = new Date(); today.setHours(0,0,0,0);
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
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    saveEntries(updated);
    setText("");
    setShowInput(false);
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  // Garden grid: show flowers for each entry (max 48)
  const gardenItems = entries.slice(0, 48);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-6 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-6 right-10 w-28 h-28 rounded-full bg-yellow-300/40 blur-2xl" />
            <div className="absolute bottom-4 left-6 w-20 h-20 rounded-full bg-emerald-300/40 blur-xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm"><Flower2 className="w-5 h-5" /></div>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Daily Practice</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Gratitude Garden</h1>
            <p className="text-sm text-white/80">Plant a seed of gratitude each day and watch your garden bloom.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Seeds", value: entries.length, icon: Leaf, gradient: "from-emerald-500 to-green-600" },
            { label: "Today", value: todayEntries.length, icon: Sun, gradient: "from-amber-500 to-orange-600" },
            { label: "Streak", value: `${streak}d`, icon: Star, gradient: "from-rose-500 to-pink-600" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl bg-gradient-to-br ${s.gradient} p-4 text-white text-center`}>
              <s.icon className="w-5 h-5 mx-auto mb-1 opacity-80" />
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-[10px] uppercase tracking-wider opacity-70">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Prompt Card */}
        <div className="rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50 p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider mb-1">Today's Prompt</p>
              <p className="text-sm font-medium text-amber-900">{prompt}</p>
            </div>
          </div>
        </div>

        {/* Input */}
        {showInput ? (
          <div className="rounded-xl bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-200/50 p-5 space-y-3">
            <Textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="I'm grateful for..."
              className="min-h-[80px] border-emerald-200 focus:ring-emerald-400"
            />
            <div className="flex gap-2">
              <Button onClick={addEntry} className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
                <Flower2 className="w-4 h-4 mr-2" /> Plant Seed
              </Button>
              <Button variant="outline" onClick={() => setShowInput(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setShowInput(true)} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg h-12">
            <Plus className="w-5 h-5 mr-2" /> Add Gratitude
          </Button>
        )}

        {/* Garden Visualization */}
        <div className="rounded-2xl bg-gradient-to-b from-sky-100 via-green-50 to-emerald-100 border border-emerald-200/30 p-5">
          <h3 className="font-bold text-sm text-emerald-800 mb-3 flex items-center gap-2">
            <TreePine className="w-4 h-4" /> Your Garden ({gardenItems.length} flowers)
          </h3>
          {gardenItems.length === 0 ? (
            <p className="text-center text-sm text-emerald-600/60 py-8">Plant your first seed of gratitude to start growing your garden 🌱</p>
          ) : (
            <div className="grid grid-cols-8 gap-1.5">
              {gardenItems.map((item, i) => (
                <div
                  key={item.id}
                  className="aspect-square rounded-lg bg-white/60 backdrop-blur-sm flex items-center justify-center text-lg hover:scale-125 transition-transform cursor-default group relative"
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
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" /> Recent Gratitude
            </h3>
            {entries.slice(0, 10).map(entry => (
              <div key={entry.id} className="rounded-xl bg-gradient-to-r from-white to-rose-50/30 border border-rose-100/50 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{entry.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{entry.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{entry.date}</p>
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

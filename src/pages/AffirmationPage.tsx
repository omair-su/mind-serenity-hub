import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Sparkles, Heart, Play, Pause, Loader2, RotateCcw, Star } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useAmbientBed } from "@/hooks/useAmbientBed";
import NarrationBar from "@/components/NarrationBar";

const categories = [
  { id: "morning", label: "Morning", icon: "🌅" },
  { id: "stress", label: "Stress Relief", icon: "🌊" },
  { id: "confidence", label: "Confidence", icon: "💎" },
  { id: "self-love", label: "Self-Love", icon: "💚" },
  { id: "sleep", label: "Sleep", icon: "🌙" },
  { id: "focus", label: "Focus", icon: "🎯" },
];

const affirmations: Record<string, string[]> = {
  morning: [
    "I wake up energized, grateful, and ready to embrace this beautiful day.",
    "Today I choose peace, purpose, and presence in everything I do.",
    "My mind is clear, my heart is open, and I am ready for what this day brings.",
    "I greet this morning with a calm mind and an open heart.",
    "Every morning is a fresh start — I release yesterday and embrace today.",
    "I have everything I need within me to make today extraordinary.",
    "With each breath I take, I grow more awake, alive, and grateful.",
    "This morning, I choose joy. I choose calm. I choose myself.",
  ],
  stress: [
    "I breathe in peace and breathe out everything that no longer serves me.",
    "I am safe. I am supported. This feeling is temporary and I will pass through it.",
    "My nervous system is calming. My heart rate is slowing. I am okay.",
    "I release the need to control everything. I trust the process of life.",
    "Stress is not my identity. I am the peaceful presence beneath all storms.",
    "With every exhale, I release tension. With every inhale, I welcome calm.",
    "I am stronger than my stress. I have survived every difficult day so far.",
    "Right now, in this moment, I am safe. Everything else can wait.",
  ],
  confidence: [
    "I am capable, worthy, and deserving of all that I desire.",
    "My voice matters. My presence matters. I matter.",
    "I trust my intuition and make decisions with clarity and courage.",
    "I am not defined by my mistakes — I am shaped by how I rise from them.",
    "I walk into every room knowing I belong there.",
    "I am continually growing and becoming the best version of myself.",
    "My unique gifts and talents are needed in this world.",
    "I face challenges with courage and emerge stronger on the other side.",
  ],
  "self-love": [
    "I am worthy of love exactly as I am right now — not someday, not when I change, but now.",
    "I treat myself with the same kindness I would offer my dearest friend.",
    "My worth is not determined by my productivity, appearance, or achievements.",
    "I honor my body, my mind, and my soul with deep compassion and care.",
    "I forgive myself for my past. I am doing the best I can with what I know.",
    "I am enough. I have always been enough. I will always be enough.",
    "I choose to see myself through eyes of love and acceptance.",
    "Every part of me — even the parts I struggle with — deserves love.",
  ],
  sleep: [
    "I release this day with gratitude. I did enough. I am enough.",
    "My body is wise and knows how to heal, restore, and renew as I sleep.",
    "I surrender into the arms of sleep, trusting that tomorrow will take care of itself.",
    "As I close my eyes, I let go of every thought, every worry, every task.",
    "Sleep is safe. Sleep is healing. Sleep is my gift to myself.",
    "My mind grows quiet. My body grows heavy. I drift peacefully into rest.",
    "Tonight I sleep deeply and wake tomorrow refreshed and full of life.",
    "I am at peace with this day. I am at peace with myself. I rest.",
  ],
  focus: [
    "I direct my full attention to what matters most and let distractions fall away.",
    "My mind is sharp, clear, and fully present in this moment.",
    "I complete what I begin. I follow through. I honor my commitments to myself.",
    "Distractions cannot pull me from my purpose. I return to focus easily.",
    "I work with deep concentration and achieve meaningful results.",
    "My attention is a superpower. I choose where to place it with intention.",
    "I am fully present. The past is done and the future is not yet here. Only now.",
    "Every task I undertake receives my full, undivided attention.",
  ],
};

const bgGradients = [
  "from-[#0d2618] via-[#152e20] to-[#1a3a28]",
  "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
  "from-[#2d1b4e] via-[#3a2060] to-[#1a0e2e]",
  "from-[#1a2f1a] via-[#2a3d2a] to-[#0f1e0f]",
  "from-[#2e1a1a] via-[#3d2020] to-[#1e0f0f]",
  "from-[#1a2a35] via-[#1e3545] to-[#102030]",
];

function getDailyAffirmation(catId: string): string {
  const day = new Date().getDate();
  const list = affirmations[catId] || affirmations.morning;
  return list[day % list.length];
}

export default function AffirmationPage() {
  const [selectedCategory, setSelectedCategory] = useState("morning");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("wv_affirmation_favs") || "[]"); } catch { return []; }
  });
  const [bgIdx, setBgIdx] = useState(0);
  const tts = useTextToSpeech();

  const currentList = affirmations[selectedCategory] || affirmations.morning;
  const currentAffirmation = currentList[currentIndex];
  const isFav = favorites.includes(currentAffirmation);

  useEffect(() => {
    setCurrentIndex(0);
    tts.stop();
  }, [selectedCategory]);

  const nextAffirmation = () => {
    tts.stop();
    setCurrentIndex(i => (i + 1) % currentList.length);
    setBgIdx(i => (i + 1) % bgGradients.length);
  };

  const toggleFav = () => {
    const next = isFav
      ? favorites.filter(f => f !== currentAffirmation)
      : [...favorites, currentAffirmation];
    setFavorites(next);
    localStorage.setItem("wv_affirmation_favs", JSON.stringify(next));
  };

  const handleListen = () => {
    if (tts.hasAudio) {
      tts.togglePlayPause();
    } else {
      tts.generateAndPlay(currentAffirmation);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Affirmation Station</h1>
            <p className="text-sm font-body text-muted-foreground">Positive declarations that rewire your mindset.</p>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main affirmation card */}
        <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${bgGradients[bgIdx]} p-10 lg:p-16 text-center min-h-[340px] flex flex-col items-center justify-center`}
          style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}
        >
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />
          <div className="absolute top-[10%] right-[8%] text-3xl opacity-20 pointer-events-none animate-pulse">✦</div>
          <div className="absolute bottom-[15%] left-[6%] text-2xl opacity-15 pointer-events-none">🌿</div>

          <p className="text-[12px] font-body font-bold uppercase tracking-[0.2em] text-white/40 mb-6">
            {categories.find(c => c.id === selectedCategory)?.icon} {categories.find(c => c.id === selectedCategory)?.label} Affirmation
          </p>

          <blockquote className="font-display text-[22px] md:text-[28px] lg:text-[32px] text-white leading-[1.5] max-w-2xl relative z-10">
            "{currentAffirmation}"
          </blockquote>

          <div className="flex items-center gap-4 mt-10">
            <button
              onClick={toggleFav}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isFav ? "bg-destructive/80 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
              title={isFav ? "Remove from favorites" : "Save to favorites"}
            >
              <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
            </button>

            <button
              onClick={handleListen}
              disabled={tts.isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-body font-semibold text-sm transition-all disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #D4A574, #B8860B)", color: "white" }}
            >
              {tts.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : tts.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {tts.isLoading ? "Generating..." : tts.isPlaying ? "Pause" : "Listen Aloud"}
            </button>

            <button
              onClick={nextAffirmation}
              className="w-12 h-12 rounded-full bg-white/10 text-white/60 hover:bg-white/20 flex items-center justify-center transition-all"
              title="Next affirmation"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-1.5 mt-6">
            {currentList.map((_, i) => (
              <button key={i} onClick={() => { tts.stop(); setCurrentIndex(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? "bg-white w-4" : "bg-white/30"}`}
              />
            ))}
          </div>
        </div>

        {/* How to use affirmations */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: "🪞", title: "Look in the Mirror", desc: "Speak the affirmation aloud while making eye contact with yourself. This amplifies the neural rewiring effect." },
            { icon: "✍️", title: "Write It 3 Times", desc: "Writing an affirmation activates different neural pathways than reading it. Repetition builds the belief." },
            { icon: "🔁", title: "Repeat for 21 Days", desc: "Research shows it takes 21–66 days to form a new belief pattern. Consistency is everything." },
          ].map(tip => (
            <div key={tip.title} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="text-2xl mb-3">{tip.icon}</div>
              <p className="font-display text-sm font-semibold text-foreground mb-1">{tip.title}</p>
              <p className="text-xs font-body text-muted-foreground leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>

        {/* Saved favorites */}
        {favorites.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-gold" />
              <h2 className="font-display text-lg font-semibold text-foreground">Your Saved Affirmations</h2>
            </div>
            <div className="space-y-3">
              {favorites.map((fav, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-4 flex items-start justify-between gap-3">
                  <p className="font-body text-sm text-foreground italic leading-relaxed flex-1">"{fav}"</p>
                  <button onClick={() => {
                    const next = favorites.filter(f => f !== fav);
                    setFavorites(next);
                    localStorage.setItem("wv_affirmation_favs", JSON.stringify(next));
                  }} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                    <Heart className="w-4 h-4 fill-current text-destructive/60" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Science note */}
        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5">
          <p className="text-xs font-body font-semibold text-primary uppercase tracking-wider mb-1">🔬 The Science</p>
          <p className="text-sm font-body text-foreground leading-relaxed">
            Positive affirmations activate the brain's reward circuits (ventral striatum and medial prefrontal cortex). 
            Regular practice has been shown to reduce stress hormones and increase openness to behavior change. 
            <span className="text-muted-foreground"> — Cascio et al. (2016), Social Cognitive and Affective Neuroscience.</span>
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

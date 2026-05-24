import { useState, useEffect, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { sleepStories, sleepStoryCategories, SleepStory, getStoryBackdrop } from "@/data/sleepStories";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useAmbientBed } from "@/hooks/useAmbientBed";
import {
  Moon,
  Clock,
  Play,
  Pause,
  Loader2,
  Square,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  Timer as TimerIcon,
  Download,
  Headphones,
} from "lucide-react";
import PremiumGate from "@/components/PremiumGate";
import heroBg from "@/assets/sleep/hero-bg.jpg";

/* ---------- Atmospheric layers ---------- */
function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 6,
        dur: 4 + Math.random() * 6,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-card/80"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes twinkle{0%,100%{opacity:.2}50%{opacity:1}}`}</style>
    </div>
  );
}

function Mist() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -inset-x-20 bottom-0 h-2/3 opacity-60"
        style={{
          background:
            "radial-gradient(60% 80% at 30% 100%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(50% 70% at 80% 100%, rgba(200,180,255,0.08), transparent 70%)",
          animation: "drift 22s ease-in-out infinite alternate",
        }}
      />
      <style>{`@keyframes drift{0%{transform:translateX(-20px)}100%{transform:translateX(20px)}}`}</style>
    </div>
  );
}

function MoonGlow() {
  return (
    <div className="pointer-events-none absolute -top-24 right-6 sm:right-16">
      <div
        className="w-40 h-40 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,236,200,0.55) 0%, rgba(255,220,160,0.18) 35%, transparent 70%)",
          filter: "blur(2px)",
          animation: "moonpulse 8s ease-in-out infinite",
        }}
      />
      <style>{`@keyframes moonpulse{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.06);opacity:1}}`}</style>
    </div>
  );
}

/* ---------- Card components ---------- */
function FlagshipCard({ s, onOpen }: { s: SleepStory; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group relative overflow-hidden rounded-3xl text-left shadow-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
      style={{ aspectRatio: "16 / 10" }}
    >
      {s.cover ? (
        <img
          src={s.cover}
          alt={s.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[1400ms] ease-out"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1530] via-[#1a2150] to-[#2a1f4d]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-charcoal/10" />
      <div className="absolute inset-0 ring-1 ring-inset ring-cream/10 rounded-3xl" />

      <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/10 backdrop-blur-md border border-cream/15 text-[10px] font-body text-cream/90">
        <Sparkles className="w-3 h-3 text-gold" /> Flagship
      </div>
      <div className="absolute top-4 right-4 inline-flex items-center gap-1 text-[10px] font-body text-cream/85 bg-charcoal/40 backdrop-blur-md px-2 py-1 rounded-full border border-cream/10">
        <Clock className="w-3 h-3" /> {s.duration} min
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        {s.mood && (
          <span className="inline-block text-[10px] uppercase tracking-[0.18em] text-gold/90 font-body mb-2">
            {s.mood}
          </span>
        )}
        <h3 className="font-display text-xl sm:text-2xl font-semibold text-cream drop-shadow-md">
          {s.title}
        </h3>
        {s.teaser && (
          <p className="text-sm text-cream/75 mt-1 font-body leading-relaxed line-clamp-2">
            {s.teaser}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2 text-cream/90">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-card/15 backdrop-blur-md border border-cream/20 group-hover:bg-gold group-hover:text-charcoal transition-all duration-500">
            <Play className="w-4 h-4 ml-0.5" />
          </span>
          <span className="text-xs font-body text-cream/75">
            Narrated by {s.narrator}
          </span>
        </div>
      </div>
    </button>
  );
}

function StoryCard({ s, onOpen }: { s: SleepStory; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group relative overflow-hidden rounded-2xl text-left bg-gradient-to-br from-[#0d1734]/90 via-[#141a3a]/85 to-[#1d1843]/90 border border-cream/10 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all duration-500 p-5"
    >
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gold/10 blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <span className="text-3xl group-hover:scale-110 transition-transform duration-500">
            {s.icon}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-body text-cream/70 bg-card/5 px-2 py-1 rounded-full border border-cream/10">
            <Clock className="w-3 h-3" /> {s.duration} min
          </span>
        </div>
        <h3 className="font-display text-base font-semibold text-cream mt-3">{s.title}</h3>
        <p className="text-xs font-body text-cream/65 mt-1 leading-relaxed line-clamp-2">
          {s.teaser || s.description}
        </p>
        <div className="flex items-center gap-1.5 mt-3 text-gold text-xs font-body font-medium">
          <Play className="w-3 h-3" /> Begin Story <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </button>
  );
}

/* ---------- Detail view ---------- */
function StoryDetail({
  story,
  onBack,
}: {
  story: SleepStory;
  onBack: () => void;
}) {
  const [paragraphIndex, setParagraphIndex] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);
  const tts = useTextToSpeech();
  const ambient = useAmbientBed("silence", 40);

  const backdrop = getStoryBackdrop(story);

  useEffect(() => {
    if (sleepTimer === null) {
      setTimerExpired(false);
      return;
    }
    const t = setTimeout(() => {
      tts.stop();
      setSleepTimer(null);
      setTimerExpired(true);
    }, sleepTimer * 60 * 1000);
    return () => clearTimeout(t);
  }, [sleepTimer, tts]);

  const playFullStory = () => {
    const fullText = story.paragraphs.join("\n\n");
    tts.generateAndPlay(fullText, {
      trackKey: `sleep-story-${story.id}`,
      category: "sleep_story",
      title: story.title,
      description: story.description,
      voice: "george",
      ambientBed: ambient.bed === "silence" ? null : ambient.bed,
      isPremium: true,
    });
  };

  const related = sleepStories
    .filter((s) => s.id !== story.id && (s.category === story.category || s.flagship))
    .slice(0, 3);

  return (
    <div className="relative space-y-8 animate-fade-in">
      {/* Cinematic video backdrop (fixed, behind everything) */}
      {backdrop && (
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <video
            src={backdrop}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Base dim overlay so text stays legible */}
          <div className="absolute inset-0 bg-charcoal/70" />
          {/* Sleep-timer fade — animates to full black over 30s when timer expires */}
          <div
            className="absolute inset-0 bg-charcoal transition-opacity duration-[30000ms] ease-linear"
            style={{ opacity: timerExpired ? 1 : 0 }}
          />
        </div>
      )}

      <button
        onClick={() => {
          onBack();
          tts.stop();
        }}
        className="flex items-center gap-2 text-sm font-body text-cream/70 hover:text-cream transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Sleep Stories
      </button>

      {/* Hero artwork */}
      <div className="relative overflow-hidden rounded-3xl shadow-elevated" style={{ aspectRatio: "16 / 9" }}>
        {story.cover ? (
          <img src={story.cover} alt={story.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1530] via-[#1a2150] to-[#2a1f4d]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
        <Mist />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 max-w-3xl">
          {story.mood && (
            <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-gold mb-2 font-body">
              {story.mood}
            </span>
          )}
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-cream drop-shadow">
            {story.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-body text-cream/80">
            <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {story.duration} min</span>
            <span className="inline-flex items-center gap-1"><Headphones className="w-3 h-3" /> Narrated by {story.narrator}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-card/10 border border-cream/15">
              <Download className="w-3 h-3" /> Offline ready
            </span>
          </div>
        </div>
      </div>

      {/* Player panel */}
      <div className="relative rounded-3xl border border-cream/10 bg-card/[0.04] backdrop-blur-xl p-6 sm:p-8 shadow-elevated">
        <p className="font-body text-base text-cream/85 leading-[2] max-w-3xl mx-auto text-center">
          {story.paragraphs[paragraphIndex]}
        </p>

        <div className="flex items-center justify-center gap-1.5 mt-6">
          {story.paragraphs.map((_, i) => (
            <button
              key={i}
              onClick={() => setParagraphIndex(i)}
              aria-label={`Paragraph ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === paragraphIndex ? "w-8 bg-gold" : i < paragraphIndex ? "w-4 bg-gold/40" : "w-4 bg-card/15"
              }`}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          {paragraphIndex > 0 && (
            <button
              onClick={() => { tts.stop(); setParagraphIndex((p) => p - 1); }}
              className="px-4 py-2.5 rounded-xl text-sm font-body text-cream/80 bg-card/5 border border-cream/10 hover:bg-card/10 transition"
            >
              ← Previous
            </button>
          )}

          <button
            onClick={() =>
              tts.hasAudio ? tts.togglePlayPause() : tts.generateAndPlay(story.paragraphs[paragraphIndex])
            }
            disabled={tts.isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-gold to-gold-dark text-charcoal text-sm font-body font-semibold shadow-gold hover:shadow-lg transition disabled:opacity-50"
          >
            {tts.isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : tts.isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {tts.isLoading ? "Preparing..." : tts.isPlaying ? "Pause" : "Listen"}
          </button>

          {paragraphIndex < story.paragraphs.length - 1 ? (
            <button
              onClick={() => { tts.stop(); setParagraphIndex((p) => p + 1); }}
              className="px-4 py-2.5 rounded-xl text-sm font-body text-cream/80 bg-card/5 border border-cream/10 hover:bg-card/10 transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => { tts.stop(); onBack(); }}
              className="px-4 py-2.5 rounded-xl text-sm font-body text-cream/80 bg-card/5 border border-cream/10 hover:bg-card/10 transition"
            >
              Sweet Dreams ✓
            </button>
          )}

          <button
            onClick={playFullStory}
            disabled={tts.isLoading}
            className="px-4 py-2.5 rounded-xl text-sm font-body text-cream/85 bg-card/5 border border-cream/10 hover:bg-card/10 transition disabled:opacity-50"
          >
            ▶ Play Full Story
          </button>

          {tts.isPlaying && (
            <button
              onClick={tts.stop}
              aria-label="Stop"
              className="p-2.5 rounded-xl bg-card/5 border border-cream/10 text-cream/80 hover:bg-card/10"
            >
              <Square className="w-4 h-4" />
            </button>
          )}
        </div>

        {tts.duration > 0 && (
          <div className="mt-6 max-w-md mx-auto">
            <div className="w-full bg-card/10 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gold h-full transition-all" style={{ width: `${tts.progress}%` }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] font-body text-cream/55">{tts.formatTime(tts.currentTime)}</span>
              <span className="text-[10px] font-body text-cream/55">{tts.formatTime(tts.duration)}</span>
            </div>
          </div>
        )}

        {/* Sleep timer + volume */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="rounded-2xl border border-cream/10 bg-card/[0.03] p-4">
            <div className="flex items-center gap-2 text-cream/85 font-body text-sm mb-3">
              <TimerIcon className="w-4 h-4 text-gold" /> Sleep Timer
            </div>
            <div className="flex flex-wrap gap-2">
              {[null, 10, 20, 30, 45].map((m) => (
                <button
                  key={String(m)}
                  onClick={() => setSleepTimer(m)}
                  className={`px-3 py-1.5 rounded-full text-xs font-body border transition ${
                    sleepTimer === m
                      ? "bg-gold text-charcoal border-gold"
                      : "bg-card/5 border-cream/10 text-cream/75 hover:bg-card/10"
                  }`}
                >
                  {m === null ? "Off" : `${m} min`}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-cream/10 bg-card/[0.03] p-4">
            <div className="flex items-center gap-2 text-cream/85 font-body text-sm mb-3">
              <Volume2 className="w-4 h-4 text-gold" /> Volume
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-gold"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h3 className="font-display text-xl text-cream mb-4">More stories like this</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <StoryCard key={r.id} s={r} onOpen={() => { onBack(); setTimeout(() => {}, 0); }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Page ---------- */
function SleepStoriesPageInner() {
  const [activeStory, setActiveStory] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const story = sleepStories.find((s) => s.id === activeStory);
  const flagship = sleepStories.filter((s) => s.flagship);
  const filtered =
    activeCategory === "all"
      ? sleepStories.filter((s) => !s.flagship)
      : sleepStories.filter((s) => s.category === activeCategory);

  return (
    <AppLayout>
      {/* Sanctuary canvas */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 sm:-mt-8 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-10 min-h-screen overflow-hidden bg-[#070b1a]">
        {/* Background layers */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-[80vh] object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070b1a]/40 via-[#070b1a]/85 to-[#070b1a]" />
          <StarField />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto space-y-10 animate-fade-in">
          {!story && (
            <>
              {/* HERO */}
              <section className="relative overflow-hidden rounded-3xl border border-cream/10 bg-card/[0.03] backdrop-blur-md p-6 sm:p-12">
                <MoonGlow />
                <Mist />
                <div className="relative">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-[10px] uppercase tracking-[0.2em] text-gold font-body">
                    <Sparkles className="w-3 h-3" /> Included in Pro
                  </div>
                  <h1 className="font-display text-4xl sm:text-6xl font-semibold text-cream mt-5 leading-[1.05] max-w-3xl">
                    Sleep stories that quiet the mind and welcome the night.
                  </h1>
                  <p className="font-body text-base sm:text-lg text-cream/70 mt-4 max-w-2xl leading-relaxed">
                    Immersive bedtime journeys designed to soften tension, slow the breath,
                    and guide you gently into deep sleep.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <button
                      onClick={() => flagship[0] && setActiveStory(flagship[0].id)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-gold to-gold-dark text-charcoal font-body font-semibold text-sm shadow-gold hover:shadow-lg transition"
                    >
                      <Play className="w-4 h-4" /> Start Listening
                    </button>
                    <button
                      onClick={() => {
                        const el = document.getElementById("sleep-story-grid");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-card/5 border border-cream/15 text-cream/85 font-body text-sm hover:bg-card/10 transition"
                    >
                      Preview Stories
                    </button>
                  </div>
                </div>
              </section>

              {/* Flagship cards */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl text-cream">Tonight's flagship journeys</h2>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gold/80 font-body">Pro originals</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {flagship.map((s) => (
                    <FlagshipCard key={s.id} s={s} onOpen={() => setActiveStory(s.id)} />
                  ))}
                </div>
              </section>

              {/* Categories */}
              <section id="sleep-story-grid" className="space-y-4">
                <h2 className="font-display text-2xl text-cream">Explore the library</h2>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-4 py-2 rounded-full text-sm font-body whitespace-nowrap transition border ${
                      activeCategory === "all"
                        ? "bg-gold text-charcoal border-gold shadow-gold"
                        : "bg-card/5 border-cream/10 text-cream/75 hover:bg-card/10"
                    }`}
                  >
                    All Stories
                  </button>
                  {sleepStoryCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-4 py-2 rounded-full text-sm font-body whitespace-nowrap transition border flex items-center gap-1.5 ${
                        activeCategory === cat.id
                          ? "bg-gold text-charcoal border-gold shadow-gold"
                          : "bg-card/5 border-cream/10 text-cream/75 hover:bg-card/10"
                      }`}
                    >
                      <span>{cat.icon}</span> {cat.name}
                    </button>
                  ))}
                </div>

                {filtered.length === 0 ? (
                  <p className="text-cream/60 font-body text-sm py-10 text-center">
                    More stories arriving soon in this collection.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((s) => (
                      <StoryCard key={s.id} s={s} onOpen={() => setActiveStory(s.id)} />
                    ))}
                  </div>
                )}
              </section>

              {/* How it works */}
              <section className="rounded-3xl border border-cream/10 bg-card/[0.03] backdrop-blur-md p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="w-4 h-4 text-gold" />
                  <h3 className="font-display text-lg text-cream">How Sleep Stories Work</h3>
                </div>
                <p className="text-sm font-body text-cream/70 leading-relaxed">
                  Listen in bed with the lights low. Don't try to follow the story — let the
                  words wash over you like waves. Most listeners drift off before the story
                  ends, and that is exactly the point.
                </p>
              </section>
            </>
          )}

          {story && <StoryDetail story={story} onBack={() => setActiveStory(null)} />}
        </div>
      </div>
    </AppLayout>
  );
}

export default function SleepStoriesPage() {
  return (
    <PremiumGate
      feature="Sleep Stories"
      description="Drift away with cinematic narrated tales — The Lantern Path, The Ocean Room, The Garden at Twilight, and more, voiced for deep restorative sleep."
      icon={Moon}
      gradient="from-charcoal/30 to-gold-dark/20"
      previewItems={[
        "The Lantern Path — 18 min",
        "The Ocean Room — 22 min",
        "The Garden at Twilight — 20 min",
        "The Train to Midnight — 24 min",
        "The Cloud House Above the Pines — 19 min",
        "+ 8 more bedtime journeys",
      ]}
    >
      <SleepStoriesPageInner />
    </PremiumGate>
  );
}

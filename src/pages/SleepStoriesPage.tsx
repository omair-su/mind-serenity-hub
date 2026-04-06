import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { sleepStories, sleepStoryCategories } from "@/data/sleepStories";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Moon, Clock, Play, Pause, Loader2, Square, ArrowLeft, BookOpen, ChevronRight } from "lucide-react";

const storyGradients = [
  "from-indigo-100/70 via-blue-50/50 to-violet-50/40",
  "from-emerald-100/60 via-teal-50/40 to-cyan-50/30",
  "from-amber-100/60 via-yellow-50/40 to-orange-50/30",
  "from-rose-100/60 via-pink-50/40 to-fuchsia-50/30",
  "from-violet-100/60 via-purple-50/40 to-indigo-50/30",
  "from-cyan-100/60 via-sky-50/40 to-blue-50/30",
  "from-teal-100/60 via-emerald-50/40 to-green-50/30",
  "from-pink-100/60 via-rose-50/40 to-red-50/30",
];

export default function SleepStoriesPage() {
  const [activeStory, setActiveStory] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [paragraphIndex, setParagraphIndex] = useState(0);
  const tts = useTextToSpeech();

  const story = sleepStories.find(s => s.id === activeStory);
  const filtered = activeCategory === "all" ? sleepStories : sleepStories.filter(s => s.category === activeCategory);

  const playFullStory = () => {
    if (!story) return;
    const fullText = story.paragraphs.join("\n\n");
    tts.generateAndPlay(fullText);
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/15 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Sleep Stories</h1>
            <p className="text-sm font-body text-muted-foreground">Narrated tales to guide you gently into deep sleep</p>
          </div>
        </div>

        {!story && (
          <>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-body whitespace-nowrap transition-all ${
                  activeCategory === "all" ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-soft" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                All Stories
              </button>
              {sleepStoryCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-body whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeCategory === cat.id ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-soft" : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => { setActiveStory(s.id); setParagraphIndex(0); }}
                  className={`group text-left relative overflow-hidden bg-gradient-to-br ${storyGradients[i % storyGradients.length]} dark:from-indigo-900/20 dark:via-violet-900/10 dark:to-purple-900/5 rounded-2xl border border-border/50 p-5 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300`}
                >
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-bl from-card/30 to-transparent" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <span className="text-3xl group-hover:scale-110 transition-transform">{s.icon}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-body text-muted-foreground bg-card/60 px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" /> {s.duration} min
                      </span>
                    </div>
                    <h3 className="font-display text-base font-semibold text-foreground mt-3">{s.title}</h3>
                    <p className="text-xs font-body text-muted-foreground mt-1 leading-relaxed">{s.description}</p>
                    <div className="flex items-center gap-1.5 mt-3 text-primary text-xs font-body font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-3 h-3" /> Begin Story <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100/50 via-violet-50/30 to-purple-50/20 dark:from-indigo-900/20 dark:via-violet-900/10 dark:to-purple-900/5 rounded-2xl p-6 border border-indigo-500/10 shadow-soft">
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-tl from-violet-200/20 to-transparent" />
              <h3 className="font-display text-base font-semibold text-foreground mb-2">How Sleep Stories Work</h3>
              <p className="text-sm font-body text-muted-foreground leading-relaxed">
                Sleep stories combine gentle narration, calming imagery, and progressive relaxation to quiet your mind and guide you into deep sleep. 
                Listen in bed with the lights off. Don't try to follow the story — let the words wash over you like waves. 
                Most people fall asleep before the story ends, and that's exactly the point.
              </p>
            </div>
          </>
        )}

        {story && (
          <div className="space-y-6">
            <button
              onClick={() => { setActiveStory(null); tts.stop(); setParagraphIndex(0); }}
              className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Stories
            </button>

            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100/60 via-violet-50/40 to-purple-50/30 dark:from-indigo-900/30 dark:via-violet-900/20 dark:to-purple-900/10 rounded-2xl border border-indigo-500/15 p-6 sm:p-8 shadow-elevated">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-bl from-indigo-200/30 to-transparent" />
              <div className="absolute bottom-0 left-0 w-40 h-20 bg-gradient-to-tr from-violet-200/20 to-transparent rounded-tr-full" />
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <span className="text-5xl">{story.icon}</span>
                  <h2 className="font-display text-2xl font-bold text-foreground mt-3">{story.title}</h2>
                  <p className="text-sm font-body text-muted-foreground mt-1">{story.description}</p>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <span className="text-xs font-body text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {story.duration} minutes
                    </span>
                    <span className="text-xs font-body text-muted-foreground">
                      Narrated by {story.narrator}
                    </span>
                  </div>
                </div>

                <div className="bg-card/70 backdrop-blur-sm rounded-xl p-6 mb-6 max-w-2xl mx-auto border border-border/50 shadow-soft">
                  <p className="font-body text-base text-foreground leading-[2] text-center">
                    {story.paragraphs[paragraphIndex]}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1.5 mb-4">
                  {story.paragraphs.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setParagraphIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${i === paragraphIndex ? "bg-indigo-500 scale-110" : i < paragraphIndex ? "bg-indigo-400/40" : "bg-secondary"}`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {paragraphIndex > 0 && (
                    <button
                      onClick={() => { tts.stop(); setParagraphIndex(p => p - 1); }}
                      className="px-4 py-2.5 bg-card/80 backdrop-blur-sm rounded-xl text-sm font-body border border-border/50"
                    >
                      ← Previous
                    </button>
                  )}

                  <button
                    onClick={() => tts.hasAudio ? tts.togglePlayPause() : tts.generateAndPlay(story.paragraphs[paragraphIndex])}
                    disabled={tts.isLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500/15 to-violet-500/10 text-indigo-700 dark:text-indigo-300 text-sm font-body font-medium hover:from-indigo-500/25 hover:to-violet-500/20 transition-all disabled:opacity-50"
                  >
                    {tts.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : tts.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {tts.isLoading ? "Generating..." : tts.isPlaying ? "Pause" : "Listen"}
                  </button>

                  {paragraphIndex < story.paragraphs.length - 1 ? (
                    <button
                      onClick={() => { tts.stop(); setParagraphIndex(p => p + 1); }}
                      className="px-5 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl text-sm font-body font-semibold shadow-gold hover:shadow-lg transition-all"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={() => { tts.stop(); setActiveStory(null); setParagraphIndex(0); }}
                      className="px-5 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl text-sm font-body font-semibold shadow-gold hover:shadow-lg transition-all"
                    >
                      Sweet Dreams ✓
                    </button>
                  )}

                  <button
                    onClick={playFullStory}
                    disabled={tts.isLoading}
                    className="px-4 py-2.5 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-xl text-sm font-body text-indigo-600 dark:text-indigo-400 hover:from-indigo-500/20 hover:to-violet-500/20 disabled:opacity-50 transition-all"
                  >
                    {tts.isLoading ? "..." : "▶ Play Full Story"}
                  </button>

                  {tts.isPlaying && (
                    <button onClick={tts.stop} className="p-2.5 rounded-xl bg-secondary text-muted-foreground hover:bg-secondary/80">
                      <Square className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {tts.isPlaying && tts.duration > 0 && (
                  <div className="mt-4 max-w-md mx-auto">
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div className="bg-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${tts.progress}%` }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] font-body text-muted-foreground">{tts.formatTime(tts.currentTime)}</span>
                      <span className="text-[10px] font-body text-muted-foreground">{tts.formatTime(tts.duration)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

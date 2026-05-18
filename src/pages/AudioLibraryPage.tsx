// Premium Audio Library — curated meditation sessions, sleep stories and
// multi-step courses with a multi-select playlist queue.
import { useMemo, useState, useCallback } from "react";
import { Play, Download, Clock, Headphones, BookOpen, Moon, Search, Plus, Check, ListMusic, X } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import AudioPlayer from "@/components/audio-library/AudioPlayer";
import { usePageSEO } from "@/hooks/usePageSEO";
import {
  SESSIONS,
  SLEEP_STORIES,
  COURSES,
  AUDIO_LIBRARY_FALLBACK_IMG,
  type MeditationSession,
  type SessionCategory,
} from "@/data/audioLibrary";
import { cn } from "@/lib/utils";

const CATEGORIES: (SessionCategory | "All")[] = [
  "All", "Focus", "Sleep", "Anxiety", "Basics", "Stories",
];

export default function AudioLibraryPage() {
  usePageSEO({
    title: "Audio Library — Premium Meditations | Willow Vibes",
    description: "Stream or download premium guided meditations, sleep stories, and multi-step courses. Build your own playlist queue.",
  });

  const [filter, setFilter] = useState<SessionCategory | "All">("All");
  const [query, setQuery] = useState("");

  // Playlist queue: ordered list of sessions + currently playing index
  const [queue, setQueue] = useState<MeditationSession[]>([]);
  const [playingIndex, setPlayingIndex] = useState(0);
  const [playerOpen, setPlayerOpen] = useState(false);

  const allSessions = useMemo(
    () => [...SESSIONS, ...SLEEP_STORIES],
    []
  );

  const filtered = useMemo(() => {
    return allSessions.filter((s) => {
      const catOk = filter === "All" || s.category === filter;
      const q = query.trim().toLowerCase();
      const qOk = !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [allSessions, filter, query]);

  const inQueue = useCallback(
    (id: string) => queue.some((s) => s.id === id),
    [queue]
  );

  const toggleQueue = useCallback((s: MeditationSession) => {
    setQueue((prev) =>
      prev.some((x) => x.id === s.id)
        ? prev.filter((x) => x.id !== s.id)
        : [...prev, s]
    );
  }, []);

  const playNow = useCallback((s: MeditationSession) => {
    // Replace queue with just this track and open player
    setQueue([s]);
    setPlayingIndex(0);
    setPlayerOpen(true);
  }, []);

  const playQueueFromStart = useCallback(() => {
    if (queue.length === 0) return;
    setPlayingIndex(0);
    setPlayerOpen(true);
  }, [queue.length]);

  const closePlayer = useCallback(() => {
    setPlayerOpen(false);
  }, []);

  const clearQueue = () => {
    setQueue([]);
    setPlayerOpen(false);
  };

  return (
    <AppLayout>
      {/* Hero */}
      <section className="calm-section-sm">
        <span className="calm-eyebrow-sm block mb-4">Audio Library</span>
        <h1 className="calm-h1 mb-4">A composed library for the inner life.</h1>
        <p className="calm-lead max-w-2xl">
          Stream or download world-class guided sessions, sleep narratives, and
          multi-step protocols. Tap <Plus className="inline w-4 h-4 -mt-1" /> on any
          track to build a playlist and listen back-to-back.
        </p>
      </section>

      {/* Search + filter */}
      <section className="mb-10 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sessions, authors, themes…"
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-sm font-body text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[11px] font-body font-semibold uppercase tracking-[0.18em] border transition-all",
                filter === cat
                  ? "bg-foreground text-background border-foreground"
                  : "text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="calm-eyebrow-sm block mb-2">Masterclasses</span>
            <h2 className="font-display text-2xl sm:text-3xl text-foreground">Multi-step courses</h2>
          </div>
          <BookOpen className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {COURSES.map((course) => (
            <article
              key={course.id}
              className="calm-card overflow-hidden group flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const t = e.currentTarget;
                    if (t.src !== AUDIO_LIBRARY_FALLBACK_IMG) t.src = AUDIO_LIBRARY_FALLBACK_IMG;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] font-bold text-foreground border border-border">
                  {course.goal}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display text-xl text-foreground mb-1">{course.title}</h3>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                  {course.author} · {course.steps.length} steps
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                  {course.description}
                </p>
                <div className="space-y-2 mt-auto">
                  {course.steps.map((step, i) => {
                    const stepSession: MeditationSession = {
                      id: step.id,
                      title: step.title,
                      description: step.description,
                      duration: step.duration,
                      category: "Basics",
                      thumbnail: course.thumbnail,
                      audioUrl: step.audioUrl,
                      author: course.author,
                    };
                    return (
                      <div
                        key={step.id}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/60 hover:bg-secondary transition-colors"
                      >
                        <button
                          onClick={() => playNow(stepSession)}
                          aria-label={`Play ${step.title}`}
                          className="w-7 h-7 rounded-full bg-foreground/90 text-background flex items-center justify-center text-[11px] font-bold shrink-0"
                        >
                          {i + 1}
                        </button>
                        <button
                          onClick={() => playNow(stepSession)}
                          className="flex-1 min-w-0 text-left"
                        >
                          <span className="block text-sm text-foreground font-body font-semibold truncate">
                            {step.title}
                          </span>
                          <span className="block text-[11px] text-muted-foreground">
                            {step.duration}
                          </span>
                        </button>
                        <button
                          onClick={() => toggleQueue(stepSession)}
                          aria-label={inQueue(step.id) ? `Remove ${step.title} from queue` : `Add ${step.title} to queue`}
                          className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all border",
                            inQueue(step.id)
                              ? "bg-primary/15 border-primary text-primary"
                              : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                          )}
                        >
                          {inQueue(step.id) ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Sessions grid */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="calm-eyebrow-sm block mb-2">Sessions</span>
            <h2 className="font-display text-2xl sm:text-3xl text-foreground">
              {filter === "All" ? "All sessions" : filter}
              <span className="text-muted-foreground font-body text-sm ml-3">{filtered.length}</span>
            </h2>
          </div>
          <Headphones className="w-5 h-5 text-muted-foreground" />
        </div>

        {filtered.length === 0 ? (
          <div className="calm-card p-10 text-center">
            <p className="font-display text-lg text-foreground mb-1">No sessions found</p>
            <p className="font-body text-sm text-muted-foreground">Try a different category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((s) => {
              const queued = inQueue(s.id);
              return (
                <article key={s.id} className="calm-card overflow-hidden group flex flex-col">
                  <button
                    onClick={() => playNow(s)}
                    className="relative aspect-[5/4] overflow-hidden text-left"
                    aria-label={`Play ${s.title}`}
                  >
                    <img
                      src={s.thumbnail}
                      alt={s.title}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const t = e.currentTarget;
                        if (t.src !== AUDIO_LIBRARY_FALLBACK_IMG) t.src = AUDIO_LIBRARY_FALLBACK_IMG;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] font-bold text-foreground border border-border">
                      {s.category === "Stories" ? <span className="inline-flex items-center gap-1"><Moon className="w-3 h-3" /> Story</span> : s.category}
                    </span>
                    <span className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </span>
                  </button>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display text-lg text-foreground mb-1 leading-snug">{s.title}</h3>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
                      {s.author}
                    </p>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-1">
                      {s.description}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-border gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" /> {s.duration}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleQueue(s); }}
                          aria-label={queued ? "Remove from queue" : "Add to queue"}
                          className={cn(
                            "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] transition-colors",
                            queued ? "text-primary" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {queued ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          {queued ? "Queued" : "Queue"}
                        </button>
                        <a
                          href={s.audioUrl}
                          download
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Floating Queue Bar */}
      {queue.length > 0 && !playerOpen && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md">
          <div className="bg-foreground text-background rounded-2xl shadow-2xl p-3 flex items-center gap-3 border border-border/20">
            <span className="w-10 h-10 rounded-xl bg-background/15 flex items-center justify-center shrink-0">
              <ListMusic className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-70 font-bold">Playlist Queue</p>
              <p className="text-sm font-body font-semibold truncate">
                {queue.length} {queue.length === 1 ? "track" : "tracks"} ready
              </p>
            </div>
            <button
              onClick={playQueueFromStart}
              className="px-4 py-2 rounded-full bg-background text-foreground text-xs font-bold uppercase tracking-wider hover:scale-105 transition-transform inline-flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Play
            </button>
            <button
              onClick={clearQueue}
              aria-label="Clear queue"
              className="w-8 h-8 rounded-full hover:bg-background/15 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {playerOpen && (
        <AudioPlayer
          queue={queue}
          index={playingIndex}
          onIndexChange={setPlayingIndex}
          onClose={closePlayer}
        />
      )}
    </AppLayout>
  );
}

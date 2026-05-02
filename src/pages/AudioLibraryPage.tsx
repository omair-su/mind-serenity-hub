// Premium Audio Library — curated meditation sessions, sleep stories and
// multi-step courses. Uses the in-app Calm-inspired design tokens and
// streams/downloads audio via the shared AudioPlayer.
import { useMemo, useState } from "react";
import { Play, Download, Clock, Headphones, BookOpen, Moon, Search } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import AudioPlayer from "@/components/audio-library/AudioPlayer";
import { usePageSEO } from "@/hooks/usePageSEO";
import {
  SESSIONS,
  SLEEP_STORIES,
  COURSES,
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
    description: "Stream or download premium guided meditations, sleep stories, and multi-step courses curated by world-class teachers.",
  });

  const [active, setActive] = useState<MeditationSession | null>(null);
  const [filter, setFilter] = useState<SessionCategory | "All">("All");
  const [query, setQuery] = useState("");

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

  return (
    <AppLayout>
      {/* Hero */}
      <section className="calm-section-sm">
        <span className="calm-eyebrow-sm block mb-4">Audio Library</span>
        <h1 className="calm-h1 mb-4">A composed library for the inner life.</h1>
        <p className="calm-lead max-w-2xl">
          Stream or download world-class guided sessions, sleep narratives, and
          multi-step protocols — engineered for stillness, focus and recovery.
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
                  className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
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
                  {course.steps.map((step, i) => (
                    <button
                      key={step.id}
                      onClick={() =>
                        setActive({
                          id: step.id,
                          title: step.title,
                          description: step.description,
                          duration: step.duration,
                          category: "Basics",
                          thumbnail: course.thumbnail,
                          audioUrl: step.audioUrl,
                          author: course.author,
                        })
                      }
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/60 hover:bg-secondary transition-colors text-left"
                    >
                      <span className="w-7 h-7 rounded-full bg-foreground/90 text-background flex items-center justify-center text-[11px] font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-foreground font-body font-semibold truncate">
                          {step.title}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">
                          {step.duration}
                        </span>
                      </span>
                      <Play className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  ))}
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
            {filtered.map((s) => (
              <article key={s.id} className="calm-card overflow-hidden group flex flex-col">
                <button
                  onClick={() => setActive(s)}
                  className="relative aspect-[5/4] overflow-hidden text-left"
                  aria-label={`Play ${s.title}`}
                >
                  <img
                    src={s.thumbnail}
                    alt={s.title}
                    className="w-full h-full object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
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
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" /> {s.duration}
                    </span>
                    <a
                      href={s.audioUrl}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <AudioPlayer session={active} onClose={() => setActive(null)} />
    </AppLayout>
  );
}

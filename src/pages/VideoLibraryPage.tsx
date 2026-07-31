// Willow Vibes Video Library — a premium, curated streaming experience.
// 50+ hand-picked YouTube sessions across 8 categories. Iframes are only
// injected on play so the page never loads 50 embeds at once.
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Search, X, Heart, Sparkles, Clock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useIsPremium } from "@/hooks/useIsPremium";
import { useVideoLibraryStore } from "@/lib/videoLibraryStore";
import {
  LIBRARY_VIDEOS,
  VIDEO_CATEGORIES_META,
  FEATURED_VIDEO_ID,
  DURATION_FILTERS,
  LEVEL_FILTERS,
  MOOD_FILTERS,
  INSTRUCTORS,
  thumbUrl,
  embedUrl,
  matchesDuration,
  type LibraryVideo,
  type DurationFilter,
  type VideoLevel,
  type VideoMood,
  type CategoryId,
} from "@/data/youtubeLibrary";
import { cn } from "@/lib/utils";

const HERO_IMG =
  "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1920";

export default function VideoLibraryPage() {
  usePageSEO({
    title: "Video Library — 50+ Guided Sessions | Willow Vibes",
    description:
      "Stream 50+ guided meditations, yoga flows, breathwork and sleep sessions from Jon Kabat-Zinn, Tara Brach, Yoga With Adriene and more — curated by Willow Vibes.",
  });

  const { isPremium } = useIsPremium();
  const { saved, recent, toggleSave, markWatched } = useVideoLibraryStore();

  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<CategoryId | null>(null);
  const [duration, setDuration] = useState<DurationFilter>("All");
  const [level, setLevel] = useState<VideoLevel | "All Levels">("All Levels");
  const [mood, setMood] = useState<VideoMood | null>(null);
  const [playing, setPlaying] = useState<LibraryVideo | null>(null);

  const featured = LIBRARY_VIDEOS.find((v) => v.id === FEATURED_VIDEO_ID)!;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LIBRARY_VIDEOS.filter((v) => {
      const qOk =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.instructor.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q));
      const dOk = matchesDuration(v, duration);
      const lOk = level === "All Levels" ? true : v.level === level;
      const mOk = !mood || v.moods.includes(mood);
      return qOk && dOk && lOk && mOk;
    });
  }, [query, duration, level, mood]);

  const savedVideos = LIBRARY_VIDEOS.filter((v) => saved.includes(v.id));
  const recentVideos = recent
    .map((r) => ({ entry: r, video: LIBRARY_VIDEOS.find((v) => v.id === r.id) }))
    .filter((x): x is { entry: typeof recent[number]; video: LibraryVideo } => !!x.video);

  const openVideo = (v: LibraryVideo) => {
    markWatched(v.id);
    setPlaying(v);
  };

  const scrollToCat = (id: CategoryId) => {
    setActiveCat(id);
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hasResults = filtered.length > 0;

  return (
    <AppLayout>
      <div className="min-h-screen bg-background pb-24 lg:pb-16">
        {/* ───────────── HERO ───────────── */}
        <section className="relative h-[45vh] min-h-[380px] lg:h-[60vh] overflow-hidden">
          <img src={HERO_IMG} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, hsl(var(--forest-deep) / 0.82), hsl(var(--sage-dark) / 0.55))",
            }}
          />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5">
            <p className="font-body text-[11px] uppercase tracking-[0.28em] text-cream/80 mb-3">
              Willow Vibes Video Library
            </p>
            <h1 className="font-display italic text-[38px] leading-[1.05] lg:text-6xl font-light text-cream max-w-3xl">
              Your Daily Sanctuary of Stillness
            </h1>
            <p className="font-body text-sm lg:text-[17px] text-cream/90 mt-4 max-w-[520px]">
              50+ guided meditations, yoga flows, breathwork sessions, and mindfulness practices — hand-curated for your wellbeing.
            </p>

            <div className="relative w-full max-w-[560px] mt-7">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/60" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search meditations, yoga, sleep..."
                aria-label="Search the video library"
                className="w-full rounded-full bg-cream/95 border border-cream/40 pl-12 pr-11 py-3.5 font-body text-sm text-forest placeholder:text-forest/50 focus:outline-none focus:ring-2 focus:ring-gold/60"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-forest/60 hover:text-forest"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              {["50+ Videos", "8 Categories", "5 – 60 Minutes", "All Levels"].map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-full bg-cream/15 border border-cream/25 backdrop-blur-sm font-body text-[11px] tracking-wide text-cream"
                >
                  ✦ {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── CONTINUE WATCHING ───────────── */}
        {recentVideos.length > 0 && !query && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
            <SectionEyebrow>Continue Watching</SectionEyebrow>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1 mt-3">
              {recentVideos.map(({ video, entry }) => (
                <div key={video.id} className="shrink-0 w-[240px]">
                  <VideoCard
                    video={video}
                    saved={saved.includes(video.id)}
                    onSave={() => toggleSave(video.id)}
                    onPlay={() => openVideo(video)}
                    progress={entry.progress}
                    resume
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ───────────── FEATURED ───────────── */}
        {!query && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-12">
            <SectionEyebrow>Featured This Week</SectionEyebrow>
            <h2 className="font-display italic text-[32px] lg:text-[38px] font-light text-foreground mt-1 mb-5">
              Editor's Pick
            </h2>
            <div className="grid lg:grid-cols-[3fr_2fr] gap-0 rounded-3xl overflow-hidden bg-card border border-border shadow-card border-l-4 border-l-primary">
              <button
                onClick={() => openVideo(featured)}
                className="group relative aspect-video w-full overflow-hidden"
                aria-label={`Play ${featured.title}`}
              >
                <Thumb id={featured.youtubeId} alt={featured.title} />
                <div className="absolute inset-0 bg-forest-deep/25 group-hover:bg-forest-deep/10 transition-colors" />
                <PlayBadge large />
              </button>
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <span className="font-body text-[11px] uppercase tracking-[0.2em] text-primary">Body Scan</span>
                <h3 className="font-display text-2xl lg:text-3xl font-semibold text-foreground mt-2 leading-snug">
                  Deep Relaxation — Full Body Scan Meditation
                </h3>
                <p className="font-body text-[13px] font-semibold text-muted-foreground mt-1.5">
                  Jon Kabat-Zinn • Founder of MBSR
                </p>
                <p className="font-body text-sm text-muted-foreground mt-3 leading-relaxed">
                  The gold standard of mindfulness. Dr. Jon Kabat-Zinn guides you through a complete 30-minute body scan — one of the most researched and clinically validated meditation techniques in the world.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge>30 min</Badge>
                  <Badge>All Levels</Badge>
                  {["Mindfulness", "MBSR", "BodyScan", "Stress"].map((t) => (
                    <TagPill key={t}>#{t}</TagPill>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <button
                    onClick={() => openVideo(featured)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-body text-sm font-semibold shadow-soft hover:opacity-90 transition-opacity"
                  >
                    <Play className="w-4 h-4 fill-current" /> Play Full Session
                  </button>
                  <button
                    onClick={() => toggleSave(featured.id)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border font-body text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                  >
                    <Heart className={cn("w-4 h-4", saved.includes(featured.id) && "fill-primary text-primary")} />
                    {saved.includes(featured.id) ? "Saved" : "Add to My List"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ───────────── STICKY CATEGORY NAV + FILTERS ───────────── */}
        <div className="sticky top-0 z-30 bg-background/92 backdrop-blur-md border-b border-border mt-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {VIDEO_CATEGORIES_META.map((c) => (
                <button
                  key={c.id}
                  onClick={() => scrollToCat(c.id)}
                  className={cn(
                    "shrink-0 px-4 py-2 rounded-full font-body text-[13px] font-bold border transition-all",
                    activeCat === c.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-primary/50",
                  )}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
              <FilterRow label="Duration">
                {DURATION_FILTERS.map((d) => (
                  <FilterPill key={d} active={duration === d} onClick={() => setDuration(d)}>{d}</FilterPill>
                ))}
              </FilterRow>
              <FilterRow label="Level">
                {LEVEL_FILTERS.map((l) => (
                  <FilterPill key={l} active={level === l} onClick={() => setLevel(l)}>{l}</FilterPill>
                ))}
              </FilterRow>
              <FilterRow label="Mood">
                {MOOD_FILTERS.map((m) => (
                  <FilterPill key={m} active={mood === m} onClick={() => setMood(mood === m ? null : m)}>{m}</FilterPill>
                ))}
              </FilterRow>
              {saved.length > 0 && (
                <span className="ml-auto inline-flex items-center gap-1.5 font-body text-xs font-semibold text-primary">
                  <Heart className="w-3.5 h-3.5 fill-primary" /> {saved.length} Saved
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ───────────── MY SAVED ───────────── */}
        {savedVideos.length > 0 && !query && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
            <SectionEyebrow>My Saved Videos</SectionEyebrow>
            <Grid>
              {savedVideos.map((v) => (
                <VideoCard key={`saved-${v.id}`} video={v} saved onSave={() => toggleSave(v.id)} onPlay={() => openVideo(v)} />
              ))}
            </Grid>
          </section>
        )}

        {/* ───────────── CATEGORY SECTIONS ───────────── */}
        {!hasResults ? (
          <div className="max-w-md mx-auto text-center py-24 px-6">
            <Search className="w-9 h-9 text-primary mx-auto mb-4" />
            <p className="font-display text-2xl text-foreground">No videos match “{query}”</p>
            <p className="font-body text-sm text-muted-foreground mt-2">
              Try: meditation · sleep · yoga · breathing · anxiety
            </p>
            <button
              onClick={() => { setQuery(""); setDuration("All"); setLevel("All Levels"); setMood(null); }}
              className="mt-5 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-body text-sm font-semibold"
            >
              Clear search
            </button>
          </div>
        ) : (
          VIDEO_CATEGORIES_META.map((cat) => {
            const vids = filtered.filter((v) => v.categoryId === cat.id);
            if (vids.length === 0) return null;
            return (
              <section
                key={cat.id}
                id={`cat-${cat.id}`}
                className="max-w-6xl mx-auto px-4 sm:px-6 mt-12 lg:mt-20 scroll-mt-32"
              >
                <SectionEyebrow>{cat.eyebrow}</SectionEyebrow>
                <h2 className="font-display italic text-[28px] lg:text-[36px] font-light text-foreground mt-1">
                  {cat.headline}
                </h2>
                <p className="font-body text-sm text-muted-foreground mt-2 max-w-xl">{cat.sub}</p>
                <Grid>
                  {vids.map((v) => (
                    <VideoCard
                      key={v.id}
                      video={v}
                      saved={saved.includes(v.id)}
                      onSave={() => toggleSave(v.id)}
                      onPlay={() => openVideo(v)}
                    />
                  ))}
                </Grid>
              </section>
            );
          })
        )}

        {/* ───────────── STATS BAR ───────────── */}
        <section className="mt-16 lg:mt-24 py-12 bg-secondary/60 border-y border-border">
          <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 px-6 text-center">
            {[
              { n: "50+", l: "Videos", e: "🎬" },
              { n: "8", l: "Categories", e: "🧘" },
              { n: "5–60", l: "Minutes", e: "⏱️" },
              { n: "12", l: "World-Class Instructors", e: "⭐" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-lg">{s.e}</div>
                <div className="font-display italic text-4xl lg:text-5xl text-primary leading-none mt-1">{s.n}</div>
                <div className="font-body text-[12px] uppercase tracking-[0.16em] text-muted-foreground mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ───────────── INSTRUCTOR SPOTLIGHT ───────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-14">
          <div className="flex items-end justify-between">
            <div>
              <SectionEyebrow>Instructor Spotlight</SectionEyebrow>
              <h2 className="font-display italic text-[28px] lg:text-[34px] font-light text-foreground mt-1">
                Teachers We Trust
              </h2>
            </div>
            <Link to="/app/explore" className="font-body text-xs font-semibold text-primary inline-flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mt-5">
            {INSTRUCTORS.map((i) => (
              <div
                key={i.name}
                className="shrink-0 w-[200px] rounded-2xl bg-card border border-border p-4 shadow-soft"
              >
                <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center font-display text-xl text-primary">
                  {i.name[0]}
                </div>
                <p className="font-body text-sm font-bold text-foreground mt-3">{i.name}</p>
                <p className="font-body text-xs text-muted-foreground">{i.subs} subscribers</p>
                <p className="font-body text-xs italic text-primary mt-1">{i.specialty}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ───────────── WILLOW PLUS STRIP ───────────── */}
        {!isPremium && (
          <section className="mt-16">
            <div className="relative overflow-hidden bg-forest-deep py-12 px-6">
              <div
                className="absolute inset-0 opacity-[0.14]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, hsl(var(--sage)) 0 2px, transparent 3px), radial-gradient(circle at 70% 70%, hsl(var(--gold)) 0 2px, transparent 3px)",
                  backgroundSize: "60px 60px",
                }}
              />
              <div className="relative max-w-3xl mx-auto text-center">
                <Sparkles className="w-5 h-5 text-gold mx-auto mb-3" />
                <h2 className="font-display italic text-2xl lg:text-[28px] font-light text-cream leading-snug">
                  🌿 You've found the free library — unlock 200+ more premium sessions and AI-personalised daily video recommendations with Willow Plus.
                </h2>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/pricing"
                    className="px-7 py-3 rounded-full bg-cream text-forest font-body text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    Start Free 7-Day Trial
                  </Link>
                  <span className="font-body text-[13px] text-sage-light">
                    Already a member?{" "}
                    <Link to="/sign-in" className="underline underline-offset-4 text-cream">Sign in</Link>
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <AnimatePresence>
        {playing && (
          <PlayerModal
            video={playing}
            saved={saved.includes(playing.id)}
            onSave={() => toggleSave(playing.id)}
            onClose={() => setPlaying(null)}
            onPlayNext={(v) => openVideo(v)}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

/* ───────────────────────── small building blocks ───────────────────────── */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[11px] uppercase tracking-[0.24em] text-primary font-semibold">{children}</p>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">{children}</div>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-full bg-secondary font-body text-[11px] font-semibold text-secondary-foreground">
      {children}
    </span>
  );
}

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2.5 py-1 rounded-full bg-accent/50 font-body text-[10px] font-semibold text-accent-foreground">
      {children}
    </span>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
      <span className="font-body text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">{label}</span>
      {children}
    </div>
  );
}

function FilterPill({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 px-3 py-1 rounded-full border font-body text-[12px] transition-colors",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-transparent text-muted-foreground border-border hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function PlayBadge({ large = false }: { large?: boolean }) {
  return (
    <span
      className={cn(
        "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200",
      )}
    >
      <span
        className={cn(
          "rounded-full bg-primary flex items-center justify-center shadow-elevated transition-transform duration-300 group-hover:scale-110",
          large ? "w-16 h-16" : "w-12 h-12",
        )}
      >
        <Play className={cn("text-primary-foreground fill-current ml-0.5", large ? "w-6 h-6" : "w-5 h-5")} />
      </span>
    </span>
  );
}

function Thumb({ id, alt }: { id: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <span className="absolute inset-0 bg-muted animate-pulse" />}
      <img
        src={thumbUrl(id)}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.src.includes("hqdefault")) img.src = thumbUrl(id, "hqdefault");
          setLoaded(true);
        }}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </>
  );
}

/* ───────────────────────────── video card ───────────────────────────── */

function VideoCard({
  video, saved, onSave, onPlay, progress, resume,
}: {
  video: LibraryVideo;
  saved: boolean;
  onSave: () => void;
  onPlay: () => void;
  progress?: number;
  resume?: boolean;
}) {
  const cat = VIDEO_CATEGORIES_META.find((c) => c.id === video.categoryId);
  return (
    <article className="group rounded-[20px] overflow-hidden bg-card border border-border shadow-soft transition-all duration-[250ms] hover:-translate-y-1.5 hover:shadow-elevated">
      <button onClick={onPlay} className="relative block w-full aspect-video" aria-label={`Play ${video.title}`}>
        <Thumb id={video.youtubeId} alt={video.title} />
        <span className="absolute inset-0 bg-forest-deep/15 group-hover:bg-forest-deep/35 transition-colors" />
        <PlayBadge />
        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-cream/90 font-body text-[10px] font-bold text-forest">
          {video.level}
        </span>
        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-forest-deep/80 font-body text-[10px] font-bold text-cream inline-flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" /> {video.minutes} min
        </span>
        {typeof progress === "number" && (
          <span className="absolute bottom-0 left-0 right-0 h-1 bg-cream/40">
            <span className="block h-full bg-primary" style={{ width: `${progress}%` }} />
          </span>
        )}
      </button>

      <div className="p-4">
        <p className="font-body text-[11px] uppercase tracking-[0.16em] text-primary">{cat?.label}</p>
        <h3 className="font-display text-xl font-semibold text-foreground leading-snug mt-1">{video.title}</h3>
        <p className="font-body text-[13px] text-muted-foreground mt-0.5">{video.instructor}</p>
        <p className="font-body text-[13px] text-foreground/70 mt-2 line-clamp-2">{video.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {video.tags.slice(0, 3).map((t) => (
            <TagPill key={t}>#{t}</TagPill>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <button
            onClick={onSave}
            aria-label={saved ? "Remove from My List" : "Save to My List"}
            aria-pressed={saved}
            className="inline-flex items-center gap-1.5 font-body text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <Heart className={cn("w-4 h-4", saved && "fill-primary text-primary")} />
            {saved ? "Saved" : "Save"}
          </button>
          <button
            onClick={onPlay}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-xs font-bold hover:opacity-90 transition-opacity"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> {resume ? "Resume" : "Play"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ───────────────────────────── player modal ───────────────────────────── */

function PlayerModal({
  video, saved, onSave, onClose, onPlayNext,
}: {
  video: LibraryVideo;
  saved: boolean;
  onSave: () => void;
  onClose: () => void;
  onPlayNext: (v: LibraryVideo) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const upNext = LIBRARY_VIDEOS.find((v) => v.categoryId === video.categoryId && v.id !== video.id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], iframe, input, [tabindex]:not([tabindex="-1"])',
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      className="fixed inset-0 z-[120] flex items-start lg:items-center justify-center overflow-y-auto p-4 lg:p-8"
      style={{ background: "hsl(var(--forest-deep) / 0.94)" }}
    >
      <motion.div
        ref={panelRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[900px] my-auto"
      >
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            aria-label="Close player"
            autoFocus
            className="p-2 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors"
          >
            <X className="w-5 h-5 text-cream" />
          </button>
        </div>

        <iframe
          title={video.title}
          src={embedUrl(video.youtubeId)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="w-full rounded-2xl border-0"
          style={{ aspectRatio: "16 / 9" }}
        />

        <div className="grid md:grid-cols-[3fr_2fr] gap-6 mt-5 rounded-2xl bg-card p-5 lg:p-6">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.2em] text-primary">
              {VIDEO_CATEGORIES_META.find((c) => c.id === video.categoryId)?.label}
            </p>
            <h2 className="font-display italic text-[26px] lg:text-[28px] font-light text-foreground mt-1 leading-snug">
              {video.title}
            </h2>
            <p className="font-body text-sm font-bold text-foreground/80 mt-1">{video.instructor}</p>
            <p className="font-body text-sm text-muted-foreground mt-3 leading-relaxed">{video.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {video.tags.map((t) => <TagPill key={t}>#{t}</TagPill>)}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Badge>{video.minutes} min</Badge>
              <Badge>{video.level}</Badge>
            </div>
            <button
              onClick={onSave}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-border font-body text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <Heart className={cn("w-4 h-4", saved && "fill-primary text-primary")} />
              {saved ? "Saved to My List" : "Save to My List"}
            </button>
            <button
              onClick={onClose}
              className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              ← Back to Library
            </button>

            {upNext && (
              <button
                onClick={() => onPlayNext(upNext)}
                className="mt-1 flex gap-3 items-center text-left rounded-xl border border-border p-2 hover:bg-secondary transition-colors"
              >
                <span className="relative w-20 aspect-video rounded-lg overflow-hidden shrink-0">
                  <Thumb id={upNext.youtubeId} alt={upNext.title} />
                </span>
                <span className="min-w-0">
                  <span className="block font-body text-[10px] uppercase tracking-wider text-primary">Up Next</span>
                  <span className="block font-body text-xs font-semibold text-foreground truncate">{upNext.title}</span>
                  <span className="block font-body text-[11px] text-muted-foreground">{upNext.minutes} min</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

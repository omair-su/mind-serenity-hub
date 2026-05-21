// Calming Video Library — cinematic, looping backdrops for meditation and ambient
// presence. Each card pulls its video from the Cloud `video` bucket via the
// branded-video slot system, with a graceful fallback while uploads are pending.
import { useMemo, useState, useEffect, useRef } from "react";
import { Play, Lock, Search, Maximize2, X, Sparkles, Crown, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import PremiumLockModal from "@/components/PremiumLockModal";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useIsPremium } from "@/hooks/useIsPremium";
import { useBrandedVideo } from "@/hooks/useBrandedVideo";
import { CALMING_VIDEOS, VIDEO_CATEGORIES, type CalmingVideo } from "@/data/videoLibrary";
import heroVideoAsset from "@/assets/video-library-hero.mp4.asset.json";
import { cn } from "@/lib/utils";

export default function VideoLibraryPage() {
  usePageSEO({
    title: "Calming Video Library — Cinematic Backdrops | Willow Vibes",
    description:
      "Stream looping cinematic nature scenes — forest, ocean, fireplace, aurora — paired with ambient soundscapes for meditation, focus, and sleep.",
  });

  const { isPremium } = useIsPremium();
  const [filter, setFilter] = useState<(typeof VIDEO_CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");
  const [playing, setPlaying] = useState<CalmingVideo | null>(null);
  const [premiumLocked, setPremiumLocked] = useState(false);

  const filtered = useMemo(() => {
    return CALMING_VIDEOS.filter((v) => {
      const catOk = filter === "All" || v.category === filter;
      const q = query.trim().toLowerCase();
      const qOk =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [filter, query]);

  const canPlay = (v: CalmingVideo) => !v.isPremium || isPremium;

  const handlePlay = (v: CalmingVideo) => {
    if (!canPlay(v)) {
      setPremiumLocked(true);
      return;
    }
    setPlaying(v);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 pb-24 lg:pb-12">
        {/* HERO */}
        <section className="relative h-[44vh] min-h-[320px] max-h-[460px] overflow-hidden">
          <video
            src={heroVideoAsset.url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-charcoal/50 to-background" />
          <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-10 max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-3 self-start px-3 py-1.5 rounded-full bg-gold/15 backdrop-blur-md border border-gold/30">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span className="text-xs font-body font-semibold text-cream tracking-wide">
                NEW · Cinematic Library
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-cream leading-tight max-w-2xl">
              Calming Video Backdrops
            </h1>
            <p className="font-body text-sm md:text-base text-cream/80 mt-2 max-w-xl">
              Loop a forest, an ocean, a fireplace. Your branded scenes with calming audio.
            </p>
          </div>
        </section>

        {/* FILTERS */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search calming scenes..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border font-body text-sm focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {VIDEO_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-body font-semibold whitespace-nowrap transition-all",
                  filter === c
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((v) => (
              <VideoCard
                key={v.id}
                video={v}
                locked={!canPlay(v)}
                onPlay={() => handlePlay(v)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="font-body text-sm text-muted-foreground">
                No scenes match your search.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN PLAYER */}
      <AnimatePresence>
        {playing && (
          <VideoPlayerOverlay video={playing} onClose={() => setPlaying(null)} />
        )}
      </AnimatePresence>
      <PremiumLockModal
        open={premiumLocked}
        onClose={() => setPremiumLocked(false)}
        feature="Calming Video Library"
        description="Unlock the full cinematic backdrop library with premium-only scenes and fullscreen playback."
      />
    </AppLayout>
  );
}

/* ------------------------------- Video card -------------------------------- */

function VideoCard({
  video,
  locked,
  onPlay,
}: {
  video: CalmingVideo;
  locked: boolean;
  onPlay: () => void;
}) {
  const { posterUrl } = useBrandedVideo(video.slot, video.fallbackVideoUrl, video.fallbackPosterUrl);
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={onPlay}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-soft text-left aspect-video"
    >
      <img
        src={posterUrl}
        alt={video.title}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = video.fallbackPosterUrl;
        }}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />

      <div className="absolute top-3 right-3 z-10">
        {locked ? (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gold/90 backdrop-blur-sm">
            <Crown className="w-3 h-3 text-charcoal" />
            <span className="text-[10px] font-bold text-charcoal tracking-wide">PREMIUM</span>
          </div>
        ) : (
          <div className="px-2 py-1 rounded-full bg-cream/20 backdrop-blur-sm border border-cream/30">
            <span className="text-[10px] font-bold text-cream tracking-wide">FREE</span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={cn(
            "w-14 h-14 rounded-full backdrop-blur-md flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110",
            locked ? "bg-charcoal/40 border-gold/50" : "bg-cream/20 border-cream/40",
          )}
        >
          {locked ? (
            <Lock className="w-5 h-5 text-gold" />
          ) : (
            <Play className="w-5 h-5 text-cream fill-cream ml-0.5" />
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-body font-semibold uppercase tracking-wider text-gold">
            {video.category}
          </span>
          <span className="text-[10px] font-body text-cream/60">
            · {video.durationSec}s loop
          </span>
        </div>
        <h3 className="font-display text-base font-bold text-cream leading-tight">
          {video.title}
        </h3>
        <p className="font-body text-xs text-cream/70 mt-1 line-clamp-1">
          {video.description}
        </p>
      </div>
    </motion.button>
  );
}

/* ----------------------------- Fullscreen player ----------------------------- */

function VideoPlayerOverlay({
  video,
  onClose,
}: {
  video: CalmingVideo;
  onClose: () => void;
}) {
  const { videoUrl, posterUrl } = useBrandedVideo(
    video.slot,
    video.fallbackVideoUrl,
    video.fallbackPosterUrl,
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  // Audio is baked into branded videos — start at a calm 60% volume.
  const [volume, setVolume] = useState(0.6);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = muted;
    }
  }, [volume, muted]);

  const requestFs = () => {
    const el = videoRef.current?.parentElement;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="relative w-full h-full md:w-[92vw] md:h-[88vh] md:rounded-3xl overflow-hidden bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          autoPlay
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6 flex items-start justify-between bg-gradient-to-b from-charcoal/70 to-transparent">
          <div>
            <div className="text-[10px] font-body font-semibold uppercase tracking-wider text-gold">
              {video.category}
            </div>
            <h2 className="font-display text-lg md:text-2xl font-bold text-cream mt-1">
              {video.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted((m) => !m)}
              className="p-2.5 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors backdrop-blur-md"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="w-4 h-4 text-cream" /> : <Volume2 className="w-4 h-4 text-cream" />}
            </button>
            <button
              onClick={requestFs}
              className="p-2.5 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors backdrop-blur-md"
              aria-label="Fullscreen"
            >
              <Maximize2 className="w-4 h-4 text-cream" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors backdrop-blur-md"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-cream" />
            </button>
          </div>
        </div>

        {/* Bottom bar — volume slider */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 md:p-6 bg-gradient-to-t from-charcoal/70 to-transparent">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-cream/10 backdrop-blur-md">
              <span className="text-xs font-body text-cream/70 whitespace-nowrap">Volume</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  setMuted(false);
                  setVolume(parseFloat(e.target.value));
                }}
                className="flex-1 accent-gold"
              />
              <span className="text-xs font-body font-semibold text-cream w-8 text-right">
                {Math.round((muted ? 0 : volume) * 100)}
              </span>
            </div>
            <p className="text-center text-[10px] font-body text-cream/50 mt-3">
              Press <kbd className="px-1.5 py-0.5 rounded bg-cream/10">Esc</kbd> to close
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

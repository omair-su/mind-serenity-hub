import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, Wind, Moon, Music2, Brain, Sparkles, Heart } from "lucide-react";
import demoAsset from "../../../public/videos/willow-demo.mp4.asset.json";

interface WatchDemoModalProps {
  open: boolean;
  onClose: () => void;
  videoSrc?: string;
  poster?: string;
}

const FEATURES = [
  { icon: Sparkles, label: "30-Day Cinematic Journey", desc: "Guided day-by-day mindfulness" },
  { icon: Wind, label: "Breathwork Library", desc: "Box, 4-7-8, coherence breathing" },
  { icon: Moon, label: "Sleep Stories", desc: "Drift off to narrated calm" },
  { icon: Music2, label: "Soundscapes", desc: "Mix forest, rain, ocean, bowls" },
  { icon: Brain, label: "AI Coach", desc: "Personalized reflections daily" },
  { icon: Heart, label: "Mood & Gratitude", desc: "Track how you truly feel" },
];

export default function WatchDemoModal({
  open,
  onClose,
  videoSrc = demoAsset.url,
  poster,
}: WatchDemoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (open) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [open]);

  // Cycle feature highlights while modal is open
  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % FEATURES.length), 2200);
    return () => clearInterval(id);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="p-0 border-0 bg-transparent shadow-none max-w-[min(1200px,96vw)] [&>button]:hidden"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          requestAnimationFrame(() => {
            document.getElementById("watch-demo-close")?.focus();
          });
        }}
      >
        <DialogTitle className="sr-only">Willow Vibes — Watch Demo</DialogTitle>
        <DialogDescription className="sr-only">
          A cinematic preview of the Willow Vibes meditation experience and its features.
        </DialogDescription>

        <div
          className="relative w-full overflow-hidden rounded-2xl ring-1 ring-cream/10"
          style={{
            background: "linear-gradient(160deg, #0e2a47 0%, #050f1f 100%)",
            boxShadow: "0 40px 120px -20px rgba(0,0,0,0.7)",
          }}
        >
          <button
            id="watch-demo-close"
            onClick={onClose}
            aria-label="Close demo video"
            className="absolute top-3 right-3 z-30 inline-flex items-center justify-center w-10 h-10 rounded-full bg-charcoal/55 hover:bg-charcoal/80 text-cream backdrop-blur-md ring-1 ring-cream/15 transition-colors focus:outline-none focus:ring-2 focus:ring-cream/70"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Video */}
          <div className="relative aspect-video w-full bg-charcoal">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src={videoSrc}
              poster={poster}
              controls
              playsInline
              preload="metadata"
              autoPlay
              muted
              loop
            />

            {/* Soft gradient overlay for caption legibility */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-charcoal/75 via-charcoal/25 to-transparent" />

            {/* Animated feature caption */}
            <div className="pointer-events-none absolute left-5 sm:left-8 bottom-20 sm:bottom-24 max-w-md">
              <div className="text-[10px] tracking-[0.25em] uppercase text-cream/70 font-calm-body mb-2">
                Inside Willow Vibes
              </div>
              <div key={activeIdx} className="animate-fade-in">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = FEATURES[activeIdx].icon;
                    return (
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-card/15 backdrop-blur-md ring-1 ring-cream/20">
                        <Icon className="w-5 h-5 text-cream" />
                      </span>
                    );
                  })()}
                  <div>
                    <div className="font-calm-display text-xl sm:text-2xl text-cream font-semibold leading-tight">
                      {FEATURES[activeIdx].label}
                    </div>
                    <div className="font-calm-body text-sm text-cream/75">
                      {FEATURES[activeIdx].desc}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature strip below video */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 px-4 sm:px-6 py-4 bg-gradient-to-b from-[#0a1f3a] to-[#050f1f]">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const active = i === activeIdx;
              return (
                <button
                  key={f.label}
                  onClick={() => setActiveIdx(i)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                    active
                      ? "bg-card/10 ring-1 ring-cream/25"
                      : "hover:bg-card/5 ring-1 ring-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-cream" : "text-cream/55"}`} />
                  <span className={`text-[10px] font-calm-body text-center leading-tight ${
                    active ? "text-cream" : "text-cream/55"
                  }`}>
                    {f.label.split(" ").slice(0, 2).join(" ")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

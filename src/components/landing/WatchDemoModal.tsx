import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface WatchDemoModalProps {
  open: boolean;
  onClose: () => void;
  /** Optional MP4/WebM source. Defaults to a calm sample loop. */
  videoSrc?: string;
  poster?: string;
}

const DEFAULT_SRC =
  "https://cdn.coverr.co/videos/coverr-meditating-on-a-mountain-3146/1080p.mp4";

/**
 * Premium hero video modal.
 * Uses shadcn Dialog (Radix) — focus trap, ESC, scroll lock, aria are built-in.
 */
export default function WatchDemoModal({
  open,
  onClose,
  videoSrc = DEFAULT_SRC,
  poster,
}: WatchDemoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset playback whenever the modal opens/closes
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (open) {
      v.currentTime = 0;
      v.play().catch(() => {
        /* autoplay may be blocked — user can hit play */
      });
    } else {
      v.pause();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="p-0 border-0 bg-transparent shadow-none max-w-[min(1100px,95vw)] sm:max-w-[min(1100px,92vw)] [&>button]:hidden"
        onOpenAutoFocus={(e) => {
          // Let Radix manage focus, but start it on the close button (rendered below)
          e.preventDefault();
          requestAnimationFrame(() => {
            document
              .getElementById("watch-demo-close")
              ?.focus();
          });
        }}
      >
        <DialogTitle className="sr-only">Willow Vibes — Watch Demo</DialogTitle>
        <DialogDescription className="sr-only">
          A short cinematic preview of the Willow Vibes meditation experience.
        </DialogDescription>

        <div
          className="relative w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10"
          style={{ boxShadow: "0 40px 120px -20px rgba(0,0,0,0.7)" }}
        >
          <button
            id="watch-demo-close"
            onClick={onClose}
            aria-label="Close demo video"
            className="absolute top-3 right-3 z-20 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/55 hover:bg-black/80 text-white backdrop-blur-md ring-1 ring-white/15 transition-colors focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="aspect-video w-full bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src={videoSrc}
              poster={poster}
              controls
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

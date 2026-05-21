// Shareable Wellness Card — generates a branded PNG of weekly stats for users
// to drop into Instagram Stories or Twitter. Uses html-to-image so the rendered
// card on screen is exactly what gets exported (no Canvas drift).
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getCurrentStreak, getCompletedDays, getTotalMinutes, getAllDayStates } from "@/lib/userStore";

function weeklyMinutes(): number {
  const states = getAllDayStates();
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let total = 0;
  Object.values(states).forEach((s) => {
    if (s?.completedAt && s.checklist?.every(Boolean)) {
      const t = new Date(s.completedAt).getTime();
      if (t >= cutoff) total += s.duration || 15;
    }
  });
  return total;
}

function weeklySessions(): number {
  const states = getAllDayStates();
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let n = 0;
  Object.values(states).forEach((s) => {
    if (s?.completedAt && s.checklist?.every(Boolean)) {
      const t = new Date(s.completedAt).getTime();
      if (t >= cutoff) n++;
    }
  });
  return n;
}

export default function ShareableWellnessCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const streak = getCurrentStreak();
  const sessions = weeklySessions();
  const minutes = weeklyMinutes();
  const completed = getCompletedDays().length;
  const week = new Date().toLocaleDateString(undefined, { month: "long", day: "numeric" });

  const exportPng = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "transparent",
      });
      // Trigger native share if available
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `willow-week-of-${week}.png`, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: "My Willow Vibes week", text: `${streak}-day streak · ${minutes} mindful minutes this week 🌿` });
          setBusy(false);
          return;
        }
      } catch {
        // ignore — fall through to download
      }
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `willow-week-of-${week}.png`;
      a.click();
      toast.success("Card downloaded — share it to your story!");
    } catch (e) {
      console.error(e);
      toast.error("Couldn't export the card. Try again?");
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-border bg-card p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground">
            Share your week
          </h3>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            Export a card for Instagram Stories or text it to a friend.
          </p>
        </div>
        <button
          onClick={exportPng}
          disabled={busy}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[hsl(var(--sage-dark))] to-[hsl(var(--primary))] text-white font-body font-semibold text-sm hover:scale-105 active:scale-95 transition-transform disabled:opacity-60"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
          {busy ? "Exporting…" : "Share"}
        </button>
      </div>

      {/* The card preview — also the canvas that gets exported. */}
      <div className="overflow-hidden rounded-2xl">
        <div
          ref={cardRef}
          className="relative w-full aspect-[9/16] max-w-[340px] mx-auto rounded-2xl text-[hsl(var(--cream))] p-7 flex flex-col justify-between"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--forest-deep)) 0%, hsl(var(--forest)) 45%, hsl(var(--forest-mid)) 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background:
                "radial-gradient(circle at 80% 15%, hsl(var(--gold) / 0.55) 0%, transparent 55%), radial-gradient(circle at 10% 95%, hsl(var(--sage) / 0.35) 0%, transparent 55%)",
            }}
          />
          <div className="relative">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--gold-light))]">
              Willow Vibes · Week of {week}
            </p>
            <h2 className="font-display text-3xl font-bold mt-3 leading-tight">
              My mindful<br/>week
            </h2>
          </div>

          <div className="relative grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[hsl(var(--cream))]/8 backdrop-blur-md border border-[hsl(var(--cream))]/12 p-3">
              <p className="text-[9px] font-body uppercase tracking-wider text-[hsl(var(--cream))]/70">Streak</p>
              <p className="font-display text-2xl font-bold mt-1 tabular-nums">{streak}d</p>
            </div>
            <div className="rounded-2xl bg-[hsl(var(--cream))]/8 backdrop-blur-md border border-[hsl(var(--cream))]/12 p-3">
              <p className="text-[9px] font-body uppercase tracking-wider text-[hsl(var(--cream))]/70">Sessions</p>
              <p className="font-display text-2xl font-bold mt-1 tabular-nums">{sessions}</p>
            </div>
            <div className="rounded-2xl bg-[hsl(var(--cream))]/8 backdrop-blur-md border border-[hsl(var(--cream))]/12 p-3">
              <p className="text-[9px] font-body uppercase tracking-wider text-[hsl(var(--cream))]/70">Minutes</p>
              <p className="font-display text-2xl font-bold mt-1 tabular-nums">{minutes}</p>
            </div>
            <div className="rounded-2xl bg-[hsl(var(--cream))]/8 backdrop-blur-md border border-[hsl(var(--cream))]/12 p-3">
              <p className="text-[9px] font-body uppercase tracking-wider text-[hsl(var(--cream))]/70">Days Done</p>
              <p className="font-display text-2xl font-bold mt-1 tabular-nums">{completed}/30</p>
            </div>
          </div>

          <div className="relative">
            <p className="font-body italic text-sm text-[hsl(var(--cream))]/85">
              "Small daily practice compounds into a life that feels like home."
            </p>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--gold-light))] mt-3">
              willowvibes.com
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={exportPng}
        disabled={busy}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-border bg-secondary/30 hover:bg-secondary/50 text-foreground font-body text-sm transition-colors"
      >
        <Download className="w-4 h-4" /> Download as PNG
      </button>
    </motion.div>
  );
}

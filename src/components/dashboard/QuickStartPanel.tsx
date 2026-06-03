// Premium one-tap launcher for the user's next practice.
// Picks the in-progress 7-day program day if available, otherwise the next
// 30-day course day. Falls back to a quick breathing session.
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Clock, Sparkles, ArrowRight, Wind, Headphones } from "lucide-react";
import { VAGUS_NERVE_RESET } from "@/data/programs/vagusNerveReset";
import { getNextDay, getCompletedDays } from "@/lib/userStore";
import { weeks } from "@/data/courseData";

interface QuickStartPanelProps {
  onQuickSession?: () => void;
}

function getProgramCompleted(): number[] {
  try {
    const raw = localStorage.getItem(`willow:program:${VAGUS_NERVE_RESET.id}:progress`);
    return raw ? (JSON.parse(raw) as number[]).filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

export default function QuickStartPanel({ onQuickSession }: QuickStartPanelProps) {
  const programDone = getProgramCompleted();
  const programInProgress = programDone.length > 0 && programDone.length < VAGUS_NERVE_RESET.days.length;

  // Primary recommendation
  let title: string;
  let subtitle: string;
  let duration: string;
  let href: string;
  let badge: string;

  if (programInProgress) {
    const nextProgramDay = programDone.length + 1;
    const day = VAGUS_NERVE_RESET.days.find((d) => d.day === nextProgramDay)!;
    title = day.title;
    subtitle = `Day ${nextProgramDay} · Vagus Nerve Reset`;
    duration = day.duration;
    href = `/app/programs/${VAGUS_NERVE_RESET.id}/day/${nextProgramDay}`;
    badge = "Continue Program";
  } else {
    const nextDay = getNextDay();
    const allDays = weeks.flatMap((w) => w.days);
    const dayData = allDays.find((d) => d.day === nextDay);
    title = dayData?.title ?? "Today's Practice";
    subtitle = `Day ${nextDay} · 30-Day Journey`;
    duration = dayData?.duration ?? "10 min";
    href = `/day/${nextDay}`;
    badge = getCompletedDays().length === 0 ? "Begin Journey" : "Resume Journey";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative overflow-hidden rounded-[28px] border border-[hsl(var(--gold)/0.3)] bg-gradient-to-br from-[hsl(var(--cream))] via-[hsl(var(--ivory))] to-[hsl(var(--champagne)/0.4)] shadow-[var(--shadow-elevated-val)]"
    >
      {/* Ambient glows */}
      <span aria-hidden className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[hsl(var(--gold)/0.18)] blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-[hsl(var(--sage)/0.18)] blur-3xl" />

      {/* Gold corner filigree */}
      <span aria-hidden className="pointer-events-none absolute top-3 left-3 w-8 h-8 border-l border-t border-[hsl(var(--gold)/0.5)] rounded-tl-xl" />
      <span aria-hidden className="pointer-events-none absolute top-3 right-3 w-8 h-8 border-r border-t border-[hsl(var(--gold)/0.5)] rounded-tr-xl" />
      <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 w-8 h-8 border-l border-b border-[hsl(var(--gold)/0.5)] rounded-bl-xl" />
      <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 w-8 h-8 border-r border-b border-[hsl(var(--gold)/0.5)] rounded-br-xl" />

      <div className="relative p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="h-px w-8 bg-[hsl(var(--gold)/0.6)]" />
          <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--gold-dark))]" />
          <span className="text-[10px] font-bold tracking-[0.32em] uppercase text-[hsl(var(--gold-dark))]">
            Quick Start · One Tap
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-body font-semibold text-[hsl(var(--forest))] tracking-wide">
              {subtitle}
            </p>
            <h3 className="font-display text-2xl sm:text-3xl text-[hsl(var(--forest-deep))] leading-tight mt-1.5">
              {title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(var(--forest)/0.08)] text-[11px] font-body font-medium text-[hsl(var(--forest))]">
                <Clock className="w-3 h-3" /> {duration}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(var(--gold)/0.18)] text-[11px] font-body font-semibold text-[hsl(var(--gold-dark))] border border-[hsl(var(--gold)/0.3)]">
                {badge}
              </span>
            </div>
          </div>

          {/* Big tap target — play button */}
          <Link
            to={href}
            aria-label={`Begin ${title}`}
            className="group hidden sm:flex w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-light))] items-center justify-center shadow-[var(--shadow-gold-val)] hover:scale-105 transition-transform flex-shrink-0 relative"
          >
            <span className="absolute inset-0 rounded-full bg-[hsl(var(--gold)/0.5)] animate-ping opacity-30 group-hover:opacity-50" />
            <Play className="w-8 h-8 text-[hsl(var(--charcoal))] relative ml-1" />
          </Link>
        </div>

        {/* Primary CTA (full-width on mobile) */}
        <Link
          to={href}
          className="group mt-6 sm:hidden inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-light))] text-[hsl(var(--charcoal))] font-body font-bold text-sm shadow-[var(--shadow-gold-val)] hover:brightness-110 transition-all"
        >
          <Play className="w-4 h-4" /> Begin Now <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {/* Alternate one-tap options */}
        <div className="mt-6 pt-5 border-t border-[hsl(var(--gold)/0.2)] grid grid-cols-3 gap-2">
          <Link
            to="/app/breathing"
            aria-label="Start a 5-minute breathing practice"
            className="group flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card/60 backdrop-blur-sm border border-[hsl(var(--cream-dark))] hover:border-[hsl(var(--gold)/0.4)] transition-all"
          >
            <Wind className="w-4 h-4 text-[hsl(var(--forest))] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-body font-semibold text-charcoal">5-min Breath</span>
          </Link>
          <Link
            to="/app/sound-bath"
            aria-label="Open the sound bath"
            className="group flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card/60 backdrop-blur-sm border border-[hsl(var(--cream-dark))] hover:border-[hsl(var(--gold)/0.4)] transition-all"
          >
            <Headphones className="w-4 h-4 text-[hsl(var(--forest))] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-body font-semibold text-charcoal">Sound Bath</span>
          </Link>
          <Link
            to="/app/sos"
            aria-label="Open SOS calm rescue"
            className="group flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card/60 backdrop-blur-sm border border-[hsl(var(--cream-dark))] hover:border-[hsl(var(--gold)/0.4)] transition-all"
          >
            <Sparkles className="w-4 h-4 text-[hsl(var(--forest))] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-body font-semibold text-charcoal">SOS Calm</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

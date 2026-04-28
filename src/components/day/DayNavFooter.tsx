import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";

interface DayNavFooterProps {
  prevDay: number | null;
  nextDay: number | null;
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
}

export default function DayNavFooter({ prevDay, nextDay, onPrev, onNext, onComplete }: DayNavFooterProps) {
  return (
    <div className="flex items-center justify-between gap-4 pt-4 pb-8">
      {prevDay ? (
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary/10 text-primary font-body font-medium text-sm hover:bg-primary/20 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Day {prevDay}
        </button>
      ) : <div />}

      <Link
        to="/course"
        className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-border bg-card text-foreground font-body text-sm hover:bg-secondary/60 transition-colors"
      >
        <LayoutDashboard className="w-4 h-4" /> Dashboard
      </Link>

      {nextDay ? (
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-card font-body font-semibold text-sm hover:bg-gold/90 transition-colors shadow-md"
        >
          Day {nextDay} <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          onClick={onComplete}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-card font-body font-semibold text-sm hover:bg-gold/90 transition-colors shadow-md"
        >
          Complete! 🎉 <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

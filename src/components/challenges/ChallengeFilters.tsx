// Branded filter chips for challenge categories with active forest pill state.
import { motion } from "framer-motion";

interface Props {
  categories: string[];
  active: string;
  onChange: (c: string) => void;
  sort: "recommended" | "duration" | "progress";
  onSortChange: (s: "recommended" | "duration" | "progress") => void;
}

export default function ChallengeFilters({ categories, active, onChange, sort, onSortChange }: Props) {
  const sorts = [
    { id: "recommended" as const, label: "Recommended" },
    { id: "duration" as const, label: "Duration" },
    { id: "progress" as const, label: "Progress" },
  ];
  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {categories.map(c => {
          const isActive = active === c;
          return (
            <motion.button
              key={c}
              whileTap={{ scale: 0.96 }}
              onClick={() => onChange(c)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-body font-semibold transition-all ${
                isActive
                  ? "bg-[hsl(var(--forest))] text-white shadow-[var(--shadow-soft-val)]"
                  : "bg-[hsl(var(--sage-light))] text-[hsl(var(--forest))] hover:bg-[hsl(var(--sage))]/40 border border-[hsl(var(--sage))]/40"
              }`}
            >
              {c}
            </motion.button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-body uppercase tracking-[0.2em] text-muted-foreground">Sort</span>
        <div className="flex gap-1 p-0.5 rounded-full bg-[hsl(var(--cream-dark))]/60 border border-[hsl(var(--cream-dark))]">
          {sorts.map(s => (
            <button
              key={s.id}
              onClick={() => onSortChange(s.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-body font-semibold transition-all ${
                sort === s.id ? "bg-white text-[hsl(var(--forest))] shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

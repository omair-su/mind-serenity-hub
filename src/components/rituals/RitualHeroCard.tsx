import { motion } from "framer-motion";
import type { RitualMeta } from "@/data/extraRituals";
import { Clock, ChevronRight, Crown } from "lucide-react";

interface RitualHeroCardProps {
  meta: RitualMeta;
  onClick: () => void;
  locked?: boolean;
  index?: number;
}

export default function RitualHeroCard({ meta, onClick, locked, index = 0 }: RitualHeroCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 text-left hover:shadow-elevated hover:-translate-y-1 transition-all duration-500 w-full"
    >
      <div className="h-44 overflow-hidden relative">
        <img
          src={meta.heroImage}
          alt={meta.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${meta.accent}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        {locked && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gold/90 backdrop-blur-sm flex items-center gap-1 shadow-lg">
            <Crown className="w-3 h-3 text-white" />
            <span className="text-[9px] font-body font-bold uppercase tracking-wider text-white">Plus</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 text-3xl drop-shadow-lg">{meta.iconEmoji}</div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-foreground">{meta.name}</h3>
        <p className="text-xs font-body text-muted-foreground mt-1 leading-relaxed">{meta.tagline}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5 text-[10px] font-body text-muted-foreground">
            <Clock className="w-3 h-3" /> {meta.duration} · {meta.steps} steps
          </div>
          <ChevronRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </motion.button>
  );
}

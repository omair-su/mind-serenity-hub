// Image-led environment tile with ambient preview.
import type { WalkingEnvironment } from "@/data/walkingTechniques";
import { Check } from "lucide-react";

interface Props {
  env: WalkingEnvironment;
  active: boolean;
  onSelect: () => void;
}

export default function WalkEnvironmentCard({ env, active, onSelect }: Props) {
  const Icon = env.icon;
  return (
    <button
      onClick={onSelect}
      className={`group relative rounded-2xl overflow-hidden text-left transition-all aspect-[4/3] ${
        active ? "ring-2 ring-[hsl(var(--gold))] shadow-gold scale-[1.02]" : "ring-1 ring-border hover:ring-primary/30"
      }`}
    >
      <img
        src={env.imageUrl}
        alt={env.label}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${env.tint}`} />
      {active && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[hsl(var(--gold))] flex items-center justify-center shadow-lg z-10">
          <Check className="w-3.5 h-3.5 text-[hsl(var(--charcoal))]" strokeWidth={3} />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-3 z-10">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Icon className="w-3.5 h-3.5 text-white/90" />
          <p className="text-xs font-display font-bold text-white">{env.label}</p>
        </div>
        <p className="text-[10px] font-body text-white/70 leading-tight line-clamp-2">{env.desc}</p>
      </div>
    </button>
  );
}

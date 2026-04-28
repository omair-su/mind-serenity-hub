import { Leaf } from "lucide-react";

interface PreparationBoxProps {
  preparation: string;
  duration: string;
}

export default function PreparationBox({ preparation, duration }: PreparationBoxProps) {
  return (
    <div className="relative overflow-hidden bg-[hsl(var(--cream))]/70 rounded-2xl p-8 border border-[hsl(var(--border))] shadow-soft">
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[hsl(var(--forest))]/8 blur-2xl pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-4">
          <Leaf className="w-5 h-5 text-[hsl(var(--forest))]" />
          <h2 className="font-display text-xl font-semibold text-[hsl(var(--charcoal))]">Before You Begin</h2>
        </div>
        <p className="font-body text-base leading-[2] text-[hsl(var(--charcoal))]/80">{preparation}</p>
        <ul className="mt-4 space-y-2 font-body text-sm text-[hsl(var(--charcoal-soft))]">
          <li className="flex items-start gap-2"><Leaf className="w-3.5 h-3.5 text-[hsl(var(--forest))] mt-1 flex-shrink-0" /> Find a quiet, comfortable space</li>
          <li className="flex items-start gap-2"><Leaf className="w-3.5 h-3.5 text-[hsl(var(--forest))] mt-1 flex-shrink-0" /> Set timer for {duration}</li>
          <li className="flex items-start gap-2"><Leaf className="w-3.5 h-3.5 text-[hsl(var(--forest))] mt-1 flex-shrink-0" /> Turn off notifications</li>
          <li className="flex items-start gap-2"><Leaf className="w-3.5 h-3.5 text-[hsl(var(--forest))] mt-1 flex-shrink-0" /> Have your journal nearby</li>
        </ul>
      </div>
    </div>
  );
}

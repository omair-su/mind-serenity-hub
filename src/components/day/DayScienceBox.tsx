import { FlaskConical } from "lucide-react";

interface DayScienceBoxProps {
  text: string;
  source: string;
}

export default function DayScienceBox({ text, source }: DayScienceBoxProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[hsl(var(--cream))]/70 border border-[hsl(var(--gold))]/25 p-8 shadow-soft">
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[hsl(var(--gold))]/10 blur-2xl pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--gold))]/15 flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-[hsl(var(--gold-dark))]" />
          </div>
          <div>
            <span className="text-[10px] font-body font-bold tracking-[0.25em] uppercase text-[hsl(var(--gold-dark))]">The Science</span>
            <p className="text-sm font-display font-semibold text-[hsl(var(--charcoal))]">Why This Works</p>
          </div>
        </div>
        <p className="text-base font-body leading-[2] text-[hsl(var(--charcoal))]/85">{text}</p>
        <p className="text-xs font-body text-[hsl(var(--charcoal-soft))] mt-4 italic border-t border-[hsl(var(--gold))]/15 pt-3">{source}</p>
      </div>
    </div>
  );
}

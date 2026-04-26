import { FlaskConical } from "lucide-react";

interface ScienceBoxProps {
  text: string;
  source: string;
}

export default function ScienceBox({ text, source }: ScienceBoxProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cream via-cream-dark/40 to-gold/10 dark:from-forest-deep/40 dark:via-forest/20 dark:to-gold/10 border border-gold/25 p-6 sm:p-8 shadow-soft">
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-bl from-gold/15 to-transparent" />
      <div className="absolute bottom-0 left-0 w-32 h-16 bg-gradient-to-tr from-gold/15 to-transparent rounded-tr-full" />
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold/25 to-gold-dark/20 flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-gold" />
          </div>
          <span className="text-xs font-body font-bold tracking-widest uppercase text-gold">Science Says</span>
        </div>
        <p className="text-sm font-body leading-relaxed text-foreground/80">{text}</p>
        <p className="text-xs font-body text-muted-foreground mt-3 italic border-t border-gold/15 pt-3">📚 {source}</p>
      </div>
    </div>
  );
}

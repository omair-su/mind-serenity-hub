import { Heart } from "lucide-react";

interface CoachBoxProps {
  text: string;
}

export default function CoachBox({ text }: CoachBoxProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100/80 via-teal-50/60 to-sage-light/40 dark:from-emerald-900/30 dark:via-teal-900/20 dark:to-primary/10 border border-primary/20 p-6 sm:p-8 shadow-soft">
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-bl from-primary/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-32 h-16 bg-gradient-to-tr from-sage/10 to-transparent rounded-tr-full" />
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-sage/30 flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs font-body font-bold tracking-widest uppercase text-primary">Coach's Note</span>
        </div>
        <p className="text-sm font-body leading-relaxed text-foreground/80 italic">{text}</p>
      </div>
    </div>
  );
}

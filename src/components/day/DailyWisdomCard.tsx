import { Lightbulb, X } from "lucide-react";

export interface WisdomCard {
  title: string;
  insight: string;
  icon: string;
}

interface DailyWisdomCardProps {
  selected: WisdomCard;
  onOpen: () => void;
}

export function DailyWisdomCard({ selected, onOpen }: DailyWisdomCardProps) {
  return (
    <div
      className="relative overflow-hidden bg-[hsl(var(--cream))]/70 rounded-2xl border border-[hsl(var(--gold))]/25 p-8 shadow-soft cursor-pointer hover:shadow-md transition-all"
      onClick={onOpen}
    >
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[hsl(var(--gold))]/10 blur-2xl pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{selected.icon}</span>
          <Lightbulb className="w-5 h-5 text-[hsl(var(--gold-dark))]/70" />
        </div>
        <p className="text-[10px] font-body font-bold tracking-[0.25em] uppercase text-[hsl(var(--gold-dark))] mb-2">Daily Wisdom</p>
        <h3 className="font-display text-xl font-semibold text-[hsl(var(--charcoal))] mb-2">{selected.title}</h3>
        <p className="font-body text-base text-[hsl(var(--charcoal))]/85 italic leading-relaxed">{selected.insight}</p>
        <p className="text-xs font-body text-[hsl(var(--charcoal-soft))] mt-4 pt-4 border-t border-[hsl(var(--gold))]/15">Tap to explore more wisdom</p>
      </div>
    </div>
  );
}

interface WisdomDialogProps {
  open: boolean;
  cards: WisdomCard[];
  selected: WisdomCard;
  onSelect: (card: WisdomCard) => void;
  onClose: () => void;
}

export function WisdomDialog({ open, cards, selected, onSelect, onClose }: WisdomDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl max-w-md w-full p-8 shadow-2xl border border-border/50">
        <div className="flex items-start justify-between mb-4">
          <span className="text-4xl">{selected.icon}</span>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <h2 className="font-display text-2xl font-semibold text-foreground mb-3">{selected.title}</h2>
        <p className="font-body text-lg text-foreground/80 leading-relaxed mb-6 italic">{selected.insight}</p>
        <div className="space-y-2">
          {cards.map((card, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(card)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selected.title === card.title ? "bg-primary/20 border border-primary/30" : "hover:bg-secondary/60"
              }`}
            >
              <p className="text-sm font-body font-semibold text-foreground">{card.icon} {card.title}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

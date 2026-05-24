import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "forest" | "gold" | "ghost";

interface LuxeCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  interactive?: boolean;
  padded?: boolean;
}

const variantMap: Record<Variant, string> = {
  default:
    "bg-card border border-[hsl(var(--cream-dark))] shadow-[0_4px_24px_hsl(139_37%_15%/0.06)]",
  forest:
    "bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--forest-mid))] text-cream border border-[hsl(var(--gold)/0.2)] shadow-[var(--shadow-elevated-val)]",
  gold:
    "bg-gradient-to-br from-[hsl(var(--gold-light)/0.4)] via-card to-[hsl(var(--cream))] border border-[hsl(var(--gold)/0.35)] shadow-[var(--shadow-gold-val)]",
  ghost:
    "bg-card/60 backdrop-blur-md border border-[hsl(var(--sage)/0.3)]",
};

/**
 * Luxe card surface — replaces ad-hoc rounded-3xl divs.
 * Use `forest` for premium dark cards, `gold` for highlight modules.
 */
const LuxeCard = forwardRef<HTMLDivElement, LuxeCardProps>(
  ({ className, variant = "default", interactive = false, padded = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[24px] transition-all duration-300",
          variantMap[variant],
          padded && "p-6 md:p-8",
          interactive && "hover:-translate-y-1 hover:shadow-[var(--shadow-elevated-val)] cursor-pointer",
          className,
        )}
        {...props}
      />
    );
  },
);
LuxeCard.displayName = "LuxeCard";

export default LuxeCard;

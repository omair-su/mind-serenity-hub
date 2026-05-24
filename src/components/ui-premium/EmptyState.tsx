import { ReactNode } from "react";
import { LucideIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center py-14 px-6 rounded-3xl",
        "bg-gradient-to-b from-[hsl(var(--sage-light)/0.4)] to-card",
        "border border-dashed border-[hsl(var(--sage)/0.5)]",
        className,
      )}
    >
      <div className="relative w-20 h-20 mb-5">
        <div className="absolute inset-0 rounded-full bg-[hsl(var(--gold)/0.15)] animate-breathe" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[hsl(var(--forest))] to-[hsl(var(--forest-deep))] flex items-center justify-center shadow-[var(--shadow-card-val)]">
          <Icon className="w-8 h-8 text-[hsl(var(--gold-light))]" />
        </div>
      </div>
      <h3 className="text-xl md:text-2xl font-display font-bold text-charcoal mb-2">{title}</h3>
      {description && (
        <p className="text-sm md:text-base text-charcoal-soft max-w-md leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

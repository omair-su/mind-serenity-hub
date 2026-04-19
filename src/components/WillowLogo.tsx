import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo/willow-logo-premium.png";

interface WillowLogoProps {
  variant?: "full" | "horizontal" | "vertical" | "icon" | "wordmark";
  colorScheme?: "default" | "light" | "mono-navy" | "mono-white";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: { icon: 24, text: "text-sm", gap: "gap-1.5", tracking: "tracking-[0.12em]" },
  sm: { icon: 32, text: "text-lg", gap: "gap-2", tracking: "tracking-[0.14em]" },
  md: { icon: 40, text: "text-xl", gap: "gap-2.5", tracking: "tracking-[0.15em]" },
  lg: { icon: 56, text: "text-2xl", gap: "gap-3", tracking: "tracking-[0.16em]" },
  xl: { icon: 72, text: "text-3xl", gap: "gap-4", tracking: "tracking-[0.18em]" },
};

function LogoIcon({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={logoImg}
      alt="Willow Vibes Logo"
      width={size}
      height={size}
      className={cn("flex-shrink-0 object-contain", className)}
    />
  );
}

function LogoWordmark({
  textClass,
  tracking,
  willowColor,
  vibesColor,
  tmColor,
}: {
  textClass: string;
  tracking: string;
  willowColor: string;
  vibesColor: string;
  tmColor: string;
}) {
  return (
    <span
      className={cn(
        "font-display font-light leading-none select-none",
        textClass,
        tracking
      )}
    >
      <span className={willowColor}>Willow</span>{" "}
      <span className={vibesColor}>Vibes</span>
      <sup className={cn("text-[0.45em] font-body font-normal ml-0.5 align-super", tmColor)}>
        ™
      </sup>
    </span>
  );
}

export default function WillowLogo({
  variant = "horizontal",
  colorScheme = "default",
  size = "md",
  className,
}: WillowLogoProps) {
  const s = sizeMap[size] || sizeMap.md;

  // Colour schemes
  const colors = {
    default: {
      willow: "text-foreground",        // Navy/charcoal
      vibes: "text-primary",            // Forest green
      tm: "text-muted-foreground/60",
    },
    light: {
      willow: "text-cream",
      vibes: "text-cream",
      tm: "text-cream/50",
    },
    "mono-navy": {
      willow: "text-primary",
      vibes: "text-primary",
      tm: "text-primary/50",
    },
    "mono-white": {
      willow: "text-white",
      vibes: "text-white",
      tm: "text-white/50",
    },
  };

  const c = colors[colorScheme] || colors.default;

  if (variant === "icon") {
    return (
      <div className={className}>
        <LogoIcon size={s.icon} />
      </div>
    );
  }

  if (variant === "wordmark") {
    return (
      <div className={className}>
        <LogoWordmark
          textClass={s.text}
          tracking={s.tracking}
          willowColor={c.willow}
          vibesColor={c.vibes}
          tmColor={c.tm}
        />
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        <LogoIcon size={s.icon} />
        <LogoWordmark
          textClass={s.text}
          tracking={s.tracking}
          willowColor={c.willow}
          vibesColor={c.vibes}
          tmColor={c.tm}
        />
      </div>
    );
  }

  // horizontal (default / "full")
  return (
    <div className={cn("flex items-center", s.gap, className)}>
      <LogoIcon size={s.icon} />
      <div className="flex flex-col">
        <LogoWordmark
          textClass={s.text}
          tracking={s.tracking}
          willowColor={c.willow}
          vibesColor={c.vibes}
          tmColor={c.tm}
        />
        <span className="text-[9px] text-muted-foreground/60 tracking-[0.25em] uppercase font-body mt-0.5">
          Mind · Body · Discipline
        </span>
      </div>
    </div>
  );
}

export { LogoIcon };

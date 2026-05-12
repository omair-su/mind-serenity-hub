import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo/willow-logo-premium.webp";

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

const LogoIcon = forwardRef<HTMLImageElement, { size?: number; className?: string; animated?: boolean }>(
  function LogoIcon({ size = 40, className, animated = false }, ref) {
    const radius = Math.round(size * 0.22);
    if (animated) {
      return (
        <span
          className={cn("relative inline-flex flex-shrink-0", className)}
          style={{ width: size, height: size }}
        >
          <span
            aria-hidden
            className="absolute -inset-2 rounded-[28%] blur-2xl opacity-70 animate-pulse"
            style={{
              background:
                "radial-gradient(circle, rgba(255,226,122,0.45) 0%, rgba(130,103,214,0.35) 45%, transparent 75%)",
            }}
          />
          <img
            ref={ref}
            src={logoImg}
            alt="Willow Vibes Logo"
            width={size}
            height={size}
            className="relative flex-shrink-0 object-cover drop-shadow-[0_8px_24px_rgba(130,103,214,0.55)] ring-1 ring-white/10"
            style={{
              borderRadius: radius,
              animation: "willow-float 5s ease-in-out infinite",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              borderRadius: radius,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 40%)",
              mixBlendMode: "overlay",
            }}
          />
          <style>{`
            @keyframes willow-float {
              0%, 100% { transform: translateY(0) rotate(0); }
              50% { transform: translateY(-3px) rotate(-1.2deg); }
            }
          `}</style>
        </span>
      );
    }
    return (
      <img
        ref={ref}
        src={logoImg}
        alt="Willow Vibes Logo"
        width={size}
        height={size}
        className={cn("flex-shrink-0 object-cover", className)}
        style={{ borderRadius: radius }}
      />
    );
  }
);

interface LogoWordmarkProps {
  textClass: string;
  tracking: string;
  willowColor: string;
  vibesColor: string;
  tmColor: string;
}

const LogoWordmark = forwardRef<HTMLSpanElement, LogoWordmarkProps>(
  function LogoWordmark({ textClass, tracking, willowColor, vibesColor, tmColor }, ref) {
    return (
      <span
        ref={ref}
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
);

const WillowLogo = forwardRef<HTMLDivElement, WillowLogoProps>(function WillowLogo(
  { variant = "horizontal", colorScheme = "default", size = "md", className },
  ref
) {
  const s = sizeMap[size];

  const colors = {
    default: {
      willow: "text-foreground",
      vibes: "text-primary",
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

  const c = colors[colorScheme];

  if (variant === "icon") {
    return (
      <div ref={ref} className={className}>
        <LogoIcon size={s.icon} />
      </div>
    );
  }

  if (variant === "wordmark") {
    return (
      <div ref={ref} className={className}>
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
      <div ref={ref} className={cn("flex flex-col items-center gap-2", className)}>
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

  return (
    <div ref={ref} className={cn("flex items-center", s.gap, className)}>
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
});

export default WillowLogo;
export { LogoIcon };

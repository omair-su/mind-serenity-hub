import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  image?: string;
  breadcrumbs?: Crumb[];
  cta?: ReactNode;
  align?: "left" | "center";
  height?: "sm" | "md" | "lg";
  overlay?: "forest" | "onyx" | "soft";
  className?: string;
  children?: ReactNode;
}

const heightMap = {
  sm: "min-h-[280px] md:min-h-[340px]",
  md: "min-h-[380px] md:min-h-[460px]",
  lg: "min-h-[480px] md:min-h-[600px]",
};

const overlayMap = {
  forest:
    "bg-[linear-gradient(135deg,hsl(var(--forest-deep)/0.92)_0%,hsl(var(--forest)/0.78)_55%,hsl(var(--forest-mid)/0.85)_100%)]",
  onyx: "bg-[linear-gradient(135deg,hsl(var(--onyx)/0.85)_0%,hsl(var(--onyx-soft)/0.75)_100%)]",
  soft: "bg-[linear-gradient(180deg,hsl(var(--cream)/0.6)_0%,hsl(var(--cream))_100%)]",
};

/**
 * Premium hero block for any authenticated/marketing page.
 * Branded forest+gold aesthetic with optional cinematic background image.
 */
export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  breadcrumbs,
  cta,
  align = "left",
  height = "md",
  overlay = "forest",
  className,
  children,
}: PageHeroProps) {
  const isDark = overlay !== "soft";
  const textColor = isDark ? "text-cream" : "text-charcoal";
  const eyebrowColor = isDark ? "text-[hsl(var(--gold-light))]" : "text-[hsl(var(--forest))]";
  const descColor = isDark ? "text-cream/85" : "text-charcoal/75";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-[hsl(var(--gold)/0.18)] shadow-[var(--shadow-card-val)]",
        heightMap[height],
        textColor,
        className,
      )}
    >
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
      )}
      <div className={cn("absolute inset-0", overlayMap[overlay])} />
      {/* Gold corner accents */}
      <div className="pointer-events-none absolute top-6 right-6 w-16 h-16 border-t border-r border-[hsl(var(--gold)/0.4)] rounded-tr-2xl" />
      <div className="pointer-events-none absolute bottom-6 left-6 w-16 h-16 border-b border-l border-[hsl(var(--gold)/0.4)] rounded-bl-2xl" />

      <div
        className={cn(
          "relative z-10 h-full w-full flex flex-col justify-end p-7 md:p-12 lg:p-16",
          align === "center" && "items-center text-center justify-center",
        )}
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className={cn("flex items-center gap-1.5 text-xs mb-4 opacity-80", isDark && "text-cream/70")}>
            {breadcrumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {c.to ? (
                  <Link to={c.to} className="hover:underline underline-offset-4">
                    {c.label}
                  </Link>
                ) : (
                  <span>{c.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3" />}
              </span>
            ))}
          </nav>
        )}

        {eyebrow && (
          <span
            className={cn(
              "text-[11px] md:text-xs font-bold tracking-[0.32em] uppercase mb-4",
              eyebrowColor,
            )}
          >
            {eyebrow}
          </span>
        )}

        <h1
          className={cn(
            "font-display font-bold leading-[1.04] tracking-tight",
            "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
            align === "center" ? "max-w-3xl" : "max-w-2xl",
          )}
        >
          {title}
        </h1>

        {description && (
          <p
            className={cn(
              "mt-5 text-base md:text-lg leading-relaxed max-w-2xl",
              descColor,
            )}
          >
            {description}
          </p>
        )}

        {cta && <div className={cn("mt-7", align === "center" && "flex justify-center")}>{cta}</div>}

        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}

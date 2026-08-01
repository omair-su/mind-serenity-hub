import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/* ============================================================
   Reveal — staggered fade-up on scroll (reduced-motion aware)
   ============================================================ */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "span";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/* ============================================================
   CountUp — animated number when scrolled into view
   ============================================================ */
export function CountUp({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1600,
  className,
  style,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce]);

  const formatted =
    decimals > 0
      ? val.toFixed(decimals)
      : Math.round(val).toLocaleString("en-US");

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/* ============================================================
   Marquee — slow infinite ribbon
   ============================================================ */
export function Marquee({
  items,
  speed = 40,
  className,
  itemClassName,
  style,
}: {
  items: ReactNode[];
  speed?: number;
  className?: string;
  itemClassName?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const loop = [...items, ...items];
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`} style={style}>
      <div
        className="flex items-center gap-12 w-max"
        style={
          reduce
            ? undefined
            : { animation: `wv-marquee ${speed}s linear infinite` }
        }
      >
        {loop.map((item, i) => (
          <span key={i} className={`shrink-0 ${itemClassName ?? ""}`}>
            {item}
          </span>
        ))}
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes wv-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`,
        }}
      />
    </div>
  );
}

/* ============================================================
   GrainOverlay — subtle printed-paper noise
   ============================================================ */
export function GrainOverlay({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-overlay"
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/* ============================================================
   GoldFiligree — hairline corner accents
   ============================================================ */
export function GoldFiligree({ inset = "1.25rem" }: { inset?: string }) {
  const line = "1px solid rgba(201,168,76,0.35)";
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute w-10 h-10"
        style={{ top: inset, left: inset, borderTop: line, borderLeft: line }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute w-10 h-10"
        style={{ bottom: inset, right: inset, borderBottom: line, borderRight: line }}
      />
    </>
  );
}

/* ============================================================
   DrawRule — thin gold divider that draws in on scroll
   ============================================================ */
export function DrawRule({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={`h-px origin-left ${className ?? ""}`}
      style={{
        background:
          "linear-gradient(90deg, rgba(201,168,76,0) 0%, rgba(201,168,76,0.55) 50%, rgba(201,168,76,0) 100%)",
      }}
      initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

/* ============================================================
   DeviceMockup — phone frame around an app screenshot
   ============================================================ */
export function DeviceMockup({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`relative mx-auto w-[240px] sm:w-[280px] ${className ?? ""}`}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        aria-hidden
        className="absolute -inset-8 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(168,192,160,0.4) 0%, rgba(201,168,76,0.18) 45%, transparent 72%)",
        }}
      />
      <div
        className="relative rounded-[2.4rem] p-2.5"
        style={{
          background: "linear-gradient(160deg, #2b3527 0%, #1f231d 60%, #3a4d36 100%)",
          boxShadow: "0 40px 80px -40px rgba(31,35,29,0.65)",
        }}
      >
        <div className="relative overflow-hidden rounded-[1.9rem] aspect-[9/19]">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <span
          aria-hidden
          className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-full"
          style={{ background: "rgba(245,240,232,0.35)" }}
        />
      </div>
    </motion.div>
  );
}

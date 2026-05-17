import { useEffect, useMemo, useRef } from "react";

/**
 * Pure CSS + SVG + minimal JS cosmic hero background.
 * No WebGL / Three.js. Renders everywhere.
 *
 * Layers:
 *  1. Breathing deep navy-purple gradient
 *  2. 3 aurora SVG waves (turbulence + blur)
 *  3. 3 sacred-geometry rotating rings (with dots)
 *  4. 24 floating particles
 *  5. Central pulsing glow orb
 *  6. Mouse parallax (desktop only) via rAF + lerp
 */
export default function HeroCosmicScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);

  // Pre-compute 24 particles once
  const particles = useMemo(() => {
    const colors = [
      "rgba(200,180,255,0.5)",
      "rgba(180,220,180,0.4)",
      "rgba(245,240,232,0.3)",
    ];
    return Array.from({ length: 24 }, (_, i) => ({
      key: i,
      size: 2 + Math.random() * 3,
      left: Math.random() * 100,
      delay: -Math.random() * 30,
      duration: 20 + Math.random() * 20,
      sway: 14 + Math.random() * 12,
      color: colors[i % colors.length],
    }));
  }, []);

  // Parallax
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    let raf = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onMove = (e: PointerEvent) => {
      const r = rootRef.current?.getBoundingClientRect();
      if (!r) return;
      target.x = (e.clientX - r.left) / r.width - 0.5;
      target.y = (e.clientY - r.top) / r.height - 0.5;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;
      if (ringsRef.current) ringsRef.current.style.transform = `translate3d(${current.x * 30}px, ${current.y * 30}px, 0)`;
      if (orbRef.current) orbRef.current.style.transform = `translate3d(${current.x * -16}px, ${current.y * -16}px, 0)`;
      if (auroraRef.current) auroraRef.current.style.transform = `translate3d(${current.x * 10}px, ${current.y * 10}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="hero-cosmic absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* SVG defs (turbulence + gaussian blur) */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="aurora-turb" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="3">
              <animate attributeName="baseFrequency" dur="30s" values="0.012 0.02;0.02 0.012;0.012 0.02" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="80" />
            <feGaussianBlur stdDeviation="50" />
          </filter>
        </defs>
      </svg>

      {/* Layer 1: breathing gradient */}
      <div className="hc-bg absolute inset-0" />

      {/* Layer 2: aurora waves */}
      <div ref={auroraRef} className="absolute inset-0">
        <svg className="hc-wave hc-wave-1" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <path d="M0,250 C300,180 600,320 900,240 C1050,200 1150,260 1200,230 L1200,400 L0,400 Z" fill="#7A9B76" filter="url(#aurora-turb)" />
        </svg>
        <svg className="hc-wave hc-wave-2" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <path d="M0,200 C200,260 500,140 800,220 C1000,270 1100,180 1200,210 L1200,400 L0,400 Z" fill="#9B8BC4" filter="url(#aurora-turb)" />
        </svg>
        <svg className="hc-wave hc-wave-3" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <path d="M0,120 C250,80 550,180 850,100 C1000,60 1120,140 1200,110 L1200,400 L0,400 Z" fill="#F5F0E8" filter="url(#aurora-turb)" />
        </svg>
      </div>

      {/* Layer 5: central glow orb (under rings) */}
      <div ref={orbRef} className="hc-orb-wrap absolute inset-0 flex items-center justify-center">
        <div className="hc-orb" />
      </div>

      {/* Layer 3: sacred-geometry rings */}
      <div ref={ringsRef} className="hc-rings absolute inset-0 flex items-center justify-center">
        <div className="hc-ring hc-ring-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="hc-dot" style={{ transform: `rotate(${i * 45}deg) translateY(-300px)` }} />
          ))}
        </div>
        <div className="hc-ring hc-ring-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="hc-dot hc-dot-sage" style={{ transform: `rotate(${i * 60}deg) translateY(-200px)` }} />
          ))}
        </div>
        <div className="hc-ring hc-ring-3" />
      </div>

      {/* Layer 4: particles */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <span
            key={p.key}
            className="hc-particle"
            style={{
              left: `${p.left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          >
            <span
              className="hc-particle-dot"
              style={{
                width: p.size,
                height: p.size,
                background: p.color,
                animationDuration: `${p.duration / 3}s`,
                ["--sway" as never]: `${p.sway}px`,
              }}
            />
          </span>
        ))}
      </div>

      <style>{`
        .hero-cosmic { contain: layout paint; }

        .hc-bg {
          background: linear-gradient(135deg, #0D0B1A, #1a1230, #150D2E, #0D0B1A);
          background-size: 300% 300%;
          animation: hc-breathe 12s ease-in-out infinite;
          will-change: background-position;
        }
        @keyframes hc-breathe {
          0%,100% { background-position: 0% 50%; }
          50%     { background-position: 100% 50%; }
        }

        .hc-wave { position: absolute; left: -10%; width: 120%; height: 50%; will-change: transform; }
        .hc-wave-1 { bottom: 0;   opacity: 0.15; animation: hc-drift-r 18s ease-in-out infinite; }
        .hc-wave-2 { bottom: 25%; opacity: 0.20; animation: hc-drift-l 22s ease-in-out infinite; }
        .hc-wave-3 { top: 0;      opacity: 0.10; animation: hc-drift-r 28s ease-in-out infinite; }
        @keyframes hc-drift-r {
          0%,100% { transform: translate3d(-8%,0,0); }
          50%     { transform: translate3d(8%,0,0); }
        }
        @keyframes hc-drift-l {
          0%,100% { transform: translate3d(8%,0,0); }
          50%     { transform: translate3d(-8%,0,0); }
        }

        .hc-orb {
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(124,92,191,0.18) 0%, rgba(124,92,191,0) 70%);
          filter: blur(120px);
          animation: hc-pulse 6s ease-in-out infinite;
          will-change: transform;
        }
        @keyframes hc-pulse {
          0%,100% { transform: scale(0.95); }
          50%     { transform: scale(1.05); }
        }

        .hc-rings { will-change: transform; }
        .hc-ring {
          position: absolute; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          will-change: transform;
        }
        .hc-ring-1 {
          width: 600px; height: 600px;
          background: rgba(124,92,191,0.08);
          border: 1px solid rgba(124,92,191,0.15);
          animation: hc-spin 40s linear infinite;
        }
        .hc-ring-2 {
          width: 400px; height: 400px;
          background: rgba(122,155,118,0.06);
          border: 1px solid rgba(122,155,118,0.2);
          animation: hc-spin-rev 30s linear infinite;
        }
        .hc-ring-3 {
          width: 220px; height: 220px;
          background:
            radial-gradient(circle, rgba(200,180,255,0.08) 0%, transparent 70%),
            rgba(245,240,232,0.05);
          border: 1px solid rgba(245,240,232,0.2);
          animation: hc-spin 20s linear infinite;
        }
        @keyframes hc-spin     { to { transform: rotate(360deg); } }
        @keyframes hc-spin-rev { to { transform: rotate(-360deg); } }

        .hc-dot {
          position: absolute; width: 4px; height: 4px; border-radius: 50%;
          background: rgba(200,180,255,0.4);
          top: 50%; left: 50%; margin: -2px 0 0 -2px;
        }
        .hc-dot-sage { background: rgba(180,220,180,0.4); }
        .hc-ring-2 .hc-dot { transform-origin: center; }

        .hc-particle {
          position: absolute; bottom: -10px;
          animation: hc-rise linear infinite;
          will-change: transform, opacity;
        }
        .hc-particle-dot {
          display: block; border-radius: 50%;
          animation: hc-sway ease-in-out infinite;
          animation-duration: inherit;
          will-change: transform;
        }
        @keyframes hc-rise {
          0%   { transform: translate3d(0,0,0);       opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translate3d(0,-110vh,0);  opacity: 0; }
        }
        @keyframes hc-sway {
          0%,100% { transform: translate3d(calc(var(--sway) * -1),0,0); }
          50%     { transform: translate3d(var(--sway),0,0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hc-wave, .hc-rings, .hc-particle, .hc-orb { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

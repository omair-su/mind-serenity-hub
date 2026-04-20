import { motion } from "framer-motion";
import { useMemo } from "react";

interface LivingGardenProps {
  count: number;
}

const FLOWERS = ["🌸", "🌻", "🌺", "🌷", "🌹", "🌼", "🪻", "🪷", "🌿", "🍀"];

export default function LivingGarden({ count }: LivingGardenProps) {
  const flowers = useMemo(() => {
    return Array.from({ length: Math.min(count, 80) }).map((_, i) => {
      // deterministic pseudo-random positions based on index
      const seed = (i * 9301 + 49297) % 233280;
      const x = (seed / 233280) * 100;
      const y = ((seed * 7) % 233280) / 233280 * 65 + 25; // 25%-90%
      const scale = 0.7 + ((seed * 3) % 100) / 200;
      const flower = FLOWERS[i % FLOWERS.length];
      const delay = (i % 12) * 0.04;
      return { x, y, scale, flower, delay, key: i };
    });
  }, [count]);

  const tier = count >= 100 ? "Forest" : count >= 30 ? "Grove" : count >= 7 ? "Meadow" : "Sapling";

  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-b from-[hsl(200,60%,75%)] via-[hsl(45,55%,85%)] to-[hsl(95,40%,55%)] shadow-soft">
      {/* Sun */}
      <div className="absolute top-3 right-5 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200 to-amber-400 shadow-[0_0_30px_rgba(252,211,77,0.6)]" />

      {/* Distant hills */}
      <div className="absolute bottom-[40%] left-0 right-0 h-12 bg-gradient-to-b from-[hsl(140,30%,50%)] to-[hsl(140,35%,45%)] opacity-70" style={{ clipPath: "polygon(0 100%, 0 50%, 25% 30%, 50% 60%, 75% 25%, 100% 55%, 100% 100%)" }} />

      {/* Grass field */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-b from-[hsl(95,45%,50%)] to-[hsl(95,50%,40%)]" />

      {/* Flowers */}
      {flowers.map((f) => (
        <motion.span
          key={f.key}
          initial={{ scale: 0, opacity: 0, y: 10 }}
          animate={{ scale: f.scale, opacity: 1, y: 0 }}
          transition={{ delay: f.delay, type: "spring", stiffness: 200, damping: 18 }}
          className="absolute select-none drop-shadow-md"
          style={{
            left: `${f.x}%`,
            bottom: `${f.y - 25}%`,
            fontSize: "1.5rem",
            transform: `scale(${f.scale})`,
          }}
        >
          {f.flower}
        </motion.span>
      ))}

      {count === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm font-body text-white/90 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
            🌱 Plant your first seed
          </p>
        </div>
      )}

      {/* Tier badge */}
      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/30 backdrop-blur-md border border-white/40">
        <span className="text-[10px] font-body font-bold uppercase tracking-widest text-white drop-shadow">
          {tier} · {count}
        </span>
      </div>
    </div>
  );
}

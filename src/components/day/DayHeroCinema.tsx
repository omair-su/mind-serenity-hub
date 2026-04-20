// Cinematic hero with Ken Burns zoom, mood gradient overlay, floating particles,
// and scroll-driven parallax. Replaces the static per-week hero on DayPage.
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, Gauge, Play, Headphones, BookOpen } from "lucide-react";
import { useRef } from "react";
import { getDayHero, moodGradient } from "@/data/dayHeroImages";

interface DayHeroCinemaProps {
  dayNumber: number;
  weekNumber: number;
  title: string;
  duration: string;
  difficulty: string;
  onBegin: () => void;
  onListenOnly: () => void;
  onReadFirst: () => void;
}

const PARTICLES = Array.from({ length: 14 }, (_, i) => i);

export default function DayHeroCinema({
  dayNumber, weekNumber, title, duration, difficulty,
  onBegin, onListenOnly, onReadFirst,
}: DayHeroCinemaProps) {
  const hero = getDayHero(dayNumber);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 140]);
  const blur = useTransform(scrollY, [0, 600], [0, 6]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <section
      ref={ref}
      className="relative w-full h-[460px] md:h-[560px] overflow-hidden bg-[hsl(var(--charcoal))]"
    >
      {/* Ken Burns image */}
      <motion.div
        className="absolute inset-0"
        style={{ y, filter }}
      >
        <motion.img
          src={hero.image}
          alt={hero.alt}
          loading="eager"
          decoding="async"
          width={1600}
          height={900}
          initial={{ scale: 1.0 }}
          animate={{ scale: 1.12 }}
          transition={{ duration: 22, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Mood gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${moodGradient(hero.moodTint)}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {/* Floating particles (gold dust) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-[hsl(var(--gold))]/40 blur-[1px]"
            style={{
              width: 3 + (i % 4),
              height: 3 + (i % 4),
              left: `${(i * 73) % 100}%`,
              top: `${(i * 41) % 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 7 + (i % 5),
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[820px] mx-auto px-6 h-full flex flex-col items-center justify-center text-center pt-[72px]">
        <motion.span
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--gold))]/95 text-[hsl(var(--charcoal))] text-[10px] font-body font-bold tracking-[0.2em] uppercase mb-4 shadow-[0_4px_20px_hsl(var(--gold)/0.4)]"
        >
          ✦ Week {weekNumber} · Day {dayNumber}
        </motion.span>

        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-3 max-w-[680px] drop-shadow-lg"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-display italic text-base md:text-lg text-white/85 mb-5 max-w-[520px]"
        >
          "{hero.affirmation}"
        </motion.p>

        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-3 text-white/80 text-xs font-body mb-6"
        >
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {duration}</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5" /> {difficulty}</span>
        </motion.div>

        {/* CTA stack */}
        <motion.div
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2.5"
        >
          <button
            onClick={onBegin}
            className="group flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--charcoal))] font-body font-bold text-sm shadow-[0_12px_36px_-8px_hsl(var(--gold)/0.6)] hover:scale-105 active:scale-95 transition-transform"
          >
            <Play className="w-4 h-4 fill-current" />
            Begin Practice
          </button>
          <button
            onClick={onListenOnly}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/12 backdrop-blur-md text-white font-body font-medium text-sm ring-1 ring-white/25 hover:bg-white/20 transition-colors"
          >
            <Headphones className="w-4 h-4" /> Listen Only
          </button>
          <button
            onClick={onReadFirst}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-transparent text-white/90 font-body font-medium text-sm ring-1 ring-white/20 hover:bg-white/10 transition-colors"
          >
            <BookOpen className="w-4 h-4" /> Read First
          </button>
        </motion.div>
      </div>
    </section>
  );
}

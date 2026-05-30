// Premium Vagus Nerve Reset program landing page — hero with science badge,
// stat tiles, "Your Body Has a Reset Button" section with technique pills,
// and a 7-day timeline. Designed to feel like a $100 standalone course.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play, Lock, Crown, Check, Sparkles, ChevronDown, HeartPulse,
  Brain, Moon,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useJsonLd } from "@/hooks/useJsonLd";
import { useIsPremium } from "@/hooks/useIsPremium";
import { useBrandedVideo } from "@/hooks/useBrandedVideo";
import { VAGUS_NERVE_RESET } from "@/data/programs/vagusNerveReset";
import { cn } from "@/lib/utils";

const STORAGE_KEY = `willow:program:${VAGUS_NERVE_RESET.id}:progress`;

function loadProgress(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set<number>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

const stats = [
  {
    icon: HeartPulse,
    number: "10–25%",
    label: "Heart rate reduction",
    sub: "Cold water face exposure activates the dive reflex instantly.",
  },
  {
    icon: Brain,
    number: "5 min",
    label: "Daily practice needed",
    sub: "Short consistent sessions outperform long occasional ones.",
  },
  {
    icon: Moon,
    number: "7 days",
    label: "To feel the difference",
    sub: "Consistent vagal stimulation builds lasting parasympathetic tone.",
  },
];

const techniques = ["Breathwork", "Humming", "Cold Water", "Movement", "Meditation"];

export default function VagusNerveResetPage() {
  usePageSEO({
    title: "7-Day Vagus Nerve Reset — Science-Backed Program | Willow Vibes",
    description:
      "Reset your nervous system in 7 days with science-backed somatic techniques: extended-exhale breathing, humming, cold-face protocol, gentle movement, body scan, laughter, and integration.",
    canonical: "https://willowvibes.com/app/programs/vagus-nerve",
  });

  useJsonLd(
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "7-Day Vagus Nerve Reset",
      description:
        "Science-backed somatic program that resets the nervous system in 7 days through breathwork, humming, cold-face protocol, movement, body scan, laughter, and integration.",
      provider: {
        "@type": "Organization",
        name: "Willow Vibes",
        sameAs: "https://willowvibes.com",
      },
      educationalLevel: "Beginner",
      inLanguage: "en",
      url: "https://willowvibes.com/app/programs/vagus-nerve",
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Online",
        courseWorkload: "PT35M",
      },
    },
    "course-vagus-nerve",
  );

  const navigate = useNavigate();
  const { isPremium } = useIsPremium();
  const program = VAGUS_NERVE_RESET;
  const hero = useBrandedVideo(
    program.heroVideoSlot ?? "vagus-hero",
    program.videoBackdrop,
    program.posterUrl,
  );

  const [progress, setProgress] = useState<Set<number>>(() => loadProgress());
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const refresh = () => setProgress(loadProgress());
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  const completedCount = progress.size;
  const overallPct = Math.round((completedCount / program.days.length) * 100);
  const nextDay =
    program.days.find((d) => !progress.has(d.day))?.day ?? program.days.length;

  const handleBegin = (dayNum: number, locked: boolean) => {
    if (locked) {
      navigate("/pricing");
      return;
    }
    navigate(`/app/programs/${program.id}/day/${dayNum}`);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background pb-24 lg:pb-12">
        {/* HERO */}
        <section className="relative h-[62vh] min-h-[460px] max-h-[640px] overflow-hidden">
          <video
            key={hero.videoUrl}
            src={hero.videoUrl}
            poster={hero.posterUrl}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Forest → sage gradient per spec */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--forest-deep) / 0.78) 0%, hsl(var(--sage) / 0.55) 100%)",
            }}
          />

          <div className="relative z-10 h-full flex flex-col justify-end max-w-4xl mx-auto px-6 pb-12">
            <div className="inline-flex items-center gap-2 mb-4 self-start px-3 py-1.5 rounded-full bg-gold/15 backdrop-blur-md border border-gold/40">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span className="text-[11px] font-body font-bold text-gold tracking-[0.15em] uppercase">
                Science-Backed · 7 Days
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-cream leading-[1.05] tracking-tight">
              Reset Your Nervous System
            </h1>
            <p className="font-body text-base md:text-lg text-cream/85 mt-4 max-w-xl leading-relaxed">
              A 7-day journey to calm your stress response, improve sleep, and restore inner balance.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleBegin(nextDay, nextDay > program.freeDays && !isPremium)}
                className="px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-body font-bold text-sm tracking-wide hover:bg-forest transition-all shadow-soft hover:scale-[1.02]"
              >
                {completedCount === 0
                  ? "Begin Day 1 →"
                  : completedCount === program.days.length
                    ? "Practice Again →"
                    : `Continue Day ${nextDay} →`}
              </button>
              <button
                onClick={() => document.getElementById("days-grid")?.scrollIntoView({ behavior: "smooth" })}
                className="px-7 py-3.5 rounded-full border-[1.5px] border-cream/80 text-cream font-body font-semibold text-sm tracking-wide hover:bg-cream/10 transition-all"
              >
                View All Days
              </button>
            </div>

            {/* Progress dots */}
            <div className="mt-6 flex items-center gap-1.5">
              {program.days.map((d) => (
                <div
                  key={d.day}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    progress.has(d.day) ? "w-8 bg-gold" : "w-4 bg-cream/30",
                  )}
                />
              ))}
              <span className="ml-3 text-[11px] font-body text-cream/70 tracking-wide">
                {completedCount} / {program.days.length} days · {overallPct}%
              </span>
            </div>
          </div>
        </section>

        {/* SCIENCE STATS */}
        <section className="bg-cream/40 dark:bg-card/30 py-12 md:py-16 border-y border-border/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-3xl bg-card border border-border/60 shadow-soft p-7 text-center"
              >
                <s.icon className="w-7 h-7 text-primary mx-auto mb-3" strokeWidth={1.6} />
                <div className="font-display text-4xl font-semibold text-foreground tracking-tight">
                  {s.number}
                </div>
                <div className="mt-1 text-[10px] font-body font-bold uppercase tracking-[0.15em] text-gold">
                  {s.label}
                </div>
                <p className="mt-3 font-body text-sm text-muted-foreground leading-relaxed">
                  {s.sub}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WHY THIS WORKS */}
        <section
          className="py-14 md:py-20 text-cream"
          style={{ background: "hsl(var(--sage))" }}
        >
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
              Your Body Has a Reset Button
            </h2>
            <p className="mt-6 font-body text-base md:text-lg leading-[1.8] text-cream/90">
              The vagus nerve is the longest cranial nerve in your body — a direct communication highway between your brain and every major organ. When vagal tone is strong, your heart rate settles, breathing deepens, digestion improves, and your brain naturally exits fight-or-flight mode.
            </p>
            <p className="mt-4 font-body text-base md:text-lg leading-[1.8] text-cream/90">
              This 7-day program uses five science-validated techniques to systematically strengthen your vagal tone — no equipment needed.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {techniques.map((t) => (
                <span
                  key={t}
                  className="px-4 py-2 rounded-full bg-cream/10 border border-cream/30 backdrop-blur-sm font-body text-[11px] font-bold tracking-[0.1em] uppercase text-cream"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* DAY CARDS */}
        <div id="days-grid" className="max-w-3xl mx-auto px-4 sm:px-6 mt-12 md:mt-16 space-y-3">
          <div className="text-center mb-8">
            <span className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-gold">
              The 7-Day Journey
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mt-2 tracking-tight">
              One technique each day
            </h2>
          </div>

          {program.days.map((d, idx) => {
            const locked = d.day > program.freeDays && !isPremium;
            const done = progress.has(d.day);
            const isExpanded = expanded === d.day;
            return (
              <motion.div
                key={d.day}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                className={cn(
                  "rounded-[20px] border bg-card shadow-soft overflow-hidden",
                  done ? "border-gold/50" : "border-border/60",
                )}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : d.day)}
                  className="w-full text-left px-6 py-5 flex items-center gap-4 hover:bg-secondary/20 transition-colors"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-display font-semibold text-base",
                      done
                        ? "bg-gold text-charcoal"
                        : locked
                          ? "bg-secondary/40 text-muted-foreground"
                          : "bg-primary text-primary-foreground",
                    )}
                  >
                    {done ? <Check className="w-5 h-5" /> : locked ? <Lock className="w-4 h-4" /> : d.day}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-body font-bold uppercase tracking-[0.1em] text-muted-foreground">
                        Day {d.day} · {d.duration}
                      </span>
                      <span className="text-[10px] font-body font-bold uppercase tracking-[0.1em] text-gold border border-gold/40 px-2 py-0.5 rounded-full">
                        Research-backed
                      </span>
                      {locked && <Crown className="w-3.5 h-3.5 text-gold" />}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground truncate tracking-tight">
                      {d.title}
                    </h3>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      {d.technique}
                    </p>
                  </div>

                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform flex-shrink-0",
                      isExpanded && "rotate-180",
                    )}
                  />
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-6 pb-6 -mt-1 border-t border-border/40"
                  >
                    <div className="pt-4">
                      <div className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-gold mb-1.5">
                        Why it works
                      </div>
                      <p className="font-body text-sm text-foreground/85 leading-[1.7] mb-4">
                        {d.whyItWorks}
                      </p>
                      <button
                        onClick={() => handleBegin(d.day, locked)}
                        className={cn(
                          "inline-flex items-center gap-2 px-7 py-3 rounded-full font-body font-bold text-sm tracking-wide transition-all",
                          locked
                            ? "bg-gold text-charcoal hover:scale-[1.02]"
                            : "bg-primary text-primary-foreground hover:bg-forest shadow-soft hover:scale-[1.02]",
                        )}
                      >
                        {locked ? (
                          <>
                            <Crown className="w-4 h-4" /> Unlock with Premium
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            {done ? "Practice again" : "Start"}
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

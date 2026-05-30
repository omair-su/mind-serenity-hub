// Generic program landing page — renders any MiniProgram from the index by
// :programId route param. Replaces the hardcoded VagusNerveResetPage so each
// new mini-program (box breathing, grief, ADHD, cycle sync, sound therapy,
// ritual pack, …) automatically gets the same cinematic 7-day timeline UX.
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Lock, Crown, Check, Sparkles, ChevronDown } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { usePageSEO } from "@/hooks/usePageSEO";
import { useIsPremium } from "@/hooks/useIsPremium";
import { useBrandedVideo } from "@/hooks/useBrandedVideo";
import { getProgramById } from "@/data/programs";
import { cn } from "@/lib/utils";

const STORAGE_KEY = (programId: string) =>
  `willow:program:${programId}:progress`;

function loadProgress(programId: string): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(programId));
    return new Set<number>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export default function ProgramHomePage() {
  const { programId = "" } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { isPremium } = useIsPremium();
  const program = getProgramById(programId);

  const hero = useBrandedVideo(
    (program?.heroVideoSlot as any) ?? "vagus-hero",
    program?.videoBackdrop ?? "",
    program?.posterUrl ?? "",
  );

  const [progress, setProgress] = useState<Set<number>>(() =>
    loadProgress(programId),
  );
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    setProgress(loadProgress(programId));
    const refresh = () => setProgress(loadProgress(programId));
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [programId]);

  usePageSEO({
    title: program
      ? `${program.title} — 7-Day Program | Willow Vibes`
      : "Program | Willow Vibes",
    description:
      program?.description ??
      "Multi-day science-backed wellness mini-programs from Willow Vibes.",
    canonical: program
      ? `https://willowvibes.com/app/programs/${program.id}`
      : undefined,
  });

  useJsonLd(
    program
      ? {
          "@context": "https://schema.org",
          "@type": "Course",
          name: program.title,
          description: program.description,
          provider: {
            "@type": "Organization",
            name: "Willow Vibes",
            sameAs: "https://willowvibes.com",
          },
          educationalLevel: "Beginner",
          inLanguage: "en",
          url: `https://willowvibes.com/app/programs/${program.id}`,
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "Online",
            courseWorkload: `PT${program.days.length * 5}M`,
          },
        }
      : null,
    `course-${program?.id ?? "none"}`,
  );

  if (!program) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <p className="font-body text-muted-foreground mb-4">
              Program not found.
            </p>
            <Link to="/app/explore" className="text-gold underline">
              Explore programs
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const completedCount = progress.size;
  const overallPct = Math.round((completedCount / program.days.length) * 100);

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
        <section className="relative h-[44vh] min-h-[340px] max-h-[480px] overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/60 to-background" />

          <div className="relative z-10 h-full flex flex-col justify-end max-w-3xl mx-auto px-6 pb-10">
            <div className="inline-flex items-center gap-2 mb-3 self-start px-3 py-1.5 rounded-full bg-gold/15 backdrop-blur-md border border-gold/30">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span className="text-xs font-body font-semibold text-cream tracking-wide uppercase">
                7-Day Program
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-cream leading-tight">
              {program.title}
            </h1>
            <p className="font-body text-sm md:text-base text-cream/80 mt-2 max-w-xl">
              {program.description}
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs font-body text-cream/70">
              <span>{program.category}</span>
              <span className="w-1 h-1 rounded-full bg-cream/30" />
              <span>{program.days.length} days</span>
              <span className="w-1 h-1 rounded-full bg-cream/30" />
              <span>~5–10 min / day</span>
            </div>
          </div>
        </section>

        {/* Progress bar */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-4 relative z-20">
          <div className="rounded-2xl bg-card border border-border/50 shadow-soft p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-body font-semibold text-foreground">
                Your progress
              </span>
              <span className="text-xs font-body text-muted-foreground">
                {completedCount} of {program.days.length} days · {overallPct}%
              </span>
            </div>
            <div className="w-full bg-secondary/40 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-gold to-gold-dark h-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallPct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-8 space-y-3">
          {program.days.map((d, idx) => {
            const locked = d.day > program.freeDays && !isPremium;
            const done = progress.has(d.day);
            const isExpanded = expanded === d.day;
            return (
              <motion.div
                key={d.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                className={cn(
                  "rounded-2xl border bg-card shadow-soft overflow-hidden",
                  done ? "border-gold/40" : "border-border/50",
                )}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : d.day)}
                  className="w-full text-left p-4 sm:p-5 flex items-center gap-4 hover:bg-secondary/20 transition-colors"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-display font-bold text-sm",
                      done
                        ? "bg-gold text-charcoal"
                        : locked
                          ? "bg-secondary/40 text-muted-foreground"
                          : "bg-primary/10 text-primary border border-primary/30",
                    )}
                  >
                    {done ? (
                      <Check className="w-5 h-5" />
                    ) : locked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      d.day
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-body font-bold uppercase tracking-wider text-muted-foreground">
                        Day {d.day} · {d.duration}
                      </span>
                      {locked && <Crown className="w-3 h-3 text-gold" />}
                    </div>
                    <h3 className="font-display text-base font-bold text-foreground truncate">
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
                    className="px-4 sm:px-5 pb-5 -mt-1 border-t border-border/40"
                  >
                    <div className="pt-4">
                      <div className="text-[10px] font-body font-bold uppercase tracking-wider text-gold mb-1.5">
                        Why it works
                      </div>
                      <p className="font-body text-sm text-foreground/85 leading-relaxed mb-4">
                        {d.whyItWorks}
                      </p>
                      <button
                        onClick={() => handleBegin(d.day, locked)}
                        className={cn(
                          "inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-bold text-sm transition-all",
                          locked
                            ? "bg-gold/90 text-charcoal hover:scale-105"
                            : "bg-gradient-to-r from-primary to-primary text-primary-foreground hover:scale-105 shadow-soft",
                        )}
                      >
                        {locked ? (
                          <>
                            <Crown className="w-4 h-4" /> Unlock with Premium
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />{" "}
                            {done ? "Practice again" : "Begin practice"}
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

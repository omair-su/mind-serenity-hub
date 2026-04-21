import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import {
  challenges, getChallengeProgress, saveChallengeDay,
  type Challenge,
} from "@/data/challenges";
import {
  ArrowLeft, Check, Clock, Sparkles, Heart, Brain, Moon, Leaf,
} from "lucide-react";
import ChallengeFilters from "@/components/challenges/ChallengeFilters";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import ChallengeJourneyTimeline from "@/components/challenges/ChallengeJourneyTimeline";
import LeafFallAnimation from "@/components/challenges/LeafFallAnimation";
import ChallengeCompleteModal from "@/components/challenges/ChallengeCompleteModal";

const easing = [0.25, 0.1, 0.25, 1] as const;

const benefitIcon = (b: string) => {
  const t = b.toLowerCase();
  if (t.includes("sleep") || t.includes("rest")) return Moon;
  if (t.includes("heart") || t.includes("happiness") || t.includes("emotion") || t.includes("relationship")) return Heart;
  if (t.includes("focus") || t.includes("attention") || t.includes("mental") || t.includes("clarity") || t.includes("thinking")) return Brain;
  return Leaf;
};

const getProgressPercent = (challengeId: string, progress: ReturnType<typeof getChallengeProgress>) => {
  const p = progress[challengeId];
  const c = challenges.find(ch => ch.id === challengeId);
  if (!p || !c) return 0;
  return Math.round((p.completedDays.length / c.duration) * 100);
};

export default function ChallengesPage() {
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [progress, setProgress] = useState(getChallengeProgress());
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"recommended" | "duration" | "progress">("recommended");
  const [showLeaves, setShowLeaves] = useState(false);
  const [completedChallenge, setCompletedChallenge] = useState<Challenge | null>(null);

  const challenge = challenges.find(c => c.id === activeChallengeId) ?? null;

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(challenges.map(c => c.category)))],
    []
  );

  const visibleChallenges = useMemo(() => {
    let list = category === "All" ? [...challenges] : challenges.filter(c => c.category === category);
    if (sort === "duration") list.sort((a, b) => a.duration - b.duration);
    if (sort === "progress") list.sort((a, b) => getProgressPercent(b.id, progress) - getProgressPercent(a.id, progress));
    return list;
  }, [category, sort, progress]);

  const featured = challenges[0];
  const featuredCompletion = Math.max(40, 100 - (featured.id.length * 7) % 35);

  const completeDay = (challengeId: string, dayNum: number) => {
    saveChallengeDay(challengeId, dayNum, note || undefined);
    const updated = getChallengeProgress();
    setProgress(updated);
    setNote("");
    setActiveDay(null);
    setShowLeaves(true);

    const c = challenges.find(ch => ch.id === challengeId);
    if (c && updated[challengeId]?.completedDays.length === c.duration) {
      setTimeout(() => setCompletedChallenge(c), 800);
    }
  };

  const day = challenge?.days.find(d => d.day === activeDay) ?? null;

  return (
    <AppLayout>
      <div className="space-y-7">
        {/* ── Editorial header ── */}
        {!challenge && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: easing }}
            className="relative overflow-hidden rounded-3xl border border-[hsl(var(--cream-dark))] bg-gradient-to-br from-[hsl(var(--cream))] via-card to-[hsl(var(--sage-light))]/40 p-6 sm:p-8 shadow-[var(--shadow-soft-val)]"
          >
            <div className="absolute -top-16 -right-12 w-56 h-56 rounded-full bg-[hsl(var(--gold))]/12 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-10 w-60 h-60 rounded-full bg-[hsl(var(--sage))]/15 blur-3xl pointer-events-none" />

            <div className="relative flex items-center gap-2 mb-3">
              <span className="text-[10px] font-body font-bold uppercase tracking-[0.32em] text-[hsl(var(--gold-dark))]">
                Mindful Journeys
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-[hsl(var(--gold))]/50 to-transparent" />
            </div>

            <h1 className="relative font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight tracking-tight">
              Mindfulness Challenges
            </h1>
            <p className="relative text-sm sm:text-base font-body text-muted-foreground mt-2 max-w-xl leading-relaxed">
              Themed multi-day journeys to deepen your practice — guided by science, paced for life.
            </p>

            {/* Featured this month */}
            <div className="relative mt-5 flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-[hsl(var(--gold))]/40 shadow-[var(--shadow-soft-val)] backdrop-blur-sm">
              <span className="text-2xl">{featured.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-[hsl(var(--gold-dark))]">
                  Featured this month
                </p>
                <p className="font-display text-sm font-bold text-foreground truncate">{featured.name}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-display text-lg font-bold text-[hsl(var(--forest))] leading-none">{featuredCompletion}%</p>
                <p className="text-[9px] font-body text-muted-foreground uppercase tracking-wider mt-0.5">complete rate</p>
              </div>
            </div>

            {/* Filters */}
            <div className="relative mt-5">
              <ChallengeFilters
                categories={categories}
                active={category}
                onChange={setCategory}
                sort={sort}
                onSortChange={setSort}
              />
            </div>
          </motion.div>
        )}

        {/* ── Cards grid ── */}
        {!challenge && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {visibleChallenges.map(c => (
              <motion.div
                key={c.id}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easing } },
                }}
              >
                <ChallengeCard
                  challenge={c}
                  completedDays={progress[c.id]?.completedDays ?? []}
                  pct={getProgressPercent(c.id, progress)}
                  onOpen={() => setActiveChallengeId(c.id)}
                />
              </motion.div>
            ))}
            {visibleChallenges.length === 0 && (
              <p className="col-span-full text-center text-sm font-body text-muted-foreground py-12">
                No challenges in this category yet.
              </p>
            )}
          </motion.div>
        )}

        {/* ── Detail view ── */}
        {challenge && !day && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easing }}
            className="space-y-5"
          >
            <button
              onClick={() => setActiveChallengeId(null)}
              className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Challenges
            </button>

            {/* Branded header */}
            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${challenge.color} border border-[hsl(var(--cream-dark))] p-6 sm:p-7 shadow-[var(--shadow-card-val)]`}>
              <div className="absolute -top-12 -right-8 w-40 h-40 rounded-full bg-[hsl(var(--gold))]/15 blur-3xl pointer-events-none" />
              <div className="relative flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <span className="absolute inset-0 -m-3 rounded-full bg-[hsl(var(--gold))]/15 blur-xl" />
                  <span className="relative text-5xl">{challenge.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-body font-bold uppercase tracking-[0.22em] text-[hsl(var(--forest))]">
                    {challenge.category} · {challenge.duration} days
                  </p>
                  <h2 className="font-display text-2xl font-bold text-foreground mt-1 leading-tight">
                    {challenge.name}
                  </h2>
                  <p className="text-sm font-body text-foreground/75 mt-1.5 leading-relaxed">
                    {challenge.description}
                  </p>
                </div>
              </div>

              {/* Progress ring */}
              <div className="relative mt-5 flex items-center gap-4">
                <ProgressRingMini pct={getProgressPercent(challenge.id, progress)} />
                <div>
                  <p className="font-display text-base font-bold text-foreground">
                    {progress[challenge.id]?.completedDays.length ?? 0} of {challenge.duration} days
                  </p>
                  <p className="text-xs font-body text-muted-foreground">
                    {getProgressPercent(challenge.id, progress) >= 100
                      ? "Beautifully complete"
                      : getProgressPercent(challenge.id, progress) > 0
                      ? "In progress"
                      : "Ready to begin"}
                  </p>
                </div>
              </div>

              {/* Benefits as icon-tagged pills */}
              <div className="relative flex flex-wrap gap-2 mt-5">
                {challenge.benefits.map(b => {
                  const Icon = benefitIcon(b);
                  return (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1.5 text-[11px] font-body font-medium px-2.5 py-1 rounded-full bg-white/70 backdrop-blur-sm text-foreground/80 border border-white/60"
                    >
                      <Icon className="w-3 h-3 text-[hsl(var(--forest))]" />
                      {b}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Journey timeline */}
            <div>
              <p className="text-[10px] font-body font-bold uppercase tracking-[0.22em] text-[hsl(var(--forest))] mb-2">
                Your Journey
              </p>
              <ChallengeJourneyTimeline
                challenge={challenge}
                completedDays={progress[challenge.id]?.completedDays ?? []}
                onSelect={d => setActiveDay(d)}
              />
            </div>
          </motion.div>
        )}

        {/* ── Day focus view ── */}
        {challenge && day && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easing }}
            className="space-y-4"
          >
            <button
              onClick={() => setActiveDay(null)}
              className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to {challenge.name}
            </button>

            <div className="relative overflow-hidden rounded-3xl bg-card border border-[hsl(var(--cream-dark))] shadow-[var(--shadow-card-val)] p-6 sm:p-10">
              <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-[hsl(var(--sage))]/12 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-10 w-60 h-60 rounded-full bg-[hsl(var(--gold))]/8 blur-3xl pointer-events-none" />

              <div className="relative text-center mb-6">
                <span className="inline-flex items-center gap-1 text-[10px] font-body font-bold text-[hsl(var(--gold-dark))] uppercase tracking-[0.28em]">
                  <Sparkles className="w-3 h-3" />
                  Day {day.day} of {challenge.duration}
                  <Sparkles className="w-3 h-3" />
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-2 leading-tight">
                  {day.title}
                </h2>
                <p className="text-sm font-body text-muted-foreground mt-1.5">{day.description}</p>
                <span className="inline-flex items-center gap-1 text-xs font-body text-muted-foreground mt-3">
                  <Clock className="w-3 h-3" /> {day.duration} minute{day.duration === 1 ? "" : "s"}
                </span>
              </div>

              {/* Practice as typographic centerpiece with drop-cap */}
              <div className="relative bg-[hsl(var(--cream))]/60 rounded-2xl border border-[hsl(var(--cream-dark))] p-6 sm:p-8 mb-6">
                <div className="absolute top-3 left-3 text-[10px] font-body font-bold uppercase tracking-[0.2em] text-[hsl(var(--forest))]/70">
                  Today's Practice
                </div>
                <p className="font-display text-base sm:text-lg text-foreground leading-[1.85] mt-6 first-letter:font-display first-letter:text-5xl first-letter:font-bold first-letter:text-[hsl(var(--gold-dark))] first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:mt-1">
                  {day.practice}
                </p>
              </div>

              <div className="relative mb-6">
                <label className="text-xs font-body font-bold uppercase tracking-[0.2em] text-[hsl(var(--forest))] block mb-2">
                  Reflection
                </label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="How did this practice feel? What did you notice?"
                  className="w-full bg-[hsl(var(--cream))]/40 rounded-2xl p-4 text-sm font-body text-foreground placeholder:text-muted-foreground border border-[hsl(var(--cream-dark))] focus:border-[hsl(var(--forest))] focus:outline-none resize-none leading-relaxed"
                  rows={4}
                />
              </div>

              <button
                onClick={() => completeDay(challenge.id, day.day)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white font-body font-bold text-sm shadow-[var(--shadow-gold-val)] hover:brightness-110 transition-all"
              >
                <Check className="w-4 h-4" /> Complete Day {day.day}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Leaf-fall celebration */}
      <LeafFallAnimation show={showLeaves} onDone={() => setShowLeaves(false)} />

      {/* Whole-challenge completion */}
      <ChallengeCompleteModal
        show={!!completedChallenge}
        challenge={completedChallenge}
        progress={completedChallenge ? progress[completedChallenge.id] : null}
        onClose={() => setCompletedChallenge(null)}
      />
    </AppLayout>
  );
}

function ProgressRingMini({ pct }: { pct: number }) {
  const c = 2 * Math.PI * 22;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
        <circle cx="28" cy="28" r="22" fill="none" stroke="hsl(var(--cream-dark))" strokeWidth="5" />
        <motion.circle
          cx="28" cy="28" r="22" fill="none"
          stroke="hsl(var(--forest))"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-sm font-bold text-foreground">{pct}%</span>
      </div>
    </div>
  );
}

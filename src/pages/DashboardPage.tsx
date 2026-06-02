import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import {
  getGreeting, getNextDay, getCompletedDays, getTotalMinutes, getCurrentStreak,
  getAllDayStates, getEarnedAchievements,
} from "@/lib/userStore";
import { weeks } from "@/data/courseData";
import {
  ArrowRight, Trophy, Flame, Clock, Target, Play, Leaf, Headphones, ScanEye, Sparkles,
} from "lucide-react";
import dashboardHero from "@/assets/dashboard-hero-premium.webp";
import { getWellnessScore, getWellnessLevel } from "@/lib/wellnessScore";
import StreakCelebration from "@/components/StreakCelebration";
import HomeFeed from "@/components/HomeFeed";
import MeditationPlayer from "@/components/MeditationPlayer";
import HeroCinema from "@/components/dashboard/HeroCinema";
import WellnessRing from "@/components/dashboard/WellnessRing";
import RitualTriptych from "@/components/dashboard/RitualTriptych";
import StreakGarden from "@/components/dashboard/StreakGarden";
import BentoTools from "@/components/dashboard/BentoTools";
import QuoteRibbon from "@/components/dashboard/QuoteRibbon";
import WelcomeModal from "@/components/dashboard/WelcomeModal";
import PushPrefsPrompt from "@/components/dashboard/PushPrefsPrompt";
import WeeklyRecapCard from "@/components/dashboard/WeeklyRecapCard";
import StreakFreezeCard from "@/components/dashboard/StreakFreezeCard";
import DailyDropCard from "@/components/dashboard/DailyDropCard";
import QuickStartPanel from "@/components/dashboard/QuickStartPanel";
import ProgramProgressRing from "@/components/dashboard/ProgramProgressRing";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import { SectionHeader, StatTile, LuxeCard } from "@/components/ui-premium";


const easing = [0.25, 0.1, 0.25, 1] as const;
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easing } },
};

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-2 opacity-70" aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[hsl(var(--gold)/0.4)] to-transparent" />
      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--gold))]" />
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[hsl(var(--gold)/0.4)] to-transparent" />
    </div>
  );
}

export default function DashboardPage() {
  const location = useLocation();
  const greeting = getGreeting();
  const nextDay = getNextDay();
  const completed = getCompletedDays();
  const totalMins = getTotalMinutes();
  const streak = getCurrentStreak();
  const allStates = getAllDayStates();
  const achievements = getEarnedAchievements();
  const earnedCount = achievements.filter(a => a.progress >= a.target).length;
  const allDays = weeks.flatMap(w => w.days);
  const nextDayData = allDays.find(d => d.day === nextDay);
  const todayPracticed = completed.includes(nextDay) || (allStates[nextDay]?.checklist?.every(Boolean));
  const wellness = getWellnessScore();
  const wellnessLevel = getWellnessLevel(wellness.total);

  const [showStreakCelebration, setShowStreakCelebration] = useState(() => {
    const isMilestone = [3, 7, 14, 21, 30].includes(streak);
    const shownKey = `wv-streak-shown-${streak}`;
    if (isMilestone && !sessionStorage.getItem(shownKey)) {
      sessionStorage.setItem(shownKey, "1");
      return true;
    }
    return false;
  });
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <AppLayout>
      <motion.div
        key={location.key}
        className="space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ───────────── HERO ───────────── */}
        <motion.div variants={itemVariants}>
          <HeroCinema
            greeting={greeting}
            nextDay={nextDay}
            completedCount={completed.length}
            streak={streak}
            todayPracticed={!!todayPracticed}
            onQuickSession={() => setShowPlayer(true)}
          />
        </motion.div>

        {/* ───────────── TODAY ───────────── */}
        <section className="space-y-6">
          <motion.div variants={itemVariants}>
            <SectionHeader
              eyebrow="Today"
              title="Your sanctuary, this morning"
              description="A daily drop, your focus session and the rituals that anchor you."
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <QuickStartPanel onQuickSession={() => setShowPlayer(true)} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <DailyDropCard />
          </motion.div>

          {nextDayData && (
            <motion.div variants={itemVariants}>
              <LuxeCard variant="forest" className="relative overflow-hidden p-0">
                {/* gold corner ornaments */}
                <span className="pointer-events-none absolute top-4 left-4 w-10 h-10 border-l border-t border-[hsl(var(--gold)/0.55)] rounded-tl-2xl" />
                <span className="pointer-events-none absolute top-4 right-4 w-10 h-10 border-r border-t border-[hsl(var(--gold)/0.55)] rounded-tr-2xl" />
                <span className="pointer-events-none absolute bottom-4 left-4 w-10 h-10 border-l border-b border-[hsl(var(--gold)/0.55)] rounded-bl-2xl" />
                <span className="pointer-events-none absolute bottom-4 right-4 w-10 h-10 border-r border-b border-[hsl(var(--gold)/0.55)] rounded-br-2xl" />
                <span className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[hsl(var(--gold)/0.18)] blur-3xl" />
                <span className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[hsl(var(--sage)/0.15)] blur-3xl" />

                <div className="relative p-8 md:p-10">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold tracking-[0.32em] uppercase text-[hsl(var(--gold-light))]">
                        Today's Focus · Day {nextDay}
                      </p>
                      <h3 className="font-display text-3xl md:text-[34px] text-cream mt-3 leading-tight">
                        {nextDayData.title}
                      </h3>
                      <p className="font-body text-cream/70 mt-3 max-w-xl text-sm md:text-base leading-relaxed">
                        A guided session crafted for {nextDayData.difficulty.toLowerCase()} practitioners. Settle in and let the breath lead the way.
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream/10 backdrop-blur-sm text-[11px] font-body text-cream/90 border border-cream/15">
                          <Clock className="w-3 h-3" /> {nextDayData.duration}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--gold)/0.18)] text-[11px] font-body text-[hsl(var(--gold-light))] border border-[hsl(var(--gold)/0.35)]">
                          <Target className="w-3 h-3" /> {nextDayData.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--gold)/0.3)] to-[hsl(var(--gold)/0.05)] border border-[hsl(var(--gold)/0.4)] items-center justify-center flex-shrink-0">
                      <Leaf className="w-7 h-7 text-[hsl(var(--gold-light))]" />
                    </div>
                  </div>
                  <Link
                    to={`/day/${nextDay}`}
                    className="group mt-7 inline-flex w-full items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-light))] text-[hsl(var(--charcoal))] font-body font-bold text-sm shadow-[var(--shadow-gold-val)] hover:brightness-110 transition-all"
                  >
                    <Play className="w-4 h-4" /> Begin Session
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </LuxeCard>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <RitualTriptych />
          </motion.div>
        </section>

        <GoldDivider />

        {/* ───────────── PROGRESS ───────────── */}
        <section className="space-y-6">
          <motion.div variants={itemVariants}>
            <SectionHeader
              eyebrow="Your Practice"
              title="A quiet record of your devotion"
              description="Wellness, streaks and milestones — measured gently."
            />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatTile label="Days Done" value={completed.length} unit={`/30`} icon={Target} tone="sage" />
            <StatTile label="Minutes" value={totalMins} icon={Clock} tone="neutral" />
            <StatTile label="Streak" value={streak} unit="d" icon={Flame} tone="gold" />
            <StatTile label="Badges" value={earnedCount} icon={Trophy} tone="forest" />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProgramProgressRing />
            <StreakCalendar />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
              <WellnessRing wellness={wellness} level={wellnessLevel} />
            </div>
            <div className="lg:col-span-2">
              <WeeklyRecapCard />
            </div>
          </motion.div>

          {streak > 0 && (
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <StreakGarden streak={streak} />
              </div>
              <div>
                <StreakFreezeCard />
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <PushPrefsPrompt />
          </motion.div>
        </section>

        <GoldDivider />

        {/* ───────────── FEATURED PROGRAMS ───────────── */}
        <section className="space-y-6">
          <motion.div variants={itemVariants}>
            <SectionHeader
              eyebrow="Featured Programs"
              title="Hand-picked journeys for you"
              description="Cinematic, science-backed and crafted with care."
            />
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/app/programs/vagus-nerve" className="block group">
              <LuxeCard variant="gold" className="h-full relative overflow-hidden">
                <span className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[hsl(var(--gold)/0.25)] blur-3xl" />
                <div className="relative flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--forest))] text-[hsl(var(--gold-light))] flex items-center justify-center shrink-0 shadow-[var(--shadow-gold-val)] group-hover:scale-105 transition-transform">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-[hsl(var(--gold-dark))]">Signature · 7 Days</p>
                    <h3 className="font-display text-2xl text-[hsl(var(--forest-deep))] leading-snug mt-1.5">
                      Vagus Nerve Reset
                    </h3>
                    <p className="font-body text-sm text-charcoal-soft mt-2 leading-relaxed">
                      A guided 7-day program built around fast nervous-system regulation.
                    </p>
                    <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-[hsl(var(--forest))] group-hover:gap-2.5 transition-all">
                      Begin program <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </LuxeCard>
            </Link>

            <Link to="/app/video-library" className="block group">
              <LuxeCard variant="ghost" className="h-full relative overflow-hidden">
                <span className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[hsl(var(--sage)/0.25)] blur-3xl" />
                <div className="relative flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-card border border-[hsl(var(--sage)/0.4)] text-[hsl(var(--forest))] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ScanEye className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-[hsl(var(--gold-dark))]">Visual Ritual</p>
                    <h3 className="font-display text-2xl text-charcoal leading-snug mt-1.5">
                      Cinematic Video Library
                    </h3>
                    <p className="font-body text-sm text-charcoal-soft mt-2 leading-relaxed">
                      Play cinematic backdrops for breathwork, sleep or deep focus.
                    </p>
                    <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-[hsl(var(--forest))] group-hover:gap-2.5 transition-all">
                      Open library <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </LuxeCard>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link to="/app/audio-library" className="block group">
              <LuxeCard variant="forest" className="relative overflow-hidden">
                <span className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[hsl(var(--gold)/0.18)] blur-3xl" />
                <div className="relative flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))] flex items-center justify-center shrink-0 shadow-[var(--shadow-gold-val)] group-hover:scale-105 transition-transform">
                    <Headphones className="w-8 h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-[hsl(var(--gold-light))]">Premium Audio</p>
                    <h3 className="font-display text-2xl md:text-[26px] text-cream leading-snug mt-1.5">
                      Build a playlist for your practice
                    </h3>
                    <p className="font-body text-sm text-cream/70 mt-2 leading-relaxed">
                      Stream sleep stories, masterclasses and focus sessions back-to-back.
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[hsl(var(--gold-light))] group-hover:translate-x-1 transition-transform shrink-0 hidden sm:block" />
                </div>
              </LuxeCard>
            </Link>
          </motion.div>
        </section>

        <GoldDivider />

        {/* ───────────── FEED ───────────── */}
        <section className="space-y-6">
          <motion.div variants={itemVariants}>
            <SectionHeader
              eyebrow="For You"
              title="Recommended next"
              description="Personalised to where you are in your practice today."
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <HomeFeed />
          </motion.div>
        </section>

        <GoldDivider />

        {/* ───────────── TOOLKIT ───────────── */}
        <section className="space-y-6">
          <motion.div variants={itemVariants}>
            <SectionHeader
              eyebrow="The Toolkit"
              title="Everything within reach"
              description="A complete library of practices, sounds and reflective tools."
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <BentoTools />
          </motion.div>
        </section>

        {/* ───────────── QUOTE ───────────── */}
        <motion.div variants={itemVariants}>
          <QuoteRibbon />
        </motion.div>
      </motion.div>

      <WelcomeModal />
      <StreakCelebration streak={streak} show={showStreakCelebration} onClose={() => setShowStreakCelebration(false)} />

      <AnimatePresence>
        {showPlayer && (
          <MeditationPlayer
            title="Quick Meditation"
            subtitle="5-minute mindful breathing"
            duration={300}
            backgroundImage={dashboardHero}
            onClose={() => setShowPlayer(false)}
            onComplete={() => {}}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

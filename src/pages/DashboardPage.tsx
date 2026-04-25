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
  ArrowRight, Trophy, Flame, Clock, Target, Play, Leaf,
} from "lucide-react";
import dashboardHero from "@/assets/dashboard-hero-premium.jpg";
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
import StreakFreezeCard from "@/components/dashboard/StreakFreezeCard";

const easing = [0.25, 0.1, 0.25, 1] as const;
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easing } },
};

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

  const stats = [
    { label: "Days Done", value: `${completed.length}/30`, icon: Target },
    { label: "Minutes", value: `${totalMins}`, icon: Clock },
    { label: "Streak", value: `${streak}d`, icon: Flame },
    { label: "Badges", value: `${earnedCount}`, icon: Trophy },
  ];

  return (
    <AppLayout>
      <motion.div
        key={location.key}
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero */}
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

        {/* Wellness ring + compact stat strip */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <WellnessRing wellness={wellness} level={wellnessLevel} />
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 gap-2.5">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.4 }}
                className="rounded-2xl border border-[hsl(var(--cream-dark))] bg-card p-3.5 shadow-[var(--shadow-soft-val)]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[hsl(var(--sage-light))] flex items-center justify-center">
                    <s.icon className="w-4 h-4 text-[hsl(var(--forest))]" />
                  </span>
                  <span className="text-[10px] font-body font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {s.label}
                  </span>
                </div>
                <p className="font-display text-xl font-bold text-foreground mt-2">{s.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Streak garden + freeze tokens */}
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

        {/* Soft push reminders prompt (day 2+) */}
        <motion.div variants={itemVariants}>
          <PushPrefsPrompt />
        </motion.div>

        {/* Today's triptych */}
        <motion.div variants={itemVariants}>
          <RitualTriptych />
        </motion.div>

        {/* Today's focus card */}
        {nextDayData && (
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl border border-[hsl(var(--cream-dark))] shadow-[var(--shadow-card-val)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--forest))]/8 via-card to-[hsl(var(--gold))]/8" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[hsl(var(--gold))]/15 to-transparent rounded-bl-full" />
            <div className="relative p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-[10px] font-body font-bold text-[hsl(var(--forest))] uppercase tracking-[0.22em]">
                    Today's Focus
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1.5 leading-snug">
                    Day {nextDay}: {nextDayData.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[hsl(var(--sage-light))] text-xs font-body text-[hsl(var(--forest))]">
                      <Clock className="w-3 h-3" /> {nextDayData.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[hsl(var(--gold))]/15 text-xs font-body text-[hsl(var(--gold-dark))]">
                      <Target className="w-3 h-3" /> {nextDayData.difficulty}
                    </span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--forest))]/15 to-[hsl(var(--sage))]/30 flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-7 h-7 text-[hsl(var(--forest))]" />
                </div>
              </div>
              <Link
                to={`/day/${nextDay}`}
                className="flex items-center justify-center gap-2 mt-5 w-full py-3.5 rounded-xl bg-[hsl(var(--forest))] text-white font-body font-bold text-sm hover:bg-[hsl(var(--forest-mid))] transition-colors shadow-[var(--shadow-soft-val)]"
              >
                <Play className="w-4 h-4" /> Begin Session <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Personalised feed */}
        <motion.div variants={itemVariants}>
          <HomeFeed />
        </motion.div>

        {/* Bento toolkit */}
        <motion.div variants={itemVariants}>
          <BentoTools />
        </motion.div>

        {/* Footer pull-quote */}
        <motion.div variants={itemVariants}>
          <QuoteRibbon />
        </motion.div>
      </motion.div>

      {/* First-run welcome */}
      <WelcomeModal />

      {/* Streak Celebration Modal */}
      <StreakCelebration streak={streak} show={showStreakCelebration} onClose={() => setShowStreakCelebration(false)} />

      {/* Full-screen Meditation Player */}
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

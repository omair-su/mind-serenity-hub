import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import {
  getGreeting, getNextDay, getCompletedDays, getTotalMinutes, getCurrentStreak,
  getLongestStreak, getAllDayStates, getEarnedAchievements
} from "@/lib/userStore";
import { weeks } from "@/data/courseData";
import {
  ArrowRight, Library, BookOpen, Trophy,
  Flame, Clock, Target, Check, Sparkles, MessageCircle,
  Wind, Heart, Sun, Moon, Leaf, Play, ChevronRight, Headphones, Brain,
  Music, Zap, TrendingUp
} from "lucide-react";
import dashboardHero from "@/assets/dashboard-hero-premium.jpg";
import { getWellnessScore, getWellnessLevel } from "@/lib/wellnessScore";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const quotes = [
  { text: "The mind is everything. What you think, you become.", author: "Buddha" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { text: "In the midst of movement and chaos, keep stillness inside of you.", author: "Deepak Chopra" },
  { text: "Quiet the mind, and the soul will speak.", author: "Ma Jaya Sati Bhagavati" },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
  { text: "Meditation is not about stopping thoughts, but recognizing that we are more than our thoughts.", author: "Arianna Huffington" },
];

function getTimeIcon() {
  const h = new Date().getHours();
  if (h < 12) return Sun;
  if (h < 18) return Leaf;
  return Moon;
}

export default function DashboardPage() {
  const location = useLocation();
  const greeting = getGreeting();
  const nextDay = getNextDay();
  const completed = getCompletedDays();
  const totalMins = getTotalMinutes();
  const streak = getCurrentStreak();
  const longest = getLongestStreak();
  const allStates = getAllDayStates();
  const achievements = getEarnedAchievements();
  const earnedCount = achievements.filter(a => a.progress >= a.target).length;
  const allDays = weeks.flatMap(w => w.days);
  const nextDayData = allDays.find(d => d.day === nextDay);
  const todayQuote = quotes[new Date().getDate() % quotes.length];
  const percentage = Math.round((completed.length / 30) * 100);
  const todayPracticed = completed.includes(nextDay) || (allStates[nextDay]?.checklist?.every(Boolean));
  const wellness = getWellnessScore();
  const wellnessLevel = getWellnessLevel(wellness.total);
  const TimeIcon = getTimeIcon();

  const recentDays = completed.slice(-3).reverse().map(d => ({
    day: d,
    title: allDays.find(a => a.day === d)?.title || `Day ${d}`,
    date: allStates[d]?.completedAt ? new Date(allStates[d].completedAt!).toLocaleDateString() : 'Recently',
  }));

  const allSessions = [
    { icon: Wind, label: "Breathing", desc: "2 min calm", path: "/app/breathing", grad: "from-[hsl(var(--forest))]/12 to-[hsl(var(--sage))]/8" },
    { icon: Moon, label: "Sleep", desc: "Wind down", path: "/app/sleep", grad: "from-[hsl(var(--forest-deep))]/12 to-[hsl(var(--forest))]/8" },
    { icon: Heart, label: "SOS Calm", desc: "Quick relief", path: "/app/sos", grad: "from-[hsl(var(--gold))]/15 to-[hsl(var(--gold-light))]/8" },
    { icon: Sun, label: "Rituals", desc: "Daily flow", path: "/app/rituals", grad: "from-[hsl(var(--sage))]/12 to-[hsl(var(--cream-dark))]/8" },
    { icon: Brain, label: "Focus", desc: "Deep work", path: "/app/focus", grad: "from-[hsl(var(--forest))]/10 to-[hsl(var(--sage-dark))]/8" },
    { icon: Headphones, label: "Sound Bath", desc: "Frequencies", path: "/app/sound-bath", grad: "from-[hsl(var(--forest-mid))]/12 to-[hsl(var(--forest))]/6" },
    { icon: Music, label: "Soundscapes", desc: "Custom audio", path: "/app/soundscape-builder", grad: "from-[hsl(var(--gold-dark))]/12 to-[hsl(var(--gold))]/6" },
    { icon: Zap, label: "AI Coach", desc: "Smart guide", path: "/app/ai-recommendations", grad: "from-[hsl(var(--sage-dark))]/12 to-[hsl(var(--forest))]/6" },
    { icon: TrendingUp, label: "Analytics", desc: "Deep insights", path: "/app/advanced-analytics", grad: "from-[hsl(var(--forest-deep))]/10 to-[hsl(var(--sage))]/8" },
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
        {/* ── Premium Hero ── */}
        <motion.div variants={scaleInVariants} className="relative overflow-hidden rounded-2xl shadow-elevated">
          <img
            src={dashboardHero}
            alt="Zen meditation garden at golden hour"
            className="w-full h-64 sm:h-72 object-cover"
            width={1920}
            height={800}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--forest-deep))]/95 via-[hsl(var(--forest-deep))]/40 to-transparent" />

          {/* Glassmorphism quote overlay */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="absolute top-4 right-4 max-w-[200px] sm:max-w-[260px]"
          >
            <div className="backdrop-blur-md bg-card/15 rounded-xl px-3 py-2.5 border border-card/20">
              <p className="font-body text-[10px] sm:text-xs text-primary-foreground/90 italic leading-relaxed">
                "{todayQuote.text}"
              </p>
              <p className="text-[9px] font-body text-primary-foreground/60 mt-1">— {todayQuote.author}</p>
            </div>
          </motion.div>

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              {streak > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(var(--gold))]/90 text-xs font-body font-bold text-[hsl(var(--charcoal))] shadow-[var(--shadow-gold-val)]"
                >
                  <Flame className="w-3.5 h-3.5" /> {streak} Day Streak
                </motion.span>
              )}
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55, duration: 0.4, type: "spring", stiffness: 200 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-medium ${
                  todayPracticed
                    ? "bg-[hsl(var(--forest))]/80 text-primary-foreground"
                    : "backdrop-blur-sm bg-card/20 text-primary-foreground/80"
                }`}
              >
                {todayPracticed ? <><Check className="w-3 h-3" /> Done today</> : <><TimeIcon className="w-3 h-3" /> Not practiced yet</>}
              </motion.span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground leading-tight tracking-wide"
            >
              {greeting}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="font-body text-sm text-primary-foreground/60 mt-1"
            >
              Day {nextDay} of 30 · {30 - completed.length} sessions remaining
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <Link
                to={`/day/${nextDay}`}
                className="inline-flex items-center gap-2.5 mt-4 w-fit px-6 py-3 rounded-xl bg-[hsl(var(--gold))] text-[hsl(var(--charcoal))] font-body font-bold text-sm shadow-[var(--shadow-gold-val)] hover:brightness-110 transition-all duration-300 animate-pulse-subtle"
              >
                <Play className="w-4 h-4" />
                {todayPracticed ? "Review Practice" : `Start Day ${nextDay}`}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Unified Wellness + Stats ── */}
        <motion.div variants={itemVariants} className="bg-card rounded-2xl p-5 border border-border/50 shadow-[var(--shadow-soft-val)]">
          <div className="flex items-center gap-5">
            {/* Wellness Ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-20 h-20 flex-shrink-0"
            >
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
                <motion.circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="10"
                  strokeDasharray={`${wellness.total * 3.14} 314`}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: wellness.total / 100 }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  className="drop-shadow-[0_0_6px_hsl(var(--primary)/0.3)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-xl font-bold text-foreground">{wellness.total}</span>
                <span className="text-[7px] font-body font-bold text-muted-foreground uppercase tracking-tight">Wellness</span>
              </div>
            </motion.div>

            {/* Stats Chips */}
            <div className="flex-1 grid grid-cols-2 gap-2">
              {[
                { label: "Days Done", value: `${completed.length}/30`, icon: Target, accent: "text-primary" },
                { label: "Minutes", value: `${totalMins}`, icon: Clock, accent: "text-[hsl(var(--gold-dark))]" },
                { label: "Streak", value: `${streak}d`, icon: Flame, accent: "text-destructive" },
                { label: "Badges", value: `${earnedCount}`, icon: Trophy, accent: "text-[hsl(var(--sage-dark))]" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-2 p-2 rounded-xl bg-secondary/40"
                >
                  <s.icon className={`w-4 h-4 ${s.accent} flex-shrink-0`} />
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold text-foreground leading-none">{s.value}</p>
                    <p className="text-[9px] font-body text-muted-foreground">{s.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
            <span className={`text-xs font-body font-semibold ${wellnessLevel.color}`}>{wellnessLevel.label}</span>
            <span className="text-[10px] font-body text-muted-foreground">{wellnessLevel.description}</span>
          </div>
        </motion.div>

        {/* ── Today's Practice — Full Width Premium ── */}
        {nextDayData && (
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl border border-border/50 shadow-[var(--shadow-card-val)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--forest))]/8 via-card to-[hsl(var(--gold))]/6" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[hsl(var(--gold))]/10 to-transparent rounded-bl-full" />
            <div className="relative p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-[10px] font-body font-bold text-primary uppercase tracking-[0.2em]"
                  >
                    Today's Focus
                  </motion.p>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1.5 leading-snug"
                  >
                    Day {nextDay}: {nextDayData.title}
                  </motion.h3>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 mt-3"
                  >
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/60 text-xs font-body text-foreground/80">
                      <Clock className="w-3 h-3" /> {nextDayData.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/60 text-xs font-body text-foreground/80">
                      <Target className="w-3 h-3" /> {nextDayData.difficulty}
                    </span>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35, duration: 0.4, type: "spring" }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--forest))]/15 to-[hsl(var(--sage))]/20 flex items-center justify-center flex-shrink-0"
                >
                  <Leaf className="w-7 h-7 text-primary" />
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
              >
                <Link
                  to={`/day/${nextDay}`}
                  className="flex items-center justify-center gap-2 mt-5 w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-body font-bold text-sm hover:bg-primary/90 transition-colors shadow-[var(--shadow-soft-val)]"
                >
                  <Play className="w-4 h-4" /> Begin Session
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ── Sessions — Horizontal Scroll Strip ── */}
        <motion.div variants={itemVariants}>
          <h3 className="font-display text-base font-semibold text-foreground mb-3">Quick Sessions</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {allSessions.map((s, i) => (
              <motion.div
                key={s.path}
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.4, ease: "easeOut" }}
              >
                <Link
                  to={s.path}
                  className={`group flex flex-col items-center min-w-[88px] p-3.5 rounded-2xl bg-gradient-to-br ${s.grad} border border-border/40 shadow-[var(--shadow-soft-val)] hover:shadow-[var(--shadow-card-val)] hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0`}
                >
                  <div className="w-11 h-11 rounded-xl bg-card/80 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-body text-[11px] font-semibold text-foreground leading-tight text-center">{s.label}</span>
                  <span className="font-body text-[9px] text-muted-foreground mt-0.5">{s.desc}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Recent Activity (tight) ── */}
        <motion.div variants={itemVariants} className="bg-card rounded-2xl p-5 border border-border/50 shadow-[var(--shadow-soft-val)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-base font-semibold text-foreground">Recent Sessions</h3>
            <Link to="/app/journal" className="text-xs font-body text-primary font-medium hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {recentDays.length > 0 ? (
            <div className="space-y-1.5">
              {recentDays.map((d, i) => (
                <motion.div
                  key={d.day}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                >
                  <Link
                    to={`/day/${d.day}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[hsl(var(--sage-light))] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-medium text-foreground truncate">Day {d.day}: {d.title}</p>
                      <p className="text-[10px] font-body text-muted-foreground">{d.date}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-5"
            >
              <Leaf className="w-7 h-7 text-[hsl(var(--sage))] mx-auto mb-2" />
              <p className="text-sm font-body text-muted-foreground">Your journey begins with Day 1</p>
            </motion.div>
          )}
        </motion.div>

        {/* ── Explore Grid — 4 cards ── */}
        <motion.div variants={itemVariants}>
          <h3 className="font-display text-base font-semibold text-foreground mb-3">Explore</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Library", desc: "All 30 sessions", icon: Library, path: "/app/library", grad: "from-[hsl(var(--forest))]/10 to-[hsl(var(--sage))]/6" },
              { label: "Sleep Stories", desc: "Narrated tales", icon: BookOpen, path: "/app/sleep-stories", grad: "from-[hsl(var(--forest-deep))]/10 to-[hsl(var(--forest-mid))]/6" },
              { label: "Achievements", desc: `${earnedCount} earned`, icon: Trophy, path: "/app/achievements", grad: "from-[hsl(var(--gold))]/10 to-[hsl(var(--gold-light))]/6" },
              { label: "AI Coach", desc: "Personal guide", icon: MessageCircle, path: "/app/coach", grad: "from-[hsl(var(--sage-dark))]/10 to-[hsl(var(--sage))]/6" },
            ].map((card, i) => (
              <motion.div
                key={card.path}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.08, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <Link
                  to={card.path}
                  className={`block bg-gradient-to-br ${card.grad} rounded-2xl p-4 border border-border/40 shadow-[var(--shadow-soft-val)] hover:shadow-[var(--shadow-card-val)] hover:-translate-y-0.5 transition-all duration-300 h-full`}
                >
                  <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-gradient-to-tl from-card/10 to-transparent" />
                  <div className="w-10 h-10 rounded-xl bg-card/70 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-sm">
                    <card.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-display text-sm font-semibold text-foreground">{card.label}</p>
                  <p className="text-[11px] font-body text-muted-foreground mt-0.5">{card.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}

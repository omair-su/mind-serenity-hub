import { Link } from "react-router-dom";
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
import dashboardHero from "@/assets/dashboard-hero.jpg";
import { getWellnessScore, getWellnessLevel } from "@/lib/wellnessScore";

const quotes = [
  { text: "The mind is everything. What you think, you become.", author: "Buddha" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { text: "In the midst of movement and chaos, keep stillness inside of you.", author: "Deepak Chopra" },
  { text: "Quiet the mind, and the soul will speak.", author: "Ma Jaya Sati Bhagavati" },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
  { text: "Meditation is not about stopping thoughts, but recognizing that we are more than our thoughts.", author: "Arianna Huffington" },
];

export default function DashboardPage() {
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

  const recentDays = completed.slice(-5).reverse().map(d => ({
    day: d,
    title: allDays.find(a => a.day === d)?.title || `Day ${d}`,
    date: allStates[d]?.completedAt ? new Date(allStates[d].completedAt!).toLocaleDateString() : 'Recently',
  }));

  const wellness = getWellnessScore();
  const wellnessLevel = getWellnessLevel(wellness.total);

  const quickSessions = [
    { icon: Wind, label: "Breathing", desc: "2 min calm", path: "/app/breathing", iconGrad: "from-primary/20 to-sage/30", cardGrad: "from-primary/8 to-sage/5" },
    { icon: Moon, label: "Sleep", desc: "Wind down", path: "/app/sleep", iconGrad: "from-indigo-500/20 to-violet-500/15", cardGrad: "from-indigo-500/8 to-violet-500/5" },
    { icon: Heart, label: "SOS Calm", desc: "Quick relief", path: "/app/sos", iconGrad: "from-rose-500/20 to-pink-500/15", cardGrad: "from-rose-500/8 to-pink-500/5" },
    { icon: Sun, label: "Rituals", desc: "Daily flow", path: "/app/rituals", iconGrad: "from-gold/20 to-amber-500/15", cardGrad: "from-gold/8 to-amber-500/5" },
    { icon: Brain, label: "Focus", desc: "Deep work", path: "/app/focus", iconGrad: "from-primary/20 to-emerald-500/15", cardGrad: "from-primary/8 to-emerald-500/5" },
    { icon: Headphones, label: "Sound Bath", desc: "Frequencies", path: "/app/sound-bath", iconGrad: "from-violet-500/20 to-purple-500/15", cardGrad: "from-violet-500/8 to-purple-500/5" },
  ];

  const premiumFeatures = [
    { icon: Music, label: "Soundscape Builder", desc: "Create custom audio", path: "/app/soundscape-builder", iconGrad: "from-violet-500/20 to-purple-500/15", cardGrad: "from-violet-500/8 to-purple-500/5" },
    { icon: Zap, label: "AI Recommendations", desc: "Smart suggestions", path: "/app/ai-recommendations", iconGrad: "from-amber-500/20 to-orange-500/15", cardGrad: "from-amber-500/8 to-orange-500/5" },
    { icon: TrendingUp, label: "Advanced Analytics", desc: "Deep insights", path: "/app/advanced-analytics", iconGrad: "from-cyan-500/20 to-blue-500/15", cardGrad: "from-cyan-500/8 to-blue-500/5" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">

        {/* ── Hero Card with Image ── */}
        <div className="relative overflow-hidden rounded-2xl shadow-elevated">
          <img
            src={dashboardHero}
            alt="Peaceful morning meditation"
            className="w-full h-56 sm:h-64 object-cover"
            width={1920}
            height={640}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--forest-deep))]/90 via-[hsl(var(--forest-deep))]/50 to-transparent" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
            <div className="flex items-center gap-2 mb-2">
              {streak > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/90 text-xs font-body font-semibold text-card-foreground shadow-gold">
                  <Flame className="w-3.5 h-3.5" /> {streak} Day Streak
                </span>
              )}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-medium ${
                todayPracticed
                  ? "bg-primary/80 text-primary-foreground"
                  : "bg-card/30 backdrop-blur-sm text-primary-foreground/90"
              }`}>
                {todayPracticed ? <><Check className="w-3 h-3" /> Done today</> : "Not practiced yet"}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-primary-foreground leading-tight tracking-wide">
              {greeting}
            </h1>
            <p className="font-body text-sm text-primary-foreground/75 italic mt-1 max-w-md leading-relaxed">
              "{todayQuote.text}"
              <span className="text-xs not-italic ml-1">— {todayQuote.author}</span>
            </p>

            <Link
              to={`/day/${nextDay}`}
              className="inline-flex items-center gap-2.5 mt-4 w-fit px-6 py-3 rounded-xl bg-gold text-card-foreground font-body font-semibold text-sm shadow-gold hover:brightness-110 transition-all duration-300"
            >
              <Play className="w-4 h-4" />
              {todayPracticed ? "Review Practice" : `Start Day ${nextDay}`}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── Wellness Score ── */}
        <div className="bg-gradient-to-br from-primary/5 via-card to-sage/8 rounded-2xl p-5 border border-border/50 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-base font-semibold text-foreground">Wellness Score</h3>
            <span className={`text-xs font-body font-semibold ${wellnessLevel.color}`}>{wellnessLevel.label}</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 flex-shrink-0 group cursor-help">
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-full bg-primary/5 blur-md group-hover:bg-primary/10 transition-all duration-500" />
              
              <svg className="w-full h-full -rotate-90 drop-shadow-sm" viewBox="0 0 120 120">
                {/* Background Track */}
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--secondary)/0.5)" strokeWidth="8" />
                
                {/* Progress Ring with Gradient-like effect via multiple strokes or just clean primary */}
                <circle 
                  cx="60" cy="60" r="52" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="10"
                  strokeDasharray={`${wellness.total * 3.26} 326`} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_hsl(var(--primary)/0.4)]" 
                />
                
                {/* Inner Decorative Ring */}
                <circle cx="60" cy="60" r="42" fill="none" stroke="hsl(var(--primary)/0.1)" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-bold text-foreground tracking-tight">{wellness.total}</span>
                <span className="text-[8px] font-body font-bold text-muted-foreground/60 uppercase tracking-tighter -mt-1">Score</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-2">
              {[
                { label: "Consistency", value: wellness.consistency, color: "bg-primary" },
                { label: "Depth", value: wellness.depth, color: "bg-emerald-500" },
                { label: "Engagement", value: wellness.engagement, color: "bg-amber-500" },
                { label: "Mood", value: wellness.mood, color: "bg-rose-500" },
                { label: "Growth", value: wellness.growth, color: "bg-violet-500" },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] font-body text-muted-foreground">{item.label}</span>
                    <span className="text-[9px] font-body font-medium text-foreground">{item.value}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1">
                    <div className={`${item.color} h-1 rounded-full transition-all`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] font-body text-muted-foreground mt-2">{wellnessLevel.description}</p>
        </div>

        {/* ── Premium Features ── */}
        <div className="bg-gradient-to-br from-gold/5 via-card to-amber-500/5 rounded-2xl p-5 border border-border/50 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              Premium Features
            </h3>
            <span className="text-xs px-2 py-1 rounded-full bg-gold/20 text-gold font-body font-semibold">NEW</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {premiumFeatures.map(f => (
              <Link
                key={f.path}
                to={f.path}
                className={`group flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br ${f.cardGrad} border border-border/50 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.iconGrad} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="font-body text-xs font-semibold text-foreground leading-tight text-center">{f.label}</span>
                <span className="font-body text-[9px] text-muted-foreground">{f.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Quick Sessions Row ── */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickSessions.map(s => (
            <Link
              key={s.path}
              to={s.path}
              className={`group flex flex-col items-center p-3 rounded-2xl bg-gradient-to-br ${s.cardGrad} border border-border/50 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300`}
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.iconGrad} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="font-body text-[11px] font-semibold text-foreground leading-tight text-center">{s.label}</span>
              <span className="font-body text-[9px] text-muted-foreground">{s.desc}</span>
            </Link>
          ))}
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Days", value: completed.length, sub: `${percentage}% complete`, icon: Target, iconBg: "bg-gradient-to-br from-primary/20 to-sage/25", iconColor: "text-primary", gradient: "from-emerald-500/10 to-teal-500/5" },
            { label: "Minutes", value: totalMins, sub: `${(totalMins / 60).toFixed(1)}h total`, icon: Clock, iconBg: "bg-gradient-to-br from-gold/20 to-amber-500/15", iconColor: "text-gold", gradient: "from-amber-500/10 to-yellow-500/5" },
            { label: "Streak", value: streak, sub: `Best: ${longest}`, icon: Flame, iconBg: "bg-gradient-to-br from-rose-500/20 to-red-500/15", iconColor: "text-destructive", gradient: "from-rose-500/10 to-red-500/5" },
            { label: "Badges", value: earnedCount, sub: `of ${achievements.length}`, icon: Trophy, iconBg: "bg-gradient-to-br from-violet-500/20 to-purple-500/15", iconColor: "text-violet-600", gradient: "from-violet-500/10 to-purple-500/5" },
          ].map(stat => (
            <div key={stat.label} className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} rounded-2xl p-4 border border-border/50 shadow-soft`}>
              <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-gradient-to-bl from-card/20 to-transparent" />
              <div className="relative z-10 flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-foreground leading-none">{stat.value}</p>
                  <p className="text-xs font-body font-medium text-foreground/80 mt-0.5">{stat.label}</p>
                  <p className="text-[10px] font-body text-muted-foreground">{stat.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Progress Ring + Today's Practice ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Progress */}
          <div className="bg-gradient-to-br from-gold/5 to-amber-500/5 rounded-2xl p-5 border border-border/50 shadow-soft flex flex-col items-center">
            <h3 className="font-display text-base font-semibold text-foreground mb-3 self-start">Your Journey</h3>
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--secondary))" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--gold))" strokeWidth="10"
                  strokeDasharray={`${percentage * 3.14} 314`} strokeLinecap="round"
                  className="transition-all duration-1000 drop-shadow-[0_0_6px_hsl(var(--gold)/0.4)]" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-bold text-foreground">{percentage}%</span>
                <span className="text-[10px] font-body text-muted-foreground">{completed.length}/30</span>
              </div>
            </div>
            <p className="text-xs font-body text-muted-foreground mt-3 text-center">
              {completed.length < 30
                ? `${30 - completed.length} days to transformation`
                : "🎉 Journey Complete!"}
            </p>
          </div>

          {/* Today's Practice Card */}
          {nextDayData && (
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-card to-gold/5 rounded-2xl p-5 border border-border shadow-soft">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold/10 to-transparent rounded-bl-full" />
              <Leaf className="w-5 h-5 text-primary mb-2" />
              <p className="text-[10px] font-body font-bold text-primary uppercase tracking-widest">Today's Focus</p>
              <h3 className="font-display text-lg font-semibold text-foreground mt-1 leading-snug">
                Day {nextDay}: {nextDayData.title}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center gap-1 text-xs font-body text-muted-foreground">
                  <Clock className="w-3 h-3" /> {nextDayData.duration}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-body text-muted-foreground">
                  <Target className="w-3 h-3" /> {nextDayData.difficulty}
                </span>
              </div>
              <Link
                to={`/day/${nextDay}`}
                className="flex items-center justify-center gap-2 mt-4 w-full py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:bg-primary/90 transition-colors shadow-soft"
              >
                <Play className="w-4 h-4" /> Begin Session
              </Link>
            </div>
          )}
        </div>

        {/* ── Recent Activity ── */}
        <div className="bg-gradient-to-br from-primary/5 to-sage/8 rounded-2xl p-5 border border-border/50 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-base font-semibold text-foreground">Recent Sessions</h3>
            <Link to="/app/journal" className="text-xs font-body text-primary font-medium hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {recentDays.length > 0 ? (
            <div className="space-y-2">
              {recentDays.map((d, i) => (
                <Link
                  key={d.day}
                  to={`/day/${d.day}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors group"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-sage/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-medium text-foreground truncate">Day {d.day}: {d.title}</p>
                    <p className="text-[10px] font-body text-muted-foreground">{d.date}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Leaf className="w-8 h-8 text-sage mx-auto mb-2" />
              <p className="text-sm font-body text-muted-foreground">Your journey begins with Day 1</p>
            </div>
          )}
        </div>

        {/* ── Explore Grid ── */}
        <div>
          <h3 className="font-display text-base font-semibold text-foreground mb-3">Explore</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Library", desc: "All 30 sessions", icon: Library, path: "/app/library", gradient: "from-emerald-500/12 to-teal-500/8", iconGrad: "from-primary/20 to-sage/25" },
              { label: "Sleep Stories", desc: "Narrated tales", icon: BookOpen, path: "/app/sleep-stories", gradient: "from-indigo-500/12 to-violet-500/8", iconGrad: "from-indigo-500/20 to-violet-500/15" },
              { label: "Challenges", desc: "Multi-day quests", icon: Target, path: "/app/challenges", gradient: "from-amber-500/12 to-orange-500/8", iconGrad: "from-amber-500/20 to-orange-500/15" },
              { label: "Affirmations", desc: "Daily power", icon: Sparkles, path: "/app/affirmations", gradient: "from-gold/10 to-amber-500/8", iconGrad: "from-gold/25 to-amber-500/15" },
              { label: "AI Coach", desc: "Personal guide", icon: MessageCircle, path: "/app/coach", gradient: "from-cyan-500/10 to-blue-500/8", iconGrad: "from-cyan-500/20 to-blue-500/15" },
              { label: "Achievements", desc: `${earnedCount} earned`, icon: Trophy, path: "/app/achievements", gradient: "from-violet-500/10 to-purple-500/8", iconGrad: "from-violet-500/20 to-purple-500/15" },
            ].map(card => (
              <Link
                key={card.path}
                to={card.path}
                className={`group relative overflow-hidden bg-gradient-to-br ${card.gradient} rounded-2xl p-4 border border-border/50 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300`}
              >
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-tl from-card/15 to-transparent group-hover:from-card/25 transition-all" />
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.iconGrad} flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-display text-sm font-semibold text-foreground">{card.label}</p>
                <p className="text-[11px] font-body text-muted-foreground mt-0.5">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Inspirational Footer ── */}
        <div className="text-center py-4">
          <Leaf className="w-5 h-5 text-sage mx-auto mb-2" />
          <p className="text-xs font-body text-muted-foreground italic">
            "Every breath is a fresh beginning."
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { getEarnedAchievements } from "@/lib/userStore";
import { Trophy, Lock, Award } from "lucide-react";

const rarityColors: Record<string, string> = {
  common: "bg-[hsl(var(--sage))]/10 text-[hsl(var(--sage-dark))] border border-[hsl(var(--sage))]/20",
  rare: "bg-[hsl(var(--forest))]/10 text-[hsl(var(--forest))] border border-[hsl(var(--forest))]/20",
  epic: "bg-[hsl(var(--forest-deep))]/10 text-[hsl(var(--forest-deep))] border border-[hsl(var(--forest-deep))]/20",
  legendary: "bg-gradient-to-r from-[hsl(var(--gold))]/20 to-[hsl(var(--gold-light))]/15 text-[hsl(var(--gold))] border border-[hsl(var(--gold))]/25",
};

const rarityGradients: Record<string, string> = {
  common: "from-[hsl(var(--sage))]/8 to-[hsl(var(--sage-light))]/5",
  rare: "from-[hsl(var(--forest))]/8 to-[hsl(var(--forest-mid))]/5",
  epic: "from-[hsl(var(--forest-deep))]/8 to-[hsl(var(--forest))]/5",
  legendary: "from-[hsl(var(--gold))]/10 to-[hsl(var(--gold-light))]/8",
};

const categoryLabels: Record<string, { label: string; icon: string }> = {
  consistency: { label: "Consistency", icon: "🔥" },
  completion: { label: "Completion", icon: "✅" },
  time: { label: "Time Invested", icon: "⏱️" },
  engagement: { label: "Engagement", icon: "💎" },
  mastery: { label: "Mastery", icon: "👑" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AchievementsPage() {
  const achievements = getEarnedAchievements();
  const earned = achievements.filter(a => a.progress >= a.target);
  const categories = ['consistency', 'completion', 'time', 'engagement', 'mastery'];
  const pct = Math.round((earned.length / achievements.length) * 100);

  return (
    <AppLayout>
      <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
        {/* Editorial hero */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl border border-[hsl(var(--gold))]/20 bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--forest-mid))] px-6 py-10 sm:px-10"
        >
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
            background: "radial-gradient(circle at 80% 20%, hsl(var(--gold) / 0.45) 0%, transparent 50%), radial-gradient(circle at 10% 90%, hsl(var(--sage) / 0.25) 0%, transparent 50%)"
          }} />
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(var(--gold))]/15 border border-[hsl(var(--gold))]/30 text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-[hsl(var(--gold-light))]">
                <Award className="w-3 h-3" /> Honors
              </span>
              <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-[hsl(var(--cream))] leading-[1.05]">Your achievements</h1>
              <p className="mt-2 font-body text-sm text-[hsl(var(--cream))]/70">{earned.length} of {achievements.length} badges earned</p>
            </div>
            <div className="text-right">
              <p className="font-display text-6xl sm:text-7xl font-bold text-[hsl(var(--gold-light))] leading-none tabular-nums">{pct}<span className="text-3xl">%</span></p>
              <p className="text-[11px] font-body uppercase tracking-[0.2em] text-[hsl(var(--cream))]/60 mt-1">unlocked</p>
            </div>
          </div>
          <div className="relative mt-6 h-2 bg-[hsl(var(--cream))]/15 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full bg-gradient-to-r from-[hsl(var(--gold-dark))] via-[hsl(var(--gold))] to-[hsl(var(--gold-light))] rounded-full shadow-[0_0_12px_hsl(var(--gold)/0.5)]"
            />
          </div>
        </motion.div>

        {categories.map(cat => {
          const catAchievements = achievements.filter(a => a.category === cat);
          const catInfo = categoryLabels[cat];
          return (
            <motion.div key={cat} variants={itemVariants}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{catInfo.icon}</span>
                <h2 className="font-display text-xl font-semibold text-foreground">{catInfo.label}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catAchievements.map((a, i) => {
                  const isEarned = a.progress >= a.target;
                  const gradient = rarityGradients[a.rarity];
                  return (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                        isEarned
                          ? `bg-gradient-to-br ${gradient} border-border/50 shadow-[var(--shadow-soft-val)] hover:shadow-[var(--shadow-card-val)] hover:-translate-y-0.5`
                          : "bg-card/50 border-border opacity-60"
                      }`}
                    >
                      {isEarned && <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-gradient-to-bl from-[hsl(var(--gold))]/10 to-transparent" />}
                      <div className="flex items-start gap-4 relative z-10">
                        <div className={`w-13 h-13 rounded-xl flex items-center justify-center text-2xl ${
                          isEarned ? "bg-card/60" : "bg-secondary"
                        }`} style={{ width: '3.25rem', height: '3.25rem' }}>
                          {isEarned ? a.icon : <Lock className="w-5 h-5 text-muted-foreground" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-display text-sm font-semibold text-foreground">{a.name}</p>
                            <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full capitalize ${rarityColors[a.rarity]}`}>
                              {a.rarity}
                            </span>
                          </div>
                          <p className="text-xs font-body text-muted-foreground">{a.description}</p>
                          {!isEarned && (
                            <div className="mt-2">
                              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[hsl(var(--forest))] to-[hsl(var(--sage-dark))] rounded-full transition-all" style={{ width: `${(a.progress / a.target) * 100}%` }} />
                              </div>
                              <p className="text-[10px] font-body text-muted-foreground mt-1">{a.progress}/{a.target}</p>
                            </div>
                          )}
                          {isEarned && a.earnedDate && (
                            <p className="text-[10px] font-body text-[hsl(var(--gold))] font-medium mt-1">Earned {a.earnedDate}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </AppLayout>
  );
}

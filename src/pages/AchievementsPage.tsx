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
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[hsl(var(--gold))]/25 to-[hsl(var(--gold-light))]/15 flex items-center justify-center">
            <Award className="w-5 h-5 text-[hsl(var(--gold))]" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Achievements</h1>
            <p className="text-sm font-body text-muted-foreground">{earned.length} of {achievements.length} badges earned</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative overflow-hidden bg-gradient-to-br from-[hsl(var(--gold))]/10 via-[hsl(var(--gold-light))]/8 to-[hsl(var(--cream))]/5 rounded-2xl border border-[hsl(var(--gold))]/15 p-6 shadow-[var(--shadow-soft-val)]">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-bl from-[hsl(var(--gold))]/10 to-transparent" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--gold))]/20 to-[hsl(var(--gold-light))]/15 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-[hsl(var(--gold))]" />
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-foreground">{pct}%</p>
              <p className="text-sm font-body text-muted-foreground">{earned.length} badges unlocked</p>
            </div>
          </div>
          <div className="h-3 bg-card/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[hsl(var(--gold))] via-[hsl(var(--gold-light))] to-[hsl(var(--gold))] rounded-full shadow-sm"
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
                                <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all" style={{ width: `${(a.progress / a.target) * 100}%` }} />
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

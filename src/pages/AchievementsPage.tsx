import AppLayout from "@/components/AppLayout";
import { getEarnedAchievements } from "@/lib/userStore";
import { Trophy, Lock, Award } from "lucide-react";

const rarityColors: Record<string, string> = {
  common: "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20",
  rare: "bg-blue-500/10 text-blue-700 border border-blue-500/20",
  epic: "bg-violet-500/10 text-violet-700 border border-violet-500/20",
  legendary: "bg-gradient-to-r from-gold/20 to-amber-500/15 text-gold border border-gold/25",
};

const rarityGradients: Record<string, string> = {
  common: "from-emerald-500/8 to-teal-500/5",
  rare: "from-blue-500/8 to-indigo-500/5",
  epic: "from-violet-500/8 to-purple-500/5",
  legendary: "from-amber-500/10 to-gold/8",
};

const categoryLabels: Record<string, { label: string; icon: string }> = {
  consistency: { label: "Consistency", icon: "🔥" },
  completion: { label: "Completion", icon: "✅" },
  time: { label: "Time Invested", icon: "⏱️" },
  engagement: { label: "Engagement", icon: "💎" },
  mastery: { label: "Mastery", icon: "👑" },
};

export default function AchievementsPage() {
  const achievements = getEarnedAchievements();
  const earned = achievements.filter(a => a.progress >= a.target);
  const categories = ['consistency', 'completion', 'time', 'engagement', 'mastery'];
  const pct = Math.round((earned.length / achievements.length) * 100);

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold/25 to-amber-500/15 flex items-center justify-center">
            <Award className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Achievements</h1>
            <p className="text-sm font-body text-muted-foreground">{earned.length} of {achievements.length} badges earned</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-gold/10 via-amber-500/8 to-yellow-500/5 rounded-2xl border border-gold/15 p-6 shadow-soft">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-bl from-gold/10 to-transparent" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-amber-500/15 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-gold" />
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-foreground">{pct}%</p>
              <p className="text-sm font-body text-muted-foreground">{earned.length} badges unlocked</p>
            </div>
          </div>
          <div className="h-3 bg-card/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gold via-gold-light to-amber-400 rounded-full transition-all duration-1000 shadow-sm"
              style={{ width: `${pct}%` }} />
          </div>
        </div>

        {categories.map(cat => {
          const catAchievements = achievements.filter(a => a.category === cat);
          const catInfo = categoryLabels[cat];
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{catInfo.icon}</span>
                <h2 className="font-display text-xl font-semibold text-foreground">{catInfo.label}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catAchievements.map(a => {
                  const isEarned = a.progress >= a.target;
                  const gradient = rarityGradients[a.rarity];
                  return (
                    <div key={a.id} className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                      isEarned
                        ? `bg-gradient-to-br ${gradient} border-border/50 shadow-soft hover:shadow-card hover:-translate-y-0.5`
                        : "bg-card/50 border-border opacity-60"
                    }`}>
                      {isEarned && <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-gradient-to-bl from-gold/10 to-transparent" />}
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
                            <p className="text-[10px] font-body text-gold font-medium mt-1">Earned {a.earnedDate}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}

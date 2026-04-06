import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { getProfile, saveProfile, UserProfile, getAllDayStates, getMoods, getTimerSessions } from "@/lib/userStore";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Check, User, Bell, Palette, Database, Download, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const goalOptions = ["Better Sleep", "Less Stress", "Anxiety Management", "Improve Focus", "Emotional Regulation", "Spiritual Growth", "Curiosity"];
const avatarOptions = ["🧘", "🌿", "🌸", "🦋", "🌊", "🔥", "⭐", "💎", "🌙", "🌺", "🍃", "✨"];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(getProfile());
  const [saved, setSaved] = useState(false);

  const update = (partial: Partial<UserProfile>) => {
    const next = { ...profile, ...partial };
    setProfile(next);
    saveProfile(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleGoal = (goal: string) => {
    const goals = profile.goals.includes(goal)
      ? profile.goals.filter(g => g !== goal)
      : [...profile.goals, goal];
    update({ goals });
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/15 flex items-center justify-center">
              <User className="w-5 h-5 text-violet-500" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
          </div>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-body text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              <Check className="w-4 h-4" /> Saved
            </span>
          )}
        </div>

        <Section icon={User} title="Your Profile" gradient="from-violet-500/12 to-purple-500/5" iconColor="text-violet-500">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-body font-medium text-foreground mb-2 block">Avatar</label>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                {avatarOptions.map(e => (
                  <button key={e} onClick={() => update({ avatarEmoji: e })}
                    className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                      profile.avatarEmoji === e ? "bg-gradient-to-br from-primary/15 to-sage/20 ring-2 ring-primary scale-110 shadow-sm" : "bg-secondary hover:bg-secondary/80"
                    }`}>{e}</button>
                ))}
              </div>
            </div>
            <Field label="Full Name">
              <Input value={profile.name} onChange={e => update({ name: e.target.value })} placeholder="Your name" className="font-body" />
            </Field>
            <Field label="Email">
              <Input value={profile.email} onChange={e => update({ email: e.target.value })} placeholder="your@email.com" type="email" className="font-body" />
            </Field>
            <Field label="Experience Level">
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map(exp => (
                  <button key={exp} onClick={() => update({ experience: exp })}
                    className={`py-2.5 rounded-xl text-sm font-body font-medium capitalize transition-all ${
                      profile.experience === exp ? "bg-gradient-to-r from-primary to-emerald-700 text-white shadow-md" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}>{exp}</button>
                ))}
              </div>
            </Field>
            <Field label="Goals">
              <div className="flex flex-wrap gap-2">
                {goalOptions.map(g => (
                  <button key={g} onClick={() => toggleGoal(g)}
                    className={`px-3 py-1.5 rounded-full text-sm font-body transition-all ${
                      profile.goals.includes(g) ? "bg-gradient-to-r from-primary to-emerald-700 text-white shadow-sm" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}>{g}</button>
                ))}
              </div>
            </Field>
            <Field label="Preferred Practice Time">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['morning', 'afternoon', 'evening', 'flexible'] as const).map(t => (
                  <button key={t} onClick={() => update({ preferredTime: t })}
                    className={`py-2 rounded-xl text-sm font-body font-medium capitalize transition-all ${
                      profile.preferredTime === t ? "bg-gradient-to-r from-primary to-emerald-700 text-white shadow-md" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}>{t}</button>
                ))}
              </div>
            </Field>
            <Field label={`Daily Time: ${profile.dailyMinutes} minutes`}>
              <Slider value={[profile.dailyMinutes]} onValueChange={v => update({ dailyMinutes: v[0] })} min={5} max={60} step={5} />
            </Field>
          </div>
        </Section>

        <Section icon={Palette} title="Display" gradient="from-amber-500/12 to-gold/5" iconColor="text-amber-500">
          <div className="space-y-4">
            <Field label="Theme">
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'auto'] as const).map(t => (
                  <button key={t} onClick={() => update({ theme: t })}
                    className={`py-2 rounded-xl text-sm font-body font-medium capitalize transition-all ${
                      profile.theme === t ? "bg-gradient-to-r from-primary to-emerald-700 text-white shadow-md" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}>{t}</button>
                ))}
              </div>
            </Field>
            <Field label="Font Size">
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'large'] as const).map(s => (
                  <button key={s} onClick={() => update({ fontSize: s })}
                    className={`py-2 rounded-xl text-sm font-body font-medium capitalize transition-all ${
                      profile.fontSize === s ? "bg-gradient-to-r from-primary to-emerald-700 text-white shadow-md" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}>{s}</button>
                ))}
              </div>
            </Field>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-body text-foreground">Reduce Motion</span>
              <Switch checked={profile.reduceMotion} onCheckedChange={v => update({ reduceMotion: v })} />
            </div>
          </div>
        </Section>

        <Section icon={Bell} title="Notifications" gradient="from-blue-500/12 to-cyan-500/5" iconColor="text-blue-500">
          <Field label="Daily Reminder Time">
            <Input type="time" value={profile.reminderTime} onChange={e => update({ reminderTime: e.target.value })} className="font-body w-40" />
          </Field>
        </Section>

        <Section icon={Database} title="Data Management" gradient="from-emerald-500/12 to-teal-500/5" iconColor="text-emerald-500">
          <div className="space-y-3">
            <button
              onClick={() => {
                const data = {
                  profile: getProfile(),
                  dayStates: getAllDayStates(),
                  moods: getMoods(),
                  timerSessions: getTimerSessions(),
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `willowvibes-data-${new Date().toISOString().split("T")[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Data downloaded successfully");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500/8 to-teal-500/5 border border-border/50 text-sm font-body text-foreground hover:from-emerald-500/15 hover:to-teal-500/10 transition-all shadow-soft"
            >
              <Download className="w-4 h-4 text-emerald-500" /> Download All Data (JSON)
            </button>
            <button
              onClick={() => {
                if (window.confirm("Are you sure? This will permanently delete all your progress, journal entries, and mood data.")) {
                  for (let i = 1; i <= 30; i++) localStorage.removeItem(`wv-day-${i}`);
                  localStorage.removeItem("wv-moods");
                  localStorage.removeItem("wv-streak");
                  localStorage.removeItem("wv-timer-sessions");
                  toast.success("All progress has been reset");
                  window.location.reload();
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/8 border border-destructive/15 text-sm font-body text-destructive hover:bg-destructive/15 transition-all"
            >
              <Trash2 className="w-4 h-4" /> Reset All Progress
            </button>
          </div>
        </Section>

        <Section icon={Sparkles} title="Subscription" gradient="from-gold/12 to-amber-500/5" iconColor="text-gold">
          <div className="bg-gradient-to-r from-gold/8 to-amber-500/5 rounded-xl p-4 border border-gold/15">
            <p className="font-body text-sm font-medium text-foreground">Complete Program — $147 (One-Time)</p>
            <p className="text-xs font-body text-muted-foreground mt-1">Lifetime Access · Joined {new Date(profile.joinDate).toLocaleDateString()}</p>
          </div>
        </Section>
      </div>
    </AppLayout>
  );
}

function Section({ icon: Icon, title, children, gradient, iconColor }: { icon: any; title: string; children: React.ReactNode; gradient: string; iconColor: string }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl border border-border/50 p-6 shadow-soft`}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center border border-border/30`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-body font-medium text-foreground mb-2 block">{label}</label>
      {children}
    </div>
  );
}

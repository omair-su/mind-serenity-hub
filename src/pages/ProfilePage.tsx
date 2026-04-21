import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { getProfile, getAllDayStates, getMoods, getTimerSessions } from "@/lib/userStore";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Check, User, Bell, Palette, Database, Download, Trash2, Sparkles, Crown,
  ExternalLink, Loader2, LogOut, KeyRound, ShieldAlert, Mail
} from "lucide-react";
import { toast } from "sonner";
import { useIsPremium } from "@/hooks/useIsPremium";
import { useProfile } from "@/hooks/useProfile";
import { useSubscription, planLabel } from "@/hooks/useSubscription";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AvatarUploader from "@/components/AvatarUploader";
import { subscribeToPush, unsubscribeFromPush, isPushSupported } from "@/lib/webPush";

const goalOptions = ["Better Sleep", "Less Stress", "Anxiety Management", "Improve Focus", "Emotional Regulation", "Spiritual Growth", "Curiosity"];
const avatarOptions = ["🧘", "🌿", "🌸", "🦋", "🌊", "🔥", "⭐", "💎", "🌙", "🌺", "🍃", "✨"];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile, update, notifPrefs, updateNotifPrefs } = useProfile();
  const [saved, setSaved] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { isPremium } = useIsPremium();
  const subscription = useSubscription();

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleUpdate = (partial: Parameters<typeof update>[0]) => {
    update(partial);
    flashSaved();
  };

  const toggleGoal = (goal: string) => {
    const goals = profile.goals.includes(goal)
      ? profile.goals.filter(g => g !== goal)
      : [...profile.goals, goal];
    handleUpdate({ goals });
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Open the billing portal to cancel? You'll keep Plus access until the end of your billing period.")) return;
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("paddle-customer-portal");
      if (error || !data?.url) {
        toast.error("Couldn't open billing portal. Please email support@willowvibes.com");
        return;
      }
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Couldn't open billing portal. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    navigate("/sign-in", { replace: true });
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setNewPassword("");
    toast.success("Password updated");
  };

  const handleBrowserPushToggle = async (on: boolean) => {
    if (on) {
      if (!isPushSupported()) {
        toast.error("Push notifications aren't supported in this browser. Try installing the app or using Chrome/Safari.");
        return;
      }
      const ok = await subscribeToPush();
      if (!ok) {
        toast.error("Couldn't enable push. Check your browser notification permissions.");
        await updateNotifPrefs({ browser_push: false });
        return;
      }
      toast.success("Reminders enabled. We'll nudge you gently — even when the app is closed.");
    } else {
      await unsubscribeFromPush();
    }
    await updateNotifPrefs({ browser_push: on });
    flashSaved();
  };

  const handleResetAll = async () => {
    if (!window.confirm("This will permanently delete all your progress, journal entries, mood logs, gratitude entries, and ritual completions — both on this device and in the cloud. Continue?")) return;
    for (let i = 1; i <= 30; i++) localStorage.removeItem(`wv-day-${i}`);
    localStorage.removeItem("wv-moods");
    localStorage.removeItem("wv-streak");
    localStorage.removeItem("wv-timer-sessions");
    if (profile.userId) {
      await Promise.all([
        supabase.from("mood_entries").delete().eq("user_id", profile.userId),
        supabase.from("gratitude_entries").delete().eq("user_id", profile.userId),
        supabase.from("ritual_completions").delete().eq("user_id", profile.userId),
        supabase.from("audio_history").delete().eq("user_id", profile.userId),
        supabase.from("user_progress").update({
          completed_sessions: [], achievements: [], mood_logs: [], journal_entries: [],
          gratitude_entries: [], favorites: [], total_minutes: 0, streak_days: 0,
        }).eq("user_id", profile.userId),
      ]);
    }
    toast.success("All progress has been reset");
    setTimeout(() => window.location.reload(), 800);
  };

  const handleDeleteAccount = async () => {
    const confirm1 = window.prompt('Type "DELETE" to permanently delete your account and all data. This cannot be undone.');
    if (confirm1 !== "DELETE") return;
    setDeleting(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;
      toast.success("Account deleted");
      await supabase.auth.signOut();
      navigate("/", { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Couldn't delete account. Email support@willowvibes.com");
    } finally {
      setDeleting(false);
    }
  };

  const handleDownloadAll = async () => {
    const local = {
      profile: getProfile(),
      dayStates: getAllDayStates(),
      moods: getMoods(),
      timerSessions: getTimerSessions(),
    };
    let cloud: Record<string, unknown> = {};
    if (profile.userId) {
      const [moods, gratitude, rituals, audio, progress, profileRow] = await Promise.all([
        supabase.from("mood_entries").select("*").eq("user_id", profile.userId),
        supabase.from("gratitude_entries").select("*").eq("user_id", profile.userId),
        supabase.from("ritual_completions").select("*").eq("user_id", profile.userId),
        supabase.from("audio_history").select("*").eq("user_id", profile.userId),
        supabase.from("user_progress").select("*").eq("user_id", profile.userId).maybeSingle(),
        supabase.from("profiles").select("*").eq("user_id", profile.userId).maybeSingle(),
      ]);
      cloud = {
        profile: profileRow.data,
        moods: moods.data,
        gratitude: gratitude.data,
        rituals: rituals.data,
        audio_history: audio.data,
        progress: progress.data,
      };
    }
    const data = { exportedAt: new Date().toISOString(), local, cloud };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `willowvibes-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data downloaded");
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        {/* Editorial header */}
        <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--gold))]/20 bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--forest-mid))] px-6 py-8 sm:px-8">
          <div className="absolute inset-0 opacity-25 pointer-events-none" style={{
            background: "radial-gradient(circle at 80% 20%, hsl(var(--gold) / 0.4) 0%, transparent 50%)"
          }} />
          <div className="relative flex items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(var(--gold))]/15 border border-[hsl(var(--gold))]/30 text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-[hsl(var(--gold-light))]">
                <User className="w-3 h-3" /> Your Account
              </span>
              <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-[hsl(var(--cream))] leading-[1.05]">Settings & Preferences</h1>
              <p className="mt-2 font-body text-sm text-[hsl(var(--cream))]/70">Tune Willow to your rhythm.</p>
            </div>
            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-body text-[hsl(var(--forest-deep))] bg-[hsl(var(--gold-light))] px-3 py-1.5 rounded-full font-semibold shadow-md flex-shrink-0">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>
        </div>

        <Section icon={User} title="Your Profile" gradient="from-violet-500/12 to-purple-500/5" iconColor="text-violet-500">
          <div className="space-y-5">
            {profile.userId ? (
              <Field label="Profile Photo">
                <AvatarUploader
                  userId={profile.userId}
                  currentUrl={profile.avatarUrl}
                  fallbackEmoji={profile.avatarEmoji}
                  onUploaded={(url) => handleUpdate({ avatarUrl: url })}
                />
              </Field>
            ) : null}

            <Field label="Avatar (fallback emoji)">
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                {avatarOptions.map(e => (
                  <button key={e} onClick={() => handleUpdate({ avatarEmoji: e })}
                    className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                      profile.avatarEmoji === e ? "bg-gradient-to-br from-primary/15 to-sage/20 ring-2 ring-primary scale-110 shadow-sm" : "bg-secondary hover:bg-secondary/80"
                    }`}>{e}</button>
                ))}
              </div>
            </Field>

            <Field label="Full Name">
              <Input value={profile.name} onChange={e => handleUpdate({ name: e.target.value })} placeholder="Your name" className="font-body" />
            </Field>

            {profile.authEmail && (
              <Field label="Account Email">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/50">
                  <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-body text-sm text-foreground truncate">{profile.authEmail}</span>
                </div>
                <p className="text-[11px] font-body text-muted-foreground mt-1.5">This is the email you signed in with. Contact support to change it.</p>
              </Field>
            )}

            <Field label="Experience Level">
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map(exp => (
                  <button key={exp} onClick={() => handleUpdate({ experience: exp })}
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
                  <button key={t} onClick={() => handleUpdate({ preferredTime: t })}
                    className={`py-2 rounded-xl text-sm font-body font-medium capitalize transition-all ${
                      profile.preferredTime === t ? "bg-gradient-to-r from-primary to-emerald-700 text-white shadow-md" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}>{t}</button>
                ))}
              </div>
            </Field>
            <Field label={`Daily Time: ${profile.dailyMinutes} minutes`}>
              <Slider value={[profile.dailyMinutes]} onValueChange={v => handleUpdate({ dailyMinutes: v[0] })} min={5} max={60} step={5} />
            </Field>
          </div>
        </Section>

        <Section icon={Palette} title="Display" gradient="from-amber-500/12 to-gold/5" iconColor="text-amber-500">
          <div className="space-y-4">
            <Field label="Theme">
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'auto'] as const).map(t => (
                  <button key={t} onClick={() => handleUpdate({ theme: t })}
                    className={`py-2 rounded-xl text-sm font-body font-medium capitalize transition-all ${
                      profile.theme === t ? "bg-gradient-to-r from-primary to-emerald-700 text-white shadow-md" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}>{t}</button>
                ))}
              </div>
            </Field>
            <Field label="Font Size">
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'large'] as const).map(s => (
                  <button key={s} onClick={() => handleUpdate({ fontSize: s })}
                    className={`py-2 rounded-xl text-sm font-body font-medium capitalize transition-all ${
                      profile.fontSize === s ? "bg-gradient-to-r from-primary to-emerald-700 text-white shadow-md" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}>{s}</button>
                ))}
              </div>
            </Field>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-body text-foreground">Reduce Motion</span>
              <Switch checked={profile.reduceMotion} onCheckedChange={v => handleUpdate({ reduceMotion: v })} />
            </div>
          </div>
        </Section>

        <Section icon={Bell} title="Notifications" gradient="from-blue-500/12 to-cyan-500/5" iconColor="text-blue-500">
          <div className="space-y-4">
            <Field label="Daily Reminder Time">
              <Input type="time" value={profile.reminderTime} onChange={e => handleUpdate({ reminderTime: e.target.value })} className="font-body w-40" />
            </Field>
            <NotifRow label="Browser & background push" hint="Get reminders even when the app is closed." checked={notifPrefs.browser_push} onChange={handleBrowserPushToggle} />
            <NotifRow label="Daily streak reminder" hint="Don't break the chain — we'll nudge you." checked={notifPrefs.daily_streak} onChange={(v) => updateNotifPrefs({ daily_streak: v })} />
            <NotifRow label="Weekly recap" hint="A summary of your practice every Sunday." checked={notifPrefs.weekly_recap} onChange={(v) => updateNotifPrefs({ weekly_recap: v })} />
            <NotifRow label="Email reminders" hint="Occasional encouragement by email." checked={notifPrefs.email_reminders} onChange={(v) => updateNotifPrefs({ email_reminders: v })} />
            <NotifRow label="Product updates & offers" hint="New features and special pricing." checked={notifPrefs.marketing} onChange={(v) => updateNotifPrefs({ marketing: v })} />
            {notifPrefs.browser_push && (
              <button
                onClick={async () => {
                  const { data, error } = await supabase.functions.invoke("send-push", {
                    body: { title: "Test from Willow Vibes 🌿", body: "If you can see this, background push is working." },
                  });
                  if (error || !data?.sent) toast.error("No devices received the push. Make sure you've enabled browser push above.");
                  else toast.success(`Sent to ${data.sent} device${data.sent === 1 ? "" : "s"}`);
                }}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-body text-foreground hover:bg-secondary/80 transition-all"
              >
                Send a test notification
              </button>
            )}
          </div>
        </Section>

        <Section icon={KeyRound} title="Account" gradient="from-slate-500/10 to-slate-400/5" iconColor="text-slate-500">
          <div className="space-y-4">
            <Field label="Change password">
              <div className="flex gap-2">
                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password (min 8 chars)" className="font-body flex-1" />
                <button
                  onClick={handleChangePassword}
                  disabled={pwLoading || newPassword.length < 8}
                  className="px-4 rounded-xl bg-gradient-to-r from-primary to-emerald-700 text-white text-sm font-body font-medium shadow-md disabled:opacity-50"
                >
                  {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update"}
                </button>
              </div>
            </Field>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-body font-medium text-foreground hover:bg-secondary/80 transition-all disabled:opacity-60"
            >
              {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              Sign Out
            </button>
          </div>
        </Section>

        <Section icon={Database} title="Data Management" gradient="from-emerald-500/12 to-teal-500/5" iconColor="text-emerald-500">
          <div className="space-y-3">
            <button
              onClick={handleDownloadAll}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500/8 to-teal-500/5 border border-border/50 text-sm font-body text-foreground hover:from-emerald-500/15 hover:to-teal-500/10 transition-all shadow-soft"
            >
              <Download className="w-4 h-4 text-emerald-500" /> Download All Data (JSON)
            </button>
            <button
              onClick={handleResetAll}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/8 border border-destructive/15 text-sm font-body text-destructive hover:bg-destructive/15 transition-all"
            >
              <Trash2 className="w-4 h-4" /> Reset All Progress
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/15 border border-destructive/30 text-sm font-body font-semibold text-destructive hover:bg-destructive/25 transition-all disabled:opacity-60"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
              Delete Account Permanently
            </button>
            <p className="text-[11px] font-body text-muted-foreground text-center leading-relaxed">
              Account deletion removes your auth login and all associated data. This cannot be undone.
            </p>
          </div>
        </Section>

        <Section icon={Sparkles} title="Subscription" gradient="from-gold/12 to-amber-500/5" iconColor="text-gold">
          {isPremium ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-gold/15 to-amber-500/8 rounded-xl p-4 border border-gold/25">
                <div className="flex items-start gap-3">
                  <Crown className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground">
                      {subscription.kind === "lifetime" ? "Willow Plus — Lifetime" : planLabel(subscription.productId)}
                    </p>
                    <p className="text-xs font-body text-muted-foreground mt-1">
                      Member since {new Date(profile.joinDate).toLocaleDateString()}
                    </p>

                    {subscription.kind === "subscription" && subscription.status && (
                      <div className="mt-3 pt-3 border-t border-gold/20 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-body">
                          <span className="text-muted-foreground">Status</span>
                          <span className="font-medium text-foreground capitalize">{subscription.status}</span>
                        </div>
                        {subscription.currentPeriodEnd && (
                          <div className="flex items-center justify-between text-xs font-body">
                            <span className="text-muted-foreground">
                              {subscription.cancelAtPeriodEnd ? "Access ends" : "Renews on"}
                            </span>
                            <span className="font-medium text-foreground">
                              {new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
                                year: "numeric", month: "short", day: "numeric"
                              })}
                            </span>
                          </div>
                        )}
                        {subscription.cancelAtPeriodEnd && (
                          <p className="text-[11px] font-body text-amber-700 dark:text-amber-400 mt-1">
                            Cancellation scheduled — you keep Plus access until the date above.
                          </p>
                        )}
                      </div>
                    )}

                    {subscription.kind === "lifetime" && (
                      <p className="text-[11px] font-body text-muted-foreground mt-2">
                        One-time purchase — no renewal needed.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {subscription.kind !== "lifetime" && (
                <>
                  <button
                    onClick={handleCancelSubscription}
                    disabled={portalLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary border border-border text-sm font-body font-medium text-foreground hover:bg-secondary/80 transition-all disabled:opacity-60"
                  >
                    {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                    Manage Billing & Invoices
                  </button>
                  <p className="text-[11px] font-body text-muted-foreground text-center leading-relaxed">
                    Open the Paddle billing portal to download invoices, update your card, or cancel. You'll keep Plus access until the end of your billing period. Refund requests are honored within 14 days per our{" "}
                    <Link to="/legal/refund" className="underline hover:text-foreground">Refund Policy</Link>.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                <p className="font-body text-sm font-medium text-foreground">Free Plan</p>
                <p className="text-xs font-body text-muted-foreground mt-1">Days 1–7 unlocked · Member since {new Date(profile.joinDate).toLocaleDateString()}</p>
              </div>
              <Link to="/pricing" className="block">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-gold via-gold-dark to-amber-700 text-white text-sm font-body font-bold shadow-lg hover:-translate-y-0.5 transition-all">
                  <Crown className="w-4 h-4" /> Upgrade to Willow Plus
                </button>
              </Link>
            </div>
          )}
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

function NotifRow({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-body font-medium text-foreground">{label}</p>
        <p className="text-xs font-body text-muted-foreground mt-0.5">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

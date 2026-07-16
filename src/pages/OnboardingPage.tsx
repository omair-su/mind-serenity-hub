import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getProfile, saveProfile } from "@/lib/userStore";
import {
  syncOnboardingAnswers,
  finalizeOnboarding,
  getResumeStep,
  setResumeStep,
  track,
} from "@/lib/onboardingSync";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Moon,
  Brain,
  Heart,
  Focus,
  Sparkles,
  Flame,
  Shield,
  Leaf,
  Eye,
  Sun,
  Sunrise,
  Sunset,
  RefreshCw,
  Check,
  Loader2,
} from "lucide-react";
import willowLogo from "@/assets/willow-logo.png";

const steps = [
  "welcome",
  "name",
  "goals",
  "stress",
  "coping",
  "feeling",
  "experience",
  "time",
  "minutes",
  "summary",
  "ready",
] as const;

const goalOptions = [
  { label: "Sleep soundly", icon: Moon, color: "from-[hsl(var(--forest-deep))] to-[hsl(var(--forest-mid))]" },
  { label: "Manage anxiety", icon: Shield, color: "from-[hsl(var(--forest))] to-[hsl(var(--sage-dark))]" },
  { label: "Reduce stress", icon: Heart, color: "from-[hsl(var(--sage-dark))] to-[hsl(var(--forest))]" },
  { label: "Be present & mindful", icon: Eye, color: "from-[hsl(var(--forest-mid))] to-[hsl(var(--forest))]" },
  { label: "Improve focus", icon: Focus, color: "from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))]" },
  { label: "Emotional balance", icon: Sparkles, color: "from-[hsl(var(--gold-light))] to-[hsl(var(--gold))]" },
  { label: "Something else", icon: Flame, color: "from-[hsl(var(--gold-dark))] to-[hsl(var(--forest-mid))]" },
];

const stressOptions = [
  { label: "Rarely", desc: "I handle stress well most days" },
  { label: "Occasionally", desc: "Some days are harder than others" },
  { label: "Frequently", desc: "Stress is a regular companion" },
  { label: "Every day", desc: "I feel overwhelmed most of the time" },
];

const copingOptions = [
  { label: "I don't know how to", desc: "I'm looking for guidance" },
  { label: "Mindfulness techniques", desc: "Breathing, meditation, etc." },
  { label: "I distract myself", desc: "TV, phone, food, etc." },
  { label: "None of the above", desc: "Something different" },
];

const feelingOptions = [
  { label: "Calm and peaceful", icon: Leaf },
  { label: "In control of my life", icon: Shield },
  { label: "More present", icon: Eye },
  { label: "All of the above", icon: Sparkles },
];

export default function OnboardingPage() {
  usePageSEO({
    title: "Welcome to Willow Vibes — Personalize Your Practice",
    description: "Tell us about your goals so Willow Vibes can tailor your meditation, sleep, and breathwork journey from day one.",
    canonical: "https://willowvibes.com/onboarding",
  });
  const navigate = useNavigate();
  const [step, setStep] = useState(() => getResumeStep(steps.length));
  const [profile, setProfile] = useState(getProfile());
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [finishing, setFinishing] = useState(false);
  const startedAt = useRef<number>(Date.now());

  // Mark started + persist + emit step view events
  useEffect(() => {
    track({ type: "onboarding_started" });
  }, []);

  useEffect(() => {
    setResumeStep(step);
    track({ type: "onboarding_step_view", step: steps[step], index: step });
  }, [step]);

  const update = (partial: Partial<typeof profile>) => {
    const next = { ...profile, ...partial };
    setProfile(next);
    syncOnboardingAnswers(next); // local + debounced cloud
    const key = Object.keys(partial)[0];
    track({
      type: "onboarding_step_answered",
      step: steps[step],
      index: step,
      value: partial[key as keyof typeof partial] as unknown,
    });
  };

  const goTo = (newStep: number, dir: "next" | "prev") => {
    setDirection(dir);
    setStep(newStep);
  };

  const next = async () => {
    if (step < steps.length - 1) {
      goTo(step + 1, "next");
    } else {
      setFinishing(true);
      const { synced, error } = await finalizeOnboarding(profile, startedAt.current);
      setFinishing(false);
      if (!synced) {
        toast({
          title: "Saved on this device",
          description: "We'll sync your answers as soon as you're back online.",
        });
        if (error) console.warn(error);
      }
      navigate("/app", { replace: true });
    }
  };

  const prev = () => {
    if (step > 0) goTo(step - 1, "prev");
  };

  const skip = async () => {
    track({ type: "onboarding_skipped", atStep: steps[step], index: step });
    setFinishing(true);
    await finalizeOnboarding(profile, startedAt.current);
    setFinishing(false);
    navigate("/app", { replace: true });
  };

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  // Disable Continue if the current step has no required answer
  const canContinue = (() => {
    switch (currentStep) {
      case "name": return profile.name.trim().length > 0;
      case "goals": return profile.goals.length > 0;
      case "stress": return !!profile.stressLevel;
      case "coping": return !!profile.stressManagement;
      case "feeling": return !!profile.desiredFeeling;
      default: return true;
    }
  })();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky progress header */}
      <div className="sticky top-0 z-20 bg-background/85 backdrop-blur-md px-6 pt-6 pb-3 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <img src={willowLogo} alt="Willow Vibes" className="w-9 h-9" />
          <span className="text-xs font-body text-muted-foreground tabular-nums">
            Step {step + 1} of {steps.length}
          </span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, hsl(var(--forest)), hsl(var(--gold)))" }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between px-6 pb-6 pt-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction === "next" ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === "next" ? -40 : 40 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col justify-center"
          >
          {/* ── Welcome ── */}
          {currentStep === "welcome" && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[hsl(var(--forest))] to-[hsl(var(--sage))] flex items-center justify-center shadow-lg"
              >
                <Leaf className="w-12 h-12 text-primary-foreground" />
              </motion.div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-4 leading-tight">
                Welcome to your<br />quiet practice
              </h1>
              <p className="font-body text-muted-foreground text-base leading-relaxed max-w-sm mx-auto">
                Ten thoughtful questions. Two minutes. A program shaped entirely around you.
              </p>
            </div>
          )}

          {/* ── Name ── */}
          {currentStep === "name" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2 leading-tight">
                What should we<br />call you?
              </h2>
              <p className="text-sm font-body text-muted-foreground mb-8">
                We'll use this in your daily practice 🌿
              </p>
              <Input
                value={profile.name}
                onChange={(e) => update({ name: e.target.value })}
                onKeyDown={(e) => { if (e.key === "Enter" && canContinue) next(); }}
                placeholder="Your name"
                className="font-body text-lg h-14 rounded-2xl border-2 border-border focus:border-primary bg-card"
                autoFocus
              />
            </div>
          )}

          {/* ── Goals ── */}
          {currentStep === "goals" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2 leading-tight">
                What would you love<br />to feel more of?
              </h2>
              <p className="text-sm font-body text-muted-foreground mb-6">
                Pick everything that resonates — we'll weave them into your sessions.
              </p>
              <div className="space-y-3">
                {goalOptions.map((g) => {
                  const isSelected = profile.goals.includes(g.label);
                  const Icon = g.icon;
                  return (
                    <button
                      key={g.label}
                      onClick={() => {
                        const goals = isSelected
                          ? profile.goals.filter((x) => x !== g.label)
                          : [...profile.goals, g.label];
                        update({ goals });
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-cream" />
                      </div>
                      <span className="font-body font-medium text-foreground text-left flex-1">{g.label}</span>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Stress ── */}
          {currentStep === "stress" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2 leading-tight">
                How often do you<br />feel stressed?
              </h2>
              <p className="text-sm font-body text-muted-foreground mb-8">
                Be honest — there's no wrong answer here.
              </p>
              <div className="space-y-3">
                {stressOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => update({ stressLevel: opt.label })}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                      profile.stressLevel === opt.label
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <p className="font-body font-semibold text-foreground">{opt.label}</p>
                    <p className="text-xs font-body text-muted-foreground mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Coping ── */}
          {currentStep === "coping" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2 leading-tight">
                How do you cope<br />with it today?
              </h2>
              <p className="text-sm font-body text-muted-foreground mb-8">
                We'll meet you exactly where you are.
              </p>
              <div className="space-y-3">
                {copingOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => update({ stressManagement: opt.label })}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                      profile.stressManagement === opt.label
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <p className="font-body font-semibold text-foreground">{opt.label}</p>
                    <p className="text-xs font-body text-muted-foreground mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Feeling ── */}
          {currentStep === "feeling" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2 leading-tight">
                How would you like<br />to feel every day?
              </h2>
              <p className="text-sm font-body text-muted-foreground mb-8">
                Picture the quietest version of yourself.
              </p>
              <div className="space-y-3">
                {feelingOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => update({ desiredFeeling: opt.label })}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 ${
                        profile.desiredFeeling === opt.label
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="font-body font-semibold text-foreground">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Experience ── */}
          {currentStep === "experience" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2 leading-tight">
                Your meditation<br />experience?
              </h2>
              <p className="text-sm font-body text-muted-foreground mb-8">
                We'll calibrate the depth of guidance.
              </p>
              <div className="space-y-3">
                {([
                  { value: "beginner", label: "Complete Beginner", desc: "I've never meditated before", icon: "🌱" },
                  { value: "intermediate", label: "Some Experience", desc: "I've practiced a few times", icon: "🌿" },
                  { value: "advanced", label: "Regular Practitioner", desc: "I have an established practice", icon: "🌳" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update({ experience: opt.value })}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 ${
                      profile.experience === opt.value
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="text-left">
                      <p className="font-body font-semibold text-foreground">{opt.label}</p>
                      <p className="text-xs font-body text-muted-foreground mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Time ── */}
          {currentStep === "time" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2 leading-tight">
                When do you prefer<br />to practice?
              </h2>
              <p className="text-sm font-body text-muted-foreground mb-8">
                We'll nudge you at the perfect moment.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: "morning", label: "Morning", desc: "6–10 AM", Icon: Sunrise },
                  { value: "afternoon", label: "Afternoon", desc: "12–4 PM", Icon: Sun },
                  { value: "evening", label: "Evening", desc: "6–10 PM", Icon: Sunset },
                  { value: "flexible", label: "Flexible", desc: "Any time", Icon: RefreshCw },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update({ preferredTime: opt.value })}
                    className={`p-5 rounded-2xl border-2 text-center transition-all duration-200 ${
                      profile.preferredTime === opt.value
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <opt.Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="font-body font-semibold text-foreground text-sm">{opt.label}</p>
                    <p className="text-xs font-body text-muted-foreground mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Minutes ── */}
          {currentStep === "minutes" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2 leading-tight">
                How much time<br />can you give daily?
              </h2>
              <p className="text-sm font-body text-muted-foreground mb-10">
                Even five minutes will reshape your day.
              </p>
              <div className="text-center mb-8">
                <span className="font-display text-6xl font-bold text-primary tabular-nums">{profile.dailyMinutes}</span>
                <span className="font-body text-muted-foreground ml-2 text-lg">minutes</span>
              </div>
              <Slider
                value={[profile.dailyMinutes]}
                onValueChange={(v) => update({ dailyMinutes: v[0] })}
                min={5}
                max={30}
                step={5}
                className="mb-4"
              />
              <div className="flex justify-between text-xs font-body text-muted-foreground">
                <span>5 min</span><span>15 min</span><span>30 min</span>
              </div>
            </div>
          )}

          {/* ── Summary ── (NEW) */}
          {currentStep === "summary" && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[hsl(var(--gold-light))] to-[hsl(var(--gold))] flex items-center justify-center shadow-md">
                  <Sparkles className="w-8 h-8 text-cream" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground leading-tight">
                  Your personalized<br />practice plan
                </h2>
                <p className="text-sm font-body text-muted-foreground mt-2">
                  Review and adjust anytime in Settings.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: "Name", value: profile.name || "Friend" },
                  { label: "Focus", value: profile.goals.slice(0, 3).join(" • ") || "—" },
                  { label: "Stress", value: profile.stressLevel || "—" },
                  { label: "Aiming for", value: profile.desiredFeeling || "—" },
                  { label: "Experience", value: profile.experience.charAt(0).toUpperCase() + profile.experience.slice(1) },
                  { label: "Best time", value: profile.preferredTime.charAt(0).toUpperCase() + profile.preferredTime.slice(1) },
                  { label: "Daily commitment", value: `${profile.dailyMinutes} minutes` },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-card border border-border">
                    <span className="text-xs font-body uppercase tracking-wider text-muted-foreground">{row.label}</span>
                    <span className="text-sm font-body font-semibold text-foreground text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Ready ── */}
          {currentStep === "ready" && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center shadow-lg animate-pulse-glow"
              >
                <Sparkles className="w-10 h-10 text-cream" />
              </motion.div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3 leading-tight">
                You're in the right place<br />to start feeling better
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-8 max-w-sm mx-auto">
                Willow Vibes is proven to decrease stress by 50% and improve sleep by 40% in just 30 days.
              </p>

              <div className="space-y-3 text-left mb-6">
                {[
                  { icon: Heart, text: `Reduce stress with ${profile.dailyMinutes}-min daily guided practices` },
                  { icon: Moon, text: "Sleep better with soothing wind-downs" },
                  { icon: Brain, text: "Build lasting habits with science-backed methods" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-body text-foreground">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="bg-accent/50 rounded-2xl p-4 border border-accent">
                <p className="text-sm font-body text-foreground">
                  <strong>{profile.name || "Friend"}</strong>, your personalized {profile.preferredTime} practice starts now.
                </p>
              </div>
            </div>
          )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Navigation */}
        <div className="pt-4 space-y-3">
          <button
            onClick={next}
            disabled={!canContinue || finishing}
            className="w-full py-4 rounded-2xl font-body font-bold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, hsl(var(--forest)), hsl(var(--forest-mid)))",
              color: "white",
              boxShadow: "0 8px 32px hsl(139 37% 27% / 0.3)",
            }}
          >
            {finishing && <Loader2 className="w-4 h-4 animate-spin" />}
            {currentStep === "ready" ? "Start My Journey" : currentStep === "summary" ? "Looks good — continue" : "Continue"}
          </button>

          <div className="flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={prev}
                className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}
            {step < steps.length - 1 && (
              <button
                onClick={skip}
                disabled={finishing}
                className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors px-2 py-2 disabled:opacity-50"
              >
                Skip for now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

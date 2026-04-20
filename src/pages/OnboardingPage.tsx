import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getProfile, saveProfile } from "@/lib/userStore";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight,
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
  Clock,
  Sunrise,
  Sunset,
  RefreshCw,
  Check,
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
  "ready",
];

const goalOptions = [
  { label: "Sleep soundly", icon: Moon, color: "from-[hsl(240,60%,70%)] to-[hsl(260,50%,60%)]" },
  { label: "Manage anxiety", icon: Shield, color: "from-[hsl(180,50%,60%)] to-[hsl(160,45%,55%)]" },
  { label: "Reduce stress", icon: Heart, color: "from-[hsl(145,40%,55%)] to-[hsl(139,37%,40%)]" },
  { label: "Be present & mindful", icon: Eye, color: "from-[hsl(200,50%,60%)] to-[hsl(220,45%,55%)]" },
  { label: "Improve focus", icon: Focus, color: "from-[hsl(30,54%,65%)] to-[hsl(43,70%,50%)]" },
  { label: "Emotional balance", icon: Sparkles, color: "from-[hsl(300,40%,65%)] to-[hsl(280,45%,55%)]" },
  { label: "Something else", icon: Flame, color: "from-[hsl(15,60%,60%)] to-[hsl(0,50%,55%)]" },
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
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(getProfile());
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const update = (partial: Partial<typeof profile>) => {
    const next = { ...profile, ...partial };
    setProfile(next);
    saveProfile(next);
  };

  const animateStep = (newStep: number, dir: "next" | "prev") => {
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(newStep);
      setAnimating(false);
    }, 250);
  };

  const syncToCloud = async (finalProfile: typeof profile) => {
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return; // Not signed in yet — local only is fine
      await supabase
        .from("profiles")
        .update({
          display_name: finalProfile.name || null,
          experience_level: finalProfile.experience,
          goals: finalProfile.goals,
          onboarding_answers: {
            stressLevel: finalProfile.stressLevel,
            stressManagement: finalProfile.stressManagement,
            desiredFeeling: finalProfile.desiredFeeling,
            preferredTime: finalProfile.preferredTime,
            dailyMinutes: finalProfile.dailyMinutes,
          },
        })
        .eq("user_id", auth.user.id);
    } catch (e) {
      console.warn("Onboarding cloud sync failed (non-blocking)", e);
    }
  };

  const next = () => {
    if (step < steps.length - 1) {
      animateStep(step + 1, "next");
    } else {
      const finished = { ...profile, onboardingComplete: true };
      update({ onboardingComplete: true });
      void syncToCloud(finished);
      navigate("/app");
    }
  };

  const prev = () => {
    if (step > 0) animateStep(step - 1, "prev");
  };

  const skip = () => {
    const finished = { ...profile, onboardingComplete: true };
    update({ onboardingComplete: true });
    void syncToCloud(finished);
    navigate("/app");
  };

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar with logo + progress */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <img src={willowLogo} alt="Willow Vibes" className="w-10 h-10" />
          <span className="text-xs font-body text-muted-foreground">
            {step + 1} of {steps.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, hsl(var(--forest)), hsl(var(--gold)))",
            }}
          />
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col justify-between px-6 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: direction === "next" ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === "next" ? -40 : 40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 flex flex-col justify-center"
          >
          {/* ── Welcome ── */}
          {currentStep === "welcome" && (
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[hsl(var(--forest))] to-[hsl(var(--sage))] flex items-center justify-center shadow-lg">
                <Leaf className="w-12 h-12 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-4 leading-tight">
                Welcome to Your<br />Transformation
              </h1>
              <p className="font-body text-muted-foreground text-base leading-relaxed max-w-sm mx-auto">
                Let's personalize your experience so every session feels like it was made just for you.
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
                We'll use this to make your journey personal 🌿
              </p>
              <Input
                value={profile.name}
                onChange={(e) => update({ name: e.target.value })}
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
                Which goals should we<br />work toward together?
              </h2>
              <p className="text-sm font-body text-muted-foreground mb-6">
                Select all that resonate with you.
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
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-body font-medium text-foreground text-left flex-1">
                        {g.label}
                      </span>
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

          {/* ── Stress Level ── */}
          {currentStep === "stress" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2 leading-tight">
                How often do you<br />feel stressed?
              </h2>
              <p className="text-sm font-body text-muted-foreground mb-8">
                No pressure, there's no wrong answer 🙂
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
                How do you manage<br />your stress now?
              </h2>
              <p className="text-sm font-body text-muted-foreground mb-8">
                You've come to the right place for help!
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

          {/* ── Desired Feeling ── */}
          {currentStep === "feeling" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2 leading-tight">
                How would you like<br />to feel every day?
              </h2>
              <p className="text-sm font-body text-muted-foreground mb-8">
                Imagine if you didn't feel anxious or stressed.
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
                We'll tailor the guidance to your level.
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

          {/* ── Time Preference ── */}
          {currentStep === "time" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2 leading-tight">
                When do you prefer<br />to practice?
              </h2>
              <p className="text-sm font-body text-muted-foreground mb-8">
                We'll remind you at the perfect moment.
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
                Even 5 minutes can change your day.
              </p>
              <div className="text-center mb-8">
                <span className="font-display text-6xl font-bold text-primary">{profile.dailyMinutes}</span>
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
                <span>5 min</span>
                <span>15 min</span>
                <span>30 min</span>
              </div>
            </div>
          )}

          {/* ── Ready ── */}
          {currentStep === "ready" && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center shadow-lg animate-pulse-glow">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3 leading-tight">
                You're in the right place<br />to start feeling better
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-8 max-w-sm mx-auto">
                Willow Vibes is proven to decrease stress by 50% and improve sleep by 40% in just 30 days.
              </p>

              {/* Benefit cards */}
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

        {/* ── Bottom Navigation ── */}
        <div className="pt-4 space-y-3">
          <button
            onClick={next}
            className="w-full py-4 rounded-2xl font-body font-bold text-base transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, hsl(var(--forest)), hsl(var(--forest-mid)))",
              color: "white",
              boxShadow: "0 8px 32px hsl(139 37% 27% / 0.3)",
            }}
          >
            {currentStep === "ready" ? "Start My Journey" : "Continue"}
          </button>

          <div className="flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={prev}
                className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}
            {step < steps.length - 1 && (
              <button
                onClick={skip}
                className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
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

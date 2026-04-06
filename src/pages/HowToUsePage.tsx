import Layout from "@/components/Layout";
import { Clock, MapPin, Headphones, Brain, Target, Flame, Heart, CheckCircle2, Lightbulb, Shield, Zap } from "lucide-react";

const principles = [
  {
    icon: Clock,
    title: "Commit to a Consistent Time",
    description: "Choose a specific time each day — morning works best for most people. Attach meditation to an existing habit (after coffee, before shower). You never 'decide' to meditate; you just do what comes next.",
    color: "from-violet-500/15 to-purple-500/10",
    iconColor: "text-violet-500",
  },
  {
    icon: MapPin,
    title: "Same Place, Every Day",
    description: "Your brain creates location-based triggers. When you return to the same spot daily, your nervous system begins to calm the moment you sit down. Consistency builds the anchor.",
    color: "from-emerald-500/15 to-teal-500/10",
    iconColor: "text-emerald-500",
  },
  {
    icon: Target,
    title: "Follow the Sequence",
    description: "Each day builds on the last. Day 1 teaches breath awareness, Day 5 adds box breathing, Week 3 introduces loving-kindness. The progression is carefully designed — trust it and resist the urge to skip ahead.",
    color: "from-amber-500/15 to-gold/10",
    iconColor: "text-amber-500",
  },
  {
    icon: Brain,
    title: "Embrace the Wandering Mind",
    description: "Your mind will wander — this is not failure. Each time you notice and return your attention, that IS the practice. A session with 100 distractions and 100 returns is 100 mental reps, not 100 failures.",
    color: "from-blue-500/15 to-cyan-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: Heart,
    title: "Self-Compassion Over Perfection",
    description: "There is no 'good' or 'bad' meditation. Drop the judgment. The days you least want to sit are often the days you need it most. Just show up — even 3 minutes counts.",
    color: "from-rose-500/15 to-pink-500/10",
    iconColor: "text-rose-500",
  },
  {
    icon: Headphones,
    title: "Use the Audio Guidance",
    description: "Every day includes a guided audio meditation. Use headphones for best results. The voice guidance keeps you anchored when the mind wants to wander. Noise-canceling headphones dramatically improve focus.",
    color: "from-indigo-500/15 to-violet-500/10",
    iconColor: "text-indigo-500",
  },
  {
    icon: Flame,
    title: "Never Miss Twice",
    description: "Missing one day is a pause. Missing two days becomes a new habit. If life interrupts, pick up exactly where you left off — don't restart, don't try to 'catch up.' Just do today's practice.",
    color: "from-orange-500/15 to-amber-500/10",
    iconColor: "text-orange-500",
  },
];

const spaceItems = [
  { icon: MapPin, label: "Quiet Corner", desc: "Minimal interruptions" },
  { icon: Lightbulb, label: "Soft Lighting", desc: "Natural or warm light" },
  { icon: Shield, label: "Comfortable Seat", desc: "Chair or cushion" },
  { icon: Zap, label: "Phone on Silent", desc: "Non-negotiable" },
  { icon: Clock, label: "Timer Ready", desc: "Use the app timer" },
];

const keys = [
  { num: "01", text: "Consistency over perfection — same time each day builds the habit fastest." },
  { num: "02", text: "Start small — even 5 minutes counts. Almost always, you'll do more." },
  { num: "03", text: "Be patient with yourself — your mind will wander. That IS the practice." },
  { num: "04", text: "Don't judge your experience — there is no 'good' or 'bad' meditation." },
  { num: "05", text: "Progress isn't linear — some days will feel deeper than others." },
  { num: "06", text: "Habit stack — attach meditation to an existing daily habit." },
  { num: "07", text: "Track your progress — visual motivation reinforces the habit loop." },
  { num: "08", text: "Celebrate showing up — every single day you sit is a victory." },
];

export default function HowToUsePage() {
  return (
    <Layout>
      <div className="animate-fade-in space-y-10">
        <div>
          <span className="willow-badge mb-3 inline-block">Getting Started</span>
          <h1 className="font-display text-4xl lg:text-5xl font-medium text-foreground">How to Use This Program</h1>
          <p className="willow-body mt-4 max-w-2xl">
            This program is designed for complete beginners and experienced meditators alike. Seven principles will maximize your results over the next 30 days.
          </p>
        </div>

        <div className="space-y-4">
          {principles.map((step, i) => (
            <div key={i} className={`bg-gradient-to-br ${step.color} rounded-2xl border border-border/50 p-6 shadow-soft hover:shadow-md transition-all`}>
              <div className="flex gap-5 items-start">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center border border-border/30`}>
                  <step.icon className={`w-5 h-5 ${step.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground">{step.title}</h3>
                  <p className="willow-body mt-2 text-[15px]">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-amber-500/8 via-card to-gold/5 rounded-2xl border border-gold/20 p-6 shadow-soft">
          <h2 className="font-display text-2xl font-medium text-foreground mb-5 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gold" /> Your Meditation Space
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {spaceItems.map(item => (
              <div key={item.label} className="text-center p-4 rounded-xl bg-gradient-to-br from-card to-gold/5 border border-border/50 shadow-soft">
                <item.icon className="w-5 h-5 text-gold mx-auto mb-2" />
                <p className="text-sm font-body font-medium text-foreground">{item.label}</p>
                <p className="text-[11px] font-body text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="willow-body mt-5 text-sm">
            You do not need a dedicated meditation room. A quiet corner of your bedroom, living room, or even your car (parked!) will work. Perfect silence is not required — just minimal interruptions. Consistency of location matters more than the location itself.
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl font-medium text-foreground mb-5">8 Keys to a Successful 30 Days</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {keys.map((key) => (
              <div key={key.num} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-500/8 to-teal-500/5 border border-border/50 shadow-soft hover:shadow-md transition-all">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary/15 to-sage/10 flex items-center justify-center">
                  <span className="font-display text-sm font-semibold text-primary">{key.num}</span>
                </div>
                <p className="text-sm font-body text-foreground/80 leading-relaxed">{key.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/8 via-card to-sage/5 rounded-2xl border border-primary/15 p-6 shadow-soft">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display text-lg font-medium text-foreground mb-2">Your Daily Checklist</h3>
              <div className="space-y-2">
                {[
                  "Sit in your chosen spot at your chosen time",
                  "Open the app and navigate to today's practice",
                  "Put on headphones and press play on the audio",
                  "Follow the guided meditation (10–30 minutes)",
                  "Complete the reflection prompt in your journal",
                  "Log your mood in the Mood Tracker",
                  "Check off the day and protect your streak",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2 border-primary/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-body font-bold text-primary">{i + 1}</span>
                    </div>
                    <p className="text-sm font-body text-foreground/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gold/8 via-card to-amber-500/5 rounded-2xl border border-gold/20 p-6 shadow-soft">
          <p className="text-sm font-body leading-relaxed text-foreground/80 italic">
            "The days you least want to meditate are often the days you need it most. On those days, just sit for 3 minutes. That's enough. The act of showing up — even briefly — reinforces the neural pathway that says: I am someone who meditates."
          </p>
          <p className="text-xs font-body text-muted-foreground mt-3">— Willow Vibes™ Coaching Team</p>
        </div>
      </div>
    </Layout>
  );
}

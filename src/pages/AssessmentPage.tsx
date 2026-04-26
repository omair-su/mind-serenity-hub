import Layout from "@/components/Layout";
import { ClipboardCheck, PenLine, Sparkles } from "lucide-react";

export default function AssessmentPage() {
  const ratingAreas = [
    { label: "Stress Level", desc: "1 = overwhelming, 10 = minimal" },
    { label: "Sleep Quality", desc: "1 = terrible, 10 = deep and restorative" },
    { label: "Mental Clarity", desc: "1 = foggy and scattered, 10 = sharp and focused" },
    { label: "Emotional Regulation", desc: "1 = highly reactive, 10 = calm and centered" },
    { label: "Presence / Mindfulness", desc: "1 = constantly distracted, 10 = fully present" },
    { label: "Overall Inner Peace", desc: "1 = chaotic, 10 = serene" },
    { label: "Anxiety Level", desc: "1 = constant worry, 10 = calm and secure" },
    { label: "Ability to Focus", desc: "1 = cannot concentrate, 10 = laser focused" },
  ];

  const ratingGradients = [
    "from-gold-dark/10 to-gold/5",
    "from-charcoal/10 to-forest-deep/5",
    "from-forest-deep/10 to-forest/5",
    "from-forest/10 to-sage/5",
    "from-sage-dark/10 to-forest/5",
    "from-gold/10 to-gold-dark/5",
    "from-gold-dark/10 to-gold/5",
    "from-gold-dark/10 to-gold/5",
  ];

  return (
    <Layout>
      <div className="animate-fade-in space-y-10">
        <div>
          <span className="willow-badge mb-3 inline-block">Baseline</span>
          <h1 className="font-display text-4xl lg:text-5xl font-medium text-foreground">Pre-Challenge Assessment</h1>
          <p className="willow-body mt-4 max-w-2xl">
            Take an honest snapshot of where you are today. You will complete this same assessment on Day 30, and the comparison will show you exactly how far you have come.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            <h2 className="font-display text-2xl font-medium text-foreground">Rate Each Area (1–10 Scale)</h2>
          </div>
          {ratingAreas.map((area, i) => (
            <div key={area.label} className={`p-5 rounded-2xl bg-gradient-to-br ${ratingGradients[i]} border border-border/50 shadow-soft`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-body font-medium text-sm text-foreground">{area.label}</h3>
                <span className="text-xs font-body text-muted-foreground">{area.desc}</span>
              </div>
              <div className="grid grid-cols-10 gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <label key={num} className="text-center">
                    <input type="radio" name={area.label} className="sr-only peer" />
                    <span className="block py-2 rounded-lg border border-border/50 text-sm font-body text-muted-foreground cursor-pointer peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-forest-deep peer-checked:text-white peer-checked:border-primary peer-checked:shadow-md transition-all hover:bg-secondary">
                      {num}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <PenLine className="w-5 h-5 text-gold" />
            <h2 className="font-display text-2xl font-medium text-foreground">Reflection Prompts</h2>
          </div>
          {[
            "Why are you doing this challenge?",
            "What do you hope to gain in 30 days?",
            "What fears or resistance do you notice about starting?",
            "What does 'success' look like for you after 30 days?"
          ].map((prompt, i) => {
            const promptGradients = [
              "from-forest/8 to-sage/5",
              "from-gold-dark/8 to-gold/5",
              "from-gold/8 to-gold-dark/5",
              "from-forest-deep/8 to-forest/5",
            ];
            return (
              <div key={prompt} className={`p-5 rounded-2xl bg-gradient-to-br ${promptGradients[i]} border border-border/50 shadow-soft`}>
                <h3 className="font-display text-lg font-medium text-foreground mb-3">{prompt}</h3>
                <textarea
                  placeholder="Write your thoughts..."
                  className="w-full h-24 p-4 rounded-xl border border-border/50 bg-card/80 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none shadow-soft"
                />
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-gold/10 via-card to-gold/5 rounded-2xl border border-gold/20 p-6 shadow-soft text-center">
          <Sparkles className="w-6 h-6 text-gold mx-auto mb-3" />
          <h2 className="font-display text-2xl font-medium text-foreground mb-4">Your Commitment</h2>
          <p className="willow-body max-w-lg mx-auto italic text-sm">
            I commit to showing up for myself for the next 30 days. I commit to being gentle with myself, patient with my mind, and open to the transformation that is possible. I deserve this peace.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="text-left">
              <p className="text-xs font-body text-muted-foreground mb-1">Signature</p>
              <input type="text" placeholder="Your name" className="px-4 py-2 rounded-xl border border-border/50 bg-card font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-soft" />
            </div>
            <div className="text-left">
              <p className="text-xs font-body text-muted-foreground mb-1">Date</p>
              <input type="date" className="px-4 py-2 rounded-xl border border-border/50 bg-card font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-soft" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

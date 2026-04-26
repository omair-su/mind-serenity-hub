import Layout from "@/components/Layout";
import { foundationSections } from "@/data/courseData";
import { Sparkles } from "lucide-react";
import { usePageSEO } from "@/hooks/usePageSEO";

const factGradients = [
  "from-gold-dark/12 to-gold/5",
  "from-forest/12 to-sage/5",
  "from-gold/12 to-gold-dark/5",
  "from-forest-deep/12 to-forest/5",
  "from-rose-500/12 to-pink-500/5",
  "from-indigo-500/12 to-violet-500/5",
  "from-sage-dark/12 to-forest/5",
  "from-gold-dark/12 to-gold/5",
];

export default function SciencePage() {
  usePageSEO({
    title: "The Science of Meditation — Research-Backed Benefits | Willow Vibes",
    description:
      "Decades of neuroscience research on meditation: stress reduction, focus, sleep, emotional regulation, and brain changes. Evidence behind every Willow Vibes practice.",
    canonical: "https://www.willowvibes.com/science",
  });
  return (
    <Layout>
      <div className="animate-fade-in space-y-10">
        <div>
          <span className="willow-badge mb-3 inline-block">Evidence-Based</span>
          <h1 className="font-display text-4xl lg:text-5xl font-medium text-foreground">The Science of Meditation</h1>
          <p className="willow-body mt-4 max-w-2xl">
            Meditation is one of the most rigorously studied mental health interventions in modern neuroscience. Here is what decades of research have confirmed.
          </p>
        </div>

        <div className="space-y-4">
          {foundationSections.science.facts.map((fact, i) => (
            <div key={i} className={`p-6 rounded-2xl bg-gradient-to-br ${factGradients[i % factGradients.length]} border border-border/50 shadow-soft hover:shadow-md transition-all`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${factGradients[i % factGradients.length]} border border-border/30 flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl">{fact.icon}</span>
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground">{fact.title}</h3>
                  <p className="willow-body mt-2">{fact.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-gold/8 via-card to-gold/5 rounded-2xl border border-gold/20 p-6 shadow-soft">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <p className="text-sm font-body leading-relaxed text-foreground/80 italic">
              You are not simply 'relaxing' when you meditate. You are performing one of the most powerful neurological exercises available — one that physically reshapes your brain for resilience, focus, and calm. Every minute on the cushion is an investment in your mental architecture.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

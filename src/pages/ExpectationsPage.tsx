import Layout from "@/components/Layout";
import { foundationSections } from "@/data/courseData";
import { HelpCircle } from "lucide-react";

const weekGradients = [
  "from-emerald-500/12 to-teal-500/5",
  "from-amber-500/12 to-gold/5",
  "from-violet-500/12 to-purple-500/5",
  "from-blue-500/12 to-cyan-500/5",
];

const challengeGradients = [
  "from-rose-500/8 to-pink-500/5",
  "from-indigo-500/8 to-violet-500/5",
  "from-teal-500/8 to-emerald-500/5",
  "from-orange-500/8 to-amber-500/5",
  "from-blue-500/8 to-cyan-500/5",
  "from-violet-500/8 to-purple-500/5",
  "from-emerald-500/8 to-teal-500/5",
];

export default function ExpectationsPage() {
  return (
    <Layout>
      <div className="animate-fade-in space-y-10">
        <div>
          <span className="willow-badge mb-3 inline-block">Realistic Guide</span>
          <h1 className="font-display text-4xl lg:text-5xl font-medium text-foreground">What to Expect</h1>
          <p className="willow-body mt-4 max-w-2xl">
            Honesty builds trust. Here is what the next 30 days will actually feel like — the challenges and the breakthroughs.
          </p>
        </div>

        <div className="space-y-4">
          {foundationSections.weekExpectations.map((exp, i) => (
            <div key={exp.week} className={`p-6 rounded-2xl bg-gradient-to-br ${weekGradients[i % weekGradients.length]} border border-border/50 shadow-soft hover:shadow-md transition-all`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="willow-badge">Week {exp.week}</span>
                <h3 className="font-display text-xl font-medium text-foreground">{exp.title}</h3>
              </div>
              <p className="willow-body">{exp.description}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-display text-3xl font-medium text-foreground mb-6">Common Challenges & Solutions</h2>
          <div className="space-y-4">
            {[
              { q: "My mind won't stop thinking.", a: "That is the point. You are not trying to stop thoughts — you are practicing noticing them without getting swept away." },
              { q: "I fall asleep during meditation.", a: "Try meditating earlier in the day, sitting upright, keeping eyes slightly open, or shortening your session." },
              { q: "I don't have time.", a: "Five minutes. That is all you need to start. The real question is whether you are willing to prioritize yourself." },
              { q: "I feel more anxious when I meditate.", a: "This is temporary and typically resolves within 1–2 weeks. Try breath-focused practices or walking meditation." },
              { q: "Am I doing this right?", a: "If you are showing up and trying, you are doing it right. There is no perfect meditation." },
              { q: "Nothing is happening.", a: "Changes are cumulative and often subtle. Over 30 days, the people around you will notice." },
              { q: "I missed 3 days. Should I quit?", a: "Never. Simply open the next day's practice and begin again. There is no punishment for absence — only welcome for return." },
            ].map((item, i) => (
              <div key={i} className={`p-5 rounded-2xl bg-gradient-to-br ${challengeGradients[i % challengeGradients.length]} border border-border/50 shadow-soft hover:shadow-md transition-all`}>
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display text-lg font-medium text-foreground">"{item.q}"</h4>
                    <p className="willow-body mt-2 text-sm">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

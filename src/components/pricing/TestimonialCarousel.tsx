// Auto-rotating testimonial carousel with outcome metrics.
import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  metric: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Maya R.",
    role: "Founder, San Francisco",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    quote: "The AI coach reads me better than my therapist between sessions. My anxiety attacks went from weekly to once a month.",
    metric: "-78% panic episodes in 8 weeks",
  },
  {
    name: "James K.",
    role: "Engineer, Berlin",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    quote: "Cycle-sync didn't apply to me, but the ADHD focus stack absolutely did. First app where the focus mode actually works.",
    metric: "+3.2 hours deep work / week",
  },
  {
    name: "Priya S.",
    role: "Designer, Mumbai",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    quote: "I tried Calm and Headspace for years. Willow is the first one where I actually kept a 90-day streak.",
    metric: "92-day streak active",
  },
  {
    name: "Daniel O.",
    role: "Teacher, Lagos",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
    quote: "Sleep stories + 432 Hz frequencies put my insomnia to bed. Literally. I fall asleep within 12 minutes now.",
    metric: "Sleeps in <15 min vs. 90+",
  },
];

export default function TestimonialCarousel() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((p) => (p + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(id);
  }, [reduced]);

  const t = TESTIMONIALS[i];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-4">
        {[0, 1, 2, 3, 4].map((s) => <Star key={s} className="w-4 h-4 fill-primary text-primary" />)}
        <span className="text-xs text-muted-foreground ml-2">4.9 from 12,847 reviews</span>
      </div>
      <Quote className="w-8 h-8 text-primary/30 mb-3" />
      <p className="text-base sm:text-lg leading-relaxed text-foreground min-h-[112px]">"{t.quote}"</p>
      <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
        {t.metric}
      </div>
      <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border">
        <img src={t.avatar} alt={t.name} loading="lazy" className="w-10 h-10 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-sm">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.role}</p>
        </div>
        <div className="ml-auto flex gap-1.5">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Show testimonial ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${idx === i ? "bg-primary w-4" : "bg-border"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

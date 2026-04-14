import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { foundationSections, weeks } from "@/data/courseData";
import heroImg from "@/assets/hero-meditation.jpg";
import { ArrowRight, Leaf, BookOpen, FlaskConical, Clock, Sparkles, Brain, Heart, Shield, Target, Zap, Sun } from "lucide-react";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="animate-fade-in space-y-12">
        <div className="relative rounded-2xl overflow-hidden shadow-elevated">
          <img src={heroImg} alt="Peaceful meditation space" className="w-full h-64 lg:h-80 object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 lg:p-10">
            <span className="willow-badge mb-3 inline-block">Premium Edition</span>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-background leading-tight">
              The 30-Day<br />Mindfulness &<br />Meditation Challenge
            </h1>
            <p className="font-body text-sm text-background/80 mt-3 max-w-md">
              Transform Your Mind · Calm Your Nervous System · Reclaim Your Peace
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Leaf, label: "Unique Practices", value: "30", gradient: "from-emerald-500/12 to-teal-500/5", iconColor: "text-emerald-500" },
            { icon: BookOpen, label: "Fully Scripted", value: "100%", gradient: "from-violet-500/12 to-purple-500/5", iconColor: "text-violet-500" },
            { icon: FlaskConical, label: "Research Citations", value: "34+", gradient: "from-amber-500/12 to-gold/5", iconColor: "text-amber-500" },
            { icon: Clock, label: "Daily Time", value: "10–30 min", gradient: "from-blue-500/12 to-cyan-500/5", iconColor: "text-blue-500" },
          ].map(stat => (
            <div key={stat.label} className={`text-center p-5 rounded-2xl bg-gradient-to-br ${stat.gradient} border border-border/50 shadow-soft`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} border border-border/30 flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs font-body text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

        <div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">{foundationSections.welcome.title}</h2>
          <p className="font-display text-xl text-muted-foreground italic mb-6">{foundationSections.welcome.subtitle}</p>
          <div className="space-y-4">
            {foundationSections.welcome.content.map((para, i) => (
              <p key={i} className="willow-body">{para}</p>
            ))}
          </div>
          <blockquote className="willow-quote text-lg mt-8">
            "{foundationSections.welcome.quote}"
            <footer className="text-sm text-muted-foreground mt-2 not-italic">— Willow Vibes™</footer>
          </blockquote>
        </div>

        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

        <div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">After 30 Days, You Will Become</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: "A Calmer Mind", desc: "The constant mental chatter will quiet.", icon: Brain, gradient: "from-violet-500/12 to-purple-500/5", iconColor: "text-violet-500" },
              { title: "A Better Sleeper", desc: "Your body will learn to release the day and surrender to rest.", icon: Sun, gradient: "from-indigo-500/12 to-blue-500/5", iconColor: "text-indigo-500" },
              { title: "Emotionally Resilient", desc: "You will feel emotions fully without being controlled by them.", icon: Heart, gradient: "from-rose-500/12 to-pink-500/5", iconColor: "text-rose-500" },
              { title: "Deeply Focused", desc: "Your attention span will sharpen.", icon: Target, gradient: "from-amber-500/12 to-gold/5", iconColor: "text-amber-500" },
              { title: "Self-Compassionate", desc: "The harsh inner critic will soften.", icon: Sparkles, gradient: "from-emerald-500/12 to-teal-500/5", iconColor: "text-emerald-500" },
              { title: "Physically Healthier", desc: "Your cortisol will drop.", icon: Shield, gradient: "from-blue-500/12 to-cyan-500/5", iconColor: "text-blue-500" },
              { title: "Present in Your Life", desc: "You will stop living on autopilot.", icon: Leaf, gradient: "from-teal-500/12 to-emerald-500/5", iconColor: "text-teal-500" },
              { title: "A Person of Discipline", desc: "You will have proven to yourself that you can commit.", icon: Zap, gradient: "from-orange-500/12 to-amber-500/5", iconColor: "text-orange-500" },
            ].map(item => (
              <div key={item.title} className={`p-5 rounded-2xl bg-gradient-to-br ${item.gradient} border border-border/50 shadow-soft hover:shadow-md transition-all`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.gradient} border border-border/30 flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm font-body text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

        <div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">Your 4-Week Journey</h2>
          <div className="space-y-4">
            {weeks.map((week, i) => {
              const gradients = [
                "from-emerald-500/10 to-teal-500/5",
                "from-violet-500/10 to-purple-500/5",
                "from-amber-500/10 to-gold/5",
                "from-blue-500/10 to-cyan-500/5",
              ];
              return (
                <button
                  key={week.week}
                  onClick={() => navigate(`/week/${week.week}`)}
                  className={`w-full text-left p-5 rounded-2xl bg-gradient-to-br ${gradients[i % 4]} border border-border/50 shadow-soft hover:shadow-md transition-all group`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="willow-badge mb-2 inline-block">Week {week.week}</span>
                      <h3 className="font-display text-xl font-bold text-foreground">{week.title}</h3>
                      <p className="text-sm font-body text-muted-foreground mt-1">{week.subtitle}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-center py-8">
          <button
            onClick={() => navigate("/day/1")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-gold to-gold-dark text-white font-body font-semibold text-sm tracking-wide hover:shadow-lg transition-all shadow-gold"
          >
            Begin Day 1 <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs font-body text-muted-foreground mt-3">Your transformation starts with one breath.</p>
        </div>
      </div>
    </Layout>
  );
}

import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { MessageCircle, Send, Bot, User, Sparkles, Brain, Heart, Shield } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "coach";
  text: string;
  time: string;
}

const SUGGESTIONS = [
  "I'm feeling anxious right now",
  "I can't stop my thoughts during meditation",
  "Which day should I start with?",
  "How long until I see results?",
  "I missed several days. Should I restart?",
  "I'm struggling to stay consistent",
  "What's the best time to meditate?",
  "I fell asleep during meditation — is that bad?",
];

type Response = { triggers: string[]; reply: string };

const knowledgeBase: Response[] = [
  {
    triggers: ["anxious", "anxiety", "panic", "scared", "worried", "nervous"],
    reply: `I hear you — anxiety is exhausting, and I'm glad you reached out. 💚

Here's what the science tells us: anxiety activates your amygdala (the brain's alarm system). Meditation literally shrinks this structure over time with consistent practice.

**Right now, try this:** Close your eyes and take 4 slow breaths — inhale for 4 counts, hold for 4, exhale for 6. The extended exhale activates your vagus nerve and signals safety to your nervous system.

For your practice, I recommend:
• **Day 5** — Box Breathing Mastery (specifically designed for anxiety)
• **Day 18** — Loving-Kindness (reduces the self-critical loop that feeds anxiety)
• The **SOS Relief** section for immediate help anytime

You're in exactly the right place. Keep going. 🌿`
  },
  {
    triggers: ["thoughts", "mind wanders", "can't focus", "distracted", "thinking too much", "stop thinking", "quiet mind", "racing thoughts"],
    reply: `This is the most common question I receive — and here's the secret that changes everything: **the goal is NOT to stop your thoughts.**

Your mind wandering is not failure. It's the practice. Every time you notice your mind has wandered and you gently return your attention — that IS meditation. That moment of noticing is the mental rep that builds focus over time.

Think of it like going to the gym. The effort (returning attention) is what creates the benefit. If your mind never wandered, there would be nothing to train.

**Practical tips:**
• Label thoughts as "thinking" without judgment, then return to breath
• Count breaths (1 on inhale, 2 on exhale... up to 10, then restart)
• Day 3 ("Counting Meditation") is specifically designed for this

The meditators who think they're "bad at meditation" because of busy minds are often making the most progress — they're getting more mental reps. 🏋️`
  },
  {
    triggers: ["which day", "where to start", "beginner", "new", "first day", "starting", "how to begin"],
    reply: `Welcome! I'm thrilled you're here. Here's exactly where to start:

**If you're brand new:** Start with **Day 1 — Breath Awareness**. It's 15 minutes and teaches the single most fundamental skill in all of meditation. Don't skip it even if you feel impatient.

**The first week progression:**
• Days 1–3: Pure breath awareness (builds the foundation)
• Days 4–5: Adding structure with counting and box breathing
• Days 6–7: Body awareness and gratitude

**Before you begin, read:**
• Welcome → How to Use This Challenge → The Science
• This 15-minute investment will triple your results

The sequence is carefully designed — each day builds on the last. Trust it. 🌱`
  },
  {
    triggers: ["results", "when", "how long", "benefits", "work", "does it work", "timeline", "how soon"],
    reply: `Great question — here's the honest, science-backed timeline:

**Week 1:** You'll notice small moments of calm. Your breathing deepens. You sleep slightly better.

**Week 2:** Your reaction to stress begins to slow. That 2-second pause between trigger and response starts appearing.

**Week 3-4:** Friends and family may notice before you do. More emotional stability. Better sleep quality. Reduced cortisol.

**After 8 weeks:** Harvard MRI studies show measurable brain changes — amygdala shrinkage, prefrontal cortex thickening.

**Key truth:** Results are not linear. Day 12 might feel worse than Day 6. That's normal and part of the integration process. The benefits accumulate beneath the surface even when it doesn't feel like anything is happening.

Show up every day. Trust the process. 🧠`
  },
  {
    triggers: ["missed", "skipped", "behind", "restart", "start over", "fell behind", "haven't done"],
    reply: `First: take a breath. Missing days is not failure — quitting is.

Here's my rule: **Never miss twice.** One missed day is a pause. Two missed days becomes a new habit of missing. Get back today.

**What to do:**
• Pick up exactly where you left off — don't restart
• Don't try to "catch up" by doing multiple days at once
• Just do today's practice

**Why this matters:** Every meditation session — even after a gap — activates the neural pathways you've been building. Your practice doesn't disappear when you stop. It waits.

The meditators who complete 30 days aren't the ones who never miss. They're the ones who always come back. Welcome back. 💚`
  },
  {
    triggers: ["consistent", "habit", "motivation", "keep going", "give up", "hard", "difficult", "struggle"],
    reply: `Consistency is the entire game. Here's how to win it:

**The #1 strategy:** Habit stacking. Attach meditation to something you already do every day — after your morning coffee, before your shower, right when you sit at your desk. You never decide to meditate; you just do what comes next.

**When motivation is low:**
• Commit to just 3 minutes. Almost always, you'll do more.
• Remember: the days you least want to meditate are the days you need it most
• Your streak in the app is your accountability — protect it

**The science:** It takes 21–66 days to build a habit (not 21, despite the myth). You're literally rewiring your brain. Discomfort during this phase means it's working.

What specific obstacle is getting in your way? I can help you troubleshoot it. 🌿`
  },
  {
    triggers: ["when to meditate", "best time", "morning", "evening", "night", "lunch", "time of day"],
    reply: `The best time to meditate is the time you'll actually do it. Here's the science on timing:

**Morning (recommended):**
✦ Prefrontal cortex is most active before decision fatigue sets in
✦ Sets your mental tone for the entire day
✦ Builds the habit fastest (morning routines are the most stable)
✦ Cortisol naturally peaks 30-45 min after waking — meditation buffers this

**Evening:**
✦ Excellent for stress release and sleep preparation
✦ Day 2, 9, and 27 are specifically designed for evening practice
✦ Combine with the Sleep Meditations for powerful effect

**Midday:**
✦ Resets your nervous system after a stressful morning
✦ Even 5-10 minutes significantly improves afternoon focus

**The real answer:** Pick one consistent time and protect it like a sacred appointment. Same time builds the habit fastest. ⏰`
  },
  {
    triggers: ["fell asleep", "sleep", "sleeping", "doze", "nap"],
    reply: `You fell asleep — congratulations! Seriously.

Here's what happened: your nervous system was so depleted that when you finally gave it permission to rest, it took it. This is not failure. This is your body healing.

**That said, here's how to stay awake if you want to:**
• Meditate sitting upright rather than lying down
• Keep your eyes slightly open (soft downward gaze)
• Practice in the morning before your day drains your energy
• Try a shorter session and build duration gradually

**And if it keeps happening:** It means your sleep debt is real. Before worrying about meditation quality, prioritize 7-8 hours of sleep. A rested meditator makes 10x more progress than an exhausted one.

Either way — you showed up. That always counts. 💚`
  },
  {
    triggers: ["breathing", "breath", "breathwork"],
    reply: `Breath is the foundation of everything in this program — and for good reason.

**Why the breath is so powerful:**
The breath is the only automatic function of the body you can consciously control. When you influence your breath, you directly influence your autonomic nervous system — switching from sympathetic (fight-or-flight) to parasympathetic (rest-and-digest).

**Key techniques in your program:**
• **Box Breathing (Day 5):** 4-4-4-4 pattern. Military standard for acute stress
• **4-7-8 Breathing (Day 7):** Dr. Weil's "natural tranquilizer" — especially for sleep
• **Coherent Breathing:** 5-5 pattern activates optimal heart rate variability

Check out the **Breathing Exercises** section for interactive guided versions of all techniques. 🌬️`
  },
  {
    triggers: ["body scan", "body", "physical", "tension", "pain", "relax body"],
    reply: `Body scan meditation is one of the most evidence-backed practices in the entire program.

**What happens during a body scan:**
You systematically move attention through each body part, releasing unconsciously held tension. Most of us don't realize how much stress we carry physically until we do this practice.

**Science:** A 2019 meta-analysis found body scan meditation reduces chronic pain perception by 27%, physical symptoms of stress by 40%, and dramatically improves proprioceptive awareness.

**Your practices:**
• **Day 2** — Body Scan Introduction (perfect starting point)
• **Day 8** — Progressive Muscle Relaxation  
• **Day 13** — Deep Body Awareness
• The **Sleep Meditations** section has an extended body scan specifically for sleep

Approach it with curiosity, not judgment. Every body sensation is just information. 🧘`
  },
  {
    triggers: ["loving kindness", "compassion", "self-love", "love", "kindness", "metta"],
    reply: `Loving-kindness (Metta) meditation is one of my favorite practices in the program — and the research on it is extraordinary.

**What the science shows:**
• Increases activity in the brain's empathy circuits
• Reduces self-criticism and negative self-talk
• Decreases implicit racial and age bias (yes, really)
• Increases positive emotions that persist long after the session
• Reduces symptoms of PTSD and depression

**Your practices:**
• **Day 15** — Introduction to Loving-Kindness
• **Day 18** — Expanding Compassion
• **Day 22** — Advanced Metta Practice

The traditional phrases: *"May I be happy. May I be healthy. May I be safe. May I live with ease."* Start with yourself — you cannot pour from an empty cup. 💚`
  },
  {
    triggers: ["hi", "hello", "hey", "good morning", "good evening", "how are you"],
    reply: `Hello, and welcome! 🌿 I'm your Willow Vibes™ Meditation Coach — I'm here to support you through your 30-day journey.

I can help you with:
• 🧘 Choosing the right practice for how you're feeling right now
• 🔬 Understanding the science behind any technique
• 💪 Overcoming common obstacles like a wandering mind or inconsistency
• 💚 Navigating difficult emotions with meditation
• 📅 Planning your practice schedule

What would you like to explore today?`
  },
];

const defaultReply = (text: string): string => {
  const lower = text.toLowerCase();
  if (lower.includes("sleep")) {
    return `Sleep is one of the most powerful benefits this program delivers. 

The **Sleep Meditations** section has 8 specifically designed practices — from Body Scan to Yoga Nidra. I particularly recommend the **4-7-8 Sleep Breath** as a nightly ritual.

**Your sleep practices in the main program:**
• Day 2 — Body Scan (great before bed)
• Day 9 — Progressive Muscle Relaxation
• Day 25 — Deep Rest Meditation

Would you like tips on building a bedtime routine around these practices?`;
  }
  return `Thank you for sharing that with me. 💚

Based on what you've written, here's my guidance: approach your practice today with complete self-compassion. There is no perfect meditation — there is only showing up.

**My recommendations:**
• If you're stressed: Try the **SOS Relief** section for immediate support
• For your regular practice: Continue with your scheduled day in the program
• For deeper learning: Visit **Resources** → Science of Meditation

Remember: every single session — regardless of how it feels in the moment — is building the neural pathways of calm and focus. You are making progress even when you can't see it.

Is there something more specific I can help you with? I'm here. 🌿`;
};

function getReply(input: string): string {
  const lower = input.toLowerCase();
  for (const kb of knowledgeBase) {
    if (kb.triggers.some(t => lower.includes(t))) {
      return kb.reply;
    }
  }
  return defaultReply(input);
}

function formatText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} className="font-semibold text-foreground mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>;
    }
    if (line.startsWith("• ")) {
      const content = line.slice(2).replace(/\*\*([^*]+)\*\*/g, (_, m) => m);
      return (
        <div key={i} className="flex gap-2 items-start">
          <span className="text-primary mt-1 flex-shrink-0">•</span>
          <p dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>") }} />
        </div>
      );
    }
    if (line.startsWith("✦ ")) {
      return (
        <div key={i} className="flex gap-2 items-start">
          <span className="text-gold mt-0.5 flex-shrink-0">✦</span>
          <p dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>") }} />
        </div>
      );
    }
    if (line.trim() === "") return <div key={i} className="h-1" />;
    return <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>") }} />;
  });
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "coach",
      text: `Hello, and welcome to your personal meditation coaching session! 🌿

I'm your Willow Vibes™ Coach. I'm here to support you through your 30-day journey with personalized guidance on techniques, obstacles, and the science behind your practice.

What would you like to explore today? You can use one of the prompts below, or ask me anything about meditation.`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const send = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const reply = getReply(msg);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + "r",
        role: "coach",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }, 1200 + Math.random() * 600);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-120px)] max-h-[800px] animate-fade-in">
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/15 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-foreground">Meditation Coach</h1>
            <p className="text-xs font-body text-muted-foreground">Personalized guidance for your journey</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-body text-emerald-600 font-medium">Online</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/8 via-card to-teal-500/5 rounded-2xl border border-border/50 p-4 mb-4 flex-shrink-0 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-display text-sm font-semibold text-foreground">Willow Coach™</p>
              <p className="text-xs font-body text-muted-foreground">Expert in mindfulness, neuroscience & habit formation</p>
            </div>
            <div className="hidden sm:flex gap-1.5">
              {[
                { icon: Brain, color: "text-violet-500", bg: "from-violet-500/15 to-purple-500/10" },
                { icon: Heart, color: "text-rose-500", bg: "from-rose-500/15 to-pink-500/10" },
                { icon: Shield, color: "text-amber-500", bg: "from-amber-500/15 to-gold/10" },
              ].map((badge, i) => (
                <div key={i} className={`w-8 h-8 rounded-lg bg-gradient-to-br ${badge.bg} flex items-center justify-center`}>
                  <badge.icon className={`w-3.5 h-3.5 ${badge.color}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === "coach"
                  ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-sm"
                  : "bg-gradient-to-br from-gold/25 to-amber-500/20 text-gold"
              }`}>
                {msg.role === "coach" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`max-w-[82%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`rounded-2xl px-5 py-4 text-sm font-body leading-relaxed space-y-1 ${
                  msg.role === "coach"
                    ? "bg-gradient-to-br from-card to-emerald-500/5 border border-border/50 text-foreground shadow-soft"
                    : "bg-gradient-to-r from-primary to-emerald-700 text-white shadow-md"
                }`}>
                  {msg.role === "coach" ? formatText(msg.text) : <p>{msg.text}</p>}
                </div>
                <p className="text-[10px] text-muted-foreground px-1">{msg.time}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gradient-to-br from-card to-emerald-500/5 border border-border/50 rounded-2xl px-5 py-4 shadow-soft">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length <= 2 && (
          <div className="flex-shrink-0 mb-3">
            <p className="text-xs font-body text-muted-foreground mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.slice(0, 4).map(s => (
                <button key={s} onClick={() => send(s)}
                  className="text-xs font-body px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/8 to-teal-500/5 border border-emerald-500/15 text-foreground hover:from-emerald-500/15 hover:to-teal-500/10 hover:border-emerald-500/25 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-shrink-0">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask your coach anything about meditation..."
              className="flex-1 px-4 py-3 rounded-2xl border border-border/50 bg-card text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-soft"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center disabled:opacity-40 transition-all hover:scale-105 shadow-md"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

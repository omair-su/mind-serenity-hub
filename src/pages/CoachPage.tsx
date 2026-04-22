import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import PremiumLockModal from "@/components/PremiumLockModal";
import { useIsPremium } from "@/hooks/useIsPremium";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MessageCircle, Send, Bot, User, Sparkles, Brain, Heart, Shield, Crown } from "lucide-react";

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

const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function formatText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} className="font-semibold text-foreground mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>;
    }
    if (line.startsWith("• ")) {
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

const COACH_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach-chat`;

export default function CoachPage() {
  const { isPremium, loading: premiumLoading } = useIsPremium();
  const [showLock, setShowLock] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "coach",
      text: `Hello, and welcome to your personal meditation coaching session! 🌿

I'm your **Willow Vibes™ Coach**, now powered by Claude — Anthropic's most thoughtful AI. I'm here to support you through your 30-day journey with personalized guidance on techniques, obstacles, and the science behind your practice.

What would you like to explore today? You can use one of the prompts below, or ask me anything about meditation.`,
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isStreaming) return;
    setInput("");

    if (!premiumLoading && !isPremium) {
      setShowLock(true);
      return;
    }

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: msg, time: now() };
    const history = [...messages, userMsg];
    setMessages(history);
    setIsStreaming(true);

    const assistantId = Date.now().toString() + "r";
    setMessages(prev => [...prev, { id: assistantId, role: "coach", text: "", time: now() }]);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        toast({ title: "Please sign in", description: "Sign in to chat with your coach.", variant: "destructive" });
        setMessages(prev => prev.filter(m => m.id !== assistantId));
        setIsStreaming(false);
        return;
      }

      const resp = await fetch(COACH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          messages: history.filter(m => m.id !== "welcome").map(m => ({ role: m.role, content: m.text })),
        }),
      });

      if (resp.status === 403) {
        setShowLock(true);
        setMessages(prev => prev.filter(m => m.id !== assistantId));
        setIsStreaming(false);
        return;
      }
      if (resp.status === 429) {
        toast({ title: "Slow down a moment", description: "Too many messages — please try again shortly.", variant: "destructive" });
        setMessages(prev => prev.filter(m => m.id !== assistantId));
        setIsStreaming(false);
        return;
      }
      if (!resp.ok || !resp.body) {
        toast({ title: "Coach unavailable", description: "Please try again in a moment.", variant: "destructive" });
        setMessages(prev => prev.filter(m => m.id !== assistantId));
        setIsStreaming(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      let done = false;

      while (!done) {
        const { done: rDone, value } = await reader.read();
        if (rDone) break;
        buf += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const evt = JSON.parse(json);
            if (evt.text) {
              acc += evt.text;
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, text: acc } : m));
            }
          } catch { /* partial */ }
        }
      }
    } catch (e) {
      console.error("coach stream error:", e);
      toast({ title: "Connection issue", description: "Couldn't reach your coach.", variant: "destructive" });
      setMessages(prev => prev.filter(m => m.id !== assistantId || m.text === ""));
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <AppLayout>
      <PremiumLockModal
        open={showLock}
        onClose={() => setShowLock(false)}
        feature="Willow Coach™ Premium"
        description="Your personal AI coach is powered by Claude — Anthropic's most thoughtful model. Upgrade to unlock unlimited 1-on-1 coaching."
      />

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
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="font-display text-sm font-semibold text-foreground">Willow Coach™</p>
                <span className="text-[9px] font-body font-bold text-gold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-gold/10 border border-gold/30">
                  Powered by Claude
                </span>
              </div>
              <p className="text-xs font-body text-muted-foreground truncate">Expert in mindfulness, neuroscience & habit formation</p>
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

        {!premiumLoading && !isPremium && (
          <button
            onClick={() => setShowLock(true)}
            className="mb-4 w-full text-left rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/10 via-card to-gold/5 p-4 shadow-soft hover:shadow-md transition-all flex-shrink-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-md">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-display text-sm font-bold text-foreground">Unlock Willow Coach™ Premium</p>
                <p className="text-xs font-body text-muted-foreground">1-on-1 AI coaching powered by Claude. Tap to upgrade.</p>
              </div>
            </div>
          </button>
        )}

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
                  {msg.role === "coach"
                    ? (msg.text ? formatText(msg.text) : (
                        <div className="flex gap-1 py-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      ))
                    : <p>{msg.text}</p>}
                </div>
                <p className="text-[10px] text-muted-foreground px-1">{msg.time}</p>
              </div>
            </div>
          ))}
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
              placeholder={isPremium ? "Ask your coach anything about meditation..." : "Upgrade to chat with Willow Coach™ Premium"}
              className="flex-1 px-4 py-3 rounded-2xl border border-border/50 bg-card text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 shadow-soft"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || isStreaming}
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

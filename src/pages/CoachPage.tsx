import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import PremiumLockModal from "@/components/PremiumLockModal";
import { useIsPremium } from "@/hooks/useIsPremium";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Send, Bot, User, Sparkles, Brain, Heart, Shield, Crown, Gem } from "lucide-react";
import DOMPurify from "dompurify";

// ============================================================
// Willow Coach — Luxe edition
// Bespoke palette: midnight indigo + champagne gold + amethyst.
// Intentionally distinct from the rest of the (forest-green) app.
// ============================================================

const SANITIZE_CONFIG = { ALLOWED_TAGS: ["strong", "em", "b", "i"], ALLOWED_ATTR: [] as string[] };
const safeHtml = (html: string) => DOMPurify.sanitize(html, SANITIZE_CONFIG);

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
];

const FREE_DAILY_LIMIT = 5;

const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function formatText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} className="font-semibold text-white mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>;
    }
    if (line.startsWith("• ")) {
      return (
        <div key={i} className="flex gap-2 items-start">
          <span className="text-amber-300 mt-1 flex-shrink-0">•</span>
          <p className="text-slate-100" dangerouslySetInnerHTML={{ __html: safeHtml(line.slice(2).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")) }} />
        </div>
      );
    }
    if (line.startsWith("✦ ")) {
      return (
        <div key={i} className="mt-3 pt-3 border-t border-amber-300/20 flex gap-2 items-start">
          <span className="text-amber-300 mt-0.5 flex-shrink-0">✦</span>
          <p className="text-amber-100/90 italic text-[13px]" dangerouslySetInnerHTML={{ __html: safeHtml(line.slice(2).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")) }} />
        </div>
      );
    }
    if (line.trim() === "") return <div key={i} className="h-1" />;
    return <p key={i} className="text-slate-100" dangerouslySetInnerHTML={{ __html: safeHtml(line.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")) }} />;
  });
}

export default function CoachPage() {
  const { isPremium, loading: premiumLoading } = useIsPremium();
  const [showLock, setShowLock] = useState(false);
  const [usageToday, setUsageToday] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "coach",
      text: `Welcome to your private coaching space. ✦

I'm your **Willow Coach** — here to walk beside you on your 30-day journey with warm, science-backed guidance.

What's on your mind today? Tap a prompt below, or simply ask.`,
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load today's usage for free users
  useEffect(() => {
    if (premiumLoading || isPremium) return;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u?.user) return;
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from("coach_usage")
        .select("message_count")
        .eq("user_id", u.user.id)
        .eq("usage_date", today)
        .maybeSingle();
      setUsageToday(data?.message_count ?? 0);
    })();
  }, [premiumLoading, isPremium]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isStreaming) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: msg, time: now() };
    const history = [...messages, userMsg];
    setMessages(history);
    setIsStreaming(true);

    const assistantId = Date.now().toString() + "r";
    setMessages(prev => [...prev, { id: assistantId, role: "coach", text: "", time: now() }]);

    try {
      const { data, error } = await supabase.functions.invoke("ai-coach-chat", {
        body: {
          messages: history.filter(m => m.id !== "welcome").map(m => ({ role: m.role, content: m.text })),
          stream: false,
        },
      });

      if (error) {
        const message = error.message || "Coach unavailable";
        if (message.includes("402") || message.includes("FREE_LIMIT_REACHED")) {
          setShowLock(true);
          setMessages(prev => prev.filter(m => m.id !== assistantId));
          if (!isPremium) setUsageToday(FREE_DAILY_LIMIT);
          return;
        }
        if (message.includes("429") || message.toLowerCase().includes("rate")) {
          toast({ title: "Slow down a moment", description: "Too many messages — please try again shortly.", variant: "destructive" });
          setMessages(prev => prev.filter(m => m.id !== assistantId));
          return;
        }
        throw error;
      }

      if (!data?.ok && data?.error === "FREE_LIMIT_REACHED") {
        setShowLock(true);
        setMessages(prev => prev.filter(m => m.id !== assistantId));
        if (!isPremium) setUsageToday(FREE_DAILY_LIMIT);
        return;
      }
      if (!data?.ok && data?.error === "RATE_LIMITED") {
        toast({ title: "Slow down a moment", description: "Too many messages — please try again shortly.", variant: "destructive" });
        setMessages(prev => prev.filter(m => m.id !== assistantId));
        return;
      }
      if (!data?.ok && data?.error === "UNAUTHORIZED") {
        toast({ title: "Please sign in", description: "Sign in to chat with your coach.", variant: "destructive" });
        setShowLock(true);
        setMessages(prev => prev.filter(m => m.id !== assistantId));
        return;
      }
      if (!data?.ok || !data?.reply) {
        toast({ title: "Coach unavailable", description: "Please try again in a moment.", variant: "destructive" });
        setMessages(prev => prev.filter(m => m.id !== assistantId));
        return;
      }

      // Optimistically increment local usage counter for free users
      if (!isPremium) setUsageToday(u => (u ?? 0) + 1);
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, text: data.reply } : m));
    } catch (e) {
      console.error("coach stream error:", e);
      toast({ title: "Connection issue", description: "Couldn't reach your coach.", variant: "destructive" });
      setMessages(prev => prev.filter(m => m.id !== assistantId || m.text === ""));
    } finally {
      setIsStreaming(false);
    }
  };

  const remaining = usageToday !== null ? Math.max(0, FREE_DAILY_LIMIT - usageToday) : FREE_DAILY_LIMIT;

  return (
    <AppLayout>
      <PremiumLockModal
        open={showLock}
        onClose={() => setShowLock(false)}
        feature="Willow Coach™ Premium"
        description={`You've used your ${FREE_DAILY_LIMIT} free coach messages for today. Upgrade to Premium for unlimited deep coaching with longer, more in-depth answers — or come back tomorrow for ${FREE_DAILY_LIMIT} fresh free messages.`}
      />

      {/* LUXE THEME WRAPPER — page-scoped, doesn't leak to the rest of the app */}
      <div className="relative -mx-4 -mt-4 px-4 pt-4 pb-2 min-h-[calc(100vh-80px)]">
        {/* Ambient luxe background */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(1200px 600px at 0% 0%, rgba(168,85,247,0.18), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(251,191,36,0.10), transparent 55%), linear-gradient(180deg, #0b0a1f 0%, #0f0a26 45%, #08091d 100%)",
          }}
        />
        {/* Subtle starfield */}
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.6), transparent), radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.4), transparent), radial-gradient(1px 1px at 40% 80%, rgba(251,191,36,0.5), transparent)",
            backgroundSize: "200px 200px",
          }}
        />

        <div className="flex flex-col h-[calc(100vh-120px)] max-h-[820px] animate-fade-in">
          {/* HERO HEADER */}
          <div className="relative flex-shrink-0 mb-4 rounded-3xl overflow-hidden border border-amber-300/20 shadow-[0_20px_60px_-20px_rgba(168,85,247,0.4)]"
            style={{
              background:
                "linear-gradient(135deg, rgba(30,27,75,0.9) 0%, rgba(76,29,149,0.7) 50%, rgba(30,27,75,0.9) 100%)",
            }}
          >
            <div className="absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(400px 200px at 100% 0%, rgba(251,191,36,0.25), transparent)",
              }}
            />
            <div className="relative p-5 flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #b45309 100%)",
                  boxShadow: "0 10px 30px -8px rgba(251,191,36,0.6), inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              >
                <Gem className="w-7 h-7 text-white drop-shadow" />
                <div className="absolute -inset-1 rounded-2xl blur-md opacity-50 -z-10" style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-2xl font-bold text-white tracking-tight">Willow Coach</h1>
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] px-2 py-0.5 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, rgba(251,191,36,0.25), rgba(251,191,36,0.1))",
                      color: "#fde68a",
                      border: "1px solid rgba(251,191,36,0.4)",
                    }}
                  >
                    {isPremium ? "Premium" : "Atelier"}
                  </span>
                </div>
                <p className="text-xs font-body text-violet-200/80 mt-0.5">A private session with your mindfulness mentor</p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-medium text-emerald-200">Live</span>
              </div>
            </div>

            {/* Expertise badges */}
            <div className="relative px-5 pb-4 flex gap-2 flex-wrap">
              {[
                { icon: Brain, label: "Neuroscience", color: "from-violet-400/30 to-purple-500/20", iconColor: "text-violet-200" },
                { icon: Heart, label: "Compassion", color: "from-rose-400/30 to-pink-500/20", iconColor: "text-rose-200" },
                { icon: Shield, label: "Safe Space", color: "from-amber-400/30 to-orange-500/20", iconColor: "text-amber-200" },
                { icon: Sparkles, label: "Bespoke", color: "from-cyan-400/30 to-blue-500/20", iconColor: "text-cyan-200" },
              ].map((b, i) => (
                <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${b.color} border border-white/10`}>
                  <b.icon className={`w-3 h-3 ${b.iconColor}`} />
                  <span className="text-[10px] font-medium text-white/90">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FREE USAGE STRIP */}
          {!premiumLoading && !isPremium && (
            <button
              onClick={() => setShowLock(true)}
              className="mb-4 w-full text-left rounded-2xl p-4 flex-shrink-0 transition-all hover:scale-[1.005] group"
              style={{
                background: "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(168,85,247,0.08))",
                border: "1px solid rgba(251,191,36,0.3)",
                boxShadow: "0 8px 24px -8px rgba(251,191,36,0.2)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #fbbf24, #d97706)" }}
                >
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-display text-sm font-bold text-white">Free Atelier preview</p>
                    <span className="text-[10px] font-bold text-amber-200 px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-300/30">
                      {remaining}/{FREE_DAILY_LIMIT} left today
                    </span>
                  </div>
                  <p className="text-xs font-body text-violet-100/70">Tap to unlock unlimited deep coaching</p>
                  {/* progress */}
                  <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${((usageToday ?? 0) / FREE_DAILY_LIMIT) * 100}%`,
                        background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </button>
          )}

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1 scrollbar-thin">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""} animate-fade-in`}>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                  style={
                    msg.role === "coach"
                      ? {
                          background: "linear-gradient(135deg, #fbbf24, #d97706)",
                          boxShadow: "0 6px 16px -4px rgba(251,191,36,0.5)",
                        }
                      : {
                          background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
                          boxShadow: "0 6px 16px -4px rgba(168,85,247,0.5)",
                        }
                  }
                >
                  {msg.role === "coach" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-[82%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div
                    className="rounded-2xl px-5 py-4 text-sm font-body leading-relaxed space-y-1"
                    style={
                      msg.role === "coach"
                        ? {
                            background: "linear-gradient(135deg, rgba(30,27,75,0.85), rgba(49,46,129,0.7))",
                            border: "1px solid rgba(251,191,36,0.18)",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 12px 28px -10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                          }
                        : {
                            background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
                            border: "1px solid rgba(168,85,247,0.3)",
                            boxShadow: "0 12px 28px -10px rgba(124,58,237,0.5)",
                          }
                    }
                  >
                    {msg.role === "coach"
                      ? (msg.text ? formatText(msg.text) : (
                          <div className="flex gap-1 py-1">
                            <div className="w-2 h-2 rounded-full bg-amber-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-2 h-2 rounded-full bg-amber-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-2 h-2 rounded-full bg-amber-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        ))
                      : <p className="text-white">{msg.text}</p>}
                  </div>
                  <p className="text-[10px] text-violet-300/60 px-1">{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* SUGGESTIONS */}
          {messages.length <= 2 && (
            <div className="flex-shrink-0 mb-3">
              <p className="text-xs font-body text-violet-200/70 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-300" /> Try asking
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.slice(0, 4).map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs font-body px-3 py-1.5 rounded-full text-violet-50 transition-all hover:scale-[1.02]"
                    style={{
                      background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(251,191,36,0.08))",
                      border: "1px solid rgba(251,191,36,0.25)",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* INPUT */}
          <div className="flex-shrink-0">
            <div className="flex gap-2 p-1.5 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(30,27,75,0.6), rgba(49,46,129,0.4))",
                border: "1px solid rgba(251,191,36,0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask your coach anything…"
                className="flex-1 px-4 py-2.5 rounded-xl bg-transparent text-sm font-body text-white placeholder:text-violet-300/50 focus:outline-none"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || isStreaming}
                className="w-11 h-11 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all hover:scale-105 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #d97706)",
                  boxShadow: "0 8px 20px -6px rgba(251,191,36,0.5)",
                }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="text-[10px] text-violet-300/50 text-center mt-2">
              Powered by an advanced AI coach · {isPremium ? "Unlimited Premium" : `${remaining} of ${FREE_DAILY_LIMIT} free messages remaining today`}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

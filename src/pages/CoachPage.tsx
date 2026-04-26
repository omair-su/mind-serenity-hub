import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import PremiumLockModal from "@/components/PremiumLockModal";
import { useIsPremium } from "@/hooks/useIsPremium";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Send, Sparkles, Crown, Biohazard } from "lucide-react";
import DOMPurify from "dompurify";

// ============================================================
// Willow Coach — Editorial Luxe edition
// On-brand palette: ivory paper + deep forest + champagne gold.
// Inspired by Claude / ChatGPT clarity, with quiet luxury accents.
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
      return <p key={i} className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4 text-charcoal">{line.replace(/\*\*/g, "")}</p>;
    }
    if (line.startsWith("• ")) {
      return (
        <div key={i} className="flex gap-2 items-start">
          <span className="text-[hsl(var(--gold-dark))] mt-1 flex-shrink-0">•</span>
          <p className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: safeHtml(line.slice(2).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")) }} />
        </div>
      );
    }
    if (line.startsWith("✦ ")) {
      return (
        <div key={i} className="mt-3 pt-3 border-t border-[hsl(var(--gold))]/30 flex gap-2 items-start">
          <span className="text-[hsl(var(--gold-dark))] mt-0.5 flex-shrink-0">✦</span>
          <p className="text-[hsl(var(--forest))]/90 italic text-[13px]" dangerouslySetInnerHTML={{ __html: safeHtml(line.slice(2).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")) }} />
        </div>
      );
    }
    if (line.trim() === "") return <div key={i} className="h-1" />;
    return <p key={i} className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: safeHtml(line.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")) }} />;
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
      text: `Welcome to your private coaching space.

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

      if (!isPremium) setUsageToday(u => (u ?? 0) + 1);
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, text: data.reply } : m));
    } catch (e) {
      console.error("coach error:", e);
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

      {/* Editorial luxe wrapper — ivory paper background, page-scoped */}
      <div className="relative -mx-4 -mt-4 px-4 pt-4 pb-2 min-h-[calc(100vh-80px)] bg-[hsl(var(--ivory))]">
        {/* Subtle paper texture + champagne haze */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(800px 320px at 50% -10%, hsl(var(--champagne) / 0.18), transparent 60%)",
          }}
        />

        <div className="flex flex-col h-[calc(100vh-120px)] max-h-[820px] animate-fade-in">
          {/* HEADER — quiet luxury, on-brand */}
          <header className="flex-shrink-0 mb-4 pb-4 border-b border-[hsl(var(--gold))]/25">
            <div className="flex items-center gap-3">
              {/* Monogram — forest with gold ring */}
              <div className="relative w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-[hsl(var(--forest))] shadow-[0_8px_24px_-8px_hsl(var(--forest)/0.5)]">
                <Biohazard className="w-5 h-5 text-[hsl(var(--champagne-light))]" strokeWidth={1.5} />
                <span className="absolute -inset-[3px] rounded-full border border-[hsl(var(--gold))]/50 pointer-events-none" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-[19px] font-semibold text-[hsl(var(--forest-deep))] tracking-tight leading-none">
                    Willow Coach
                  </h1>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--gold-dark))] border border-[hsl(var(--gold))]/40 px-1.5 py-0.5 rounded-sm">
                    {isPremium ? "Premium" : "Atelier"}
                  </span>
                </div>
                <p className="text-[11px] font-body text-[hsl(var(--charcoal-soft))] mt-1 tracking-wide">
                  A private session with your mindfulness mentor
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-[hsl(var(--forest))]/5 border border-[hsl(var(--forest))]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--forest))] animate-pulse" />
                <span className="text-[10px] font-medium text-[hsl(var(--forest))]">Online</span>
              </div>
            </div>
          </header>

          {/* FREE USAGE STRIP — refined, on-brand */}
          {!premiumLoading && !isPremium && (
            <button
              onClick={() => setShowLock(true)}
              className="mb-4 w-full text-left rounded-xl p-3 flex-shrink-0 transition-all hover:bg-[hsl(var(--cream-dark))]/60 group bg-[hsl(var(--cream-dark))]/40 border border-[hsl(var(--gold))]/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[hsl(var(--forest))]">
                  <Crown className="w-4 h-4 text-[hsl(var(--champagne-light))]" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="font-display text-[13px] font-semibold text-[hsl(var(--forest-deep))]">Free preview</p>
                    <span className="text-[10px] font-medium text-[hsl(var(--gold-dark))]">
                      {remaining} of {FREE_DAILY_LIMIT} left
                    </span>
                  </div>
                  <div className="h-[3px] rounded-full bg-[hsl(var(--forest))]/8 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all bg-gradient-to-r from-gold to-gold-dark"
                      style={{ width: `${((usageToday ?? 0) / FREE_DAILY_LIMIT) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </button>
          )}

          {/* MESSAGES — clean Claude/ChatGPT style with brand accents */}
          <div className="flex-1 overflow-y-auto space-y-5 pb-4 pr-1 scrollbar-thin">
            {messages.map(msg => (
              <div key={msg.id} className="flex gap-3 animate-fade-in">
                {msg.role === "coach" ? (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[hsl(var(--forest))] mt-0.5">
                    <Biohazard className="w-3.5 h-3.5 text-[hsl(var(--champagne-light))]" strokeWidth={1.5} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[hsl(var(--cream-dark))] border border-[hsl(var(--border))] mt-0.5">
                    <span className="text-[11px] font-display font-semibold text-[hsl(var(--forest))]">You</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-display text-[13px] font-semibold text-[hsl(var(--forest-deep))]">
                      {msg.role === "coach" ? "Willow Coach" : "You"}
                    </span>
                    <span className="text-[10px] text-[hsl(var(--charcoal-soft))]">{msg.time}</span>
                  </div>
                  <div className="text-sm font-body leading-relaxed space-y-1.5 text-muted-foreground">
                    {msg.role === "coach"
                      ? (msg.text ? formatText(msg.text) : (
                          <div className="flex gap-1.5 py-2 items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--forest))] animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--forest))]/70 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--forest))]/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                            <span className="text-[11px] text-[hsl(var(--charcoal-soft))] ml-1 italic">composing a thoughtful reply…</span>
                          </div>
                        ))
                      : <p className="text-foreground whitespace-pre-wrap">{msg.text}</p>}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* SUGGESTIONS — refined chips */}
          {messages.length <= 2 && (
            <div className="flex-shrink-0 mb-3">
              <p className="text-[11px] font-body text-[hsl(var(--charcoal-soft))] mb-2 flex items-center gap-1.5 tracking-wide">
                <Sparkles className="w-3 h-3 text-[hsl(var(--gold-dark))]" /> Suggested
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.slice(0, 4).map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs font-body px-3 py-1.5 rounded-full text-[hsl(var(--forest-deep))] bg-[hsl(var(--cream-dark))]/60 border border-[hsl(var(--border))] hover:border-[hsl(var(--gold))]/60 hover:bg-[hsl(var(--cream-dark))] transition-all text-gold-dark"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* INPUT — clean, refined, like Claude */}
          <div className="flex-shrink-0">
            <div className="flex items-end gap-2 p-1.5 rounded-2xl bg-card border border-[hsl(var(--border))] focus-within:border-[hsl(var(--gold))]/60 focus-within:shadow-[0_0_0_3px_hsl(var(--gold)/0.12)] transition-all">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask your coach anything…"
                className="flex-1 px-3 py-2.5 rounded-xl bg-transparent text-sm font-body text-foreground placeholder:text-[hsl(var(--charcoal-soft))] focus:outline-none"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || isStreaming}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-[hsl(var(--forest))] hover:bg-[hsl(var(--forest-deep))] shadow-[0_4px_14px_-4px_hsl(var(--forest)/0.5)]"
              >
                <Send className="w-4 h-4 text-[hsl(var(--champagne-light))] border-muted-foreground" />
              </button>
            </div>
            <p className="text-[10px] text-[hsl(var(--charcoal-soft))] text-center mt-2 tracking-wide">
              {isPremium ? "Unlimited Premium coaching" : `${remaining} of ${FREE_DAILY_LIMIT} free messages remaining today`}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

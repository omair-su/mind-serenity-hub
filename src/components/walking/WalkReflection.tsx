// Post-walk AI reflection — reuses ai-companion-chat edge function.
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Msg { role: "user" | "assistant"; content: string }

interface WalkReflectionProps {
  techniqueTitle: string;
  steps: number;
  durationMin: number;
  onSummary?: (summary: string) => void;
}

export default function WalkReflection({ techniqueTitle, steps, durationMin, onSummary }: WalkReflectionProps) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: `${steps} mindful steps over ${durationMin} minutes. What did you notice on your ${techniqueTitle} today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!input.trim() || sending) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-companion-chat", {
        body: { messages: next, protocolTitle: `${techniqueTitle} walk` },
      });
      if (error) throw error;
      const reply = data?.reply ?? "I'm glad you walked today.";
      setMessages([...next, { role: "assistant", content: reply }]);
      onSummary?.(reply);
    } catch (e) {
      console.error(e);
      setMessages([...next, { role: "assistant", content: "Beautiful. Carry that presence with you." }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-primary/5 via-card to-gold/5 border border-border/50 p-5 shadow-soft"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-gold/10">
          <Sparkles className="w-4 h-4 text-gold" />
        </div>
        <h3 className="font-display text-base font-bold text-foreground">Walk Reflection</h3>
      </div>

      <div className="space-y-2 mb-3 max-h-64 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-2xl text-sm font-body leading-relaxed ${
              m.role === "user" ? "bg-primary/10 ml-8 text-foreground" : "bg-secondary/40 mr-8 text-foreground"
            }`}
          >
            {m.content}
          </div>
        ))}
        {sending && (
          <div className="flex items-center gap-2 text-xs font-body text-muted-foreground p-3">
            <Loader2 className="w-3 h-3 animate-spin" /> Reflecting with you…
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Share what you noticed…"
          disabled={sending}
          className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-body focus:border-primary focus:outline-none"
        />
        <button
          onClick={send}
          disabled={sending || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-gold text-white disabled:opacity-50 hover:bg-gold-dark transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

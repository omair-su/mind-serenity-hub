import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Sparkles, Loader2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { CloudGratitudeEntry } from "@/lib/cloudSync";

interface GratitudeLetterProps {
  entries: CloudGratitudeEntry[];
}

export default function GratitudeLetter({ entries }: GratitudeLetterProps) {
  const [letter, setLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (entries.length < 3) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-gratitude-letter", {
        body: { entries: entries.slice(0, 14) },
      });
      if (error) throw error;
      setLetter(data?.letter ?? "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (entries.length < 7) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-gold/10 via-card to-primary/5 border border-gold/30 p-5 shadow-soft"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-xl bg-gold/15"><Mail className="w-4 h-4 text-gold" /></div>
        <div className="flex-1">
          <h3 className="font-display text-base font-bold text-foreground">Your Weekly Gratitude Letter</h3>
          <p className="text-[10px] font-body text-muted-foreground">AI-composed from your last 14 entries</p>
        </div>
      </div>

      {!letter ? (
        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-white text-sm font-body font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Composing your letter...</>) : (<><Sparkles className="w-4 h-4" /> Compose This Week's Letter</>)}
        </button>
      ) : (
        <>
          <div className="p-4 rounded-xl bg-card/80 border border-border/50">
            <p className="text-sm font-body text-foreground leading-[1.8] whitespace-pre-wrap italic">{letter}</p>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={generate} className="flex-1 py-2 rounded-lg bg-secondary text-xs font-body text-foreground hover:bg-secondary/80">Regenerate</button>
            <button
              onClick={() => {
                const blob = new Blob([letter], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = `gratitude-letter-${new Date().toISOString().split("T")[0]}.txt`;
                a.click(); URL.revokeObjectURL(url);
              }}
              className="flex-1 py-2 rounded-lg bg-gold/10 text-gold text-xs font-body font-semibold hover:bg-gold/20 flex items-center justify-center gap-1"
            >
              <Download className="w-3 h-3" /> Save
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}

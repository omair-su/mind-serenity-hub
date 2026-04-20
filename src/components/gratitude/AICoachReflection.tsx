import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";

interface AICoachReflectionProps {
  reflection: string | null;
  loading: boolean;
}

export default function AICoachReflection({ reflection, loading }: AICoachReflectionProps) {
  if (!reflection && !loading) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 p-4 rounded-xl bg-gradient-to-br from-gold/10 via-card to-primary/5 border border-gold/30"
    >
      <div className="flex items-start gap-2">
        {loading ? (
          <Loader2 className="w-4 h-4 text-gold animate-spin flex-shrink-0 mt-0.5" />
        ) : (
          <Sparkles className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <p className="text-[10px] font-body font-bold text-gold uppercase tracking-widest mb-1">
            AI Gratitude Coach
          </p>
          {loading ? (
            <p className="text-sm font-body text-muted-foreground italic">Reflecting on your gratitude...</p>
          ) : (
            <p className="text-sm font-body text-foreground leading-relaxed italic">"{reflection}"</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, Check, X } from "lucide-react";

interface PremiumLockModalProps {
  open: boolean;
  onClose: () => void;
  feature: string;
  description?: string;
}

export default function PremiumLockModal({ open, onClose, feature, description }: PremiumLockModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-card border border-gold/30 shadow-2xl"
          >
            {/* Hero gradient */}
            <div className="relative h-40 bg-gradient-to-br from-[hsl(var(--forest-deep))] via-[hsl(var(--forest))] to-[hsl(var(--gold-dark))]/60 flex items-center justify-center">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-4 right-6 w-24 h-24 rounded-full bg-[hsl(var(--gold))]/40 blur-2xl" />
                <div className="absolute bottom-4 left-6 w-20 h-20 rounded-full bg-white/30 blur-xl" />
              </div>
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/30 text-white/80 hover:bg-black/50"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-2xl border border-white/20">
                <Crown className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 mb-2">
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span className="text-[10px] font-body font-bold text-gold uppercase tracking-widest">Willow Plus</span>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">{feature}</h3>
                <p className="text-sm font-body text-muted-foreground mt-1.5 leading-relaxed">
                  {description ?? "Unlock the full luxury experience with Willow Plus."}
                </p>
              </div>

              <ul className="space-y-2 py-2">
                {[
                  "Unlimited AI coach reflections",
                  "Premium audio library & voices",
                  "Advanced analytics & PDF reports",
                  "Crisis Concierge therapist sessions",
                ].map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm font-body text-foreground">
                    <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold via-gold-dark to-amber-700 text-white font-body font-bold text-sm shadow-[0_15px_30px_-8px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 transition-all"
              >
                Coming Soon — Join Waitlist
              </button>
              <p className="text-[10px] font-body text-center text-muted-foreground">
                Premium tier launches with Sprint 2
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

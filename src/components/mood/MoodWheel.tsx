import { motion } from "framer-motion";

// Plutchik-inspired wheel: 8 primary emotions with 4 intensities each
export const EMOTION_WHEEL: { primary: string; emoji: string; color: string; secondary: string[] }[] = [
  { primary: "Joy", emoji: "😊", color: "hsl(45, 90%, 60%)", secondary: ["serene", "grateful", "playful", "ecstatic"] },
  { primary: "Trust", emoji: "🤝", color: "hsl(140, 50%, 55%)", secondary: ["accepted", "secure", "loved", "open"] },
  { primary: "Calm", emoji: "🌿", color: "hsl(160, 40%, 60%)", secondary: ["peaceful", "balanced", "rested", "still"] },
  { primary: "Anticipation", emoji: "✨", color: "hsl(35, 85%, 60%)", secondary: ["hopeful", "curious", "eager", "inspired"] },
  { primary: "Surprise", emoji: "😮", color: "hsl(280, 50%, 65%)", secondary: ["amazed", "confused", "stunned", "moved"] },
  { primary: "Sadness", emoji: "😔", color: "hsl(220, 40%, 55%)", secondary: ["lonely", "tearful", "heavy", "grieving"] },
  { primary: "Anxious", emoji: "😰", color: "hsl(190, 50%, 50%)", secondary: ["worried", "restless", "tense", "overwhelmed"] },
  { primary: "Anger", emoji: "😤", color: "hsl(10, 70%, 55%)", secondary: ["irritated", "frustrated", "hurt", "resentful"] },
];

interface MoodWheelProps {
  primary: string | null;
  secondary: string | null;
  onPrimary: (p: string) => void;
  onSecondary: (s: string) => void;
}

export default function MoodWheel({ primary, secondary, onPrimary, onSecondary }: MoodWheelProps) {
  const selectedSlice = EMOTION_WHEEL.find((s) => s.primary === primary);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-body font-semibold text-foreground/80 mb-3 uppercase tracking-wider">Primary feeling</p>
        <div className="grid grid-cols-4 gap-2">
          {EMOTION_WHEEL.map((slice) => {
            const active = primary === slice.primary;
            return (
              <motion.button
                key={slice.primary}
                whileTap={{ scale: 0.92 }}
                onClick={() => { onPrimary(slice.primary); onSecondary(""); }}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                  active ? "ring-2 ring-gold scale-105 shadow-lg" : "ring-1 ring-border hover:ring-gold/40"
                }`}
                style={{
                  background: active
                    ? `linear-gradient(135deg, ${slice.color}, ${slice.color}99)`
                    : `linear-gradient(135deg, ${slice.color}30, ${slice.color}10)`,
                }}
              >
                <span className="text-2xl">{slice.emoji}</span>
                <span className={`text-[10px] font-body font-semibold ${active ? "text-white" : "text-foreground"}`}>
                  {slice.primary}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {selectedSlice && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-body font-semibold text-foreground/80 mb-3 uppercase tracking-wider">
            More specifically...
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSlice.secondary.map((sub) => {
              const active = secondary === sub;
              return (
                <button
                  key={sub}
                  onClick={() => onSecondary(sub)}
                  className={`text-xs font-body px-3 py-1.5 rounded-full border transition-all capitalize ${
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card text-muted-foreground border-border hover:border-foreground/30"
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

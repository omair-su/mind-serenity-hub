// Static lookup tables and presets used across DayPage and its sub-components.

export const dayEmojis: Record<number, string> = {
  1: "🌬️", 2: "💆‍♀️", 3: "🔢", 4: "👁️", 5: "💗", 6: "🚶", 7: "🙏",
  8: "🌊", 9: "🏷️", 10: "🕉️", 11: "🍇", 12: "🔔", 13: "✨", 14: "🌀",
  15: "🌄", 16: "🦴", 17: "💚", 18: "🎯", 19: "🤝", 20: "🧘", 21: "🌟",
  22: "☁️", 23: "🪞", 24: "🕊️", 25: "🔥", 26: "🌍", 27: "💝", 28: "🤫", 29: "🛤️", 30: "🎉",
};

export interface WisdomCard {
  title: string;
  insight: string;
  icon: string;
}

export const WISDOM_CARDS: WisdomCard[] = [
  { title: "The Power of Presence", insight: "Your mind can only be in one place at a time. When you're here, you're not there.", icon: "🎯" },
  { title: "Breath = Life", insight: "Every breath connects you to the present moment. The breath is always now.", icon: "🌬️" },
  { title: "Consistency Over Perfection", insight: "A imperfect practice done daily beats a perfect practice done rarely.", icon: "🔥" },
  { title: "The Observer Effect", insight: "Simply noticing your thoughts changes them. Awareness is the first step to freedom.", icon: "👁️" },
  { title: "Neuroplasticity", insight: "Every meditation rewires your brain. You're literally building new neural pathways for peace.", icon: "🧠" },
];

export interface BinauralPreset {
  name: string;
  freq: number;
  color: string;
  description: string;
}

export const BINAURAL_PRESETS: BinauralPreset[] = [
  { name: "Delta (Sleep)", freq: 2, color: "from-charcoal to-forest-deep", description: "Deep sleep & restoration" },
  { name: "Theta (Deep Meditation)", freq: 5, color: "from-charcoal to-gold-dark", description: "Subconscious access & creativity" },
  { name: "Alpha (Relaxation)", freq: 10, color: "from-forest to-sage-dark", description: "Calm awareness & flow" },
  { name: "Beta (Focus)", freq: 20, color: "from-gold to-gold-dark", description: "Concentration & alertness" },
  { name: "Gamma (Peak Performance)", freq: 40, color: "from-gold-dark to-gold", description: "Insight & cognitive enhancement" },
];

export type VoiceKey = "sarah" | "george" | "matilda" | "charlie";

export const FREE_VOICES: VoiceKey[] = ["sarah", "matilda"];

export const PREMIUM_VOICES: { key: VoiceKey; label: string; tier: "free" | "premium" }[] = [
  { key: "sarah", label: "Sarah · Warm", tier: "free" },
  { key: "matilda", label: "Matilda · Soft", tier: "free" },
  { key: "george", label: "George · Deep", tier: "premium" },
  { key: "charlie", label: "Aria · Ethereal", tier: "premium" },
];

import type { RitualStep } from "./rituals";

export interface RitualMeta {
  id: "morning" | "evening" | "focus" | "midday" | "creative" | "sunday";
  name: string;
  tagline: string;
  duration: string;
  steps: number;
  heroImage: string;
  ambientId: string;
  voiceId: string; // ElevenLabs voice
  accent: string; // tailwind gradient
  iconEmoji: string;
}

export const RITUALS_META: RitualMeta[] = [
  {
    id: "morning",
    name: "Morning Ritual",
    tagline: "Start your day with intention and gratitude",
    duration: "~15 min",
    steps: 6,
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1600",
    ambientId: "morning-light",
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah
    accent: "from-gold/30 via-gold-dark/15 to-transparent",
    iconEmoji: "🌅",
  },
  {
    id: "evening",
    name: "Evening Ritual",
    tagline: "Release the day, prepare for restful sleep",
    duration: "~18 min",
    steps: 6,
    heroImage: "https://images.unsplash.com/photo-1519181245277-cffeb31da2e3?auto=format&fit=crop&q=80&w=1600",
    ambientId: "calm-piano",
    voiceId: "JBFqnCBsd6RMkjVDRZzb", // George
    accent: "from-charcoal/30 via-gold-dark/15 to-transparent",
    iconEmoji: "🌙",
  },
  {
    id: "focus",
    name: "Pre-Work Focus",
    tagline: "Lock in deep work mode in 8 minutes",
    duration: "~8 min",
    steps: 4,
    heroImage: "https://images.unsplash.com/photo-1507120410856-1f35574c3b45?auto=format&fit=crop&q=80&w=1600",
    ambientId: "focus-flow",
    voiceId: "JBFqnCBsd6RMkjVDRZzb",
    accent: "from-forest/30 via-forest-deep/15 to-transparent",
    iconEmoji: "🎯",
  },
  {
    id: "midday",
    name: "Midday Reset",
    tagline: "Clear afternoon fog with a 5-minute breath",
    duration: "~5 min",
    steps: 4,
    heroImage: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=1600",
    ambientId: "forest-stream",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    accent: "from-forest/30 via-sage/15 to-transparent",
    iconEmoji: "☀️",
  },
  {
    id: "creative",
    name: "Creative Flow",
    tagline: "Unblock the muse with somatic visualization",
    duration: "~10 min",
    steps: 5,
    heroImage: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=1600",
    ambientId: "deep-meditation",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    accent: "from-gold/30 via-gold-dark/15 to-transparent",
    iconEmoji: "🎨",
  },
  {
    id: "sunday",
    name: "Sunday Reflection",
    tagline: "Look back. Look forward. Find your week's center.",
    duration: "~20 min",
    steps: 6,
    heroImage: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1600",
    ambientId: "tibetan-bowls",
    voiceId: "JBFqnCBsd6RMkjVDRZzb",
    accent: "from-gold-dark/30 via-gold/15 to-transparent",
    iconEmoji: "📓",
  },
];

export const focusRitual: RitualStep[] = [
  { id: "ground", title: "Ground", icon: "🌱", description: "Anchor in the present", duration: 1, instruction: "Sit upright. Feet flat. Take three deep breaths and let your shoulders fall." },
  { id: "intention-f", title: "Define the One Thing", icon: "🎯", description: "Pick your task", duration: 2, instruction: "Choose the single most important task. Say it out loud. This is what you do — nothing else for the next session." },
  { id: "visualize-f", title: "Visualize Completion", icon: "✨", description: "See the finish line", duration: 2, instruction: "Picture yourself finishing this task — calmly, well, on time. Hold that image for a full minute." },
  { id: "begin", title: "Begin", icon: "🚀", description: "Step into deep work", duration: 3, instruction: "Open your work. Set a 25-minute timer. Begin with the easiest sub-step. Momentum is everything." },
];

export const middayRitual: RitualStep[] = [
  { id: "stretch-m", title: "Stretch & Stand", icon: "🤸", description: "Reset the body", duration: 1, instruction: "Stand up. Reach arms overhead. Roll shoulders. Twist gently each direction." },
  { id: "water-m", title: "Hydrate", icon: "💧", description: "Drink fully", duration: 1, instruction: "Drink a full glass of water slowly. Notice the temperature, the swallowing, the cool path it traces." },
  { id: "breath-m", title: "Box Breath x4", icon: "🌬️", description: "Reoxygenate", duration: 2, instruction: "Inhale 4. Hold 4. Exhale 4. Hold 4. Repeat four times. Feel the second half of your day reset." },
  { id: "reset-m", title: "Reframe Forward", icon: "🔄", description: "Choose your afternoon", duration: 1, instruction: "What's the one thing that — if done well this afternoon — would make today a win? That's now your focus." },
];

export const creativeRitual: RitualStep[] = [
  { id: "soften", title: "Soften the Body", icon: "🫧", description: "Drop the armor", duration: 2, instruction: "Soften your jaw, your tongue, your forehead. Creativity hates tension. Let it leave." },
  { id: "wander", title: "Mind Wander", icon: "🌫️", description: "No direction", duration: 2, instruction: "Close your eyes. Let thoughts drift like clouds. Don't grab any. Just watch." },
  { id: "spark", title: "Notice the Spark", icon: "⚡", description: "Catch the idea", duration: 2, instruction: "When something interesting passes through, gently notice it. Don't chase. Don't analyze. Just feel its weight." },
  { id: "embody", title: "Embody It", icon: "🎭", description: "Feel it physically", duration: 2, instruction: "Where in your body do you feel that idea? Chest? Belly? Hands? Breathe into that place." },
  { id: "create-c", title: "Pick Up the Tool", icon: "✏️", description: "Begin imperfectly", duration: 2, instruction: "Open your sketchbook, your doc, your instrument. Start badly. Bad work is the only path to good work." },
];

export const sundayRitual: RitualStep[] = [
  { id: "review-s", title: "Week Review", icon: "📖", description: "Watch the highlight reel", duration: 4, instruction: "Replay the last 7 days. What were the highs? The lows? Don't judge — just watch with curiosity." },
  { id: "wins", title: "Three Wins", icon: "🏆", description: "Celebrate progress", duration: 3, instruction: "Name three things you did well this week — however small. Speak them out loud. Make them real." },
  { id: "lessons", title: "One Lesson", icon: "💡", description: "Distill the wisdom", duration: 3, instruction: "What's the one thing this week tried to teach you? Write it on paper. Carry it into the next 7 days." },
  { id: "release-s", title: "Release What's Done", icon: "🕊️", description: "Close the loop", duration: 3, instruction: "Anything from this week you're still carrying? Visualize handing it to a wave. Watch it leave." },
  { id: "vision", title: "Vision the Week", icon: "🔮", description: "Set the tone", duration: 4, instruction: "Picture next Sunday. How do you want to feel? Energized? Calm? Proud? Choose now — and design backward." },
  { id: "blessing-s", title: "Closing Blessing", icon: "🙏", description: "Honor the cycle", duration: 3, instruction: "Place hand on heart. Say: 'This week is complete. I trust the next. I am exactly where I need to be.'" },
];

export function getRitualSteps(id: RitualMeta["id"]): RitualStep[] {
  switch (id) {
    case "focus": return focusRitual;
    case "midday": return middayRitual;
    case "creative": return creativeRitual;
    case "sunday": return sundayRitual;
    default: return [];
  }
}

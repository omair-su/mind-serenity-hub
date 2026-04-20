// Additional SOS protocols + region-aware crisis hotlines

export interface ExtraSOSSession {
  id: string;
  title: string;
  duration: number;
  emoji: string;
  desc: string;
  image: string;
  gradient: string;
  steps: string[];
}

export const extraSOSSessions: ExtraSOSSession[] = [
  {
    id: "anger-defuse",
    title: "Anger Defuse",
    duration: 8,
    emoji: "🔥",
    desc: "Channel heat into clarity in 8 focused minutes.",
    image: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&q=80&w=1600",
    gradient: "from-red-500/25 via-orange-500/10 to-transparent",
    steps: [
      "Stop. Don't speak. Don't act. The next 60 seconds are sacred.",
      "Place both feet on the ground. Push down. Feel the floor support you.",
      "Take 4 long exhales — twice as long as the inhales. This signals safety to your nervous system.",
      "Name the feeling out loud: 'I am angry.' Naming it shrinks it.",
      "Ask: what does this anger want me to know? Listen without judgment.",
      "Visualize the heat moving from your chest, down your arms, out your fingertips into the earth.",
      "Choose one wise next action — not a reactive one. Speak it inside: 'I will...'",
      "Take three breaths. You are bigger than this moment. Move forward with grace."
    ]
  },
  {
    id: "social-anxiety",
    title: "Social Anxiety Reset",
    duration: 4,
    emoji: "🫂",
    desc: "Calm the racing pre-event mind in 4 minutes.",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=1600",
    gradient: "from-blue-500/25 via-cyan-500/10 to-transparent",
    steps: [
      "You are safe. Your body is reacting to imagined danger, not real danger.",
      "Place your hand on your heart. Feel its rhythm. Tell it: 'You're okay.'",
      "Inhale for 4 counts. Exhale for 8. Do this 5 times. The long exhale calms the vagus nerve.",
      "Remember: most people are thinking about themselves, not you. You are not the centre of their attention.",
      "Pick one warm thing to say or do — a smile, a question, a compliment.",
      "Walk in. You're prepared. You're allowed to be human here."
    ]
  },
  {
    id: "pain-acceptance",
    title: "Pain Acceptance",
    duration: 12,
    emoji: "💎",
    desc: "Mindful relief for chronic or acute physical pain.",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=1600",
    gradient: "from-purple-500/25 via-violet-500/10 to-transparent",
    steps: [
      "Lie down or sit in your most comfortable position. Close your eyes.",
      "Bring soft attention to the area of pain. Don't fight it. Just notice.",
      "Describe the sensation in detail: sharp, dull, throbbing, hot, tight? Curiosity reduces suffering.",
      "Imagine breathing into that area. Each inhale: space. Each exhale: softening.",
      "Tell the painful area: 'I see you. I'm not going to abandon you.'",
      "Now widen attention to a part of your body that feels fine. Notice both at the same time.",
      "Pain is one signal among many. You are not only your pain.",
      "Place a warm imaginary hand on the painful area. Send it kindness, not resistance.",
      "Visualize the pain as colored light, slowly draining out through your fingertips into the earth.",
      "Take three slow breaths. The pain may still be there — but you are bigger than it.",
      "Open your eyes when ready. You did the brave work of being present with discomfort."
    ]
  }
];

// Region-aware emergency hotlines (English-speaking; expand as needed)
export interface Hotline {
  region: string;
  name: string;
  number: string;
  hours: string;
}

export const HOTLINES: Hotline[] = [
  { region: "US", name: "988 Suicide & Crisis Lifeline", number: "988", hours: "24/7" },
  { region: "US", name: "Crisis Text Line", number: "Text HOME to 741741", hours: "24/7" },
  { region: "UK", name: "Samaritans", number: "116 123", hours: "24/7" },
  { region: "UK", name: "SHOUT Crisis Text", number: "Text SHOUT to 85258", hours: "24/7" },
  { region: "CA", name: "Talk Suicide Canada", number: "1-833-456-4566", hours: "24/7" },
  { region: "AU", name: "Lifeline Australia", number: "13 11 14", hours: "24/7" },
  { region: "IN", name: "iCall India", number: "9152987821", hours: "Mon-Sat 8am-10pm" },
  { region: "PK", name: "Umang Pakistan", number: "0311-7786264", hours: "Daily 6pm-11pm" },
  { region: "INTL", name: "International Crisis Hotlines (find yours)", number: "findahelpline.com", hours: "24/7" },
];

export function getRegionFromTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes("America")) return "US";
    if (tz.includes("Europe/London")) return "UK";
    if (tz.includes("Australia")) return "AU";
    if (tz.includes("Toronto") || tz.includes("Vancouver")) return "CA";
    if (tz.includes("Kolkata") || tz.includes("Calcutta")) return "IN";
    if (tz.includes("Karachi")) return "PK";
    return "INTL";
  } catch { return "INTL"; }
}

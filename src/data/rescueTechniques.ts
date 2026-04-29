// Quick Rescue technique library: anxiety, anger, overwhelm.
// Each technique has clear steps + a duration; the player handles timer + tracking.

export type RescueCategory = "anxiety" | "anger" | "overwhelm";

export interface RescueTechnique {
  id: string;
  category: RescueCategory;
  title: string;
  emoji: string;
  duration: number;       // minutes
  desc: string;
  steps: string[];
  tip?: string;
}

export const RESCUE_TECHNIQUES: RescueTechnique[] = [
  // ── Anxiety ──────────────────────────────────────────────────────────────
  {
    id: "rescue-54321",
    category: "anxiety",
    title: "5-4-3-2-1 Grounding",
    emoji: "👁️",
    duration: 5,
    desc: "Anchor into the present using all five senses.",
    steps: [
      "Look around. Name 5 things you can SEE.",
      "Notice 4 things you can TOUCH. Feel their texture.",
      "Listen for 3 things you can HEAR.",
      "Identify 2 things you can SMELL.",
      "Find 1 thing you can TASTE.",
      "Take three slow breaths. You are here. You are present.",
    ],
  },
  {
    id: "rescue-havening",
    category: "anxiety",
    title: "Havening Touch",
    emoji: "🤲",
    duration: 4,
    desc: "Self-soothing touch that calms the nervous system.",
    steps: [
      "Cross your arms over your chest, hands on opposite shoulders.",
      "Slowly stroke down your arms from shoulder to elbow.",
      "Continue the gentle stroke for 30 seconds.",
      "Now stroke your palms together slowly, as if washing your hands.",
      "Then stroke your face from forehead down to chin.",
      "Keep going for 2 more minutes. Hum softly if it feels right.",
    ],
  },
  {
    id: "rescue-butterfly",
    category: "anxiety",
    title: "Butterfly Hug",
    emoji: "🦋",
    duration: 3,
    desc: "Bilateral stimulation used in trauma therapy.",
    steps: [
      "Cross your hands over your chest, fingers pointing toward your shoulders.",
      "Tap gently — left, right, left, right — like butterfly wings.",
      "Slow, rhythmic taps. Find your own pace.",
      "Breathe naturally. Notice any sensations without judgment.",
      "Continue for 2 minutes. Let your body settle.",
    ],
  },
  {
    id: "rescue-box-breath",
    category: "anxiety",
    title: "Box Breathing",
    emoji: "🧊",
    duration: 4,
    desc: "Used by Navy SEALs to reset under stress: 4-4-4-4.",
    steps: [
      "Sit upright. Soften your shoulders.",
      "Inhale through your nose for 4 counts.",
      "Hold for 4 counts.",
      "Exhale through your mouth for 4 counts.",
      "Hold empty for 4 counts.",
      "Repeat for 8 cycles. Notice your heart rate slow.",
    ],
  },
  {
    id: "rescue-pmr",
    category: "anxiety",
    title: "Progressive Muscle Relaxation",
    emoji: "💆",
    duration: 7,
    desc: "Tense and release each muscle group to discharge stress.",
    steps: [
      "Sit or lie down. Close your eyes.",
      "Squeeze your fists tight for 5 seconds. Then release.",
      "Tense your arms — biceps tight. Hold. Release.",
      "Scrunch your face. Hold. Let it melt.",
      "Tense your shoulders to your ears. Hold. Drop.",
      "Tighten your stomach. Hold. Soften.",
      "Squeeze your thighs, calves, feet. Hold. Release.",
      "Lie still. Notice the heavy, warm sensation throughout your body.",
    ],
  },

  // ── Anger ────────────────────────────────────────────────────────────────
  {
    id: "rescue-cooling-breath",
    category: "anger",
    title: "Cooling Breath (Sitali)",
    emoji: "❄️",
    duration: 3,
    desc: "Yogic breath that cools the body and mind.",
    steps: [
      "Curl your tongue into a tube (or purse your lips).",
      "Inhale slowly through the curled tongue — feel the cool air.",
      "Close your mouth. Exhale slowly through your nose.",
      "Repeat for 10 breaths.",
      "Notice the temperature drop in your chest. The fire is settling.",
    ],
  },
  {
    id: "rescue-mindful-pause",
    category: "anger",
    title: "Mindful Pause",
    emoji: "⏸️",
    duration: 2,
    desc: "Stop the reactive loop. Buy your wise self time.",
    steps: [
      "Stop. Don't speak. Don't act. Don't even think a response.",
      "Take one deep breath in through your nose.",
      "Exhale slowly through your mouth, twice as long.",
      "Ask: 'What do I actually want here?'",
      "Wait until you can answer with calm, not heat.",
    ],
  },
  {
    id: "rescue-label",
    category: "anger",
    title: "Emotion Labeling",
    emoji: "🏷️",
    duration: 3,
    desc: "Naming what you feel reduces its intensity (proven in fMRI studies).",
    steps: [
      "Place one hand on your heart.",
      "Say out loud (or in your head): 'I am feeling angry.'",
      "Get more specific: 'It feels like betrayal.' Or 'It feels like fear.'",
      "Where do you feel it in your body? Chest, jaw, fists?",
      "Stay with the sensation for 60 seconds without acting on it.",
      "Notice — the wave is passing.",
    ],
  },
  {
    id: "rescue-physical",
    category: "anger",
    title: "Physical Release",
    emoji: "💪",
    duration: 5,
    desc: "Move the energy through your body — don't bottle it.",
    steps: [
      "Stand up. Shake your hands hard for 30 seconds.",
      "Now your whole arms. Then your legs. Then your whole body.",
      "Push against a wall as hard as you can for 20 seconds.",
      "Release. Let your arms hang. Breathe.",
      "Walk briskly for 2 minutes if you can — outside is best.",
      "Come back to stillness. The fire is now movement, not destruction.",
    ],
  },

  // ── Overwhelm ────────────────────────────────────────────────────────────
  {
    id: "rescue-brain-dump",
    category: "overwhelm",
    title: "Brain Dump",
    emoji: "🧠",
    duration: 5,
    desc: "Empty everything in your head onto paper. Free up working memory.",
    steps: [
      "Grab paper or open the journal.",
      "Set a 4-minute timer.",
      "Write everything that's on your mind. No order. No editing.",
      "Tasks. Worries. Half-thoughts. People you owe a reply. All of it.",
      "When the timer ends, look at the page. Notice it's now outside your head.",
      "Pick ONE thing to do next. Just one. Circle it.",
    ],
  },
  {
    id: "rescue-priority",
    category: "overwhelm",
    title: "Priority Matrix",
    emoji: "🎯",
    duration: 4,
    desc: "Sort your chaos into urgent/important quadrants.",
    steps: [
      "On paper, draw a 2x2 grid.",
      "Top-left: Urgent + Important. Do these today.",
      "Top-right: Important + Not Urgent. Schedule these.",
      "Bottom-left: Urgent + Not Important. Delegate or delete.",
      "Bottom-right: Neither. Drop them entirely.",
      "Pick one item from the top-left. That's your only focus right now.",
    ],
  },
  {
    id: "rescue-one-thing",
    category: "overwhelm",
    title: "One Thing Meditation",
    emoji: "☝️",
    duration: 5,
    desc: "Reduce everything to a single next action.",
    steps: [
      "Close your eyes. Take three slow breaths.",
      "Picture all your tasks as leaves on a stream, floating past.",
      "Don't grab any. Just let them float.",
      "When ready, ask: 'What is the ONE thing I can do in the next hour?'",
      "Wait for an answer. It will come.",
      "Open your eyes. Do that one thing. Nothing else exists right now.",
    ],
  },
  {
    id: "rescue-let-go",
    category: "overwhelm",
    title: "Let It Go Visualization",
    emoji: "🎈",
    duration: 4,
    desc: "Release what isn't yours to carry today.",
    steps: [
      "Sit comfortably. Imagine each worry as a balloon in your hand.",
      "Name it: 'This is the worry about the email.'",
      "Acknowledge it. Then open your hand and let it float upward.",
      "Watch it drift away. It will still be there tomorrow if needed.",
      "Continue with each worry. One at a time.",
      "Notice your hands are now empty. Lighter. Freer.",
    ],
  },
];

export const CATEGORY_META: Record<RescueCategory, { label: string; emoji: string; gradient: string; description: string }> = {
  anxiety: {
    label: "Anxiety",
    emoji: "🌊",
    gradient: "from-[hsl(var(--sage))]/30 to-[hsl(var(--forest))]/10",
    description: "Quick rescues to slow a racing mind",
  },
  anger: {
    label: "Anger",
    emoji: "🔥",
    gradient: "from-[hsl(var(--gold-dark))]/30 to-[hsl(var(--gold))]/10",
    description: "Cool the heat. Respond from your wise self",
  },
  overwhelm: {
    label: "Overwhelm",
    emoji: "🌀",
    gradient: "from-[hsl(var(--forest-mid))]/30 to-[hsl(var(--sage))]/10",
    description: "Untangle the noise. Find the next step",
  },
};

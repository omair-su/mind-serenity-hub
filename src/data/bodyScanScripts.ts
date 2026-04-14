export interface BodyZoneData {
  id: string;
  label: string;
  icon: string;
  color: string;
  duration: number;
  description: string;
  guidanceScript: string;
  tips: string[];
  sensations: string[];
}

export const bodyScanZones: BodyZoneData[] = [
  {
    id: "head",
    label: "Head & Crown",
    icon: "Brain",
    color: "from-[hsl(270,20%,40%)] to-[hsl(280,18%,35%)]",
    duration: 60,
    description: "Release tension in your forehead, temples, and jaw.",
    guidanceScript:
      "Begin by bringing your full attention to the very top of your head — the crown. Imagine a warm, golden light resting gently there. Feel it softening the muscles of your scalp. Now move your awareness to your forehead. Notice if there is any tightness, any furrowing. Simply observe it, and let it go. Allow your forehead to become smooth and relaxed. [30 seconds] Now bring your attention to your temples. These small muscles often hold hidden stress. Let them soften. Feel the warmth spreading across the sides of your head. Your entire scalp feels loose, light, and free.",
    tips: [
      "Imagine warmth spreading across your scalp",
      "Unclench your jaw slightly",
      "Let your tongue rest on the roof of your mouth",
    ],
    sensations: ["Tingling", "Warmth", "Lightness", "Pressure release"],
  },
  {
    id: "eyes",
    label: "Eyes & Face",
    icon: "Eye",
    color: "from-[hsl(230,20%,40%)] to-[hsl(220,18%,35%)]",
    duration: 45,
    description: "Soften the muscles around your eyes and cheeks.",
    guidanceScript:
      "Gently close your eyes, or let them soften with a downward gaze. Notice the tiny muscles around your eye sockets. These muscles work tirelessly all day. Allow them to let go completely. Feel your eyelids become heavy and relaxed. [20 seconds] Now bring attention to your cheeks and the bridge of your nose. Let your cheeks drop, your nostrils relax. If there is any clenching in your jaw, let your mouth open slightly. Your entire face is soft, calm, and peaceful.",
    tips: [
      "Let your eyelids feel heavy",
      "Relax the space between your eyebrows",
      "Soften your cheeks downward",
    ],
    sensations: ["Heaviness in eyelids", "Softening", "Calm", "Stillness"],
  },
  {
    id: "neck",
    label: "Neck & Shoulders",
    icon: "Zap",
    color: "from-[hsl(180,18%,38%)] to-[hsl(170,16%,33%)]",
    duration: 75,
    description: "Let go of tightness in your neck and shoulder blades.",
    guidanceScript:
      "Now move your attention down to your neck — one of the most common places we hold stress. Feel the muscles along the back of your neck. Without moving, simply notice. Are they tight? Strained? Just observe, and with each exhale, invite them to soften. [30 seconds] Now let your awareness flow down into your shoulders. Many of us carry the weight of the world here. With your next exhale, let your shoulders drop — gently, naturally. Feel them releasing downward, away from your ears. [30 seconds] Feel the space between your neck and shoulders opening. Breathe into that space. You are letting go of what you have been carrying.",
    tips: [
      "Drop shoulders away from your ears",
      "Gently tilt your head side to side mentally",
      "Breathe into the base of your skull",
    ],
    sensations: ["Heaviness dropping", "Space opening", "Warmth", "Release"],
  },
  {
    id: "chest",
    label: "Chest & Heart",
    icon: "Heart",
    color: "from-[hsl(350,20%,42%)] to-[hsl(340,18%,37%)]",
    duration: 60,
    description: "Feel your heartbeat and breathe into your chest.",
    guidanceScript:
      "Bring your awareness to your chest — the home of your heart. Feel the gentle rise and fall of your breath. Notice your heartbeat. That faithful rhythm that has been with you since before you were born. Place your inner attention right on your heart. [20 seconds] With each inhale, imagine your chest expanding with warm, rose-colored light. With each exhale, feel any tightness, any emotional weight, melting away. Your heart is safe. Your chest is open. You are breathing fully and freely. [20 seconds] Feel gratitude for this body. For every breath. For every heartbeat.",
    tips: [
      "Place a hand on your chest if it helps",
      "Breathe deeply into your ribcage",
      "Imagine a warm glow around your heart",
    ],
    sensations: ["Heartbeat awareness", "Expansion", "Warmth", "Emotional release"],
  },
  {
    id: "arms",
    label: "Arms & Hands",
    icon: "Hand",
    color: "from-[hsl(30,22%,42%)] to-[hsl(25,20%,37%)]",
    duration: 60,
    description: "Release tension from shoulders through fingertips.",
    guidanceScript:
      "Let your attention flow from your shoulders, down through your upper arms. Feel the weight of your arms resting. They do so much for you every day — carrying, holding, creating. Let them rest completely now. [20 seconds] Move your awareness down to your forearms, your wrists. Notice any tension. Let it dissolve. Now bring all your attention to your hands. Feel your palms. Feel the energy in your fingertips. Imagine warmth flowing from your shoulders, through your arms, and out through your fingertips. [20 seconds] Your arms are heavy, warm, and completely relaxed.",
    tips: [
      "Let your arms rest at your sides",
      "Unclench your fists completely",
      "Feel the weight of your hands",
    ],
    sensations: ["Heaviness", "Tingling in fingertips", "Warmth flowing", "Deep rest"],
  },
  {
    id: "core",
    label: "Belly & Core",
    icon: "Sparkles",
    color: "from-[hsl(145,18%,38%)] to-[hsl(150,16%,33%)]",
    duration: 60,
    description: "Soften your abdomen and feel grounded.",
    guidanceScript:
      "Now bring your awareness to your belly — your centre of gravity, your core. We often hold tension here without realizing it. With your next exhale, let your belly soften completely. Let it expand naturally. There is no need to hold it in. [20 seconds] Feel each breath moving your belly gently up and down, like waves on a calm ocean. With each wave, you are releasing stored tension, stored emotion. [20 seconds] Your core is soft. Your centre is calm. You feel grounded and at peace. Breathe gently and let your entire midsection relax.",
    tips: [
      "Stop holding your belly in",
      "Breathe into your lower abdomen",
      "Imagine tension melting with each exhale",
    ],
    sensations: ["Softening", "Gentle movement", "Groundedness", "Inner calm"],
  },
  {
    id: "hips",
    label: "Hips & Lower Back",
    icon: "Zap",
    color: "from-[hsl(45,22%,42%)] to-[hsl(35,20%,37%)]",
    duration: 75,
    description: "Release stored stress in your hip flexors.",
    guidanceScript:
      "Move your awareness to your hips and lower back — areas that carry enormous amounts of tension, especially if you sit for long periods. Notice the muscles around your hip joints. Without moving, send your breath there. [30 seconds] Now feel your lower back. The lumbar spine. This area supports your entire upper body. Imagine warm, healing energy flowing into your lower back, softening every tight muscle fibre. [30 seconds] Your hips are open. Your lower back is supported. You are releasing old, stored tension that no longer serves you. Let it go with each exhale.",
    tips: [
      "Imagine your hips widening slightly",
      "Send your breath to your lower back",
      "Release any clenching in your glutes",
    ],
    sensations: ["Deep release", "Opening", "Warmth", "Emotional liberation"],
  },
  {
    id: "legs",
    label: "Legs & Thighs",
    icon: "Zap",
    color: "from-[hsl(170,18%,38%)] to-[hsl(185,16%,33%)]",
    duration: 60,
    description: "Let heaviness drain from your legs.",
    guidanceScript:
      "Let your attention flow down into your thighs — those powerful muscles that carry you through each day. Feel their weight pressing into the surface beneath you. Let them be completely heavy. [20 seconds] Move your awareness to your knees, then down into your calves and shins. Notice any areas of tightness, and breathe into them. Imagine all the stress, all the weight you carry, flowing downward through your legs like water. [20 seconds] Your legs are heavy, warm, and deeply relaxed. They have carried you far. Let them rest now.",
    tips: [
      "Feel the weight of your legs sinking down",
      "Relax behind your knees",
      "Let your calves go completely soft",
    ],
    sensations: ["Heaviness", "Warmth flowing down", "Deep relaxation", "Stillness"],
  },
  {
    id: "feet",
    label: "Feet & Toes",
    icon: "Footprints",
    color: "from-[hsl(220,18%,40%)] to-[hsl(240,16%,35%)]",
    duration: 45,
    description: "Ground yourself through the soles of your feet.",
    guidanceScript:
      "Finally, bring all of your awareness to your feet — the foundation of your body. Feel the soles of your feet. Whether they are touching the floor or resting in the air, imagine roots growing from them, reaching deep into the earth. [20 seconds] Feel each toe individually. The ball of your foot. Your arches. Your heels. Breathe warmth and attention into every part of your feet. You are grounded. You are connected to the earth beneath you. Your entire body, from the crown of your head to the tips of your toes, is relaxed, peaceful, and whole.",
    tips: [
      "Wiggle your toes gently, then let them be still",
      "Imagine roots growing from your soles",
      "Feel connection to the ground",
    ],
    sensations: ["Grounding", "Tingling", "Connection", "Completeness"],
  },
];

export const bodyScanIntroScript =
  "Welcome to your guided body scan meditation. Find a comfortable position — lying down or sitting. Close your eyes gently. Take three deep breaths. Inhale through your nose, and exhale slowly through your mouth. With each exhale, let your body sink a little deeper into relaxation. We will now journey through each part of your body, releasing tension and inviting peace.";

export const bodyScanOutroScript =
  "You have now completed a full body scan from head to toe. Your entire body is relaxed, heavy, and at peace. Take a moment to appreciate this feeling of wholeness. When you are ready, gently wiggle your fingers and toes. Take a deep breath. And slowly open your eyes, carrying this calm with you into the rest of your day. Namaste.";

import { TreePine, Mountain, Waves, Sun, type LucideIcon } from "lucide-react";
import type { AmbientBedId } from "@/hooks/useAmbientBed";

export type VoiceKey = "sarah" | "george" | "matilda" | "charlie";

export interface WalkingTechnique {
  id: string;
  title: string;
  duration: number; // minutes
  voice: VoiceKey;
  isPremium: boolean;
  fullDescription: string;
  steps: string[];
}

export interface WalkingEnvironment {
  id: string;
  label: string;
  icon: LucideIcon;
  imageUrl: string;
  ambientBed: AmbientBedId;
  tint: string; // tailwind gradient classes for hero overlay
  desc: string;
}

export const walkingEnvironments: WalkingEnvironment[] = [
  {
    id: "forest",
    label: "Forest Path",
    icon: TreePine,
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80&auto=format&fit=crop",
    ambientBed: "birds",
    tint: "from-forest-deep/95 via-forest/40 to-transparent",
    desc: "Walk among ancient trees. Birdsong overhead, moss underfoot.",
  },
  {
    id: "mountain",
    label: "Mountain Trail",
    icon: Mountain,
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80&auto=format&fit=crop",
    ambientBed: "wind",
    tint: "from-slate-950/95 via-slate-800/40 to-transparent",
    desc: "Ascend with steady breath. Wind carries every thought away.",
  },
  {
    id: "ocean",
    label: "Ocean Shore",
    icon: Waves,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop",
    ambientBed: "ocean",
    tint: "from-gold-dark/90 via-gold/30 to-transparent",
    desc: "Feel sand shift. Let waves synchronize with your breath.",
  },
  {
    id: "garden",
    label: "Zen Garden",
    icon: Sun,
    imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80&auto=format&fit=crop",
    ambientBed: "bowls",
    tint: "from-gold-dark/90 via-gold/30 to-transparent",
    desc: "Walk raked patterns. Each step deliberate, complete.",
  },
];

export const walkingTechniques: WalkingTechnique[] = [
  {
    id: "mindful",
    title: "Mindful Walking",
    duration: 10,
    voice: "sarah",
    isPremium: false,
    fullDescription:
      "Foundational Vipassana practice. Trains moment-to-moment awareness through complete attention to the physical act of walking.",
    steps: [
      "Stand still. Feel the weight of your body through your feet. Notice which parts of your soles touch the ground.",
      "Begin walking slowly. As you lift your left foot, notice the intention to move before the movement begins.",
      "Feel the heel leave the ground first, then the ball, then the toes. Your foot swings through the air. Notice the lightness.",
      "Place the heel down first. Feel the weight transfer smoothly from heel to toe.",
      "As one foot lands, the other begins to lift. Feel this continuous dance of balance.",
      "When your mind wanders, simply note 'thinking', and return to the feeling of your feet.",
      "Gradually slow down even further. Feel the muscles in your ankles, calves, and thighs working in harmony.",
      "For the final minute, walk at your natural pace, carrying this deep awareness with you.",
    ],
  },
  {
    id: "gratitude",
    title: "Gratitude Walk",
    duration: 15,
    voice: "sarah",
    isPremium: false,
    fullDescription:
      "Combines gratitude practice with walking. Research by Dr. Robert Emmons shows gratitude walkers report 23% less stress.",
    steps: [
      "Begin walking and notice the ground beneath you. With each step, silently say 'thank you'.",
      "Look around. Find something beautiful — a colour, a shape, a shadow. Feel genuine appreciation.",
      "Think of a person who has helped you. Picture their face. Send them silent gratitude.",
      "Notice the air filling your lungs. Appreciate this breath, connecting you to every living being.",
      "Feel the miracle of movement. Thousands of nerve signals, muscles contracting, all happening without effort.",
      "Recall a difficult time that taught you something valuable. Thank that difficulty for its hidden gift.",
      "For the final minutes, walk with simple awareness. I am alive. I am here. This is enough.",
    ],
  },
  {
    id: "body-aware",
    title: "Body Awareness Walk",
    duration: 12,
    voice: "george",
    isPremium: false,
    fullDescription:
      "Progressive body-scanning applied to walking. From somatic therapy. Reveals unconscious tension and teaches release through movement.",
    steps: [
      "Begin walking. Bring all attention to your feet. The pressure, the temperature, the texture of the ground.",
      "Move awareness up to your ankles and calves. Notice the muscles contracting and releasing with each step.",
      "Scan your knees. Are they locked or soft? Let them absorb each step like natural shock absorbers.",
      "Feel your hips, the ball-and-socket joints. Notice the subtle rotation with each stride.",
      "Bring attention to your core. The deep muscles that stabilize you. Feel them engaging rhythmically.",
      "Notice your spine, from tailbone to skull. Let it find its natural, comfortable alignment.",
      "Scan your shoulders. Are they creeping up? Let them drop and roll gently back.",
      "Finally, notice your whole body as one integrated system. Every part working in harmony.",
    ],
  },
  {
    id: "breath-sync",
    title: "Breath-Synced Walk",
    duration: 10,
    voice: "george",
    isPremium: false,
    fullDescription:
      "Links breath cycle to steps, creating moving pranayama. Used by Tibetan monks. Calms the vagus nerve.",
    steps: [
      "Begin walking comfortably. Notice your natural breathing rhythm without changing it.",
      "Count how many steps you take during a natural inhale. Then count your exhale steps.",
      "Gradually shift to a pattern. Inhale for four steps. Let the breath flow in smoothly.",
      "Exhale for six steps. A longer exhale activates your calming nervous system.",
      "If four-six feels uncomfortable, try three-four or two-three. The key is a longer exhale.",
      "After several minutes, add a brief hold. Inhale four steps, hold two steps, exhale six steps.",
      "Notice how your body relaxes. Shoulders drop. Jaw unclenches. Steps become lighter.",
      "Release the counting and let breath and steps find their own natural rhythm together.",
    ],
  },
  {
    id: "metta",
    title: "Loving-Kindness Walk",
    duration: 12,
    voice: "matilda",
    isPremium: false,
    fullDescription:
      "Radiate metta with each step. A walking adaptation of the Buddhist loving-kindness meditation. Builds compassion as a felt experience.",
    steps: [
      "Begin walking gently. Bring to mind someone you love deeply. Picture their face. Smile inwardly.",
      "With each step, silently offer them. May you be safe. May you be happy. May you be at ease.",
      "Now bring yourself to mind. Place a hand briefly on your heart. May I be safe. May I be happy. May I be at ease.",
      "Picture a neutral person. Someone you've passed but never spoken to. Offer them the same wishes with each step.",
      "Now bring to mind someone difficult. Someone who has hurt you. Soften. May you, too, be free of suffering.",
      "Expand outward. Send loving-kindness to your street, your city, your country, the world. Each step a quiet blessing.",
      "Let the practice dissolve. Just walk. Notice the warmth still glowing in your chest.",
    ],
  },
  {
    id: "shinrin-yoku",
    title: "Forest Bathing (Shinrin-yoku)",
    duration: 20,
    voice: "matilda",
    isPremium: true,
    fullDescription:
      "The Japanese practice of immersing all five senses in nature. Clinically proven to lower cortisol, blood pressure, and boost immune NK cells.",
    steps: [
      "Walk slowly. Slower than feels natural. There is nowhere to arrive. The forest is the destination.",
      "Open your eyes wide. Take in the full spectrum of greens. Light filtering through leaves. Patterns of bark.",
      "Listen. Layers of sound. Birdsong near and far. Wind in the canopy. Your own breath. Below it all, silence.",
      "Touch a leaf. Bark. Stone. Earth. Notice the temperature, the texture, the aliveness of each.",
      "Breathe deeply through your nose. Trees release phytoncides, healing oils. Let them enter your lungs.",
      "If you find a place that calls to you, stop. Sit. Lean against a tree. Become part of the forest.",
      "Taste the air. Sweet from blossoms, sharp from pine, mineral from damp earth.",
      "Continue walking. Carry the forest's slowness inside you. There is no rush, ever.",
    ],
  },
];

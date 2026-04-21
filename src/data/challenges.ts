export interface ChallengeDay {
  day: number;
  title: string;
  description: string;
  practice: string;
  duration: number;
}

export interface Challenge {
  id: string;
  name: string;
  icon: string;
  description: string;
  duration: number;
  category: string;
  color: string;
  benefits: string[];
  days: ChallengeDay[];
}

export const challenges: Challenge[] = [
  {
    id: "stress-detox",
    name: "7-Day Stress Detox",
    icon: "🧊",
    description: "Release accumulated stress and rebuild your calm foundation with daily targeted practices.",
    duration: 7,
    category: "Wellness",
    color: "from-[hsl(var(--sage-light))] to-[hsl(var(--sage))]/30",
    benefits: ["Lower cortisol levels", "Better sleep quality", "Reduced muscle tension", "Clearer thinking"],
    days: [
      { day: 1, title: "Awareness", description: "Identify your stress patterns", practice: "Spend 10 minutes in body scan meditation. Notice where you hold tension — jaw, shoulders, stomach. Simply observe without trying to change anything. Write down what you notice.", duration: 10 },
      { day: 2, title: "Release", description: "Let go of physical tension", practice: "Progressive muscle relaxation: tense each muscle group for 5 seconds, then release. Start with your toes and work up to your forehead. Notice the difference between tension and relaxation.", duration: 15 },
      { day: 3, title: "Breathe", description: "Activate your calming system", practice: "Practice the 4-7-8 breathing technique for 10 minutes. Inhale for 4 counts, hold for 7, exhale for 8. This directly activates your parasympathetic nervous system.", duration: 10 },
      { day: 4, title: "Boundaries", description: "Create mental space", practice: "Visualization meditation: imagine a peaceful boundary around yourself — a garden wall, a sphere of light, a gentle stream. Inside this space, you are safe. Practice holding this image for 12 minutes.", duration: 12 },
      { day: 5, title: "Gratitude", description: "Shift your neural pathways", practice: "Gratitude meditation: bring to mind 5 things you're grateful for. Spend 2 minutes with each one, really feeling the gratitude in your body. Where do you feel it? Let it expand.", duration: 12 },
      { day: 6, title: "Compassion", description: "Be gentle with yourself", practice: "Self-compassion meditation: place your hand on your heart. Repeat: 'May I be kind to myself. May I give myself the compassion I need.' Feel the warmth of your hand and your own care.", duration: 15 },
      { day: 7, title: "Integration", description: "Build your daily practice", practice: "Combine your favorite techniques from this week into a 15-minute personal practice. This is YOUR stress-detox ritual. You can return to it anytime life feels overwhelming.", duration: 15 },
    ]
  },
  {
    id: "self-love",
    name: "5-Day Self-Love Journey",
    icon: "💗",
    description: "Cultivate deep self-acceptance and unconditional self-compassion through gentle daily practices.",
    duration: 5,
    category: "Emotional",
    color: "from-[hsl(var(--gold-light))]/40 to-[hsl(var(--cream-dark))]",
    benefits: ["Increased self-worth", "Better emotional resilience", "Healthier boundaries", "Inner peace"],
    days: [
      { day: 1, title: "Mirror Work", description: "See yourself with love", practice: "Sit comfortably and close your eyes. Visualize yourself as a child. Send that child love and safety. Say internally: 'You are worthy. You are enough. You always have been.'", duration: 10 },
      { day: 2, title: "Forgiveness", description: "Release self-judgment", practice: "Bring to mind something you've been hard on yourself about. Breathe into it. Say: 'I forgive myself. I did the best I could with what I knew then. I release this burden now.'", duration: 12 },
      { day: 3, title: "Boundaries", description: "Honor your needs", practice: "Meditate on what you need right now. Not what others need from you — what YOU need. Practice saying internally: 'My needs matter. I honor my limits. Saying no is an act of self-love.'", duration: 10 },
      { day: 4, title: "Celebration", description: "Acknowledge your strength", practice: "List 5 challenges you've overcome. Meditate on each one, feeling the strength it took. You are resilient. You are brave. Let yourself feel proud.", duration: 12 },
      { day: 5, title: "Commitment", description: "Promise yourself kindness", practice: "Write a love letter to yourself. Then meditate on its key phrases. Make a commitment: 'From this day forward, I choose to speak to myself the way I'd speak to someone I love.'", duration: 15 },
    ]
  },
  {
    id: "gratitude-challenge",
    name: "10-Day Gratitude Immersion",
    icon: "🙏",
    description: "Rewire your brain for positivity with daily gratitude practices that build on each other.",
    duration: 10,
    category: "Mindset",
    color: "from-[hsl(var(--gold))]/25 to-[hsl(var(--gold-light))]/30",
    benefits: ["Increased happiness", "Better relationships", "Improved sleep", "Reduced anxiety"],
    days: [
      { day: 1, title: "Simple Gratitude", description: "Start with the basics", practice: "List 3 things you're grateful for today. For each one, close your eyes and spend 2 minutes really feeling the gratitude. Where in your body do you feel it?", duration: 8 },
      { day: 2, title: "Body Gratitude", description: "Thank your body", practice: "Do a gratitude body scan. Thank each part of your body for what it does. 'Thank you, lungs, for every breath. Thank you, heart, for beating faithfully.'", duration: 10 },
      { day: 3, title: "People Gratitude", description: "Appreciate your connections", practice: "Think of 3 people who've positively impacted your life. Send each one silent gratitude. Visualize their face and say 'Thank you for being in my life.'", duration: 10 },
      { day: 4, title: "Challenge Gratitude", description: "Find gifts in difficulty", practice: "Think of a recent challenge. Can you find something it taught you? Meditate on the growth that came from difficulty. Even pain can be a teacher.", duration: 12 },
      { day: 5, title: "Nature Gratitude", description: "Connect with the earth", practice: "Go outside or visualize nature. Express gratitude for the natural world — the air, the sun, the rain, the trees. Feel your connection to the earth.", duration: 10 },
      { day: 6, title: "Small Things", description: "Notice the overlooked", practice: "Today, find gratitude in tiny things: the taste of water, the feeling of a warm blanket, the sound of birds. Meditate on how rich your life is in small pleasures.", duration: 10 },
      { day: 7, title: "Future Gratitude", description: "Pre-appreciate what's coming", practice: "Visualize your ideal tomorrow. Feel grateful for it in advance. This practice programs your brain to notice positive experiences as they happen.", duration: 10 },
      { day: 8, title: "Gratitude Letter", description: "Express appreciation deeply", practice: "Write a gratitude letter to someone (you don't have to send it). Then meditate on the feeling of gratitude as you wrote. Let it fill you.", duration: 15 },
      { day: 9, title: "Self-Gratitude", description: "Appreciate yourself", practice: "Thank yourself. For showing up. For trying. For caring enough to do this challenge. You deserve your own gratitude.", duration: 10 },
      { day: 10, title: "Gratitude as a Way of Life", description: "Make it permanent", practice: "Create your personal gratitude ritual. Choose a time, a place, a duration. This is now part of your daily life. The practice continues beyond this challenge.", duration: 12 },
    ]
  },
  {
    id: "energy-boost",
    name: "5-Day Energy Reset",
    icon: "⚡",
    description: "Revitalize your mind and body with energizing meditation techniques.",
    duration: 5,
    category: "Vitality",
    color: "from-[hsl(var(--gold-dark))]/20 to-[hsl(var(--gold))]/25",
    benefits: ["Natural energy boost", "Mental clarity", "Reduced fatigue", "Better motivation"],
    days: [
      { day: 1, title: "Breath of Fire", description: "Ignite your inner energy", practice: "Practice rapid, rhythmic breathing through the nose. Quick inhales and exhales, pumping the belly. Start with 30 seconds, rest, repeat 3 times. Then sit in stillness and feel the energy buzzing.", duration: 10 },
      { day: 2, title: "Power Visualization", description: "See yourself energized", practice: "Visualize a golden light entering through the crown of your head with each inhale. It fills your entire body with warm, electric energy. With each exhale, fatigue leaves as gray mist.", duration: 12 },
      { day: 3, title: "Movement Meditation", description: "Energy through the body", practice: "Standing meditation: sway gently, roll your shoulders, stretch your neck. Move intuitively for 5 minutes, then stand still. Feel the energy humming through your body.", duration: 10 },
      { day: 4, title: "Intention Setting", description: "Direct your energy", practice: "Set 3 powerful intentions for your energy today. 'I am alert. I am focused. I am alive.' Repeat each one 10 times, feeling them become true with each repetition.", duration: 10 },
      { day: 5, title: "Morning Power Ritual", description: "Create your energy routine", practice: "Combine breath of fire (1 min), power visualization (3 min), gentle movement (2 min), and intentions (2 min) into your personal morning power ritual.", duration: 10 },
    ]
  },
  {
    id: "deep-sleep",
    name: "7-Day Sleep Mastery",
    icon: "🌙",
    description: "Transform your relationship with sleep using proven meditation and relaxation techniques.",
    duration: 7,
    category: "Sleep",
    color: "from-[hsl(var(--forest-deep))]/30 to-[hsl(var(--forest))]/15",
    benefits: ["Faster sleep onset", "Deeper sleep cycles", "Less nighttime waking", "Morning freshness"],
    days: [
      { day: 1, title: "Sleep Sanctuary", description: "Create your sleep space", practice: "Guided visualization of your ideal sleep space. Every detail — the perfect temperature, the softest sheets, the most comforting darkness. Build this space in your mind to return to each night.", duration: 12 },
      { day: 2, title: "Body Melt", description: "Release the day's tension", practice: "Progressive relaxation from toes to crown. Imagine each body part melting into the mattress. By the time you reach your head, your body should feel like warm honey.", duration: 15 },
      { day: 3, title: "Thought Clouds", description: "Release mental chatter", practice: "Watch your thoughts like clouds passing through a sky. Don't engage with them. Just notice: 'There goes a worry cloud. There goes a planning cloud.' Let them all drift away.", duration: 10 },
      { day: 4, title: "Sleep Breath", description: "Breath-based sleep induction", practice: "The 4-7-8 technique: breathe in for 4, hold for 7, out for 8. Repeat 4 cycles. Then breathe naturally and count backwards from 100 with each exhale.", duration: 12 },
      { day: 5, title: "Gratitude for Rest", description: "End the day with appreciation", practice: "Review your day with gratitude. Thank your body for carrying you. Thank your mind for its efforts. Give yourself permission to rest. You have done enough.", duration: 10 },
      { day: 6, title: "Sleep Story", description: "Narrative sleep induction", practice: "Create a mental story — a boat on a calm lake, a walk through a moonlit garden, a cloud floating through a starry sky. Let the story become a dream.", duration: 15 },
      { day: 7, title: "Sleep Ritual", description: "Your nightly practice", practice: "Combine your favorite elements: 2 min gratitude, 3 min body melt, 3 min sleep breath, 5 min sleep story. This is your nightly passport to deep, restorative sleep.", duration: 15 },
    ]
  },
  {
    id: "focus-mastery",
    name: "7-Day Focus Mastery",
    icon: "🎯",
    description: "Sharpen your concentration and mental clarity through progressive attention training.",
    duration: 7,
    category: "Performance",
    color: "from-[hsl(var(--forest))]/20 to-[hsl(var(--sage-dark))]/25",
    benefits: ["Longer attention span", "Reduced distractibility", "Better task completion", "Mental sharpness"],
    days: [
      { day: 1, title: "Single Point", description: "Focus on one thing", practice: "Choose a single point of focus — your breath, a candle flame, a sound. When your mind wanders (it will), gently bring it back. That 'bringing back' IS the training.", duration: 10 },
      { day: 2, title: "Breath Counting", description: "Train sustained attention", practice: "Count your breaths from 1 to 10, then start over. If you lose count, start from 1. No judgment. This builds the muscle of sustained attention.", duration: 12 },
      { day: 3, title: "Body Awareness", description: "Expand your focus", practice: "Scan your body slowly, spending 30 seconds on each area. Notice every sensation. This trains your ability to focus deeply on specific targets.", duration: 15 },
      { day: 4, title: "Open Monitoring", description: "Panoramic attention", practice: "Sit with eyes slightly open. Notice everything without focusing on anything specific — sounds, sensations, thoughts, light. Practice holding broad, inclusive awareness.", duration: 12 },
      { day: 5, title: "Visualization", description: "Focus through imagery", practice: "Visualize a complex scene in detail — a garden, a building, a landscape. Hold the image stable. Add details one by one. This strengthens your mind's eye and concentration.", duration: 12 },
      { day: 6, title: "Mantra Focus", description: "Word-based concentration", practice: "Choose a word or phrase: 'Focus,' 'Clear mind,' 'Present.' Repeat it mentally with each exhale. When thoughts intrude, return to the mantra without frustration.", duration: 12 },
      { day: 7, title: "Flow State", description: "Integrate all techniques", practice: "Begin with breath counting (3 min), shift to body scan (3 min), then open monitoring (3 min), then visualization (3 min). Flow between focus modes with ease.", duration: 15 },
    ]
  },
];

const CHALLENGE_PROGRESS_KEY = "wv-challenge-progress";

export interface ChallengeProgress {
  challengeId: string;
  startedAt: string;
  completedDays: number[];
  notes: Record<number, string>;
}

export function getChallengeProgress(): Record<string, ChallengeProgress> {
  try {
    const raw = localStorage.getItem(CHALLENGE_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function saveChallengeDay(challengeId: string, dayNum: number, note?: string) {
  const all = getChallengeProgress();
  if (!all[challengeId]) {
    all[challengeId] = { challengeId, startedAt: new Date().toISOString(), completedDays: [], notes: {} };
  }
  if (!all[challengeId].completedDays.includes(dayNum)) {
    all[challengeId].completedDays.push(dayNum);
  }
  if (note) {
    all[challengeId].notes[dayNum] = note;
  }
  localStorage.setItem(CHALLENGE_PROGRESS_KEY, JSON.stringify(all));
}

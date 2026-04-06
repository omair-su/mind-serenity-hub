export interface RitualStep {
  id: string;
  title: string;
  icon: string;
  description: string;
  duration: number;
  instruction: string;
}

export interface DailyWisdom {
  quote: string;
  author: string;
  reflection: string;
}

export const morningRitual: RitualStep[] = [
  { id: "gratitude", title: "Morning Gratitude", icon: "🙏", description: "Start with appreciation", duration: 2, instruction: "Before opening your eyes fully, think of 3 things you're grateful for. Let gratitude be the first emotion of your day." },
  { id: "breath", title: "Awakening Breath", icon: "🌬️", description: "Energize your body", duration: 3, instruction: "Take 5 deep breaths: inhale for 4 counts, hold for 4, exhale for 6. Feel your body coming alive with each breath." },
  { id: "intention", title: "Set Your Intention", icon: "🎯", description: "Choose your focus", duration: 2, instruction: "Choose one word for today — calm, courage, focus, joy, patience. This word is your compass. Return to it whenever you feel lost." },
  { id: "body", title: "Gentle Body Check", icon: "🧘", description: "Connect with your body", duration: 3, instruction: "Scan from head to toe. Notice how your body feels this morning. Send warmth to any area that needs attention. Your body carried you through yesterday — thank it." },
  { id: "visualization", title: "Day Visualization", icon: "✨", description: "See your best day", duration: 3, instruction: "Visualize your day going beautifully. See yourself handling challenges with grace. See yourself smiling. See yourself at peace. What you visualize, you create." },
  { id: "affirmation", title: "Power Affirmation", icon: "💪", description: "Declare your truth", duration: 2, instruction: "Say to yourself: 'I am capable. I am calm. I am ready for whatever today brings. I choose peace over perfection.'" },
];

export const eveningRitual: RitualStep[] = [
  { id: "review", title: "Day Review", icon: "📖", description: "Reflect without judgment", duration: 3, instruction: "Review your day like a movie — don't judge, just observe. What moments brought you joy? What challenged you? What did you learn?" },
  { id: "release", title: "Release & Forgive", icon: "🕊️", description: "Let go of the day", duration: 3, instruction: "Is there anything from today you're holding onto — frustration, guilt, worry? Breathe it out. Say: 'I release what no longer serves me. Tomorrow is a new beginning.'" },
  { id: "gratitude-eve", title: "Evening Gratitude", icon: "🌟", description: "Count your blessings", duration: 2, instruction: "Name 3 good things from today. They can be tiny — a warm cup of tea, a kind word, a moment of peace. Small blessings are still blessings." },
  { id: "body-release", title: "Body Relaxation", icon: "💆", description: "Prepare for sleep", duration: 5, instruction: "Starting at your forehead, consciously relax every muscle. Let your face soften. Shoulders drop. Hands uncurl. Each exhale takes you deeper into relaxation." },
  { id: "tomorrow", title: "Tomorrow's Gift", icon: "🎁", description: "Plant a positive seed", duration: 2, instruction: "Think of one thing you're looking forward to tomorrow. Hold that feeling of anticipation. Tomorrow is a gift waiting to be unwrapped." },
  { id: "sleep-blessing", title: "Sleep Blessing", icon: "🌙", description: "Gentle transition to sleep", duration: 3, instruction: "Say: 'Thank you for this day. I have done enough. I am enough. May my sleep be deep and my dreams be kind. I surrender to rest.'" },
];

const wisdomLibrary: DailyWisdom[] = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", reflection: "What part of today's work brought you closest to love?" },
  { quote: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", reflection: "Where in your life are you most authentically you?" },
  { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", reflection: "What hidden opportunity might exist in your current challenge?" },
  { quote: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", reflection: "What single step can you take today toward your biggest dream?" },
  { quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson", reflection: "What inner strength have you discovered recently?" },
  { quote: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama", reflection: "What action could you take today to create more happiness?" },
  { quote: "The present moment is the only moment available to us, and it is the door to all moments.", author: "Thich Nhat Hanh", reflection: "How fully present were you today? What pulled you away?" },
  { quote: "You are not a drop in the ocean. You are the entire ocean in a drop.", author: "Rumi", reflection: "When have you felt the vastness within yourself?" },
  { quote: "The mind is everything. What you think, you become.", author: "Buddha", reflection: "What thought pattern would you like to cultivate?" },
  { quote: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle", reflection: "What have you learned about yourself this week?" },
  { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins", reflection: "What journey are you being called to start?" },
  { quote: "Peace comes from within. Do not seek it without.", author: "Buddha", reflection: "Where do you feel most at peace within yourself?" },
  { quote: "Every morning we are born again. What we do today matters most.", author: "Buddha", reflection: "If today were a fresh start, what would you do differently?" },
  { quote: "The wound is the place where the light enters you.", author: "Rumi", reflection: "How has a past wound led to growth or wisdom?" },
  { quote: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu", reflection: "Where in your life could you benefit from less rushing?" },
  { quote: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi", reflection: "What small change in you could ripple outward today?" },
  { quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", reflection: "When did you last rise after falling, and what did it teach you?" },
  { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon", reflection: "What unplanned moment recently brought you unexpected joy?" },
  { quote: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", reflection: "What light can you find in your current circumstances?" },
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", reflection: "What seed can you plant today for your future self?" },
  { quote: "Your calm mind is the ultimate weapon against your challenges.", author: "Bryant McGill", reflection: "How did your calm (or lack of it) affect your day?" },
  { quote: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott", reflection: "When was the last time you truly unplugged?" },
  { quote: "The soul always knows what to do to heal itself. The challenge is to silence the mind.", author: "Caroline Myss", reflection: "What is your soul trying to tell you right now?" },
  { quote: "Don't believe everything you think.", author: "Byron Katie", reflection: "What thought have you been believing that might not be true?" },
  { quote: "Inhale the future, exhale the past.", author: "Unknown", reflection: "What from the past are you ready to exhale and release?" },
  { quote: "The quieter you become, the more you can hear.", author: "Ram Dass", reflection: "What might you hear if you sat in silence for 5 minutes?" },
  { quote: "You are enough just as you are.", author: "Meghan Markle", reflection: "In what area of life do you need to remind yourself you're enough?" },
  { quote: "Stars can't shine without darkness.", author: "D.H. Sidebottom", reflection: "How has a dark period in your life revealed your brightness?" },
  { quote: "Be where you are, not where you think you should be.", author: "Unknown", reflection: "Are you accepting where you are right now, or resisting it?" },
  { quote: "This too shall pass.", author: "Persian Adage", reflection: "What current situation do you need to remind yourself is temporary?" },
  { quote: "The art of living is more like wrestling than dancing.", author: "Marcus Aurelius", reflection: "What are you wrestling with right now, and can you find grace in the struggle?" },
];

export function getDailyWisdom(): DailyWisdom {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return wisdomLibrary[dayOfYear % wisdomLibrary.length];
}

const INTENTIONS_KEY = "wv-intentions";
const RITUAL_PROGRESS_KEY = "wv-ritual-progress";

export interface IntentionEntry {
  date: string;
  word: string;
  morningGratitude: string[];
  eveningGratitude: string[];
  reflection: string;
}

export function getTodayIntention(): IntentionEntry | null {
  try {
    const raw = localStorage.getItem(INTENTIONS_KEY);
    const all: IntentionEntry[] = raw ? JSON.parse(raw) : [];
    const today = new Date().toISOString().split("T")[0];
    return all.find(e => e.date === today) || null;
  } catch { return null; }
}

export function saveIntention(entry: IntentionEntry) {
  try {
    const raw = localStorage.getItem(INTENTIONS_KEY);
    const all: IntentionEntry[] = raw ? JSON.parse(raw) : [];
    const idx = all.findIndex(e => e.date === entry.date);
    if (idx >= 0) all[idx] = entry; else all.push(entry);
    localStorage.setItem(INTENTIONS_KEY, JSON.stringify(all));
  } catch {}
}

export function getRitualStreak(): number {
  try {
    const raw = localStorage.getItem(RITUAL_PROGRESS_KEY);
    const data: { dates: string[] } = raw ? JSON.parse(raw) : { dates: [] };
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      if (data.dates.includes(ds)) streak++;
      else if (i > 0) break;
    }
    return streak;
  } catch { return 0; }
}

export function markRitualComplete() {
  try {
    const raw = localStorage.getItem(RITUAL_PROGRESS_KEY);
    const data: { dates: string[] } = raw ? JSON.parse(raw) : { dates: [] };
    const today = new Date().toISOString().split("T")[0];
    if (!data.dates.includes(today)) data.dates.push(today);
    localStorage.setItem(RITUAL_PROGRESS_KEY, JSON.stringify(data));
  } catch {}
}

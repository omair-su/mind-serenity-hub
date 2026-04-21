// Curated daily affirmations rotated through the dashboard hero quote ribbon.
// 30 lines — one per day of the month. Tone: gentle, modern, on-brand for Willow.

export interface Affirmation {
  text: string;
  author?: string;
}

export const affirmations: Affirmation[] = [
  { text: "I return to my breath, and my breath returns me to myself.", author: "Willow" },
  { text: "Stillness is not the absence of motion — it is the presence of attention." },
  { text: "Today I choose softness over urgency.", author: "Willow" },
  { text: "The mind is everything. What you think, you become.", author: "Buddha" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { text: "I do not have to earn my rest.", author: "Willow" },
  { text: "Quiet the mind, and the soul will speak.", author: "Ma Jaya Sati Bhagavati" },
  { text: "I am allowed to take up space, slowly and gently." },
  { text: "Each breath is a small homecoming.", author: "Willow" },
  { text: "The present moment is filled with joy. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
  { text: "I greet this day with an open and unhurried heart." },
  { text: "Almost everything will work again if you unplug it for a few minutes — including you.", author: "Anne Lamott" },
  { text: "I am the steady ground beneath my own weather.", author: "Willow" },
  { text: "Meditation is not about stopping thoughts, but recognising we are more than them.", author: "Arianna Huffington" },
  { text: "I choose to be where my feet are." },
  { text: "In the midst of movement and chaos, keep stillness inside of you.", author: "Deepak Chopra" },
  { text: "Today I trade hurry for presence.", author: "Willow" },
  { text: "Tension is who I think I should be. Relaxation is who I am.", author: "Chinese Proverb" },
  { text: "I am the sky. The mood is the weather.", author: "Pema Chödrön" },
  { text: "Small, sacred, daily — this is how a life is built." },
  { text: "Wherever you are, be all there.", author: "Jim Elliot" },
  { text: "I do not need to fix this moment. I need to feel it.", author: "Willow" },
  { text: "The quieter you become, the more you can hear.", author: "Ram Dass" },
  { text: "I let my breath be long, and my thoughts be brief." },
  { text: "Self-care is the fuel that allows your light to shine brightly.", author: "Unknown" },
  { text: "Today, I give myself permission to begin again." },
  { text: "What you seek is seeking you.", author: "Rumi" },
  { text: "I am rooted, and I am rising.", author: "Willow" },
  { text: "Be where you are, otherwise you will miss your life.", author: "Buddha" },
  { text: "Tonight I lay this day down with gratitude." },
];

export function getAffirmationsForToday(count = 3): Affirmation[] {
  const day = new Date().getDate(); // 1–31
  const start = (day - 1) % affirmations.length;
  const out: Affirmation[] = [];
  for (let i = 0; i < count; i++) {
    out.push(affirmations[(start + i) % affirmations.length]);
  }
  return out;
}

export function getAffirmationOfTheWeek(): Affirmation {
  const now = new Date();
  const oneJan = new Date(now.getFullYear(), 0, 1);
  const week = Math.floor(((now.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
  return affirmations[week % affirmations.length];
}

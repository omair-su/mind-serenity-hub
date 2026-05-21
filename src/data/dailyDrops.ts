// Daily Drop — a new 5-minute session every day, deterministically selected by
// day-of-year so every user on a given calendar day sees the same drop.
// Push-notified by send-daily-reminders edge function at the user's reminder time.

export interface DailyDrop {
  /** Stable slug used in localStorage + analytics. */
  id: string;
  title: string;
  /** 1-sentence teaser shown under the title on the card. */
  teaser: string;
  duration: string;
  /** App route this drop sends the user to. */
  href: string;
  /** Optional category chip. */
  category: string;
}

// A rotating pool of short, high-quality 5-minute sessions. Day-of-year %
// length picks today's drop. Add more entries any time — order is stable.
export const DAILY_DROPS: DailyDrop[] = [
  { id: "physio-sigh",        title: "Physiological Sigh",        teaser: "Reset your nervous system in two breaths.",      duration: "5 min", href: "/app/breathing",                              category: "Breathwork" },
  { id: "morning-light",      title: "Greet the Morning Light",   teaser: "A grounding scan to set the day's tone.",        duration: "5 min", href: "/app/rituals",                                category: "Morning" },
  { id: "sos-calm",           title: "SOS Calm",                  teaser: "A 5-minute panic interrupt for stressful days.", duration: "5 min", href: "/app/sos",                                    category: "Crisis" },
  { id: "box-breath",         title: "Box Breathing",             teaser: "Steady the heart with the SEAL pattern.",        duration: "5 min", href: "/app/programs/box-breathing-athletes",        category: "Focus" },
  { id: "gratitude-three",    title: "Three Gratitudes",          teaser: "Reframe the day with one minute of thanks.",     duration: "5 min", href: "/app/gratitude",                              category: "Gratitude" },
  { id: "humming-vagus",      title: "Humming for the Vagus",     teaser: "Tone the vagus nerve with your own voice.",      duration: "5 min", href: "/app/programs/vagus-nerve",                   category: "Somatic" },
  { id: "body-scan-short",    title: "5-Minute Body Scan",        teaser: "A quick visit to every region of the body.",     duration: "5 min", href: "/app/body-scan",                              category: "Mindfulness" },
  { id: "sleep-wind-down",    title: "Sleep Wind-Down",           teaser: "Four-seven-eight breath for fast sleep onset.",   duration: "5 min", href: "/app/sleep",                                 category: "Sleep" },
  { id: "evening-close",      title: "Close the Day",             teaser: "Set down what is done. Open space for rest.",    duration: "5 min", href: "/app/journal",                                category: "Evening" },
  { id: "affirmation-pulse",  title: "Affirmation Pulse",         teaser: "Three sentences to rewire the inner voice.",     duration: "5 min", href: "/app/affirmations",                           category: "Mindset" },
  { id: "focus-ignite",       title: "Focus Ignite",              teaser: "A pre-deep-work primer for ADHD brains.",        duration: "5 min", href: "/app/programs/adhd-focus-stack",              category: "Focus" },
  { id: "sound-528",          title: "528 Hz Heart Bath",         teaser: "Five minutes inside the love frequency.",        duration: "5 min", href: "/app/programs/sound-frequency",               category: "Sound" },
  { id: "walking-mindful",    title: "Mindful Walk",              teaser: "A five-minute walking meditation, indoors or out.", duration: "5 min", href: "/app/walking",                              category: "Movement" },
  { id: "cherry-blossom",     title: "Cherry-Blossom Pause",      teaser: "A cinematic 5-minute visual rest.",              duration: "5 min", href: "/app/video-library",                          category: "Visual" },
  { id: "grief-letter",       title: "A Letter to Today",         teaser: "A short, tender check-in with yourself.",        duration: "5 min", href: "/app/programs/grief-companion",               category: "Emotional" },
  { id: "cycle-check",        title: "Cycle Check-In",            teaser: "Tune practice to your phase in five minutes.",   duration: "5 min", href: "/app/programs/cycle-sync",                    category: "Cyclical" },
  { id: "ritual-bookend",     title: "Two-Anchor Ritual",         teaser: "Lock in a morning and evening micro-ritual.",    duration: "5 min", href: "/app/programs/ritual-pack",                   category: "Habits" },
  { id: "tactical-reset",     title: "Tactical Reset",            teaser: "Sixty seconds, three times, to come back online.", duration: "5 min", href: "/app/breathing",                            category: "Performance" },
  { id: "ocean-bath",         title: "Ocean Sound Bath",          teaser: "Let waves do the regulating for you.",           duration: "5 min", href: "/app/sound-bath",                             category: "Sound" },
  { id: "loving-kindness",    title: "Loving Kindness",           teaser: "Five minutes of metta — for self and others.",   duration: "5 min", href: "/app/library",                                category: "Compassion" },
];

/** Returns today's drop based on local day-of-year. Stable across the day. */
export function getTodaysDrop(now: Date = new Date()): DailyDrop {
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return DAILY_DROPS[dayOfYear % DAILY_DROPS.length];
}

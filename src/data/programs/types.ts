// Shared types for multi-day wellness mini-programs (Vagus Nerve Reset, ADHD Focus
// Stack, Grief Companion, etc.). One interface so future programs slot in without
// refactoring the program day page or sidebar.

export interface ProgramDay {
  /** 1-based day number inside this program */
  day: number;
  title: string;
  /** Display duration, e.g. "5 min" */
  duration: string;
  /** Technique label shown as a chip on the timeline */
  technique: string;
  /** 1-sentence science blurb shown when the day expands */
  whyItWorks: string;
  /** Full narration script piped to ElevenLabs */
  practice: string;
  /** Optional poster image URL for the day card */
  posterUrl?: string;
}

export interface MiniProgram {
  /** Stable slug used in routes and localStorage */
  id: string;
  title: string;
  /** Short marketing tagline */
  tagline: string;
  /** Full marketing description */
  description: string;
  /** Category label shown on hero */
  category: string;
  /** Cinematic video backdrop URL (looped) used on the program hero + day pages */
  videoBackdrop: string;
  /** Poster image fallback for the video */
  posterUrl: string;
  /** Number of free days at the start (default 1) */
  freeDays: number;
  /** Suggested ElevenLabs voice for this program's narration */
  voice: "sarah" | "matilda" | "charlie" | "george";
  /** Ordered list of days */
  days: ProgramDay[];
}

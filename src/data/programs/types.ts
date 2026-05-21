// Shared types for multi-day wellness mini-programs (Vagus Nerve Reset, ADHD Focus
// Stack, Grief Companion, etc.). One interface so future programs slot in without
// refactoring the program day page or sidebar.

import type { BrandedVideoSlot } from "@/data/brandedVideos";

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
  /** Branded-video slot for this day's cinematic backdrop */
  videoSlot?: BrandedVideoSlot;
  /** Optional poster image URL for the day card (legacy fallback) */
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
  /** Branded-video slot for the program hero backdrop */
  heroVideoSlot?: BrandedVideoSlot;
  /** Cinematic video backdrop URL (looped) — fallback until heroVideoSlot uploads */
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

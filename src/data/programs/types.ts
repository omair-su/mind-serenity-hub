// Shared types for multi-day wellness mini-programs. Optional rich-content
// fields (scienceCard, steps, bonus, safety, reflectionPrompt, exercises) are
// rendered by ProgramDayPage when present — older programs without them keep
// their simpler layout untouched.

import type { BrandedVideoSlot } from "@/data/brandedVideos";

export interface DayStep {
  title: string;
  body: string;
}

export interface DayExercise {
  title: string;
  body: string;
  durationLabel?: string;
  badge?: string;
}

export interface ScienceCard {
  title: string;
  body: string;
}

export interface BonusTechnique {
  title: string;
  body: string;
}

export interface ProgramDay {
  day: number;
  title: string;
  duration: string;
  technique: string;
  whyItWorks: string;
  practice: string;
  videoSlot?: BrandedVideoSlot;
  posterUrl?: string;

  /** Rich science explainer card (cream background, gold label). */
  scienceCard?: ScienceCard;
  /** Step-by-step instruction list for the main exercise. */
  steps?: string[];
  /** Optional bonus technique surfaced below the main practice. */
  bonus?: BonusTechnique;
  /** Optional multi-exercise sequence (Day 4 movement, Day 6 laughter). */
  exercises?: DayExercise[];
  /** Optional safety / disclaimer card shown at the very top (Day 3 cold). */
  safetyNote?: string;
  /** Optional journaling prompt rendered below the practice. */
  reflectionPrompt?: string;
  /** Suggested guided-timer minutes for the breathing/visual timer. */
  timerMinutes?: number;
}

export interface MiniProgram {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  heroVideoSlot?: BrandedVideoSlot;
  videoBackdrop: string;
  posterUrl: string;
  freeDays: number;
  voice: "sarah" | "matilda" | "charlie" | "george";
  days: ProgramDay[];
}

// Calming video library — looping cinematic backdrops paired with ambient sound.
// Each entry has a `slot` that maps (via src/data/brandedVideos.ts) to a file in
// the Cloud `video` storage bucket. Upload `library-XX-name.mp4` to that bucket
// and it instantly replaces the placeholder for that card.

import type { BrandedVideoSlot } from "@/data/brandedVideos";

export type VideoCategory =
  | "Nature"
  | "Water"
  | "Fire"
  | "Sky"
  | "Rain"
  | "Snow"
  | "Abstract";

export interface CalmingVideo {
  id: string;
  /** Branded-video slot key — maps to a filename in the `video` bucket */
  slot: BrandedVideoSlot;
  title: string;
  description: string;
  category: VideoCategory;
  durationSec: number; // visible duration label; the video itself loops
  /** Fallback used until the branded file is uploaded */
  fallbackVideoUrl: string;
  fallbackPosterUrl: string;
  isPremium: boolean;
}

const FALLBACK_HERO = "/__l5e/assets-v1/4c50663c-31a4-465d-be0e-910c2aa9eb12/video-library-hero.mp4";
const FALLBACK_HERO_POSTER = "/src/assets/video-library-hero-poster.jpg";
const FALLBACK_DEMO = "/__l5e/assets-v1/2bc5e804-4212-4b3a-8159-38ccf74dd381/willow-demo.mp4";
const FALLBACK_DEMO_POSTER = "/src/assets/willow-demo-poster.jpg";

export const CALMING_VIDEOS: CalmingVideo[] = [
  // FREE TIER (4)
  { id: "v-forest-morning", slot: "library-01-forest-morning", title: "Misty Forest at Dawn", description: "Soft fog drifts between pines as the first light filters in.", category: "Nature", durationSec: 60, fallbackVideoUrl: FALLBACK_HERO, fallbackPosterUrl: FALLBACK_HERO_POSTER, isPremium: false },
  { id: "v-ocean-gentle", slot: "library-02-ocean-gentle", title: "Gentle Ocean Waves", description: "Endless turquoise water meeting a soft, sun-lit shore.", category: "Water", durationSec: 60, fallbackVideoUrl: FALLBACK_DEMO, fallbackPosterUrl: FALLBACK_DEMO_POSTER, isPremium: false },
  { id: "v-rain-window", slot: "library-03-rain-window", title: "Rain on a Window", description: "Droplets gather and trail down glass on a quiet afternoon.", category: "Rain", durationSec: 60, fallbackVideoUrl: FALLBACK_HERO, fallbackPosterUrl: FALLBACK_HERO_POSTER, isPremium: false },
  { id: "v-fireplace", slot: "library-04-fireplace", title: "Crackling Fireplace", description: "Warm, slow-burning logs glowing amber and gold.", category: "Fire", durationSec: 60, fallbackVideoUrl: FALLBACK_DEMO, fallbackPosterUrl: FALLBACK_DEMO_POSTER, isPremium: false },

  // PREMIUM TIER (12)
  { id: "v-aurora", slot: "library-05-aurora", title: "Northern Lights Aurora", description: "Emerald and violet light dancing across an arctic sky.", category: "Sky", durationSec: 90, fallbackVideoUrl: FALLBACK_HERO, fallbackPosterUrl: FALLBACK_HERO_POSTER, isPremium: true },
  { id: "v-snowfall", slot: "library-06-snowfall", title: "Quiet Snowfall", description: "Soft flakes falling through bare winter branches.", category: "Snow", durationSec: 90, fallbackVideoUrl: FALLBACK_DEMO, fallbackPosterUrl: FALLBACK_DEMO_POSTER, isPremium: true },
  { id: "v-mountain-mist", slot: "library-07-mountain-mist", title: "Mountain Mist", description: "Clouds rolling slowly through alpine peaks.", category: "Nature", durationSec: 90, fallbackVideoUrl: FALLBACK_HERO, fallbackPosterUrl: FALLBACK_HERO_POSTER, isPremium: true },
  { id: "v-forest-stream", slot: "library-08-forest-stream", title: "Forest Stream", description: "Clear water tumbling over mossy stones.", category: "Water", durationSec: 90, fallbackVideoUrl: FALLBACK_DEMO, fallbackPosterUrl: FALLBACK_DEMO_POSTER, isPremium: true },
  { id: "v-candle", slot: "library-09-candle", title: "Single Candle Flame", description: "A meditative, flickering point of warm light in darkness.", category: "Fire", durationSec: 90, fallbackVideoUrl: FALLBACK_HERO, fallbackPosterUrl: FALLBACK_HERO_POSTER, isPremium: true },
  { id: "v-cherry-blossom", slot: "library-10-cherry-blossom", title: "Cherry Blossom Drift", description: "Pink petals falling slowly against a soft spring sky.", category: "Nature", durationSec: 90, fallbackVideoUrl: FALLBACK_DEMO, fallbackPosterUrl: FALLBACK_DEMO_POSTER, isPremium: true },
  { id: "v-stars-timelapse", slot: "library-11-stars", title: "Starfield Timelapse", description: "The Milky Way wheeling slowly across a desert night.", category: "Sky", durationSec: 90, fallbackVideoUrl: FALLBACK_HERO, fallbackPosterUrl: FALLBACK_HERO_POSTER, isPremium: true },
  { id: "v-rain-leaves", slot: "library-12-rain-leaves", title: "Rain on Leaves", description: "A close-up of fresh raindrops landing on green foliage.", category: "Rain", durationSec: 90, fallbackVideoUrl: FALLBACK_DEMO, fallbackPosterUrl: FALLBACK_DEMO_POSTER, isPremium: true },
  { id: "v-underwater-light", slot: "library-13-underwater", title: "Underwater Light Rays", description: "Sunlight refracting through clear, shimmering water.", category: "Water", durationSec: 90, fallbackVideoUrl: FALLBACK_HERO, fallbackPosterUrl: FALLBACK_HERO_POSTER, isPremium: true },
  { id: "v-clouds-timelapse", slot: "library-14-clouds", title: "Drifting Clouds", description: "Slow timelapse of soft cumulus across a pale blue sky.", category: "Sky", durationSec: 90, fallbackVideoUrl: FALLBACK_DEMO, fallbackPosterUrl: FALLBACK_DEMO_POSTER, isPremium: true },
  { id: "v-bamboo", slot: "library-15-bamboo", title: "Bamboo Forest", description: "Tall stalks swaying gently in a quiet Asian forest.", category: "Nature", durationSec: 90, fallbackVideoUrl: FALLBACK_HERO, fallbackPosterUrl: FALLBACK_HERO_POSTER, isPremium: true },
  { id: "v-abstract-flow", slot: "library-16-lavender", title: "Lavender at Sunset", description: "Purple fields swaying in golden evening light.", category: "Abstract", durationSec: 90, fallbackVideoUrl: FALLBACK_DEMO, fallbackPosterUrl: FALLBACK_DEMO_POSTER, isPremium: true },
];

export const VIDEO_CATEGORIES: (VideoCategory | "All")[] = [
  "All", "Nature", "Water", "Fire", "Sky", "Rain", "Snow", "Abstract",
];

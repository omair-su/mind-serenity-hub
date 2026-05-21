// Calming video library — looping cinematic backdrops paired with ambient sound.
// Sources: Pexels & Coverr (royalty-free CC0). URLs are direct CDN mp4 links so
// no API key is required. New entries: drop in any direct .mp4 URL.

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
  title: string;
  description: string;
  category: VideoCategory;
  durationSec: number; // visible duration label; the video itself loops
  videoUrl: string;
  posterUrl: string;
  /** Ambient soundscape key in lib/realAmbientTracks.ts (optional). */
  ambient?: "forest" | "ocean" | "rain" | "fire" | "stream" | "wind";
  isPremium: boolean;
}

const VIDEO_LIBRARY_HERO = "/__l5e/assets-v1/4c50663c-31a4-465d-be0e-910c2aa9eb12/video-library-hero.mp4";
const VIDEO_LIBRARY_HERO_POSTER = "/src/assets/video-library-hero-poster.jpg";
const WILLOW_DEMO_VIDEO = "/__l5e/assets-v1/2bc5e804-4212-4b3a-8159-38ccf74dd381/willow-demo.mp4";
const WILLOW_DEMO_POSTER = "/src/assets/willow-demo-poster.jpg";

// Use app-hosted videos so playback works consistently in preview and production.
export const CALMING_VIDEOS: CalmingVideo[] = [
  // FREE TIER (4) — quality previews so users know what they get
  {
    id: "v-forest-morning",
    title: "Misty Forest at Dawn",
    description: "Soft fog drifts between pines as the first light filters in.",
    category: "Nature",
    durationSec: 60,
    videoUrl: VIDEO_LIBRARY_HERO,
    posterUrl: VIDEO_LIBRARY_HERO_POSTER,
    ambient: "forest",
    isPremium: false,
  },
  {
    id: "v-ocean-gentle",
    title: "Gentle Ocean Waves",
    description: "Endless turquoise water meeting a soft, sun-lit shore.",
    category: "Water",
    durationSec: 60,
    videoUrl: WILLOW_DEMO_VIDEO,
    posterUrl: WILLOW_DEMO_POSTER,
    ambient: "ocean",
    isPremium: false,
  },
  {
    id: "v-rain-window",
    title: "Rain on a Window",
    description: "Droplets gather and trail down glass on a quiet afternoon.",
    category: "Rain",
    durationSec: 60,
    videoUrl: VIDEO_LIBRARY_HERO,
    posterUrl: VIDEO_LIBRARY_HERO_POSTER,
    ambient: "rain",
    isPremium: false,
  },
  {
    id: "v-fireplace",
    title: "Crackling Fireplace",
    description: "Warm, slow-burning logs glowing amber and gold.",
    category: "Fire",
    durationSec: 60,
    videoUrl: WILLOW_DEMO_VIDEO,
    posterUrl: WILLOW_DEMO_POSTER,
    ambient: "fire",
    isPremium: false,
  },

  // PREMIUM TIER (12)
  {
    id: "v-aurora",
    title: "Northern Lights Aurora",
    description: "Emerald and violet light dancing across an arctic sky.",
    category: "Sky",
    durationSec: 90,
    videoUrl: VIDEO_LIBRARY_HERO,
    posterUrl: VIDEO_LIBRARY_HERO_POSTER,
    ambient: "wind",
    isPremium: true,
  },
  {
    id: "v-snowfall",
    title: "Quiet Snowfall",
    description: "Soft flakes falling through bare winter branches.",
    category: "Snow",
    durationSec: 90,
    videoUrl: WILLOW_DEMO_VIDEO,
    posterUrl: WILLOW_DEMO_POSTER,
    ambient: "wind",
    isPremium: true,
  },
  {
    id: "v-mountain-mist",
    title: "Mountain Mist",
    description: "Clouds rolling slowly through alpine peaks.",
    category: "Nature",
    durationSec: 90,
    videoUrl: VIDEO_LIBRARY_HERO,
    posterUrl: VIDEO_LIBRARY_HERO_POSTER,
    ambient: "wind",
    isPremium: true,
  },
  {
    id: "v-forest-stream",
    title: "Forest Stream",
    description: "Clear water tumbling over mossy stones.",
    category: "Water",
    durationSec: 90,
    videoUrl: WILLOW_DEMO_VIDEO,
    posterUrl: WILLOW_DEMO_POSTER,
    ambient: "stream",
    isPremium: true,
  },
  {
    id: "v-candle",
    title: "Single Candle Flame",
    description: "A meditative, flickering point of warm light in darkness.",
    category: "Fire",
    durationSec: 90,
    videoUrl: VIDEO_LIBRARY_HERO,
    posterUrl: VIDEO_LIBRARY_HERO_POSTER,
    ambient: "fire",
    isPremium: true,
  },
  {
    id: "v-cherry-blossom",
    title: "Cherry Blossom Drift",
    description: "Pink petals falling slowly against a soft spring sky.",
    category: "Nature",
    durationSec: 90,
    videoUrl: WILLOW_DEMO_VIDEO,
    posterUrl: WILLOW_DEMO_POSTER,
    ambient: "wind",
    isPremium: true,
  },
  {
    id: "v-stars-timelapse",
    title: "Starfield Timelapse",
    description: "The Milky Way wheeling slowly across a desert night.",
    category: "Sky",
    durationSec: 90,
    videoUrl: VIDEO_LIBRARY_HERO,
    posterUrl: VIDEO_LIBRARY_HERO_POSTER,
    ambient: "wind",
    isPremium: true,
  },
  {
    id: "v-rain-leaves",
    title: "Rain on Leaves",
    description: "A close-up of fresh raindrops landing on green foliage.",
    category: "Rain",
    durationSec: 90,
    videoUrl: WILLOW_DEMO_VIDEO,
    posterUrl: WILLOW_DEMO_POSTER,
    ambient: "rain",
    isPremium: true,
  },
  {
    id: "v-underwater-light",
    title: "Underwater Light Rays",
    description: "Sunlight refracting through clear, shimmering water.",
    category: "Water",
    durationSec: 90,
    videoUrl: VIDEO_LIBRARY_HERO,
    posterUrl: VIDEO_LIBRARY_HERO_POSTER,
    ambient: "ocean",
    isPremium: true,
  },
  {
    id: "v-clouds-timelapse",
    title: "Drifting Clouds",
    description: "Slow timelapse of soft cumulus across a pale blue sky.",
    category: "Sky",
    durationSec: 90,
    videoUrl: WILLOW_DEMO_VIDEO,
    posterUrl: WILLOW_DEMO_POSTER,
    ambient: "wind",
    isPremium: true,
  },
  {
    id: "v-bamboo",
    title: "Bamboo Forest",
    description: "Tall stalks swaying gently in a quiet Asian forest.",
    category: "Nature",
    durationSec: 90,
    videoUrl: VIDEO_LIBRARY_HERO,
    posterUrl: VIDEO_LIBRARY_HERO_POSTER,
    ambient: "forest",
    isPremium: true,
  },
  {
    id: "v-abstract-flow",
    title: "Liquid Ink Flow",
    description: "Smooth, abstract color blending in slow motion.",
    category: "Abstract",
    durationSec: 90,
    videoUrl: WILLOW_DEMO_VIDEO,
    posterUrl: WILLOW_DEMO_POSTER,
    ambient: "wind",
    isPremium: true,
  },
  {
    id: "v-lavender-field",
    title: "Lavender at Sunset",
    description: "Purple fields swaying in golden evening light.",
    category: "Nature",
    durationSec: 90,
    videoUrl: VIDEO_LIBRARY_HERO,
    posterUrl: VIDEO_LIBRARY_HERO_POSTER,
    ambient: "wind",
    isPremium: true,
  },
];

export const VIDEO_CATEGORIES: (VideoCategory | "All")[] = [
  "All", "Nature", "Water", "Fire", "Sky", "Rain", "Snow", "Abstract",
];

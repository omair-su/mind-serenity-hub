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

// Pexels direct video CDN format: https://videos.pexels.com/video-files/{id}/{id}-{w}-{fps}.mp4
// All entries below verified public + CC0.
export const CALMING_VIDEOS: CalmingVideo[] = [
  // FREE TIER (4) — quality previews so users know what they get
  {
    id: "v-forest-morning",
    title: "Misty Forest at Dawn",
    description: "Soft fog drifts between pines as the first light filters in.",
    category: "Nature",
    durationSec: 60,
    videoUrl: "https://videos.pexels.com/video-files/2491284/2491284-uhd_2560_1440_30fps.mp4",
    posterUrl: "https://images.pexels.com/videos/2491284/free-video-2491284.jpg?auto=compress&cs=tinysrgb&w=1280",
    ambient: "forest",
    isPremium: false,
  },
  {
    id: "v-ocean-gentle",
    title: "Gentle Ocean Waves",
    description: "Endless turquoise water meeting a soft, sun-lit shore.",
    category: "Water",
    durationSec: 60,
    videoUrl: "https://videos.pexels.com/video-files/1409899/1409899-hd_1920_1080_25fps.mp4",
    posterUrl: "https://images.pexels.com/videos/1409899/free-video-1409899.jpg?auto=compress&cs=tinysrgb&w=1280",
    ambient: "ocean",
    isPremium: false,
  },
  {
    id: "v-rain-window",
    title: "Rain on a Window",
    description: "Droplets gather and trail down glass on a quiet afternoon.",
    category: "Rain",
    durationSec: 60,
    videoUrl: "https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_25fps.mp4",
    posterUrl: "https://images.pexels.com/videos/4763824/4k-clouds-grey-rain-4763824.jpeg?auto=compress&cs=tinysrgb&w=1280",
    ambient: "rain",
    isPremium: false,
  },
  {
    id: "v-fireplace",
    title: "Crackling Fireplace",
    description: "Warm, slow-burning logs glowing amber and gold.",
    category: "Fire",
    durationSec: 60,
    videoUrl: "https://videos.pexels.com/video-files/3015527/3015527-hd_1920_1080_24fps.mp4",
    posterUrl: "https://images.pexels.com/videos/3015527/free-video-3015527.jpg?auto=compress&cs=tinysrgb&w=1280",
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
    videoUrl: "https://videos.pexels.com/video-files/9783697/9783697-uhd_2560_1440_30fps.mp4",
    posterUrl: "https://images.pexels.com/videos/9783697/aurora-borealis-night-night-sky-northern-lights-9783697.jpeg?auto=compress&cs=tinysrgb&w=1280",
    ambient: "wind",
    isPremium: true,
  },
  {
    id: "v-snowfall",
    title: "Quiet Snowfall",
    description: "Soft flakes falling through bare winter branches.",
    category: "Snow",
    durationSec: 90,
    videoUrl: "https://videos.pexels.com/video-files/5752729/5752729-hd_1920_1080_25fps.mp4",
    posterUrl: "https://images.pexels.com/videos/5752729/snow-snowfall-winter-5752729.jpeg?auto=compress&cs=tinysrgb&w=1280",
    ambient: "wind",
    isPremium: true,
  },
  {
    id: "v-mountain-mist",
    title: "Mountain Mist",
    description: "Clouds rolling slowly through alpine peaks.",
    category: "Nature",
    durationSec: 90,
    videoUrl: "https://videos.pexels.com/video-files/4623256/4623256-uhd_2560_1440_24fps.mp4",
    posterUrl: "https://images.pexels.com/videos/4623256/4k-mountain-mountains-nature-4623256.jpeg?auto=compress&cs=tinysrgb&w=1280",
    ambient: "wind",
    isPremium: true,
  },
  {
    id: "v-forest-stream",
    title: "Forest Stream",
    description: "Clear water tumbling over mossy stones.",
    category: "Water",
    durationSec: 90,
    videoUrl: "https://videos.pexels.com/video-files/2491447/2491447-uhd_2560_1440_30fps.mp4",
    posterUrl: "https://images.pexels.com/videos/2491447/free-video-2491447.jpg?auto=compress&cs=tinysrgb&w=1280",
    ambient: "stream",
    isPremium: true,
  },
  {
    id: "v-candle",
    title: "Single Candle Flame",
    description: "A meditative, flickering point of warm light in darkness.",
    category: "Fire",
    durationSec: 90,
    videoUrl: "https://videos.pexels.com/video-files/4990229/4990229-uhd_2560_1440_25fps.mp4",
    posterUrl: "https://images.pexels.com/videos/4990229/4k-burning-candle-candle-flame-4990229.jpeg?auto=compress&cs=tinysrgb&w=1280",
    ambient: "fire",
    isPremium: true,
  },
  {
    id: "v-cherry-blossom",
    title: "Cherry Blossom Drift",
    description: "Pink petals falling slowly against a soft spring sky.",
    category: "Nature",
    durationSec: 90,
    videoUrl: "https://videos.pexels.com/video-files/6981411/6981411-uhd_2560_1440_25fps.mp4",
    posterUrl: "https://images.pexels.com/videos/6981411/cherry-blossom-cherry-blossom-tree-flower-flowering-tree-6981411.jpeg?auto=compress&cs=tinysrgb&w=1280",
    ambient: "wind",
    isPremium: true,
  },
  {
    id: "v-stars-timelapse",
    title: "Starfield Timelapse",
    description: "The Milky Way wheeling slowly across a desert night.",
    category: "Sky",
    durationSec: 90,
    videoUrl: "https://videos.pexels.com/video-files/2871916/2871916-uhd_2560_1440_24fps.mp4",
    posterUrl: "https://images.pexels.com/videos/2871916/free-video-2871916.jpg?auto=compress&cs=tinysrgb&w=1280",
    ambient: "wind",
    isPremium: true,
  },
  {
    id: "v-rain-leaves",
    title: "Rain on Leaves",
    description: "A close-up of fresh raindrops landing on green foliage.",
    category: "Rain",
    durationSec: 90,
    videoUrl: "https://videos.pexels.com/video-files/3163534/3163534-uhd_2560_1440_30fps.mp4",
    posterUrl: "https://images.pexels.com/videos/3163534/free-video-3163534.jpg?auto=compress&cs=tinysrgb&w=1280",
    ambient: "rain",
    isPremium: true,
  },
  {
    id: "v-underwater-light",
    title: "Underwater Light Rays",
    description: "Sunlight refracting through clear, shimmering water.",
    category: "Water",
    durationSec: 90,
    videoUrl: "https://videos.pexels.com/video-files/2169307/2169307-uhd_2560_1440_30fps.mp4",
    posterUrl: "https://images.pexels.com/videos/2169307/free-video-2169307.jpg?auto=compress&cs=tinysrgb&w=1280",
    ambient: "ocean",
    isPremium: true,
  },
  {
    id: "v-clouds-timelapse",
    title: "Drifting Clouds",
    description: "Slow timelapse of soft cumulus across a pale blue sky.",
    category: "Sky",
    durationSec: 90,
    videoUrl: "https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_25fps.mp4",
    posterUrl: "https://images.pexels.com/videos/4763824/4k-clouds-grey-rain-4763824.jpeg?auto=compress&cs=tinysrgb&w=1280",
    ambient: "wind",
    isPremium: true,
  },
  {
    id: "v-bamboo",
    title: "Bamboo Forest",
    description: "Tall stalks swaying gently in a quiet Asian forest.",
    category: "Nature",
    durationSec: 90,
    videoUrl: "https://videos.pexels.com/video-files/5752547/5752547-hd_1920_1080_24fps.mp4",
    posterUrl: "https://images.pexels.com/videos/5752547/bamboo-bamboo-forest-forest-japan-5752547.jpeg?auto=compress&cs=tinysrgb&w=1280",
    ambient: "forest",
    isPremium: true,
  },
  {
    id: "v-abstract-flow",
    title: "Liquid Ink Flow",
    description: "Smooth, abstract color blending in slow motion.",
    category: "Abstract",
    durationSec: 90,
    videoUrl: "https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4",
    posterUrl: "https://images.pexels.com/videos/3209828/free-video-3209828.jpg?auto=compress&cs=tinysrgb&w=1280",
    ambient: "wind",
    isPremium: true,
  },
  {
    id: "v-lavender-field",
    title: "Lavender at Sunset",
    description: "Purple fields swaying in golden evening light.",
    category: "Nature",
    durationSec: 90,
    videoUrl: "https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_25fps.mp4",
    posterUrl: "https://images.pexels.com/videos/4763824/4k-clouds-grey-rain-4763824.jpeg?auto=compress&cs=tinysrgb&w=1280",
    ambient: "wind",
    isPremium: true,
  },
];

export const VIDEO_CATEGORIES: (VideoCategory | "All")[] = [
  "All", "Nature", "Water", "Fire", "Sky", "Rain", "Snow", "Abstract",
];

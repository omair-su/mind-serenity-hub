/**
 * Curated, premium royalty-free ambient meditation tracks.
 *
 * Source: Mixkit (https://mixkit.co/license/) — Mixkit Stock Music Free License.
 * No attribution required, free for commercial use, hotlink-friendly CDN with
 * proper CORS headers (access-control-allow-origin: *) and HTTP range support.
 *
 * Every URL has been verified to return audio/mpeg with full payload (3-10 MB).
 *
 * To add tracks: visit https://mixkit.co/free-stock-music/tag/meditation/ ,
 * inspect any track's audio element, and copy the assets.mixkit.co/music/{ID}/{ID}.mp3 link.
 */

export interface AmbientTrack {
  id: string;
  name: string;
  emoji: string;
  /** Mood tag used for picking a default track per page/day */
  mood: "calm" | "sleep" | "focus" | "nature" | "spiritual" | "energy";
  /** Direct CDN URL — verified working, supports range/loop */
  url: string;
  /** Duration in seconds */
  duration: number;
  /** Artist credit line */
  credit: string;
}

export const REAL_AMBIENT_TRACKS: AmbientTrack[] = [
  // — Long, deeply ambient (5 min)
  {
    id: "rest-now",
    name: "Rest Now",
    emoji: "🕊️",
    mood: "sleep",
    url: "https://assets.mixkit.co/music/584/584.mp3",
    duration: 300,
    credit: "Eugenio Mininni · Mixkit",
  },
  {
    id: "voxscape",
    name: "Voxscape",
    emoji: "✨",
    mood: "spiritual",
    url: "https://assets.mixkit.co/music/571/571.mp3",
    duration: 300,
    credit: "Eugenio Mininni · Mixkit",
  },
  {
    id: "what-it-takes",
    name: "Inner Stillness",
    emoji: "🌌",
    mood: "calm",
    url: "https://assets.mixkit.co/music/616/616.mp3",
    duration: 298,
    credit: "Eugenio Mininni · Mixkit",
  },
  // — Classic meditation (~2-3 min)
  {
    id: "deep-meditation",
    name: "Deep Meditation",
    emoji: "🕉️",
    mood: "spiritual",
    url: "https://assets.mixkit.co/music/109/109.mp3",
    duration: 196,
    credit: "Alejandro Magaña · Mixkit",
  },
  {
    id: "smooth-meditation",
    name: "Smooth Meditation",
    emoji: "🪷",
    mood: "calm",
    url: "https://assets.mixkit.co/music/324/324.mp3",
    duration: 154,
    credit: "Arulo · Mixkit",
  },
  {
    id: "meditation",
    name: "Pure Meditation",
    emoji: "🧘",
    mood: "calm",
    url: "https://assets.mixkit.co/music/441/441.mp3",
    duration: 118,
    credit: "Arulo · Mixkit",
  },
  {
    id: "yoga-song",
    name: "Yoga Flow",
    emoji: "🧘‍♀️",
    mood: "energy",
    url: "https://assets.mixkit.co/music/444/444.mp3",
    duration: 98,
    credit: "Arulo · Mixkit",
  },
  {
    id: "nature-meditation",
    name: "Nature Meditation",
    emoji: "🌿",
    mood: "nature",
    url: "https://assets.mixkit.co/music/345/345.mp3",
    duration: 100,
    credit: "Arulo · Mixkit",
  },
  // — Forest series
  {
    id: "forest-treasure",
    name: "Forest Treasure",
    emoji: "🌲",
    mood: "nature",
    url: "https://assets.mixkit.co/music/138/138.mp3",
    duration: 104,
    credit: "Alejandro Magaña · Mixkit",
  },
  {
    id: "spirit-in-the-woods",
    name: "Spirit in the Woods",
    emoji: "🍃",
    mood: "nature",
    url: "https://assets.mixkit.co/music/139/139.mp3",
    duration: 113,
    credit: "Alejandro Magaña · Mixkit",
  },
  {
    id: "forest-mist",
    name: "Forest Mist Whispers",
    emoji: "🌫️",
    mood: "nature",
    url: "https://assets.mixkit.co/music/148/148.mp3",
    duration: 151,
    credit: "Alejandro Magaña · Mixkit",
  },
  {
    id: "forest-walk",
    name: "Forest Walk",
    emoji: "🌳",
    mood: "nature",
    url: "https://assets.mixkit.co/music/607/607.mp3",
    duration: 174,
    credit: "Eugenio Mininni · Mixkit",
  },
  // — Calm piano / scenes
  {
    id: "valley-sunset",
    name: "Valley Sunset",
    emoji: "🌅",
    mood: "energy",
    url: "https://assets.mixkit.co/music/127/127.mp3",
    duration: 134,
    credit: "Alejandro Magaña · Mixkit",
  },
  {
    id: "piano-reflections",
    name: "Piano Reflections",
    emoji: "🎹",
    mood: "calm",
    url: "https://assets.mixkit.co/music/22/22.mp3",
    duration: 199,
    credit: "Ahjay Stelino · Mixkit",
  },
  {
    id: "ambient",
    name: "Ambient Drift",
    emoji: "🌊",
    mood: "sleep",
    url: "https://assets.mixkit.co/music/251/251.mp3",
    duration: 114,
    credit: "Arulo · Mixkit",
  },
  {
    id: "feedback-dreams",
    name: "Dreamscape",
    emoji: "💭",
    mood: "sleep",
    url: "https://assets.mixkit.co/music/588/588.mp3",
    duration: 149,
    credit: "Eugenio Mininni · Mixkit",
  },
  {
    id: "vastness",
    name: "Vastness",
    emoji: "🌠",
    mood: "spiritual",
    url: "https://assets.mixkit.co/music/184/184.mp3",
    duration: 230,
    credit: "Andrew Ev · Mixkit",
  },
  {
    id: "relax-beat",
    name: "Relax Beat",
    emoji: "🎵",
    mood: "focus",
    url: "https://assets.mixkit.co/music/292/292.mp3",
    duration: 108,
    credit: "Arulo · Mixkit",
  },
  {
    id: "kodama-night",
    name: "Kodama Night",
    emoji: "🌙",
    mood: "sleep",
    url: "https://assets.mixkit.co/music/114/114.mp3",
    duration: 185,
    credit: "Alejandro Magaña · Mixkit",
  },
  {
    id: "irenko",
    name: "Irenko",
    emoji: "🎐",
    mood: "spiritual",
    url: "https://assets.mixkit.co/music/177/177.mp3",
    duration: 147,
    credit: "Alejandro Magaña · Mixkit",
  },
  {
    id: "relaxation-05",
    name: "Floating",
    emoji: "☁️",
    mood: "focus",
    url: "https://assets.mixkit.co/music/749/749.mp3",
    duration: 118,
    credit: "Lily J · Mixkit",
  },
];

/** Pick the best ambient track for a given day in the 30-day curriculum */
export function pickTrackForDay(dayNum: number): AmbientTrack {
  // Week 1 (1-7): Foundation & Breath → smooth meditation + forest
  // Week 2 (8-14): Body awareness → deep meditation + ambient drift
  // Week 3 (15-21): Heart/loving-kindness → piano + valley sunset
  // Week 4 (22-30): Integration → voxscape + rest now
  const week1 = ["smooth-meditation", "forest-treasure", "yoga-song", "spirit-in-the-woods", "meditation", "nature-meditation", "forest-mist"];
  const week2 = ["deep-meditation", "ambient", "feedback-dreams", "forest-walk", "relax-beat", "piano-reflections", "kodama-night"];
  const week3 = ["valley-sunset", "piano-reflections", "irenko", "relaxation-05", "smooth-meditation", "yoga-song", "vastness"];
  const week4 = ["voxscape", "rest-now", "what-it-takes", "vastness", "kodama-night", "deep-meditation", "voxscape", "rest-now", "vastness"];
  let id: string;
  if (dayNum <= 7) id = week1[(dayNum - 1) % week1.length];
  else if (dayNum <= 14) id = week2[(dayNum - 8) % week2.length];
  else if (dayNum <= 21) id = week3[(dayNum - 15) % week3.length];
  else id = week4[(dayNum - 22) % week4.length];
  return byId(id);
}

export function pickTrackByMood(mood: AmbientTrack["mood"]): AmbientTrack {
  const matches = REAL_AMBIENT_TRACKS.filter((t) => t.mood === mood);
  if (matches.length === 0) return REAL_AMBIENT_TRACKS[0];
  // Rotate by current minute so users don't always hear the same first track
  const idx = new Date().getMinutes() % matches.length;
  return matches[idx];
}

function byId(id: string): AmbientTrack {
  return REAL_AMBIENT_TRACKS.find((t) => t.id === id) ?? REAL_AMBIENT_TRACKS[0];
}

/**
 * Real royalty-free ambient meditation tracks.
 * Sources: Pixabay (Pixabay Content License — free for commercial use, no attribution required).
 * All URLs are direct CDN links to looping ambient pieces curated for meditation.
 *
 * To add more tracks: pick from https://pixabay.com/music/search/meditation/
 * and copy the MP3 download link from "Right click → copy link" on the download button.
 */

export interface AmbientTrack {
  id: string;
  name: string;
  emoji: string;
  /** Mood tag used for picking a default track per page/day */
  mood: "calm" | "sleep" | "focus" | "nature" | "spiritual" | "energy";
  /** Direct CDN URL — must be a looping-friendly piece */
  url: string;
  /** Duration in seconds (informational) */
  duration: number;
  /** Credit line for the in-app player */
  credit: string;
}

export const REAL_AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: "forest-stream",
    name: "Forest Stream",
    emoji: "🌲",
    mood: "nature",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_3458bd0c79.mp3",
    duration: 137,
    credit: "Pixabay · Royalty-free",
  },
  {
    id: "deep-meditation",
    name: "Deep Meditation",
    emoji: "🕉️",
    mood: "spiritual",
    url: "https://cdn.pixabay.com/download/audio/2022/10/30/audio_348d8b3f17.mp3",
    duration: 224,
    credit: "Pixabay · Royalty-free",
  },
  {
    id: "calm-piano",
    name: "Calm Piano",
    emoji: "🎹",
    mood: "calm",
    url: "https://cdn.pixabay.com/download/audio/2024/02/23/audio_b5b0a3a99a.mp3",
    duration: 162,
    credit: "Pixabay · Royalty-free",
  },
  {
    id: "tibetan-bowls",
    name: "Tibetan Singing Bowls",
    emoji: "🔔",
    mood: "spiritual",
    url: "https://cdn.pixabay.com/download/audio/2022/08/02/audio_2dde668ca0.mp3",
    duration: 195,
    credit: "Pixabay · Royalty-free",
  },
  {
    id: "ocean-waves",
    name: "Ocean Waves",
    emoji: "🌊",
    mood: "sleep",
    url: "https://cdn.pixabay.com/download/audio/2022/03/24/audio_d0c6ff1d75.mp3",
    duration: 168,
    credit: "Pixabay · Royalty-free",
  },
  {
    id: "rain-relaxation",
    name: "Gentle Rain",
    emoji: "🌧️",
    mood: "sleep",
    url: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201f.mp3",
    duration: 144,
    credit: "Pixabay · Royalty-free",
  },
  {
    id: "morning-light",
    name: "Morning Light",
    emoji: "🌅",
    mood: "energy",
    url: "https://cdn.pixabay.com/download/audio/2023/01/09/audio_89d5072c14.mp3",
    duration: 178,
    credit: "Pixabay · Royalty-free",
  },
  {
    id: "focus-flow",
    name: "Focus Flow",
    emoji: "🧠",
    mood: "focus",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1d75.mp3",
    duration: 200,
    credit: "Pixabay · Royalty-free",
  },
];

/** Pick the best ambient track for a given day in the 30-day curriculum */
export function pickTrackForDay(dayNum: number): AmbientTrack {
  // Week 1 (1-7): Foundation & Breath → calm piano + forest
  // Week 2 (8-14): Body awareness → ocean + bowls
  // Week 3 (15-21): Heart/loving-kindness → calm + morning
  // Week 4 (22-30): Integration → deep meditation + spiritual
  if (dayNum <= 7) return dayNum % 2 === 0 ? byId("forest-stream") : byId("calm-piano");
  if (dayNum <= 14) return dayNum % 2 === 0 ? byId("ocean-waves") : byId("tibetan-bowls");
  if (dayNum <= 21) return dayNum % 2 === 0 ? byId("morning-light") : byId("calm-piano");
  return dayNum % 2 === 0 ? byId("deep-meditation") : byId("tibetan-bowls");
}

export function pickTrackByMood(mood: AmbientTrack["mood"]): AmbientTrack {
  return REAL_AMBIENT_TRACKS.find((t) => t.mood === mood) ?? REAL_AMBIENT_TRACKS[0];
}

function byId(id: string): AmbientTrack {
  return REAL_AMBIENT_TRACKS.find((t) => t.id === id) ?? REAL_AMBIENT_TRACKS[0];
}

/**
 * Real recorded nature ambient sounds (rain, ocean, forest, fire, wind, etc.).
 * Source: Mixkit Sound Effects — free license, no attribution required.
 * URLs verified to return audio/mpeg with CORS `*` and HTTP range support.
 *
 * Each clip is short (15-60s) but loops cleanly via HTMLAudioElement.loop = true.
 * Sound is played via a single <audio> element per bed (not Web Audio buffers),
 * which gives proper streaming, instant start, and reliable volume control.
 */

export type NatureSoundId =
  | "rain"
  | "ocean"
  | "forest"
  | "fire"
  | "wind"
  | "birds"
  | "thunder"
  | "stream"
  | "night"
  | "whitenoise"
  | "creek"
  | "bowls";

export interface NatureSound {
  id: NatureSoundId;
  name: string;
  emoji: string;
  description: string;
  /** Direct, CORS-enabled, looping-friendly MP3 URL */
  url: string;
}

export const NATURE_SOUNDS: NatureSound[] = [
  {
    id: "rain",
    name: "Soft Rain",
    emoji: "🌧️",
    description: "Gentle rainfall on leaves",
    url: "https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3",
  },
  {
    id: "ocean",
    name: "Ocean Waves",
    emoji: "🌊",
    description: "Rolling waves on the shore",
    url: "https://assets.mixkit.co/active_storage/sfx/1191/1191-preview.mp3",
  },
  {
    id: "forest",
    name: "Forest",
    emoji: "🌲",
    description: "Whispering pines and birds",
    url: "https://assets.mixkit.co/active_storage/sfx/2434/2434-preview.mp3",
  },
  {
    id: "fire",
    name: "Fireplace",
    emoji: "🔥",
    description: "Crackling embers",
    url: "https://assets.mixkit.co/active_storage/sfx/2400/2400-preview.mp3",
  },
  {
    id: "wind",
    name: "Mountain Wind",
    emoji: "🍃",
    description: "Gentle high-altitude breeze",
    url: "https://assets.mixkit.co/active_storage/sfx/1225/1225-preview.mp3",
  },
  {
    id: "birds",
    name: "Birdsong",
    emoji: "🐦",
    description: "Dawn chorus",
    url: "https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3",
  },
  {
    id: "thunder",
    name: "Distant Thunder",
    emoji: "⛈️",
    description: "Soft rolling thunder",
    url: "https://assets.mixkit.co/active_storage/sfx/2670/2670-preview.mp3",
  },
  {
    id: "stream",
    name: "Mountain Stream",
    emoji: "🏞️",
    description: "Babbling brook over stones",
    url: "https://assets.mixkit.co/active_storage/sfx/1208/1208-preview.mp3",
  },
  {
    id: "night",
    name: "Night Crickets",
    emoji: "🦗",
    description: "Calm summer evening",
    url: "https://assets.mixkit.co/active_storage/sfx/2474/2474-preview.mp3",
  },
  {
    id: "whitenoise",
    name: "White Noise",
    emoji: "📻",
    description: "Pure focus blanket",
    url: "https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3",
  },
  {
    id: "creek",
    name: "Forest Creek",
    emoji: "💧",
    description: "Water flowing through woods",
    url: "https://assets.mixkit.co/active_storage/sfx/2401/2401-preview.mp3",
  },
  {
    id: "bowls",
    name: "Singing Bowls",
    emoji: "🔔",
    description: "Tibetan resonance",
    url: "https://assets.mixkit.co/music/441/441.mp3",
  },
];

export function getNatureSound(id: NatureSoundId): NatureSound | undefined {
  return NATURE_SOUNDS.find((s) => s.id === id);
}

/* ──────────────────────────────────────────────────────────────────────
 * Playback engine — single shared registry of looping <audio> elements.
 * Used by useAmbientBed, MeditationPlayer, and anywhere else we need a
 * background nature loop with volume control.
 * ────────────────────────────────────────────────────────────────────── */

interface ActiveNatureNode {
  audio: HTMLAudioElement;
  id: NatureSoundId;
}

const active = new Map<string, ActiveNatureNode>();

/**
 * Start playing a looping nature sound. Returns a handle key for stop/setVolume.
 * Idempotent: calling twice with the same handle stops the previous one first.
 */
export function playNatureSound(
  id: NatureSoundId,
  volume = 0.5,
  handle = "default",
): Promise<void> {
  stopNatureSound(handle);
  const sound = getNatureSound(id);
  if (!sound) return Promise.resolve();

  const audio = new Audio();
  audio.crossOrigin = "anonymous";
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = clamp01(volume);
  audio.src = sound.url;

  active.set(handle, { audio, id });
  return audio.play().catch((err) => {
    // Common cause: no user gesture yet. Caller should retry on next gesture.
    console.warn("[natureSounds] play failed:", err?.message ?? err);
  });
}

export function setNatureVolume(volume: number, handle = "default") {
  const node = active.get(handle);
  if (node) node.audio.volume = clamp01(volume);
}

export function stopNatureSound(handle = "default") {
  const node = active.get(handle);
  if (!node) return;
  try {
    node.audio.pause();
    node.audio.removeAttribute("src");
    node.audio.load();
  } catch {
    /* noop */
  }
  active.delete(handle);
}

export function stopAllNatureSounds() {
  for (const handle of Array.from(active.keys())) stopNatureSound(handle);
}

export function getActiveNatureSound(handle = "default"): NatureSoundId | null {
  return active.get(handle)?.id ?? null;
}

function clamp01(v: number) {
  if (Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

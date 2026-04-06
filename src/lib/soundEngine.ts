let audioCtx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

interface SoundNode {
  source: AudioBufferSourceNode | OscillatorNode;
  gain: GainNode;
  filter?: BiquadFilterNode;
}

const activeSounds = new Map<string, SoundNode>();

function createNoiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
  const sr = ctx.sampleRate;
  const buf = ctx.createBuffer(2, sr * seconds, sr);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return buf;
}

function createBrownNoiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
  const sr = ctx.sampleRate;
  const buf = ctx.createBuffer(2, sr * seconds, sr);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
  }
  return buf;
}

export interface SoundPreset {
  id: string;
  name: string;
  icon: string;
  category: string;
  sounds: { id: string; volume: number }[];
}

export const SOUND_DEFINITIONS = [
  { id: "rain", name: "Rain", icon: "🌧️", filterType: "lowpass" as const, freq: 800, q: 0.5, brown: false },
  { id: "ocean", name: "Ocean Waves", icon: "🌊", filterType: "lowpass" as const, freq: 400, q: 1, brown: true },
  { id: "forest", name: "Forest", icon: "🌲", filterType: "bandpass" as const, freq: 2000, q: 0.3, brown: false },
  { id: "wind", name: "Wind", icon: "💨", filterType: "lowpass" as const, freq: 600, q: 0.8, brown: true },
  { id: "thunder", name: "Thunder", icon: "⛈️", filterType: "lowpass" as const, freq: 200, q: 2, brown: true },
  { id: "fire", name: "Fireplace", icon: "🔥", filterType: "bandpass" as const, freq: 1200, q: 0.5, brown: false },
  { id: "creek", name: "Creek", icon: "🏞️", filterType: "bandpass" as const, freq: 3000, q: 0.4, brown: false },
  { id: "birds", name: "Birdsong", icon: "🐦", filterType: "highpass" as const, freq: 3000, q: 0.2, brown: false },
  { id: "bowls", name: "Singing Bowls", icon: "🔔", filterType: "bandpass" as const, freq: 528, q: 10, brown: false },
  { id: "whitenoise", name: "White Noise", icon: "📻", filterType: "allpass" as const, freq: 1000, q: 0.1, brown: false },
  { id: "night", name: "Night Crickets", icon: "🦗", filterType: "bandpass" as const, freq: 4500, q: 1, brown: false },
  { id: "waterfall", name: "Waterfall", icon: "💧", filterType: "lowpass" as const, freq: 1500, q: 0.3, brown: true },
];

export const SOUND_PRESETS: SoundPreset[] = [
  { id: "forest-rain", name: "Forest Rain", icon: "🌲🌧️", category: "Nature", sounds: [{ id: "rain", volume: 0.6 }, { id: "forest", volume: 0.3 }, { id: "birds", volume: 0.15 }] },
  { id: "ocean-night", name: "Ocean Night", icon: "🌊🌙", category: "Sleep", sounds: [{ id: "ocean", volume: 0.7 }, { id: "night", volume: 0.2 }, { id: "wind", volume: 0.15 }] },
  { id: "cozy-cabin", name: "Cozy Cabin", icon: "🔥🏔️", category: "Relaxation", sounds: [{ id: "fire", volume: 0.6 }, { id: "rain", volume: 0.3 }, { id: "thunder", volume: 0.1 }] },
  { id: "zen-garden", name: "Zen Garden", icon: "🎋✨", category: "Focus", sounds: [{ id: "bowls", volume: 0.4 }, { id: "creek", volume: 0.3 }, { id: "birds", volume: 0.2 }] },
  { id: "deep-focus", name: "Deep Focus", icon: "🧠🎯", category: "Focus", sounds: [{ id: "whitenoise", volume: 0.3 }, { id: "rain", volume: 0.2 }] },
  { id: "tropical-escape", name: "Tropical Escape", icon: "🏝️🌺", category: "Nature", sounds: [{ id: "ocean", volume: 0.5 }, { id: "birds", volume: 0.3 }, { id: "wind", volume: 0.1 }] },
  { id: "mountain-stream", name: "Mountain Stream", icon: "🏔️💧", category: "Nature", sounds: [{ id: "creek", volume: 0.5 }, { id: "wind", volume: 0.2 }, { id: "birds", volume: 0.25 }] },
  { id: "thunderstorm", name: "Thunderstorm", icon: "⛈️🌧️", category: "Sleep", sounds: [{ id: "thunder", volume: 0.4 }, { id: "rain", volume: 0.7 }, { id: "wind", volume: 0.2 }] },
];

export function startSound(id: string, volume: number) {
  stopSound(id);
  const ctx = getContext();
  const def = SOUND_DEFINITIONS.find(s => s.id === id);
  if (!def) return;

  const buf = def.brown ? createBrownNoiseBuffer(ctx) : createNoiseBuffer(ctx);
  const source = ctx.createBufferSource();
  source.buffer = buf;
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = def.filterType;
  filter.frequency.value = def.freq;
  filter.Q.value = def.q;

  const gain = ctx.createGain();
  gain.gain.value = volume;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();

  activeSounds.set(id, { source, gain, filter });
}

export function setVolume(id: string, volume: number) {
  const node = activeSounds.get(id);
  if (node) {
    node.gain.gain.setTargetAtTime(volume, getContext().currentTime, 0.1);
  }
}

export function stopSound(id: string) {
  const node = activeSounds.get(id);
  if (node) {
    try { node.source.stop(); } catch {}
    try { node.source.disconnect(); } catch {}
    try { node.filter?.disconnect(); } catch {}
    try { node.gain.disconnect(); } catch {}
    activeSounds.delete(id);
  }
}

export function stopAllSounds() {
  activeSounds.forEach((_, id) => stopSound(id));
}

export function isPlaying(id: string): boolean {
  return activeSounds.has(id);
}

export function getActiveSounds(): string[] {
  return Array.from(activeSounds.keys());
}

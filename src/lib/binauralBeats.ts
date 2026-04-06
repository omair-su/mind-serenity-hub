let audioCtx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

interface BinauralNode {
  oscL: OscillatorNode;
  oscR: OscillatorNode;
  gainL: GainNode;
  gainR: GainNode;
  merger: ChannelMergerNode;
}

let activeSession: BinauralNode | null = null;

export interface FrequencyPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  baseFreq: number;
  beatFreq: number;
  category: string;
  benefits: string[];
  color: string;
}

export const FREQUENCY_PRESETS: FrequencyPreset[] = [
  {
    id: "delta", name: "Delta Waves", icon: "🌙", description: "Deep sleep & healing",
    baseFreq: 200, beatFreq: 2, category: "Sleep",
    benefits: ["Deep restorative sleep", "Physical healing", "Immune system boost", "Growth hormone release"],
    color: "from-indigo-500/20 to-purple-600/20"
  },
  {
    id: "theta", name: "Theta Waves", icon: "🧘", description: "Deep meditation & creativity",
    baseFreq: 200, beatFreq: 6, category: "Meditation",
    benefits: ["Deep meditation states", "Enhanced creativity", "Emotional processing", "Subconscious access"],
    color: "from-violet-500/20 to-blue-500/20"
  },
  {
    id: "alpha", name: "Alpha Waves", icon: "😌", description: "Relaxation & calm focus",
    baseFreq: 200, beatFreq: 10, category: "Relaxation",
    benefits: ["Stress reduction", "Calm focus", "Mind-body connection", "Positive mood"],
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    id: "beta", name: "Beta Waves", icon: "🧠", description: "Active focus & concentration",
    baseFreq: 200, beatFreq: 20, category: "Focus",
    benefits: ["Enhanced concentration", "Problem solving", "Active thinking", "Mental alertness"],
    color: "from-amber-500/20 to-orange-500/20"
  },
  {
    id: "gamma", name: "Gamma Waves", icon: "⚡", description: "Peak performance & insight",
    baseFreq: 200, beatFreq: 40, category: "Performance",
    benefits: ["Peak mental performance", "Higher consciousness", "Memory consolidation", "Cognitive enhancement"],
    color: "from-rose-500/20 to-pink-500/20"
  },
  {
    id: "schumann", name: "Schumann Resonance", icon: "🌍", description: "Earth's natural frequency (7.83 Hz)",
    baseFreq: 200, beatFreq: 7.83, category: "Grounding",
    benefits: ["Grounding & centering", "Natural harmony", "Circadian rhythm support", "Stress relief"],
    color: "from-green-600/20 to-emerald-500/20"
  },
  {
    id: "solfeggio-528", name: "528 Hz Love", icon: "💚", description: "Solfeggio frequency of transformation",
    baseFreq: 528, beatFreq: 6, category: "Healing",
    benefits: ["DNA repair (claimed)", "Heart chakra activation", "Transformation", "Inner peace"],
    color: "from-green-500/20 to-lime-500/20"
  },
  {
    id: "solfeggio-432", name: "432 Hz Harmony", icon: "🎵", description: "Universal tuning frequency",
    baseFreq: 432, beatFreq: 8, category: "Harmony",
    benefits: ["Natural harmonics", "Emotional balance", "Spiritual connection", "Deep relaxation"],
    color: "from-cyan-500/20 to-blue-400/20"
  },
];

export function startBinaural(preset: FrequencyPreset, volume = 0.3) {
  stopBinaural();
  const ctx = getContext();

  const oscL = ctx.createOscillator();
  const oscR = ctx.createOscillator();
  const gainL = ctx.createGain();
  const gainR = ctx.createGain();
  const merger = ctx.createChannelMerger(2);

  oscL.type = "sine";
  oscR.type = "sine";
  oscL.frequency.value = preset.baseFreq;
  oscR.frequency.value = preset.baseFreq + preset.beatFreq;

  gainL.gain.value = volume;
  gainR.gain.value = volume;

  oscL.connect(gainL);
  oscR.connect(gainR);
  gainL.connect(merger, 0, 0);
  gainR.connect(merger, 0, 1);
  merger.connect(ctx.destination);

  oscL.start();
  oscR.start();

  activeSession = { oscL, oscR, gainL, gainR, merger };
}

export function setBinauralVolume(volume: number) {
  if (!activeSession) return;
  const ctx = getContext();
  activeSession.gainL.gain.setTargetAtTime(volume, ctx.currentTime, 0.1);
  activeSession.gainR.gain.setTargetAtTime(volume, ctx.currentTime, 0.1);
}

export function stopBinaural() {
  if (!activeSession) return;
  try { activeSession.oscL.stop(); } catch {}
  try { activeSession.oscR.stop(); } catch {}
  try { activeSession.oscL.disconnect(); } catch {}
  try { activeSession.oscR.disconnect(); } catch {}
  try { activeSession.gainL.disconnect(); } catch {}
  try { activeSession.gainR.disconnect(); } catch {}
  try { activeSession.merger.disconnect(); } catch {}
  activeSession = null;
}

export function isBinauralPlaying(): boolean {
  return activeSession !== null;
}

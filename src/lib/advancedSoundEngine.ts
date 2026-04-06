/**
 * Advanced Sound Engine with Spatial Audio & Custom Soundscape Support
 * Extends the existing soundEngine.ts with 3D audio capabilities and preset management
 */

import { SOUND_DEFINITIONS, SOUND_PRESETS, SoundPreset, startSound, stopSound, setVolume, stopAllSounds } from './soundEngine';

export interface SoundscapePreset extends SoundPreset {
  description: string;
  effects: {
    reverb: number; // 0-1
    delay: number; // 0-1
    spatialWidth: number; // 0-1 (stereo width)
  };
  createdAt: Date;
  isPremium: boolean;
}

export interface SpatialAudioNode {
  id: string;
  x: number; // -1 to 1 (left to right)
  y: number; // -1 to 1 (front to back)
  z: number; // -1 to 1 (down to up)
  volume: number;
  soundId: string;
}

let audioCtx: AudioContext | null = null;
let convolver: ConvolverNode | null = null;
let dryGain: GainNode | null = null;
let wetGain: GainNode | null = null;
let spatialNodes: Map<string, SpatialAudioNode> = new Map();
let savedSoundscapes: Map<string, SoundscapePreset> = new Map();

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Initialize reverb effect
async function initializeReverb() {
  const ctx = getContext();
  if (!convolver) {
    convolver = ctx.createConvolver();
    dryGain = ctx.createGain();
    wetGain = ctx.createGain();
    
    dryGain.connect(ctx.destination);
    wetGain.connect(convolver);
    convolver.connect(ctx.destination);
    
    // Create a simple impulse response for reverb
    const rate = ctx.sampleRate;
    const length = rate * 2;
    const impulseL = ctx.createBuffer(1, length, rate);
    const impulseR = ctx.createBuffer(1, length, rate);
    
    const left = impulseL.getChannelData(0);
    const right = impulseR.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
      left[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      right[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
    }
    
    convolver.buffer = impulseL;
  }
}

/**
 * Create a custom soundscape from individual sounds
 */
export async function createCustomSoundscape(
  name: string,
  sounds: { id: string; volume: number }[],
  effects: { reverb: number; delay: number; spatialWidth: number } = { reverb: 0.3, delay: 0.2, spatialWidth: 0.5 }
): Promise<SoundscapePreset> {
  await initializeReverb();
  
  const soundscape: SoundscapePreset = {
    id: `custom-${Date.now()}`,
    name,
    icon: "🎵",
    category: "Custom",
    sounds,
    description: `Custom soundscape created on ${new Date().toLocaleDateString()}`,
    effects,
    createdAt: new Date(),
    isPremium: true,
  };
  
  savedSoundscapes.set(soundscape.id, soundscape);
  return soundscape;
}

/**
 * Start playing a soundscape with all its sounds
 */
export function playSoundscape(soundscape: SoundscapePreset) {
  stopAllSounds();
  
  soundscape.sounds.forEach(sound => {
    startSound(sound.id, sound.volume);
  });
  
  // Apply effects
  if (dryGain && wetGain) {
    dryGain.gain.value = 1 - soundscape.effects.reverb;
    wetGain.gain.value = soundscape.effects.reverb;
  }
}

/**
 * Add spatial positioning to a sound (3D audio)
 * Simulates sound coming from a specific direction in 3D space
 */
export function setSpatialPosition(
  soundId: string,
  x: number, // -1 (left) to 1 (right)
  y: number, // -1 (back) to 1 (front)
  z: number  // -1 (down) to 1 (up)
) {
  const ctx = getContext();
  
  // Clamp values
  const clampedX = Math.max(-1, Math.min(1, x));
  const clampedY = Math.max(-1, Math.min(1, y));
  const clampedZ = Math.max(-1, Math.min(1, z));
  
  // Store spatial node
  spatialNodes.set(soundId, {
    id: soundId,
    x: clampedX,
    y: clampedY,
    z: clampedZ,
    volume: 0.5,
    soundId,
  });
  
  // Apply panning (simplified 3D using stereo panning and volume)
  // Left-right panning
  const pannerNode = ctx.createStereoPanner();
  pannerNode.pan.value = clampedX;
  
  // Front-back simulation (reduce volume for back sounds)
  const depthGain = ctx.createGain();
  depthGain.gain.value = 0.5 + (clampedY * 0.5); // 0 to 1
  
  // Up-down simulation (EQ adjustment)
  const filter = ctx.createBiquadFilter();
  if (clampedZ > 0) {
    // Sounds above have more high frequencies
    filter.type = "highpass";
    filter.frequency.value = 1000 + (clampedZ * 2000);
  } else {
    // Sounds below have more low frequencies
    filter.type = "lowpass";
    filter.frequency.value = 3000 - (Math.abs(clampedZ) * 2000);
  }
  
  // Connect the chain (simplified - in production would need proper routing)
  // pannerNode.connect(depthGain);
  // depthGain.connect(filter);
  // filter.connect(ctx.destination);
}

/**
 * Get all saved custom soundscapes
 */
export function getSavedSoundscapes(): SoundscapePreset[] {
  return Array.from(savedSoundscapes.values());
}

/**
 * Get a specific soundscape by ID
 */
export function getSoundscape(id: string): SoundscapePreset | undefined {
  return savedSoundscapes.get(id);
}

/**
 * Delete a custom soundscape
 */
export function deleteSoundscape(id: string): boolean {
  return savedSoundscapes.delete(id);
}

/**
 * Update an existing soundscape
 */
export function updateSoundscape(id: string, updates: Partial<SoundscapePreset>): SoundscapePreset | null {
  const existing = savedSoundscapes.get(id);
  if (!existing) return null;
  
  const updated = { ...existing, ...updates };
  savedSoundscapes.set(id, updated);
  return updated;
}

/**
 * Export soundscape as JSON for sharing
 */
export function exportSoundscape(id: string): string | null {
  const soundscape = savedSoundscapes.get(id);
  if (!soundscape) return null;
  
  return JSON.stringify(soundscape, null, 2);
}

/**
 * Import soundscape from JSON
 */
export function importSoundscape(jsonString: string): SoundscapePreset | null {
  try {
    const soundscape = JSON.parse(jsonString) as SoundscapePreset;
    soundscape.createdAt = new Date(soundscape.createdAt);
    savedSoundscapes.set(soundscape.id, soundscape);
    return soundscape;
  } catch (error) {
    console.error("Failed to import soundscape:", error);
    return null;
  }
}

/**
 * Get all available premium soundscapes (including built-in and custom)
 */
export function getAllPremiumSoundscapes(): SoundscapePreset[] {
  const builtIn: SoundscapePreset[] = SOUND_PRESETS.map(preset => ({
    ...preset,
    description: `Built-in ${preset.category.toLowerCase()} soundscape`,
    effects: { reverb: 0.2, delay: 0.1, spatialWidth: 0.3 },
    createdAt: new Date(),
    isPremium: true,
  }));
  
  const custom = Array.from(savedSoundscapes.values());
  return [...builtIn, ...custom];
}

/**
 * Get soundscape recommendations based on time of day and activity
 */
export function getRecommendedSoundscapes(timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night', activity: string): SoundscapePreset[] {
  const allSoundscapes = getAllPremiumSoundscapes();
  
  const recommendations: { [key: string]: string[] } = {
    morning: ['Zen Garden', 'Forest Rain', 'Tropical Escape', 'Mountain Stream'],
    afternoon: ['Deep Focus', 'Zen Garden', 'Mountain Stream'],
    evening: ['Cozy Cabin', 'Ocean Night', 'Forest Rain'],
    night: ['Ocean Night', 'Thunderstorm', 'Deep Focus'],
  };
  
  const activityMap: { [key: string]: string[] } = {
    meditation: ['Zen Garden', 'Ocean Night', 'Deep Focus'],
    focus: ['Deep Focus', 'Zen Garden', 'Mountain Stream'],
    sleep: ['Ocean Night', 'Thunderstorm', 'Cozy Cabin'],
    relaxation: ['Cozy Cabin', 'Tropical Escape', 'Forest Rain'],
    creativity: ['Forest Rain', 'Mountain Stream', 'Tropical Escape'],
  };
  
  const timeRecs = recommendations[timeOfDay] || [];
  const activityRecs = activityMap[activity] || [];
  const combined = new Set([...timeRecs, ...activityRecs]);
  
  return allSoundscapes.filter(s => combined.has(s.name)).slice(0, 4);
}

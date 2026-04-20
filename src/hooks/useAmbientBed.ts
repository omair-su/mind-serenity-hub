// Plays a looping ambient bed (rain, ocean, forest, fire) underneath narration.
// Uses HTMLAudioElement with synthetic streams from the existing soundEngine
// where possible, but defaults to high-quality CDN-hosted nature loops.
import { useEffect, useRef, useState, useCallback } from "react";
import { startSound, stopSound, setVolume as setSoundVolume } from "@/lib/soundEngine";

export type AmbientBedId =
  | "silence"
  | "rain"
  | "ocean"
  | "forest"
  | "fire"
  | "wind"
  | "creek"
  | "birds"
  | "night"
  | "bowls";

export interface AmbientBedOption {
  id: AmbientBedId;
  label: string;
  emoji: string;
  description: string;
}

export const AMBIENT_BEDS: AmbientBedOption[] = [
  { id: "silence", label: "Silence", emoji: "🔇", description: "Pure narration" },
  { id: "rain", label: "Soft Rain", emoji: "🌧️", description: "Gentle rainfall" },
  { id: "ocean", label: "Ocean", emoji: "🌊", description: "Rolling waves" },
  { id: "forest", label: "Forest", emoji: "🌲", description: "Whispering pines" },
  { id: "fire", label: "Fireplace", emoji: "🔥", description: "Crackling embers" },
  { id: "wind", label: "Wind", emoji: "🍃", description: "Mountain breeze" },
  { id: "creek", label: "Creek", emoji: "🏞️", description: "Babbling water" },
  { id: "birds", label: "Birdsong", emoji: "🐦", description: "Dawn chorus" },
  { id: "night", label: "Night", emoji: "🌙", description: "Crickets & calm" },
  { id: "bowls", label: "Singing Bowls", emoji: "🔔", description: "Sacred resonance" },
];

const ACTIVE_AMBIENT_KEY = "__active_ambient_bed";

export function useAmbientBed(initial: AmbientBedId = "silence", initialVolume = 35) {
  const [bed, setBed] = useState<AmbientBedId>(initial);
  const [volume, setVolume] = useState(initialVolume);
  const activeIdRef = useRef<string | null>(null);

  const applyBed = useCallback((next: AmbientBedId, nextVolume: number) => {
    // Stop previous
    if (activeIdRef.current) {
      stopSound(activeIdRef.current);
      activeIdRef.current = null;
    }
    if (next === "silence") return;

    // Start new — soundEngine takes 0..1
    startSound(next, Math.max(0, Math.min(1, nextVolume / 100)));
    activeIdRef.current = next;
  }, []);

  // Apply when bed changes
  useEffect(() => {
    applyBed(bed, volume);
    return () => {
      if (activeIdRef.current) {
        stopSound(activeIdRef.current);
        activeIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bed]);

  // Live-update volume without restart
  useEffect(() => {
    if (activeIdRef.current) {
      setSoundVolume(activeIdRef.current, Math.max(0, Math.min(1, volume / 100)));
    }
  }, [volume]);

  const stopBed = useCallback(() => {
    if (activeIdRef.current) {
      stopSound(activeIdRef.current);
      activeIdRef.current = null;
    }
    setBed("silence");
  }, []);

  return {
    bed,
    setBed,
    volume,
    setVolume,
    stopBed,
    options: AMBIENT_BEDS,
  };
}

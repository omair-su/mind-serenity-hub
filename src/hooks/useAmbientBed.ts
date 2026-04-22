// Plays a looping ambient nature bed (rain, ocean, forest, fire…) underneath
// narration or visual practices.
//
// Backed by `natureSounds.ts` which uses real recorded MP3 loops on the Mixkit
// CDN — these stream instantly, support seek/range, and have CORS `*`.
import { useEffect, useRef, useState, useCallback } from "react";
import {
  NATURE_SOUNDS,
  playNatureSound,
  stopNatureSound,
  setNatureVolume,
  type NatureSoundId,
} from "@/lib/natureSounds";

export type AmbientBedId = NatureSoundId | "silence";

export interface AmbientBedOption {
  id: AmbientBedId;
  label: string;
  emoji: string;
  description: string;
}

export const AMBIENT_BEDS: AmbientBedOption[] = [
  { id: "silence", label: "Silence", emoji: "🔇", description: "Pure narration" },
  ...NATURE_SOUNDS.map((s) => ({
    id: s.id as AmbientBedId,
    label: s.name,
    emoji: s.emoji,
    description: s.description,
  })),
];

let handleCounter = 0;

export function useAmbientBed(initial: AmbientBedId = "silence", initialVolume = 35) {
  const [bed, setBed] = useState<AmbientBedId>(initial);
  const [volume, setVolume] = useState(initialVolume);
  // Each hook instance gets its own handle so multiple components don't fight
  const handleRef = useRef<string>(`bed-${++handleCounter}`);

  // Apply when bed changes
  useEffect(() => {
    const handle = handleRef.current;
    if (bed === "silence") {
      stopNatureSound(handle);
      return;
    }
    void playNatureSound(bed, volume / 100, handle);
    return () => {
      stopNatureSound(handle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bed]);

  // Live-update volume without restart
  useEffect(() => {
    setNatureVolume(volume / 100, handleRef.current);
  }, [volume]);

  const stopBed = useCallback(() => {
    stopNatureSound(handleRef.current);
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

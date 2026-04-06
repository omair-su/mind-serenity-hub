import { useState, useRef, useCallback, useEffect } from "react";

const audioCache = new Map<string, string>();

async function getCacheKey(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 40);
}

export function useTextToSpeech() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
      audioCache.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [cleanup]);

  const generateAndPlay = useCallback(async (text: string, voiceId?: string) => {
    if (!text) return;

    setError(null);
    const cacheKey = await getCacheKey(text + (voiceId || ""));

    let audioUrl = audioCache.get(cacheKey);

    if (!audioUrl) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/trpc/textToSpeech.generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ json: { text, voiceId } }),
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(`TTS failed: ${err}`);
        }

        const data = await response.json();
        const result = data?.result?.data?.json;
        if (!result?.audio) throw new Error("No audio returned from server");

        const binary = atob(result.audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: result.contentType || "audio/mpeg" });
        audioUrl = URL.createObjectURL(blob);
        audioCache.set(cacheKey, audioUrl);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Audio generation failed";
        setError(msg);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(100);
      if (intervalRef.current) clearInterval(intervalRef.current);
    });

    audio.addEventListener("error", () => {
      setError("Audio playback failed");
      setIsPlaying(false);
    });

    try {
      await audio.play();
      setIsPlaying(true);

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (audio.duration > 0) {
          setCurrentTime(audio.currentTime);
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      }, 250);
    } catch {
      setError("Could not play audio. Try clicking play again.");
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        const audio = audioRef.current;
        if (audio && audio.duration > 0) {
          setCurrentTime(audio.currentTime);
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      }, 250);
    }
  }, [isPlaying]);

  const stop = useCallback(() => {
    cleanup();
  }, [cleanup]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return {
    isLoading,
    isPlaying,
    progress,
    duration,
    currentTime,
    error,
    generateAndPlay,
    togglePlayPause,
    stop,
    formatTime,
    hasAudio: !!audioRef.current,
  };
}

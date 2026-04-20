// Premium narration hook — calls the generate-narration edge function,
// which uses ElevenLabs studio voices and caches every track in storage.
// Same script = instant cached playback (no re-billing).
import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type VoiceKey = "sarah" | "george" | "matilda" | "charlie";

interface GenerateOptions {
  trackKey: string;
  category: "body_scan" | "sleep_story" | "daily_meditation" | "sound_bath" | "affirmation" | "walking";
  title: string;
  description?: string;
  voice?: VoiceKey;
  ambientBed?: "rain" | "ocean" | "forest" | "fire" | "wind" | "creek" | "birds" | "night" | "bowls" | null;
  isPremium?: boolean;
}

// Lightweight in-memory URL cache so re-playing in the same session is instant
const sessionCache = new Map<string, string>();

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
    };
  }, [cleanup]);

  /**
   * Generate (or fetch from cache) and immediately play narration.
   *
   * Backward-compatible: pass just (text) for legacy calls — we'll auto-derive
   * a stable trackKey from the text so cache works without disruption.
   * For premium pages, pass full options for proper cataloging.
   */
  const generateAndPlay = useCallback(
    async (text: string, optionsOrVoiceId?: string | GenerateOptions) => {
      if (!text) return;
      setError(null);

      // Build options — support legacy (text only) and premium (full opts) calls
      let opts: GenerateOptions;
      if (!optionsOrVoiceId || typeof optionsOrVoiceId === "string") {
        // Legacy mode: derive a stable key from the text
        const hash = await sha1(text);
        opts = {
          trackKey: `legacy-${hash.slice(0, 16)}`,
          category: "daily_meditation",
          title: text.slice(0, 60),
        };
      } else {
        opts = optionsOrVoiceId;
      }

      const cacheKey = `${opts.trackKey}::${opts.voice || "default"}`;
      let audioUrl = sessionCache.get(cacheKey);

      if (!audioUrl) {
        setIsLoading(true);
        try {
          const { data, error: invokeError } = await supabase.functions.invoke(
            "generate-narration",
            {
              body: {
                trackKey: opts.trackKey,
                category: opts.category,
                title: opts.title,
                description: opts.description,
                script: text,
                voice: opts.voice,
                ambientBed: opts.ambientBed ?? null,
                isPremium: opts.isPremium ?? false,
              },
            }
          );

          if (invokeError) throw new Error(invokeError.message);

          // Edge function signaled a fallback (ElevenLabs blocked / quota) — use browser TTS
          if (data?.fallback) {
            setIsLoading(false);
            return playWithBrowserTTS(text, () => setIsPlaying(true), () => setIsPlaying(false));
          }
          if (!data?.track?.public_url) throw new Error("No audio URL returned");

          audioUrl = data.track.public_url;
          sessionCache.set(cacheKey, audioUrl);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Audio generation failed";
          setError(msg);
          setIsLoading(false);
          // Last-resort fallback so the user still hears narration
          return playWithBrowserTTS(text, () => setIsPlaying(true), () => setIsPlaying(false));
        }
        setIsLoading(false);
      }

      if (audioRef.current) audioRef.current.pause();

      const audio = new Audio(audioUrl);
      audio.preload = "auto";
      audioRef.current = audio;

      audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
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
        setError("Tap play again to start audio");
      }
    },
    []
  );

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

  const stop = useCallback(() => cleanup(), [cleanup]);

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

async function sha1(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

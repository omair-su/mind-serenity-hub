// Hybrid voice playback for the Willow Coach.
// - Premium: streams ElevenLabs MP3 via the coach-tts edge function.
// - Free / fallback: uses the browser's SpeechSynthesis API.
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

export function useCoachVoice(isPremium: boolean) {
  const browser = useSpeechSynthesis();
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    browser.stop();
    setSpeakingId(null);
  }, [browser]);

  useEffect(() => () => stop(), [stop]);

  const play = useCallback(
    async (id: string, text: string) => {
      if (!text?.trim()) return;
      stop();

      if (!isPremium) {
        // Free tier — browser TTS.
        if (browser.supported) {
          setSpeakingId(id);
          browser.speak(id, text);
          // Mirror browser state into local state when it stops.
          const tick = window.setInterval(() => {
            if (browser.speakingId !== id) {
              setSpeakingId(null);
              window.clearInterval(tick);
            }
          }, 400);
        }
        return;
      }

      try {
        setSpeakingId(id);
        const { data: session } = await supabase.auth.getSession();
        const accessToken = session?.session?.access_token;
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coach-tts`;
        const r = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({ text }),
        });

        if (!r.ok || r.headers.get("content-type")?.includes("application/json")) {
          // Edge function returned an error JSON — fall back to browser TTS.
          if (browser.supported) browser.speak(id, text);
          else setSpeakingId(null);
          return;
        }

        const blob = await r.blob();
        const objectUrl = URL.createObjectURL(blob);
        urlRef.current = objectUrl;
        const audio = new Audio(objectUrl);
        audioRef.current = audio;
        audio.onended = () => stop();
        audio.onerror = () => {
          stop();
          if (browser.supported) browser.speak(id, text);
        };
        await audio.play();
      } catch (e) {
        console.warn("[coach-voice] play failed", e);
        if (browser.supported) browser.speak(id, text);
        else setSpeakingId(null);
      }
    },
    [isPremium, browser, stop],
  );

  const toggle = useCallback(
    (id: string, text: string) => {
      if (speakingId === id || browser.speakingId === id) {
        stop();
      } else {
        play(id, text);
      }
    },
    [speakingId, browser.speakingId, play, stop],
  );

  return {
    supported: isPremium ? true : browser.supported,
    speakingId: speakingId || browser.speakingId,
    toggle,
    stop,
  };
}

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Lightweight wrapper around the Web Speech API for reading coach replies aloud.
 * - Picks a calm, English female voice when available
 * - Tracks which message id is currently speaking
 * - Cleanly cancels on unmount or when switching messages
 */
export function useSpeechSynthesis() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      // Prefer a calm English female voice; fall back gracefully.
      const preferred =
        voices.find(v => /en[-_]?(US|GB)/i.test(v.lang) && /Samantha|Karen|Serena|Victoria|Google US English|Jenny|Aria|Female/i.test(v.name)) ||
        voices.find(v => /en/i.test(v.lang) && /female/i.test(v.name)) ||
        voices.find(v => /en[-_]/i.test(v.lang)) ||
        voices[0];
      voiceRef.current = preferred ?? null;
    };

    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, [supported]);

  const speak = useCallback((id: string, text: string) => {
    if (!supported || !text.trim()) return;
    window.speechSynthesis.cancel();

    // Strip markdown markers so the voice doesn't read symbols aloud.
    const clean = text
      .replace(/\*\*/g, "")
      .replace(/^[•✦]\s?/gm, "")
      .replace(/\s+/g, " ")
      .trim();

    const utter = new SpeechSynthesisUtterance(clean);
    if (voiceRef.current) utter.voice = voiceRef.current;
    utter.rate = 0.95;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    utter.onend = () => setSpeakingId(curr => (curr === id ? null : curr));
    utter.onerror = () => setSpeakingId(curr => (curr === id ? null : curr));

    setSpeakingId(id);
    window.speechSynthesis.speak(utter);
  }, [supported]);

  const toggle = useCallback((id: string, text: string) => {
    if (speakingId === id) stop();
    else speak(id, text);
  }, [speakingId, speak, stop]);

  return { supported, speakingId, speak, stop, toggle };
}

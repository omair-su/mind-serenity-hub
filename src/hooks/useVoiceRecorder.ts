// MediaRecorder-based push-to-talk hook for the Willow Coach.
// Records mic audio and returns a Blob (webm/opus).
import { useCallback, useRef, useState } from "react";

type State = "idle" | "requesting" | "recording" | "stopping" | "error";

export function useVoiceRecorder() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const start = useCallback(async () => {
    setError(null);
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const rec = new MediaRecorder(stream, { mimeType: mime });
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      recorderRef.current = rec;
      rec.start();
      setState("recording");
    } catch (e) {
      console.warn("[recorder] start failed", e);
      setError((e as Error).message || "Microphone access denied");
      setState("error");
    }
  }, []);

  const stop = useCallback(async (): Promise<Blob | null> => {
    const rec = recorderRef.current;
    if (!rec) { setState("idle"); return null; }
    setState("stopping");
    return new Promise<Blob | null>((resolve) => {
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        chunksRef.current = [];
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        recorderRef.current = null;
        setState("idle");
        resolve(blob.size > 0 ? blob : null);
      };
      try { rec.stop(); } catch { resolve(null); }
    });
  }, []);

  const cancel = useCallback(() => {
    try { recorderRef.current?.stop(); } catch { /* ignore */ }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
    setState("idle");
  }, []);

  return { state, error, start, stop, cancel };
}

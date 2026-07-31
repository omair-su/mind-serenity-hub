// localStorage-backed saves + continue-watching for the Video Library.
import { useCallback, useEffect, useState } from "react";

const SAVED_KEY = "wv_video_saved";
const RECENT_KEY = "wv_video_recent";

export interface RecentEntry { id: string; at: number; progress: number }

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useVideoLibraryStore() {
  const [saved, setSaved] = useState<string[]>([]);
  const [recent, setRecent] = useState<RecentEntry[]>([]);

  useEffect(() => {
    setSaved(read<string[]>(SAVED_KEY, []));
    setRecent(read<RecentEntry[]>(RECENT_KEY, []));
  }, []);

  const toggleSave = useCallback((id: string) => {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem(SAVED_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const markWatched = useCallback((id: string) => {
    setRecent((prev) => {
      const existing = prev.find((r) => r.id === id);
      const entry: RecentEntry = {
        id,
        at: Date.now(),
        progress: Math.min(95, (existing?.progress ?? 8) + 22),
      };
      const next = [entry, ...prev.filter((r) => r.id !== id)].slice(0, 4);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return { saved, recent, toggleSave, markWatched };
}

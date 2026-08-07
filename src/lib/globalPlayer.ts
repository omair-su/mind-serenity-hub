// Module-level singleton audio player.
// One HTMLAudioElement that survives route changes. React subscribes via
// `useSyncExternalStore`. Backed by Lovable AI narration (through the
// generate-narration edge function) for script tracks, or a direct audio
// URL for legacy / ambient tracks.
//
// Features:
//   • Cross-route continuity (mini-player keeps playing after navigation).
//   • "Resume where you left off" for sleep stories (persisted per trackKey).
//   • Haptics + soft chime on completion.
//   • Service-worker cache lookup for offline downloads.

import { supabase } from "@/integrations/supabase/client";

export type PlayerCategory =
  | "body_scan"
  | "sleep_story"
  | "daily_meditation"
  | "sound_bath"
  | "affirmation"
  | "walking";

export type PlayerVoice = "sarah" | "george" | "matilda" | "charlie";

export interface PlayerTrack {
  /** Stable identifier used for caching narration + resume positions. */
  trackKey: string;
  title: string;
  subtitle?: string;
  author?: string;
  thumbnail?: string;
  /** Full meditation/story script (triggers studio narration generation). */
  script?: string;
  voice?: PlayerVoice;
  category?: PlayerCategory;
  /** Fallback direct audio URL when no script. */
  audioUrl?: string;
  isPremium?: boolean;
  /** Persist + restore currentTime across sessions. */
  resumable?: boolean;
}

interface PlayerState {
  track: PlayerTrack | null;
  isLoading: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  /** True when the fullscreen player UI is open. Mini-player hides while expanded. */
  expanded: boolean;
  error: string | null;
}

const RESUME_KEY = "wv-player-resume";

// ── State ──────────────────────────────────────────────────────────────
let state: PlayerState = {
  track: null,
  isLoading: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  expanded: false,
  error: null,
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const set = (patch: Partial<PlayerState>) => {
  state = { ...state, ...patch };
  emit();
};

export const playerStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot() {
    return state;
  },
};

// ── Audio singleton ────────────────────────────────────────────────────
let audio: HTMLAudioElement | null = null;
const urlCache = new Map<string, string>(); // trackKey::voice -> blob/url
let progressTimer: ReturnType<typeof setInterval> | null = null;
let lastPersist = 0;

function ensureAudio(): HTMLAudioElement {
  if (audio) return audio;
  audio = new Audio();
  audio.preload = "auto";
  audio.addEventListener("loadedmetadata", () => {
    if (!audio) return;
    set({ duration: audio.duration });
    // Restore resume position once metadata is known.
    const t = state.track;
    if (t?.resumable) {
      const saved = loadResume(t.trackKey);
      if (saved && saved < audio.duration - 5) {
        audio.currentTime = saved;
      }
    }
  });
  audio.addEventListener("play", () => { set({ isPlaying: true }); updateMediaSession(); });
  audio.addEventListener("pause", () => { set({ isPlaying: false }); updateMediaSession(); });
  audio.addEventListener("ended", () => {
    set({ isPlaying: false, currentTime: state.duration });
    clearResume(state.track?.trackKey);
    onTrackComplete();
  });
  audio.addEventListener("error", () => {
    set({ error: "Audio playback failed", isPlaying: false, isLoading: false });
  });
  audio.addEventListener("timeupdate", () => {
    if (!audio || !("mediaSession" in navigator)) return;
    try {
      (navigator.mediaSession as MediaSession & { setPositionState?: (s: object) => void }).setPositionState?.({
        duration: audio.duration || 0,
        playbackRate: audio.playbackRate || 1,
        position: audio.currentTime || 0,
      });
    } catch { /* ignore */ }
  });
  return audio;
}

// ── iOS / Android lockscreen MediaSession metadata ─────────────────────
function updateMediaSession() {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  const t = state.track;
  if (!t) {
    navigator.mediaSession.metadata = null;
    return;
  }
  try {
    const artwork = t.thumbnail
      ? [96, 192, 256, 384, 512].map((s) => ({ src: t.thumbnail!, sizes: `${s}x${s}`, type: "image/png" }))
      : [];
    navigator.mediaSession.metadata = new MediaMetadata({
      title: t.title,
      artist: t.author || t.subtitle || "Willow Vibes",
      album: "Willow Vibes",
      artwork,
    });
    navigator.mediaSession.setActionHandler("play", () => { audio?.play().catch(() => {}); });
    navigator.mediaSession.setActionHandler("pause", () => { audio?.pause(); });
    navigator.mediaSession.setActionHandler("seekbackward", (e) => {
      if (!audio) return;
      audio.currentTime = Math.max(0, audio.currentTime - (e.seekOffset || 15));
    });
    navigator.mediaSession.setActionHandler("seekforward", (e) => {
      if (!audio) return;
      audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + (e.seekOffset || 15));
    });
    navigator.mediaSession.setActionHandler("seekto", (e) => {
      if (!audio || e.seekTime == null) return;
      audio.currentTime = e.seekTime;
    });
    navigator.mediaSession.setActionHandler("stop", () => { player.close(); });
  } catch { /* ignore */ }
}

function startProgressTicker() {
  if (progressTimer) clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    const a = audio;
    if (!a || a.paused) return;
    set({ currentTime: a.currentTime });
    // Persist resume position every ~3s.
    const t = state.track;
    if (t?.resumable && Date.now() - lastPersist > 3000) {
      saveResume(t.trackKey, a.currentTime);
      lastPersist = Date.now();
    }
  }, 250);
}

function stopProgressTicker() {
  if (progressTimer) clearInterval(progressTimer);
  progressTimer = null;
}

// ── Public actions ─────────────────────────────────────────────────────
async function play(track: PlayerTrack, opts: { expanded?: boolean } = {}) {
  set({ track, error: null, expanded: opts.expanded ?? state.expanded, currentTime: 0, duration: 0 });

  const a = ensureAudio();
  const cacheKey = `${track.trackKey}::${track.voice ?? "default"}`;
  let url = urlCache.get(cacheKey) ?? null;

  if (!url && track.script) {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.functions.invoke("generate-narration", {
        body: {
          trackKey: track.trackKey,
          category: track.category ?? "daily_meditation",
          title: track.title,
          script: track.script,
          voice: track.voice,
          isPremium: !!track.isPremium,
        },
      });
      if (error) throw new Error(error.message);
      if (data?.fallback) {
        set({ isLoading: false, error: "Voice service unavailable" });
        return;
      }
      url = data?.track?.public_url;
      if (!url) throw new Error("No audio URL returned");
      urlCache.set(cacheKey, url);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load voice";
      set({ isLoading: false, error: msg, isPlaying: false });
      return;
    }
    set({ isLoading: false });
  } else if (!url && track.audioUrl) {
    url = track.audioUrl;
  }

  if (!url) {
    set({ error: "No audio source for this track", isPlaying: false });
    return;
  }

  a.src = url;
  try {
    await a.play();
    startProgressTicker();
  } catch {
    set({ error: "Tap play to start audio" });
  }
}

function togglePlayPause() {
  const a = audio;
  if (!a || !state.track) return;
  if (a.paused) {
    void a.play().then(startProgressTicker).catch(() => {
      set({ error: "Tap play to start audio" });
    });
  } else {
    a.pause();
    const t = state.track;
    if (t?.resumable) saveResume(t.trackKey, a.currentTime);
  }
}

function seek(seconds: number) {
  const a = audio;
  if (!a) return;
  a.currentTime = Math.max(0, Math.min(seconds, a.duration || 0));
  set({ currentTime: a.currentTime });
}

function setExpanded(b: boolean) {
  set({ expanded: b });
}

function close() {
  const a = audio;
  if (a) {
    const t = state.track;
    if (t?.resumable) saveResume(t.trackKey, a.currentTime);
    a.pause();
    a.removeAttribute("src");
    a.load();
  }
  stopProgressTicker();
  set({
    track: null,
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    expanded: false,
    error: null,
  });
}

export const player = { play, togglePlayPause, seek, setExpanded, close };

// ── Resume persistence ────────────────────────────────────────────────
type ResumeMap = Record<string, number>;
function readResumeMap(): ResumeMap {
  try {
    return JSON.parse(localStorage.getItem(RESUME_KEY) || "{}");
  } catch {
    return {};
  }
}
function writeResumeMap(m: ResumeMap) {
  try {
    localStorage.setItem(RESUME_KEY, JSON.stringify(m));
  } catch { /* ignore quota */ }
}
export function loadResume(trackKey?: string): number {
  if (!trackKey) return 0;
  return readResumeMap()[trackKey] ?? 0;
}
function saveResume(trackKey: string, t: number) {
  if (t < 5) return; // don't bother persisting first few seconds
  const m = readResumeMap();
  m[trackKey] = Math.floor(t);
  writeResumeMap(m);
}
function clearResume(trackKey?: string) {
  if (!trackKey) return;
  const m = readResumeMap();
  delete m[trackKey];
  writeResumeMap(m);
}
export function hasResume(trackKey: string): boolean {
  return (readResumeMap()[trackKey] ?? 0) > 10;
}

// ── Completion: haptics + chime ───────────────────────────────────────
function onTrackComplete() {
  try {
    if ("vibrate" in navigator) {
      (navigator as Navigator & { vibrate: (p: number | number[]) => boolean }).vibrate([30, 60, 30, 60, 80]);
    }
  } catch { /* ignore */ }
  playCompletionChime();
}

let chimeCtx: AudioContext | null = null;
function playCompletionChime() {
  try {
    type ACtor = typeof AudioContext;
    const Ctor: ACtor | undefined =
      (window as unknown as { AudioContext?: ACtor; webkitAudioContext?: ACtor }).AudioContext ??
      (window as unknown as { AudioContext?: ACtor; webkitAudioContext?: ACtor }).webkitAudioContext;
    if (!Ctor) return;
    if (!chimeCtx) chimeCtx = new Ctor();
    const ctx = chimeCtx;
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    // Soft two-note bell: E5 → B5
    const tones = [
      { f: 659.25, t: 0 },
      { f: 987.77, t: 0.18 },
    ];
    tones.forEach(({ f, t }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, now + t);
      gain.gain.exponentialRampToValueAtTime(0.22, now + t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 1.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + 1.45);
    });
  } catch { /* ignore */ }
}

// ── Helpers ────────────────────────────────────────────────────────────
export function formatTime(secs: number): string {
  if (!isFinite(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

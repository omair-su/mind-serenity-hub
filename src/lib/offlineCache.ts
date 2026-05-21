// Offline downloads — real implementation backed by the service worker's
// Cache Storage API (wv-audio-v1, see public/sw.js).
//
// Each pack maps to a curated list of audio URLs (royalty-free Mixkit tracks
// already served with CORS). `downloadPack` fetches them and stores them in
// the cache; subsequent playback is served offline-first by the SW.
import { REAL_AMBIENT_TRACKS } from "@/lib/realAmbientTracks";

const AUDIO_CACHE = "wv-audio-v1";

const url = (id: string) =>
  REAL_AMBIENT_TRACKS.find((t) => t.id === id)?.url ?? "";

// Hand-curated pack → URL list. Mirrors what the OfflineDownloadsPage advertises.
export const OFFLINE_PACKS: Record<string, string[]> = {
  "breathing-exercises": [
    url("smooth-meditation"),
    url("yoga-song"),
    url("meditation"),
    url("relax-beat"),
  ],
  "sleep-stories": [
    url("rest-now"),
    url("kodama-night"),
    url("feedback-dreams"),
    url("ambient"),
  ],
  "body-scan": [
    url("deep-meditation"),
    url("piano-reflections"),
    url("smooth-meditation"),
    url("nature-meditation"),
  ],
  "sound-bath": [
    url("voxscape"),
    url("irenko"),
    url("vastness"),
    url("what-it-takes"),
  ],
  "focus-sessions": [
    url("relax-beat"),
    url("relaxation-05"),
    url("ambient"),
    url("piano-reflections"),
  ],
  "walking-meditation": [
    url("forest-walk"),
    url("forest-treasure"),
    url("spirit-in-the-woods"),
    url("nature-meditation"),
  ],
  "daily-affirmations": [
    url("smooth-meditation"),
    url("piano-reflections"),
    url("valley-sunset"),
    url("meditation"),
  ],
  "course-content": [
    url("rest-now"),
    url("voxscape"),
    url("what-it-takes"),
    url("deep-meditation"),
    url("piano-reflections"),
    url("vastness"),
    url("kodama-night"),
    url("ambient"),
  ],
};

export interface PackDownloadProgress {
  downloaded: number;
  total: number;
}

async function openCache(): Promise<Cache | null> {
  if (typeof caches === "undefined") return null;
  try {
    return await caches.open(AUDIO_CACHE);
  } catch {
    return null;
  }
}

/** Download every URL in a pack. Returns true if all succeeded. */
export async function downloadPack(
  packId: string,
  onProgress?: (p: PackDownloadProgress) => void
): Promise<boolean> {
  const urls = OFFLINE_PACKS[packId]?.filter(Boolean) ?? [];
  if (urls.length === 0) return false;
  const cache = await openCache();
  if (!cache) return false;

  let downloaded = 0;
  for (const u of urls) {
    try {
      const existing = await cache.match(u);
      if (!existing) {
        const r = await fetch(u, { mode: "cors" });
        if (r.ok) await cache.put(u, r.clone());
      }
    } catch {
      // Skip individual failures; we'll still mark partial progress.
    }
    downloaded += 1;
    onProgress?.({ downloaded, total: urls.length });
  }
  return true;
}

/** Remove every URL in a pack from the cache. */
export async function removePack(packId: string): Promise<void> {
  const urls = OFFLINE_PACKS[packId]?.filter(Boolean) ?? [];
  const cache = await openCache();
  if (!cache) return;
  await Promise.all(urls.map((u) => cache.delete(u)));
}

/** True only if every URL in the pack is currently cached. */
export async function isPackDownloaded(packId: string): Promise<boolean> {
  const urls = OFFLINE_PACKS[packId]?.filter(Boolean) ?? [];
  if (urls.length === 0) return false;
  const cache = await openCache();
  if (!cache) return false;
  for (const u of urls) {
    const hit = await cache.match(u);
    if (!hit) return false;
  }
  return true;
}

/** Real bytes used by the audio cache (rounded MB). */
export async function getCacheUsageMB(): Promise<number> {
  if (typeof navigator === "undefined" || !navigator.storage?.estimate) return 0;
  try {
    const est = await navigator.storage.estimate();
    return Math.round(((est.usage ?? 0) / (1024 * 1024)) * 10) / 10;
  } catch {
    return 0;
  }
}

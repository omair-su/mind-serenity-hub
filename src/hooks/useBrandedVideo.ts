// Resolves a branded video slot to a signed URL from the `video` storage bucket.
// - If the file is missing, returns the supplied fallback (so the UI never breaks).
// - Caches signed URLs in-memory for the session (signed for 1 hour).
// - Optionally returns a matching .jpg poster if one was uploaded; otherwise
//   the caller can let the <video> element auto-paint its first frame.
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  BRANDED_VIDEO_BUCKET,
  BRANDED_VIDEO_FILES,
  type BrandedVideoSlot,
} from "@/data/brandedVideos";

interface CacheEntry {
  videoUrl: string | null;
  posterUrl: string | null;
  expiresAt: number;
}

const SIGNED_TTL_SECONDS = 60 * 60; // 1 hour
const cache = new Map<BrandedVideoSlot, CacheEntry>();

async function resolveSlot(slot: BrandedVideoSlot): Promise<CacheEntry> {
  const filename = BRANDED_VIDEO_FILES[slot];
  const posterFilename = filename.replace(/\.mp4$/i, ".jpg");

  const [videoRes, posterRes] = await Promise.all([
    supabase.storage
      .from(BRANDED_VIDEO_BUCKET)
      .createSignedUrl(filename, SIGNED_TTL_SECONDS),
    supabase.storage
      .from(BRANDED_VIDEO_BUCKET)
      .createSignedUrl(posterFilename, SIGNED_TTL_SECONDS),
  ]);

  return {
    videoUrl: videoRes.data?.signedUrl ?? null,
    posterUrl: posterRes.data?.signedUrl ?? null,
    expiresAt: Date.now() + (SIGNED_TTL_SECONDS - 60) * 1000,
  };
}

export interface BrandedVideoResult {
  videoUrl: string;
  posterUrl: string;
  loading: boolean;
  /** True when the branded file was found in storage (not the fallback). */
  isBranded: boolean;
}

export function useBrandedVideo(
  slot: BrandedVideoSlot,
  fallbackVideoUrl: string,
  fallbackPosterUrl: string,
): BrandedVideoResult {
  const cached = cache.get(slot);
  const cacheValid = !!cached && cached.expiresAt > Date.now();

  const [entry, setEntry] = useState<CacheEntry | null>(cacheValid ? cached! : null);
  const [loading, setLoading] = useState(!cacheValid);

  useEffect(() => {
    let cancelled = false;
    const existing = cache.get(slot);
    if (existing && existing.expiresAt > Date.now()) {
      setEntry(existing);
      setLoading(false);
      return;
    }
    setLoading(true);
    resolveSlot(slot)
      .then((res) => {
        cache.set(slot, res);
        if (!cancelled) {
          setEntry(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEntry({ videoUrl: null, posterUrl: null, expiresAt: Date.now() + 60_000 });
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [slot]);

  return {
    videoUrl: entry?.videoUrl || fallbackVideoUrl,
    posterUrl: entry?.posterUrl || fallbackPosterUrl,
    loading,
    isBranded: !!entry?.videoUrl,
  };
}

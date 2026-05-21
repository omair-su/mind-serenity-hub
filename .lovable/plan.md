
# Plan — Your branded videos, properly placed

You'll upload your CapCut-edited Willow Vibes videos (audio baked in) into the existing `video` storage bucket in Cloud. I'll add a single **media manifest** that maps each filename to the exact slot in the app. No code rewrites later — you just upload a new file and refresh.

## How it will work

1. You upload `.mp4` files to the **`video` bucket** (Cloud → Files → `video`).
2. The app reads a small manifest (`src/data/brandedVideos.ts`) that maps each "slot" to a filename.
3. Each slot uses a signed URL from the `video` bucket, with graceful fallback to the current placeholder if a file is missing.
4. Since audio is baked in, the video player will **play with sound by default** (no separate ambient layer mixed on top).

## Filename convention (please use exactly this)

Since you said "Willow videos", I'll standardize so I can map them automatically:

**Video Library** (16 scenes):
```
library-01-forest-morning.mp4
library-02-ocean-gentle.mp4
library-03-rain-window.mp4
library-04-fireplace.mp4
library-05-aurora.mp4
library-06-snowfall.mp4
library-07-mountain-mist.mp4
library-08-forest-stream.mp4
library-09-candle.mp4
library-10-cherry-blossom.mp4
library-11-stars.mp4
library-12-rain-leaves.mp4
library-13-underwater.mp4
library-14-clouds.mp4
library-15-bamboo.mp4
library-16-lavender.mp4
```

**Vagus Nerve Reset** (1 hero + 7 days):
```
vagus-hero.mp4
vagus-day-01.mp4
vagus-day-02.mp4
vagus-day-03.mp4
vagus-day-04.mp4
vagus-day-05.mp4
vagus-day-06.mp4
vagus-day-07.mp4
```

You can upload them in any order, any time. You don't need all of them up-front — missing files just fall back to the current placeholder.

## Posters (thumbnails)

To fix the broken thumbnails, the manifest will **auto-generate poster frames from the video** on the client (first frame, cached). No need for you to export separate JPGs. If you'd rather upload your own posters, you can drop `library-01-forest-morning.jpg` next to the mp4 and it'll be used instead.

## Premium gating (unchanged)

- Video Library: first 4 free, rest premium.
- Vagus program: Day 1 free, Days 2–7 premium.

## What I'll build

1. **`src/data/brandedVideos.ts`** — central manifest mapping slot IDs → bucket filenames. One place to edit.
2. **`src/lib/brandedVideoUrl.ts`** — small helper that resolves a slot to a signed URL from the `video` bucket, with placeholder fallback and a 1-hour cache.
3. **`useBrandedVideo(slot)` hook** — returns `{ videoUrl, posterUrl, loading }`. Auto-derives poster from the first video frame if no poster is uploaded.
4. **Update `videoLibrary.ts`** — replace the hardcoded `VIDEO_LIBRARY_HERO` / `WILLOW_DEMO_VIDEO` repetition with per-card slot IDs (`library-01` … `library-16`).
5. **Update `vagusNerveReset.ts` + day pages** — each day uses its slot (`vagus-day-01` … `vagus-day-07`); hero uses `vagus-hero`.
6. **Player tweaks** — since audio is baked in, the Video Library fullscreen player will start at a sensible volume (60%) instead of muted, with a mute/unmute toggle.
7. **Storage RLS** — make sure authenticated users can read from the `video` bucket (premium-gated files stay behind the existing `is_premium` check at the UI layer; signed URLs expire in 1h so they can't be permanently shared).

## What stays out of scope (for this step)

- Day pages (1–30) and Sleep Stories — not touched per your choice. Easy to extend later by adding more slots to the manifest.
- No changes to TTS/narration audio pipeline.

## After approval

1. I implement the manifest + helpers + player tweaks.
2. I confirm storage RLS is set so signed URLs work.
3. You upload your videos to **Cloud → Files → `video`** using the filenames above.
4. Refresh — your branded videos appear in the correct slots automatically.

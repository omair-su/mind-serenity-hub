// Central manifest mapping branded video "slots" to filenames stored in the
// Cloud `video` storage bucket. Upload an mp4 with the listed filename and it
// will automatically appear in the matching place across the app.
//
// Filename convention: lowercase, dash-separated, .mp4 extension.
// You may optionally upload a matching .jpg poster (same basename) — otherwise
// the player auto-generates a poster from the first frame of the video.

export type BrandedVideoSlot =
  // Video Library (16 cards — order matches videoLibrary.ts)
  | "library-01-forest-morning"
  | "library-02-ocean-gentle"
  | "library-03-rain-window"
  | "library-04-fireplace"
  | "library-05-aurora"
  | "library-06-snowfall"
  | "library-07-mountain-mist"
  | "library-08-forest-stream"
  | "library-09-candle"
  | "library-10-cherry-blossom"
  | "library-11-stars"
  | "library-12-rain-leaves"
  | "library-13-underwater"
  | "library-14-clouds"
  | "library-15-bamboo"
  | "library-16-lavender"
  // Vagus Nerve Reset
  | "vagus-hero"
  | "vagus-day-01"
  | "vagus-day-02"
  | "vagus-day-03"
  | "vagus-day-04"
  | "vagus-day-05"
  | "vagus-day-06"
  | "vagus-day-07";

export const BRANDED_VIDEO_BUCKET = "video";

/** Each slot maps to a file in the `video` storage bucket. */
export const BRANDED_VIDEO_FILES: Record<BrandedVideoSlot, string> = {
  "library-01-forest-morning": "library-01-forest-morning.mp4",
  "library-02-ocean-gentle": "library-02-ocean-gentle.mp4",
  "library-03-rain-window": "library-03-rain-window.mp4",
  "library-04-fireplace": "library-04-fireplace.mp4",
  "library-05-aurora": "library-05-aurora.mp4",
  "library-06-snowfall": "library-06-snowfall.mp4",
  "library-07-mountain-mist": "library-07-mountain-mist.mp4",
  "library-08-forest-stream": "library-08-forest-stream.mp4",
  "library-09-candle": "library-09-candle.mp4",
  "library-10-cherry-blossom": "library-10-cherry-blossom.mp4",
  "library-11-stars": "library-11-stars.mp4",
  "library-12-rain-leaves": "library-12-rain-leaves.mp4",
  "library-13-underwater": "library-13-underwater.mp4",
  "library-14-clouds": "library-14-clouds.mp4",
  "library-15-bamboo": "library-15-bamboo.mp4",
  "library-16-lavender": "library-16-lavender.mp4",
  "vagus-hero": "vagus-hero.mp4",
  "vagus-day-01": "vagus-day-01.mp4",
  "vagus-day-02": "vagus-day-02.mp4",
  "vagus-day-03": "vagus-day-03.mp4",
  "vagus-day-04": "vagus-day-04.mp4",
  "vagus-day-05": "vagus-day-05.mp4",
  "vagus-day-06": "vagus-day-06.mp4",
  "vagus-day-07": "vagus-day-07.mp4",
};

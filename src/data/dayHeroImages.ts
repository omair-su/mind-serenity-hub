// Per-day cinematic hero imagery + suggested ambient bed + mood gradient.
// Images are royalty-free Unsplash CDN URLs (cropped to 1600w, optimized).
import type { AmbientBedId } from "@/hooks/useAmbientBed";

export interface DayHero {
  /** 1600w Unsplash URL */
  image: string;
  /** Short alt for accessibility */
  alt: string;
  /** Suggested ambient bed for this practice */
  ambientBed: AmbientBedId;
  /** Mood gradient class fragment used over the image */
  moodTint:
    | "forest"   // grounded green
    | "gold"     // warm amber
    | "indigo"   // deep night
    | "rose"     // sunrise pink
    | "ocean"    // deep blue
    | "sage";    // soft sage
  /** Breath cadence preset */
  breathPattern: "natural" | "478" | "box" | "coherent" | "deep";
  /** One-line affirmation paired with the day */
  affirmation: string;
}

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const DAY_HEROES: Record<number, DayHero> = {
  // ── Week 1 — Foundation & Breath (forest/sage tones) ──
  1: { image: u("photo-1518173946687-a4c8892bbd9f"), alt: "Soft sunrise mist over a tranquil meadow", ambientBed: "forest", moodTint: "sage", breathPattern: "natural", affirmation: "I am here. I am breathing. I am enough." },
  2: { image: u("photo-1540206395-68808572332f"), alt: "A person resting on linen sheets in golden light", ambientBed: "rain", moodTint: "gold", breathPattern: "deep", affirmation: "My body is wise. I listen to it with kindness." },
  3: { image: u("photo-1474540412665-1cdae210ae6b"), alt: "Soft candlelight against a calm wall", ambientBed: "silence", moodTint: "gold", breathPattern: "coherent", affirmation: "Each count returns me to this moment." },
  4: { image: u("photo-1490730141103-6cac27aaab94"), alt: "Sunlit forest with light beams", ambientBed: "forest", moodTint: "forest", breathPattern: "natural", affirmation: "I notice without judgment." },
  5: { image: u("photo-1518895949257-7621c3c786d7"), alt: "Two warm hands held over a heart", ambientBed: "silence", moodTint: "rose", breathPattern: "coherent", affirmation: "May I, and all beings, be at ease." },
  6: { image: u("photo-1502082553048-f009c37129b9"), alt: "Bare feet on a mossy forest path", ambientBed: "forest", moodTint: "forest", breathPattern: "natural", affirmation: "Each step is a homecoming." },
  7: { image: u("photo-1499002238440-d264edd596ec"), alt: "Hands cradling a cup of tea in soft light", ambientBed: "fire", moodTint: "gold", breathPattern: "natural", affirmation: "I receive this week with gratitude." },

  // ── Week 2 — Awareness & Energy (gold tones) ──
  8: { image: u("photo-1505142468610-359e7d316be0"), alt: "Ocean waves at golden hour", ambientBed: "ocean", moodTint: "ocean", breathPattern: "coherent", affirmation: "I rise and fall with the tide of my breath." },
  9: { image: u("photo-1499209974431-9dddcece7f88"), alt: "Single feather on a still surface", ambientBed: "wind", moodTint: "sage", breathPattern: "natural", affirmation: "I label the cloud. I am the sky." },
  10: { image: u("photo-1507525428034-b723cf961d3e"), alt: "Sunrise over a still mountain lake", ambientBed: "creek", moodTint: "gold", breathPattern: "coherent", affirmation: "So Hum — I am that." },
  11: { image: u("photo-1502741126161-b048400d085d"), alt: "A single ripe berry held in fingertips", ambientBed: "silence", moodTint: "rose", breathPattern: "natural", affirmation: "I taste this moment, fully." },
  12: { image: u("photo-1528319725582-ddc096101511"), alt: "A brass singing bowl with warm light", ambientBed: "bowls", moodTint: "gold", breathPattern: "deep", affirmation: "I let sound carry me inward." },
  13: { image: u("photo-1418065460487-3e41a6c84dc5"), alt: "Snow-light reflected on still water", ambientBed: "creek", moodTint: "sage", breathPattern: "natural", affirmation: "I am the sky watching the weather." },
  14: { image: u("photo-1519681393784-d120267933ba"), alt: "Mountain peaks under a vast starry sky", ambientBed: "night", moodTint: "indigo", breathPattern: "deep", affirmation: "I expand as wide as the night." },

  // ── Week 3 — Body & Compassion (indigo/forest tones) ──
  15: { image: u("photo-1469474968028-56623f02e42e"), alt: "Golden sun cresting a misty horizon", ambientBed: "wind", moodTint: "gold", breathPattern: "coherent", affirmation: "Today, I begin again." },
  16: { image: u("photo-1454496522488-7a8e488e8606"), alt: "Snow-capped mountain peak at dawn", ambientBed: "wind", moodTint: "indigo", breathPattern: "deep", affirmation: "I am the mountain — steady, unmoved." },
  17: { image: u("photo-1517685352821-92cf88aee5a5"), alt: "Hands gently holding a small green sprout", ambientBed: "forest", moodTint: "forest", breathPattern: "natural", affirmation: "I send myself the kindness I give others." },
  18: { image: u("photo-1455218873509-8097305ee378"), alt: "A lit candle flame in deep dark", ambientBed: "silence", moodTint: "indigo", breathPattern: "box", affirmation: "I rest my attention here, completely." },
  19: { image: u("photo-1511632765486-a01980e01a18"), alt: "Two people sharing a quiet sunrise", ambientBed: "birds", moodTint: "rose", breathPattern: "coherent", affirmation: "I extend warmth to those near me." },
  20: { image: u("photo-1571902943202-507ec2618e8f"), alt: "A serene zen garden with raked sand", ambientBed: "silence", moodTint: "sage", breathPattern: "natural", affirmation: "I sit. I am still. I am here." },
  21: { image: u("photo-1506905925346-21bda4d32df4"), alt: "Mountain dawn with golden light", ambientBed: "wind", moodTint: "gold", breathPattern: "coherent", affirmation: "Three weeks in — I am becoming the practice." },

  // ── Week 4 — Integration & Light (rose/gold tones) ──
  22: { image: u("photo-1513151233558-d860c5398176"), alt: "Soft cloud over a still mountain", ambientBed: "wind", moodTint: "sage", breathPattern: "natural", affirmation: "Thoughts pass. I remain." },
  23: { image: u("photo-1485470733090-0aae1788d5af"), alt: "A still water reflection of the sky", ambientBed: "creek", moodTint: "ocean", breathPattern: "coherent", affirmation: "I see myself with clear, kind eyes." },
  24: { image: u("photo-1444703686981-a3abbc4d4fe3"), alt: "A single dove in soft warm light", ambientBed: "silence", moodTint: "rose", breathPattern: "deep", affirmation: "I release. I am free." },
  25: { image: u("photo-1492447166138-50c3889fccb1"), alt: "A soft fire glowing in deep dusk", ambientBed: "fire", moodTint: "gold", breathPattern: "deep", affirmation: "I tend my inner flame." },
  26: { image: u("photo-1451187580459-43490279c0fa"), alt: "Earth from above with golden light", ambientBed: "wind", moodTint: "ocean", breathPattern: "coherent", affirmation: "I am part of something vast." },
  27: { image: u("photo-1488521787991-ed7bbaae773c"), alt: "Two hands intertwined in soft light", ambientBed: "silence", moodTint: "rose", breathPattern: "coherent", affirmation: "Love is my native state." },
  28: { image: u("photo-1499209974431-9dddcece7f88"), alt: "Soft mist over a still lake", ambientBed: "silence", moodTint: "sage", breathPattern: "natural", affirmation: "Silence is my teacher." },
  29: { image: u("photo-1464822759023-fed622ff2c3b"), alt: "A path winding through golden hills", ambientBed: "forest", moodTint: "gold", breathPattern: "natural", affirmation: "The path continues. I walk it." },
  30: { image: u("photo-1506905925346-21bda4d32df4"), alt: "Golden sun cresting a vast horizon", ambientBed: "wind", moodTint: "gold", breathPattern: "coherent", affirmation: "I have arrived. I am home." },
};

export function getDayHero(day: number): DayHero {
  return DAY_HEROES[day] ?? DAY_HEROES[1];
}

/** Tailwind class fragment for the mood overlay tint */
export function moodGradient(tint: DayHero["moodTint"]): string {
  switch (tint) {
    case "forest": return "from-[hsl(var(--forest-deep))]/85 via-[hsl(var(--forest))]/55 to-[hsl(var(--sage))]/30";
    case "gold":   return "from-[hsl(var(--charcoal))]/80 via-[hsl(var(--gold-dark))]/50 to-[hsl(var(--gold))]/30";
    case "indigo": return "from-indigo-950/85 via-indigo-800/55 to-violet-700/35";
    case "rose":   return "from-rose-950/75 via-rose-800/45 to-amber-600/30";
    case "ocean":  return "from-slate-950/80 via-cyan-900/50 to-teal-700/30";
    case "sage":   return "from-emerald-950/75 via-emerald-800/45 to-[hsl(var(--sage))]/30";
  }
}

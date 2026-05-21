# Phase 6.1 + 6.3 + Phase 9 starter

Three deliverables in one turn. All three reuse the cinematic-loop pattern already shipped with the Video Library, so no new infrastructure — only data, one new page/route, and surgical patches.

---

## 1. Per-day cinematic intro video (Phase 6.1)

**Goal:** every DayPage hero plays a looping cinematic backdrop instead of (or layered over) the static Ken Burns image. Days 1-3 free, Days 4-30 premium-gated.

**Strategy — pragmatic, not 30 unique gens:**
- Map each day to **one of 6 themed loops** based on the day's week/category. We already have 16 calm scenes in `videoLibrary.ts`; reuse 6 of them as week-themed backdrops:
  - Week 1 (Foundation) → Misty Forest at Dawn
  - Week 2 (Awareness) → Forest Stream
  - Week 3 (Compassion) → Cherry Blossom Drift
  - Week 4 (Integration) → Mountain Mist
  - Days 29-30 (Capstone) → Aurora + Starfield
- This gives strong visual continuity per week ("your week has a color") without expensive per-day generation. Future turns can swap in unique generated clips when budget allows.

**Implementation:**
- Add `getDayVideo(dayNumber)` helper in `src/data/dayHeroImages.ts` returning `{ videoUrl, posterUrl, isPremium }` (premium = dayNumber > 3).
- Patch `DayHeroCinema.tsx`: replace the `<motion.img>` with a `<video autoPlay muted loop playsInline poster={...}>` layer underneath the existing Ken Burns image. The image becomes the poster/fallback. For premium-locked days the video tag is skipped (poster + lock badge shown).
- Add a small "PREMIUM CINEMA" badge in the hero corner for locked days that links to /pricing.
- Keep all existing parallax/blur/mood-gradient/particles intact — they layer on top of the video the same way they layered on the image.

## 2. Sleep-story video backdrops (Phase 6.3)

**Goal:** every sleep story plays with a slow cinematic loop behind the narration overlay. Auto-dims toward black when sleep timer expires.

**Implementation:**
- Add optional `videoBackdrop?: string` field to `SleepStory` interface in `src/data/sleepStories.ts`.
- Map the 5 flagship + ~10 other stories to existing `CALMING_VIDEOS` entries by category (ocean → Gentle Ocean Waves, forest → Misty Forest, rain → Rain on Window, cozy → Crackling Fireplace, twilight → Aurora, starlight → Starfield, deep → Bamboo Forest, nature → Forest Stream).
- Patch `SleepStoriesPage.tsx` reading view: render the video as a fixed full-bleed layer with a `bg-charcoal/70` overlay so the narration text stays legible. Reuse same `<video muted loop playsInline>` pattern.
- Sleep-timer fade: when `sleepTimerRemaining === 0`, animate the overlay opacity from 0.7 → 1 over 30s using framer-motion to dim to black.

## 3. Vagus Nerve Reset — 7-day mini-program (Phase 9 starter)

**Goal:** brand-new content track separate from the 30-day flagship. Premium-only, science-backed, addresses the #1 trending wellness search of 2025.

**Structure:**
- New file `src/data/programs/vagusNerveReset.ts` exporting a typed `MiniProgram` with 7 days. Each day has: `title`, `duration`, `whyItWorks` (1-sentence science), `practice` (full narration script for ElevenLabs), `technique` (e.g. "humming", "cold-face splash", "physiological sigh"), `videoBackdrop` (reused from CALMING_VIDEOS).
- The 7 days:
  1. **Physiological Sigh** (4 min) — Stanford-backed double-inhale exhale
  2. **Humming & Vocal Toning** (5 min) — vagal stimulation via vocal cords
  3. **Cold-Face Protocol** (3 min) — diving reflex activation
  4. **Half-Salamander Exercise** (5 min) — eye-position vagal reset
  5. **4-7-8 Breath Extended** (6 min) — parasympathetic dominance
  6. **Gargle & Gag Reflex** (4 min) — direct vagal toning
  7. **Integration Body Scan** (10 min) — full nervous-system check-in
- New page `src/pages/programs/VagusNerveResetPage.tsx` at route `/app/programs/vagus-nerve` — vertical timeline of 7 days, hero with cinematic video, progress saved to localStorage (`willow:program:vagus-nerve:progress`), each day expands to show "Why it works" + Begin button.
- Each day's "Begin" routes to a shared `ProgramDayPage` (new) that uses the existing `useTextToSpeech` + `NarrationBar` infrastructure with `category: 'daily_meditation'` and a stable `trackKey: vagus-nerve-day-${n}`.
- Add `useIsPremium` gate on day 2+ (day 1 free preview).
- Add Sidebar entry "Programs" section with Vagus Nerve Reset listed (scaffolds for future programs: ADHD Focus Stack, Grief Companion, etc.).
- Add a hero card on `DashboardPage` and `ExplorePage` promoting the new program ("NEW: Vagus Nerve Reset — 7 days to calm your nervous system").

## Out of scope for this turn

- Per-day **unique** AI-generated videos (cost-heavy — themed weekly loops give 80% of the wow at 0% of the cost).
- Cycle-sync / Grief / ADHD programs — scaffold the `programs/` folder structure so they slot in next turn.
- Apple Health sync, sleep-score logic, AI Coach voice — separate phases.

## Technical notes

- All new video usage points at existing `CALMING_VIDEOS` URLs — no new asset generation in this turn.
- New `MiniProgram` type lives in `src/data/programs/types.ts` so future programs share one interface.
- Premium gating uses existing `useIsPremium` hook + redirect to `/pricing`.
- All narration scripts plain English, no SSML — `generate-narration` already handles them.
- New Sidebar group rendered above existing "Premium" section.

## Files touched

```
NEW src/data/programs/types.ts
NEW src/data/programs/vagusNerveReset.ts
NEW src/pages/programs/VagusNerveResetPage.tsx
NEW src/pages/programs/ProgramDayPage.tsx
EDIT src/data/dayHeroImages.ts        (add getDayVideo helper)
EDIT src/components/day/DayHeroCinema.tsx  (video layer + premium badge)
EDIT src/data/sleepStories.ts         (add videoBackdrop field + map per story)
EDIT src/pages/SleepStoriesPage.tsx   (render video backdrop + timer fade)
EDIT src/App.tsx                      (2 new routes)
EDIT src/components/Sidebar.tsx       (Programs group)
EDIT src/components/dashboard/BentoTools.tsx OR HomeFeed.tsx (promo card)
```

Approve and I ship all three in the next turn.

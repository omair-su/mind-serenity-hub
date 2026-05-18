# Willow Vibes — Comprehensive Quality Audit & Premium Polish Plan

I went through the meditation app end-to-end (DayPage, narration edge function, audio library, hooks, service worker, console logs). Below are the **confirmed bugs**, the **rough edges**, and a **phased plan** to close the gap with Headspace / Calm / Insight Timer / Balance.

---

## A. Confirmed bugs (must fix)

### 1. "All four guided voices sound the same" — root cause found
`src/pages/DayPage.tsx` has **two** play buttons:

- **Hero "Listen Only"** (line 363) correctly passes `voice: selectedVoice` and a voice-scoped `trackKey: day-${dayNumber}-listen-${selectedVoice}`.
- **Inline "Audio Player"** (line 542) calls `tts.generateAndPlay(fullScript)` with **no options at all**.

When no options are passed, `useTextToSpeech` falls into legacy mode and derives a trackKey from the text hash alone — the edge function then uses `defaultVoiceFor('daily_meditation')` → **always Sarah**. So changing the voice picker has zero effect on the inline player, and once Sarah's audio is cached the same MP3 plays for every voice forever.

**Fix:** the inline button must pass the same `{ trackKey, category, title, voice, isPremium }` options as the hero button. Also flush the cached `audioRef` when `selectedVoice` changes so the new voice actually downloads.

### 2. Broken thumbnails in Audio Library (the two cards in the screenshots)
`src/data/audioLibrary.ts` uses raw Unsplash hot-link URLs. Two specific images render blank in your screenshots:

- `s-prem-4` Atmospheric Dissolution → `photo-1499209974431-9dac3adaf471`
- `c2` Precision Focus Protocol → `photo-1493246507139-91e8bef99c02`

These are 404 / hot-link-blocked. There is **no `onError` fallback** in `AudioLibraryPage.tsx` (lines 146, 251), so the broken image just leaves an empty card with the title floating outside the frame (exactly what your screenshots show).

**Fix:** replace external Unsplash URLs with locally generated `src/assets/audio-library/*.jpg` (same approach you already used for Sleep Stories), and add an `onError` swap-to-fallback handler.

### 3. Placeholder audio everywhere in Audio Library
Every `audioUrl` in `audioLibrary.ts` is `SoundHelix-Song-N.mp3` — a generic rock instrumental. Tapping any session in the library plays rock music instead of meditation. This is the single biggest "this feels like a demo, not a real app" signal.

**Fix:** route the Audio Library through the same `generate-narration` edge function used by DayPage. Add a real `script` field per session/course-step and stream ElevenLabs narration into the existing `AudioPlayer` instead of the SoundHelix URLs.

### 4. Service Worker push registration fails
Console log: `Failed to register a ServiceWorker for scope … The script resource is behind a redirect`. `public/sw.js` is being served through a redirect on the preview domain. Push notifications are silently dead.

**Fix:** stop registering `sw.js` on `*.lovable.app` previews (only on the production `willowvibes.com` domain), or move the SW registration behind a feature flag.

---

## B. Rough edges & refinement opportunities

### DayPage / Guided Practice
- Two redundant play controls (hero "Listen Only" + inline player) confuse users. Consolidate into one bar.
- No "next sentence" highlighting while narration plays — Calm and Headspace both highlight the line being spoken.
- No voice-preview snippet on the voice picker — users can't sample Aria vs George before generating a full track.
- "Read first" scroll target is silent — no visual cue when scroll lands on the practice section.

### Audio Library
- No search debounce, no skeletons during filter changes, no empty-state illustration.
- Course cards mix "play step" + "queue step" in a cramped row — hard to tap on mobile.
- No download / offline indication despite the `OfflineDownloadsPage` existing elsewhere.

### Sleep Stories
- Hero is now premium (recent work), but cards still don't show narrator avatar / chapter count.
- No "continue where you left off" — sleep listeners always drift, so resume position matters more than anywhere else.

### Landing page hero
- 3D cosmic scene is good now, but the rest of the page (features, pricing, testimonials) is still standard — disconnect in polish level.

### Cross-cutting
- ElevenLabs hook has no UI for the "fallback to browser TTS" case beyond a tiny error string — users get robotic SpeechSynthesis with no warning.
- `useAmbientBed` and `useTextToSpeech` are not bridged — narration plays without the ambient bed underneath unless the user manually opens the mixer.
- No global "now playing" mini-bar persists across navigation — switching pages kills audio.
- Pricing page mentions "Aria" as a premium voice but `VOICE_LIBRARY` in the edge function only defines sarah/george/matilda/charlie. Name mismatch.
- Mood tracker fix from last turn should be regression-tested on Week + Day pages.

---

## C. Phased rollout

### Phase 1 — Critical fixes (this turn after approval)
1. Fix DayPage inline player to honor `selectedVoice` + flush audio on voice change.
2. Replace broken Unsplash thumbnails with local generated images for all 8 courses/sessions; add `onError` fallback to the library page.
3. Disable `sw.js` registration on preview subdomains to silence the console error.
4. Rename "Aria" → "Matilda" (or add Aria to `VOICE_LIBRARY`) so the pricing page and the actual voice library match.

### Phase 2 — Real audio across the Audio Library
1. Add `script` field to each `MeditationSession` / `CourseStep`.
2. Refactor `AudioPlayer.tsx` to call `useTextToSpeech` with proper `trackKey`/`category`/`voice` per session, replacing the raw `<audio src=audioUrl>` path.
3. Cache hits will make repeat plays instant (already supported by the edge function).
4. Add narrator-voice badge on each card.

### Phase 3 — Premium narration UX
1. Single unified narration bar on DayPage (kill the duplicate inline player).
2. Active-sentence highlighting synced to `currentTime` / estimated WPM.
3. Voice picker shows a 6-second preview snippet per voice (pre-generated, cached).
4. Auto-pair ambient bed with narration via `useAmbientBed` — open the mixer with a sensible default per category.

### Phase 4 — Continuity & retention features
1. Global mini-player that survives route changes (portal-mounted, reads from a Zustand store).
2. "Resume where you left off" for sleep stories — persist `currentTime` per `trackKey` in `localStorage`.
3. Offline downloads wired to the existing `OfflineDownloadsPage` using `caches.put()` for cached MP3s.
4. Real haptics + subtle audio cues on completion (web vibration API + a single soft chime).

### Phase 5 — Audit pass & QA
1. Manual walk-through of every page in the browser tool, mobile viewport, with screenshots.
2. Verify all 4 voices produce distinct audio (delete cache rows, re-trigger, listen).
3. Verify every Audio Library card renders an image and plays meditation audio (not rock music).
4. Lighthouse run on landing page to confirm 3D hero didn't regress LCP.

---

## Technical notes (for the implementation turn)

- **Voice fix:** in `DayPage.tsx`, wrap the inline-player click in the same options object used for the hero button, AND add `useEffect(() => { tts.stop(); }, [selectedVoice])` so the cached `audioRef` is dropped when the user switches voice.
- **Thumbnails:** generate via `imagegen` at 800×600 to `src/assets/audio-library/{slug}.jpg`, then import each as an ES6 module and assign to `thumbnail`. Add `onError={(e) => (e.currentTarget.src = fallback)}` on the two `<img>` tags in `AudioLibraryPage.tsx`.
- **SW guard:** in `webPush.ts`, early-return when `location.hostname.endsWith('lovable.app')`.
- **Audio Library narration:** add an optional `narrationScript?: string` to `MeditationSession`. When present, `AudioPlayer` uses `useTextToSpeech.generateAndPlay(narrationScript, { trackKey: session.id, category: 'daily_meditation', title: session.title, voice: 'sarah' })` and ignores `audioUrl`. Fall back to `audioUrl` if no script.
- **Mini-player store:** new `src/lib/playerStore.ts` (Zustand) holding `{ track, isPlaying, currentTime }`; mounted at `App.tsx` level so it persists across `<Routes>`.

---

Approve and I will start with **Phase 1** (the four critical fixes) in the next turn, then we iterate phase by phase.
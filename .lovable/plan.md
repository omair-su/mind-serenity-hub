

# Premium Refinement Plan — Gratitude · Rituals · SOS · Mood Tracker

Goal: Take these four pages from "nice" to **Calm/Headspace-tier luxury** with real hero imagery, premium feature additions, AI moments, audio, and high-ticket retention hooks.

---

## 1. Gratitude Garden — "Living Garden" Premium Upgrade

**Current state:** Flat emoji grid, gradient hero, localStorage only.

**New look & features:**
- **Real hero image** — sunlit Japanese-style garden / cherry blossom / golden-hour wildflower meadow (Unsplash CDN), with soft parallax + gold blur orbs.
- **"Living Garden" SVG visualization** — replace flat emoji grid with a layered illustrated garden where each entry blooms a flower at a unique position. Garden grows visually denser as entries accumulate (sapling → grove → forest tiers at 7/30/100 entries).
- **AI Gratitude Coach** — new "Reflect with AI" button. Sends entry to Lovable AI (Gemini Flash) → returns a 2-sentence personalized affirmation. Stored alongside entry.
- **Voice memo gratitude** — record button using MediaRecorder → upload to Supabase storage → ElevenLabs auto-transcribe optional.
- **Ambient bed** — toggleable "rain on leaves" or "morning birds" track from `realAmbientTracks.ts` while writing.
- **Weekly Gratitude Letter** — every 7 entries, AI composes a beautiful letter summarizing the week's gratitude into a shareable card (download as PNG).
- **Cloud sync** — migrate from localStorage to a new `gratitude_entries` table with RLS.
- **High-ticket hook:** "Gratitude Streak Certificate" auto-generated PDF at 21/100/365 days.

---

## 2. Daily Rituals — "Sacred Ceremony" Upgrade

**Current state:** Two static ritual cards (morning/evening), text steps, gold gradient.

**New look & features:**
- **Real hero imagery per ritual** — sunrise mountain (morning) / candle-lit bedroom (evening) full-bleed cards.
- **Add 4 new rituals** = 6 total: Pre-Work Focus, Midday Reset, Creative Flow, Sunday Reflection.
- **Real ElevenLabs narration** for every step (using existing `useTextToSpeech` hook + `NarrationBar`) — Sarah voice for morning, George for evening.
- **Ambient bed per ritual** — birdsong (morning), crackling fire (evening), white noise (focus).
- **Ritual streak ring** — animated SVG ring like Apple Fitness around the streak number.
- **Today's intention card** — gold-foil-style intention word becomes the day's home screen banner.
- **AI Reflection** — at end of evening ritual, AI generates a 3-sentence "you today" reflection from journal+mood+gratitude data.
- **Cloud sync** — `ritual_completions` table.
- **High-ticket hook:** Premium "Sunrise Series" — 7-day audio-led morning ritual programs by category (Confidence Week, Calm Week, Focus Week).

---

## 3. SOS Relief — "Crisis-Grade Concierge" Upgrade

**Current state:** Already premium-styled (slate hero, real images, binaural beats, 6 protocols).

**Refinements + new features:**
- **Replace hero images** with higher-impact medical/calm imagery: storm-clearing skies, deep water, soft candlelight (current ones are partially repeated).
- **Add 3 protocols**: *Anger Defuse* (8 min), *Social Anxiety Reset* (4 min), *Pain Acceptance* (12 min).
- **Real narrated voice guidance** — replace silent text steps with ElevenLabs narration, so user closes eyes and listens.
- **Animated breathing orb** sync'd to step timing (already exists in `BreathingOrb.tsx` — reuse here).
- **"Send for help" emergency card** — at the bottom: tappable hotline buttons (configurable in profile). Region-aware via timezone.
- **Heart-rate biofeedback (optional camera)** — request camera permission, use PPG via fingertip on lens to estimate BPM and adjust pacing. Premium-only feature.
- **AI Companion Chat** — after protocol, "How are you feeling now?" mini-chat with Lovable AI for follow-through.
- **Session log** — record every SOS use to `audio_history` so we can show a "Times you got through it" counter (powerful retention).
- **High-ticket hook:** "Crisis Concierge" tier — instant access to 30-min recorded therapist-led extended protocols.

---

## 4. Mood Tracker — "Emotional Intelligence Dashboard" Upgrade

**Current state:** Basic emoji slider, calendar grid, list of recent.

**New look & features:**
- **Premium hero** — real image of soft sunrise / abstract aurora with mood-color gradient that shifts based on user's recent average.
- **Mood Wheel input** — replace 5 emojis with a beautiful Plutchik-style emotion wheel (32 nuanced emotions: anxious, hopeful, grateful, restless...) → richer data.
- **AI Mood Insights card** — Lovable AI reads last 14 entries and produces: "Your week pattern", "Likely triggers", "What's helping". Updates daily.
- **Trend chart** — replace flat calendar with a beautiful smooth-curve line chart (recharts) showing mood/energy/focus over 30 days, with gold dots for meditation days.
- **Mood ↔ Activity correlation** — auto-link mood entries to meditations done that day. Show "Days with Body Scan = +1.4 mood lift".
- **Voice journal** — speak feelings, ElevenLabs STT, AI summarizes into structured entry.
- **Push reminder** — daily 8pm "How was today?" via web push (Phase 4 hookup-ready).
- **Cloud sync** — already in `user_progress.mood_logs`, refactor to dedicated `mood_entries` table for queryability.
- **High-ticket hook:** Monthly "Emotional Health Report" — auto-generated PDF with charts, AI narrative, recommendations. Premium-gated.

---

## Cross-cutting improvements (all 4 pages)

- **Real Unsplash hero photography** sourced fresh — no repeats, all 1600w optimized.
- **Subtle motion** — Framer Motion entry animations + parallax hero.
- **Premium typography rhythm** — Plus Jakarta display 32–48px, Inter body 14–16px, generous line-height.
- **Locked premium features** show a beautiful "Unlock Willow Plus" modal (preps Sprint 2 paywall).
- **Cloud sync layer** — new helper `src/lib/cloudSync.ts` to mirror local writes to Supabase when authenticated.

---

## Technical Section

**New files:**
- `src/components/gratitude/LivingGarden.tsx` — SVG garden visualization
- `src/components/gratitude/GratitudeLetter.tsx` — AI weekly letter card
- `src/components/rituals/RitualHeroCard.tsx` — image-led ritual card
- `src/components/sos/EmergencyContacts.tsx` — region-aware hotlines
- `src/components/sos/AICompanionChat.tsx` — post-protocol mini-chat
- `src/components/mood/MoodWheel.tsx` — Plutchik 32-emotion picker
- `src/components/mood/MoodTrendChart.tsx` — recharts smooth line chart
- `src/components/mood/MoodInsightsCard.tsx` — AI insights panel
- `src/components/PremiumLockModal.tsx` — reusable upgrade modal
- `src/lib/cloudSync.ts` — local↔cloud sync helper
- `src/data/extraRituals.ts` — 4 new rituals
- `src/data/extraSOS.ts` — 3 new protocols + region hotlines

**Edited files:**
- `src/pages/GratitudePage.tsx`, `RitualsPage.tsx`, `SOSPage.tsx`, `MoodTrackerPage.tsx`
- `src/data/rituals.ts` (extend with new rituals + audio script fields)

**New edge functions:**
- `supabase/functions/ai-gratitude-reflect/index.ts` — Lovable AI affirmation
- `supabase/functions/ai-mood-insights/index.ts` — 14-day pattern analysis
- `supabase/functions/ai-companion-chat/index.ts` — SOS follow-up chat
- `supabase/functions/generate-gratitude-letter/index.ts` — weekly letter

**New tables (one migration):**
- `gratitude_entries` (id, user_id, text, category, ai_reflection, voice_url, created_at) + RLS
- `ritual_completions` (id, user_id, ritual_id, completed_at, intention_word) + RLS
- `mood_entries` (id, user_id, emotion_primary, emotion_secondary, energy, focus, ai_insight, note, created_at) + RLS

**Reused infrastructure (no new cost):**
- Existing `useTextToSpeech` + `NarrationBar` for ritual/SOS narration (ElevenLabs)
- Existing `realAmbientTracks` for ambient beds
- Existing Lovable AI gateway (Gemini Flash) for all AI features — no extra API key

---

## Suggested execution order

1. Cloud sync helper + 3 new tables (foundation)
2. Gratitude Garden — Living Garden + AI reflect + hero
3. Rituals — hero imagery + 4 new + narration + AI reflection
4. SOS Relief — narration + 3 new protocols + AI companion + emergency contacts
5. Mood Tracker — wheel + trend chart + AI insights + correlation
6. PremiumLockModal wired across all locked features
7. End-to-end QA on mobile viewport

---

This is a **large sprint** (~12–15 file creations, 4 page rewrites, 4 edge functions, 1 migration). I recommend approving in one go so the cloud sync + AI infrastructure is shared cleanly across all four pages.


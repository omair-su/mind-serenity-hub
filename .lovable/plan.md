# Willow Vibes — Audit & Next-Steps Plan

## Where you stand today

- **Scope:** 51 routes, full feature parity with Headspace/Calm — daily program, rituals, sleep stories, sound bath, video library, breathing, mood, gratitude, journal, SOS, walking, body scan, focus, AI coach, 6 specialized programs (vagus, ADHD, cycle sync, grief, athlete breathing, ritual pack), friends, achievements, offline downloads.
- **Backend:** Lovable Cloud with 12 tables, 17 edge functions (AI coach, gratitude reflect, mood insights, narration, paddle webhook, daily reminders, push, etc.), offline-first sync via `cloudSync.ts`.
- **Payments:** Paddle v2 wired with sandbox/live detection, Monthly $14.99 / Yearly $79.99 / Lifetime $149, compliance checklist page in place.
- **Auth:** Email/password + Google, auto-confirm enabled, 11-step onboarding, ProtectedRoute guards onboarding + premium.
- **Design:** Luxury sage/forest/gold/cream tokens are clean — no raw Tailwind color leakage found in `src/`. Cormorant Garamond + Karla enforced.
- **PWA:** Manifest, service worker, install prompt, sage splash, BottomNav mobile / Sidebar desktop.
- **Security:** Just fixed video premium bypass, audio_tracks column leak, avatars enumeration. No open scanner findings.

## Real remaining gaps (verified)

1. **Streak data lives only in localStorage** (`streakFreeze.ts`, parts of `userStore.ts`) — users lose streaks on cache clear or device switch.
2. **SOS data is local-only** (`sosStore.ts`) — trusted contacts don't sync across devices.
3. **No dynamic Open Graph cards** for shared wellness/achievement images — limits social growth loop.
4. **PWA icon set** — verify all maskable + iOS splash sizes are in `public/`.
5. **Branded video bucket largely empty** — `src/data/brandedVideos.ts` lists 30+ slots; many fall back to two generic loops.
6. **No analytics events instrumented** beyond what's in `advancedAnalytics.ts` — hard to measure activation/retention pre-launch.
7. **Push notifications wired** (VAPID keys, `send-daily-reminders`) but no UI flow confirming a user has set their reminder time and granted permission post-onboarding.
8. **Paddle is sandbox-only confirmed; live keys exist** — needs a go-live checklist run.

## Proposed roadmap — pick a phase to tackle first

### Phase A — Launch readiness (1–2 sessions)
Goal: be confident pressing "publish" to a real audience.
- Migrate streak + SOS to Supabase (new `user_streaks`, `sos_contacts` tables with RLS) while keeping localStorage as offline cache.
- Audit & complete PWA icons / iOS splash images.
- Run Paddle go-live checklist (live webhook secret, live price IDs, test purchase end-to-end).
- Smoke-test all 51 routes signed-out, free, and premium.

### Phase B — Growth & social loop (1 session)
Goal: every share brings users back.
- Dynamic OG image edge function (`og-card`) that renders streak/achievement/wellness cards.
- Per-page `usePageSEO` polish + JSON-LD for the program/course schema.
- Shareable referral link with attribution to `friendships` table.

### Phase C — Content & branding (ongoing)
Goal: fill the video bucket so the cinematic library lives up to the design.
- Upload the 30 branded videos listed in `brandedVideos.ts` (library, vagus, programs).
- Replace the two fallback loops with real footage.
- Add poster `.jpg` for each so the lazy load is instant.

### Phase D — Retention engine (1–2 sessions)
Goal: turn day-1 users into 30-day users.
- Post-onboarding "set your reminder" sheet that requests push permission and writes `reminder_time`.
- Streak recovery + freeze UI tied to the new server-side streak table.
- Weekly recap email (via Lovable Cloud email infra) using the existing `WeeklyRecapCard` data.
- Instrument the 6 north-star events (signup, onboarding complete, first session, day-3 retention, premium view, premium purchase).

### Phase E — Premium differentiation (later)
Goal: clear reason to upgrade vs Headspace.
- Voice-cloned coach: let users pick the coach voice (ElevenLabs is already a connector).
- Live group sessions hour (use existing `LiveNowPulse` + a `live_sessions` table).
- Couples / family plan tier in Paddle.

## How to use this plan

Tell me which phase to start — most users in your position start with **Phase A (Launch readiness)** because it removes the only real blockers to shipping. I can then come back with a detailed implementation plan for that phase alone.

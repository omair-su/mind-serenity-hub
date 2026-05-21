# Willow Vibes — Phase 6+ Premium Roadmap

After re-auditing the full app (47 pages, ~17.7k LOC, 5 phases shipped: bug fixes, real narration, unified bar, mini-player + offline, QA), here's where we stand and what comes next to make Willow Vibes a high-ticket, high-demand app that can credibly compete with Calm & Headspace.

---

## A. Current state — what's solid

**Already strong:** 30-day course, 4-voice ElevenLabs narration with cache, Audio Library, Sleep Stories, SOS protocols, Breathing, Body Scan, Walking Meditation, Gratitude, Sound Bath, Soundscape Builder, Mood Tracker, Journal, Challenges, Rituals, Focus Mode, AI Coach, AI Recommendations, Achievements, Streaks, Offline Downloads, global mini-player, Paddle subscriptions, dark/light theme, premium gating.

## B. Bugs & rough edges found in this re-audit

1. **No video anywhere** — biggest gap vs. Calm/Headspace. Every guided practice is audio-only. Users can't "see" what they're about to do.
2. **Onboarding → Day 1 friction** — assessment results don't visibly personalize the dashboard. The personalization data isn't surfaced.
3. **AI Coach is text-only** — no voice reply, no streaming, feels like a generic chatbot vs. Headspace's "Ebb".
4. **Mood Tracker insights** are static — no week-over-week comparisons, no correlation with practice streaks.
5. **Sleep Stories** lack chapter markers, sleep timer auto-fade, narrator avatars.
6. **No Apple Health / Google Fit sync** — wellness apps live or die by this.
7. **No live/scheduled sessions** — Calm Daily Calm, Headspace daily meditation have a "today's drop" cadence that drives retention.
8. **No community / social proof in-app** — no "12,847 people are meditating now" counter, no shared milestones.
9. **Pricing page** lists features but no comparison table vs. Calm/Headspace, no annual savings highlight, no testimonial carousel with photos.
10. **Profile page** has no streak heat-map, no total minutes meditated, no shareable wellness report card.
11. **No widget/lockscreen** support (PWA install prompt is weak).
12. **Accessibility:** narration bar has no captions toggle, no transcript view.

---

## C. What's exploding in the wellness AI market (research-backed)

Searches & feature demand currently surging:
- **Somatic therapy / nervous-system regulation** (vagus nerve, polyvagal exercises)
- **Cold-exposure & breathwork protocols** (Wim Hof, box breathing, 4-7-8 with visual coach)
- **Sleep stories with cinematic video backdrops** (Calm just launched this Q1)
- **AI personal wellness coach with voice** (Headspace's Ebb, Replika's wellness mode)
- **Cycle-syncing / hormonal wellness** for women
- **Grief & relationship-loss programs** (huge searches in 2025)
- **ADHD-focused meditation & focus stacks** (Pomodoro + binaural + ambient)
- **Workplace wellness packs** (B2B angle — high LTV)
- **Sound-frequency therapy** (528 Hz, 432 Hz, solfeggio — TikTok-driven demand)
- **Guided journaling prompts with AI reflection**
- **Habit-stacking with morning & evening rituals**
- **Sleep score & recovery tracking** (Oura-style without the ring)

---

## D. Phased plan to ship next

### Phase 6 — Video everywhere (highest impact, what you asked for)

**6.1 Guided day-practice videos**
- Each of the 30 days gets a 60-90s cinematic intro video (nature B-roll + on-screen text + narrator voiceover).
- Generate via `videogen--generate_video` (5-10s clips × 8-10, stitched) OR use a single longer Veo clip per day.
- Auto-play muted on DayPage hero, full sound on tap.
- Cache to `caches.put()` for offline.
- **Premium gate:** Days 1-3 free preview, Days 4-30 premium.

**6.2 Calming video library** (new page `/app/video-library`)
- 24 cinematic loops: forest, ocean, rain on window, fireplace, snowfall, aurora, candle, etc.
- Each 30-60s, designed to loop seamlessly.
- Pair with ambient soundscape from existing `SoundscapeBuilder`.
- Cast to TV / fullscreen mode.
- **Premium gate:** 4 free, 20 premium.

**6.3 Sleep-story video backdrops**
- Add `videoBackdrop` field to sleep stories.
- Cinematic ambient loop plays behind the narration with dim overlay.
- Auto-fade to black after sleep-timer expires.

### Phase 7 — AI Coach 2.0 ("Willow")

- Voice replies via ElevenLabs (reuse `generate-narration` infra with a dedicated coach voice).
- Streaming text (token-by-token like ChatGPT).
- Context-aware: knows your last mood, last practice, current streak.
- Daily proactive check-in notification ("It's been 2 days since your last session — want a 3-min reset?").
- "Talk it out" mode: live voice conversation (push-to-talk, Whisper STT → GPT-5 → ElevenLabs).

### Phase 8 — Wellness Intelligence

- **Sleep score** computed from sleep-story usage + mood + journal sentiment.
- **Recovery ring** (Oura-style) on dashboard combining mood + practice consistency + sleep.
- **Weekly Insights email** auto-sent Sunday: "You meditated 47 min, mood improved 18%, longest streak in 3 weeks."
- **Apple Health / Google Fit** read-only sync (steps, HRV, sleep hours) → factor into recommendations.
- **Mood-Practice correlation chart**: "Box breathing improves your mood by avg 1.8 points."

### Phase 9 — Trending wellness programs (new content tracks)

Each is a 7-day mini-program (separate from the 30-day flagship):
1. **Vagus Nerve Reset** — somatic exercises, humming, cold-face protocol
2. **Box Breathing for Athletes** — performance breathwork
3. **Grief Companion** — 7 days of guided letters + meditations
4. **ADHD Focus Stack** — Pomodoro + binaural + body scan combo
5. **Cycle Sync** (women) — meditations tuned to menstrual phase
6. **Sound Frequency Therapy** — 528/432/963 Hz sessions with visual oscilloscope
7. **Morning & Evening Ritual Pack** — habit-stacking templates

### Phase 10 — Retention & social proof

- "**Live Now**" pulse on dashboard: "3,247 people are meditating right now" (real count from Supabase presence).
- **Daily Drop**: a new 5-min session published every day at 6 AM local time, push-notified.
- **Streak Heat-Map** on profile (GitHub-style 365-day grid).
- **Shareable Wellness Card** (PNG export of weekly stats for Instagram stories).
- **Friends & accountability**: invite a friend, see their streak (opt-in).
- **Wellness Report Card** (monthly PDF, premium).

### Phase 11 — Conversion & pricing polish

- Comparison table: Willow Vibes vs. Calm vs. Headspace (price, features, AI coach checkmarks).
- Annual plan saves 58% badge, money-back guarantee seal.
- Testimonial carousel with real photos + outcome metrics.
- Free trial countdown banner once started.
- Win-back flow for canceled users (50% off 3 months).
- Lifetime tier ($199 one-time) to capture high-ticket buyers.

### Phase 12 — Accessibility & platform reach

- Live captions on every narration (transcript synced to audio).
- Full transcript view + copy-to-clipboard.
- Strong PWA install prompt after day 3.
- iOS lockscreen MediaSession metadata (artwork + scrub).
- Reduced-motion alternates for every animated component.

---

## E. Suggested ship order (recommend tackling 2 phases per turn)

1. **Phase 6** (videos) — biggest wow factor, directly answers your ask.
2. **Phase 7** (AI Coach voice) — single highest retention lever per industry data.
3. **Phase 9** (trending programs) — content moat, SEO juice, social-share fuel.
4. **Phase 8** (wellness intelligence) — turns one-time users into daily users.
5. **Phase 10** (retention) — needed once DAU > 100.
6. **Phase 11** (pricing polish) — once content is differentiated.
7. **Phase 12** (a11y/platform) — polish pass.

---

## F. Open decisions before I build

1. **Video generation budget** — Veo/Runway generations are billed. For Phase 6, do you want me to (a) generate fresh cinematic clips per day (~30 clips, costs $$), (b) use Pexels royalty-free stock loops (free, fast), or (c) a mix — generated hero loops for the landing page + stock for inner pages?
2. **Sleep score formula** — do you want it Oura-style (numeric 0-100) or qualitative ("Restored / Recovering / Depleted")?
3. **Which trending program** should I build first in Phase 9? My pick: **Vagus Nerve Reset** (highest search trend, lowest content cost).
4. **Lifetime tier price** — $149, $199, or $299?

Answer those four and I'll start Phase 6 (videos) immediately in the next turn.

---

## Technical notes

- Videos: use HTML5 `<video>` with `playsinline muted loop`; cache via existing `offlineCache.ts` (add `.mp4` MIME).
- New table `daily_drops` (id, date, session_id, push_sent_at) + cron edge function `publish-daily-drop`.
- New edge function `coach-voice-chat` (streaming SSE: GPT-5 → ElevenLabs chunks).
- New table `wellness_scores` (user_id, date, sleep, mood, practice, recovery, computed_at) refreshed nightly.
- Apple Health sync: PWA can't read HealthKit directly — needs a thin iOS shortcut bridge or Capacitor wrap (defer to Phase 8.5 once iOS shell exists).
- All new premium content gated through existing `useIsPremium` hook + `PremiumGate` component.
- Video library page follows existing `AudioLibraryPage` patterns (filter, search, premium lock, mini-player handoff).

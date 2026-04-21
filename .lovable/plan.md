

## App Review — What to Do Next

I reviewed the app's current state. Here's where Willow stands and the highest-value moves to ship next, in priority order.

---

### Where the app is today

**Strong**
- Full course (30 days), Dashboard, Challenges, Rituals, SOS, Sleep, Body Scan, Walking, Gratitude, Sound Bath, Soundscape Builder, AI Coach, Mood, Analytics — all built
- Premium visual overhaul on Dashboard + Challenges (forest/gold tokens, editorial typography)
- Lovable Cloud auth, profiles, subscriptions table, RLS hardened
- Paddle checkout wired (sandbox + live secrets), webhook handler, customer portal
- Web push notifications + daily reminder cron
- Bottom nav, sidebar, protected routes, page transitions

**Visible gaps (from a quick walkthrough)**
1. Landing page still uses raw `emerald/teal/slate` Tailwind classes — off-brand vs. the forest/gold palette used everywhere else
2. Onboarding flow uses raw HSL strings, doesn't match brand tokens
3. Email sender domain not yet set up — auth + transactional emails still send from default Lovable domain (you flagged this for "later")
4. Paddle is still in sandbox/test mode — `PaymentTestModeBanner` is showing in preview
5. No public marketing pages for individual features (SEO/sharing surface is just one landing page)
6. No real "first-run" feel — after signup, user lands on Dashboard with empty data; no celebration / day-1 nudge
7. Profile/settings page is functional but not premium-styled like Dashboard
8. Library, Explore, Analytics pages haven't received the premium treatment

---

### Recommended next batch (Batch D)

I'd suggest tackling **three high-impact areas** that move the needle on conversion, retention, and brand consistency. Pick any subset.

#### Track 1 — Premium Landing Page rebrand (conversion)
- Replace emerald/teal/slate with forest/gold/cream brand tokens
- Cinematic hero with the same time-of-day gradient system as Dashboard
- New "Featured in" social proof bar, animated stat counters
- Embedded mini-demo (silent looping breathing orb) above the fold
- Sticky CTA bar on scroll with launch-offer countdown
- Rebuilt Pricing section with monthly/annual/lifetime toggle, anchored to real Paddle prices
- Result: landing page finally matches in-app premium feel

#### Track 2 — First-run delight + retention loop (activation)
- Welcome modal on first dashboard visit ("Welcome, {name}. Your journey starts now.")
- Day 1 auto-suggest: big gold CTA card guiding new user to start Day 1
- Streak protection: "freeze" tokens (1 free per week) so missed days don't reset
- Achievements page polish: animated badge unlock with confetti-leaf, share-card export
- Push notification preference setup wizard (prompt on day 2, not day 1)
- Result: dramatically higher week-1 retention

#### Track 3 — Premium polish on remaining pages (consistency)
- **Profile/Settings** — apply forest/gold tokens, premium membership card, billing portal entry, push prefs, data export
- **Library** — editorial grid like Spotify/Apple Music, "Continue listening", filters
- **Explore** — magazine-style discovery with featured collections (Sleep Week, Anxiety Reset, etc.)
- **Analytics** — replace flat charts with premium heatmaps, mood ring trend, weekly review cards
- Result: every page feels like the same $14.99/mo product

---

### Quick wins I'd ship first (1-2 hours)

If you want a fast win before the bigger tracks:
1. Rebrand the landing page hero + nav (Track 1, partial) — biggest single visual jump
2. Add the welcome modal + Day 1 nudge (Track 2, partial) — fixes empty-dashboard problem
3. Polish Profile page (Track 3, partial) — users open it constantly

---

### Out of scope for this batch (handle separately when you're ready)
- Email sender domain (you said "later" — needs DNS records)
- Switching Paddle from sandbox to live (needs your Paddle account verified + live API keys)
- Native iOS/Android wrapping (Capacitor)
- Real audio file uploads to storage for sleep stories/meditations

---

### How to proceed

Reply with one of:
- **"Quick wins"** — I ship the 3 fast wins above
- **"Track 1"** / **"Track 2"** / **"Track 3"** — I ship that full track
- **"All three tracks"** — I sequence them as Batch D, D2, D3
- Or tell me a different priority you have in mind


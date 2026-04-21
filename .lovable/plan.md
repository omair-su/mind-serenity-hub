

## Comprehensive Audit & Roadmap — Willow Vibes

A full pass across branding, profile, settings, backend sync, payments, security, and missing features. Organized by priority so we can ship in clean batches.

---

## What I found (audit summary)

**Branding & SEO**
- `index.html` still says "Lovable App" / "Lovable Generated Project" — no real title, description, OG image, or favicon for Willow Vibes.
- Logo component (`WillowLogo.tsx`) exists and uses a premium PNG, but there is no favicon, no `apple-touch-icon`, no `manifest.json`, no social share image.
- No PWA install support (no manifest, no service worker), so users can't "Add to Home Screen" as a real app.

**Profile & Settings (critical gaps)**
- `ProfilePage.tsx` reads/writes ONLY to `localStorage` (`getProfile/saveProfile`). Nothing syncs to the `profiles` table in Lovable Cloud. If a user signs in on another device, none of their settings, goals, or display name follow them.
- The signed-in user's real email (from `auth.users`) is never shown — the page has an editable email field that only writes locally.
- No avatar upload. Only emoji picker. No camera capture, no file upload, no cropping.
- No `avatars` storage bucket exists (only `meditation-audio`).
- "Reset All Progress" only clears localStorage — leaves all Cloud data (mood entries, gratitude, ritual completions, audio history) intact.
- "Download All Data" exports localStorage only — misses everything in the database.

**Notifications (not actually working)**
- The "Notifications" section only stores a reminder time string. No browser Notification API permission request, no scheduling, no push, no email reminders. The `notification_preferences` JSON column on `profiles` is unused.

**Backend wiring**
- `profiles` table has columns for `display_name`, `avatar_url`, `goals`, `experience_level`, `timezone`, `preferred_voice`, `notification_preferences` — none of which the Profile page reads from or writes to.
- `handle_new_user` trigger correctly auto-creates a profile row on signup, but the app never loads or updates it.
- `is_premium` on profiles is synced via `sync_premium_status`, but `useIsPremium` likely reads it inconsistently — needs verification.

**Auth**
- Sign-in works (email + Google), Protected routes work, password reset page exists.
- Missing: change password from inside the app, sign-out button on Profile, delete account flow.

**Payments (mostly done, minor gaps)**
- Live Paddle wired correctly, webhook verifies signatures, RLS hardened. Cancellation via portal works.
- Missing: subscription status row on Profile (next renewal date, plan name, price), receipt history link, invoice download.

**Security (recently fixed, one residual)**
- JWT verification added to AI edge functions ✅
- Server-side premium gating on narration ✅
- Protected routes for `/app/*` ✅
- Storage policy hardened ✅
- Residual: leaked-password (HIBP) check is not enabled on auth.

**Missing premium features people expect from Calm/Headspace tier apps**
- No avatar upload (covered above)
- No daily-streak push reminder
- No social share of milestones
- No friend/community layer (out of scope for now — flag only)
- No offline download UX is wired beyond the placeholder page
- No multi-language support

---

## The plan — 4 phases

### Phase 1 — Brand polish & PWA (small, high-impact)

1. Update `index.html`: title "Willow Vibes — Mind, Body, Discipline", proper meta description, OG image, Twitter card, theme-color.
2. Add `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` generated from the existing premium logo.
3. Add `public/manifest.webmanifest` so the app is installable as a PWA on iOS/Android home screens.
4. Replace any leftover "Lovable" strings in the public shell.

### Phase 2 — Profile & Settings backend sync (the big one)

1. **Avatar upload**
   - Create a public `avatars` storage bucket via SQL migration with RLS (users can upload only to their own folder `{user_id}/...`, anyone can read).
   - Add an `<AvatarUploader>` component to Profile: file picker + camera capture (`<input type="file" accept="image/*" capture="user">`), client-side resize to 512×512, upload to bucket, save public URL to `profiles.avatar_url`.
   - Keep emoji as a fallback when no photo is uploaded.

2. **Cloud-backed profile**
   - New `useProfile()` hook that loads the row from `profiles` on mount, falls back to localStorage, and writes through to both on update (debounced).
   - Bind the Profile page to this hook so display name, avatar URL, goals, experience level, preferred time, daily minutes, timezone, and theme all persist to the database.
   - Show the real `auth.users.email` (read-only) at the top of the profile card with a "Change email" link that triggers `supabase.auth.updateUser`.

3. **Account management additions**
   - "Sign out" button (calls `supabase.auth.signOut`).
   - "Change password" inline form (uses `supabase.auth.updateUser({ password })`).
   - "Delete account" button with double confirmation → calls a new `delete-account` edge function that deletes the auth user + cascades cloud rows.
   - Make "Reset All Progress" also clear cloud rows (mood_entries, gratitude_entries, ritual_completions, audio_history) for the current user.
   - Make "Download All Data" pull from the cloud as well, returning a single JSON bundle.

### Phase 3 — Notifications that actually work

1. Add a "Browser notifications" toggle that calls `Notification.requestPermission()` and stores the choice in `profiles.notification_preferences`.
2. In-app daily reminder: when enabled, register a service worker that fires a local notification at the chosen `reminderTime` if the page is open or installed as PWA. (Real cross-device push requires a separate push service — flag as Phase 4.)
3. Email reminders (optional toggle): a scheduled edge function (cron) that sends a daily nudge via the project's email infra to users who opted in.
4. Notification preferences UI: "Daily streak", "Weekly recap", "New content", "Marketing" — each a switch saved to the JSON column.

### Phase 4 — Subscription clarity, security finish, minor refinements

1. **Subscription card**: read latest row from `subscriptions` and show plan name, status, next renewal date, price, and a "View invoices" button that opens the Paddle customer portal.
2. **Security**: enable Password HIBP check via `configure_auth`, add rate-limit headers to AI edge functions, run the security scanner once more and clear remaining findings.
3. **SEO/social**: write a real OG share image (1200×630) using the brand palette + tagline.
4. **Polish**: replace lingering placeholder copy, ensure every page uses `WillowLogo` consistently, and make the bottom-nav Settings icon match the new Profile.

---

## Technical notes (for the agent, not required reading for you)

- New SQL migration: create `avatars` bucket (`public = true`), add storage policies (`(storage.foldername(name))[1] = auth.uid()::text` for INSERT/UPDATE/DELETE; SELECT open).
- Add `notification_preferences` schema: `{ daily_streak: bool, weekly_recap: bool, browser_push: bool, email_reminders: bool, marketing: bool }`.
- New edge function `delete-account`: uses service role to delete the user; cascades clear via existing FKs/policies.
- Optional new edge function `daily-reminder-cron` (Phase 3 email reminders) — only if you want email nudges.
- No breaking change to the payments flow, no DB destructive changes.

---

## What I recommend we ship first

**Batch A (Phase 1 + Phase 2):** brand polish + cloud-synced profile + avatar upload + sign-out/change-password/delete-account. This is the most visible and most-requested set, and it unblocks "the app feels real" for end users.

**Batch B (Phase 3):** real notifications.

**Batch C (Phase 4):** subscription card + security finish + final polish.

Reply "approve Batch A" (or whatever subset you want) and I'll switch into build mode and execute.


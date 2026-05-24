## Audit Findings

The new luxury sage theme (Cormorant Garamond + Karla, sage/forest/gold/cream tokens) is fully defined in `index.css` and `tailwind.config.ts`. However, an audit shows the theme is not yet applied consistently across the app:

**Old fonts still loaded/referenced**
- `index.html` still preloads and links **Plus Jakarta Sans, Inter, Fraunces** alongside Cormorant + Karla.
- Several components/pages still use the implicit Tailwind sans default (Plus Jakarta from old config) instead of `font-body` / `font-display`.

**Old raw Tailwind colors still in use — ~466 occurrences across 84 files**

Worst offenders:
| File | Hits |
|---|---|
| `src/pages/SleepStoriesPage.tsx` | 49 |
| `src/pages/SignInPage.tsx` | 32 |
| `src/components/MeditationPlayer.tsx` | 32 |
| `src/components/sos/PanicAttackProtocol.tsx` | 30 |
| `src/components/day/SoundBedDesigner.tsx` | 21 |
| `src/pages/SOSPage.tsx` | 20 |
| `src/pages/PricingPage.tsx` | 16 |
| `src/components/NarrationBar.tsx` | 14 |
| `src/components/landing/WatchDemoModal.tsx` | 13 |
| `src/pages/WalkingMeditationPage.tsx` | 11 |
| …and 74 more files with smaller counts |

These use raw classes like `bg-white`, `text-gray-500`, `bg-slate-900`, `from-blue-500`, `text-emerald-400`, etc. — violating the design system rule "never write custom color classes; always use semantic tokens".

---

## Plan

### Phase 1 — Lock down fonts (1 file)
- `index.html`: remove Plus Jakarta Sans, Inter, and Fraunces from the Google Fonts `<link>` and preloads. Keep only **Cormorant Garamond + Karla**.
- Verify Tailwind `font-sans` default maps to Karla (set in `tailwind.config.ts` extend if missing) so any stray `font-sans` or unstyled text falls back to the new body font.

### Phase 2 — Color token migration (84 files)

Apply a consistent mapping from raw Tailwind colors → semantic sage tokens:

| Old raw class | New semantic token |
|---|---|
| `bg-white`, `bg-gray-50/100` | `bg-card` / `bg-background` |
| `bg-black`, `bg-gray-900/950`, `bg-slate-900` | `bg-forest-deep` / `bg-charcoal` |
| `text-white` (on dark) | `text-cream` / `text-primary-foreground` |
| `text-black`, `text-gray-900` | `text-foreground` / `text-charcoal` |
| `text-gray-400/500/600` | `text-muted-foreground` / `text-charcoal-soft` |
| `border-gray-*`, `border-slate-*` | `border-border` / `border-sage/20` |
| `bg-blue-*`, `bg-indigo-*`, `bg-purple-*`, `bg-emerald-*`, `bg-teal-*` (primary accents) | `bg-sage` / `bg-forest` / `bg-primary` |
| `text-blue-*`, `text-emerald-*`, `text-teal-*` (links/accents) | `text-sage` / `text-primary` |
| `from-blue-* to-purple-*` gradients | `from-sage to-forest` / `from-forest to-forest-deep` |
| `bg-amber-*`, `bg-yellow-*`, `text-amber-*` (premium/gold) | `bg-gold` / `text-gold` / `bg-gold-light` |
| `bg-red-*`, `text-red-*` (errors/SOS) | `bg-destructive` / `text-destructive` |
| `bg-rose-*`, `bg-pink-*` (warm) | `bg-gold` or `bg-accent` depending on context |

Order of execution (highest-impact first):
1. **High-traffic pages** — `SignInPage`, `PricingPage`, `SOSPage`, `SleepStoriesPage`, `WalkingMeditationPage`, `BodyScanPage`, `BreathingPage`, `TimerPage`, `SoundBathPage`, `FocusModePage`, `ProfilePage`, `AboutPage`, `OfflineDownloadsPage`, `PaddleChecklistPage`, `AffirmationPage`, `AssessmentPage`, `MoodTrackerPage`, `OnboardingPage`, `WelcomePage`, `JournalPage`, `GratitudePage`, `FriendsPage`, `RitualsPage`, `DayPage`, `DashboardPage`, `ChallengesPage`, `VideoLibraryPage`, `SleepPage`, `AIRecommendationsPage`, `SoundscapeBuilderPage`.
2. **Player / overlay components** — `MeditationPlayer`, `NarrationBar`, `GlobalMiniPlayer`, `AmbientMusicPlayer`, `SignatureTimer`, `RescuePlayer`, `PanicAttackProtocol`, `AICompanionChat`, `WatchDemoModal`, `PremiumLockModal`, `PremiumGate`, `WinBackModal`, `StreakCelebration`, `WelcomeModal`, `StreakRecoveryModal`, `ChallengeCompleteModal`.
3. **Landing/marketing sections** — `PremiumHero`, `ScienceSection`, `AboutSection`, `CurriculumSection`, `TestimonialsSection`.
4. **Dashboard / day / rituals / challenges widgets** — all remaining `dashboard/`, `day/`, `rituals/`, `challenges/`, `bodyscan/`, `gratitude/`, `mood/`, `sos/`, `walking/`, `timer/`, `ui-premium/`, `profile/`, `WillowLogo`, `AvatarUploader`, `ThemeToggle`.

For each file: also ensure headings use `font-display` and body copy inherits `font-body` (no explicit `font-sans` left over).

### Phase 3 — Verify
- Visual spot-check: SignIn, Pricing, Dashboard, MeditationPlayer, SOS, Sleep Stories in **both light and dark mode** to confirm contrast.
- Re-run the audit ripgrep — target is 0 raw color-class hits outside `src/components/ui/**` (shadcn primitives stay untouched).
- Confirm `font-sans` default = Karla so any missed component still looks correct.

### Scope guardrails
- No business-logic changes. UI/CSS only.
- Do not touch `src/components/ui/**` (shadcn primitives use semantic tokens already).
- Do not touch `supabase/functions/**` (server code only).
- Edge function and `types.ts` matches in the audit are noise (string literals/types), not styling — ignored.

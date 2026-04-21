

## Dashboard & Challenges — Premium Visual Overhaul

A focused upgrade to make these two pages feel like a $14.99/mo wellness app (Calm/Headspace tier), fully branded in the Willow forest-green + gold luxury palette with editorial typography, cinematic motion, and high-craft micro-details.

---

## Dashboard Page

**Cinematic hero (replace current)**
- Time-of-day adaptive gradient overlay (dawn rose → noon emerald → dusk gold → midnight indigo) layered over the hero image
- Animated parallax: image drifts 4–6px on scroll; floating gold particles (canvas, ~12 dots) for "presence"
- New micro-stat ribbon under greeting: today's local weather + sunrise/sunset hint (uses existing `useWeather` hook)
- "Daily Affirmation" replaces hardcoded quote — pulls from a curated 30-line affirmation deck, fades through 3 lines on a 6s loop
- Primary CTA upgraded to a glass-morphism gold button with animated shimmer sweep on hover

**Premium Wellness Ring (replace flat circle)**
- Conic-gradient ring (forest → sage → gold) with animated dash that "breathes" subtly (12s loop, matches inhale/exhale rhythm)
- Center swaps numeric score for a 2-line readout: large score + tier label (Cultivating, Flourishing, Radiant)
- Tap to expand into a 4-axis radar (mind / body / sleep / heart) — uses existing wellnessScore data

**New: "Today's Ritual Triptych"**
- Three editorial cards in a row: Morning Intention · Midday Reset · Evening Reflection
- Each card has its own muted color wash (cream / sage / forest-deep) and a single illustrated icon
- Auto-highlights the card matching current time-of-day with a gold border + soft glow

**New: "Mindful Streak Garden"** (replaces plain streak progress bar)
- Visual: a row of 7 small leaf SVGs that fill from outline → full forest-green as the week progresses
- Past weeks collapse into stacked golden "harvest" leaves below — gamified, satisfying, on-brand
- Replaces the current StreakProgress component for a more sensory feel

**Polished tools grid**
- 8-tile bento grid (2 large featured + 6 standard) instead of uniform 4-col
- Featured tile rotates daily (AI Coach Monday, Body Scan Tuesday, etc.) with a subtle gradient + larger icon
- Hover: tilt-on-mouse-move (3deg max), gold underline draw-in

**Footer ribbon (new)**
- Subtle quote of the week, citation styled like a New Yorker pull-quote (serif, italic, gold em-dash)
- "Shared with care" Willow signature mark

---

## Challenges Page

**New header (editorial, magazine-style)**
- Hero band with layered art: serif display title "Mindfulness Challenges" + thin gold rule + subtitle
- Filter chips: All · Wellness · Emotional · Sleep · Focus · Spiritual (active = forest pill, inactive = outline)
- Sort toggle: Recommended / Duration / Progress
- "Featured this month" callout card (gold-bordered, with completion-rate stat)

**Challenge cards (full redesign)**
- Replace pastel `from-blue-500/20` washes with branded duo-tone gradients (forest/sage, gold/cream, charcoal/sage etc.) — keeps challenges visually distinct *while staying on-brand*
- Each card shows:
  - Large emoji + soft glow halo behind it
  - Title in display serif, subtitle in body
  - Day count rendered as 7/14/21 mini-dot row (filled = completed)
  - Difficulty badge (Beginner / Deepening / Advanced)
  - "X people completing this" social proof line
- Hover: card lifts 4px, gold rule appears on the left edge, "Begin" CTA slides in from right
- Completed challenges get a gold trophy ribbon corner-fold (CSS triangle) + subtle gold border

**Challenge detail view**
- Full-bleed branded gradient header replaces flat color card
- Benefits become icon-tagged pills (heart, brain, moon, leaf icons) instead of plain text
- "Your journey" timeline visualization: vertical path from Day 1 → final, with a moving "you are here" gold dot
- Progress ring at top showing % complete + days remaining

**Day completion screen**
- Replaces current centered card with a focus-mode layout
- Day script appears as a typographic centerpiece (serif, larger leading, drop-cap on first letter)
- "Begin Practice" opens an immersive timer overlay (reuses MeditationPlayer pattern)
- After completion: confetti is out — instead, a leaf-fall animation drops 5–8 small leaves, then a calm "Day complete" toast
- Reflection prompt gets a richer textarea with a soft paper-grain background

**Completion celebration (new)**
- When a challenge hits 100%, a full-screen modal: animated trophy fill, day-by-day highlight reel of reflections, share card export (PNG), badge added to Achievements

---

## Cross-cutting craft details

- **Typography:** Stricter use of font-display (serif) for all H1/H2, tracking-wide for eyebrow labels, body-light for copy
- **Spacing:** 8pt rhythm tightened — current pages mix 5/6/8 paddings; standardize on 6 / 8 / 10
- **Motion:** All entrance animations use the same easing curve `[0.25, 0.1, 0.25, 1]` (currently mixed)
- **Color discipline:** Audit and replace remaining raw Tailwind colors (blue-500, pink-500 etc.) with brand tokens — fixes the off-brand feel of challenge cards specifically
- **Loading states:** Skeleton shimmers in the brand cream tone on first load (currently flashes blank)
- **Accessibility:** Reduce-motion respect on all new animations; aria-labels on the leaf streak garden

---

## Files to add / change

- Edit: `src/pages/DashboardPage.tsx`, `src/pages/ChallengesPage.tsx`, `src/data/challenges.ts` (rebrand color strings)
- Add: `src/components/dashboard/HeroCinema.tsx`, `WellnessRing.tsx`, `RitualTriptych.tsx`, `StreakGarden.tsx`, `BentoTools.tsx`, `QuoteRibbon.tsx`
- Add: `src/components/challenges/ChallengeCard.tsx`, `ChallengeFilters.tsx`, `ChallengeJourneyTimeline.tsx`, `LeafFallAnimation.tsx`, `ChallengeCompleteModal.tsx`
- Add: `src/data/affirmations.ts` (30 curated lines)

---

## Out of scope (flag for later)

- Server-side "X people completing this" stat — needs aggregate query; will use a tasteful placeholder count for now
- Share-card PNG export — can ship in a follow-up
- Real radar chart for wellness — initial version uses 4-axis bars; full radar comes next

Reply **"approve"** to build, or tell me which section to trim/expand first.


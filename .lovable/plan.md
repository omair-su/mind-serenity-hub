## Goal

Fix the broken "Begin Day" navigation, make the mood checker a real interactive ritual (not a static sticker), and visually upgrade the 30-Day page so it matches the ivory + forest + champagne-gold luxury brand used on the Coach page — not a rainbow of pastel cards.

## 1. Fix the 404 — `/app/day/...` does not exist

The router only registers `/day/:dayNum`, but four places link to `/app/day/...`. That is why every "Begin Day 1" button on the dashboard 404s.

Files to fix (change `/app/day/` → `/day/`):

- `src/components/dashboard/HeroCinema.tsx` (line 185 — the dashboard hero "Begin Day" button)
- `src/components/dashboard/WelcomeModal.tsx` (line 162)
- `src/components/dashboard/RitualTriptych.tsx` (line 13)
- `src/pages/DashboardPage.tsx` (line 171)

After these edits, every entry point lands on a real `DayPage`.

## 2. Make the mood checker actually work

Today the "Mood Shift" card (`MoodDeltaChart`) just *displays* `moodBefore` / `moodAfter` from state — there is no UI to set `moodAfter`, so it always shows the default 5 → 7 and "looks like a sticker."

Changes:

- Convert `MoodDeltaChart` into an interactive component:
  - 10 tappable emoji chips for **Before** and **After** rows.
  - Selected chip lifts, glows champagne-gold, and shows the numeric value.
  - When user taps After mood, the arc + delta animate to the new value.
  - Persist via existing `autoSave` flow (already wired to `moodBefore` / `moodAfter`).
- Add a small "Save mood" confirmation toast and an empty-state ("Tap how you felt — before and after today's session").
- Keep the gold arc visualization but redraw it with smooth spring animation on every change.

## 3. Luxury rebrand of the Day page

The page currently mixes 8+ pastel gradients (emerald, teal, violet, purple, sky, cyan, rose, pink, amber, orange, fuchsia…) which is exactly the "cheap, many colors" look the user objected to on Coach. Align with the Coach page palette: **ivory/cream surfaces, deep forest accents, champagne-gold highlights, charcoal text** — sparingly.

Visual rules applied across `DayPage.tsx`:

- Replace all `from-emerald/teal/violet/purple/sky/cyan/rose/pink/fuchsia/amber/orange` gradient cards with two reusable surface styles:
  - **Cream card**: `bg-[hsl(var(--cream))]/60` + `border-[hsl(var(--border))]` + `shadow-soft` for content cards (Today's Focus, Reflection, Tracker, Week Overview).
  - **Forest accent card**: subtle `bg-gradient-to-br from-[hsl(var(--forest-deep))]/5 to-[hsl(var(--cream))]/40` + `border-[hsl(var(--gold))]/20` for the hero/wisdom/coach-note cards.
- Use **champagne gold** only for: section eyebrows ("Today's Focus"), the active progress dot, primary CTAs (Begin Timer, Save), and the mood arc.
- Use **deep forest** only for: the Coach's Note accent, completed-day dots, success states.
- Use **charcoal** for all body text. Drop colored body text like `text-violet-600`, `text-emerald-600`, `text-rose-500`.
- Replace ad-hoc emoji decorations with a single subtle gold corner glow per card (matches Coach hero).
- Tighten the **30-day progress strip**: refine to gold ring on current, forest fill on done, soft cream-dark on locked, `Lock` icon in muted tone — no rainbow.
- Replace the violet "Daily Wisdom" card with a cream-and-gold quote card using `Lightbulb` in gold.
- Reflow the **timer** card (`HeartCoherenceRing`): cream surface, gold ring, charcoal numerals, gold CTA — it currently sits inside a rose/pink/fuchsia gradient.
- Keep the existing typography (`font-display` for headings, `font-body` for body) — this already matches Coach.
- Premium-locked day buttons: subtle `Crown` in gold + cream-dark background, no purple.

Spacing & rhythm:

- Standardize card padding to `p-6 md:p-8`, radius to `rounded-2xl`, vertical gap to `space-y-6`.
- Add a thin gold divider between major sections (`bg-gradient-to-r from-transparent via-gold/30 to-transparent`).

## 4. Premium polish (functional)

- Sticky bottom action bar on mobile with two buttons: **Begin Practice** (gold) and **Save Reflection** (outline).
- Floating "Day X / 30" pill at top right that scrolls with progress (uses existing `percentage`).
- After all 4 checklist items are checked, fire a one-shot champagne-gold confetti pulse (CSS only, no new deps) and surface the existing "Day Complete" message with a clear "Continue to Day N+1 →" gold button.

## 5. Out of scope

- No backend / migration changes.
- No new dependencies.
- AI Daily Insight, IntentionRitual, PracticeMode, SoundBedDesigner internals stay as-is — only their wrapper/card styling is harmonized.

## Files touched

- `src/App.tsx` — no change (route is correct as `/day/:dayNum`)
- `src/components/dashboard/HeroCinema.tsx` — link fix
- `src/components/dashboard/WelcomeModal.tsx` — link fix
- `src/components/dashboard/RitualTriptych.tsx` — link fix
- `src/pages/DashboardPage.tsx` — link fix
- `src/components/day/MoodDeltaChart.tsx` — make interactive (accept `onChange` props)
- `src/pages/DayPage.tsx` — wire interactive mood, full visual rebrand, sticky action bar, completion celebration

## Outcome

- "Begin Day" from the dashboard, welcome modal, and triptych all open the real Day page.
- Mood checker is a tactile before/after ritual that saves automatically.
- The Day page reads like a calm luxury journal: ivory + forest + gold, not a candy palette — matching the Coach page brand the user already approved.
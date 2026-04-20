

# Walking Meditation — Premium Upgrade Plan

Goal: Transform the Walking page from a static text-based timer into a **luxury, sensory-rich, GPS-aware mindful movement experience** rivaling Calm Daily Move and Headspace Walking.

---

## 1. Hero & Visual Identity

- **New high-quality hero image** — sourced from Unsplash (sunlit forest path with golden light shafts, 1600w optimized). Replace the local `walking-hero.jpg` asset with a fresh CDN URL.
- **Parallax scroll** on the hero with subtle gold blur orbs floating across.
- **Mood-aware tint** — hero gradient subtly shifts color based on the selected environment (forest = green, mountain = slate, beach = gold-coral, garden = warm amber).
- **Today's weather widget** in the hero corner — uses browser geolocation + Open-Meteo API (no key) to show "Perfect for an outdoor walk · 18°C · clear skies" or suggest indoor mode if raining.

## 2. Four Premium Environments with Real Imagery & Ambient Beds

Each environment becomes a **full sensory scene**, not just an icon card:
- **Forest Path** — birdsong + leaves rustling ambient bed, deep-green hero
- **Mountain Trail** — wind + distant eagle calls, slate-blue hero
- **Ocean Shore** — waves + seagulls, gold-coral hero
- **Zen Garden** — bamboo wind chimes + raked gravel, warm amber hero

Each tile shows a real photo background, name, ambient track preview, and a "Stop Sound" button (following the new audio control standard).

## 3. ElevenLabs Narrated Guidance (Replace Text Steps)

- Wire `useTextToSpeech` to narrate each technique step — Sarah voice for gentle techniques, George for grounding ones.
- **NarrationBar** at the bottom of the active session with play/pause/skip and a clear **Stop** button.
- Steps advance automatically when narration ends (instead of arbitrary 20s timer).

## 4. Real Step Counting (Not Random)

Replace the fake `Math.random()` step generator with a **real pedometer** using `DeviceMotionEvent` accelerometer:
- Requests motion permission on iOS (Safari) gracefully.
- Falls back to a steady pace estimator (110 steps/min default) for desktop/permission-denied.
- Live BPM cadence indicator: "Your pace: 112 steps/min · ideal walking range".

## 5. Two New Premium Techniques (6 total)

- **Loving-Kindness Walk** (12 min) — radiate metta to passersby with each step
- **Forest Bathing (Shinrin-yoku)** (20 min) — Japanese 5-senses immersion protocol, premium-gated

## 6. Animated Pace Orb & Footstep Visualizer

- A **breathing/pacing orb** (reuse `BreathingOrb`) that pulses at the user's current cadence — visual metronome.
- A subtle **footstep ripple animation** on each detected step (left/right alternating).
- A **distance estimator** ("≈ 0.4 km · 6 minutes of presence").

## 7. AI Walk Reflection (Post-Session)

After completion, the **AI Companion** (reusing `ai-companion-chat` edge function) asks:
- "What did you notice on your walk today?"
- Summarizes into a 2-line reflection saved to `ritual_completions` with type='walk'.

## 8. Luxury Stats & Streak Ring

- Apple-Fitness-style **animated SVG streak ring** around the session count.
- Stats: Total minutes, total steps, longest walk, streak days.
- **Milestone certificates** at 10/50/100 walks (PDF download, premium-gated).

## 9. Cloud Sync & Premium Gates

- Persist every walk to `ritual_completions` (type='walk', technique, duration, steps, environment) — table already exists from previous sprint.
- `PremiumLockModal` on Forest Bathing (20-min) and milestone PDF export.

## 10. Audio Hygiene (Following New Standard)

- Ambient bed defaults to `"silence"` — only plays when user taps "Play Sound".
- All audio (ambient + narration) hard-stops on session end, reset, and route unmount.
- Clear "Stop Sound" button visible whenever any audio is playing.

---

## Technical Section

**New files:**
- `src/components/walking/PaceOrb.tsx` — animated cadence orb
- `src/components/walking/FootstepVisualizer.tsx` — left/right ripple animation
- `src/components/walking/WalkEnvironmentCard.tsx` — image-led environment tile
- `src/components/walking/WalkReflection.tsx` — post-session AI reflection card
- `src/hooks/usePedometer.ts` — DeviceMotion-based step counter with fallback
- `src/hooks/useWeather.ts` — geolocation + Open-Meteo lookup
- `src/data/walkingTechniques.ts` — extracted + extended to 6 techniques

**Edited files:**
- `src/pages/WalkingMeditationPage.tsx` — full rewrite using new components
- Reuse `useAmbientBed`, `useTextToSpeech`, `NarrationBar`, `BreathingOrb`, `cloudSync`, `PremiumLockModal`

**No new edge functions, tables, or migrations required** — everything reuses Sprint 4 infrastructure (`ai-companion-chat`, `ritual_completions`).

**No new API keys** — Open-Meteo is free + keyless.

---

## Suggested execution order

1. New hero image + environment images + parallax tint
2. `usePedometer` + `useWeather` hooks
3. Extract data, add 2 new techniques
4. PaceOrb + FootstepVisualizer components
5. ElevenLabs narration wiring + NarrationBar
6. AI walk reflection on completion
7. Streak ring + milestone certificates
8. Audio hygiene QA on mobile


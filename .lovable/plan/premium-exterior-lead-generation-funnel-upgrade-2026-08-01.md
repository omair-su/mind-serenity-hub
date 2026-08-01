# Premium Exterior + Lead-Generation Funnel Upgrade

Goal: make every public-facing surface (landing, pricing, guides, sign-in) look like a million-dollar AI wellness brand, and restructure the landing page into a conversion funnel that drives free-trial signups and paid subscriptions.

Constraint honored throughout: **no changes to the existing color palette, fonts, or typography scale.** Everything added uses current tokens (forest, sage, gold, cream, charcoal) and existing font families. Nothing existing is removed — sections are upgraded or inserted.

## 1. Real imagery layer

Generate a cohesive set of brand photography (same sage/forest/gold grade as current assets) and place it where the page currently has flat panels:

- Hero secondary visual: a real "practice moment" image behind the 3D orb, softly masked so the orb still reads.
- Feature/pillar cards: 6 square lifestyle images (breathwork, sleep, morning ritual, sound bath, journaling, walking) replacing icon-only cards with image-topped cards.
- "A Day With Willow" timeline: 3 time-of-day images (morning / afternoon / night) as full-bleed row backgrounds.
- Social proof: 3 tasteful member portraits for the testimonial trio.
- Device mockup: an in-app screenshot composited into a phone frame for the "see it in action" band.
- Pricing page: one calm header image band.

All images generated at web sizes, saved to `src/assets`, imported normally, with lazy loading and width/height set to avoid layout shift.

## 2. Motion and visual-graphic system

A small reusable motion kit so animation feels designed, not sprinkled:

- Scroll reveals: staggered fade-up on every section (Framer Motion `whileInView`, once, respecting reduced motion).
- Parallax: slow translate on hero image, timeline backgrounds, and CTA band.
- Number counters: animated count-up for stats (members, sessions, minutes, rating).
- Marquee trust strip: slow infinite logo/press-style ribbon under the hero.
- Gold filigree + grain overlays: SVG hairline corner accents and a subtle noise texture on dark bands for a printed-luxury feel.
- Card interaction: gentle lift, gold border glow, and image zoom on hover; tap feedback on mobile.
- Animated section dividers: thin gold gradient rules that draw in on scroll.
- Sticky mobile CTA bar that appears after the hero and hides at the footer.

All motion gated behind `prefers-reduced-motion`.

## 3. Landing page rebuilt as a funnel

Keeping all current sections, reordered and augmented into a persuasion sequence:

1. **Hero** — single dominant promise, one primary CTA (Start Free Trial), one secondary (See Plans), trust microcopy, rating.
2. **Trust strip** — animated counters + marquee (new).
3. **Problem** — "the noise you live in" empathy band with imagery (new).
4. **Solution / pillars** — existing feature grid upgraded with imagery.
5. **Product proof** — device mockup + short looping in-app preview and a 3-step "how it works" (new).
6. **A Day With Willow** — existing, now image-backed.
7. **Outcomes / Why Willow / Crafted By** — existing, upgraded cards + reveals.
8. **Science & credibility** — citation-backed stat cards (new band, reusing existing science copy).
9. **Testimonials** — existing trio, now with portraits and a results-focused headline.
10. **Pricing** — existing plan cards with a clearer "most popular" treatment, annual savings badge, and value stack.
11. **Risk reversal** — guarantee seal, cancel-anytime, security/privacy line (new, reuses `GuaranteeSeal`).
12. **FAQ** — existing, objection-handling order.
13. **Final CTA** — full-bleed cinematic close with single CTA.
14. **Footer** — existing, tidied.

## 4. Conversion mechanics

- Every CTA routes to the same tracked start-trial path; consistent label wording sitewide.
- Exit-intent / scroll-depth offer modal on desktop reusing the existing modal styling (one-time, dismissible).
- Analytics events on hero CTA, pricing view, plan select, and FAQ open, using the existing `analytics.ts` north-star events.
- Above-the-fold clarity pass: promise, proof, price transparency visible without deep scrolling on mobile (360px checked).

## 5. Consistency across the rest of the exterior

Apply the same hero treatment, reveal motion, and imagery language to: Pricing, About, Science, Resources, Help, the two guide pages, and Sign-in — so the funnel never breaks visual character.

## Technical notes

- New shared components: `RevealSection`, `CountUp`, `Marquee`, `ImageCard`, `DeviceMockup`, `StickyMobileCTA`, `GrainOverlay` under `src/components/landing/` and `src/components/ui-premium/`.
- Landing page split into section components to keep files small; `LandingPage.tsx` becomes composition only.
- Images generated via the image tool into `src/assets`, referenced by ES import; heavy sections lazy-loaded with `Suspense` as today.
- Performance guardrails: hero image preloaded, everything else lazy; target no regression in LCP; no new heavy 3D beyond the existing orb.

## Suggested sequencing

- Pass 1: motion kit + reveals + imagery for hero, pillars, testimonials.
- Pass 2: new funnel bands (trust strip, problem, product proof, science, risk reversal) + sticky mobile CTA.
- Pass 3: pricing clarity, exit-intent offer, analytics wiring, and consistency pass on the other exterior pages.



## Goal

Make the landing page CTAs match real prices, send hero/free buttons through Sign In (not straight into the app — that would give your paid product away), confirm that all paid plans correctly open the live Paddle checkout, and verify the cancellation flow on Profile works end-to-end.

## What's currently wrong

1. **Hero "Start Now — $97"** — wrong price (you sell $9.99/$59.99/$199, not $97), and the small print says "$297 / $97 one-time / lifetime access" which doesn't match any real product.
2. **Hero button links to `/app`** — anyone clicking it skips Sign In and Paddle entirely. Right now this is a security hole that gives away your full premium app.
3. **Final "Start Your Free Trial" CTA** — links to `/pricing` (fine), but you asked for it to go to Sign In then app on the Free tier.
4. **Test mode banner** — still shows in production preview because the live token hasn't been switched. Paddle approved your account so we can flip to live.
5. **Profile "Manage Subscription" button** — needs an end-to-end check that the Paddle customer portal opens correctly for live subscribers.

## Changes

### 1. Landing page — `src/pages/LandingPage.tsx`

**Hero section:**
- Replace `Start Now — $97` with **`Start 7-day Free Trial`** (no price in the button — cleanest, highest CTR).
- Change link target from `/app` → `/sign-in?redirect=/app`. New users sign up, existing users sign in, then land in the app on the Free tier. Plus features stay locked behind Paddle.
- Remove the bogus `$297 / $97 / one-time payment / lifetime access` line under the buttons. Replace with: **"7-day free trial · Cancel anytime · No card charged today"**.
- Remove the "Limited Time — Save 67%" pill (it referenced the fake $97 anchor).

**Final CTA section** ("Find your calm. Start today."):
- Change `Start Your Free Trial` link from `/pricing` → `/sign-in?redirect=/app`. Same flow — sign in, land in app on Free tier, upgrade prompts route to Paddle.

**Nav bar Sign In / Start Free Trial buttons:** keep `/sign-in` and `/pricing` respectively (already correct).

**Pricing cards on landing page (3-tier section):**
- "Free" → already links to `/sign-in` ✓
- "Plus Yearly" `Start 7-day free trial` → currently links to `/pricing`. Change to `/pricing#plus` so it scrolls to the cards (and from there opens the live Paddle overlay).
- "Plus Monthly" → same as above.
- "Lifetime $199" `Claim Lifetime Access` → same.

### 2. Sign-in redirect — `src/pages/SignInPage.tsx`

Verify it reads the `?redirect=` query parameter and routes there after successful sign-in. If it doesn't already, add that. (Read-only mode — will confirm in build.)

### 3. Switch to live Paddle — `.env.development` + `.env.production`

- `.env.production` already has the live token (`live_223c3b...`). Production builds (your published `willowvibes.com`) will automatically use live Paddle. ✓ No change needed.
- `.env.development` keeps the test token so the **Lovable preview stays in test mode** — this is intentional and recommended. You don't want every preview click to charge real cards.
- The orange "Test mode" banner only shows in preview because of this. Your published site at willowvibes.com will not show it and will use live checkout.

### 4. Pricing page — `src/pages/PricingPage.tsx`

No code changes needed. The three buttons (`willow_plus_monthly`, `willow_plus_yearly`, `willow_lifetime_onetime`) already call `usePaddleCheckout`, which auto-detects environment from the token prefix. Live token → live Paddle overlay → real cards.

### 5. Profile cancellation — verify only

- `ProfilePage.tsx` already invokes the `paddle-customer-portal` edge function and opens the returned URL in a new tab. After deploying, we'll click it once with a test subscriber to confirm Paddle's portal loads and Cancel works. Webhook (`subscription.canceled`) already updates the `subscriptions` table → trigger flips `profiles.is_premium` to false.

### 6. End-to-end QA after build

In the preview (test mode):
- Click hero `Start 7-day Free Trial` → lands on Sign In with `?redirect=/app` → sign up → app dashboard loads on Free tier.
- Click `/pricing` → Plus Monthly button → Paddle overlay opens showing **$9.99 · 7-day trial** (matches your screenshot 3).
- Click Plus Yearly → Paddle overlay opens showing **$59.99/yr** (matches your screenshot 4).
- Click Lifetime → Paddle overlay opens showing **$199 one-time**.
- After checkout with test card `4242 4242 4242 4242`, verify `profiles.is_premium = true` via DB and that Plus features unlock.
- On Profile, click "Manage Subscription" → Paddle portal opens in new tab → Cancel → webhook fires → `is_premium` flips to false at period end.
- Check mobile (viewport ≤506px) for all CTAs.

## What you should NOT confuse

- The hero button **must not** bypass auth. If `/app` is reachable without sign-in, anyone can use your full premium app for free and Paddle becomes pointless. The flow is: **Landing → Sign In → App (Free tier) → Plus features prompt Paddle checkout**.
- The "Test mode" banner staying in the Lovable preview is correct and expected. It will not appear on your published site `willowvibes.com`.
- The live Paddle flow only activates on the published domain. To verify live checkout end-to-end with a real card, you'll need to publish first and test on willowvibes.com.

## Files touched

- `src/pages/LandingPage.tsx` — fix hero CTA text, link target, remove fake pricing copy, update final CTA link
- `src/pages/SignInPage.tsx` — confirm/add `?redirect=` query handling

No DB migrations, no edge function changes, no env changes.


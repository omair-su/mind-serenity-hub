// North-star event instrumentation.
// Lightweight client-side tracker. Mirrors to console in dev, fires a window
// event for any future analytics integration (PostHog, GA, Segment, etc.),
// and dedupes one-shot lifecycle events via localStorage.
//
// The 6 north-star events for Willow Vibes retention:
//   - signup                 (first time the user authenticates / creates account)
//   - onboarding_complete    (finished the onboarding flow)
//   - first_session          (completed their first practice / day)
//   - day3_retention         (returned to the app 3+ days after first visit)
//   - premium_view           (viewed the Pricing / Premium gate)
//   - premium_purchase       (paid subscription or lifetime activated)

export type NorthStarEvent =
  | "signup"
  | "onboarding_complete"
  | "first_session"
  | "day3_retention"
  | "premium_view"
  | "premium_purchase";

const FIRED_KEY = "wv-ns-events-fired";
const FIRST_VISIT_KEY = "wv-first-visit-at";

function readFired(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(FIRED_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeFired(map: Record<string, string>) {
  try { localStorage.setItem(FIRED_KEY, JSON.stringify(map)); } catch {}
}

/**
 * Fire a north-star event. By default each event only fires once per device.
 * Set `oncePerDevice: false` for repeatable events (e.g. premium_view).
 */
export function trackNorthStar(
  event: NorthStarEvent,
  props: Record<string, unknown> = {},
  opts: { oncePerDevice?: boolean } = {},
) {
  const once = opts.oncePerDevice ?? event !== "premium_view";
  const fired = readFired();
  if (once && fired[event]) return;

  const payload = { event, ts: new Date().toISOString(), ...props };
  if (import.meta.env.DEV) console.log("[north-star]", payload);
  try {
    window.dispatchEvent(new CustomEvent("wv-analytics", { detail: { type: event, ...payload } }));
  } catch {}

  if (once) {
    fired[event] = payload.ts as string;
    writeFired(fired);
  }
}

/** Stamp the user's first-visit date and check if they qualify for day3 retention today. */
export function checkDay3Retention() {
  try {
    const stamped = localStorage.getItem(FIRST_VISIT_KEY);
    if (!stamped) {
      localStorage.setItem(FIRST_VISIT_KEY, new Date().toISOString());
      return;
    }
    const ageMs = Date.now() - new Date(stamped).getTime();
    if (ageMs >= 3 * 24 * 60 * 60 * 1000) {
      trackNorthStar("day3_retention", { firstVisit: stamped });
    }
  } catch {}
}

export function hasFired(event: NorthStarEvent): boolean {
  return !!readFired()[event];
}

// Referral attribution: capture ?ref=<inviterUserId> on sign-up and link the
// new user to the inviter via the friendships table.
import { supabase } from "@/integrations/supabase/client";

const PENDING_KEY = "willow:pending-referral";
const APPLIED_KEY = "willow:referral-applied";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Read ?ref= from the current URL and stash it for later. Safe to call on every page load. */
export function captureReferralFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref && UUID_RE.test(ref) && !localStorage.getItem(APPLIED_KEY)) {
      localStorage.setItem(PENDING_KEY, ref);
    }
  } catch {
    /* ignore */
  }
}

/** After successful sign-up + session, attach the new user to the inviter. */
export async function applyPendingReferral(currentUserId: string | undefined) {
  if (!currentUserId) return;
  try {
    const ref = localStorage.getItem(PENDING_KEY);
    if (!ref || !UUID_RE.test(ref) || ref === currentUserId) return;
    const { error } = await supabase.rpc("accept_referral", { _inviter: ref });
    if (!error) {
      localStorage.setItem(APPLIED_KEY, "1");
      localStorage.removeItem(PENDING_KEY);
    }
  } catch {
    /* non-fatal */
  }
}

/** Build a shareable invite URL for the given user. */
export function buildReferralUrl(userId: string): string {
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "https://willowvibes.com";
  return `${origin}/sign-in?ref=${userId}`;
}
